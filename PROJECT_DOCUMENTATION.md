# HeyMine AI Labs - Project Documentation

## 1. Project Overview

HeyMine AI Labs is an AI-powered coding practice platform. It provides a landing page, an online compiler-style coding workspace, AI-generated programming problems, AI teacher chat, and local code execution for multiple programming languages.

The project is built as a Node.js and Express web application with a static HTML/CSS/JavaScript frontend. It is not a full MERN project because the current source code does not include MongoDB or React. Instead, it uses Express and Node.js for the backend, plain browser JavaScript for the frontend, and Groq AI for problem generation and tutoring.

## 2. Main Features

- Landing page for the HeyMine AI Labs platform.
- Browser-based coding workspace using Monaco Editor.
- AI-generated coding problems with descriptions, examples, constraints, and test cases.
- AI teacher chat for hints, explanations, complexity discussion, and code help.
- Local code execution for Python, Java, C, and C++.
- Test case submission flow with pass/fail feedback.
- Custom stdin support for running code with user input.
- Light and dark theme support.
- Celebration popup when all test cases pass.

## 3. Technology Stack

| Technology | Type | Usage Area |
| --- | --- | --- |
| Node.js | Runtime | Runs the backend server and local execution service. |
| Express.js | Backend framework | Handles HTTP routes, API endpoints, static files, and errors. |
| JavaScript | Backend and frontend language | Used in server controllers, services, route handling, and browser UI logic. |
| HTML5 | Frontend markup | Builds the landing page and compiler page structure. |
| CSS3 | Frontend styling | Styles the landing page, compiler workspace, themes, panels, buttons, and modals. |
| Monaco Editor | Browser code editor | Provides the IDE-like editor in `compiler.html`. |
| Groq SDK | AI integration | Connects the backend to Groq chat completions for problem generation and tutoring. |
| CORS | Express middleware | Allows cross-origin API requests if needed. |
| dotenv | Environment configuration | Loads `.env` variables like `PORT`, `GROQ_API_KEY`, and `GROQ_MODEL`. |
| child_process | Node.js built-in module | Runs local compilers/interpreters through spawned processes. |
| fs/path/os/crypto | Node.js built-ins | Creates temporary execution folders, writes code files, cleans up files, and generates unique IDs. |
| Nodemon | Development tool | Restarts the server during development. |

## 4. Project Type

This project is best described as:

```text
Node.js + Express.js + Static Frontend + Groq AI + Local Code Execution
```

It is not currently MERN:

| MERN Part | Present? | Notes |
| --- | --- | --- |
| MongoDB | No | No database connection or models are currently implemented. |
| Express.js | Yes | Used for the backend API and static file serving. |
| React | No | Frontend is plain HTML, CSS, and JavaScript. |
| Node.js | Yes | Runs the server and execution service. |

## 5. Folder Structure

```text
heymine-ai-labs/
  controllers/
    chatController.js
    executionController.js
    groqController.js
  routes/
    api.js
  services/
    localExecutionService.js
  utils/
    testcaseValidator.js
  public/
    index.html
    compiler.html
    css/
      style.css
      landing.css
      compiler.css
    js/
      main.js
      compiler.js
  server.js
  package.json
  .env.example
```

## 6. Important Files and Their Purpose

