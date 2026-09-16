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

const questionController = require("../controllers/questionController");
const chatController = require("../controllers/chatController");
const { requireAuth } = require("../middlewares/authMiddleware");

// Modular Route Mounts
router.use("/auth", authRoutes);
router.use("/user", userRoutes);
router.use("/questions", questionRoutes);
router.use("/mentor", mentorRoutes);
router.use("/chat", chatRoutes);

// Execution endpoints at /api level (/api/run, /api/submit)
router.use("/", executionRoutes);

// Backward-compatible alias routes for frontend compatibility
router.post("/problem", requireAuth, questionController.generateProblem);
router.post("/hint", requireAuth, questionController.getHint);
router.post("/correct", requireAuth, chatController.correctQuery);

module.exports = router;
