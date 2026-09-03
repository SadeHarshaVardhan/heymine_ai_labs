/**
 * ============================================================
 *  SYSTEM PROPERTIES — Centralized Brand & App Configuration
 * ============================================================
 *  Edit THIS FILE ONLY to rebrand the entire application.
 *  Every name, label, URL, and visible text is defined here.
 *  No other file needs to be touched for a basic white-label.
 * ============================================================
 */

"use strict";

// ─────────────────────────────────────────────────────────────
//  1. BRAND IDENTITY
// ─────────────────────────────────────────────────────────────
const BRAND = {
  /** Short product name shown in nav, titles, and console */
  name: "HeyMine AI Labs",

  /** Full legal / marketing name (used in footers, emails, docs) */
  fullName: "HeyMine AI Labs Platform",

  /** One-line tagline shown on the landing page hero */
  tagline: "AI-Powered Coding Practice, Reimagined.",

  /** Sub-tagline / supporting description */
  description:
    "Practice coding with AI-generated problems, get real-time hints from an AI teacher, and run code in Python, Java, C, and C++.",

  /** Used in <meta name="author"> and footer copyright */
  author: "HeyMine Team",

  /** Copyright line — use {year} as a placeholder */
  copyright: "© {year} HeyMine AI Labs. All rights reserved.",

  /** Version displayed in health-check and console startup */
  version: "2.0.0",
};

// ─────────────────────────────────────────────────────────────
//  2. APP IDENTITY (package / repo / internal IDs)
// ─────────────────────────────────────────────────────────────
const APP = {
  /** Must match package.json "name" — used for npm and folder IDs */
  packageName: "heymine-ai-labs",

  /** Internal slug — used for temp execution folders, storage paths, etc. */
  slug: "heymine",

  /** Temp execution folder prefix (OS temp dir) */
  execFolderPrefix: "heymine-exec",

  /** Default server port (overridden by .env PORT) */
  port: 3000,

  /** Default Node environment */
  nodeEnv: "development",
};

// ─────────────────────────────────────────────────────────────
//  3. PAGE TITLES & META (SEO)
// ─────────────────────────────────────────────────────────────
const PAGES = {
  home: {
    title: `${BRAND.name} — ${BRAND.tagline}`,
    metaDescription: BRAND.description,
    heading: BRAND.name,
  },
  compiler: {
    title: `Compiler | ${BRAND.name}`,
    metaDescription:
      "Write, run, and debug code in Python, Java, C, and C++ with AI problem generation and an AI teacher.",
    heading: "AI Coding Workspace",
  },
  map: {
    title: `Learning Map | ${BRAND.name}`,
    metaDescription: "Explore the structured learning path and mission map.",
    heading: "Learning Map",
  },
  stats: {
    title: `Statistics | ${BRAND.name}`,
    metaDescription: "View your coding progress and performance statistics.",
    heading: "Your Statistics",
  },
};

// ─────────────────────────────────────────────────────────────
//  4. NAVIGATION LABELS
// ─────────────────────────────────────────────────────────────
const NAV = {
  logoText: BRAND.name,
  links: {
    home: "Home",
    compiler: "Compiler",
    map: "Map",
    stats: "Stats",
  },
  ctaButton: "Start Coding →",
};

// ─────────────────────────────────────────────────────────────
//  5. AI TEACHER PERSONA
// ─────────────────────────────────────────────────────────────
const AI_TEACHER = {
  /** Name shown in the chat panel header */
  name: "AI Teacher",

  /** Greeting message when the chat panel opens */
  greeting:
    "Hi! I'm your AI Teacher. Ask me for hints, explanations, or code reviews anytime!",

  /** System prompt prefix injected before all AI requests */
  systemPromptPrefix:
    "You are a helpful, encouraging coding teacher. Guide students with hints rather than giving full solutions. Be concise and clear.",

  /** Label on the hint button */
  hintButtonLabel: "Get Hint",

  /** Label on the review / correct button */
  reviewButtonLabel: "Review My Code",
};

// ─────────────────────────────────────────────────────────────
//  6. FEATURE FLAGS
// ─────────────────────────────────────────────────────────────
const FEATURES = {
  /** Enable / disable the local code execution endpoint (/api/run) */
  codeExecution: true,

  /** Enable / disable AI problem generation (/api/problem) */
  aiProblemGeneration: true,

  /** Enable / disable the AI chat endpoint (/api/chat) */
  aiChat: true,

  /** Enable / disable the AI hint endpoint (/api/hint) */
  aiHints: true,

  /** Enable / disable the AI code-review endpoint (/api/correct) */
  aiCodeReview: true,

  /** Show the celebration popup when all test cases pass */
  celebrationPopup: true,

  /** Light / dark theme toggle available to the user */
  themeToggle: true,
};

