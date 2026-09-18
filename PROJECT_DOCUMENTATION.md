# HeyMine AI Labs — Engineering Notes

_Full-stack setup, architecture, Git/CI-CD, Docker, Azure, Supabase, and AI/chat reference. Last updated 2026-09-18._

---

## 1. What this project is

HeyMine AI Labs is an AI-powered programming learning platform. Students solve AI-generated coding problems in a browser-based compiler workspace (Monaco Editor), get judged against 10 test cases (5 visible + 5 hidden), and receive AI mentor feedback (code review, complexity analysis, optimization tips) after each submission. Auth, per-user API keys, and question caching are backed by Supabase; AI is powered by Groq.

It is a **monorepo**: `backend/` (Node.js/Express API) + `frontend/` (static HTML/CSS/JS), deployed as two independently-hosted services that talk to each other over HTTPS.

---

## 2. Project timeline — from scratch to now

Reconstructed from `git log` (oldest → newest):

| Era | Commits | What happened |
|---|---|---|
| **1. MVP bootstrap** | `d50083d` Initial HeyMine AI Labs commit, `13416be` merge | Plain Node.js + Express backend, static HTML/CSS/JS frontend, Groq SDK for AI problem generation/tutoring, local `child_process` code execution. No database, no auth. |
| **2. Platform build-out** | `427d74d` complete platform setup for Azure/Vercel, `b4921d8` App Service workflow, `fa1ffd5` production Dockerfile (Node 22 + JDK + GCC + G++ + Python3), `cf63cb1` switch to GHCR + Azure Container Apps, `08d7b88` restructure into modular `frontend/`+`backend/` monorepo with `AIService` | Introduced Supabase (auth + Postgres), AES-256-GCM encrypted per-user Groq keys, modular controllers/services/routes, Docker containerization, and the first CI/CD pipeline. |
| **3. CI/CD hardening** | `b614fdb` dual auth compat, `c1bb173` optional Azure step, `bfa6a4c` OIDC auth + GHCR pull creds, `64d7e19`/`903c4de`/`33ea67d` deployment verification triggers | Debugged Azure login (moved from client-secret to OIDC federated credential), fixed resource group name, fixed RBAC role assignment, fixed immutable-ID subject claim mismatch on the federated credential. |
| **4. Frontend ↔ backend wiring + polish** | `b0e225b` connect frontend to Azure backend, `f414a9c` fix signup email redirect, `cbd1812` premium dark IDE auth UI + API key settings, `78d9750` auth page scroll/UX fixes, `88910d4` compiler UI polish | Pointed the Vercel frontend at the live Azure Container Apps backend URL, fixed Supabase email confirmation redirects, and did visual polish passes on the compiler and auth pages. |

**Current state (as of this doc):** backend live on Azure Container Apps, frontend live on Vercel, Supabase handling auth + Postgres, Groq handling all AI calls, GitHub Actions auto-deploying on every push to `main`.

---

## 3. Production architecture

```
Developer pushes to GitHub (main branch)
         │
         ▼
GitHub Actions CI/CD  (.github/workflows/deploy_container_apps.yml)
         │
         ▼
GitHub Container Registry (GHCR)
ghcr.io/sadeharshavardhan/heymine_ai_labs:latest
         │
         ▼
Azure Container Apps (eastasia)
Backend API — Node.js 22 + JDK + GCC + G++ + Python3
         │
    ┌────┴────┐
    ▼         ▼
Supabase    Groq API
(Auth +     (Problem gen,
PostgreSQL)  chat, mentor)
         │
         ▼
Vercel (Frontend — static HTML/CSS/JS)
```

Two independently deployed services:
- **Backend** — Azure Container Apps, deployed via Docker image from GHCR.
- **Frontend** — Vercel, deployed as static files, calls the backend over HTTPS using `frontend/js/config.js` → `window.API_BASE_URL`.

---

## 4. Tech stack

