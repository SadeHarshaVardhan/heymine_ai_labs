/**
 * Azure Container Apps friendly HTTP request logger
 */
function requestLogger(req, res, next) {
  const start = Date.now();
  res.on("finish", () => {
    const duration = Date.now() - start;
    const logObj = {
      timestamp: new Date().toISOString(),
      method: req.method,
      url: req.originalUrl || req.url,
      status: res.statusCode,
      durationMs: duration,
      ip: req.headers["x-forwarded-for"] || req.socket.remoteAddress,
      userAgent: req.headers["user-agent"],
    };
    console.log(JSON.stringify(logObj));
  });
  next();
}

module.exports = { requestLogger };
