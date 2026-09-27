/**
 * routes/api.js
 * Central API Router combining modular sub-routers.
 */

const express = require("express");
const router = express.Router();

const authRoutes = require("./authRoutes");
const userRoutes = require("./userRoutes");
const questionRoutes = require("./questionRoutes");
const executionRoutes = require("./executionRoutes");
const mentorRoutes = require("./mentorRoutes");
const chatRoutes = require("./chatRoutes");
const missionRoutes = require("./missionRoutes");

const questionController = require("../controllers/questionController");
const chatController = require("../controllers/chatController");
const { optionalAuth } = require("../middlewares/authMiddleware");

// Modular Route Mounts
router.use("/auth", authRoutes);
router.use("/user", userRoutes);
router.use("/questions", questionRoutes);
router.use("/mentor", mentorRoutes);
router.use("/chat", chatRoutes);
router.use("/missions", missionRoutes);

// Execution endpoints at /api level (/api/run, /api/submit)
router.use("/", executionRoutes);

// Backward-compatible alias routes for frontend compatibility
router.post("/problem", optionalAuth, questionController.generateProblem);
router.post("/hint", optionalAuth, questionController.getHint);
router.post("/correct", optionalAuth, chatController.correctQuery);

module.exports = router;