| Layer | Technology | Notes |
|---|---|---|
| Runtime | Node.js 22 | `node:22-bookworm-slim` base image |
| Backend framework | Express.js 4 | `backend/server.js` |
| AI integration | Groq SDK (`groq-sdk`) | `backend/services/aiService.js` |
| Code execution | `child_process` (no 3rd-party sandbox API) | `backend/services/localExecutionService.js` |
| Auth | Supabase Auth (JWT, email/password) | `backend/middlewares/authMiddleware.js` |
| Database | Supabase PostgreSQL | `backend/supabase/schema.sql` |
| Key encryption | AES-256-GCM | `backend/utils/encryption.js` |
| Security headers | Helmet | `server.js` |
| Rate limiting | `express-rate-limit` | `backend/middlewares/rateLimiter.js` |
| Editor | Monaco Editor (CDN) | `frontend/compiler.html` |
| Container | Docker — `node:22-bookworm-slim` + `default-jdk` + `gcc` + `g++` + `python3` | `backend/Dockerfile` |
| Registry | GitHub Container Registry (GHCR) | `ghcr.io/sadeharshavardhan/heymine_ai_labs` |
| Backend host | Azure Container Apps (Consumption tier, `eastasia`) | |
| Frontend host | Vercel (static) | `frontend/vercel.json` |
| CI/CD | GitHub Actions | `.github/workflows/deploy_container_apps.yml` |

---

## 5. Repository / monorepo structure

```
heymine-ai-labs/
├── .github/workflows/
│   └── deploy_container_apps.yml     # CI/CD: build → GHCR → Azure Container Apps
├── backend/
│   ├── Dockerfile                    # node:22-bookworm-slim + JDK + GCC + G++ + Python3
│   ├── .dockerignore
│   ├── .env / .env.example
│   ├── server.js                     # Express entry point
│   ├── config/
│   │   ├── supabase.js               # Supabase client factory (admin + auth clients)
│   │   └── system.properties.js
│   ├── controllers/
│   │   ├── authController.js         # register/login/reset/session
│   │   ├── chatController.js         # AI tutor chat + @tag resolution + guardrail
│   │   ├── executionController.js    # /run and /submit
│   │   ├── mentorController.js       # post-submission AI mentor feedback
│   │   ├── questionController.js     # AI problem generation + hint
│   │   └── userController.js         # profile + Groq API key management
│   ├── middlewares/
│   │   ├── authMiddleware.js         # requireAuth — validates Supabase JWT
│   │   ├── errorHandler.js
│   │   ├── rateLimiter.js
│   │   └── requestLogger.js
│   ├── routes/
│   │   ├── api.js                    # mounts all sub-routers under /api
│   │   ├── authRoutes.js / userRoutes.js / questionRoutes.js
│   │   ├── executionRoutes.js / mentorRoutes.js / chatRoutes.js
│   │   └── healthRoutes.js           # /health, /version (mounted at root)
│   ├── services/
│   │   ├── aiService.js              # single Groq client + all system prompts
│   │   ├── aiMentorService.js
│   │   ├── judgeService.js           # 10-test-case judge engine
│   │   ├── localExecutionService.js  # child_process compile/run per language
│   │   └── questionCacheService.js   # Supabase-backed question cache
│   ├── utils/
│   │   ├── encryption.js             # AES-256-GCM encrypt/decrypt
│   │   └── testcaseValidator.js
│   └── supabase/
│       └── schema.sql                # profiles, questions, question_attempts + RLS
├── frontend/
│   ├── index.html                    # landing page
│   ├── compiler.html                 # coding workspace
│   ├── login.html / register.html / forgot-password.html / reset-password.html
│   ├── settings.html                 # API key management UI
│   ├── vercel.json                   # routing + security headers
│   ├── css/                          # style.css, landing.css, compiler.css, auth.css
│   └── js/
│       ├── config.js                 # API_BASE_URL resolution
│       ├── auth.js                   # Supabase auth flow
│       ├── compiler.js               # editor, run/submit, chat UI logic
│       └── main.js                   # landing page behavior
├── package.json                      # monorepo root (start/dev scripts proxy to backend)
├── IMPLEMENTATION_PLAN.md
└── CONVERSATION_LOG.md
```

---

## 6. Git & GitHub setup

- **Remote**: `https://github.com/SadeHarshaVardhan/heymine_ai_labs.git` (repo was originally under `hey-mine-ai/hey-mine-ai-labs`, later consolidated).
- **Branch strategy**: single `main` branch, direct pushes trigger deployment. No staging branch currently.
- **CI/CD trigger**: any push to `main`, or manual `workflow_dispatch`.
- **Commit style in use**: Conventional-commit-ish prefixes (`feat:`, `fix:`, `chore:`, `ci:`, `refactor:`) — keep using this, it's what the history already follows.
- **GitHub Actions permissions** needed on the workflow (already set in the YAML):
  - `contents: read`
  - `packages: write` (push to GHCR)
  - `id-token: write` (OIDC login to Azure — no stored client secret)

