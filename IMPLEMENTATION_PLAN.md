# HeyMine AI Labs — Full Implementation Plan

**Version**: 2.0  
**Date**: 2026-09-03  
**Status**: Awaiting Approval  
**Based on**: Conversation log `CONVERSATION_LOG.md`

---

## Executive Summary

Transform HeyMine AI Labs from a laptop-only dev project into a production-ready, cloud-hosted coding education platform. The upgrade adds Supabase database, full authentication, user Groq API key management, a token-saving question cache, Judge0 cloud execution, and complete auth UI pages.

---

## Architecture After Upgrade

```
Vercel (Static Frontend)
  ├── /login          → login.html
  ├── /register       → register.html
  ├── /forgot-password → forgot-password.html
  ├── /reset-password  → reset-password.html
  ├── /settings        → settings.html
  └── /compiler        → compiler.html (auth guarded)

         ↕ HTTPS (Bearer JWT)

Express Backend (Azure App Service)
  ├── POST /api/auth/register
  ├── POST /api/auth/login
  ├── POST /api/auth/forgot-password
  ├── POST /api/auth/reset-password
  ├── GET  /api/user/me          [protected]
  ├── PUT  /api/user/apikey      [protected]
  ├── POST /api/problem          [protected] → cache-first
  ├── POST /api/chat             [protected]
  ├── POST /api/hint             [protected]
  ├── POST /api/correct          [protected]
  ├── POST /api/run              [protected] → Judge0 or local
  └── POST /api/submit           [protected] → Judge0 or local

         ↕

Supabase (Postgres + Auth)
  ├── auth.users       (built-in Supabase Auth)
  ├── profiles         (username, encrypted Groq key)
  ├── questions        (cached problems + 8 test cases)
  └── question_attempts (user → question → status)

         ↕

Judge0 API (cloud code execution)
  └── Python 71, Java 62, C 50, C++ 54
```

---

## Database Schema (Supabase Postgres)

### Table: profiles

```sql
CREATE TABLE profiles (
  id                     UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username               TEXT UNIQUE NOT NULL,
  email                  TEXT NOT NULL,
  groq_api_key_encrypted TEXT,           -- AES-256-GCM encrypted, NULL = not set
  use_own_key            BOOLEAN DEFAULT FALSE,
  created_at             TIMESTAMPTZ DEFAULT NOW(),
  updated_at             TIMESTAMPTZ DEFAULT NOW()
);

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, email, username)
  VALUES (NEW.id, NEW.email, SPLIT_PART(NEW.email, '@', 1));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();
```

### Table: questions

```sql
CREATE TABLE questions (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title       TEXT NOT NULL,
  difficulty  TEXT NOT NULL CHECK (difficulty IN ('easy', 'medium', 'hard')),
  topic       TEXT,
  slug        TEXT NOT NULL,              -- normalized: difficulty+topic key
  description TEXT NOT NULL,
  constraints JSONB DEFAULT '[]',         -- string array
  examples    JSONB DEFAULT '[]',         -- [{input, output, explanation}]
  test_cases  JSONB DEFAULT '[]',         -- [{input, expected}] always 8 items
  usage_count INTEGER DEFAULT 0,
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(slug)
);

CREATE INDEX idx_questions_slug ON questions(slug);
CREATE INDEX idx_questions_difficulty_topic ON questions(difficulty, topic);
```

### Table: question_attempts

```sql
CREATE TABLE question_attempts (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  question_id UUID NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
  language    TEXT,                        -- python, java, c, cpp
  status      TEXT DEFAULT 'attempted'     -- attempted, passed, failed
                CHECK (status IN ('attempted', 'passed', 'failed')),
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_attempts_user ON question_attempts(user_id);
CREATE INDEX idx_attempts_question ON question_attempts(question_id);
```

### Row Level Security (RLS)

```sql
-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE question_attempts ENABLE ROW LEVEL SECURITY;

-- profiles: users see/edit only their own row
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE USING (auth.uid() = id);

-- questions: all authenticated users can read, only service role can write
CREATE POLICY "Authenticated users can read questions"
  ON questions FOR SELECT TO authenticated USING (true);

-- question_attempts: users see only their own
CREATE POLICY "Users can view own attempts"
  ON question_attempts FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own attempts"
  ON question_attempts FOR INSERT WITH CHECK (auth.uid() = user_id);
```

