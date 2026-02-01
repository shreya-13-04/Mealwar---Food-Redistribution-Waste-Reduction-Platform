const express = require('express');

// Load and validate environment configuration first
const { config, validateEnvironment } = require('./config/env');

// Validate environment variables at startup
try {
	validateEnvironment();
} catch (error) {
	console.error('Environment validation failed:', error.message);
	process.exit(1);
}

const app = express();
const PORT = config.port;

// Connect to database (skip in test environment)
if (process.env.NODE_ENV !== 'test') {
	const connectDB = require('./config/db');
	connectDB().catch(error => {
		console.error('Database connection failed, continuing without database:', error.message);
		// Continue running without database for testing purposes
	});
}

// Basic middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// CORS middleware (basic setup)
app.use((req, res, next) => {
	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
	res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
	
	if (req.method === 'OPTIONS') {
		res.sendStatus(200);
	} else {
		next();
	}
});

// Request logging middleware (only if enabled)
if (config.enableRequestLogging) {
	app.use((req, res, next) => {
		console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`, {
			ip: req.ip,
			userAgent: req.get('User-Agent')
		});
		next();
	});
}

// Swagger setup
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const swaggerDefinition = {
	openapi: '3.0.0',
	info: {
		title: 'Surplus Listing Backend API',
		version: '1.0.0',
		description: 'API documentation for Surplus Food Listing Platform with Safety Rules',
	},
	servers: [
		{
			url: `http://localhost:${PORT}`,
			description: 'Development server',
		},
	],
};

const options = {
	swaggerDefinition,
	apis: ['./src/routes/*.js', './src/controllers/*.js', './src/models/*.js'],
};

const swaggerSpec = swaggerJsdoc(options);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Health check endpoint
app.get('/', (req, res) => {
	res.json({
		message: 'Surplus Listing Backend is running!',
		version: '1.0.0',
		timestamp: new Date().toISOString(),
		environment: config.nodeEnv,
		status: 'healthy'
	});
});

// Health check endpoint for monitoring
app.get('/health', (req, res) => {
	res.json({
		status: 'healthy',
		timestamp: new Date().toISOString(),
		environment: config.nodeEnv,
		uptime: process.uptime(),
		memory: process.memoryUsage()
	});
});

// API Routes
app.use('/api/listings', require('./routes/listingRoutes'));

// Import error handlers
const { errorHandler, notFoundHandler } = require('./middlewares/errorHandler');

// 404 handler for undefined routes (must be before error handler)
app.use(notFoundHandler);

// Error handler middleware (must be last)
app.use(errorHandler);

// Graceful shutdown handling
const gracefulShutdown = (signal) => {
	console.log(`${signal} received, shutting down gracefully`);
	process.exit(0);
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
	console.error('Uncaught Exception:', error);
	process.exit(1);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
	console.error('Unhandled Rejection at:', promise, 'reason:', reason);
	process.exit(1);
});

// Start server only if this file is run directly
if (require.main === module) {
	app.listen(PORT, () => {
		console.log(`Server is running on port ${PORT}`);
		console.log(`Environment: ${config.nodeEnv}`);
		console.log(`API Documentation: http://localhost:${PORT}/api-docs`);
		console.log(`Health Check: http://localhost:${PORT}/health`);
	});
}

module.exports = app;
