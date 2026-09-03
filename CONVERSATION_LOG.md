# HeyMine AI Labs — Upgrade Conversation Log

**Date**: 2026-09-03  
**Participants**: Developer (User) + Antigravity AI Assistant  
**Context**: Planning the full upgrade of HeyMine AI Labs from a local-only dev project into a production-ready, cloud-deployable platform.

---

## Problem Statement (What the User Said)

> "here problem is mainly about the we are running the backend services in my laptop so during the time of making this website online may cause backend services issues so we have to make the we have to run the services backend and frontend, and we have to make a database, supabase and login needed, and sometimes we are using the api key by default ours for the groq so user can able to make there groq key and setup and make api there own and later, login, reset, forget page and api key setup page, and save the question for example if the person try to do and @try so save the question and test cases in a table structure so easily we can retrieve them simply like 8 test cases think so and next, this can decrease the tokens of creating the test cases and also if same question they can retrieve if not generate and save the question, save the unnecessary tokens on them 8 test cases, this is my idea and i want present what is the setup in our project make a complete updating plan for further"

---

## Problems Identified

### Problem 1 — Backend Running on Developer's Laptop
- The current backend uses `child_process` to run local compilers (Python, GCC, G++, Javac)
- These system tools are on the developer's laptop
**Solution**: Backend is deployed to **Azure App Service** (Linux container). Azure runs the backend with the same compilers (Python, GCC, G++, Java) installed in the container, so `localExecutionService.js` (child_process) continues to work without changes. No third-party execution API required.

### Problem 2 — No Database
- Nothing is persisted — questions reset on every page load
- No user accounts, no history, no question storage
- Every AI request costs tokens even for the same question

**Solution Agreed**: Add **Supabase** (Postgres + Auth) — free tier, zero-config, JavaScript SDK.

### Problem 3 — No Authentication
- Anyone can use the platform anonymously
- No way to track who attempted what
- No way to associate API keys with users

**Solution Agreed**: Use **Supabase Auth** (built-in email+password auth) — covers login, register, forgot password, reset password.

### Problem 4 — Default Groq API Key Used for Everyone
- Currently only the developer's Groq key (in `.env`) is used
- If many users use the platform, tokens get consumed from one key
- No way for users to bring their own key

**Solution Agreed**: Build a **user API key system** — users can enter their own Groq key in a settings page. Key is encrypted (AES-256) before storing in Supabase.

### Problem 5 — Wasted Tokens on Repeated Questions
- Every time a user asks for a new problem, Groq generates it fresh
- If 100 users ask for an "easy array problem", it generates 100 times and wastes ~100k tokens
- The `@try` command should save the question + test cases for future reuse

**Solution Agreed**: Build a **question cache system**:
  - Before calling Groq, check Supabase `questions` table for matching difficulty + topic
  - If found → return cached (0 tokens spent)
  - If not found → generate with Groq, save to DB with **8 test cases**
  - Future users with same request get the cached version instantly

---

## Ideas and Decisions Made

### Decision 1: Supabase as the Database
- Free tier: 500MB DB, 50,000 auth users, 2GB bandwidth
- Handles both Postgres DB and Auth in one place
- JavaScript SDK (`@supabase/supabase-js`) works perfectly with Express
- No need for separate MongoDB or Prisma setup

### Decision 2: Code Execution on Azure App Service
- `localExecutionService.js` (child_process) continues to be used in **all environments**
- Azure App Service (Linux) containers have Python, GCC, G++, Java pre-installable
- No third-party execution API (Judge0) needed — execution runs on the Azure container itself

### Decision 3: Question Cache with 8 Test Cases
- `@try` and all problem generation routes hit the cache first
- Cache key = `difficulty + topic` normalized slug
- Always store **8 test cases** (increased from current 5-7)
- Track `usage_count` to know which questions are most popular
- Track per-user attempts in `question_attempts` table so same user does not get same question again

### Decision 4: User Groq API Key System
- Users can enter their own Groq API key in a `/settings` page
- Key is **AES-256-GCM encrypted** before saving to Supabase (never plain text)
- Toggle: "Use my own key" / "Use default key"
- When `use_own_key = true` → decrypt user key → use for that request
- When `use_own_key = false` → fall back to `process.env.GROQ_API_KEY`

### Decision 5: Auth Pages Needed
| Page | Route | Purpose |
|---|---|---|
| Login | `/login` | Email + password via Supabase Auth |
| Register | `/register` | Sign up with username, email, password |
| Forgot Password | `/forgot-password` | Send reset email |
| Reset Password | `/reset-password` | Token from email URL to new password |
| Settings | `/settings` | Manage Groq API key, profile |

### Decision 6: Auth Guard on Compiler Page
- If user is not logged in redirect to `/login`
- JWT from Supabase stored in `localStorage`
- Sent as `Authorization: Bearer <token>` on every API call
- Backend middleware validates token before processing

---

## Current Project State (What Was Found)

| Area | Current Status |
|---|---|
| Backend | Node.js + Express, works locally |
| Frontend | Plain HTML + CSS + Monaco Editor |
| AI | Groq SDK, llama-3.3-70b-versatile model |
| Execution | Local compilers via child_process |
| Database | Supabase (Completed) |
| Auth | Supabase Auth (Completed) |
| Deployment | Local testing complete. Planning Azure (backend) & Vercel (frontend) |
| Question cache | Implemented |
| User API keys | Implemented |

### Files Reviewed
- `server.js` — Express entry point, static serving, route mounting
- `routes/api.js` — All current routes: /run, /submit, /problem, /hint, /chat, /correct
- `controllers/chatController.js` — Problem generation + chat + hint + @tag system
- `services/localExecutionService.js` — child_process compiler runner
- `package.json` — Dependencies: express, groq-sdk, cors, dotenv, nodemon
- `.env` — PORT, NODE_ENV, GROQ_API_KEY, GROQ_MODEL
- `PROJECT_DOCUMENTATION.md` — Full project documentation

---

## Open Questions (Still Need Answers)

| # | Question | Options |
|---|---|---|
| 1 | Code execution after going online | Judge0 API (recommended) or Docker on VPS? |
| 2 | Deployment architecture split | Express API on Azure App Service, Static frontend on Vercel |
| 3 | Question cache scope | Per-user private or shared across all users? |
| 3 | Question cache scope | Per-user private or shared across all users? |

---

## Agreed Implementation Order

| Phase | What | Outcome |
|---|---|---|
| 1 | Supabase setup + Auth backend | **Completed** |
| 2 | Question cache system | **Completed** |
| 3 | User Groq API key system | **Completed** |
| 4 | Local execution + Azure deploy | **Completed** |
| 5 | Frontend auth pages | **Completed** |
| 6 | Frontend deployment (Vercel) | Static assets configured for Vercel |
| 7 | Backend deployment (Azure) | Express API deployed to Azure App Service |

---

## Token Savings Estimate

Assuming each problem generation costs approx 1,500 tokens (8 test cases):

| Scenario | Without Cache | With Cache |
|---|---|---|
| 100 users, same easy+array problem | 150,000 tokens | 1,500 tokens (1 generation) |
| 1,000 users, 10 common problem types | 1,500,000 tokens | 15,000 tokens |
| Savings | — | ~99% reduction |

---

*This log was auto-generated by Antigravity AI from the conversation on 2026-09-03.*