| File | Purpose |
| --- | --- |
| `server.js` | Main Express server entry point. Loads environment variables, registers middleware, serves static frontend files, mounts API routes, and starts the server. |
| `routes/api.js` | Defines all backend API routes under `/api`. |
| `controllers/chatController.js` | Main AI controller used by the app. Handles problem generation, hints, chat, and code feedback through Groq. |
| `controllers/executionController.js` | Handles code run and code submission requests. Validates request fields and calls the local execution service. |
| `controllers/groqController.js` | Older/alternate Groq controller. It is present in the project, but current routes use `chatController.js`. |
| `services/localExecutionService.js` | Writes submitted code to temporary files, compiles when needed, runs the program, passes stdin, captures stdout/stderr, enforces timeout, and cleans up. |
| `utils/testcaseValidator.js` | Provides output normalization/comparison helper, although the current submission controller compares trimmed strings directly. |
| `public/index.html` | Landing page. |
| `public/compiler.html` | Main coding workspace page. Loads Monaco Editor and compiler UI. |
| `public/js/main.js` | Landing page theme and navigation behavior. |
| `public/js/compiler.js` | Main frontend logic for problem loading, editor setup, running code, submitting tests, AI chat, theme handling, and UI rendering. |
| `public/css/*.css` | Global, landing page, and compiler page styles. |

## 7. Backend Architecture

The backend uses a simple Express MVC-style structure:

```text
Client Browser
  -> Express Server (`server.js`)
    -> API Router (`routes/api.js`)
      -> Controllers
        -> Groq SDK or Local Execution Service
```

### Backend Responsibilities

- Serve frontend files from `public/`.
- Provide health check routes.
- Accept JSON request bodies up to 10 MB.
- Generate coding problems through Groq.
- Provide AI tutoring responses.
- Run and submit code locally.
- Return structured JSON responses to the frontend.

## 8. Frontend Architecture

The frontend is a static browser application:

```text
HTML pages
  -> CSS styles
  -> Browser JavaScript
    -> Fetch API calls to Express backend
```

### Frontend Pages

| Page | Route | Purpose |
| --- | --- | --- |
| `index.html` | `/` | Marketing/landing page with feature overview and link to compiler. |
| `compiler.html` | `/compiler.html` | Coding workspace with problem panel, Monaco editor, output panel, test cases, and AI teacher chat. |

### Frontend Libraries

- Monaco Editor is loaded from jsDelivr CDN.
- Google Fonts are loaded from Google Fonts.
- The rest of the UI is custom HTML, CSS, and JavaScript.

## 9. Environment Variables

Create a `.env` file in the project root:

```env
PORT=3000
NODE_ENV=development
GROQ_API_KEY=your_groq_api_key_here
GROQ_MODEL=llama-3.3-70b-versatile
```

| Variable | Required | Purpose |
| --- | --- | --- |
| `PORT` | No | Server port. Defaults to `3000`. |
| `NODE_ENV` | No | Environment label, such as `development` or `production`. |
| `GROQ_API_KEY` | Yes | API key used by Groq SDK. |
| `GROQ_MODEL` | No | Groq model used by `chatController.js`. Defaults to `llama-3.3-70b-versatile`. |

Security note: do not commit real API keys to source control. Keep real secrets only in local `.env` files or deployment secret managers.

## 10. Setup and Run

### Install Dependencies

```bash
npm install
```

### Start Production Server

```bash
npm start
```

### Start Development Server

```bash
npm run dev
```

### Open in Browser

```text
http://localhost:3000
```

Compiler page:

```text
http://localhost:3000/compiler.html
```

## 11. External System Requirements for Code Execution

The local execution service calls system-level tools. These must be installed and available in the system `PATH`.

| Language | Required Command | Used For |
| --- | --- | --- |
| Python | `python` | Runs Python code. |
| Java | `javac`, `java` | Compiles and runs Java code. Java code must use `public class Main`. |
| C | `gcc` | Compiles and runs C code. |
| C++ | `g++` | Compiles and runs C++ code. |

Code execution uses temporary folders under the operating system temp directory:

```text
heymine-exec/
```

Each execution gets a unique temporary folder and is cleaned up after execution.

## 12. API Base URL

All main APIs are mounted under:

```text
/api
```

Example local base URL:

```text
http://localhost:3000/api
```

## 13. API Documentation

### 13.1 Server Health

```http
GET /health
```

Checks whether the main server is running.

Success response:

```json
{
  "status": "ok",
  "timestamp": "2026-06-20T00:00:00.000Z"
}
```

