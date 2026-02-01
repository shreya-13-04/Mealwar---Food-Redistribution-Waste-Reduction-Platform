/**
 * Expiry utilities for managing food listing expiry and safety calculations
 * Requirements: 3.1, 3.3, 3.5
 */
const Listing = require('../models/Listing');
const { config } = require('../config/env');
const { logDatabaseOperation, logError, logInfo } = require('./logger');

/**
 * Calculate expiry time based on preparation time and food type
 * @param {Date} preparedAt - When the food was prepared
 * @param {string} foodType - Type of food (prepared_meal, fresh_produce, etc.)
 * @returns {Date} Calculated expiry time
 * Requirements: 2.1, 3.1
 */
function calculateExpiryTime(preparedAt, foodType) {
	if (!preparedAt || !foodType) {
		throw new Error('Both preparedAt and foodType are required');
	}

	const safetyWindowHours = config.safetyWindows[foodType] || 4; // Default 4 hours
	const safetyWindowMs = safetyWindowHours * 60 * 60 * 1000;
	
	return new Date(preparedAt.getTime() + safetyWindowMs);
}

/**
 * Marks expired listings as 'expired' status in bulk operation
 * @returns {Promise<number>} Number of listings updated
 * Requirements: 3.1, 3.2, 3.3
 */
async function markExpiredListings() {
	const startTime = Date.now();
	
	try {
		const now = new Date();
		const result = await Listing.updateMany(
			{ 
				expiryTime: { $lt: now }, 
				status: 'active' 
			},
			{ 
				$set: { status: 'expired' } 
			}
		);

		const duration = Date.now() - startTime;
		
		logDatabaseOperation('markExpiredListings', {
			expiredCount: result.modifiedCount,
			matchedCount: result.matchedCount
		}, duration);

		if (result.modifiedCount > 0) {
			logInfo(`Marked ${result.modifiedCount} listings as expired`);
		}

		return result.modifiedCount;
	} catch (error) {
		const duration = Date.now() - startTime;
		logDatabaseOperation('markExpiredListings', {}, duration, error);
		throw error;
	}
}

/**
 * Simple boolean check for expiry status
 * @param {Date} expiryTime - The expiry time to check
 * @returns {boolean} True if expired, false otherwise
 * Requirements: 3.1, 3.4
 */
function isExpired(expiryTime) {
	if (!expiryTime) {
		throw new Error('Expiry time is required');
	}
	return new Date() > expiryTime;
}

/**
 * Check if food is within safety window based on preparation time and food type
 * @param {Date} preparedAt - When the food was prepared
 * @param {string} foodType - Type of food
 * @returns {boolean} True if within safety window, false otherwise
 * Requirements: 2.1, 2.2, 10.1, 10.2
 */
function isWithinSafetyWindow(preparedAt, foodType) {
	if (!preparedAt || !foodType) {
		return false;
	}

	const expiryTime = calculateExpiryTime(preparedAt, foodType);
	return !isExpired(expiryTime);
}

/**
 * Get safety window duration for a specific food type
 * @param {string} foodType - Type of food
 * @returns {number} Safety window in hours
 * Requirements: 2.1
 */
function getSafetyWindow(foodType) {
	return config.safetyWindows[foodType] || 4; // Default 4 hours
}

/**
 * Get all active (non-expired) listings
 * @returns {Promise<Array>} Array of active listings
 * Requirements: 3.4
 */
async function getActiveListings() {
	const startTime = Date.now();
	
	try {
		// First mark expired listings
		await markExpiredListings();
		
		// Then return only active listings
		const listings = await Listing.find({ status: 'active' }).sort({ createdAt: -1 });
		
		const duration = Date.now() - startTime;
		logDatabaseOperation('getActiveListings', {
			count: listings.length
		}, duration);
		
		return listings;
	} catch (error) {
		const duration = Date.now() - startTime;
		logDatabaseOperation('getActiveListings', {}, duration, error);
		throw error;
	}
}

/**
 * Perform on-demand expiry checking for real-time validation
 * @param {string} listingId - ID of the listing to check
 * @returns {Promise<Object>} Updated listing or null if not found
 * Requirements: 3.5
 */
async function checkListingExpiry(listingId) {
	const startTime = Date.now();
	
	try {
		const listing = await Listing.findById(listingId);
		
		if (!listing) {
			const duration = Date.now() - startTime;
			logDatabaseOperation('checkListingExpiry', {
				listingId,
				found: false
			}, duration);
			return null;
		}

		if (isExpired(listing.expiryTime) && listing.status === 'active') {
			listing.status = 'expired';
			await listing.save();
			logInfo(`Listing ${listingId} marked as expired`);
		}

		const duration = Date.now() - startTime;
		logDatabaseOperation('checkListingExpiry', {
			listingId,
			found: true,
			wasExpired: listing.status === 'expired'
		}, duration);

		return listing;
	} catch (error) {
		const duration = Date.now() - startTime;
		logDatabaseOperation('checkListingExpiry', { listingId }, duration, error);
		throw error;
	}
}

module.exports = {
	calculateExpiryTime,
	markExpiredListings,
	isExpired,
	isWithinSafetyWindow,
	getSafetyWindow,
	getActiveListings,
	checkListingExpiry
};
