const { Groq } = require("groq-sdk");
const { supabaseAdmin } = require("../config/supabase");
const { decrypt } = require("../utils/encryption");
const {
  findCachedQuestion,
  incrementUsage,
  recordAttempt,
  saveQuestion,
} = require("../services/questionCacheService");

// Read model from environment, fallback to a safe default
const MODEL = process.env.GROQ_MODEL || "qwen/qwen3.8-27b";

const SYSTEM_PROMPTS = {
  problem: `You are an expert coding problem generator. Generate a unique coding problem suitable for beginners to intermediate programmers.
Return JSON with: title, difficulty (easy/medium/hard), description, constraints (array), examples (array of {input, output, explanation?}),
and testCases (array of {input, expected}).

IMPORTANT:
- For each test case, the 'input' field MUST be a string that a program can read from stdin.
- If the program reads an integer n and then n numbers, format as "n\\nnum1 num2 ..." (or space-separated).
- Do not use comma-separated lists unless the problem explicitly expects that.
- The expected output should be a string representation of the correct result.
- The problem must be solvable in Python, Java, C, and C++.
- Include EXACTLY 8 test cases. Cover basic cases, edge cases, larger inputs, and zero/empty-style cases where the problem allows them.

Make the problem interesting but not overly complex.`,

  hint: `You are an AI coding tutor. Provide a helpful hint for the given problem and code. The hint should guide the student without giving away the full solution. Be encouraging and specific. Keep it under 3 sentences.`,

  chat: `You are an AI coding teacher. Help the student understand programming concepts, debug their code, and think through problems. Be friendly, clear, and educational. Use examples when helpful. Keep responses concise but thorough.`,

  correct: `You are an AI code reviewer. Analyze the given code and query. Identify any issues, bugs, or improvements. Provide constructive feedback. If there's a specific question, answer it directly.`,
};

async function resolveGroqKey(userId) {
  if (userId && supabaseAdmin) {
    const { data: profile, error } = await supabaseAdmin
      .from("profiles")
      .select("use_own_key, groq_api_key_encrypted")
      .eq("id", userId)
      .single();

    if (!error && profile?.use_own_key && profile?.groq_api_key_encrypted) {
      try {
        return decrypt(profile.groq_api_key_encrypted);
      } catch (err) {
        console.warn("Unable to decrypt user Groq key; falling back to default key:", err.message);
      }
    }
  }

  return process.env.GROQ_API_KEY;
}

async function createGroqForUser(userId) {
  const apiKey = await resolveGroqKey(userId);
  if (!apiKey) throw new Error("Groq API key is not configured");
  return new Groq({ apiKey });
}

function normalizeDifficulty(value) {
  const difficulty = String(value || "easy").toLowerCase().trim();
  return ["easy", "medium", "hard"].includes(difficulty) ? difficulty : "easy";
}

function normalizeProblem(problem, requestedDifficulty) {
  if (!problem.title) problem.title = "Untitled Problem";
  problem.difficulty = normalizeDifficulty(problem.difficulty || requestedDifficulty);
  if (!problem.description) problem.description = "Solve the problem.";
  if (!Array.isArray(problem.constraints)) problem.constraints = [];
  if (!Array.isArray(problem.examples)) problem.examples = [];
  if (!Array.isArray(problem.testCases)) problem.testCases = [];

  while (problem.testCases.length < 8) {
    const last = problem.testCases[problem.testCases.length - 1] || {
      input: "0",
      expected: "0",
    };
    problem.testCases.push({ input: last.input, expected: last.expected });
  }
  problem.testCases = problem.testCases.slice(0, 8);
  return problem;
}

