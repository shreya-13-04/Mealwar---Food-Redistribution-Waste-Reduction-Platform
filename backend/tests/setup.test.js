const request = require('supertest');

// Import app without starting the server
const app = require('../src/app');

describe('Basic Setup Tests', () => {
	test('should respond to health check endpoint', async () => {
		const response = await request(app)
			.get('/')
			.expect(200);

		expect(response.body).toHaveProperty('message');
		expect(response.body.message).toContain('Surplus Listing Backend is running!');
		expect(response.body).toHaveProperty('version');
		expect(response.body).toHaveProperty('timestamp');
		expect(response.body).toHaveProperty('status', 'healthy');
	});

	test('should respond to health endpoint', async () => {
		const response = await request(app)
			.get('/health')
			.expect(200);

		expect(response.body).toHaveProperty('status', 'healthy');
		expect(response.body).toHaveProperty('timestamp');
		expect(response.body).toHaveProperty('environment');
		expect(response.body).toHaveProperty('uptime');
		expect(response.body).toHaveProperty('memory');
	});

	test('should return 404 for undefined routes', async () => {
		const response = await request(app)
			.get('/nonexistent-route')
			.expect(404);

		expect(response.body).toHaveProperty('success', false);
		expect(response.body).toHaveProperty('error', 'Route not found');
	});

	test('should have proper CORS headers', async () => {
		const response = await request(app)
			.options('/')
			.expect(200);

		expect(response.headers).toHaveProperty('access-control-allow-origin', '*');
		expect(response.headers).toHaveProperty('access-control-allow-methods');
	});
});