/**
 * API routes for listing management
 * Requirements: 4.5, 10.5
 */
const express = require('express');
const router = express.Router();
const { 
	createListing, 
	getListings, 
	getListingById, 
	updateListing,
	deleteListing
} = require('../controllers/listingController');
const { 
	validateSafetyWindow, 
	validateHygieneStatus 
} = require('../middlewares/safetyMiddleware');

/**
 * @swagger
 * /api/listings:
 *   post:
 *     summary: Create a new food listing
 *     description: Submit details about surplus food. Validates safety window and hygiene status before saving.
 *     tags:
 *       - Listings
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - foodType
 *               - quantity
 *               - preparedAt
 *               - hygieneStatus
 *             properties:
 *               foodType:
 *                 type: string
 *                 enum: [prepared_meal, fresh_produce, packaged_food, bakery_item, dairy_product]
 *                 example: prepared_meal
 *                 description: Category of food for safety window calculation
 *               quantity:
 *                 type: number
 *                 minimum: 1
 *                 example: 10
 *                 description: Quantity of food available
 *               preparedAt:
 *                 type: string
 *                 format: date-time
 *                 example: "2024-01-15T10:00:00.000Z"
 *                 description: ISO date string for when the food was prepared
 *               hygieneStatus:
 *                 type: string
 *                 enum: [excellent, good, acceptable]
 *                 example: good
 *                 description: Hygiene status of the food preparation
 *     responses:
 *       201:
 *         description: Listing created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Listing'
 *                 message:
 *                   type: string
 *                   example: "Listing created successfully"
 *       400:
 *         description: Invalid input or missing required fields
 *       422:
 *         description: Safety validation failed (expired food or poor hygiene)
 *       500:
 *         description: Server error
 */
router.post('/', 
	validateSafetyWindow,
	validateHygieneStatus,
	createListing
);

/**
 * @swagger
 * /api/listings:
 *   get:
 *     summary: Get all active food listings
 *     description: Retrieve all active listings, automatically marking expired ones before returning results.
 *     tags:
 *       - Listings
 *     responses:
 *       200:
 *         description: Array of active listing objects
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Listing'
 *                 message:
 *                   type: string
 *                   example: "Retrieved 5 active listings"
 *                 meta:
 *                   type: object
 *                   properties:
 *                     totalActive:
 *                       type: number
 *                       example: 5
 *                     expiredMarked:
 *                       type: number
 *                       example: 2
 *                     timestamp:
 *                       type: string
 *                       format: date-time
 *       500:
 *         description: Server error
 */
router.get('/', getListings);

/**
 * @swagger
 * /api/listings/{id}:
 *   get:
 *     summary: Get a specific listing by ID
 *     description: Retrieve a single listing by its ID, checking expiry status.
 *     tags:
 *       - Listings
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The listing ID
 *     responses:
 *       200:
 *         description: Listing retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Listing'
 *                 message:
 *                   type: string
 *                   example: "Listing retrieved successfully"
 *       404:
 *         description: Listing not found
 *       500:
 *         description: Server error
 */
router.get('/:id', getListingById);

/**
 * @swagger
 * /api/listings/{id}:
 *   put:
 *     summary: Update a listing status
 *     description: Update the status of a listing (e.g., mark as claimed).
 *     tags:
 *       - Listings
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The listing ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [active, expired, claimed]
 *                 example: claimed
 *                 description: New status for the listing
 *     responses:
 *       200:
 *         description: Listing updated successfully
 *       400:
 *         description: Invalid status value
 *       404:
 *         description: Listing not found
 *       500:
 *         description: Server error
 */
router.put('/:id', updateListing);

/**
 * @swagger
 * /api/listings/{id}:
 *   delete:
 *     summary: Delete a listing
 *     description: Permanently remove a listing from the system.
 *     tags:
 *       - Listings
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The listing ID
 *     responses:
 *       200:
 *         description: Listing deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     deletedListing:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: string
 *                         foodType:
 *                           type: string
 *                         quantity:
 *                           type: number
 *                         status:
 *                           type: string
 *                 message:
 *                   type: string
 *                   example: "Listing deleted successfully"
 *       404:
 *         description: Listing not found
 *       500:
 *         description: Server error
 */
router.delete('/:id', deleteListing);

module.exports = router;