async function generateProblem(req, res) {
  try {
    const { topic } = req.body;
    const difficulty = normalizeDifficulty(req.body.difficulty);
    let cacheAvailable = true;
    let cached = null;

    try {
      cached = await findCachedQuestion(difficulty, topic, req.user.id);
    } catch (cacheError) {
      cacheAvailable = false;
      console.warn("Question cache lookup skipped:", cacheError.message);
    }

    if (cached) {
      try {
        await incrementUsage(cached.id);
        await recordAttempt(req.user.id, cached.id);
      } catch (cacheError) {
        console.warn("Question cache hit bookkeeping skipped:", cacheError.message);
      }
      return res.json({ success: true, problem: cached, source: "cache" });
    }

    const groq = await createGroqForUser(req.user.id);
    let userPrompt = `Generate a ${difficulty} coding problem.`;
    if (topic) userPrompt += ` Topic: ${topic}.`;
    userPrompt += ` Return ONLY valid JSON.`;

    const response = await groq.chat.completions.create({
      model: MODEL,
      messages: [
        { role: "system", content: SYSTEM_PROMPTS.problem },
        { role: "user", content: userPrompt },
      ],
      temperature: 0.7,
      max_tokens: 2000,
      response_format: { type: "json_object" },
    });

    const content = response.choices[0].message.content;
    let problem;
    try {
      problem = JSON.parse(content);
    } catch (parseErr) {
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) problem = JSON.parse(jsonMatch[0]);
      else throw new Error("Failed to parse problem JSON");
    }

    problem = normalizeProblem(problem, difficulty);
    if (!cacheAvailable) {
      return res.json({ success: true, problem, source: "generated_no_cache" });
    }

    let savedProblem = null;
    try {
      savedProblem = await saveQuestion(problem, difficulty, topic);
      await recordAttempt(req.user.id, savedProblem.id);
    } catch (cacheError) {
      console.warn("Question cache save skipped:", cacheError.message);
      return res.json({ success: true, problem, source: "generated_no_cache" });
    }

    return res.json({ success: true, problem: savedProblem, source: "generated" });
  } catch (error) {
    console.error("Problem generation error:", error);
    return res.status(500).json({
      success: false,
      error: error.message || "Failed to generate problem",
    });
  }
}

async function getHint(req, res) {
  try {
    const groq = await createGroqForUser(req.user.id);
    const { problem, code, question } = req.body;
    let userPrompt = `Problem: ${problem?.title || "Unknown"}\nDescription: ${problem?.description || ""}\n`;
    if (code) userPrompt += `\nStudent's code:\n\`\`\`\n${code}\n\`\`\`\n`;
    if (question) userPrompt += `\nQuestion: ${question}`;
    else userPrompt += `\nProvide a helpful hint for solving this problem.`;

    const response = await groq.chat.completions.create({
      model: MODEL,
      messages: [
        { role: "system", content: SYSTEM_PROMPTS.hint },
        { role: "user", content: userPrompt },
      ],
      temperature: 0.6,
      max_tokens: 300,
    });

    return res.json({
      success: true,
      hint: response.choices[0].message.content,
    });
  } catch (error) {
    console.error("Hint error:", error);
    return res.status(500).json({
      success: false,
      error: error.message || "Failed to generate hint",
    });
  }
}

/**
 * Classifies if a message is programming-related, a greeting, or a learning/teaching request.
 * Returns true if coding-related, educational intent, or a standard greeting/polite prompt.
 * Returns false ONLY for clearly off-topic content (e.g. politics, sports, cooking, geography).
 */
