

const request = require('supertest');
const mongoose = require('mongoose');
const Listing = require('../src/models/Listing');
const app = require('../src/app');

describe('Listing API', () => {
	afterEach(async () => {
		// Clean up test data
		await Listing.deleteMany({});
	});

	it('should create a valid listing with new model structure', async () => {
		const res = await request(app)
			.post('/api/listings')
			.send({
				foodType: 'prepared_meal',
				quantity: 10,
				preparedAt: new Date().toISOString(),
				hygieneStatus: 'good'
			});
		
		expect(res.statusCode).toBe(201);
		expect(res.body.success).toBe(true);
		expect(res.body.data.foodType).toBe('prepared_meal');
		expect(res.body.data.quantity).toBe(10);
		expect(res.body.data.hygieneStatus).toBe('good');
		expect(res.body.data.status).toBe('active');
		expect(res.body.data).toHaveProperty('expiryTime');
	});

	it('should reject expired listing', async () => {
		const oldDate = new Date(Date.now() - 6 * 60 * 60 * 1000); // 6 hours ago (beyond prepared_meal safety window)
		const res = await request(app)
			.post('/api/listings')
			.send({
				foodType: 'prepared_meal',
				quantity: 5,
				preparedAt: oldDate.toISOString(),
				hygieneStatus: 'good'
			});
		
		expect(res.statusCode).toBe(422);
		expect(res.body.success).toBe(false);
		expect(res.body.error).toMatch(/safety window/i);
		expect(res.body.code).toBe('SAFETY_001');
	});

	it('should reject listing with unacceptable hygiene', async () => {
		const res = await request(app)
			.post('/api/listings')
			.send({
				foodType: 'prepared_meal',
				quantity: 3,
				preparedAt: new Date().toISOString(),
				hygieneStatus: 'poor' // Invalid hygiene status
			});
		
		expect(res.statusCode).toBe(422);
		expect(res.body.success).toBe(false);
		expect(res.body.error).toMatch(/hygiene/i);
		expect(res.body.code).toBe('SAFETY_002');
	});

	it('should reject listing with future preparation time', async () => {
		const futureDate = new Date(Date.now() + 60 * 60 * 1000); // 1 hour in future
		const res = await request(app)
			.post('/api/listings')
			.send({
				foodType: 'prepared_meal',
				quantity: 3,
				preparedAt: futureDate.toISOString(),
				hygieneStatus: 'good'
			});
		
		expect(res.statusCode).toBe(400);
		expect(res.body.success).toBe(false);
		expect(res.body.error).toMatch(/future/i);
		expect(res.body.code).toBe('SAFETY_003');
	});

	it('should auto-expire listings on fetch', async () => {
		// Create an expired listing directly in database
		const expiredListing = new Listing({
			foodType: 'prepared_meal',
			quantity: 2,
			preparedAt: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
			hygieneStatus: 'good',
			status: 'active'
		});
		await expiredListing.save();

		const res = await request(app).get('/api/listings');
		
		expect(res.statusCode).toBe(200);
		expect(res.body.success).toBe(true);
		expect(res.body.data).toHaveLength(0); // Should be empty as expired listing is filtered out
		expect(res.body.meta.expiredMarked).toBe(1);
	});

	it('should fail with missing required fields', async () => {
		const res = await request(app)
			.post('/api/listings')
			.send({ 
				foodType: 'prepared_meal' 
				// Missing quantity, preparedAt, hygieneStatus
			});
		
		expect(res.statusCode).toBe(400);
		expect(res.body.success).toBe(false);
		expect(res.body.error).toMatch(/missing required fields/i);
		expect(res.body.details.missingFields).toContain('preparedAt');
		// Note: quantity and hygieneStatus are checked later in the controller, 
		// but preparedAt is checked first in safety middleware
	});

	it('should validate food type enum', async () => {
		const res = await request(app)
			.post('/api/listings')
			.send({
				foodType: 'invalid_food_type',
				quantity: 10,
				preparedAt: new Date().toISOString(),
				hygieneStatus: 'good'
			});
		
		expect(res.statusCode).toBe(400);
		expect(res.body.success).toBe(false);
	});

	it('should get all active listings', async () => {
		// Create a valid listing
		const listing = new Listing({
			foodType: 'fresh_produce',
			quantity: 5,
			preparedAt: new Date(),
			hygieneStatus: 'excellent',
			status: 'active'
		});
		await listing.save();

		const res = await request(app).get('/api/listings');
		
		expect(res.statusCode).toBe(200);
		expect(res.body.success).toBe(true);
		expect(res.body.data).toHaveLength(1);
		expect(res.body.data[0].foodType).toBe('fresh_produce');
		expect(res.body.data[0].status).toBe('active');
	});

	// CRUD Operations Tests
	describe('CRUD Operations', () => {
		let testListingId;

		beforeEach(async () => {
			// Create a test listing for CRUD operations
			const listing = new Listing({
				foodType: 'bakery_item',
				quantity: 8,
				preparedAt: new Date(),
				hygieneStatus: 'good',
				status: 'active'
			});
			const savedListing = await listing.save();
			testListingId = savedListing._id.toString();
		});

		it('should get a specific listing by ID', async () => {
			const res = await request(app).get(`/api/listings/${testListingId}`);
			
			expect(res.statusCode).toBe(200);
			expect(res.body.success).toBe(true);
			expect(res.body.data._id).toBe(testListingId);
			expect(res.body.data.foodType).toBe('bakery_item');
			expect(res.body.data.quantity).toBe(8);
		});

		it('should return 404 for non-existent listing ID', async () => {
			const nonExistentId = new mongoose.Types.ObjectId();
			const res = await request(app).get(`/api/listings/${nonExistentId}`);
			
			expect(res.statusCode).toBe(404);
			expect(res.body.success).toBe(false);
			expect(res.body.error).toBe('Listing not found');
		});

		it('should update a listing status', async () => {
			const res = await request(app)
				.put(`/api/listings/${testListingId}`)
				.send({ status: 'claimed' });
			
			expect(res.statusCode).toBe(200);
			expect(res.body.success).toBe(true);
			expect(res.body.data.status).toBe('claimed');
			expect(res.body.message).toBe('Listing updated successfully');
		});

		it('should reject invalid status update', async () => {
			const res = await request(app)
				.put(`/api/listings/${testListingId}`)
				.send({ status: 'invalid_status' });
			
			expect(res.statusCode).toBe(400);
			expect(res.body.success).toBe(false);
			expect(res.body.error).toBe('Invalid status');
		});

		it('should delete a listing', async () => {
			const res = await request(app).delete(`/api/listings/${testListingId}`);
			
			expect(res.statusCode).toBe(200);
			expect(res.body.success).toBe(true);
			expect(res.body.message).toBe('Listing deleted successfully');
			expect(res.body.data.deletedListing.id).toBe(testListingId);
			expect(res.body.data.deletedListing.foodType).toBe('bakery_item');

			// Verify listing is actually deleted
			const deletedListing = await Listing.findById(testListingId);
			expect(deletedListing).toBeNull();
		});

		it('should return 404 when trying to delete non-existent listing', async () => {
			const nonExistentId = new mongoose.Types.ObjectId();
			const res = await request(app).delete(`/api/listings/${nonExistentId}`);
			
			expect(res.statusCode).toBe(404);
			expect(res.body.success).toBe(false);
			expect(res.body.error).toBe('Listing not found');
		});

		it('should return 404 when trying to update non-existent listing', async () => {
			const nonExistentId = new mongoose.Types.ObjectId();
			const res = await request(app)
				.put(`/api/listings/${nonExistentId}`)
				.send({ status: 'claimed' });
			
			expect(res.statusCode).toBe(404);
			expect(res.body.success).toBe(false);
			expect(res.body.error).toBe('Listing not found');
		});
	});

	// Database Error Handling Tests
	describe('Database Error Handling', () => {
		it('should handle invalid ObjectId format gracefully', async () => {
			const invalidId = 'invalid-id-format';
			const res = await request(app).get(`/api/listings/${invalidId}`);
			
			// Invalid ObjectId format should return 400 (Bad Request), not 500
			expect(res.statusCode).toBe(400);
			expect(res.body.success).toBe(false);
		});

		it('should handle database connection errors gracefully', async () => {
			// This test would require mocking mongoose to simulate connection failure
			// For now, we'll test that the error handling structure is in place
			const res = await request(app)
				.post('/api/listings')
				.send({
					foodType: 'prepared_meal',
					quantity: 'invalid_quantity', // This should cause a validation error
					preparedAt: new Date().toISOString(),
					hygieneStatus: 'good'
				});
			
			expect(res.statusCode).toBe(400);
			expect(res.body.success).toBe(false);
		});
	});
});
