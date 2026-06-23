const localExecutionService = require("../services/localExecutionService");

exports.runCode = async (req, res) => {
  try {
    const { language, code, stdin = "" } = req.body;

    if (!language || !code) {
      return res.status(400).json({
        success: false,
        error: "Missing required fields: language, code",
      });
    }

    const supported = ["python", "java", "c", "cpp"];
    if (!supported.includes(language)) {
      return res.status(400).json({
        success: false,
        error: `Unsupported language: ${language}. Supported: ${supported.join(", ")}`,
      });
    }

    const result = await localExecutionService.execute({
      language,
      code,
      stdin,
      timeout: 5000,
    });

    return res.json({
      success: true,
      stdout: result.stdout,
      stderr: result.stderr,
      output: result.stdout || result.stderr || "",
      exitCode: result.exitCode,
      timedOut: result.timedOut || false,
    });
  } catch (error) {
    console.error("Run error:", error);
    return res.status(500).json({
      success: false,
      error: error.message || "Execution failed",
    });
  }
};

exports.submitCode = async (req, res) => {
  try {
    const { language, code, testCases } = req.body;

    if (!language || !code) {
      return res.status(400).json({
        success: false,
        error: "Missing required fields: language, code",
      });
    }

    if (!testCases || !Array.isArray(testCases) || testCases.length === 0) {
      return res.status(400).json({
        success: false,
        error: "No test cases provided",
      });
    }

    const results = [];

    for (let i = 0; i < testCases.length; i++) {
      const tc = testCases[i];
      const input = tc.input || "";

      try {
        const result = await localExecutionService.execute({
          language,
          code,
          stdin: input,
          timeout: 5000,
        });

        const actual = (result.stdout || "").trim();
        const expected = String(tc.expected ?? "").trim(); // ✅ FIX
        const passed = actual === expected;

        results.push({
          passed,
          input: tc.input,
          expected: tc.expected,
          actual: actual,
          stdout: result.stdout,
          stderr: result.stderr,
          exitCode: result.exitCode,
        });
      } catch (err) {
        results.push({
          passed: false,
          input: tc.input,
          expected: tc.expected,
          actual: "Error: " + err.message,
          stdout: "",
          stderr: err.message,
          exitCode: 1,
        });
      }
    }

    const passedCount = results.filter((r) => r.passed).length;

    return res.json({
      success: true,
      results,
      summary: {
        total: results.length,
        passed: passedCount,
        failed: results.length - passedCount,
      },
    });
  } catch (error) {
    console.error("Submit error:", error);
    return res.status(500).json({
      success: false,
      error: error.message || "Submission failed",
    });
  }
};