---

## New Environment Variables

```env
# ── Existing ──────────────────────────────────────────
PORT=3000
NODE_ENV=production
GROQ_API_KEY=your_default_groq_key_here
GROQ_MODEL=llama-3.3-70b-versatile

# ── Supabase ──────────────────────────────────────────
SUPABASE_URL=https://xxxxxxxxxxxxxxxx.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# ── Encryption (for user Groq keys) ──────────────────
# Generate: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
ENCRYPTION_KEY=64_char_hex_string_here

# ── Frontend (for Vercel → Azure CORS) ───────────────
FRONTEND_URL=https://your-vercel-app.vercel.app
```

---

## Phase 1 — Supabase + Auth Backend

### New Package Dependencies

```bash
npm install @supabase/supabase-js
```

### File: `config/supabase.js` [NEW]

```javascript
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.warn('WARNING: Supabase env vars not set. DB features disabled.');
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: { persistSession: false }
});

module.exports = supabase;
```

### File: `middlewares/authMiddleware.js` [NEW]

```javascript
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

async function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, error: 'Authentication required' });
  }

  const token = authHeader.split(' ')[1];
  const { data: { user }, error } = await supabase.auth.getUser(token);

  if (error || !user) {
    return res.status(401).json({ success: false, error: 'Invalid or expired session' });
  }

  req.user = user;
  req.token = token;
  next();
}

module.exports = { requireAuth };
```

### File: `controllers/authController.js` [NEW]

Handles:
- `POST /api/auth/register` — Create user via Supabase signUp, return session
- `POST /api/auth/login` — signInWithPassword, return session + user
- `POST /api/auth/logout` — signOut
- `POST /api/auth/forgot-password` — resetPasswordForEmail (Supabase sends email)
- `POST /api/auth/reset-password` — updateUser with new password (requires session from email link)

### File: `controllers/userController.js` [NEW]

Handles:
- `GET /api/user/me` — Fetch profile row from Supabase by `req.user.id`
- `PUT /api/user/apikey` — Encrypt key with AES-256, save to `profiles.groq_api_key_encrypted`
- `PUT /api/user/toggle-key` — Toggle `use_own_key` boolean

---

## Phase 2 — Question Cache System

### Cache Logic Flow

```
POST /api/problem { difficulty, topic }
  │
  ├─► Build slug: normalize("easy_arrays") 
  │
  ├─► Query: SELECT * FROM questions WHERE slug = ? LIMIT 1
  │     │
  │     ├─► CACHE HIT:
  │     │     UPDATE questions SET usage_count = usage_count + 1
  │     │     INSERT INTO question_attempts (user_id, question_id, 'attempted')
  │     │     Return cached question  ← 0 tokens used
  │     │
  │     └─► CACHE MISS:
  │           Call Groq with 8 test cases prompt
  │           INSERT INTO questions (all fields, slug)
  │           INSERT INTO question_attempts (user_id, question_id, 'attempted')
  │           Return new question  ← tokens used once only
```

### File: `services/questionCacheService.js` [NEW]

```javascript
const supabase = require('../config/supabase');

function buildSlug(difficulty, topic) {
  const base = difficulty.toLowerCase().trim();
  const t = (topic || 'general').toLowerCase().replace(/\s+/g, '_').trim();
  return `${base}_${t}`;
}

async function findCachedQuestion(difficulty, topic, userId) {
  const slug = buildSlug(difficulty, topic);

  // Find a question this user hasn't already attempted
  const { data, error } = await supabase
    .from('questions')
    .select('*, question_attempts!left(user_id)')
    .eq('slug', slug)
    .not('question_attempts.user_id', 'eq', userId)
    .order('usage_count', { ascending: false })
    .limit(1)
    .single();

  if (error || !data) return null;
  return data;
}

async function saveQuestion(problemObj, difficulty, topic) {
  const slug = buildSlug(difficulty, topic);
  const { data, error } = await supabase
    .from('questions')
    .insert({
      title: problemObj.title,
      difficulty,
      topic: topic || null,
      slug,
      description: problemObj.description,
      constraints: problemObj.constraints,
      examples: problemObj.examples,
      test_cases: problemObj.testCases,  // 8 test cases
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

async function incrementUsage(questionId) {
  await supabase.rpc('increment_usage', { question_id: questionId });
}

async function recordAttempt(userId, questionId, language = null, status = 'attempted') {
  await supabase.from('question_attempts').insert({
    user_id: userId,
    question_id: questionId,
    language,
    status,
  });
}

module.exports = { findCachedQuestion, saveQuestion, incrementUsage, recordAttempt };
```

