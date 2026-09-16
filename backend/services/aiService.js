/**
 * services/aiService.js
 * Centralized AIService for Groq AI interactions.
 * 
 * Features:
 * - Single GROQ_MODEL configuration.
 * - Supports platform API key with user API key fallback (encrypted in Supabase).
 * - Automatic retries with exponential backoff for transient failures.
 * - Configurable request timeout handling.
 * - Structured logging of AI token usage.
 */

const { Groq } = require("groq-sdk");
const { supabaseAdmin } = require("../config/supabase");
const { decrypt } = require("../utils/encryption");

const MODEL = process.env.GROQ_MODEL || "qwen/qwen3.8-27b";
const MAX_RETRIES = 3;
const DEFAULT_TIMEOUT_MS = 30000; // 30s timeout

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

  mentor: `You are HeyMine AI Mentor — an expert, encouraging programming tutor for students learning to code.
After a student submits their code, analyze it and provide structured feedback.

Always respond in this exact JSON format:
{
  "verdict_comment": "One encouraging sentence about their result.",
  "mistakes": "If wrong answer: brief explanation of what's likely wrong. If accepted: empty string.",
  "code_review": "2-3 sentences reviewing code quality, style, readability.",
  "complexity": { "time": "O(?)", "space": "O(?)" },
  "optimization": "One concrete tip to improve their solution (even if already accepted).",
  "concept": "Key concept or pattern this problem teaches, in 1-2 sentences.",
  "next_mission": "Motivational one-liner about the next mission.",
  "difficulty_feedback": "Was this problem easier or harder than expected? Brief note."
}
Keep each field concise. Be warm, educational, and specific. Never be harsh.`
};

/**
 * Resolve Groq API key: User's encrypted key first if enabled, else platform GROQ_API_KEY.
 */
async function resolveGroqKey(userId) {
  if (userId && supabaseAdmin) {
    try {
      const { data: profile, error } = await supabaseAdmin
        .from("profiles")
        .select("use_own_key, groq_api_key_encrypted")
        .eq("id", userId)
        .maybeSingle();

      if (!error && profile?.use_own_key && profile?.groq_api_key_encrypted) {
        return decrypt(profile.groq_api_key_encrypted);
      }
    } catch (err) {
      console.warn("[AIService] Unable to decrypt user Groq key; using platform key:", err.message);
    }
  }
  return process.env.GROQ_API_KEY;
}

/**
 * Create Groq instance for a specific user or default platform.
 */
async function createGroqClient(userId) {
  const apiKey = await resolveGroqKey(userId);
  if (!apiKey) {
    throw new Error("GROQ_API_KEY is not configured on server or in user settings.");
  }
  return new Groq({ apiKey });
}

/**
 * Log token usage for observability.
 */
function logTokenUsage(action, usage) {
  if (usage) {
    console.log(
      `[AIService Token Log] Action: ${action} | Prompt Tokens: ${usage.prompt_tokens || 0} | Completion Tokens: ${usage.completion_tokens || 0} | Total: ${usage.total_tokens || 0}`
    );
  }
}

/**
 * Helper to execute Groq API call with exponential backoff retry and timeout.
 */
async function executeWithRetry(actionName, apiCallFn, retries = MAX_RETRIES) {
  let attempt = 0;
  while (attempt < retries) {
    attempt++;
    try {
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error(`[AIService] Request timed out after ${DEFAULT_TIMEOUT_MS}ms`)), DEFAULT_TIMEOUT_MS)
      );
      const response = await Promise.race([apiCallFn(), timeoutPromise]);
      if (response?.usage) {
        logTokenUsage(actionName, response.usage);
      }
      return response;
    } catch (error) {
      const isRetryable = error.status === 429 || error.status >= 500 || (error.message && error.message.includes("timed out"));
      console.warn(`[AIService] ${actionName} attempt ${attempt}/${retries} failed: ${error.message}`);
      if (attempt >= retries || !isRetryable) {
        throw error;
      }
      const backoffMs = Math.pow(2, attempt) * 500;
      await new Promise((resolve) => setTimeout(resolve, backoffMs));
    }
  }
}

