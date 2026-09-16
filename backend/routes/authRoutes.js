const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const { authLimiter } = require("../middlewares/rateLimiter");

router.post("/register", authLimiter, authController.register);
router.post("/login", authLimiter, authController.login);
router.post("/logout", authController.logout);
router.post("/forgot-password", authLimiter, authController.forgotPassword);
router.post("/reset-password", authLimiter, authController.resetPassword);

module.exports = router;