async function isCodingRelated(groq, message) {
  if (!message) return false;
  const lowerMsg = message.trim().toLowerCase();

  // 0. @tag commands — always allowed (these come from our own quick-action buttons)
  if (lowerMsg.startsWith('@')) return true;

  // 1. Local check: Greetings, politeness, and simple yes/no
  const commonGreetings = [
    "hi", "hello", "hey", "good morning", "good afternoon", "good evening",
    "thanks", "thank you", "help", "yes", "no", "ok", "okay", "bye", "goodbye"
  ];
  const cleanMsg = lowerMsg.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?]/g, "").trim();
  if (commonGreetings.includes(cleanMsg)) return true;

  // 2. Local check: Problem-solving / teaching / educational intent
  //    These are the phrases that were getting wrongly blocked before.
  const educationalPhrases = [
    "how to solve", "how do i solve", "how can i solve", "solve this",
    "what is the approach", "what approach", "best approach", "which approach",
    "hint", "give me a hint", "give hint",
    "explain", "explain this", "step by step", "walk me through",
    "what is the solution", "show solution", "show me the solution", "solution for",
    "how to approach", "how should i approach", "approach for",
    "what algorithm", "which algorithm", "algorithm for",
    "what logic", "logic for", "logic behind",
    "teach me", "can you teach", "help me understand", "help me with",
    "what does this mean", "what does this do",
    "why is my code", "why does my code", "my code", "my solution",
    "new problem", "generate problem", "next problem", "another problem",
    "try again", "try this", "test case", "edge case",
    "time complexity", "space complexity", "big o", "complexity",
    "optimize", "optimise", "optimization", "optimisation",
    "brute force", "dynamic programming", "dp approach", "greedy", "divide and conquer",
    "two pointer", "sliding window", "binary search", "recursion", "backtracking",
    "what is wrong", "whats wrong", "what went wrong", "fix my", "fix the",
    "debug", "error in", "output is wrong", "wrong output", "wrong answer",
    "can you help", "please help", "i need help", "i am stuck", "i'm stuck", "stuck on",
    "how to start", "where to start", "how to begin"
  ];
  if (educationalPhrases.some(phrase => lowerMsg.includes(phrase))) return true;

  // 3. Local check: Coding symbols/syntax & keywords
  const codingKeywords = [
    "function", "class", "def ", "public static", "import ", "include ", "cout ", "printf", "console.log",
    "var ", "let ", "const ", "html", "css", "sql", "select ", "where ", "java", "python", "javascript", "c++",
    "compiler", "loop", "array", "string", "algorithm", "compile", "syntax", "error", "bug", "debug", "recursion",
    "variable", "pointer", "object", "interface", "struct", "list", "dict", "map", "hash", "set", "binary", "tree", "graph"
  ];
  const hasCodingSymbol = /[{}[\]()=+\-*/<>&|]/.test(message);
  if (codingKeywords.some(keyword => lowerMsg.includes(keyword)) || hasCodingSymbol) return true;

  // 4. AI classification — with an improved prompt that understands educational context
  try {
    const classificationResponse = await groq.chat.completions.create({
      model: MODEL,
      messages: [
        {
          role: "system",
          content: `You are a topic classifier for an AI coding education platform.
The user is a student learning programming. Respond ONLY with 'yes' or 'no'.

Answer 'yes' if the message is about:
- Coding, programming, algorithms, data structures, software engineering
- Asking how to solve a problem, get a hint, understand an approach, or learn a concept
- Asking for explanations of code, logic, or programming topics
- General educational questions about CS / computer science
- Greetings, thanks, or polite conversation
- Questions about the current problem they are solving

Answer 'no' ONLY if the message is CLEARLY about unrelated topics like:
- Politics, sports, cooking, geography, history, entertainment, celebrities
- Personal advice, medical questions, financial advice

When in doubt, answer 'yes'. A student asking "how to solve this" or "what is the approach" is ALWAYS 'yes'.`
        },
        { role: "user", content: message }
      ],
      temperature: 0.0,
      max_tokens: 5,
    });
    const result = classificationResponse.choices[0].message.content.trim().toLowerCase();
    return result.includes("yes");
  } catch (err) {
    console.warn("Classification failed, retrying:", err);
    try {
      const classificationResponse = await groq.chat.completions.create({
        model: MODEL,
        messages: [
          {
            role: "system",
            content: `You are a topic classifier for an AI coding education platform. 
The user is a student learning programming. Respond ONLY with 'yes' or 'no'.

Answer 'yes' if the message is about:
- Coding, programming, algorithms, data structures, software engineering
- Asking how to solve a problem, get a hint, understand an approach, or learn a concept
- Asking for explanations of code, logic, or programming topics
- General educational questions about CS / computer science
- Greetings, thanks, or polite conversation
- Questions about the current problem they are solving

Answer 'no' ONLY if the message is CLEARLY about unrelated topics like:
- Politics, sports, cooking, geography, history, entertainment, celebrities
- Personal advice, medical questions, financial advice

When in doubt, answer 'yes'.`
          },
          { role: "user", content: message }
        ],
        temperature: 0.0,
        max_tokens: 5,
      });
      const result = classificationResponse.choices[0].message.content.trim().toLowerCase();
      return result.includes("yes");
    } catch (fallbackErr) {
      console.error("Classification completely failed, defaulting to true:", fallbackErr);
      return true; // Don't block user if classification calls fail
    }
  }
}

