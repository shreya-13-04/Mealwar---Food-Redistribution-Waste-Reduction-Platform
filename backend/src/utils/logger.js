/**
 * Centralized logging utility for consistent error handling and logging
 * Requirements: 6.1, 6.2, 6.5
 */

const { config } = require('../config/env');

/**
 * Log levels for different types of messages
 */
const LOG_LEVELS = {
	ERROR: 'ERROR',
	WARN: 'WARN',
	INFO: 'INFO',
	DEBUG: 'DEBUG'
};

/**
 * Create a structured log entry with consistent formatting
 * @param {string} level - Log level (ERROR, WARN, INFO, DEBUG)
 * @param {string} message - Log message
 * @param {Object} context - Additional context information
 * @param {Error} error - Error object (optional)
 */
function createLogEntry(level, message, context = {}, error = null) {
	const logEntry = {
		timestamp: new Date().toISOString(),
		level,
		message,
		...context
	};

	if (error) {
		logEntry.error = {
			name: error.name,
			message: error.message,
			stack: config.isDevelopment ? error.stack : undefined
		};
	}

	return logEntry;
}

/**
 * Log error messages with structured format
 * @param {string} message - Error message
 * @param {Object} context - Additional context
 * @param {Error} error - Error object
 */
function logError(message, context = {}, error = null) {
	const logEntry = createLogEntry(LOG_LEVELS.ERROR, message, context, error);
	console.error(JSON.stringify(logEntry, null, config.isDevelopment ? 2 : 0));
}

/**
 * Log warning messages
 * @param {string} message - Warning message
 * @param {Object} context - Additional context
 */
function logWarning(message, context = {}) {
	const logEntry = createLogEntry(LOG_LEVELS.WARN, message, context);
	console.warn(JSON.stringify(logEntry, null, config.isDevelopment ? 2 : 0));
}

/**
 * Log info messages
 * @param {string} message - Info message
 * @param {Object} context - Additional context
 */
function logInfo(message, context = {}) {
	const logEntry = createLogEntry(LOG_LEVELS.INFO, message, context);
	console.log(JSON.stringify(logEntry, null, config.isDevelopment ? 2 : 0));
}

/**
 * Log debug messages (only in development)
 * @param {string} message - Debug message
 * @param {Object} context - Additional context
 */
function logDebug(message, context = {}) {
	if (config.isDevelopment) {
		const logEntry = createLogEntry(LOG_LEVELS.DEBUG, message, context);
		console.log(JSON.stringify(logEntry, null, 2));
	}
}

/**
 * Log safety violations with specific formatting
 * @param {string} violationType - Type of safety violation
 * @param {Object} details - Violation details
 * @param {Object} request - Request context
 */
function logSafetyViolation(violationType, details, request = {}) {
	const context = {
		violationType,
		details,
		request: {
			ip: request.ip,
			userAgent: request.get ? request.get('User-Agent') : undefined,
			url: request.originalUrl,
			method: request.method
		}
	};

	const logEntry = createLogEntry(LOG_LEVELS.ERROR, 'Safety validation failed', context);
	console.error(JSON.stringify(logEntry, null, config.isDevelopment ? 2 : 0));
}

/**
 * Log database operations with performance metrics
 * @param {string} operation - Database operation name
 * @param {Object} details - Operation details
 * @param {number} duration - Operation duration in ms
 * @param {Error} error - Error if operation failed
 */
function logDatabaseOperation(operation, details, duration, error = null) {
	const context = {
		operation,
		details,
		duration: `${duration}ms`,
		performance: duration > 1000 ? 'SLOW' : 'NORMAL'
	};

	if (error) {
		logError(`Database operation failed: ${operation}`, context, error);
	} else {
		logInfo(`Database operation completed: ${operation}`, context);
	}
}

/**
 * Log API requests with response details
 * @param {Object} request - Express request object
 * @param {Object} response - Express response object
 * @param {number} duration - Request duration in ms
 */
function logApiRequest(request, response, duration) {
	const context = {
		method: request.method,
		url: request.originalUrl,
		statusCode: response.statusCode,
		duration: `${duration}ms`,
		ip: request.ip,
		userAgent: request.get('User-Agent')
	};

	const level = response.statusCode >= 400 ? LOG_LEVELS.ERROR : LOG_LEVELS.INFO;
	const message = `API ${request.method} ${request.originalUrl} - ${response.statusCode}`;

	if (level === LOG_LEVELS.ERROR) {
		logError(message, context);
	} else {
		logInfo(message, context);
	}
}

module.exports = {
	LOG_LEVELS,
	logError,
	logWarning,
	logInfo,
	logDebug,
	logSafetyViolation,
	logDatabaseOperation,
	logApiRequest,
	createLogEntry
};