// ─────────────────────────────────────────────────────────────
//  7. SUPPORTED LANGUAGES
// ─────────────────────────────────────────────────────────────
const LANGUAGES = {
  /** Keys must match what the execution service expects */
  supported: ["python", "java", "c", "cpp"],

  /** Display labels shown in UI dropdowns */
  labels: {
    python: "Python",
    java: "Java",
    c: "C",
    cpp: "C++",
  },

  /** Default language selected in the compiler */
  default: "python",
};

// ─────────────────────────────────────────────────────────────
//  8. EXECUTION LIMITS
// ─────────────────────────────────────────────────────────────
const EXECUTION = {
  /** Maximum code execution time in milliseconds */
  timeoutMs: 5000,

  /** Maximum request body size (Express json limit) */
  requestBodyLimit: "10mb",
};

// ─────────────────────────────────────────────────────────────
//  9. GROQ / AI PROVIDER SETTINGS
// ─────────────────────────────────────────────────────────────
const AI_PROVIDER = {
  /** Fallback model if GROQ_MODEL env var is not set */
  defaultModel: "llama-3.3-70b-versatile",

  /** Max tokens for problem generation responses */
  problemMaxTokens: 2000,

  /** Max tokens for chat / hint responses */
  chatMaxTokens: 1000,

  /** Temperature for problem generation (0 = deterministic, 1 = creative) */
  problemTemperature: 0.7,

  /** Temperature for chat responses */
  chatTemperature: 0.6,
};

// ─────────────────────────────────────────────────────────────
//  10. CONTACT & SOCIAL LINKS
// ─────────────────────────────────────────────────────────────
const CONTACT = {
  email: "hello@heymine.ai",
  website: "https://heymine.ai",
  github: "https://github.com/heymine-ai",
  twitter: "",
  discord: "",
};

// ─────────────────────────────────────────────────────────────
//  11. STORAGE & FILE PATHS  (relative to project root)
// ─────────────────────────────────────────────────────────────
const PATHS = {
  public: "public",
  storage: "storage",
  data: "data",
  questionsFile: "heymine_100_questions_mvp.json",
};

// ─────────────────────────────────────────────────────────────
//  12. CONSOLE STARTUP MESSAGE
//      Called by server.js — uses properties above
// ─────────────────────────────────────────────────────────────
function printStartupMessage(port) {
  const year = new Date().getFullYear();
  console.log(`\n🚀  ${BRAND.name} v${BRAND.version} running on http://localhost:${port}`);
  console.log(`📁  Environment : ${process.env.NODE_ENV || APP.nodeEnv}`);
  console.log(`🤖  AI Model   : ${process.env.GROQ_MODEL || AI_PROVIDER.defaultModel}`);
  console.log(`\n📌  Pages:`);
  console.log(`    Home     : http://localhost:${port}/`);
  console.log(`    Map      : http://localhost:${port}/map`);
  console.log(`    Compiler : http://localhost:${port}/compiler`);
  console.log(`    Stats    : http://localhost:${port}/stats`);
  console.log(`\n📡  API Endpoints:`);
  console.log(`    Missions : GET  /api/missions`);
  console.log(`    Progress : GET  /api/progress`);
  console.log(`    Stats    : GET  /api/statistics`);
  console.log(`    Problem  : POST /api/problem`);
  console.log(`    Chat     : POST /api/chat`);
  console.log(`    Hint     : POST /api/hint`);
  console.log(`    Correct  : POST /api/correct`);
  console.log(`    Run      : POST /api/run`);
  console.log(`    Submit   : POST /api/submit`);
  console.log(`\n${BRAND.copyright.replace("{year}", year)}\n`);
}

// ─────────────────────────────────────────────────────────────
//  EXPORTS
// ─────────────────────────────────────────────────────────────
module.exports = {
  BRAND,
  APP,
  PAGES,
  NAV,
  AI_TEACHER,
  FEATURES,
  LANGUAGES,
  EXECUTION,
  AI_PROVIDER,
  CONTACT,
  PATHS,
  printStartupMessage,
};