### 13.2 API Health

```http
GET /api/health
```

Checks whether the API router is active.

Success response:

```json
{
  "success": true,
  "status": "ok"
}
```

### 13.3 Generate Coding Problem

```http
POST /api/problem
```

Generates a coding problem using Groq AI.

Request body:

```json
{
  "difficulty": "easy",
  "topic": "arrays"
}
```

Fields:

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `difficulty` | string | No | Problem difficulty. Defaults to `easy`. Expected values are usually `easy`, `medium`, or `hard`. |
| `topic` | string | No | Optional topic such as `arrays`, `strings`, `loops`, or `graphs`. |

Success response:

```json
{
  "success": true,
  "problem": {
    "title": "Array Sum",
    "difficulty": "easy",
    "description": "Read n numbers and print their sum.",
    "constraints": ["1 <= n <= 1000"],
    "examples": [
      {
        "input": "3\n1 2 3",
        "output": "6",
        "explanation": "1 + 2 + 3 = 6"
      }
    ],
    "testCases": [
      {
        "input": "3\n1 2 3",
        "expected": "6"
      }
    ]
  }
}
```

Error response:

```json
{
  "success": false,
  "error": "Failed to generate problem"
}
```

### 13.4 Run Code

```http
POST /api/run
```

Runs submitted code once with optional stdin.

Request body:

```json
{
  "language": "python",
  "code": "print(input())",
  "stdin": "Hello"
}
```

Fields:

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `language` | string | Yes | One of `python`, `java`, `c`, or `cpp`. |
| `code` | string | Yes | Source code to execute. |
| `stdin` | string | No | Input passed to the program. Defaults to empty string. |

Success response:

```json
{
  "success": true,
  "stdout": "Hello\n",
  "stderr": "",
  "output": "Hello\n",
  "exitCode": 0,
  "timedOut": false
}
```

Validation error:

```json
{
  "success": false,
  "error": "Missing required fields: language, code"
}
```

Unsupported language error:

```json
{
  "success": false,
  "error": "Unsupported language: javascript. Supported: python, java, c, cpp"
}
```

### 13.5 Submit Code Against Test Cases

```http
POST /api/submit
```

Runs submitted code against multiple test cases and returns a summary.

Request body:

```json
{
  "language": "python",
  "code": "n=int(input())\narr=list(map(int,input().split()))\nprint(sum(arr))",
  "testCases": [
    {
      "input": "3\n1 2 3",
      "expected": "6"
    },
    {
      "input": "4\n1 2 3 4",
      "expected": "10"
    }
  ]
}
```

Fields:

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `language` | string | Yes | One of `python`, `java`, `c`, or `cpp`. |
| `code` | string | Yes | Source code to test. |
| `testCases` | array | Yes | List of input/expected output pairs. |

Success response:

```json
{
  "success": true,
  "results": [
    {
      "passed": true,
      "input": "3\n1 2 3",
      "expected": "6",
      "actual": "6",
      "stdout": "6\n",
      "stderr": "",
      "exitCode": 0
    }
  ],
  "summary": {
    "total": 1,
    "passed": 1,
    "failed": 0
  }
}
```

Error response when no test cases are provided:

```json
{
  "success": false,
  "error": "No test cases provided"
}
```

### 13.6 AI Chat

```http
POST /api/chat
```

Sends a student message to the AI teacher.

Request body:

```json
{
  "message": "Explain this problem step by step",
  "context": "Problem: Array Sum\nDescription: Read n numbers and print their sum.",
  "history": [
    {
      "role": "user",
      "content": "Give me a hint"
    },
    {
      "role": "ai",
      "content": "Think about accumulating the sum while reading the numbers."
    }
  ]
}
```

Fields:

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `message` | string | Yes | Current user message. |
| `context` | string | No | Current problem context. |
| `history` | array | No | Recent chat history. The controller uses the last 6 messages. |

