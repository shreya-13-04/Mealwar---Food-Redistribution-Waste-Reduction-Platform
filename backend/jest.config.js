module.exports = {
	testEnvironment: 'node',
	testMatch: [
		'**/tests/unit/**/*.test.js',
		'**/tests/integration/**/*.test.js',
		'**/?(*.)+(spec|test).js'
	],
	collectCoverageFrom: [
		'src/**/*.js',
		'!src/node_modules/**',
		'!src/**/*.test.js',
		'!src/**/*.spec.js'
	],
	coverageDirectory: 'coverage',
	coverageReporters: ['text', 'lcov', 'html'],
	setupFilesAfterEnv: ['<rootDir>/tests/setup.js'],
	testTimeout: 10000,
	verbose: true,
	// Separate test patterns for different test types
	projects: [
		{
			displayName: 'unit',
			testMatch: ['<rootDir>/tests/unit/**/*.test.js'],
			testEnvironment: 'node'
		},
		{
			displayName: 'integration',
			testMatch: ['<rootDir>/tests/integration/**/*.test.js'],
			testEnvironment: 'node',
			setupFilesAfterEnv: ['<rootDir>/tests/setup.js']
		}
	]
};