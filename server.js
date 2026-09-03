const express = require("express");
const path = require("path");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();
const apiRoutes = require("./routes/api");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({
  origin: process.env.FRONTEND_URL || "*",
  credentials: true
}));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// Serve static assets from public/
app.use(express.static(path.join(__dirname, "public")));

// API routes
app.use("/api", apiRoutes);

app.get("/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Named page routes (so /map, /stats, /compiler work without .html)
app.get("/compiler", (req, res) => res.sendFile(path.join(__dirname, "public", "compiler.html")));
app.get("/login", (req, res) => res.sendFile(path.join(__dirname, "public", "login.html")));
app.get("/register", (req, res) => res.sendFile(path.join(__dirname, "public", "register.html")));
app.get("/forgot-password", (req, res) => res.sendFile(path.join(__dirname, "public", "forgot-password.html")));
app.get("/reset-password", (req, res) => res.sendFile(path.join(__dirname, "public", "reset-password.html")));
app.get("/settings", (req, res) => res.sendFile(path.join(__dirname, "public", "settings.html")));



// SPA fallback — send index.html for all non-API routes
app.get("*", (req, res) => {
  if (req.path.startsWith("/api/")) {
    return res.status(404).json({ error: "API endpoint not found" });
  }
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Global error handler
app.use((err, req, res, next) => {
  console.error("Server error:", err);
  res.status(500).json({
    success: false,
    error: err.message || "Internal server error",
  });
});

app.listen(PORT, () => {
  console.log(`\n🚀 HeyMine AI Labs running on http://localhost:${PORT}`);
  console.log(`📁 Environment: ${process.env.NODE_ENV || "development"}`);
  console.log(`🤖 GROQ Model:  ${process.env.GROQ_MODEL || "default"}`);
  console.log(`\n📌 Pages:`);
  console.log(`   Home:     http://localhost:${PORT}/`);
  console.log(`   Login:    http://localhost:${PORT}/login`);
  console.log(`   Compiler: http://localhost:${PORT}/compiler`);
  console.log(`\n📡 API Endpoints:`);
  console.log(`   Problem: POST /api/problem`);
  console.log(`   Chat:    POST /api/chat`);
  console.log(`   Run:     POST /api/run`);
  console.log(`   Submit:  POST /api/submit\n`);
});
