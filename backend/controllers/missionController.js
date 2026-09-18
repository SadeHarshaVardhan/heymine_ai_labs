const questionRepo = require("../repositories/questionRepository");

function toProblem(meta, visibleTests) {
  return {
    id: meta.id,
    questionId: meta.id,
    title: meta.title,
    difficulty: String(meta.difficulty || "Beginner").toLowerCase(),
    description: meta.description,
    inputFormat: meta.inputFormat || "",
    outputFormat: meta.outputFormat || "",
    constraints: meta.constraints || [],
    examples: meta.examples || [],
    testCases: visibleTests,
    stage: meta.stage,
    stageName: meta.stageName,
    mission: meta.mission,
    xp: meta.xp,
    coins: meta.coins,
    unlockNext: meta.unlockNext,
  };
}

exports.getMission = async (req, res, next) => {
  try {
    const id = String(req.params.id || "").toUpperCase();
    let meta, visibleTests;
    try {
      meta = questionRepo.getQuestionMeta(id);
      visibleTests = questionRepo.getVisibleTests(id);
    } catch (err) {
      return res.status(404).json({ success: false, error: `Mission ${id} not found` });
    }
    return res.json({ success: true, problem: toProblem(meta, visibleTests), source: "mission" });
  } catch (error) {
    next(error);
  }
};

exports.getHints = async (req, res, next) => {
  try {
    const id = String(req.params.id || "").toUpperCase();
    const hints = questionRepo.getHints(id);
    return res.json({ success: true, hints });
  } catch (error) {
    next(error);
  }
};

exports.listMissions = async (req, res, next) => {
  try {
    const stages = questionRepo.getMissionsByStage();
    return res.json({ success: true, stages });
  } catch (error) {
    next(error);
  }
};
