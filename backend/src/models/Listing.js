/**
 * @swagger
 * components:
 *   schemas:
 *     Listing:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: Unique identifier for the listing
 *         foodType:
 *           type: string
 *           enum: [prepared_meal, fresh_produce, packaged_food, bakery_item, dairy_product]
 *           description: Category of food for safety window calculation
 *         quantity:
 *           type: number
 *           minimum: 1
 *           description: Quantity of food available
 *         preparedAt:
 *           type: string
 *           format: date-time
 *           description: ISO date string for when the food was prepared
 *         expiryTime:
 *           type: string
 *           format: date-time
 *           description: ISO date string for when the food expires (auto-calculated)
 *         hygieneStatus:
 *           type: string
 *           enum: [excellent, good, acceptable]
 *           description: Hygiene status of the food preparation
 *         status:
 *           type: string
 *           enum: [active, expired, claimed]
 *           description: Current status of the listing
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Timestamp when listing was created
 *       required:
 *         - foodType
 *         - quantity
 *         - preparedAt
 *         - hygieneStatus
 */
const mongoose = require('mongoose');
const { config } = require('../config/env');

/**
 * Listing Schema for surplus food with safety validation
 * Requirements: 1.1, 1.2, 1.3, 5.3, 7.4
 */
const listingSchema = new mongoose.Schema({
	foodType: {
		type: String,
		required: [true, 'Food type is required'],
		enum: {
			values: ['prepared_meal', 'fresh_produce', 'packaged_food', 'bakery_item', 'dairy_product'],
			message: 'Food type must be one of: prepared_meal, fresh_produce, packaged_food, bakery_item, dairy_product'
		}
	},
	quantity: {
		type: Number,
		required: [true, 'Quantity is required'],
		min: [1, 'Quantity must be at least 1']
	},
	preparedAt: {
		type: Date,
		required: [true, 'Preparation time is required'],
		validate: {
			validator: function(value) {
				// Preparation time cannot be in the future
				return value <= new Date();
			},
			message: 'Preparation time cannot be in the future'
		}
	},
	expiryTime: {
		type: Date,
		// Remove required: true since we'll calculate it in pre-save
	},
	hygieneStatus: {
		type: String,
		required: [true, 'Hygiene status is required'],
		enum: {
			values: ['excellent', 'good', 'acceptable'],
			message: 'Hygiene status must be one of: excellent, good, acceptable'
		}
	},
	status: {
		type: String,
		default: 'active',
		enum: {
			values: ['active', 'expired', 'claimed'],
			message: 'Status must be one of: active, expired, claimed'
		}
	},
	createdAt: {
		type: Date,
		default: Date.now
	}
}, {
	timestamps: true
});

// Create database indexes for efficient querying
// Requirements: 7.4 - Database indexes for efficient querying
listingSchema.index({ status: 1, expiryTime: 1 }); // Compound index for expiry queries
listingSchema.index({ foodType: 1 }); // Index for food type filtering
listingSchema.index({ createdAt: -1 }); // Index for creation time sorting

/**
 * Pre-save middleware to calculate expiry time based on food type
 * Requirements: 2.1, 3.1
 */
listingSchema.pre('save', function(next) {
	if (this.isNew || this.isModified('preparedAt') || this.isModified('foodType')) {
		// Calculate expiry time based on food type and safety windows
		const safetyWindowHours = config.safetyWindows[this.foodType] || 4; // Default 4 hours
		const safetyWindowMs = safetyWindowHours * 60 * 60 * 1000;
		this.expiryTime = new Date(this.preparedAt.getTime() + safetyWindowMs);
	}
	next();
});

/**
 * Static method to check if a listing is expired
 * Requirements: 3.1, 3.4
 */
listingSchema.statics.isExpired = function(listing) {
	return new Date() > listing.expiryTime;
};

/**
 * Static method to check if a listing is safe for consumption
 * Requirements: 2.2, 5.1, 10.2
 */
listingSchema.statics.isSafe = function(listing) {
	// Food is safe if not expired and hygiene status is acceptable or better
	const acceptableHygieneStatuses = ['excellent', 'good', 'acceptable'];
	return !this.isExpired(listing) && acceptableHygieneStatuses.includes(listing.hygieneStatus);
};

/**
 * Instance method to check if this listing is expired
 */
listingSchema.methods.isExpired = function() {
	return this.constructor.isExpired(this);
};

/**
 * Instance method to check if this listing is safe
 */
listingSchema.methods.isSafe = function() {
	return this.constructor.isSafe(this);
};

/**
 * Static method to get safety window for a food type
 * Requirements: 2.1
 */
listingSchema.statics.getSafetyWindow = function(foodType) {
	return config.safetyWindows[foodType] || 4; // Default 4 hours
};

const Listing = mongoose.model('Listing', listingSchema);

module.exports = Listing;
