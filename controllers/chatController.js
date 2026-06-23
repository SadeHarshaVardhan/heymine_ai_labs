const { Groq } = require("groq-sdk");

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

// Read model from environment, fallback to a safe default
const MODEL = process.env.GROQ_MODEL || "llama-3.3-70b-versatile";

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
- Include AT LEAST 5 test cases (preferably 5-7). Do not generate fewer than 5.

Make the problem interesting but not overly complex.`,

  hint: `You are an AI coding tutor. Provide a helpful hint for the given problem and code. The hint should guide the student without giving away the full solution. Be encouraging and specific. Keep it under 3 sentences.`,

  chat: `You are an AI coding teacher. Help the student understand programming concepts, debug their code, and think through problems. Be friendly, clear, and educational. Use examples when helpful. Keep responses concise but thorough.`,

  correct: `You are an AI code reviewer. Analyze the given code and query. Identify any issues, bugs, or improvements. Provide constructive feedback. If there's a specific question, answer it directly.`,
};

async function generateProblem(req, res) {
  try {
    const { difficulty = "easy", topic } = req.body;
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

    // Ensure required fields
    if (!problem.title) problem.title = "Untitled Problem";
    if (!problem.difficulty) problem.difficulty = difficulty;
    if (!problem.description) problem.description = "Solve the problem.";
    if (!problem.constraints) problem.constraints = [];
    if (!problem.examples) problem.examples = [];
    if (!problem.testCases) problem.testCases = [];

    // Ensure at least 5 test cases; if fewer, pad with duplicates or simple ones
    while (problem.testCases.length < 5) {
      const last = problem.testCases[problem.testCases.length - 1] || {
        input: "0",
        expected: "0",
      };
      problem.testCases.push({
        input: last.input,
        expected: last.expected,
      });
    }

    return res.json({ success: true, problem });
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

async function chat(req, res) {
  try {
    const { message, context, history } = req.body;
    if (!message) {
      return res.status(400).json({
        success: false,
        error: "Message is required",
      });
    }

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
    messages.push({ role: "user", content: message });

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