### Modified Groq Prompt for 8 Test Cases

```javascript
// In chatController.js — updated problem system prompt
problem: `You are an expert coding problem generator. Generate a unique coding problem suitable for beginners to intermediate programmers.
Return JSON with: title, difficulty (easy/medium/hard), description, constraints (array), examples (array of {input, output, explanation?}),
and testCases (array of {input, expected}).

IMPORTANT:
- For each test case, the 'input' field MUST be a string that a program can read from stdin.
- If the program reads an integer n and then n numbers, format as "n\\nnum1 num2 ..." (or space-separated).
- Do not use comma-separated lists unless the problem explicitly expects that.
- The expected output should be a string representation of the correct result.
- The problem must be solvable in Python, Java, C, and C++.
- Include EXACTLY 8 test cases. No more, no fewer. Cover: basic case, edge cases, large inputs, empty/zero cases.

Make the problem interesting but not overly complex.`
```

---

## Phase 3 — User API Key System

### File: `utils/encryption.js` [NEW]

```javascript
const crypto = require('crypto');

const ALGORITHM = 'aes-256-gcm';
const KEY = Buffer.from(process.env.ENCRYPTION_KEY, 'hex'); // 32 bytes

function encrypt(plainText) {
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv(ALGORITHM, KEY, iv);
  const encrypted = Buffer.concat([cipher.update(plainText, 'utf8'), cipher.final()]);
  const authTag = cipher.getAuthTag();
  // Store as iv:authTag:encrypted (all hex)
  return `${iv.toString('hex')}:${authTag.toString('hex')}:${encrypted.toString('hex')}`;
}

function decrypt(cipherText) {
  const [ivHex, authTagHex, encryptedHex] = cipherText.split(':');
  const iv = Buffer.from(ivHex, 'hex');
  const authTag = Buffer.from(authTagHex, 'hex');
  const encrypted = Buffer.from(encryptedHex, 'hex');
  const decipher = crypto.createDecipheriv(ALGORITHM, KEY, iv);
  decipher.setAuthTag(authTag);
  return decipher.update(encrypted) + decipher.final('utf8');
}

module.exports = { encrypt, decrypt };
```

### Groq Key Resolution (in chatController.js)

```javascript
// Helper to get the right Groq API key for the current request
async function resolveGroqKey(userId) {
  if (!userId) return process.env.GROQ_API_KEY;

  const { data: profile } = await supabase
    .from('profiles')
    .select('use_own_key, groq_api_key_encrypted')
    .eq('id', userId)
    .single();

  if (profile?.use_own_key && profile?.groq_api_key_encrypted) {
    try {
      return decrypt(profile.groq_api_key_encrypted);
    } catch {
      return process.env.GROQ_API_KEY; // fallback on decrypt error
    }
  }
  return process.env.GROQ_API_KEY;
}

// Usage in generateProblem, chat, hint, correct:
const apiKey = await resolveGroqKey(req.user?.id);
const groq = new Groq({ apiKey });
```

---

## Phase 4 — Code Execution (Azure App Service, local child_process)

No changes needed. `localExecutionService.js` is used in all environments.

Azure App Service uses a **Linux container**. The `startup command` (see `package.json` `start` script) runs
`node server.js`. Language runtimes (Python, GCC, G++, Java) must be installed in the Azure container, which
is handled by the Azure App Service configuration or a startup script.

**No Judge0. No third-party execution API.**

