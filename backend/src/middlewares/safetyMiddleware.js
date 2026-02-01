/**
 * Safety validation middleware for food listings
 * Validates food safety before allowing listing creation
 * Requirements: 2.1, 2.2, 2.3, 5.1, 5.2, 10.1, 10.2, 10.3
 */
const { isWithinSafetyWindow, getSafetyWindow } = require('../utils/expiryUtils');
const { logSafetyViolation, logInfo, logError } = require('../utils/logger');

/**
 * Safety error codes for consistent error handling
 */
const SAFETY_ERRORS = {
	EXPIRED_FOOD: {
		code: 'SAFETY_001',
		message: 'Food has exceeded safety window',
		httpStatus: 422
	},
	INVALID_HYGIENE: {
		code: 'SAFETY_002', 
		message: 'Hygiene status does not meet minimum requirements',
		httpStatus: 422
	},
	FUTURE_PREPARATION: {
		code: 'SAFETY_003',
		message: 'Preparation time cannot be in the future',
		httpStatus: 400
	},
	MISSING_FIELDS: {
		code: 'SAFETY_004',
		message: 'Missing required fields for safety validation',
		httpStatus: 400
	}
};

/**
 * Validates safety window - ensures food is within acceptable time limits
 * Requirements: 2.1, 2.2, 2.3, 10.1, 10.2, 10.3
 */
const validateSafetyWindow = (req, res, next) => {
	try {
		const { preparedAt, foodType } = req.body;

		// Check for required fields
		if (!preparedAt || !foodType) {
			const error = SAFETY_ERRORS.MISSING_FIELDS;
			logSafetyViolation('MISSING_FIELDS', {
				preparedAt: !!preparedAt,
				foodType: !!foodType,
				missingFields: [
					!preparedAt && 'preparedAt',
					!foodType && 'foodType'
				].filter(Boolean)
			}, req);
			
			return res.status(error.httpStatus).json({
				success: false,
				error: error.message,
				code: error.code,
				details: {
					missingFields: [
						!preparedAt && 'preparedAt',
						!foodType && 'foodType'
					].filter(Boolean)
				}
			});
		}

		const preparedDate = new Date(preparedAt);
		const now = new Date();

		// Check if preparation time is in the future
		if (preparedDate > now) {
			const error = SAFETY_ERRORS.FUTURE_PREPARATION;
			logSafetyViolation('FUTURE_PREPARATION', {
				preparedAt,
				currentTime: now.toISOString()
			}, req);

			return res.status(error.httpStatus).json({
				success: false,
				error: error.message,
				code: error.code,
				details: {
					preparedAt,
					currentTime: now.toISOString()
				}
			});
		}

		// Check if food is within safety window
		if (!isWithinSafetyWindow(preparedDate, foodType)) {
			const error = SAFETY_ERRORS.EXPIRED_FOOD;
			const safetyWindow = getSafetyWindow(foodType);
			
			logSafetyViolation('EXPIRED_FOOD', {
				foodType,
				preparedAt,
				safetyWindowHours: safetyWindow,
				currentTime: now.toISOString()
			}, req);

			return res.status(error.httpStatus).json({
				success: false,
				error: error.message,
				code: error.code,
				details: {
					foodType,
					preparedAt,
					safetyWindowHours: safetyWindow,
					currentTime: now.toISOString(),
					message: `Food prepared at ${preparedAt} has exceeded the ${safetyWindow}-hour safety window for ${foodType}`
				}
			});
		}

		// Log successful safety window validation
		logInfo('Safety window validation passed', {
			foodType,
			preparedAt,
			safetyWindowHours: getSafetyWindow(foodType)
		});

		next();
	} catch (error) {
		logError('Error in safety window validation', {
			foodType: req.body.foodType,
			preparedAt: req.body.preparedAt
		}, error);
		
		return res.status(500).json({
			success: false,
			error: 'Internal server error during safety validation',
			details: process.env.NODE_ENV === 'development' ? error.message : undefined
		});
	}
};

/**
 * Validates hygiene status - ensures food meets minimum hygiene requirements
 * Requirements: 5.1, 5.2, 5.4, 5.5
 */
const validateHygieneStatus = (req, res, next) => {
	try {
		const { hygieneStatus } = req.body;

		// Check for required field
		if (!hygieneStatus) {
			const error = SAFETY_ERRORS.MISSING_FIELDS;
			logSafetyViolation('MISSING_FIELDS', {
				missingFields: ['hygieneStatus'],
				acceptableValues: ['excellent', 'good', 'acceptable']
			}, req);

			return res.status(error.httpStatus).json({
				success: false,
				error: 'Missing required field: hygieneStatus',
				code: error.code,
				details: {
					missingFields: ['hygieneStatus'],
					acceptableValues: ['excellent', 'good', 'acceptable']
				}
			});
		}

		// Validate hygiene status against acceptable values
		const acceptableStatuses = ['excellent', 'good', 'acceptable'];
		if (!acceptableStatuses.includes(hygieneStatus)) {
			const error = SAFETY_ERRORS.INVALID_HYGIENE;
			logSafetyViolation('INVALID_HYGIENE', {
				providedStatus: hygieneStatus,
				acceptableStatuses
			}, req);

			return res.status(error.httpStatus).json({
				success: false,
				error: error.message,
				code: error.code,
				details: {
					providedStatus: hygieneStatus,
					acceptableStatuses,
					message: `Hygiene status must be one of: ${acceptableStatuses.join(', ')}`
				}
			});
		}

		// Log successful hygiene validation
		logInfo('Hygiene validation passed', { hygieneStatus });

		next();
	} catch (error) {
		logError('Error in hygiene validation', {
			hygieneStatus: req.body.hygieneStatus
		}, error);
		
		return res.status(500).json({
			success: false,
			error: 'Internal server error during hygiene validation',
			details: process.env.NODE_ENV === 'development' ? error.message : undefined
		});
	}
};

/**
 * Combined safety middleware that runs both safety window and hygiene validation
 * Requirements: 4.5, 10.5
 */
const safetyMiddleware = (req, res, next) => {
	// Chain the middleware functions
	validateSafetyWindow(req, res, (err) => {
		if (err) return next(err);
		validateHygieneStatus(req, res, next);
	});
};

module.exports = {
	validateSafetyWindow,
	validateHygieneStatus,
	safetyMiddleware,
	SAFETY_ERRORS
};