---

## 7. Docker setup

**`backend/Dockerfile`**:

```dockerfile
FROM node:22-bookworm-slim

ENV DEBIAN_FRONTEND=noninteractive

# Install OpenJDK (Java), GCC (C), G++ (C++), Python 3
RUN apt-get update && apt-get install -y --no-install-recommends \
    default-jdk gcc g++ python3 python-is-python3 \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .

EXPOSE 8080
CMD ["node", "server.js"]
```

Why it looks like this:
- Base image is **Debian slim**, not Alpine — glibc compatibility matters for `default-jdk`/`gcc`/`g++` toolchains used by the judge.
- All four language toolchains (Java, C, C++, Python) are installed **inside the image** because `localExecutionService.js` shells out to `javac`, `java`, `gcc`, `g++`, and `python` directly via `child_process` — there is no external sandboxed execution API.
- `EXPOSE 8080` matches `PORT` fallback in `server.js` (`process.env.PORT || 8080`) and Azure Container Apps' expected ingress target port.
- Build context is `./backend` (see CI/CD workflow step 3), not the repo root — the Dockerfile only copies backend files.

**Local Docker test:**

```bash
cd backend
docker build -t heymine-local .
docker run -p 8080:8080 --env-file .env heymine-local
# → http://localhost:8080
```

**`.dockerignore`** (backend) excludes `node_modules`, `.env`, and local dev cruft from the build context.

---

## 8. Azure setup — Container Apps

### 8.1 Resources

| Resource | Name | Region | Purpose |
|---|---|---|---|
| Resource Group | `heymine-rg` | `eastasia` | Container for all Azure resources |
| Container Apps Environment | `heymine-env` | `eastasia` | Shared networking/logging layer |
| Container App | `heymine-api` | `eastasia` | Runs the backend Docker image |

### 8.2 Auth model: OIDC federated credential (no stored client secret)

GitHub Actions authenticates to Azure using **workload identity federation (OIDC)**, not a stored `AZURE_CREDENTIALS` JSON secret. This was a deliberate fix during the "CI/CD hardening" era (commits `bfa6a4c`, `903c4de`, `33ea67d`) after running into subject-claim mismatches.

How it's wired, conceptually (Azure Portal or `az` CLI, done once):

1. **Create (or reuse) an App Registration** in Azure AD — this becomes the Service Principal GitHub Actions logs in as.
   ```bash
   az ad app create --display-name "heymine-github-actions"
   ```
2. **Create a federated credential** on that App Registration, scoped to this exact repo + branch:
   ```bash
   az ad app federated-credential create \
     --id <APP_OBJECT_ID> \
     --parameters '{
       "name": "heymine-main-branch",
       "issuer": "https://token.actions.githubusercontent.com",
       "subject": "repo:SadeHarshaVardhan/heymine_ai_labs:ref:refs/heads/main",
       "audiences": ["api://AzureADTokenExchange"]
     }'
   ```
   The `subject` claim must match the workflow's actual trigger context exactly (repo + branch, or `pull_request`, or `environment:<name>`) — a mismatch here is the classic "immutable-ID subject fix" class of bug seen in this repo's history.
3. **Assign the Service Principal a role** (e.g. `Contributor`) scoped to `heymine-rg` so it can run `az containerapp update`:
   ```bash
   az role assignment create \
     --assignee <SP_APPLICATION_ID> \
     --role Contributor \
     --scope /subscriptions/<SUBSCRIPTION_ID>/resourceGroups/heymine-rg
   ```
4. **`azure/login@v2`** in the workflow exchanges the GitHub OIDC token for an Azure access token using `client-id` + `tenant-id` + `subscription-id` — no password ever touches the repo.

### 8.3 Required GitHub Secrets

Set under **Repo → Settings → Secrets and variables → Actions**:

| Secret | Value | Used for |
|---|---|---|
| `AZURE_CLIENT_ID` | App Registration (Service Principal) App ID | OIDC login |
| `AZURE_TENANT_ID` | Azure AD Tenant ID | OIDC login |
| `AZURE_SUBSCRIPTION_ID` | Azure Subscription ID | OIDC login |
| `AZURE_RESOURCE_GROUP` | `heymine-rg` | Target for `az containerapp` commands |
| `CONTAINER_APP_NAME` | `heymine-api` | Target Container App |
| `GHCR_PAT` | GitHub Personal Access Token with `read:packages` | Lets the Container App pull private images from GHCR (separate from the ephemeral `GITHUB_TOKEN` used to *push*) |

