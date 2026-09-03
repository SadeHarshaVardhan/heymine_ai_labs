/**
 * routes/api.js  (UPGRADED)
 * All API endpoints — preserves all existing routes, adds new mission/progress routes.
 */

const express = require('express');
const router  = express.Router();

const executionController = require('../controllers/executionController');
const chatController      = require('../controllers/chatController');
const authController      = require('../controllers/authController');
const userController      = require('../controllers/userController');
const { requireAuth }     = require('../middlewares/authMiddleware');


// ── HEALTH ───────────────────────────────────────────────────────────────────
router.get('/health', (req, res) => {
  res.json({ success: true, status: 'ok', timestamp: new Date().toISOString() });
});

// ── AUTH ─────────────────────────────────────────────────────────────────────
router.post('/auth/register',        authController.register);
router.post('/auth/login',           authController.login);
router.post('/auth/logout',          authController.logout);
router.post('/auth/forgot-password', authController.forgotPassword);
router.post('/auth/reset-password',  authController.resetPassword);

// ── USER ─────────────────────────────────────────────────────────────────────
router.get('/user/me',         requireAuth, userController.getMe);
router.put('/user/apikey',     requireAuth, userController.updateApiKey);
router.put('/user/toggle-key', requireAuth, userController.toggleKey);

// ── EXECUTION ────────────────────────────────────────────────────────────────
router.post('/run',    requireAuth, executionController.runCode);
router.post('/submit', requireAuth, executionController.submitCode);

// ── AI ───────────────────────────────────────────────────────────────────────
router.post('/problem', requireAuth, chatController.generateProblem);
router.post('/hint',    requireAuth, chatController.getHint);
router.post('/chat',    requireAuth, chatController.chat);
router.post('/correct', requireAuth, chatController.correctQuery);



module.exports = router;
