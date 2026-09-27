const express = require("express");
const router = express.Router();
const executionController = require("../controllers/executionController");
const { optionalAuth } = require("../middlewares/authMiddleware");

router.post("/run", optionalAuth, executionController.runCode);
router.post("/submit", optionalAuth, executionController.submitCode);

module.exports = router;
