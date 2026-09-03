# 🧠 HeyMine AI Labs

> An AI-powered programming learning platform where students master coding through gamified milestone progression. Combines interactive 3D roadmap paths, detailed 10-test-case judging, version history drafts, a statistics dashboard, and personalized post-submission AI mentoring feedback.

---

## ✨ Features

### 1. 🗺️ 3D Adventure Roadmap Map (`/map.html`)
* **Split Panel Layout**: Left panel features an interactive 3D robot scene using a `<spline-viewer>` loading the `scene.splinecode` asset. Right panel contains the scrollable adventure path.
* **Snaking Paths & Glowing Connectors**: 100 missions grouped into 5 stages snaking down the screen. An animated glowing SVG Bezier line flows through all node centers to guide progression.
* **Responsive Flow**: Seamlessly transforms from a side-by-side split screen on desktop to a stacked layout on mobile.

### 2. 💻 Upgraded Compiler & Mission Mode (`/compiler.html?mission=HMXXX`)
* **10-Test Case Judging**: Submissions are judged against 5 visible test cases (detailed input/output/actual/stderr output cards) and 5 hidden test cases (verdict only) for leak-proof cheating prevention.
* **Version History & Restore**: Revisit previously accepted submissions, check execution times, and click "Restore" to drop previous draft code directly back into the Monaco editor.
* **Autosave Drafts**: Automatic saving of editor content to `localStorage` every 30 seconds to prevent progress loss.
* **Progress Integration**: Unlocks next missions, awards XP/coins, and celebrates completions with visual confetti on perfect scores.

### 3. 🤖 AI Tutor & Post-Submission Mentor (`/services/aiMentorService.js`)
* **Conversational AI Tutor**: Standard inline chat for explanations, hints, and complexity queries.
* **AI Post-Submission Mentor**: Automatically triggers after submissions to provide:
  - Code review comments on readability and conventions.
  - Concrete suggestions for optimization.
  - Structured Time & Space complexity analysis.

### 4. 📊 Statistics Dashboard (`/stats.html`)
* **Overview Cards**: Track total XP, coins, day streak, and acceptance rate.
* **Milestone Rings**: Animated visual rings tracking percentage completion of the 5 stages.
* **Submission Heatmap**: A GitHub-style 90-day grid visualizing submission frequency.
* **Badges Showcase**: Earn medals for specific milestones (First Mission, 5/10 Missions, Stage completions, Streaks).
* **Language Chart**: Horizontal bar graphs of language usage (Python, Java, C, C++).

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Runtime | Node.js ≥ 18 |
| Backend Framework | Express.js |
| AI Integration | Groq SDK (`llama-3.3-70b-versatile`) |
| Code Editor | Monaco Editor (via CDN) |
| 3D Spline Viewer | `@splinetool/viewer` module CDN |
| Database & Persistence | Zero-Auth File System Storage (`storage/`) |
| Compiler Output | localExecutionService (`child_process`) |

---

## 📁 Upgraded Folder Structure

```text
heymine-ai-labs/
├── config/
├── controllers/
│   ├── chatController.js       # Inline AI tutor
│   ├── executionController.js  # Runs code, submits to judge, awards progress
│   ├── missionController.js    # Serves stages and 100 missions progress
│   └── progressController.js   # Serves stats, profile, history, and drafts
├── data/
│   ├── questions/              # Metadata JSON for 100 questions (HM001-HM100)
│   ├── visible-tests/          # 5 visible inputs/expected outputs per question
│   ├── hidden-tests/           # 5 hidden inputs/expected outputs per question
│   ├── hints/                  # 3 progressive hints per question
│   ├── reference-solutions/    # Server-side JavaScript solutions for generation
│   └── generators/             # Deterministic test input generator functions
├── repositories/
│   ├── questionRepository.js   # In-memory caching data-access layer for missions
│   └── progressRepository.js   # Persistent local progress and draft history
├── services/
│   ├── judgeService.js         # 10-case test engine with output validators
│   ├── progressService.js      # Progress engine awarding XP, badges, streaks
│   └── aiMentorService.js      # Post-submission feedback using Groq
├── storage/
│   ├── progress.json           # Active student stats, unlocked/completed missions
│   ├── submissions/            # JSON records of all test runs
│   └── versions/               # JSON drafts of successful versions
├── utils/
│   └── testcaseValidator.js    # Whitespace normalizer and float tolerance comparator
├── public/
│   ├── index.html              # Upgraded landing page with Adventure CTA
│   ├── map.html                # Split-screen 3D Spline Roadmap Map
│   ├── compiler.html           # Upgraded coding workspace (Mission Bar & History)
│   ├── stats.html              # Student statistics dashboard
│   ├── css/                    # Stylesheets (map.css, mission.css, stats.css)
│   └── js/                     # Scripts (map.js, missionMode.js, compiler.js)
├── scene.splinecode            # Binary 3D Spline interactive scene
└── server.js                   # Main Express application entry
```

---

## 🚀 Getting Started

### 1. Prerequisites
Make sure `python`, `gcc`, `g++`, `javac`, and `java` are installed on your server host and loaded in your system `PATH`.

### 2. Install & Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

### 3. Environment Config
Make sure your `.env` contains:
```env
PORT=3000
GROQ_API_KEY=your_groq_api_key_here
GROQ_MODEL=llama-3.3-70b-versatile
```

Open `http://localhost:3000` to start your coding adventure!
