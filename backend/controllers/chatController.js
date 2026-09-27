const aiService = require("../services/aiService");

exports.chat = async (req, res, next) => {
  try {
    const { message, context, history } = req.body;
    if (!message) {
      return res.status(400).json({ success: false, error: "Message is required" });
    }

    const userId = req.user?.id || null;

    // Resolve @tag commands into expanded prompts
    let resolvedMessage = message;
    const atTagMap = {
      "@solve": "Provide the full solution to this problem with explanation.",
      "@hint": "Give me a helpful hint for this problem without revealing the full solution.",
      "@approach": "What is the best approach/algorithm to solve this problem? Explain the strategy.",
      "@try": "Let me try this problem — give me a starting point or first step.",
      "@explain": "Explain this problem step by step so I can understand it clearly.",
      "@new": "Give me a new coding problem to solve.",
      "@complexity": "What is the time and space complexity of the optimal solution for this problem?",
      "@optimize": "How can I optimize my current solution for better time or space complexity?",
      "@debug": "Help me debug my code and identify what is wrong.",
      "@howtosolve": "Walk me through how to solve this problem from start to finish.",
      "@how to solve": "Walk me through how to solve this problem from start to finish.",
    };

    const lowerMsg = message.trim().toLowerCase();
    for (const [tag, expansion] of Object.entries(atTagMap)) {
      if (lowerMsg.startsWith(tag)) {
        const extra = message.slice(tag.length).trim();
        resolvedMessage = expansion + (extra ? " " + extra : "");
        break;
      }
    }

    // Check guardrails via AIService classifier
    const isRelated = await aiService.isCodingRelated(resolvedMessage, userId);
    if (!isRelated) {
      return res.json({
        success: true,
        response:
          "I'm HeyMine, your AI coding teacher! 🤖 I can help you with:\n\n" +
          "- 💡 **@hint** — Get a hint for the current problem\n" +
          "- 🔍 **@approach** — Learn the best approach/algorithm\n" +
          "- ✅ **@solve** — See the full solution with explanation\n" +
          "- 🚀 **@try** — Get a starting point to attempt the problem\n" +
          "- 📖 **@explain** — Step-by-step problem explanation\n" +
          "- 🆕 **@new** — Generate a new problem\n\n" +
          "Please ask me a coding or programming related question!",
      });
    }

    const aiResponse = await aiService.chat({
      message: resolvedMessage,
      context,
      history,
      userId,
    });

    return res.json({ success: true, response: aiResponse });
  } catch (error) {
    next(error);
  }
};

exports.correctQuery = async (req, res, next) => {
  try {
    const { code, query, language } = req.body;
    if (!code) {
      return res.status(400).json({ success: false, error: "Code is required" });
    }

    const feedback = await aiService.correctCode({
      code,
      query,
      language,
      userId: req.user?.id || null,
    });

    return res.json({ success: true, feedback });
  } catch (error) {
    next(error);
  }
};