`GITHUB_TOKEN` itself is **not** a secret you set — GitHub injects it automatically per workflow run, scoped to this repo.

### 8.4 CI/CD pipeline (`.github/workflows/deploy_container_apps.yml`)

Triggers on push to `main` or manual dispatch. Steps:

1. **Checkout** the repo.
2. **Login to GHCR** using the built-in `GITHUB_TOKEN` (no extra secret needed to push).
3. **Build the Docker image** from the `./backend` directory, tagged both `:${{ github.sha }}` and `:latest`.
4. **Push both tags** to `ghcr.io/sadeharshavardhan/heymine_ai_labs`.
5. **Login to Azure via OIDC** using `azure/login@v2` and the three `AZURE_*` secrets.
6. **Update GHCR pull credentials on the Container App** via `az containerapp registry set` — this is what lets the (private-by-default) Container App pull the freshly pushed image using the `GHCR_PAT`.
7. **Deploy**: `az containerapp update --image ghcr.io/.../heymine_ai_labs:<sha>` — updates the running revision to the new image, tagged by commit SHA (not `latest`, so each deploy is traceable to an exact commit).
8. **Print the live URL and health check** by querying `properties.configuration.ingress.fqdn` on the Container App.

### 8.5 Health check

```
GET https://heymine-api.<hash>.eastasia.azurecontainerapps.io/health
→ {"status":"ok","timestamp":"..."}

GET https://heymine-api.<hash>.eastasia.azurecontainerapps.io/version
```
Both are mounted at the Express **root** (`backend/routes/healthRoutes.js`), not under `/api`.

---

## 9. Supabase setup

### 9.1 Auth
- Email/password auth via Supabase Auth.
- `emailRedirectTo` is set explicitly on signup (fix in commit `f414a9c`) so confirmation emails deep-link back to the correct frontend URL instead of Supabase's default.
- Backend validates sessions via `requireAuth` middleware (`backend/middlewares/authMiddleware.js`): expects `Authorization: Bearer <supabase_access_token>`, calls `supabase.auth.getUser(token)` using the **anon key client**, and attaches `req.user`.
- Two Supabase clients are created in `backend/config/supabase.js`:
  - `supabaseAdmin` (service role key) — used for privileged writes (profile updates, question cache).
  - `supabaseAuth` (anon key) — used only to validate user JWTs.

### 9.2 Database schema (`backend/supabase/schema.sql`)

| Table | Purpose | Key columns |
|---|---|---|
| `profiles` | 1:1 with `auth.users`, extra app data | `groq_api_key_encrypted`, `use_own_key`, `username` |
| `questions` | Cached AI-generated problems | `cache_key`, `difficulty`, `topic`, `test_cases` (JSONB), `usage_count` |
| `question_attempts` | Per-user attempt history | `user_id`, `question_id`, `status` (`attempted`/`passed`/`failed`) |

Automation via Postgres triggers/functions:
- `handle_new_user()` — auto-inserts a `profiles` row whenever a new `auth.users` row is created (via `on_auth_user_created` trigger), defaulting `username` from the email prefix.
- `set_updated_at()` — keeps `profiles.updated_at` current on every update.
- `increment_question_usage(uuid)` — bumps `questions.usage_count`.

**Row Level Security (RLS)** is enabled on all three tables:
- Users can only `SELECT`/`UPDATE` their **own** `profiles` row (`auth.uid() = id`).
- Any authenticated user can `SELECT` from `questions` (shared cache).
- Users can only `SELECT`/`INSERT`/`UPDATE` their **own** `question_attempts` (`auth.uid() = user_id`).

---

## 10. AI / Chat settings (Groq)

All AI calls go through a single service: `backend/services/aiService.js`. There is **one Groq model** configured via `GROQ_MODEL` (falls back to `qwen/qwen3.8-27b` in code if unset).

### 10.1 API key resolution (BYOK — bring your own key)

```
resolveGroqKey(userId):
  if user has use_own_key = true AND a saved encrypted key
    → decrypt and use the user's own Groq key
  else
    → fall back to the platform GROQ_API_KEY (server .env)
```
- User keys are entered in `/settings`, validated to start with `gsk_`, encrypted with **AES-256-GCM** (`backend/utils/encryption.js`) before being stored in `profiles.groq_api_key_encrypted`.
- `PUT /api/user/api-key` saves/updates the key; toggling `use_own_key` switches between platform key and personal key without deleting it.

