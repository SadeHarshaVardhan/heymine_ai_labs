/**
 * services/aiMentorService.js
 * AI-powered post-submission mentor feedback using Groq.
 * Called after every submission to provide code review, complexity analysis,
 * and personalized learning recommendations.
 */

const { Groq } = require('groq-sdk');

// Lazy-initialized: we only create the client when actually needed.
// This prevents a crash at module load if GROQ_API_KEY is absent.
let _groq = null;
function getGroq() {
  if (!_groq) _groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
  return _groq;
}
const MODEL = process.env.GROQ_MODEL || 'llama-3.3-70b-versatile';

const MENTOR_SYSTEM = `You are HeyMine AI Mentor — an expert, encouraging programming tutor for students learning to code.

After a student submits their code, analyze it and provide structured feedback.

Always respond in this exact JSON format:
{
  "verdict_comment": "One encouraging sentence about their result.",
  "mistakes": "If wrong answer: brief explanation of what's likely wrong. If accepted: empty string.",
  "code_review": "2-3 sentences reviewing code quality, style, readability.",
  "complexity": { "time": "O(?)", "space": "O(?)", "explanation": "brief" },
  "optimization": "One concrete tip to improve their solution (even if already accepted).",
  "concept": "Key concept or pattern this problem teaches, in 1-2 sentences.",
  "next_mission": "Motivational one-liner about the next mission.",
  "difficulty_feedback": "Was this problem easier or harder than expected? Brief note."
}

Keep each field concise. Be warm, educational, and specific. Never be harsh.`;

/**
 * Generate AI mentor feedback after a submission.
 *
 * @param {object} opts
 * @param {string} opts.questionId
 * @param {string} opts.questionTitle
 * @param {string} opts.questionDescription
 * @param {string} opts.language
 * @param {string} opts.code
 * @param {string} opts.verdict         - "ACCEPTED" | "WRONG_ANSWER" | "RUNTIME_ERROR"
 * @param {number} opts.passedCount
 * @param {number} opts.totalCount
 * @param {string} opts.nextMissionTitle - title of next mission
 * @returns {object} AI feedback object
 */
async function generateFeedback({
  questionId,
  questionTitle,
  questionDescription,
  language,
  code,
  verdict,
  passedCount,
  totalCount,
  nextMissionTitle,
}) {
  const userPrompt = `
Mission: ${questionId} — ${questionTitle}
Problem: ${questionDescription?.slice(0, 300) || 'N/A'}
Language: ${language}
Verdict: ${verdict}
Tests Passed: ${passedCount}/${totalCount}
Next Mission: ${nextMissionTitle || 'N/A'}

Student's Code:
\`\`\`${language}
${code?.slice(0, 1500) || '// no code'}
\`\`\`

Provide structured mentor feedback in the required JSON format.`;

  try {
    const response = await getGroq().chat.completions.create({
      model:           MODEL,
      messages: [
        { role: 'system', content: MENTOR_SYSTEM },
        { role: 'user',   content: userPrompt },
      ],
      temperature:     0.5,
      max_tokens:      800,
      response_format: { type: 'json_object' },
    });

    const content = response.choices[0].message.content;
    let feedback;
    try {
      feedback = JSON.parse(content);
    } catch {
      const match = content.match(/\{[\s\S]*\}/);
      feedback = match ? JSON.parse(match[0]) : buildFallback(verdict, passedCount, totalCount);
    }
    return feedback;
  } catch (err) {
    console.error('AI Mentor error:', err.message);
    return buildFallback(verdict, passedCount, totalCount);
  }
}

/** Fallback feedback when Groq is unavailable. */
function buildFallback(verdict, passed, total) {
  return {
    verdict_comment:    verdict === 'ACCEPTED' ? '🎉 All tests passed! Great work!' : `${passed}/${total} tests passed — keep going!`,
    mistakes:           verdict !== 'ACCEPTED' ? 'Check your logic carefully against the examples.' : '',
    code_review:        'Your code runs! Keep practicing to improve clarity and efficiency.',
    complexity:         { time: 'O(?)', space: 'O(?)', explanation: 'Analyze your loops.' },
    optimization:       'Try to minimize nested loops where possible.',
    concept:            'Each problem teaches a fundamental programming pattern.',
    next_mission:       'Next mission unlocked — keep the momentum going! 🚀',
    difficulty_feedback:'Every problem gets easier with practice.',
  };
}

module.exports = { generateFeedback };
