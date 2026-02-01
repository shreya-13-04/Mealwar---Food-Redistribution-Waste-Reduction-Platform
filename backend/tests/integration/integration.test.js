/**
 * Integration tests for the complete surplus listing system
 * Tests the full workflow from listing creation to retrieval
 */

const request = require('supertest');
const mongoose = require('mongoose');
const Listing = require('../src/models/Listing');
const app = require('../src/app');

describe('Integration Tests - Complete Workflow', () => {
	afterEach(async () => {
		// Clean up test data
		await Listing.deleteMany({});
	});

	describe('Complete Listing Workflow', () => {
		it('should handle complete listing lifecycle', async () => {
			// 1. Create a valid listing
			const createResponse = await request(app)
				.post('/api/listings')
				.send({
					foodType: 'fresh_produce',
					quantity: 25,
					preparedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
					hygieneStatus: 'excellent'
				});

			expect(createResponse.statusCode).toBe(201);
			expect(createResponse.body.success).toBe(true);
			expect(createResponse.body.data).toHaveProperty('_id');
			expect(createResponse.body.data.status).toBe('active');
			expect(createResponse.body.data.expiryTime).toBeDefined();

			const listingId = createResponse.body.data._id;

			// 2. Retrieve all listings
			const getAllResponse = await request(app).get('/api/listings');
			expect(getAllResponse.statusCode).toBe(200);
			expect(getAllResponse.body.success).toBe(true);
			expect(getAllResponse.body.data).toHaveLength(1);
			expect(getAllResponse.body.data[0]._id).toBe(listingId);

			// 3. Get specific listing by ID
			const getByIdResponse = await request(app).get(`/api/listings/${listingId}`);
			expect(getByIdResponse.statusCode).toBe(200);
			expect(getByIdResponse.body.success).toBe(true);
			expect(getByIdResponse.body.data._id).toBe(listingId);

			// 4. Update listing status
			const updateResponse = await request(app)
				.put(`/api/listings/${listingId}`)
				.send({ status: 'claimed' });

			expect(updateResponse.statusCode).toBe(200);
			expect(updateResponse.body.success).toBe(true);
			expect(updateResponse.body.data.status).toBe('claimed');

			// 5. Verify the update persisted
			const verifyResponse = await request(app).get(`/api/listings/${listingId}`);
			expect(verifyResponse.statusCode).toBe(200);
			expect(verifyResponse.body.data.status).toBe('claimed');
		});

		it('should handle multiple food types with different safety windows', async () => {
			const testCases = [
				{
					foodType: 'prepared_meal',
					safetyWindowHours: 4,
					preparedHoursAgo: 2
				},
				{
					foodType: 'fresh_produce',
					safetyWindowHours: 24,
					preparedHoursAgo: 12
				},
				{
					foodType: 'bakery_item',
					safetyWindowHours: 12,
					preparedHoursAgo: 6
				}
			];

			// Create listings for each food type
			for (const testCase of testCases) {
				const response = await request(app)
					.post('/api/listings')
					.send({
						foodType: testCase.foodType,
						quantity: 10,
						preparedAt: new Date(Date.now() - testCase.preparedHoursAgo * 60 * 60 * 1000).toISOString(),
						hygieneStatus: 'good'
					});

				expect(response.statusCode).toBe(201);
				expect(response.body.success).toBe(true);
				expect(response.body.data.foodType).toBe(testCase.foodType);
			}

			// Verify all listings are active
			const getAllResponse = await request(app).get('/api/listings');
			expect(getAllResponse.statusCode).toBe(200);
			expect(getAllResponse.body.data).toHaveLength(3);
			
			// Verify each listing has correct food type
			const foodTypes = getAllResponse.body.data.map(listing => listing.foodType);
			expect(foodTypes).toContain('prepared_meal');
			expect(foodTypes).toContain('fresh_produce');
			expect(foodTypes).toContain('bakery_item');
		});

		it('should properly handle expired listings in mixed scenarios', async () => {
			// Create one active listing
			const activeResponse = await request(app)
				.post('/api/listings')
				.send({
					foodType: 'fresh_produce',
					quantity: 15,
					preparedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago (within 24h window)
					hygieneStatus: 'good'
				});

			expect(activeResponse.statusCode).toBe(201);

			// Create an expired listing directly in database (bypassing safety middleware)
			const expiredListing = new Listing({
				foodType: 'prepared_meal',
				quantity: 5,
				preparedAt: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago (beyond 4h window)
				hygieneStatus: 'good',
				status: 'active'
			});
			await expiredListing.save();

			// Get all listings - should auto-expire the old one
			const getAllResponse = await request(app).get('/api/listings');
			expect(getAllResponse.statusCode).toBe(200);
			expect(getAllResponse.body.success).toBe(true);
			expect(getAllResponse.body.data).toHaveLength(1); // Only active listing should be returned
			expect(getAllResponse.body.data[0].foodType).toBe('fresh_produce');
			expect(getAllResponse.body.meta.expiredMarked).toBe(1);
		});

		it('should validate safety rules across all endpoints', async () => {
			// Test expired food rejection
			const expiredResponse = await request(app)
				.post('/api/listings')
				.send({
					foodType: 'prepared_meal',
					quantity: 10,
					preparedAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(), // 6 hours ago
					hygieneStatus: 'good'
				});

			expect(expiredResponse.statusCode).toBe(422);
			expect(expiredResponse.body.success).toBe(false);
			expect(expiredResponse.body.code).toBe('SAFETY_001');

			// Test invalid hygiene rejection
			const badHygieneResponse = await request(app)
				.post('/api/listings')
				.send({
					foodType: 'fresh_produce',
					quantity: 10,
					preparedAt: new Date().toISOString(),
					hygieneStatus: 'terrible' // Invalid hygiene status
				});

			expect(badHygieneResponse.statusCode).toBe(422);
			expect(badHygieneResponse.body.success).toBe(false);
			expect(badHygieneResponse.body.code).toBe('SAFETY_002');

			// Test future preparation time rejection
			const futureResponse = await request(app)
				.post('/api/listings')
				.send({
					foodType: 'bakery_item',
					quantity: 10,
					preparedAt: new Date(Date.now() + 60 * 60 * 1000).toISOString(), // 1 hour in future
					hygieneStatus: 'good'
				});

			expect(futureResponse.statusCode).toBe(400);
			expect(futureResponse.body.success).toBe(false);
			expect(futureResponse.body.code).toBe('SAFETY_003');
		});

		it('should handle error scenarios gracefully', async () => {
			// Test 404 for non-existent listing
			const notFoundResponse = await request(app).get('/api/listings/507f1f77bcf86cd799439011');
			expect(notFoundResponse.statusCode).toBe(404);
			expect(notFoundResponse.body.success).toBe(false);

			// Test invalid ObjectId format
			const invalidIdResponse = await request(app).get('/api/listings/invalid-id');
			expect(invalidIdResponse.statusCode).toBe(400);
			expect(invalidIdResponse.body.success).toBe(false);

			// Test missing required fields
			const missingFieldsResponse = await request(app)
				.post('/api/listings')
				.send({
					foodType: 'prepared_meal'
					// Missing quantity, preparedAt, hygieneStatus
				});

			expect(missingFieldsResponse.statusCode).toBe(400);
			expect(missingFieldsResponse.body.success).toBe(false);
		});
	});

	describe('System Health and Monitoring', () => {
		it('should provide health check endpoints', async () => {
			// Test root health check
			const rootResponse = await request(app).get('/');
			expect(rootResponse.statusCode).toBe(200);
			expect(rootResponse.body).toHaveProperty('message');
			expect(rootResponse.body).toHaveProperty('status', 'healthy');
			expect(rootResponse.body).toHaveProperty('timestamp');

			// Test dedicated health endpoint
			const healthResponse = await request(app).get('/health');
			expect(healthResponse.statusCode).toBe(200);
			expect(healthResponse.body).toHaveProperty('status', 'healthy');
			expect(healthResponse.body).toHaveProperty('uptime');
			expect(healthResponse.body).toHaveProperty('memory');
		});

		it('should handle CORS properly', async () => {
			const response = await request(app)
				.options('/api/listings')
				.set('Origin', 'http://localhost:3000');

			expect(response.statusCode).toBe(200);
			expect(response.headers['access-control-allow-origin']).toBe('*');
			expect(response.headers['access-control-allow-methods']).toContain('POST');
			expect(response.headers['access-control-allow-headers']).toContain('Content-Type');
		});
	});
});