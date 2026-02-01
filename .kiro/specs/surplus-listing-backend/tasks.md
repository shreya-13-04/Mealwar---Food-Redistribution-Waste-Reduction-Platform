# Implementation Plan: Surplus Listing Backend with Safety Rules

## Overview

This implementation plan converts the approved design into discrete coding tasks for building a Node.js/Express.js backend system with MongoDB Atlas integration. The tasks focus on core listing management, safety validation middleware, automated expiry processing, and comprehensive testing with both unit tests and property-based tests.

## Tasks

- [x] 1. Set up project structure and database configuration
  - Create directory structure following the specified layout (models, controllers, middlewares, utils, routes, config)
  - Set up MongoDB Atlas connection with Mongoose ODM in `config/db.js`
  - Configure environment variable handling for database connection strings
  - Initialize Express.js application with basic middleware
  - _Requirements: 7.1, 7.2, 8.1, 8.3, 8.4_

- [ ] 2. Implement core Listing model with validation
  - [x] 2.1 Create Listing schema in `models/Listing.js`
    - Define schema with all required fields (foodType, quantity, preparedAt, expiryTime, hygieneStatus, status)
    - Add field validation rules and enum constraints
    - Create database indexes for efficient querying
    - _Requirements: 1.1, 1.2, 7.4_
  
  - [ ]* 2.2 Write property test for Listing model
    - **Property 1: Listing Data Round-Trip Consistency**
    - **Validates: Requirements 1.1, 1.3, 1.4, 5.3**
  
  - [ ] 2.3 Write unit tests for Listing model validation

    - Test schema validation with valid and invalid data
    - Test enum constraints and field requirements
    - _Requirements: 1.2, 5.4_

- [ ] 3. Implement expiry utilities and safety calculations
  - [x] 3.1 Create expiry utility functions in `utils/expiryUtils.js`
    - Implement `calculateExpiryTime()` function with food-type-specific logic
    - Implement `markExpiredListings()` for bulk expiry processing
    - Implement `isExpired()` helper function
    - _Requirements: 3.1, 3.3, 3.5_
  
  - [ ]* 3.2 Write property test for expiry management
    - **Property 4: Expiry Management Behavior**
    - **Validates: Requirements 3.1, 3.2, 3.4**
  
  - [ ]* 3.3 Write property test for bulk expiry processing
    - **Property 8: Bulk Expiry Processing**
    - **Validates: Requirements 3.3, 3.5**

- [ ] 4. Implement safety validation middleware
  - [x] 4.1 Create safety middleware in `middlewares/safetyMiddleware.js`
    - Implement `validateSafetyWindow()` middleware function
    - Implement `validateHygieneStatus()` middleware function
    - Add comprehensive error logging for safety violations
    - Configure food-type-specific safety windows
    - _Requirements: 2.1, 2.2, 2.3, 5.1, 5.2, 10.1, 10.2, 10.3_
  
  - [ ]* 4.2 Write property test for safety window enforcement
    - **Property 2: Safety Window Enforcement**
    - **Validates: Requirements 2.1, 2.2, 2.3, 10.1, 10.2, 10.3, 10.4**
  
  - [ ]* 4.3 Write property test for input validation
    - **Property 3: Input Validation Consistency**
    - **Validates: Requirements 1.2, 5.1, 5.2, 5.4, 7.4**

- [x] 5. Checkpoint - Core logic validation
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 6. Implement listing controller with API logic
  - [x] 6.1 Create listing controller in `controllers/listingController.js`
    - Implement `createListing()` function with safety validation integration
    - Implement `getListings()` function with expiry checking
    - Add comprehensive error handling and response formatting
    - _Requirements: 4.1, 4.2, 4.3, 4.4, 6.3, 6.4_
  
  - [ ]* 6.2 Write property test for API endpoint functionality
    - **Property 9: API Endpoint Functionality**
    - **Validates: Requirements 4.1, 4.2**
  
  - [ ]* 6.3 Write property test for API response consistency
    - **Property 5: API Response Consistency**
    - **Validates: Requirements 4.3, 4.4, 6.4**

- [ ] 7. Implement API routes with middleware chain
  - [x] 7.1 Create API routes in `routes/listingRoutes.js`
    - Set up POST /api/listings route with safety middleware chain
    - Set up GET /api/listings route with expiry checking
    - Integrate all middleware components in correct order
    - _Requirements: 4.5, 10.5_
  
  - [ ]* 7.2 Write property test for universal safety evaluation
    - **Property 6: Universal Safety Evaluation**
    - **Validates: Requirements 4.5, 10.5**

- [ ] 8. Implement comprehensive error handling and logging
  - [x] 8.1 Add error handling across all components
    - Implement database error handling with graceful degradation
    - Add comprehensive logging for all error types
    - Create structured error response formats
    - _Requirements: 6.1, 6.2, 6.3, 6.5, 7.3_
  
  - [ ]* 8.2 Write property test for comprehensive logging
    - **Property 7: Comprehensive Logging**
    - **Validates: Requirements 2.4, 5.5, 6.1, 6.2, 6.5**
  
  - [ ]* 8.3 Write property test for database error handling
    - **Property 10: Database Error Handling**
    - **Validates: Requirements 6.3, 7.3**


- [ ] 10. Implement CRUD operations support
  - [x] 10.1 Add complete CRUD functionality to listing model
    - Ensure all database operations (create, read, update, delete) are supported
    - Add proper error handling for each operation type
    - Test database operation functionality
    - _Requirements: 7.5_
  
  - [ ]* 10.2 Write property test for CRUD operations
    - **Property 12: CRUD Operations Support**
    - **Validates: Requirements 7.5**



- [x] 12. Final checkpoint and system validation
  - Ensure all tests pass, ask the user if questions arise.
  - Verify all requirements are implemented and tested
  - Confirm system meets all acceptance criteria

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP development
- Each task references specific requirements for traceability
- Property tests validate universal correctness properties from the design document
- Unit tests validate specific examples, edge cases, and error conditions
- Integration tests ensure all components work together correctly
- Checkpoints ensure incremental validation and allow for user feedback