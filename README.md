# 🧠 HeyMine AI Labs

> An AI-powered programming learning platform where students master coding through gamified milestone progression. Combines interactive milestone roadmap paths, detailed 10-test-case judging, version history drafts, a statistics dashboard, and personalized post-submission AI mentoring feedback.

---

## 🏗️ Production Architecture

```
Developer pushes to GitHub (main branch)
         │
         ▼
GitHub Actions CI/CD
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
(Auth +     (AI Mentor)
PostgreSQL)
         │
         ▼
Vercel (Frontend — Static HTML/CSS/JS)
```

---

## ✨ Features

### 1. 💻 Compiler & AI Mentor (`/compiler`)
- **Multi-language code execution**: Python, Java, C, C++ — runs directly on the server via `child_process` (no third-party execution API).
- **10-Test Case Judging**: Submissions judged against 5 visible and 5 hidden test cases.
- **AI Post-Submission Mentor**: Automatic post-submission feedback — code review, optimization suggestions, and time/space complexity analysis powered by Groq.
- **Conversational AI Tutor**: Inline chat for hints, explanations, and complexity queries.
- **Version History & Restore**: Revisit previously accepted submissions and restore code drafts.
- **Autosave Drafts**: Editor content saved to `localStorage` every 30 seconds.

### 2. 🔐 Authentication (`/login`, `/register`, `/settings`)
- Full auth flow: register, login, password reset, email confirmation.
- Powered by Supabase Auth.
- Per-user Groq API key management — stored AES-256-GCM encrypted in Supabase.

### 3. 📊 Statistics Dashboard (`/stats`)
- XP, coins, streak, acceptance rate overview.
- Submission heatmap (GitHub-style 90-day grid).
- Language usage breakdown.
- Badge showcase.

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Runtime | Node.js 22 |
| Backend Framework | Express.js |
| AI Integration | Groq SDK |
| Code Execution | `localExecutionService.js` (`child_process` — javac, gcc, g++, python) |
| Auth | Supabase Auth |
| Database | Supabase PostgreSQL |
| Key Encryption | AES-256-GCM |
| Container | Docker (`node:22-bookworm-slim` + default-jdk + gcc + g++ + python3) |
| Registry | GitHub Container Registry (GHCR) |
| Backend Host | Azure Container Apps (Consumption tier, eastasia) |
| Frontend Host | Vercel (static) |

---

## 📁 Project Structure

```
heymine-ai-labs/
├── .github/
│   └── workflows/
│       └── deploy_container_apps.yml   # CI/CD: GHCR push + Container Apps deploy
├── config/                             # App configuration
├── controllers/
│   ├── authController.js               # Auth endpoints
│   ├── chatController.js               # AI tutor chat
│   ├── executionController.js          # Code run/submit
│   ├── groqController.js               # Groq AI integration
│   └── userController.js              # User profile & API key management
├── middlewares/                        # Auth middleware
├── models/                             # Data models
├── repositories/                       # Data access layer
├── routes/
│   └── api.js                          # All API routes
├── services/
│   ├── aiMentorService.js              # Post-submission AI feedback (Groq)
│   ├── judgeService.js                 # 10-case test engine
│   ├── localExecutionService.js        # child_process execution (javac/gcc/g++/python)
│   └── questionCacheService.js         # Supabase question cache
├── public/
│   ├── index.html                      # Landing page
│   ├── compiler.html                   # Coding workspace
│   ├── login.html / register.html      # Auth pages
│   ├── settings.html                   # API key management
│   ├── css/                            # Stylesheets
│   └── js/
│       ├── config.js                   # API_BASE_URL configuration
│       ├── auth.js                     # Auth flow
│       └── compiler.js                 # Compiler UI logic
├── utils/
│   └── testcaseValidator.js            # Output comparison
├── supabase/                           # Supabase schema/migrations
├── Dockerfile                          # node:22-bookworm-slim + JDK + GCC + G++ + Python3
├── .dockerignore
├── .env.example                        # Environment variable template
├── package.json
├── server.js                           # Express entry point
└── vercel.json                         # Vercel routing config
```

---

## 🚀 Local Development

### Prerequisites
- Node.js ≥ 18
- Docker (optional, for local container testing)

### Install & Start

```bash
# Clone the repo
git clone https://github.com/SadeHarshaVardhan/heymine_ai_labs.git
cd heymine_ai_labs

# Install dependencies
npm install

# Copy env template and fill in your values
cp .env.example .env
# Edit .env with your Supabase, Groq, and encryption keys

# Start development server
npm run dev
# → http://localhost:3000
```

### Local Docker Test

```bash
docker build -t heymine-local .
docker run -p 3000:3000 --env-file .env heymine-local
# → http://localhost:3000
```

---

## 🔑 Environment Variables

Copy `.env.example` to `.env` and fill in all values:

| Variable | Description |
|---|---|
| `PORT` | Server port (default: 3000) |
| `NODE_ENV` | `development` or `production` |
| `GROQ_API_KEY` | Groq API key (server-level fallback) |
| `GROQ_MODEL` | Groq model ID |
| `SUPABASE_URL` | Supabase project URL |
| `SUPABASE_ANON_KEY` | Supabase anon/public key |
| `SUPABASE_SERVICE_KEY` | Supabase service role key |
| `ENCRYPTION_KEY` | 64-char hex key for AES-256-GCM |
| `FRONTEND_URL` | Vercel frontend URL (used for CORS) |

---

## 🚢 Production Deployment

### Registry: GitHub Container Registry (GHCR)
Image: `ghcr.io/sadeharshavardhan/heymine_ai_labs:latest`

The CI/CD workflow (`.github/workflows/deploy_container_apps.yml`) automatically:
1. Builds the Docker image on every push to `main`
2. Pushes to GHCR using the built-in `GITHUB_TOKEN` (no extra secrets)
3. Deploys to Azure Container Apps via OIDC (no client secret stored)

### Required GitHub Secrets

| Secret | Value |
|---|---|
| `AZURE_CLIENT_ID` | Service Principal App ID |
| `AZURE_TENANT_ID` | Azure AD Tenant ID |
| `AZURE_SUBSCRIPTION_ID` | Azure Subscription ID |
| `AZURE_RESOURCE_GROUP` | `heymine-rg` |
| `CONTAINER_APP_NAME` | `heymine-api` |

### Azure Resources

| Resource | Name | Region |
|---|---|---|
| Resource Group | `heymine-rg` | `eastasia` |
| Container Apps Environment | `heymine-env` | `eastasia` |
| Container App | `heymine-api` | `eastasia` |

### Health Check

```
GET https://heymine-api.<hash>.eastasia.azurecontainerapps.io/health
→ {"status":"ok","timestamp":"..."}
```

---

## 🔒 Security Notes

- User Groq API keys are encrypted with AES-256-GCM before storage in Supabase.
- CORS is restricted to `FRONTEND_URL` in production.
- All API routes are protected by Supabase JWT middleware.
- Secrets are injected as Container App secrets — never in code or workflow files.
- The `GITHUB_TOKEN` used for GHCR is automatically scoped to the repository.