class AIService {
  /**
   * Generate AI Coding Problem
   */
  async generateProblem({ difficulty = "easy", topic, userId }) {
    const groq = await createGroqClient(userId);
    let userPrompt = `Generate a ${difficulty} coding problem.`;
    if (topic) userPrompt += ` Topic: ${topic}.`;
    userPrompt += ` Return ONLY valid JSON.`;

    const response = await executeWithRetry("generateProblem", () =>
      groq.chat.completions.create({
        model: MODEL,
        messages: [
          { role: "system", content: SYSTEM_PROMPTS.problem },
          { role: "user", content: userPrompt },
        ],
        temperature: 0.7,
        max_tokens: 2000,
        response_format: { type: "json_object" },
      })
    );

    const content = response.choices[0].message.content;
    let problem;
    try {
      problem = JSON.parse(content);
    } catch {
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) problem = JSON.parse(jsonMatch[0]);
      else throw new Error("Failed to parse problem JSON from AI response.");
    }
    return problem;
  }

  /**
   * Get Problem Hint
   */
  async getHint({ problem, code, question, userId }) {
    const groq = await createGroqClient(userId);
    let userPrompt = `Problem: ${problem?.title || "Unknown"}\nDescription: ${problem?.description || ""}\n`;
    if (code) userPrompt += `\nStudent's code:\n\`\`\`\n${code}\n\`\`\`\n`;
    if (question) userPrompt += `\nQuestion: ${question}`;
    else userPrompt += `\nProvide a helpful hint for solving this problem.`;

    const response = await executeWithRetry("getHint", () =>
      groq.chat.completions.create({
        model: MODEL,
        messages: [
          { role: "system", content: SYSTEM_PROMPTS.hint },
          { role: "user", content: userPrompt },
        ],
        temperature: 0.6,
        max_tokens: 300,
      })
    );
    return response.choices[0].message.content;
  }

  /**
   * Conversational Tutor Chat
   */
  async chat({ message, context, history, userId }) {
    const groq = await createGroqClient(userId);
    const messages = [{ role: "system", content: SYSTEM_PROMPTS.chat }];
    if (context) {
      messages.push({ role: "system", content: `Context: ${context}` });
    }
    if (history && Array.isArray(history)) {
      const recent = history.slice(-6);
      for (const msg of recent) {
        if (msg.role === "user" || msg.role === "ai" || msg.role === "assistant") {
          messages.push({
            role: msg.role === "ai" ? "assistant" : msg.role,
            content: msg.content,
          });
        }
      }
    }
    messages.push({ role: "user", content: message });

    const response = await executeWithRetry("chat", () =>
      groq.chat.completions.create({
        model: MODEL,
        messages,
        temperature: 0.7,
        max_tokens: 800,
      })
    );
    return response.choices[0].message.content;
  }

  /**
   * Code Review & Query Correction
   */
  async correctCode({ code, query, language, userId }) {
    const groq = await createGroqClient(userId);
    let userPrompt = `Language: ${language || "unknown"}\nCode:\n\`\`\`\n${code}\n\`\`\`\n`;
    if (query) userPrompt += `\nQuestion: ${query}`;
    else userPrompt += `\nReview this code and suggest improvements.`;

    const response = await executeWithRetry("correctCode", () =>
      groq.chat.completions.create({
        model: MODEL,
        messages: [
          { role: "system", content: SYSTEM_PROMPTS.correct },
          { role: "user", content: userPrompt },
        ],
        temperature: 0.5,
        max_tokens: 600,
      })
    );
    return response.choices[0].message.content;
  }

  /**
   * Post-submission AI Mentor Feedback
   */
  async generateMentorFeedback({
    questionId,
    title,
    description,
    language,
    code,
    verdict,
    passedCount,
    totalCount,
    nextMissionTitle,
    userId,
  }) {
    const groq = await createGroqClient(userId);
    const userPrompt = `
Mission: ${questionId || "Custom"} — ${title || "Problem"}
Problem: ${description?.slice(0, 300) || "N/A"}
Language: ${language}
Verdict: ${verdict}
Tests Passed: ${passedCount}/${totalCount}
Next Mission: ${nextMissionTitle || "N/A"}

Student's Code:
\`\`\`${language}
${code?.slice(0, 1500) || "// no code"}
\`\`\`

Provide structured mentor feedback in the required JSON format.`;

    try {
      const response = await executeWithRetry("mentorFeedback", () =>
        groq.chat.completions.create({
          model: MODEL,
          messages: [
            { role: "system", content: SYSTEM_PROMPTS.mentor },
            { role: "user", content: userPrompt },
          ],
          temperature: 0.5,
          max_tokens: 800,
          response_format: { type: "json_object" },
        })
      );
      const content = response.choices[0].message.content;
      return JSON.parse(content);
    } catch (err) {
      console.error("[AIService] Mentor feedback fallback triggered:", err.message);
      return {
        verdict_comment: verdict === "ACCEPTED" ? "🎉 All tests passed! Great work!" : `${passedCount}/${totalCount} tests passed — keep going!`,
        mistakes: verdict !== "ACCEPTED" ? "Check your logic carefully against the example test cases." : "",
        code_review: "Your solution has been evaluated. Keep practicing to improve efficiency.",
        complexity: { time: "O(?)", space: "O(?)" },
        optimization: "Look for opportunities to reduce unnecessary iterations.",
        concept: "Focus on mastering key algorithm patterns.",
        next_mission: "Keep up the momentum! 🚀",
        difficulty_feedback: "Every problem builds strong problem-solving skills.",
      };
    }
  }

  /**
   * Topic Guardrail Classifier
   */
  async isCodingRelated(message, userId) {
    if (!message) return false;
    try {
      const groq = await createGroqClient(userId);
      const response = await executeWithRetry("classifier", () =>
        groq.chat.completions.create({
          model: MODEL,
          messages: [
            {
              role: "system",
              content: `You are a topic classifier for an AI coding education platform.
The user is a student learning programming. Respond ONLY with 'yes' or 'no'.

Answer 'yes' if the message is about coding, algorithms, computer science, problem solving, hints, explanations, greetings, or learning.
Answer 'no' ONLY if the message is clearly about unrelated topics like politics, sports, celebrity gossip, personal advice, etc.`
            },
            { role: "user", content: message }
          ],
          temperature: 0.0,
          max_tokens: 5,
        })
      );
      const resText = response.choices[0].message.content.trim().toLowerCase();
      return resText.includes("yes");
    } catch {
      return true; // Fail safe: default to true so user isn't blocked on classifier error
    }
  }
}

module.exports = new AIService();
