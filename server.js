const express = require("express");
const path = require("path");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const apiRoutes = require("./routes/api");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, "public")));

app.use("/api", apiRoutes);

app.get("/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

app.get("*", (req, res) => {
  if (req.path.startsWith("/api/")) {
    return res.status(404).json({ error: "API endpoint not found" });
  }
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.use((err, req, res, next) => {
  console.error("Server error:", err);
  res.status(500).json({
    success: false,
    error: err.message || "Internal server error",
  });
});

app.listen(PORT, () => {
  console.log(`🚀 HeyMine AI Labs running on http://localhost:${PORT}`);
  console.log(`📁 Environment: ${process.env.NODE_ENV || "development"}`);
  console.log(`🤖 GROQ Model: ${process.env.GROQ_MODEL || "default"}`);
});
