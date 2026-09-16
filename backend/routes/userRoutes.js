const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const { requireAuth } = require("../middlewares/authMiddleware");

router.get("/me", requireAuth, userController.getMe);
router.put("/apikey", requireAuth, userController.updateApiKey);
router.put("/toggle-key", requireAuth, userController.toggleKey);

module.exports = router;
