
const mongoose = require('mongoose');
const { logError, logInfo, logWarning } = require('../utils/logger');

/**
 * Database configuration module for MongoDB Atlas connection
 * Handles connection establishment, error handling, and graceful shutdown
 * Requirements: 7.1, 7.2, 8.1, 8.3, 8.4
 */

const connectDB = async () => {
	try {
		// Validate required environment variables
		if (!process.env.MONGODB_URI) {
			throw new Error('MONGODB_URI environment variable is required');
		}

		// Connect to MongoDB Atlas with proper options
		const conn = await mongoose.connect(process.env.MONGODB_URI, {
			useNewUrlParser: true,
			useUnifiedTopology: true,
			maxPoolSize: 10, // Maintain up to 10 socket connections
			serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
			socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
		});

		logInfo('MongoDB connected successfully', {
			host: conn.connection.host,
			database: conn.connection.name,
			readyState: conn.connection.readyState
		});
		
		// Handle connection events for monitoring and logging
		mongoose.connection.on('error', (err) => {
			logError('MongoDB connection error', {}, err);
		});

		mongoose.connection.on('disconnected', () => {
			logWarning('MongoDB disconnected');
		});

		mongoose.connection.on('reconnected', () => {
			logInfo('MongoDB reconnected');
		});

		// Graceful shutdown handling
		const gracefulShutdown = async (signal) => {
			logInfo(`${signal} received, closing MongoDB connection...`);
			try {
				await mongoose.connection.close();
				logInfo('MongoDB connection closed through app termination');
				process.exit(0);
			} catch (error) {
				logError('Error during MongoDB shutdown', {}, error);
				process.exit(1);
			}
		};

		process.on('SIGINT', () => gracefulShutdown('SIGINT'));
		process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));

		return conn;

	} catch (error) {
		logError('MongoDB connection failed', {
			errorName: error.name,
			connectionString: process.env.MONGODB_URI ? 'Present' : 'Missing'
		}, error);
		
		// Log additional connection details for debugging
		if (error.name === 'MongoServerSelectionError') {
			logError('MongoDB Atlas connection troubleshooting', {
				suggestions: [
					'Check network connectivity',
					'Verify MongoDB Atlas cluster status',
					'Validate connection string format',
					'Confirm database user permissions'
				]
			});
		}
		
		process.exit(1);
	}
};

module.exports = connectDB;
