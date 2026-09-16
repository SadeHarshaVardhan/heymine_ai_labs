const aiService = require("../services/aiService");
const {
  findCachedQuestion,
  incrementUsage,
  recordAttempt,
  saveQuestion,
} = require("../services/questionCacheService");

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

exports.generateProblem = async (req, res, next) => {
  try {
    const { topic } = req.body;
    const difficulty = normalizeDifficulty(req.body.difficulty);
    const userId = req.user.id;

    let cacheAvailable = true;
    let cached = null;

    try {
      cached = await findCachedQuestion(difficulty, topic, userId);
    } catch (cacheError) {
      cacheAvailable = false;
      console.warn("[QuestionController] Cache lookup skipped:", cacheError.message);
    }

    if (cached) {
      try {
        await incrementUsage(cached.id);
        await recordAttempt(userId, cached.id);
      } catch (err) {
        console.warn("[QuestionController] Cache bookkeeping skipped:", err.message);
      }
      return res.json({ success: true, problem: cached, source: "cache" });
    }

    let problem = await aiService.generateProblem({ difficulty, topic, userId });
    problem = normalizeProblem(problem, difficulty);

    if (!cacheAvailable) {
      return res.json({ success: true, problem, source: "generated_no_cache" });
    }

    try {
      const savedProblem = await saveQuestion(problem, difficulty, topic);
      await recordAttempt(userId, savedProblem.id);
      return res.json({ success: true, problem: savedProblem, source: "generated" });
    } catch (err) {
      console.warn("[QuestionController] Save to cache skipped:", err.message);
      return res.json({ success: true, problem, source: "generated_no_cache" });
    }
  } catch (error) {
    next(error);
  }
};

exports.getHint = async (req, res, next) => {
  try {
    const { problem, code, question } = req.body;
    const hint = await aiService.getHint({
      problem,
      code,
      question,
      userId: req.user.id,
    });
    return res.json({ success: true, hint });
  } catch (error) {
    next(error);
  }
};
