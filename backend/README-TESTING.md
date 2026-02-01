# Testing Guide

## Test Structure

We have organized all tests into a clear structure with separate unit and integration tests:

```
backend/
├── tests/
│   ├── unit/                    # Unit tests for individual modules
│   │   ├── expiryUtils.test.js
│   │   ├── logger.test.js
│   │   ├── errorHandler.test.js
│   │   ├── safetyMiddleware.test.js
│   │   ├── requestLogger.test.js
│   │   ├── listingController.test.js
│   │   ├── Listing.test.js
│   │   ├── env.test.js
│   │   └── db.test.js
│   ├── integration/             # Integration tests
│   │   ├── integration.test.js
│   │   ├── auth.test.js
│   │   └── listing.test.js
│   └── setup.js                 # Test setup configuration
├── jest.config.js               # Jest configuration
└── package.json                 # Updated with test scripts
```

## Test Scripts

The following npm scripts are available for running tests:

```bash
# Run all tests
npm test

# Run only unit tests
npm test:unit

# Run only integration tests  
npm test:integration

# Run tests in watch mode
npm test:watch

# Run tests with coverage report
npm test:coverage
```

## Tools and Commands

### Testing Framework
- **Jest** - Primary test runner and assertion library
- **Supertest** - For integration testing HTTP endpoints (optional)
- **jest.mock()** - For mocking dependencies in unit tests

### Key Commands

```bash
# Run all tests
npm test

# Run with coverage report
npm test -- --coverage

# Run only unit tests
npm test -- tests/unit

# Run specific test file
npm test -- tests/unit/expiryUtils.test.js

# Run tests in watch mode
npm test -- --watch
```

### Package.json Scripts

```json
{
  "scripts": {
    "test": "jest",
    "test:unit": "jest tests/unit",
    "test:integration": "jest tests/integration", 
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage"
  }
}
```

## Test Coverage

### Unit Tests Created

✅ **Utilities**
- `expiryUtils.test.js` - Tests for food expiry calculations and safety windows
- `logger.test.js` - Tests for structured logging functionality

✅ **Middleware**  
- `errorHandler.test.js` - Tests for error handling middleware
- `safetyMiddleware.test.js` - Tests for food safety validation
- `requestLogger.test.js` - Tests for API request logging

✅ **Controllers**
- `listingController.test.js` - Tests for listing CRUD operations

✅ **Models**
- `Listing.test.js` - Tests for Mongoose model schema and validation

✅ **Configuration**
- `env.test.js` - Tests for environment variable validation
- `db.test.js` - Tests for database connection logic

### Integration Tests (Existing)
- `integration.test.js` - End-to-end API testing
- `auth.test.js` - Authentication flow testing  
- `listing.test.js` - Listing API integration tests

## Jest Configuration

The Jest configuration supports both unit and integration tests with separate projects:

```javascript
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
```

## Running Tests

### All Tests Together
```bash
npm test
```

### Unit Tests Only
```bash
npm run test:unit
```

### Integration Tests Only  
```bash
npm run test:integration
```

### With Coverage
```bash
npm run test:coverage
```

### Watch Mode
```bash
npm run test:watch
```


## Current Status

  **Test Structure** - Organized into unit and integration directories
  **Test Scripts** - Added comprehensive npm scripts for different test types  
  **Jest Configuration** - Configured for both unit and integration testing
  **Unit Test Framework** - Created unit tests for all major modules
⚠️ **Test Implementation** - Some tests need refinement to match actual implementation details

## Next Steps

1. **Refine Unit Tests** - Update test expectations to match actual implementation behavior
2. **Add Property-Based Tests** - Implement property-based testing for critical logic
3. **Improve Coverage** - Ensure all code paths are tested
4. **Performance Tests** - Add tests for performance-critical operations
5. **Mock Refinement** - Improve mocking strategies for better test isolation

This testing structure provides a solid foundation for maintaining code quality and catching regressions as the application evolves.