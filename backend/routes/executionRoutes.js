const express = require("express");
const router = express.Router();
const executionController = require("../controllers/executionController");
const { requireAuth } = require("../middlewares/authMiddleware");

router.post("/run", requireAuth, executionController.runCode);
router.post("/submit", requireAuth, executionController.submitCode);

module.exports = router;
