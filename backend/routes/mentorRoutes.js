const express = require("express");
const router = express.Router();
const mentorController = require("../controllers/mentorController");
const { requireAuth } = require("../middlewares/authMiddleware");

router.post("/feedback", requireAuth, mentorController.generateFeedback);

module.exports = router;
