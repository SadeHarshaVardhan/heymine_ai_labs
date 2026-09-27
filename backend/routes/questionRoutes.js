const express = require("express");
const router = express.Router();
const questionController = require("../controllers/questionController");
const { optionalAuth } = require("../middlewares/authMiddleware");

router.post("/problem", optionalAuth, questionController.generateProblem);
router.post("/hint", optionalAuth, questionController.getHint);

module.exports = router;
