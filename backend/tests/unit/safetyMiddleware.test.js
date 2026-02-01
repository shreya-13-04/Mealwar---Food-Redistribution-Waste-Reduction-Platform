/**
 * Unit tests for safety middleware
 * Requirements: 2.1, 2.2, 2.3, 5.1, 5.2, 10.1, 10.2, 10.3
 */

const { 
  validateSafetyWindow, 
  validateHygieneStatus,
  SAFETY_ERRORS 
} = require('../../src/middlewares/safetyMiddleware');

// Mock dependencies
jest.mock('../../src/utils/expiryUtils');
jest.mock('../../src/utils/logger');

const { isWithinSafetyWindow, getSafetyWindow } = require('../../src/utils/expiryUtils');
const { logSafetyViolation, logInfo } = require('../../src/utils/logger');

describe('Safety Middleware', () => {
  let req, res, next;
  let logSpy, errorSpy;

  beforeAll(() => {
    // Freeze time for deterministic tests
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2026-02-01T10:00:00.000Z'));
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  beforeEach(() => {
    // Mock request, response, and next
    req = {
      body: {},
      ip: '127.0.0.1',
      get: jest.fn().mockReturnValue('test-user-agent')
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis()
    };
    next = jest.fn();

    // Clean console mocking
    logSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
    errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    // Reset all mocks
    jest.clearAllMocks();
  });

  afterEach(() => {
    logSpy.mockRestore();
    errorSpy.mockRestore();
  });

  describe('validateSafetyWindow', () => {
    it('should pass validation for food within safety window', () => {
      req.body = {
        preparedAt: '2026-02-01T08:00:00.000Z',
        foodType: 'prepared_meal'
      };

      isWithinSafetyWindow.mockReturnValue(true);
      getSafetyWindow.mockReturnValue(4);

      validateSafetyWindow(req, res, next);

      expect(isWithinSafetyWindow).toHaveBeenCalledWith(
        expect.any(Date),
        'prepared_meal'
      );
      expect(logInfo).toHaveBeenCalled();
      expect(next).toHaveBeenCalled();
      expect(res.status).not.toHaveBeenCalled();
    });

    it('should reject food outside safety window', () => {
      req.body = {
        preparedAt: '2026-02-01T04:00:00.000Z', // 6 hours ago
        foodType: 'prepared_meal'
      };

      isWithinSafetyWindow.mockReturnValue(false);
      getSafetyWindow.mockReturnValue(4);

      validateSafetyWindow(req, res, next);

      expect(logSafetyViolation).toHaveBeenCalledWith(
        'EXPIRED_FOOD',
        expect.objectContaining({
          foodType: 'prepared_meal',
          preparedAt: '2026-02-01T04:00:00.000Z'
        }),
        req
      );
      expect(res.status).toHaveBeenCalledWith(422);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: false,
          error: 'Food has exceeded safety window',
          code: 'SAFETY_001'
        })
      );
      expect(next).not.toHaveBeenCalled();
    });

    it('should reject future preparation time', () => {
      req.body = {
        preparedAt: '2026-02-01T15:00:00.000Z', // 5 hours in future
        foodType: 'prepared_meal'
      };

      validateSafetyWindow(req, res, next);

      expect(logSafetyViolation).toHaveBeenCalledWith(
        'FUTURE_PREPARATION',
        expect.objectContaining({
          preparedAt: '2026-02-01T15:00:00.000Z'
        }),
        req
      );
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: false,
          error: 'Preparation time cannot be in the future',
          code: 'SAFETY_003'
        })
      );
      expect(next).not.toHaveBeenCalled();
    });

    it('should reject missing preparedAt', () => {
      req.body = {
        foodType: 'prepared_meal'
        // Missing preparedAt
      };

      validateSafetyWindow(req, res, next);

      expect(logSafetyViolation).toHaveBeenCalledWith(
        'MISSING_FIELDS',
        expect.objectContaining({
          preparedAt: false,
          foodType: true
        }),
        req
      );
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: false,
          error: 'Missing required fields for safety validation',
          code: 'SAFETY_004'
        })
      );
      expect(next).not.toHaveBeenCalled();
    });

    it('should reject missing foodType', () => {
      req.body = {
        preparedAt: '2026-02-01T08:00:00.000Z'
        // Missing foodType
      };

      validateSafetyWindow(req, res, next);

      expect(logSafetyViolation).toHaveBeenCalledWith(
        'MISSING_FIELDS',
        expect.objectContaining({
          preparedAt: true,
          foodType: false
        }),
        req
      );
      expect(res.status).toHaveBeenCalledWith(400);
      expect(next).not.toHaveBeenCalled();
    });

    it('should handle internal errors gracefully', () => {
      req.body = {
        preparedAt: '2026-02-01T08:00:00.000Z',
        foodType: 'prepared_meal'
      };

      // Mock an internal error
      isWithinSafetyWindow.mockImplementation(() => {
        throw new Error('Internal error');
      });

      validateSafetyWindow(req, res, next);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: false,
          error: 'Internal server error during safety validation'
        })
      );
      expect(next).not.toHaveBeenCalled();
    });
  });

  describe('validateHygieneStatus', () => {
    it('should pass validation for acceptable hygiene status', () => {
      req.body = {
        hygieneStatus: 'good'
      };

      validateHygieneStatus(req, res, next);

      expect(logInfo).toHaveBeenCalled();
      expect(next).toHaveBeenCalled();
      expect(res.status).not.toHaveBeenCalled();
    });

    it('should pass validation for excellent hygiene status', () => {
      req.body = {
        hygieneStatus: 'excellent'
      };

      validateHygieneStatus(req, res, next);

      expect(next).toHaveBeenCalled();
      expect(res.status).not.toHaveBeenCalled();
    });

    it('should pass validation for acceptable hygiene status', () => {
      req.body = {
        hygieneStatus: 'acceptable'
      };

      validateHygieneStatus(req, res, next);

      expect(next).toHaveBeenCalled();
      expect(res.status).not.toHaveBeenCalled();
    });

    it('should reject invalid hygiene status', () => {
      req.body = {
        hygieneStatus: 'poor'
      };

      validateHygieneStatus(req, res, next);

      expect(logSafetyViolation).toHaveBeenCalledWith(
        'INVALID_HYGIENE',
        expect.objectContaining({
          providedStatus: 'poor',
          acceptableStatuses: ['excellent', 'good', 'acceptable']
        }),
        req
      );
      expect(res.status).toHaveBeenCalledWith(422);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: false,
          error: 'Hygiene status does not meet minimum requirements',
          code: 'SAFETY_002'
        })
      );
      expect(next).not.toHaveBeenCalled();
    });

    it('should reject missing hygiene status', () => {
      req.body = {
        // Missing hygieneStatus
      };

      validateHygieneStatus(req, res, next);

      expect(logSafetyViolation).toHaveBeenCalledWith(
        'MISSING_FIELDS',
        expect.objectContaining({
          missingFields: ['hygieneStatus']
        }),
        req
      );
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: false,
          error: 'Missing required field: hygieneStatus',
          code: 'SAFETY_004'
        })
      );
      expect(next).not.toHaveBeenCalled();
    });

    it('should handle internal errors gracefully', () => {
      req.body = {
        hygieneStatus: 'good'
      };

      // Mock an internal error by making logInfo throw
      logInfo.mockImplementation(() => {
        throw new Error('Logging error');
      });

      validateHygieneStatus(req, res, next);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: false,
          error: 'Internal server error during hygiene validation'
        })
      );
      expect(next).not.toHaveBeenCalled();
    });
  });

  describe('SAFETY_ERRORS constants', () => {
    it('should have correct error codes and messages', () => {
      expect(SAFETY_ERRORS.EXPIRED_FOOD).toEqual({
        code: 'SAFETY_001',
        message: 'Food has exceeded safety window',
        httpStatus: 422
      });

      expect(SAFETY_ERRORS.INVALID_HYGIENE).toEqual({
        code: 'SAFETY_002',
        message: 'Hygiene status does not meet minimum requirements',
        httpStatus: 422
      });

      expect(SAFETY_ERRORS.FUTURE_PREPARATION).toEqual({
        code: 'SAFETY_003',
        message: 'Preparation time cannot be in the future',
        httpStatus: 400
      });

      expect(SAFETY_ERRORS.MISSING_FIELDS).toEqual({
        code: 'SAFETY_004',
        message: 'Missing required fields for safety validation',
        httpStatus: 400
      });
    });
  });
});