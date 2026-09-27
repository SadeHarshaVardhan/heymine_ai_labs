const express = require("express");
const router = express.Router();
const mentorController = require("../controllers/mentorController");
const { optionalAuth } = require("../middlewares/authMiddleware");

router.post("/feedback", optionalAuth, mentorController.generateFeedback);

module.exports = router;
