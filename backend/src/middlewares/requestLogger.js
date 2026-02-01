/**
 * Request logger middleware
 * Requirements: 6.1, 6.5
 *
 * IMPORTANT:
 * - Must NOT crash the app if logging fails.
 * - Must preserve original res.end() behavior and argument shape.
 */

const { logApiRequest, logInfo } = require('../utils/logger');

const requestLogger = (req, res, next) => {
  const startTime = Date.now();
  const originalEnd = res.end;

  res.end = function wrappedEnd() {
    const durationMs = Date.now() - startTime;

    try {
      logApiRequest(req, res, durationMs);
    } catch (err) {
      console.error('requestLogger failed:', err.message);
      // swallow error (graceful failure)
    }

    // ✅ Preserve EXACT argument list that caller gave to res.end(...)
    return originalEnd.apply(this, arguments);
  };

  next();
};

const simpleRequestLogger = (req, res, next) => {
  try {
    logInfo(`${req.method} ${req.originalUrl}`, {
      ip: req.ip,
      userAgent: req.get?.('User-Agent'),
      timestamp: new Date().toISOString()
    });
  } catch (err) {
    console.error('simpleRequestLogger failed:', err.message);
  }

  next();
};

module.exports = { requestLogger, simpleRequestLogger };