Success response:

```json
{
  "success": true,
  "response": "Start by reading n, then read the list of numbers and keep a running total."
}
```

Validation error:

```json
{
  "success": false,
  "error": "Message is required"
}
```

### 13.7 Get AI Hint

```http
POST /api/hint
```

Gets a short hint for the current problem and optional code/question.

Request body:

```json
{
  "problem": {
    "title": "Array Sum",
    "description": "Read n numbers and print their sum."
  },
  "code": "def solve():\n    pass",
  "question": "What should I do first?"
}
```

Success response:

```json
{
  "success": true,
  "hint": "Read the input first, then loop through the numbers while adding them to a total."
}
```

### 13.8 AI Code Correction / Review

```http
POST /api/correct
```

Reviews code and answers a specific coding question.

Request body:

```json
{
  "language": "python",
  "code": "print('hello')",
  "query": "Can this be improved?"
}
```

Fields:

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `language` | string | No | Programming language label. |
| `code` | string | Yes | Code to review. |
| `query` | string | No | Specific question. If omitted, AI gives general improvements. |

Success response:

```json
{
  "success": true,
  "feedback": "The code is valid. For larger programs, wrap logic inside a function for readability."
}
```

Validation error:

```json
{
  "success": false,
  "error": "Code is required"
}
```

## 14. How the Code Execution Works

The execution flow is:

```text
Frontend sends language, code, and stdin
  -> /api/run or /api/submit
  -> executionController.js validates input
  -> localExecutionService.js creates a temp folder
  -> writes source code to a file
  -> compiles code if language is Java, C, or C++
  -> runs the program with stdin
  -> captures stdout, stderr, exit code, and timeout status
  -> deletes temp folder
  -> returns result as JSON
```

Language file names:

| Language | Temporary File | Compile Step | Run Step |
| --- | --- | --- | --- |
| Python | `temp.py` | None | `python temp.py` |
| Java | `Main.java` | `javac Main.java` | `java -cp tempFolder Main` |
| C | `main.c` | `gcc main.c -o main.exe` | `main.exe` |
| C++ | `main.cpp` | `g++ main.cpp -o main.exe` | `main.exe` |

Each execution has a 5-second timeout in the controller.

## 15. AI Integration

The project uses `groq-sdk` to call Groq chat completions.

Current AI use cases:

- Generate beginner/intermediate coding problems.
- Return problem data as JSON.
- Provide short hints.
- Answer student chat questions.
- Review code and answer debugging questions.

The active AI controller is `controllers/chatController.js`.

The model is loaded from:

```js
process.env.GROQ_MODEL || "llama-3.3-70b-versatile"
```

## 16. Current Limitations

- No database is currently used, so users, submissions, scores, and history are not persisted.
- No authentication or authorization is implemented.
- Local code execution runs on the host machine, so it should be isolated before production use.
- Java solutions must use `public class Main`.
- The frontend currently uses plain JavaScript, not React.
- `controllers/groqController.js` appears to be unused by the active route file.
- `utils/testcaseValidator.js` is present but not currently used by `executionController.js`.

## 17. Suggested Future Improvements

- Add MongoDB for users, problems, submissions, and progress history.
- Add authentication with JWT or sessions.
- Move local execution into Docker containers for safer sandboxing.
- Add rate limiting for AI and execution endpoints.
- Add request validation middleware.
- Add unit and integration tests.
- Replace direct string output comparison with the existing `validateOutput` helper.
- Add frontend framework support if the UI grows larger, such as React or Next.js.

## 18. Summary

HeyMine AI Labs is a full-stack JavaScript coding education platform using Node.js, Express.js, static frontend pages, Monaco Editor, Groq AI, and local compiler/interpreter execution. The backend provides APIs for AI problem generation, AI tutoring, code execution, and test submission. The frontend provides a complete browser-based coding experience for students learning Python, Java, C, and C++.
