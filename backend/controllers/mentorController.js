const aiService = require("../services/aiService");

exports.generateFeedback = async (req, res, next) => {
  try {
    const {
      questionId,
      questionTitle,
      questionDescription,
      language,
      code,
      verdict,
      passedCount,
      totalCount,
      nextMissionTitle,
    } = req.body;

    const feedback = await aiService.generateMentorFeedback({
      questionId,
      title: questionTitle,
      description: questionDescription,
      language,
      code,
      verdict,
      passedCount,
      totalCount,
      nextMissionTitle,
      userId: req.user?.id || null,
    });

    return res.json({ success: true, feedback });
  } catch (error) {
    next(error);
  }
};