### 10.2 System prompts (5 distinct AI behaviors, one per action)

| Action | Endpoint | Purpose | Notable config |
|---|---|---|---|
| `problem` | `POST /api/problem` (or `/api/questions`) | Generates a coding problem as strict JSON (title, difficulty, description, constraints, examples, 8 test cases) | `response_format: json_object`, `temp 0.7`, `max_tokens 2000` |
| `hint` | `POST /api/hint` | Short, non-spoiling hint (≤3 sentences) | `temp 0.6`, `max_tokens 300` |
| `chat` | `POST /api/chat` | Conversational tutor, keeps last 6 messages of history | `temp 0.7`, `max_tokens 800` |
| `correct` | `POST /api/correct` | Code review / answers a specific question about the code | `temp 0.5`, `max_tokens 600` |
| `mentor` | `POST /api/mentor` | Post-submission structured feedback (verdict comment, mistakes, code review, time/space complexity, optimization tip, concept, next-mission line) | `response_format: json_object`, `temp 0.5`, `max_tokens 800`, has a hardcoded fallback JSON if Groq call fails |

### 10.3 Chat guardrail + `@tag` shortcuts

`chatController.chat` runs two things before calling the model:
1. **`@tag` expansion** — if the user's message starts with a known tag, it's rewritten into a full instruction before being sent to Groq:

   | Tag | Expands to |
   |---|---|
   | `@solve` | Full solution with explanation |
   | `@hint` | Hint without revealing the solution |
   | `@approach` | Best algorithm/strategy explanation |
   | `@try` | Starting point / first step |
   | `@explain` | Step-by-step problem explanation |
   | `@new` | Generate a new problem |
   | `@complexity` | Time/space complexity of optimal solution |
   | `@optimize` | Optimization suggestions for current code |
   | `@debug` | Debugging help |
   | `@howtosolve` / `@how to solve` | Full walkthrough |

2. **Topic guardrail classifier** — `isCodingRelated()` makes a cheap Groq call (`temp 0`, `max_tokens 5`) asking the model to answer strictly `yes`/`no` on whether the message is coding-related. If `no`, the user gets a canned "I'm HeyMine, your AI coding teacher..." redirect instead of burning a full completion. **Fails open** (defaults to allowing the message through) if the classifier call itself errors.

### 10.4 Reliability

- `executeWithRetry()` wraps every Groq call: up to 3 attempts, exponential backoff (`2^attempt * 500ms`), retries only on `429`, `5xx`, or timeout.
- Hard 30s timeout per call via `Promise.race`.
- Token usage (`prompt_tokens`/`completion_tokens`/`total_tokens`) is logged per call for observability.

---

## 11. Environment variables

Same variable set is used in both `backend/.env` (source of truth in production/Docker) and the repo-root `.env` (used when running `npm run dev` from the root, which proxies to `backend/server.js`).

| Variable | Required | Description |
|---|---|---|
| `PORT` | No | Server port. Falls back to `8080` in `server.js`. |
| `NODE_ENV` | No | `development` or `production`. Affects Supabase `requireEnv` strictness and CORS logging behavior. |
| `GROQ_API_KEY` | Yes (unless every user supplies their own key) | Platform-level Groq key, used as fallback when a user hasn't set `use_own_key`. |
| `GROQ_MODEL` | No | Groq model ID. Code default: `qwen/qwen3.8-27b`. |
| `SUPABASE_URL` | Yes | Supabase project URL. |
| `SUPABASE_ANON_KEY` | Yes | Public anon key — used to validate user JWTs. |
| `SUPABASE_SERVICE_KEY` (or `SUPABASE_SERVICE_ROLE_KEY`) | Yes | Service role key — used for privileged DB writes. Never exposed to the frontend. |
| `ENCRYPTION_KEY` | Yes | 64-char hex key (32 bytes) for AES-256-GCM encryption of user Groq keys. |
| `FRONTEND_URL` | Yes in production | Vercel frontend URL, used for CORS allow-list. |

**Never commit `.env`** — both are already git-ignored. `.env.example` (root and `backend/`) documents the shape without real values.

---

## 12. Frontend deployment (Vercel)

- Static site, deployed from `frontend/`.
- `frontend/vercel.json`:
  - `cleanUrls: true` — `/login` instead of `/login.html`.
  - Explicit rewrites for every page (`/compiler`, `/login`, `/register`, `/forgot-password`, `/reset-password`, `/settings`, `/`).
  - Security headers on every response: `X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY`, `Referrer-Policy: strict-origin-when-cross-origin`.
