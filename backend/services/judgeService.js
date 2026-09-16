/**
 * services/judgeService.js
 * Core judging engine — runs student code against all 10 test cases.
 *
 * Architecture decisions:
 * - Visible tests (5): revealed to student.
 * - Hidden tests (5): results shown as pass/fail only, never input/expected.
 * - Reference solution: used on backend to verify expected output dynamically.
 * - Verdict: ACCEPTED only when all 10/10 pass.
 */

const questionRepo   = require('../repositories/questionRepository');
const execService    = require('./localExecutionService');
const { validateOutput } = require('../utils/testcaseValidator');

const TIMEOUT_MS = 5000; // Per test case execution timeout

/**
 * Judge a student's code against all 10 test cases.
 *
 * @param {object} opts
 * @param {string} opts.questionId   - e.g. "HM001"
 * @param {string} opts.language     - "python" | "java" | "c" | "cpp"
 * @param {string} opts.code         - student source code
 * @returns {object} JudgeResult
 */
async function judge({ questionId, language, code }) {
  // 1. Load test cases
  let visibleTests, hiddenTests;
  try {
    visibleTests = questionRepo.getVisibleTests(questionId);
    hiddenTests  = questionRepo.getHiddenTests(questionId);
  } catch (err) {
    throw new Error(`Failed to load test cases for ${questionId}: ${err.message}`);
  }

  // 2. Run visible tests (fully revealed)
  const visibleResults = await runTestCases(code, language, visibleTests, true);

  // 3. Run hidden tests (summary only — no input/expected exposed)
  const hiddenResults  = await runTestCases(code, language, hiddenTests, false);

  // 4. Aggregate
  const visiblePassed = visibleResults.filter(r => r.passed).length;
  const hiddenPassed  = hiddenResults.filter(r => r.passed).length;
  const totalPassed   = visiblePassed + hiddenPassed;
  const totalTests    = visibleTests.length + hiddenTests.length; // 10

  const verdict = totalPassed === totalTests ? 'ACCEPTED' : 'WRONG_ANSWER';

  // Check for runtime/compile errors
  const hasError = [...visibleResults, ...hiddenResults].some(r => r.error);
  const finalVerdict = hasError && totalPassed === 0 ? 'RUNTIME_ERROR' : verdict;

  return {
    verdict:       finalVerdict,
    totalTests,
    totalPassed,
    totalFailed:   totalTests - totalPassed,
    isAccepted:    finalVerdict === 'ACCEPTED',
    visibleResults,                       // Full detail
    hiddenSummary: hiddenResults.map((r, i) => ({
      caseNumber: i + 1,
      passed:     r.passed,
      // ⚠️ Never expose input or expected for hidden tests
    })),
    hiddenPassed,
    visiblePassed,
    executionTime: Math.max(
      ...visibleResults.map(r => r.executionTime || 0),
      ...hiddenResults.map(r => r.executionTime || 0)
    ),
  };
}

/**
 * Run code against an array of test cases.
 * @param {string}   code        - student source
 * @param {string}   language    - execution language
 * @param {Array}    testCases   - array of { input, expected }
 * @param {boolean}  exposeData  - whether to include input/expected in result
 */
async function runTestCases(code, language, testCases, exposeData) {
  const results = [];

  for (let i = 0; i < testCases.length; i++) {
    const tc = testCases[i];
    const start = Date.now();

    try {
      const result = await execService.execute({
        language,
        code,
        stdin:   tc.input,
        timeout: TIMEOUT_MS,
      });

      const actual  = (result.stdout || '').trim();
      const expected = String(tc.expected ?? '').trim();
      const passed  = validateOutput(actual, expected);
      const elapsed = Date.now() - start;

      const entry = {
        caseNumber:    i + 1,
        passed,
        executionTime: elapsed,
        timedOut:      result.timedOut || false,
        exitCode:      result.exitCode,
        error:         result.timedOut ? 'Time Limit Exceeded' : (result.exitCode !== 0 && result.stderr ? result.stderr.slice(0, 200) : null),
      };

      if (exposeData) {
        // Visible tests: reveal input, expected, actual, stderr
        entry.input    = tc.input;
        entry.expected = expected;
        entry.actual   = actual;
        entry.stderr   = result.stderr ? result.stderr.slice(0, 500) : '';
      }

      results.push(entry);
    } catch (err) {
      results.push({
        caseNumber:    i + 1,
        passed:        false,
        executionTime: Date.now() - start,
        error:         err.message,
        ...(exposeData ? { input: tc.input, expected: String(tc.expected), actual: '' } : {}),
      });
    }
  }

  return results;
}

module.exports = { judge };
