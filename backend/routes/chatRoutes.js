const express = require("express");
const router = express.Router();
const chatController = require("../controllers/chatController");
const { requireAuth } = require("../middlewares/authMiddleware");

router.post("/", requireAuth, chatController.chat);
router.post("/correct", requireAuth, chatController.correctQuery);

module.exports = router;
