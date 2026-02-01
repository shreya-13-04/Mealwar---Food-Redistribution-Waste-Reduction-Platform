/**
 * Comprehensive error handling middleware
 * Requirements: 6.1, 6.2, 6.3, 6.5, 7.3
 */
const { logError, logWarning } = require('../utils/logger');

/**
 * Main error handling middleware
 * Handles all types of errors with appropriate logging and response formatting
 */
const errorHandler = (err, req, res, next) => {
	// Log error with structured logging
	const requestContext = {
		url: req.originalUrl,
		method: req.method,
		ip: req.ip,
		userAgent: req.get('User-Agent'),
		body: req.body,
		params: req.params,
		query: req.query
	};

	logError('Application error occurred', requestContext, err);

	// Handle different types of errors
	let statusCode = 500;
	let errorResponse = {
		success: false,
		error: 'Internal Server Error',
		timestamp: new Date().toISOString()
	};

	// MongoDB/Mongoose validation errors
	if (err.name === 'ValidationError') {
		statusCode = 400;
		errorResponse.error = 'Validation Error';
		errorResponse.details = Object.values(err.errors).map(e => ({
			field: e.path,
			message: e.message,
			value: e.value
		}));
		logError('Mongoose validation error', { details: errorResponse.details });
	}
	// MongoDB duplicate key error
	else if (err.code === 11000) {
		statusCode = 409;
		errorResponse.error = 'Duplicate Entry';
		errorResponse.details = {
			message: 'A record with this information already exists',
			duplicateFields: Object.keys(err.keyPattern || {})
		};
		logError('MongoDB duplicate key error', { keyPattern: err.keyPattern });
	}
	// MongoDB connection errors
	else if (err.name === 'MongoError' || err.name === 'MongoServerError') {
		statusCode = 503;
		errorResponse.error = 'Database Service Unavailable';
		errorResponse.details = {
			message: 'Database connection issue. Please try again later.'
		};
		logError('MongoDB connection error', { errorName: err.name });
	}
	// MongoDB network timeout errors
	else if (err.name === 'MongoNetworkTimeoutError') {
		statusCode = 504;
		errorResponse.error = 'Database Timeout';
		errorResponse.details = {
			message: 'Database operation timed out. Please try again.'
		};
		logError('MongoDB timeout error', { timeout: err.timeout });
	}
	// Cast errors (invalid ObjectId, etc.)
	else if (err.name === 'CastError') {
		statusCode = 400;
		errorResponse.error = 'Invalid Data Format';
		errorResponse.details = {
			field: err.path,
			value: err.value,
			message: `Invalid ${err.kind} format for field '${err.path}'`
		};
		logError('MongoDB cast error', { 
			field: err.path, 
			value: err.value, 
			kind: err.kind 
		});
	}
	// JWT errors
	else if (err.name === 'JsonWebTokenError') {
		statusCode = 401;
		errorResponse.error = 'Invalid Token';
		errorResponse.details = {
			message: 'Authentication token is invalid'
		};
		logWarning('JWT validation error', { reason: err.message });
	}
	// Token expired errors
	else if (err.name === 'TokenExpiredError') {
		statusCode = 401;
		errorResponse.error = 'Token Expired';
		errorResponse.details = {
			message: 'Authentication token has expired'
		};
		logWarning('JWT token expired', { expiredAt: err.expiredAt });
	}
	// Rate limiting errors
	else if (err.name === 'TooManyRequestsError') {
		statusCode = 429;
		errorResponse.error = 'Too Many Requests';
		errorResponse.details = {
			message: 'Rate limit exceeded. Please try again later.',
			retryAfter: err.retryAfter
		};
		logWarning('Rate limit exceeded', { 
			ip: req.ip, 
			retryAfter: err.retryAfter 
		});
	}
	// Custom application errors with status codes
	else if (err.status || err.statusCode) {
		statusCode = err.status || err.statusCode;
		errorResponse.error = err.message || 'Application Error';
		if (err.details) {
			errorResponse.details = err.details;
		}
		logError('Custom application error', { 
			statusCode, 
			details: err.details 
		});
	}
	// Generic errors
	else {
		// In development, include more error details
		if (process.env.NODE_ENV === 'development') {
			errorResponse.error = err.message;
			errorResponse.stack = err.stack;
		}
		logError('Unhandled application error', { 
			errorName: err.name,
			isDevelopment: process.env.NODE_ENV === 'development'
		});
	}

	// Add request context for debugging
	if (process.env.NODE_ENV === 'development') {
		errorResponse.requestContext = {
			url: req.originalUrl,
			method: req.method,
			body: req.body,
			params: req.params,
			query: req.query
		};
	}

	res.status(statusCode).json(errorResponse);
};

/**
 * 404 Not Found handler for undefined routes
 */
const notFoundHandler = (req, res) => {
	const errorResponse = {
		success: false,
		error: 'Route not found',
		message: `Cannot ${req.method} ${req.originalUrl}`,
		timestamp: new Date().toISOString()
	};

	logWarning('Route not found', {
		method: req.method,
		url: req.originalUrl,
		ip: req.ip,
		userAgent: req.get('User-Agent')
	});

	res.status(404).json(errorResponse);
};

/**
 * Async error wrapper to catch async errors in route handlers
 */
const asyncHandler = (fn) => {
	return (req, res, next) => {
		Promise.resolve(fn(req, res, next)).catch(next);
	};
};

module.exports = {
	errorHandler,
	notFoundHandler,
	asyncHandler
};
