function validateOutput(actual, expected) {
  // Trim and compare, but also handle common variations (extra newline, spaces)
  const normalize = (str) => str.trim().replace(/\r\n/g, "\n");
  return normalize(actual) === normalize(expected);
}

module.exports = { validateOutput };
