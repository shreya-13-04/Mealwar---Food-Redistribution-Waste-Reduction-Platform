/**
 * Test server for API testing without MongoDB connection
 * This allows you to test all API endpoints and safety validation
 * without database timeout issues
 */

const express = require('express');
const app = express();
const PORT = 3002; // Different port to avoid conflicts

// Basic middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// CORS middleware
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

// Request logging
app.use((req, res, next) => {
	console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
	next();
});

// Import safety middleware
const { 
	validateSafetyWindow, 
	validateHygieneStatus 
} = require('./src/middlewares/safetyMiddleware');

// Mock database operations for testing
const mockListings = [];
let nextId = 1;

// Health check endpoint
app.get('/', (req, res) => {
	res.json({
		message: 'Surplus Listing Test Server is running!',
		version: '1.0.0',
		timestamp: new Date().toISOString(),
		environment: 'test',
		status: 'healthy'
	});
});

app.get('/health', (req, res) => {
	res.json({
		status: 'healthy',
		timestamp: new Date().toISOString(),
		environment: 'test',
		uptime: process.uptime(),
		memory: process.memoryUsage()
	});
});

// Mock listing creation (with safety validation)
app.post('/api/listings', 
	validateSafetyWindow,
	validateHygieneStatus,
	(req, res) => {
		try {
			const { foodType, quantity, preparedAt, hygieneStatus } = req.body;

			// Validate required fields
			const requiredFields = ['foodType', 'quantity', 'preparedAt', 'hygieneStatus'];
			const missingFields = requiredFields.filter(field => !req.body[field]);

			if (missingFields.length > 0) {
				return res.status(400).json({
					success: false,
					error: 'Missing required fields',
					details: {
						missingFields,
						requiredFields
					}
				});
			}

			// Calculate expiry time (simplified)
			const safetyWindows = {
				prepared_meal: 4,
				fresh_produce: 24,
				packaged_food: 720,
				bakery_item: 12,
				dairy_product: 168
			};

			const safetyWindowHours = safetyWindows[foodType] || 4;
			const preparedDate = new Date(preparedAt);
			const expiryTime = new Date(preparedDate.getTime() + (safetyWindowHours * 60 * 60 * 1000));

			// Create mock listing
			const listing = {
				_id: `mock_${nextId++}`,
				foodType,
				quantity: parseInt(quantity),
				preparedAt: preparedDate.toISOString(),
				expiryTime: expiryTime.toISOString(),
				hygieneStatus,
				status: 'active',
				createdAt: new Date().toISOString()
			};

			mockListings.push(listing);

			console.log('✅ Listing created successfully:', {
				listingId: listing._id,
				foodType,
				quantity,
				expiryTime: listing.expiryTime
			});

			res.status(201).json({
				success: true,
				data: listing,
				message: 'Listing created successfully'
			});

		} catch (error) {
			console.error('❌ Error creating listing:', error.message);
			res.status(500).json({
				success: false,
				error: 'Internal server error',
				details: error.message
			});
		}
	}
);

// Get all listings
app.get('/api/listings', (req, res) => {
	try {
		// Filter out expired listings
		const now = new Date();
		const activeListings = mockListings.filter(listing => {
			const expiryTime = new Date(listing.expiryTime);
			return expiryTime > now && listing.status === 'active';
		});

		console.log(`✅ Retrieved ${activeListings.length} active listings`);

		res.status(200).json({
			success: true,
			data: activeListings,
			message: `Retrieved ${activeListings.length} active listings`,
			meta: {
				totalActive: activeListings.length,
				totalStored: mockListings.length,
				timestamp: new Date().toISOString()
			}
		});

	} catch (error) {
		console.error('❌ Error retrieving listings:', error.message);
		res.status(500).json({
			success: false,
			error: 'Internal server error'
		});
	}
});

// Get listing by ID
app.get('/api/listings/:id', (req, res) => {
	try {
		const { id } = req.params;
		const listing = mockListings.find(l => l._id === id);

		if (!listing) {
			return res.status(404).json({
				success: false,
				error: 'Listing not found'
			});
		}

		res.status(200).json({
			success: true,
			data: listing,
			message: 'Listing retrieved successfully'
		});

	} catch (error) {
		console.error('❌ Error retrieving listing:', error.message);
		res.status(500).json({
			success: false,
			error: 'Internal server error'
		});
	}
});

// Update listing
app.put('/api/listings/:id', (req, res) => {
	try {
		const { id } = req.params;
		const { status } = req.body;

		const listing = mockListings.find(l => l._id === id);

		if (!listing) {
			return res.status(404).json({
				success: false,
				error: 'Listing not found'
			});
		}

		if (status && !['active', 'expired', 'claimed'].includes(status)) {
			return res.status(400).json({
				success: false,
				error: 'Invalid status',
				details: {
					validStatuses: ['active', 'expired', 'claimed']
				}
			});
		}

		if (status) {
			listing.status = status;
		}

		console.log(`✅ Listing ${id} updated to status: ${status}`);

		res.status(200).json({
			success: true,
			data: listing,
			message: 'Listing updated successfully'
		});

	} catch (error) {
		console.error('❌ Error updating listing:', error.message);
		res.status(500).json({
			success: false,
			error: 'Internal server error'
		});
	}
});

// Delete listing
app.delete('/api/listings/:id', (req, res) => {
	try {
		const { id } = req.params;
		const listingIndex = mockListings.findIndex(l => l._id === id);

		if (listingIndex === -1) {
			return res.status(404).json({
				success: false,
				error: 'Listing not found'
			});
		}

		const deletedListing = mockListings.splice(listingIndex, 1)[0];

		console.log(`✅ Listing ${id} deleted successfully`);

		res.status(200).json({
			success: true,
			data: {
				deletedListing: {
					id: deletedListing._id,
					foodType: deletedListing.foodType,
					quantity: deletedListing.quantity
				}
			},
			message: 'Listing deleted successfully'
		});

	} catch (error) {
		console.error('❌ Error deleting listing:', error.message);
		res.status(500).json({
			success: false,
			error: 'Internal server error'
		});
	}
});

// Error handler
app.use((error, req, res, next) => {
	console.error('❌ Unhandled error:', error.message);
	res.status(500).json({
		success: false,
		error: 'Internal server error',
		timestamp: new Date().toISOString()
	});
});

// 404 handler
app.use('*', (req, res) => {
	res.status(404).json({
		success: false,
		error: 'Route not found',
		path: req.originalUrl
	});
});

// Start server
app.listen(PORT, () => {
	console.log(`🚀 Test Server running on port ${PORT}`);
	console.log(`📋 Health Check: http://localhost:${PORT}/health`);
	console.log(`🔗 API Base: http://localhost:${PORT}/api/listings`);
	console.log(`✅ Ready for testing!`);
});

module.exports = app;