/**
 * utils/testcaseValidator.js
 * Flexible output comparison for judge.
 * Handles whitespace normalization, floating-point tolerance, and exact match.
 */

/**
 * Compare student's actual output with expected output.
 * Returns true if they match under these rules:
 *   1. Trim leading/trailing whitespace.
 *   2. Normalize internal whitespace (multiple spaces → single).
 *   3. Treat each line independently.
 *   4. Floating-point tolerance: ±0.01 for numbers.
 *
 * @param {string} actual   - stdout from student's execution
 * @param {string} expected - reference output
 * @returns {boolean}
 */
function validateOutput(actual, expected) {
  if (typeof actual   !== 'string') actual   = String(actual   ?? '');
  if (typeof expected !== 'string') expected = String(expected ?? '');

  // Trim & normalize whitespace on both
  const normalize = s => s
    .replace(/\r\n/g, '\n')   // Windows line endings
    .replace(/\r/g, '\n')
    .trim()
    .split('\n')
    .map(line => line.trim().replace(/\s+/g, ' '))
    .join('\n');

  const normActual   = normalize(actual);
  const normExpected = normalize(expected);

  // Fast path: exact match after normalization
  if (normActual === normExpected) return true;

  // Per-line comparison with float tolerance
  const aLines = normActual.split('\n');
  const eLines = normExpected.split('\n');

  if (aLines.length !== eLines.length) return false;

  for (let i = 0; i < eLines.length; i++) {
    const al = aLines[i], el = eLines[i];
    if (al === el) continue;

    // Try float comparison (e.g. "3.14" vs "3.141592...")
    if (floatLineMatch(al, el)) continue;

    return false;
  }

  return true;
}

/**
 * Compare two single-line strings token by token.
 * Numbers within ±0.01 are considered equal.
 */
function floatLineMatch(a, b) {
  const aToks = a.split(/\s+/);
  const bToks = b.split(/\s+/);
  if (aToks.length !== bToks.length) return false;
  for (let i = 0; i < bToks.length; i++) {
    const av = parseFloat(aToks[i]), bv = parseFloat(bToks[i]);
    if (!isNaN(av) && !isNaN(bv)) {
      if (Math.abs(av - bv) <= 0.01) continue;
      return false;
    }
    if (aToks[i] !== bToks[i]) return false;
  }
  return true;
}

module.exports = { validateOutput };