async function chat(req, res) {
  try {
    const groq = await createGroqForUser(req.user.id);
    const { message, context, history } = req.body;
    if (!message) {
      return res.status(400).json({
        success: false,
        error: "Message is required",
      });
    }

    // Resolve @tag commands into full prompts before guardrail check
    let resolvedMessage = message;
    const atTagMap = {
      '@solve':       'Provide the full solution to this problem with explanation.',
      '@hint':        'Give me a helpful hint for this problem without revealing the full solution.',
      '@approach':    'What is the best approach/algorithm to solve this problem? Explain the strategy.',
      '@try':         'Let me try this problem — give me a starting point or first step.',
      '@explain':     'Explain this problem step by step so I can understand it clearly.',
      '@new':         'Give me a new coding problem to solve.',
      '@complexity':  'What is the time and space complexity of the optimal solution for this problem?',
      '@optimize':    'How can I optimize my current solution for better time or space complexity?',
      '@debug':       'Help me debug my code and identify what is wrong.',
      '@howtosolve':  'Walk me through how to solve this problem from start to finish.',
      '@how to solve':'Walk me through how to solve this problem from start to finish.',
    };
    const lowerMsg = message.trim().toLowerCase();
    for (const [tag, expansion] of Object.entries(atTagMap)) {
      if (lowerMsg.startsWith(tag)) {
        const extra = message.slice(tag.length).trim();
        resolvedMessage = expansion + (extra ? ' ' + extra : '');
        break;
      }
    }

    // Guardrail: check if the query is coding-related
    const isRelated = await isCodingRelated(groq, resolvedMessage);
    if (!isRelated) {
      return res.json({
        success: true,
        response: "I'm HeyMine, your AI coding teacher! 🤖 I can help you with:\n\n" +
          "- 💡 **@hint** — Get a hint for the current problem\n" +
          "- 🔍 **@approach** — Learn the best approach/algorithm\n" +
          "- ✅ **@solve** — See the full solution with explanation\n" +
          "- 🚀 **@try** — Get a starting point to attempt the problem\n" +
          "- 📖 **@explain** — Step-by-step problem explanation\n" +
          "- 🆕 **@new** — Generate a new problem\n\n" +
          "Please ask me a coding or programming related question!",
      });
    }

    // Use the resolved (de-tagged) message for the actual chat
    const finalMessage = resolvedMessage;

    const messages = [{ role: "system", content: SYSTEM_PROMPTS.chat }];
    if (context) {
      messages.push({ role: "system", content: `Context: ${context}` });
    }
    if (history && Array.isArray(history)) {
      const recent = history.slice(-6);
      for (const msg of recent) {
        if (msg.role === "user" || msg.role === "ai") {
          messages.push({
            role: msg.role === "ai" ? "assistant" : "user",
            content: msg.content,
          });
        }
      }
    }
    messages.push({ role: "user", content: finalMessage });

    const response = await groq.chat.completions.create({
      model: MODEL,
      messages,
      temperature: 0.7,
      max_tokens: 800,
    });

    return res.json({
      success: true,
      response: response.choices[0].message.content,
    });
  } catch (error) {
    console.error("Chat error:", error);
    return res.status(500).json({
      success: false,
      error: error.message || "Chat failed",
    });
  }
}

async function correctQuery(req, res) {
  try {
    const groq = await createGroqForUser(req.user.id);
    const { code, query, language } = req.body;
    if (!code) {
      return res.status(400).json({
        success: false,
        error: "Code is required",
      });
    }

    let userPrompt = `Language: ${language || "unknown"}\nCode:\n\`\`\`\n${code}\n\`\`\`\n`;
    if (query) userPrompt += `\nQuestion: ${query}`;
    else userPrompt += `\nReview this code and suggest improvements.`;

    const response = await groq.chat.completions.create({
      model: MODEL,
      messages: [
        { role: "system", content: SYSTEM_PROMPTS.correct },
        { role: "user", content: userPrompt },
      ],
      temperature: 0.5,
      max_tokens: 600,
    });

    return res.json({
      success: true,
      feedback: response.choices[0].message.content,
    });
  } catch (error) {
    console.error("Correction error:", error);
    return res.status(500).json({
      success: false,
      error: error.message || "Failed to analyze code",
    });
  }
}

module.exports = {
  generateProblem,
  getHint,
  chat,
  correctQuery,
};
