const { spawn } = require("child_process");
const fs = require("fs").promises;
const path = require("path");
const os = require("os");
const crypto = require("crypto");

const TEMP_DIR = path.join(os.tmpdir(), "heymine-exec");
fs.mkdir(TEMP_DIR, { recursive: true }).catch(() => {});

async function execute({ language, code, stdin = "", timeout = 5000 }) {
  const id = crypto.randomBytes(8).toString("hex");
  const workDir = path.join(TEMP_DIR, id);

  let stdout = "";
  let stderr = "";
  let exitCode = 0;
  let timedOut = false;

  try {
    await fs.mkdir(workDir, { recursive: true });

    const fileInfo = getFileInfo(language);
    const codePath = path.join(workDir, fileInfo.filename);
    await fs.writeFile(codePath, code, "utf8");

    let compileCmd = null;
    let runCmd = null;
    let executablePath = null;

    switch (language) {
      case "python":
        runCmd = { cmd: "python", args: [codePath] };
        break;
      case "java":
        compileCmd = { cmd: "javac", args: [codePath] };
        runCmd = { cmd: "java", args: ["-cp", workDir, "Main"] };
        break;
      case "c":
        executablePath = path.join(workDir, "main.exe");
        compileCmd = { cmd: "gcc", args: [codePath, "-o", executablePath] };
        runCmd = { cmd: executablePath, args: [] };
        break;
      case "cpp":
        executablePath = path.join(workDir, "main.exe");
        compileCmd = { cmd: "g++", args: [codePath, "-o", executablePath] };
        runCmd = { cmd: executablePath, args: [] };
        break;
      default:
        throw new Error(`Unsupported language: ${language}`);
    }

    // Compile if needed
    if (compileCmd) {
      const compileResult = await runProcess(
        compileCmd.cmd,
        compileCmd.args,
        workDir,
        timeout,
      );
      if (compileResult.stderr) {
        await cleanup(workDir);
        return {
          stdout: "",
          stderr: compileResult.stderr,
          exitCode: compileResult.exitCode || 1,
          timedOut: compileResult.timedOut || false,
        };
      }
    }

    // Run with stdin
    if (runCmd) {
      const runResult = await runProcessWithStdin(
        runCmd.cmd,
        runCmd.args,
        workDir,
        stdin,
        timeout,
      );
      stdout = runResult.stdout;
      stderr = runResult.stderr;
      exitCode = runResult.exitCode || 0;
      timedOut = runResult.timedOut || false;
    }

    await cleanup(workDir);
    return { stdout, stderr, exitCode, timedOut };
  } catch (error) {
    await cleanup(workDir).catch(() => {});
    return {
      stdout: "",
      stderr: error.message || "Execution error",
      exitCode: 1,
      timedOut: false,
    };
  }
}

function getFileInfo(language) {
  const map = {
    python: { filename: "temp.py" },
    java: { filename: "Main.java" },
    c: { filename: "main.c" },
    cpp: { filename: "main.cpp" },
  };
  return map[language] || map.python;
}

// Run without stdin (compilation)
function runProcess(cmd, args, cwd, timeout) {
  return new Promise((resolve) => {
    const proc = spawn(cmd, args, {
      cwd,
      shell: process.platform === "win32",
      timeout,
      windowsHide: true,
    });

    let stdout = "";
    let stderr = "";
    let timedOut = false;

    proc.stdout.on("data", (data) => {
      stdout += data.toString();
    });
    proc.stderr.on("data", (data) => {
      stderr += data.toString();
    });

    proc.on("error", (err) => {
      resolve({ stdout, stderr: err.message, exitCode: 1, timedOut });
    });

    proc.on("close", (code) => {
      resolve({ stdout, stderr, exitCode: code, timedOut });
    });

    const timer = setTimeout(() => {
      timedOut = true;
      proc.kill("SIGTERM");
      setTimeout(() => {
        if (!proc.killed) proc.kill("SIGKILL");
      }, 500);
    }, timeout);

    proc.on("close", () => clearTimeout(timer));
    proc.on("error", () => clearTimeout(timer));
  });
}

// Run WITH stdin – CORRECTED
function runProcessWithStdin(cmd, args, cwd, stdin, timeout) {
  return new Promise((resolve) => {
    const proc = spawn(cmd, args, {
      cwd,
      shell: process.platform === "win32",
      timeout,
      windowsHide: true,
    });

    let stdout = "";
    let stderr = "";
    let timedOut = false;

    proc.stdout.on("data", (data) => {
      stdout += data.toString();
    });
    proc.stderr.on("data", (data) => {
      stderr += data.toString();
    });

    // ---------- FIX: Write stdin ----------
    if (stdin) {
      proc.stdin.write(stdin);
    }
    proc.stdin.end(); // <-- CRITICAL: signal EOF

    proc.on("error", (err) => {
      resolve({ stdout, stderr: err.message, exitCode: 1, timedOut });
    });

    proc.on("close", (code) => {
      resolve({ stdout, stderr, exitCode: code, timedOut });
    });

    const timer = setTimeout(() => {
      timedOut = true;
      proc.kill("SIGTERM");
      setTimeout(() => {
        if (!proc.killed) proc.kill("SIGKILL");
      }, 500);
    }, timeout);

    proc.on("close", () => clearTimeout(timer));
    proc.on("error", () => clearTimeout(timer));
  });
}

async function cleanup(dir) {
  try {
    await fs.rm(dir, { recursive: true, force: true });
  } catch (_) {}
}

async function cleanupOldTempDirs() {
  try {
    const dirs = await fs.readdir(TEMP_DIR);
    const now = Date.now();
    const MAX_AGE = 60 * 60 * 1000;
    for (const dir of dirs) {
      const fullPath = path.join(TEMP_DIR, dir);
      try {
        const stat = await fs.stat(fullPath);
        if (stat.isDirectory() && now - stat.mtimeMs > MAX_AGE) {
          await fs.rm(fullPath, { recursive: true, force: true });
        }
      } catch (_) {}
    }
  } catch (_) {}
}

setInterval(cleanupOldTempDirs, 30 * 60 * 1000);

module.exports = { execute };