- **Connecting to the backend**: `frontend/js/config.js` resolves `window.API_BASE_URL` in this priority order:
  1. `window._HEYMINE_API_BASE` if injected in an inline `<script>` tag before `config.js` loads (this is how production points at the Azure Container Apps URL).
  2. `localStorage.getItem('heymine_api_url')` — dev override.
  3. Empty string — relative `/api/...` calls, which only work when frontend and backend are served from the same origin (local Express dev mode).

---

## 13. API route map

All routes mounted under `/api` except health/version (root). Auth-protected routes require `Authorization: Bearer <token>`.

| Mount | File | Handles |
|---|---|---|
| `/api/auth` | `authRoutes.js` → `authController.js` | register, login, logout, password reset |
| `/api/user` | `userRoutes.js` → `userController.js` | `GET /me`, API key CRUD, `use_own_key` toggle |
| `/api/questions` | `questionRoutes.js` → `questionController.js` | AI problem generation, caching |
| `/api/mentor` | `mentorRoutes.js` → `mentorController.js` | post-submission AI feedback |
| `/api/chat` | `chatRoutes.js` → `chatController.js` | tutor chat, `@tag` handling |
| `/api/run`, `/api/submit` | `executionRoutes.js` → `executionController.js` | run once / judge against test cases |
| `/api/problem`, `/api/hint`, `/api/correct` | aliases in `api.js` | backward-compatible shortcuts to the above |
| `/health`, `/version` | `healthRoutes.js` (mounted at root, not `/api`) | liveness/version check |

Local execution details (`localExecutionService.js`):

| Language | Temp file | Compile | Run |
|---|---|---|---|
| Python | `temp.py` | — | `python temp.py` |
| Java | `Main.java` | `javac Main.java` | `java -cp <dir> Main` |
| C | `main.c` | `gcc main.c -o main` | `./main` |
| C++ | `main.cpp` | `g++ main.cpp -o main` | `./main` |

Each run has a timeout; temp folders are created per execution and cleaned up after.

---

## 14. Security notes

- Per-user Groq API keys encrypted with AES-256-GCM before storage — never stored or logged in plaintext.
- All `/api/*` routes except health are behind Supabase JWT auth (`requireAuth`) and rate-limited (`apiLimiter`).
- Helmet sets security headers server-side; Vercel sets them again at the edge for static pages.
- CORS allow-list is built from `FRONTEND_URL` + local dev origins.
- Azure deployment uses OIDC federated credentials — **no long-lived Azure client secret is stored anywhere** in GitHub.
- `GITHUB_TOKEN` used to push to GHCR is auto-scoped to this repo and expires with the workflow run; only the separate `GHCR_PAT` (for the Container App's *pull* credential) is a long-lived secret.
- Row Level Security enforced at the Postgres level in Supabase as a second line of defense beyond the API auth middleware.

---

## 15. Local development quickstart

```bash
git clone https://github.com/SadeHarshaVardhan/heymine_ai_labs.git
cd heymine_ai_labs

npm run install:backend      # installs backend/node_modules
cp backend/.env.example backend/.env
# fill in GROQ_API_KEY, SUPABASE_URL, SUPABASE_ANON_KEY, SUPABASE_SERVICE_KEY, ENCRYPTION_KEY

npm run dev                  # runs backend/server.js via nodemon, serves frontend/ statically
# → http://localhost:8080
```

Local Docker test:
```bash
cd backend
docker build -t heymine-local .
docker run -p 8080:8080 --env-file .env heymine-local
```

---

## 16. Things to know / current gaps

- `GROQ_MODEL` default differs between older docs (`llama-3.3-70b-versatile`) and current code (`qwen/qwen3.8-27b`) — whatever is set in `.env`/Container App secrets wins; check there for the actual live model.
- Code execution runs directly on the container host via `child_process` — it is **not** further sandboxed per-request (no gVisor/Firecracker isolation). Acceptable for a single-tenant learning tool, worth revisiting before scaling to untrusted multi-tenant load.
- Deploys are tagged by commit SHA (traceable) but the Container App is always updated to the latest push to `main` — there's no staging slot or manual approval gate yet.
- `backend/controllers/executionController.js` + `judgeService.js` currently own test-case comparison; `utils/testcaseValidator.js` exists but isn't fully wired in everywhere.
