const express = require("express");
const router = express.Router();
const systemProps = require("../config/system.properties");

router.get("/health", (_req, res) => {
  res.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    uptime: Math.floor(process.uptime()),
  });
});

router.get("/version", (_req, res) => {
  res.json({
    name: systemProps.APP?.packageName || "heymine-ai-labs-backend",
    version: systemProps.BRAND?.version || "2.0.0",
    environment: process.env.NODE_ENV || "development",
  });
});

module.exports = router;
