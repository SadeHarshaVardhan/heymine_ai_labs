const express = require("express");
const router = express.Router();
const chatController = require("../controllers/chatController");
const { optionalAuth } = require("../middlewares/authMiddleware");

router.post("/", optionalAuth, chatController.chat);
router.post("/correct", optionalAuth, chatController.correctQuery);

module.exports = router;
