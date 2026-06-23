const express = require("express");
const router = express.Router();

const executionController = require("../controllers/executionController");
const chatController = require("../controllers/chatController");

// Execution
router.post("/run", executionController.runCode);
router.post("/submit", executionController.submitCode);

// AI
router.post("/problem", chatController.generateProblem);
router.post("/hint", chatController.getHint);
router.post("/chat", chatController.chat);
router.post("/correct", chatController.correctQuery);

router.get("/health", (req, res) => {
  res.json({ success: true, status: "ok" });
});

module.exports = router;