```bash
# Startup command set in Azure Portal → App Service → Configuration → General Settings:
node server.js
```

---

## Phase 5 — Frontend Auth Pages

### Pages to Create

| File | Route | Key Elements |
|---|---|---|
| `public/login.html` | `/login` | Email, password, submit, links to register + forgot |
| `public/register.html` | `/register` | Username, email, password, confirm password |
| `public/forgot-password.html` | `/forgot-password` | Email input, send reset link button |
| `public/reset-password.html` | `/reset-password` | New password + confirm, reads token from URL |
| `public/settings.html` | `/settings` | Groq key input, toggle, test connection, logout |

### Design Theme
- Match existing compiler dark theme (same CSS variables)
- Glassmorphism card centered on screen
- Animated gradient background
- Google Font: Inter (already loaded)
- Smooth form validation with inline error messages

### Auth State in `compiler.js` (Modifications)

```javascript
// On compiler page load:
const session = JSON.parse(localStorage.getItem('heymine_session'));
if (!session || !session.access_token) {
  window.location.href = '/login';
}

// Attach to every API call:
const headers = {
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${session.access_token}`,
};
```

### Routes Added to `server.js`

```javascript
app.get('/login',            (req, res) => res.sendFile(path.join(__dirname, 'public', 'login.html')));
app.get('/register',         (req, res) => res.sendFile(path.join(__dirname, 'public', 'register.html')));
app.get('/forgot-password',  (req, res) => res.sendFile(path.join(__dirname, 'public', 'forgot-password.html')));
app.get('/reset-password',   (req, res) => res.sendFile(path.join(__dirname, 'public', 'reset-password.html')));
app.get('/settings',         (req, res) => res.sendFile(path.join(__dirname, 'public', 'settings.html')));
```

---

## Phase 6 — Updated Routes File

```javascript
// routes/api.js after upgrade

// ── AUTH (no middleware) ──────────────────────────────────────────────────────
router.post('/auth/register',        authController.register);
router.post('/auth/login',           authController.login);
router.post('/auth/logout',          authController.logout);
router.post('/auth/forgot-password', authController.forgotPassword);
router.post('/auth/reset-password',  authController.resetPassword);

// ── USER (protected) ─────────────────────────────────────────────────────────
router.get('/user/me',               requireAuth, userController.getMe);
router.put('/user/apikey',           requireAuth, userController.updateApiKey);
router.put('/user/toggle-key',       requireAuth, userController.toggleKey);

// ── EXECUTION (protected) ────────────────────────────────────────────────────
router.post('/run',                  requireAuth, executionController.runCode);
router.post('/submit',               requireAuth, executionController.submitCode);

// ── AI (protected) ───────────────────────────────────────────────────────────
router.post('/problem',              requireAuth, chatController.generateProblem);
router.post('/hint',                 requireAuth, chatController.getHint);
router.post('/chat',                 requireAuth, chatController.chat);
router.post('/correct',              requireAuth, chatController.correctQuery);
```

---

## Phase 7 — Cloud Deployment (Azure & Vercel)

We will separate the deployment into two distinct services:
1. **Frontend (Vercel)**: Fast global CDN for HTML/CSS/JS.
2. **Backend (Azure App Service)**: Reliable Node.js execution environment for the Express API.

### 7.1 Backend Deployment (Azure App Service)
1. Push the project to GitHub.
2. Log into the Azure Portal and create a new **Web App** (App Service).
3. Configuration:
   - Publish: Code
   - Runtime stack: Node 18 LTS
   - Operating System: Linux
   - Pricing Plan: Free F1 (or Basic B1)
4. Set up continuous deployment from GitHub under the "Deployment Center" tab.
5. In "Configuration" -> "Application settings", add all variables from `.env.example`:
   - `PORT=8080` (Azure default for Node.js)
   - `NODE_ENV=production`
   - `GROQ_API_KEY`, `GROQ_MODEL`, `SUPABASE_URL`, `SUPABASE_SERVICE_KEY`, etc.
   - `FRONTEND_URL=https://heymine-labs.vercel.app` (to configure CORS)
