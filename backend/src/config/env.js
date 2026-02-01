/**
 * Environment configuration module
 * Validates and provides access to all required environment variables
 * Requirements: 8.1, 8.3, 8.4
 */

const dotenv = require('dotenv');
const path = require('path');

// Load environment variables from .env file
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

/**
 * Validates that all required environment variables are present
 * @throws {Error} If any required environment variable is missing
 */
const validateEnvironment = () => {
	const requiredEnvVars = [
		'MONGODB_URI',
		'PORT',
		'NODE_ENV'
	];

	const missingEnvVars = requiredEnvVars.filter(envVar => !process.env[envVar]);

	if (missingEnvVars.length > 0) {
		const errorMessage = `Missing required environment variables: ${missingEnvVars.join(', ')}`;
		console.error(errorMessage);
		console.error('Please check your .env file and ensure all required variables are set');
		throw new Error(errorMessage);
	}

	// Validate safety window configurations
	const safetyWindowVars = [
		'PREPARED_MEAL_SAFETY_WINDOW',
		'FRESH_PRODUCE_SAFETY_WINDOW',
		'PACKAGED_FOOD_SAFETY_WINDOW',
		'BAKERY_ITEM_SAFETY_WINDOW',
		'DAIRY_PRODUCT_SAFETY_WINDOW'
	];

	const missingSafetyVars = safetyWindowVars.filter(envVar => !process.env[envVar]);
	if (missingSafetyVars.length > 0) {
		console.warn('Warning: Missing safety window configurations:', missingSafetyVars.join(', '));
		console.warn('Using default safety window values');
	}
};

/**
 * Configuration object with all environment variables
 */
const config = {
	// Server configuration
	port: parseInt(process.env.PORT) || 3001,
	nodeEnv: process.env.NODE_ENV || 'development',
	
	// Database configuration
	mongodbUri: process.env.MONGODB_URI,
	
	// Safety window configuration (in hours)
	safetyWindows: {
		prepared_meal: parseInt(process.env.PREPARED_MEAL_SAFETY_WINDOW) || 4,
		fresh_produce: parseInt(process.env.FRESH_PRODUCE_SAFETY_WINDOW) || 24,
		packaged_food: parseInt(process.env.PACKAGED_FOOD_SAFETY_WINDOW) || 720, // 30 days
		bakery_item: parseInt(process.env.BAKERY_ITEM_SAFETY_WINDOW) || 12,
		dairy_product: parseInt(process.env.DAIRY_PRODUCT_SAFETY_WINDOW) || 168 // 7 days
	},
	
	// Logging configuration
	logLevel: process.env.LOG_LEVEL || 'info',
	enableRequestLogging: process.env.ENABLE_REQUEST_LOGGING === 'true',
	
	// Development flags
	isDevelopment: process.env.NODE_ENV === 'development',
	isProduction: process.env.NODE_ENV === 'production',
	isTesting: process.env.NODE_ENV === 'test'
};

// Validate environment on module load
try {
	validateEnvironment();
	console.log(`Environment validated successfully (${config.nodeEnv})`);
} catch (error) {
	console.error('Environment validation failed:', error.message);
	if (config.nodeEnv !== 'test') {
		process.exit(1);
	}
}

module.exports = {
	config,
	validateEnvironment
};