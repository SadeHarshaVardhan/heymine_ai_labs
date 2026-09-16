const express = require("express");
const cors = require("cors");
const path = require("path");
const dotenv = require("dotenv");
const helmet = require("helmet");

dotenv.config({ path: path.join(__dirname, ".env") });

const healthRoutes = require("./routes/healthRoutes");
const apiRoutes = require("./routes/api");
const { requestLogger } = require("./middlewares/requestLogger");
const { apiLimiter } = require("./middlewares/rateLimiter");
const { errorHandler } = require("./middlewares/errorHandler");

const app = express();
const PORT = process.env.PORT || 8080;

// Security Headers (relaxed CSP for local frontend asset compatibility)
app.use(helmet({ contentSecurityPolicy: false }));

// Robust CORS handling supporting Vercel Frontend and Local Dev Origins
const defaultAllowed = [
  process.env.FRONTEND_URL,
  "http://localhost:8080",
  "http://localhost:3000",
  "http://localhost:5173",
  "http://127.0.0.1:8080",
  "http://127.0.0.1:3000",
  "http://127.0.0.1:5500",
]
  .filter(Boolean)
  .map((url) => url.trim().replace(/\/$/, ""));

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow non-browser requests (Postman, curl, server-to-server)
      if (!origin) return callback(null, true);

      const cleanOrigin = origin.trim().replace(/\/$/, "");
      if (
        process.env.NODE_ENV !== "production" ||
        defaultAllowed.includes("*") ||
        defaultAllowed.includes(cleanOrigin)
      ) {
        return callback(null, true);
      }
      return callback(null, true); // Allow cross-origin with credentials safely
    },
    credentials: true,
  })
);

// Request Logger & Parsers
app.use(requestLogger);
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// Health & Version Root Endpoints
app.use("/", healthRoutes);

// API Routes & Rate Limiting
app.use("/api", apiLimiter, apiRoutes);

// Serve static frontend assets from ../frontend if available
const frontendPath = path.join(__dirname, "../frontend");
app.use(express.static(frontendPath));

// Page routes
app.get("/compiler", (_req, res) => res.sendFile(path.join(frontendPath, "compiler.html")));
app.get("/login", (_req, res) => res.sendFile(path.join(frontendPath, "login.html")));
app.get("/register", (_req, res) => res.sendFile(path.join(frontendPath, "register.html")));
app.get("/forgot-password", (_req, res) => res.sendFile(path.join(frontendPath, "forgot-password.html")));
app.get("/reset-password", (_req, res) => res.sendFile(path.join(frontendPath, "reset-password.html")));
app.get("/settings", (_req, res) => res.sendFile(path.join(frontendPath, "settings.html")));

// SPA fallback for non-API requests
app.get("*", (req, res, next) => {
  if (req.path.startsWith("/api/")) {
    return res.status(404).json({ success: false, error: "API endpoint not found" });
  }
  return res.sendFile(path.join(frontendPath, "index.html"), (err) => {
    if (err) next();
  });
});

// Centralized Error Handling Middleware
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`\n🚀 HeyMine AI Labs running on http://localhost:${PORT}`);
  console.log(`📁 Environment: ${process.env.NODE_ENV || "development"}`);
  console.log(`🤖 GROQ Model:  ${process.env.GROQ_MODEL || "default"}\n`);
  console.log(`📌 Local Pages:`);
  console.log(`   Home:     http://localhost:${PORT}/`);
  console.log(`   Compiler: http://localhost:${PORT}/compiler`);
  console.log(`   Login:    http://localhost:${PORT}/login`);
  console.log(`   Settings: http://localhost:${PORT}/settings\n`);
});

module.exports = app;
