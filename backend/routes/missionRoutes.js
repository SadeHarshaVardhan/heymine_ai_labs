const express = require("express");
const router = express.Router();
const missionController = require("../controllers/missionController");
const { requireAuth } = require("../middlewares/authMiddleware");

router.get("/", requireAuth, missionController.listMissions);
router.get("/:id/hints", requireAuth, missionController.getHints);
router.get("/:id", requireAuth, missionController.getMission);

module.exports = router;