6. Update `server.js` to enable CORS specifically for the Vercel domain.

### 7.2 Frontend Deployment (Vercel)
1. In the repository, ensure the frontend code is in the `/public` folder.
2. Create a `vercel.json` file in the root if you want to deploy only the static assets, or just let Vercel deploy the root (configure the "Build and Output Settings" so the output directory is `public`).
3. To point the frontend to the Azure backend, update the frontend JS (e.g. `auth.js` and `compiler.js`):
   - Replace relative paths (`/api/...`) with the full Azure URL in production (`https://<your-azure-app-name>.azurewebsites.net/api/...`).
   - Use an environment variable or config file in the frontend for `API_BASE_URL`.
4. Import the GitHub repo into Vercel.
5. Vercel will auto-detect the static files. Deploy and verify.

### Updated `.env.example`
```env
PORT=3000
NODE_ENV=development
GROQ_API_KEY=your_default_groq_key_here
GROQ_MODEL=llama-3.3-70b-versatile
SUPABASE_URL=https://xxxxxxxxxxxxxxxx.supabase.co
SUPABASE_ANON_KEY=
SUPABASE_SERVICE_KEY=
ENCRYPTION_KEY=64_char_hex_here
FRONTEND_URL=https://your-app.vercel.app
```

---

## Complete File Change Summary

### New Files
| File | Purpose |
|---|---|
| `config/supabase.js` | Supabase client singleton |
| `middlewares/authMiddleware.js` | JWT validation middleware |
| `controllers/authController.js` | register, login, forgot, reset |
| `controllers/userController.js` | get profile, update API key |
| `services/questionCacheService.js` | DB cache read/write for questions |
| `utils/encryption.js` | AES-256-GCM encrypt/decrypt |
| `public/login.html` | Login page |
| `public/register.html` | Registration page |
| `public/forgot-password.html` | Forgot password page |
| `public/reset-password.html` | Reset password page |
| `public/settings.html` | API key settings page |
| `public/css/auth.css` | Shared auth pages stylesheet |
| `public/js/auth.js` | Shared auth page JS (Supabase client) |
| `vercel.json` | Vercel frontend deployment config |
| `supabase/schema.sql` | Full DB schema for reference |

### Modified Files
| File | What Changes |
|---|---|
| `server.js` | Add 5 new page routes |
| `routes/api.js` | Add auth/user routes, add requireAuth middleware |
| `controllers/chatController.js` | Cache-first problem generation, user key resolution, 8 test cases |
| `controllers/executionController.js` | Uses localExecutionService.js (no change) |
| `public/js/compiler.js` | Auth check, Bearer token on all fetch calls |
| `public/compiler.html` | User header with name + logout button |
| `package.json` | Add @supabase/supabase-js |
| `.env.example` | Add Supabase + encryption + FRONTEND_URL vars |

---

## Verification Checklist

### Phase 1 Auth
- [ ] Register new user → profile row appears in Supabase dashboard
- [ ] Login → receive JWT access_token
- [ ] Protected route without token → 401 response
- [ ] Protected route with valid token → 200 response

### Phase 2 Cache
- [ ] Generate problem (cache miss) → question row saved in Supabase with 8 test cases
- [ ] Generate same difficulty+topic again → cache hit, Groq NOT called (check logs)
- [ ] `usage_count` increments on cache hit
- [ ] `question_attempts` row created for the user

### Phase 3 API Key
- [ ] Save Groq key in settings → encrypted value stored in Supabase
- [ ] Toggle "use own key" → AI calls use decrypted user key (verify via Groq usage dashboard)
- [ ] Toggle back → default key used again

### Phase 4 Execution
- [ ] Run Python code on Azure → output returned correctly (child_process works in container)
- [ ] Run Java/C/C++ code → compilers installed on Azure container

### Phase 5 UI
- [ ] Visit /compiler without login → redirected to /login
- [ ] Login → redirected back to /compiler
- [ ] Forgot password → receive email
- [ ] Click email link → /reset-password → change password → login works

---

*This implementation plan was generated by Antigravity AI on 2026-09-03 based on the conversation in CONVERSATION_LOG.md*
