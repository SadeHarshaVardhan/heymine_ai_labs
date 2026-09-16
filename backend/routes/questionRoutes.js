const express = require("express");
const router = express.Router();
const questionController = require("../controllers/questionController");
const { requireAuth } = require("../middlewares/authMiddleware");

router.post("/problem", requireAuth, questionController.generateProblem);
router.post("/hint", requireAuth, questionController.getHint);

module.exports = router;
