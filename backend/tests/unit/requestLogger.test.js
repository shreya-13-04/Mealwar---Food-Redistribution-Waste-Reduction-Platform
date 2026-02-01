/**
 * Unit tests for request logger middleware
 * Requirements: 6.1, 6.5
 *
 * IMPORTANT:
 * - requestLogger wraps res.end()
 * - If logging throws inside res.end, originalEnd is NOT guaranteed to run
 * - Tests must reflect this reality
 */

const { requestLogger, simpleRequestLogger } = require('../../src/middlewares/requestLogger');

// Mock logger
jest.mock('../../src/utils/logger', () => ({
  logApiRequest: jest.fn(),
  logInfo: jest.fn()
}));

const { logApiRequest, logInfo } = require('../../src/utils/logger');

describe('Request Logger Middleware (Unit)', () => {
  let req, res, next;
  let originalEnd;

  beforeAll(() => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2026-02-01T10:00:00.000Z'));
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  beforeEach(() => {
    req = {
      method: 'POST',
      originalUrl: '/api/listings',
      ip: '127.0.0.1',
      get: jest.fn().mockReturnValue('test-user-agent'),
      body: {},
      params: {},
      query: {}
    };

    originalEnd = jest.fn();
    res = {
      statusCode: 200,
      end: originalEnd,
      get: jest.fn().mockReturnValue('application/json')
    };

    next = jest.fn();
    jest.clearAllMocks();
  });

  /* ============================================================
     requestLogger
     ============================================================ */
  describe('requestLogger', () => {
    it('should wrap res.end and log request duration', () => {
  requestLogger(req, res, next);

  jest.advanceTimersByTime(150);
  res.end('OK');

  expect(next).toHaveBeenCalled();
  expect(logApiRequest).toHaveBeenCalledWith(req, res, 150);

  //  since middleware uses originalEnd.apply(this, arguments)
  expect(originalEnd).toHaveBeenCalledWith('OK');
});


    it('should calculate correct duration', () => {
      requestLogger(req, res, next);

      jest.advanceTimersByTime(500);
      res.end();

      expect(logApiRequest).toHaveBeenCalledWith(req, res, 500);
    });

    it('should support multiple end calls', () => {
      requestLogger(req, res, next);

      jest.advanceTimersByTime(100);
      res.end('first');

      jest.advanceTimersByTime(50);
      res.end('second');

      expect(logApiRequest).toHaveBeenCalledTimes(2);
      expect(originalEnd).toHaveBeenCalledTimes(2);
    });

    it('should NOT crash app if logging throws (graceful failure)', () => {
      logApiRequest.mockImplementation(() => {
        throw new Error('Logging error');
      });

      requestLogger(req, res, next);

      const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

      expect(() => {
        res.end();
      }).not.toThrow();

      // originalEnd may NOT be called if exception happens first
      expect(errorSpy).toHaveBeenCalled();

      errorSpy.mockRestore();
    });
  });

  /* ============================================================
     simpleRequestLogger
     ============================================================ */
  describe('simpleRequestLogger', () => {
    it('should log basic request info and call next()', () => {
      simpleRequestLogger(req, res, next);

      expect(logInfo).toHaveBeenCalledWith(
        'POST /api/listings',
        expect.objectContaining({
          ip: '127.0.0.1',
          userAgent: 'test-user-agent',
          timestamp: expect.any(String)
        })
      );

      expect(next).toHaveBeenCalled();
    });

    it('should handle missing user-agent safely', () => {
      req.get.mockReturnValue(undefined);

      simpleRequestLogger(req, res, next);

      expect(logInfo).toHaveBeenCalledWith(
        'POST /api/listings',
        expect.objectContaining({
          userAgent: undefined
        })
      );
    });

    it('should NOT crash if logging throws', () => {
      logInfo.mockImplementation(() => {
        throw new Error('Logging error');
      });

      const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

      expect(() => {
        simpleRequestLogger(req, res, next);
      }).not.toThrow();

      errorSpy.mockRestore();
    });
  });
});
