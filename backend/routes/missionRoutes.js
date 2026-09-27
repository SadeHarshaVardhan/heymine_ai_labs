const express = require("express");
const router = express.Router();
const missionController = require("../controllers/missionController");
const { optionalAuth } = require("../middlewares/authMiddleware");

router.get("/", optionalAuth, missionController.listMissions);
router.get("/:id/hints", optionalAuth, missionController.getHints);
router.get("/:id", optionalAuth, missionController.getMission);

module.exports = router;
