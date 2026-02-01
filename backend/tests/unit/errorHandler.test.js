/**
 * Unit tests for errorHandler middleware
 * These tests match the ACTUAL behavior of src/middlewares/errorHandler.js
 */

const { errorHandler, notFoundHandler, asyncHandler } = require('../../src/middlewares/errorHandler');

// Mock logger
jest.mock('../../src/utils/logger', () => ({
  logError: jest.fn(),
  logWarning: jest.fn()
}));

const { logError, logWarning } = require('../../src/utils/logger');

describe('errorHandler middleware (Unit)', () => {
  let req, res, next;

  beforeEach(() => {
    jest.clearAllMocks();

    req = {
      originalUrl: '/api/test',
      method: 'POST',
      ip: '127.0.0.1',
      get: jest.fn().mockReturnValue('test-user-agent')
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    next = jest.fn();
    process.env.NODE_ENV = 'test';
  });

  /* ============================================================
     Mongo / Mongoose Errors
     ============================================================ */

  test('handles ValidationError', () => {
    const error = {
      name: 'ValidationError',
      errors: {
        field1: { path: 'field1', message: 'Required', value: undefined }
      }
    };

    errorHandler(error, req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: false,
        error: 'Validation Error'
      })
    );
  });

  test('handles duplicate key error (11000)', () => {
    const error = {
      code: 11000,
      keyPattern: { email: 1 }
    };

    errorHandler(error, req, res, next);

    expect(res.status).toHaveBeenCalledWith(409);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        error: 'Duplicate Entry'
      })
    );
  });

  test('handles MongoError (503)', () => {
  const mongoError = {
    name: 'MongoError',
    message: 'Connection timeout'
  };

  errorHandler(mongoError, req, res, next);

  // Your middleware returns 503 for DB service issues
  expect(res.status).toHaveBeenCalledWith(503);

  // Match the real response shape from errorHandler.js
  expect(res.json).toHaveBeenCalledWith(
    expect.objectContaining({
      success: false,
      error: 'Database Service Unavailable',
      details: expect.objectContaining({
        message: 'Database connection issue. Please try again later.'
      }),
      timestamp: expect.any(String)
    })
  );

  // Optional: if your middleware logs something specific, match it here
  // Example (only keep if it matches your implementation):
  // expect(logError).toHaveBeenCalled();
});



  test('handles CastError correctly', () => {
    const error = {
      name: 'CastError',
      path: '_id',
      value: 'invalid-id'
    };

    errorHandler(error, req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: false,
        error: 'Invalid Data Format',
        details: {
          field: '_id',
          value: 'invalid-id',
          message: expect.any(String)
        }
      })
    );

    expect(logError).toHaveBeenCalled();
  });

  /* ============================================================
     Generic Errors
     ============================================================ */

  test('handles custom error with statusCode', () => {
    const error = new Error('Custom failure');
    error.statusCode = 422;

    errorHandler(error, req, res, next);

    expect(res.status).toHaveBeenCalledWith(422);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        error: 'Custom failure'
      })
    );
  });

  test('handles generic server error', () => {
    const error = new Error('Boom');

    errorHandler(error, req, res, next);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        error: 'Internal Server Error'
      })
    );
  });
});

/* ============================================================
   notFoundHandler
   ============================================================ */

describe('notFoundHandler middleware', () => {
  test('returns correct 404 response', () => {
    const req = {
      originalUrl: '/api/nonexistent',
      method: 'GET',
      ip: '127.0.0.1',
    get: jest.fn().mockReturnValue('test-user-agent')
    };


    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    notFoundHandler(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: false,
        error: 'Route not found',
        message: 'Cannot GET /api/nonexistent'
      })
    );
  });
});

/* ============================================================
   asyncHandler
   ============================================================ */

describe('asyncHandler wrapper', () => {
  test('passes async errors to next()', async () => {
    const fn = jest.fn().mockRejectedValue(new Error('Async error'));
    const wrapped = asyncHandler(fn);

    const next = jest.fn();
    await wrapped({}, {}, next);

    expect(next).toHaveBeenCalledWith(expect.any(Error));
  });

  test('does nothing on success', async () => {
    const fn = jest.fn().mockResolvedValue('ok');
    const wrapped = asyncHandler(fn);

    const next = jest.fn();
    await wrapped({}, {}, next);

    expect(next).not.toHaveBeenCalled();
  });
});
