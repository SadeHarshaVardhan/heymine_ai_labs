/**
 * Centralized Error Handling Middleware for Express
 */
function errorHandler(err, req, res, _next) {
  const statusCode = err.statusCode || res.statusCode || 500;
  const isProd = process.env.NODE_ENV === "production";

  console.error(`[Error] ${req.method} ${req.url} — Status: ${statusCode} — ${err.stack || err.message}`);

  res.status(statusCode === 200 ? 500 : statusCode).json({
    success: false,
    error: err.message || "Internal server error",
    ...(isProd ? {} : { stack: err.stack }),
  });
}

module.exports = { errorHandler };
