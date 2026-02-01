# Design Document: Surplus Listing Backend with Safety Rules

## Overview

The Surplus Listing Backend implements a Node.js/Express.js API system that manages surplus food listings with automated safety validation and expiry management. The system uses MongoDB Atlas for persistence and implements comprehensive safety rules to prevent unsafe food from entering the redistribution network.

The architecture follows a layered approach with clear separation between data models, business logic, API controllers, and safety validation middleware. The system emphasizes real-time safety evaluation and automated expiry management to ensure food safety standards.

## Architecture

The system follows a traditional MVC architecture with additional safety and utility layers:

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   API Routes    │────│   Controllers    │────│   Models        │
└─────────────────┘    └──────────────────┘    └─────────────────┘
         │                       │                       │
         │              ┌──────────────────┐             │
         └──────────────│ Safety Middleware │─────────────┘
                        └──────────────────┘
                                 │
                        ┌──────────────────┐
                        │  Utility Layer   │
                        │ (Expiry Utils)   │
                        └──────────────────┘
                                 │
                        ┌──────────────────┐
                        │   MongoDB Atlas  │
                        └──────────────────┘
```

**Key Architectural Principles:**
- **Middleware-first safety**: All listing operations pass through safety validation
- **Real-time evaluation**: Safety checks occur at request time, not batch processing
- **Separation of concerns**: Clear boundaries between data, business logic, and presentation
- **Environment-driven configuration**: All deployment-specific settings via environment variables

## Components and Interfaces

### Listing Model (`models/Listing.js`)

The core data model representing surplus food listings:

```javascript
const listingSchema = new mongoose.Schema({
  foodType: {
    type: String,
    required: true,
    enum: ['prepared_meal', 'fresh_produce', 'packaged_food', 'bakery_item', 'dairy_product']
  },
  quantity: {
    type: Number,
    required: true,
    min: 1
  },
  preparedAt: {
    type: Date,
    required: true
  },
  expiryTime: {
    type: Date,
    required: true
  },
  hygieneStatus: {
    type: String,
    required: true,
    enum: ['excellent', 'good', 'acceptable']
  },
  status: {
    type: String,
    default: 'active',
    enum: ['active', 'expired', 'claimed']
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});
```

**Interface Methods:**
- `Listing.create(data)`: Creates new listing with validation
- `Listing.find(query)`: Retrieves listings with filtering
- `Listing.updateMany(filter, update)`: Bulk updates for expiry management
- `Listing.findByIdAndUpdate(id, update)`: Individual listing updates

### Safety Middleware (`middlewares/safetyMiddleware.js`)

Validates food safety before allowing listing creation:

```javascript
const safetyMiddleware = {
  validateSafetyWindow: (req, res, next) => {
    // Calculates safety window based on food type
    // Rejects if current time exceeds safety threshold
    // Logs safety violations
  },
  
  validateHygieneStatus: (req, res, next) => {
    // Ensures hygiene status is acceptable
    // Rejects listings with poor hygiene
  }
};
```

**Safety Window Configuration:**
- `prepared_meal`: 4 hours from preparation
- `fresh_produce`: 24 hours from harvest/preparation
- `packaged_food`: Until manufacturer expiry date
- `bakery_item`: 12 hours from baking
- `dairy_product`: Until manufacturer expiry date

### Listing Controller (`controllers/listingController.js`)

Handles HTTP requests and coordinates business logic:

```javascript
const listingController = {
  createListing: async (req, res) => {
    // 1. Extract and validate request data
    // 2. Calculate expiry time based on food type
    // 3. Create listing in database
    // 4. Return success response
  },
  
  getListings: async (req, res) => {
    // 1. Check for expired listings and update status
    // 2. Retrieve active listings from database
    // 3. Return filtered results
  }
};
```

**Response Formats:**
- Success: `{ success: true, data: {...}, message: "..." }`
- Error: `{ success: false, error: "...", details: {...} }`

### Expiry Utilities (`utils/expiryUtils.js`)

Manages expiry calculations and automated expiry processing:

```javascript
const expiryUtils = {
  calculateExpiryTime: (preparedAt, foodType) => {
    // Returns calculated expiry timestamp based on food type
  },
  
  markExpiredListings: async () => {
    // Bulk updates expired listings to 'expired' status
    // Returns count of updated listings
  },
  
  isExpired: (expiryTime) => {
    // Simple boolean check for expiry status
  }
};
```

### API Routes (`routes/listingRoutes.js`)

Defines HTTP endpoints with middleware chain:

```javascript
router.post('/api/listings', 
  safetyMiddleware.validateSafetyWindow,
  safetyMiddleware.validateHygieneStatus,
  listingController.createListing
);

router.get('/api/listings', 
  listingController.getListings
);
```

## Data Models

### Listing Document Structure

```json
{
  "_id": "ObjectId",
  "foodType": "prepared_meal",
  "quantity": 50,
  "preparedAt": "2024-01-15T10:00:00.000Z",
  "expiryTime": "2024-01-15T14:00:00.000Z",
  "hygieneStatus": "excellent",
  "status": "active",
  "createdAt": "2024-01-15T10:05:00.000Z"
}
```

### Database Indexes

```javascript
// Compound index for efficient expiry queries
listingSchema.index({ status: 1, expiryTime: 1 });

// Index for food type filtering
listingSchema.index({ foodType: 1 });

// Index for creation time sorting
listingSchema.index({ createdAt: -1 });
```

### Data Validation Rules

- **foodType**: Must be one of predefined categories
- **quantity**: Positive integer, minimum 1
- **preparedAt**: Valid date, cannot be in future
- **expiryTime**: Must be after preparedAt, calculated automatically
- **hygieneStatus**: Must be 'excellent', 'good', or 'acceptable'
- **status**: System-managed, defaults to 'active'

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system—essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

<function_calls>
<invoke name="prework">
<parameter name="featureName">surplus-listing-backend

Based on the prework analysis and property reflection, the following properties validate the system's correctness:

**Property 1: Listing Data Round-Trip Consistency**
*For any* valid listing data with all required fields (foodType, quantity, preparedAt, expiryTime, hygieneStatus), storing the listing and then retrieving it should return all original fields with system-generated metadata (unique ID and timestamp)
**Validates: Requirements 1.1, 1.3, 1.4, 5.3**

**Property 2: Safety Window Enforcement**
*For any* food listing, the safety evaluation should reject listings where current time exceeds the calculated safety window for that food type, and accept listings within the safety window
**Validates: Requirements 2.1, 2.2, 2.3, 10.1, 10.2, 10.3, 10.4**

**Property 3: Input Validation Consistency**
*For any* listing submission, the system should reject invalid data (missing required fields, invalid enum values, negative quantities) and accept valid data that conforms to the schema
**Validates: Requirements 1.2, 5.1, 5.2, 5.4, 7.4**

**Property 4: Expiry Management Behavior**
*For any* set of listings where some have expiry times in the past, the expiry system should mark expired listings as 'expired' status and exclude them from active listing queries
**Validates: Requirements 3.1, 3.2, 3.4**

**Property 5: API Response Consistency**
*For any* API request (valid or invalid), the system should return responses with consistent JSON structure including success/error status, appropriate HTTP codes, and descriptive messages
**Validates: Requirements 4.3, 4.4, 6.4**

**Property 6: Universal Safety Evaluation**
*For any* listing creation request, the safety middleware should be applied and safety evaluation should occur before any data storage
**Validates: Requirements 4.5, 10.5**

**Property 7: Comprehensive Logging**
*For any* system error, safety violation, or validation failure, the system should generate detailed log entries with timestamps and relevant context information
**Validates: Requirements 2.4, 5.5, 6.1, 6.2, 6.5**

**Property 8: Bulk Expiry Processing**
*For any* collection of listings with mixed expiry states, the expiry checking system should update all expired listings in a single batch operation
**Validates: Requirements 3.3, 3.5**

**Property 9: API Endpoint Functionality**
*For any* valid POST request to /api/listings, a new listing should be created and stored, and for any GET request to /api/listings, all active (non-expired) listings should be returned
**Validates: Requirements 4.1, 4.2**

**Property 10: Database Error Handling**
*For any* database operation failure or connection error, the system should handle the error gracefully and return appropriate error responses without crashing
**Validates: Requirements 6.3, 7.3**

**Property 11: Configuration Validation**
*For any* system startup attempt, all required environment variables should be validated, and missing configuration should cause startup failure with clear error messages
**Validates: Requirements 8.3, 8.4**

**Property 12: CRUD Operations Support**
*For any* valid data object, the system should support create, read, update, and delete operations through the database layer
**Validates: Requirements 7.5**

## Error Handling

The system implements comprehensive error handling across all layers:

### API Layer Error Handling
- **400 Bad Request**: Invalid input data, missing required fields
- **422 Unprocessable Entity**: Safety validation failures, expired food submissions
- **500 Internal Server Error**: Database connection issues, unexpected system errors
- **503 Service Unavailable**: Database unavailable, system maintenance mode

### Safety Validation Errors
```javascript
const safetyErrors = {
  EXPIRED_FOOD: {
    code: 'SAFETY_001',
    message: 'Food has exceeded safety window',
    httpStatus: 422
  },
  INVALID_HYGIENE: {
    code: 'SAFETY_002', 
    message: 'Hygiene status does not meet minimum requirements',
    httpStatus: 422
  },
  FUTURE_PREPARATION: {
    code: 'SAFETY_003',
    message: 'Preparation time cannot be in the future',
    httpStatus: 400
  }
};
```

### Database Error Handling
- **Connection failures**: Graceful degradation with retry logic
- **Validation errors**: Clear field-specific error messages
- **Timeout handling**: Configurable timeout with fallback responses
- **Transaction rollback**: Automatic rollback on multi-operation failures

### Logging Strategy
- **Error logs**: All errors with stack traces and context
- **Safety logs**: All safety violations with reasoning
- **Audit logs**: All listing creation and status changes
- **Performance logs**: Response times and database query performance

## Testing Strategy

The system employs a dual testing approach combining unit tests and property-based tests for comprehensive coverage.

### Property-Based Testing Configuration

**Framework**: Use `fast-check` library for JavaScript property-based testing
**Test Configuration**: Minimum 100 iterations per property test to ensure thorough randomized input coverage
**Test Tagging**: Each property test must reference its design document property with the format:
```javascript
// Feature: surplus-listing-backend, Property 1: Listing Data Round-Trip Consistency
```

### Unit Testing Strategy

**Framework**: Jest with Supertest for API testing and MongoDB Memory Server for database isolation

**Unit Test Focus Areas:**
- **Specific examples**: Test concrete scenarios like "prepared meal with 3-hour safety window"
- **Edge cases**: Empty quantities, boundary expiry times, invalid enum values
- **Error conditions**: Database connection failures, malformed requests
- **Integration points**: Middleware chain execution, controller-to-model interactions

**Property Test Focus Areas:**
- **Universal properties**: Behaviors that must hold for all valid inputs
- **Randomized input coverage**: Generate diverse test data to catch edge cases
- **Invariant validation**: Properties that remain constant across operations
- **Round-trip testing**: Serialization/deserialization consistency

### Test Coverage Requirements

**Minimum Coverage Targets:**
- **Unit tests**: 90% line coverage for business logic
- **Property tests**: 100% coverage of design document properties
- **Integration tests**: All API endpoints with success and failure scenarios
- **Database tests**: All CRUD operations with error simulation

**Test Data Generation:**
- **Valid listings**: Random food types, quantities, and timestamps within safety windows
- **Invalid listings**: Missing fields, invalid enums, negative values
- **Edge cases**: Boundary timestamps, maximum quantities, special characters
- **Safety violations**: Expired food, poor hygiene status, future preparation times

### Testing Environment Setup

```javascript
// Test configuration example
const testConfig = {
  mongodb: {
    uri: 'mongodb://localhost:27017/test-surplus-listings',
    options: { useNewUrlParser: true, useUnifiedTopology: true }
  },
  propertyTests: {
    iterations: 100,
    timeout: 5000
  },
  apiTests: {
    baseUrl: 'http://localhost:3000',
    timeout: 3000
  }
};
```

**Test Isolation:**
- Each test uses fresh database instance via MongoDB Memory Server
- Property tests use independent random seeds for reproducibility
- API tests reset application state between test suites
- Mock external dependencies (logging, time functions) for deterministic testing