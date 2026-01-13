/**
 * Error Handling & Validation Middleware
 * Centralized error handling for all routes and requests
 */

const REQUIRED_ENV_VARS = [
  'MONGODB_URI',
  'JWT_SECRET',
];

/**
 * Validate that all required environment variables are set
 * Called at app startup to fail fast
 */
function validateEnv() {
  const missing = REQUIRED_ENV_VARS.filter(key => !process.env[key]);

  if (missing.length > 0) {
    console.error('[ENV] Missing required environment variables:', missing);
    throw new Error(`Missing env vars: ${missing.join(', ')}`);
  }

  console.log('[ENV] All required environment variables are set ✓');
}

/**
 * Global error handler middleware
 * Catches all errors from routes and converts them to proper JSON responses
 */
function errorHandler(err, req, res, next) {
  const isDev = process.env.NODE_ENV === 'development';
  const timestamp = new Date().toISOString();
  const requestId = req.id || Math.random().toString(36).substr(2, 9);

  // Log error with context
  console.error('[ERROR]', {
    requestId,
    timestamp,
    method: req.method,
    path: req.path,
    status: err.statusCode || 500,
    message: err.message,
    stack: isDev ? err.stack : undefined,
  });

  // Determine status code
  let statusCode = err.statusCode || err.status || 500;
  if (statusCode < 400 || statusCode > 599) {
    statusCode = 500;
  }

  // Build response
  const response = {
    success: false,
    message: err.message || 'Internal server error',
    timestamp,
    requestId,
  };

  // Include stack trace in development
  if (isDev && err.stack) {
    response.stack = err.stack;
  }

  // Include validation errors if present
  if (err.errors) {
    response.errors = err.errors;
  }

  res.status(statusCode).json(response);
}

/**
 * Async error wrapper for route handlers
 * Wraps async route handlers to catch Promise rejections
 */
function asyncHandler(fn) {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

/**
 * Create a custom error with statusCode
 */
class AppError extends Error {
  constructor(message, statusCode = 500) {
    super(message);
    this.statusCode = statusCode;
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = {
  validateEnv,
  errorHandler,
  asyncHandler,
  AppError,
};
