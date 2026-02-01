/**
 * Unit tests for logger utility
 * Requirements: 6.1, 6.2, 6.5
 */

const { 
  logError, 
  logInfo, 
  logWarning, 
  logDebug,
  logSafetyViolation,
  logDatabaseOperation,
  LOG_LEVELS 
} = require('../../src/utils/logger');

// Mock the config dependency
jest.mock('../../src/config/env', () => ({
  config: {
    isDevelopment: false,
    logLevel: 'info'
  }
}));

describe('Logger Utility', () => {
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
    // Clean console mocking
    logSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
    errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    jest.clearAllMocks();
  });

  afterEach(() => {
    logSpy.mockRestore();
    errorSpy.mockRestore();
  });

  describe('logError', () => {
    it('should log error with structured format', () => {
      const error = new Error('Test error');
      const context = { userId: '123', action: 'create' };

      logError('Database operation failed', context, error);

      expect(errorSpy).toHaveBeenCalledWith(
        expect.stringContaining('"level":"ERROR"')
      );
      expect(errorSpy).toHaveBeenCalledWith(
        expect.stringContaining('"message":"Database operation failed"')
      );
      expect(errorSpy).toHaveBeenCalledWith(
        expect.stringContaining('"timestamp":"2026-02-01T10:00:00.000Z"')
      );
      expect(errorSpy).toHaveBeenCalledWith(
        expect.stringContaining('"userId":"123"')
      );
    });

    it('should log error without context', () => {
      const error = new Error('Simple error');

      logError('Simple error message', {}, error);

      expect(errorSpy).toHaveBeenCalledWith(
        expect.stringContaining('"message":"Simple error message"')
      );
      expect(errorSpy).toHaveBeenCalledWith(
        expect.stringContaining('"level":"ERROR"')
      );
    });

    it('should log error without error object', () => {
      logError('Error without exception', { context: 'test' });

      expect(errorSpy).toHaveBeenCalledWith(
        expect.stringContaining('"message":"Error without exception"')
      );
      expect(errorSpy).toHaveBeenCalledWith(
        expect.stringContaining('"context":"test"')
      );
    });
  });

  describe('logInfo', () => {
    it('should log info with structured format', () => {
      const context = { operation: 'fetch', count: 5 };

      logInfo('Operation completed successfully', context);

      expect(logSpy).toHaveBeenCalledWith(
        expect.stringContaining('"level":"INFO"')
      );
      expect(logSpy).toHaveBeenCalledWith(
        expect.stringContaining('"message":"Operation completed successfully"')
      );
      expect(logSpy).toHaveBeenCalledWith(
        expect.stringContaining('"operation":"fetch"')
      );
      expect(logSpy).toHaveBeenCalledWith(
        expect.stringContaining('"count":5')
      );
    });

    it('should log info without context', () => {
      logInfo('Simple info message');

      expect(logSpy).toHaveBeenCalledWith(
        expect.stringContaining('"message":"Simple info message"')
      );
      expect(logSpy).toHaveBeenCalledWith(
        expect.stringContaining('"level":"INFO"')
      );
    });
  });

  describe('logWarning', () => {
    it('should log warning with structured format', () => {
      const context = { resource: 'memory', usage: '85%' };
      const warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});

      logWarning('Resource usage high', context);

      expect(warnSpy).toHaveBeenCalledWith(
        expect.stringContaining('"level":"WARN"')
      );
      expect(warnSpy).toHaveBeenCalledWith(
        expect.stringContaining('"message":"Resource usage high"')
      );
      expect(warnSpy).toHaveBeenCalledWith(
        expect.stringContaining('"resource":"memory"')
      );
      
      warnSpy.mockRestore();
    });
  });

  describe('logDebug', () => {
    it('should not log debug in production mode', () => {
      const context = { step: 'validation', data: { id: 1 } };

      logDebug('Debug information', context);

      // In production mode (isDevelopment: false), debug should not log
      expect(logSpy).not.toHaveBeenCalled();
    });
  });

  describe('logSafetyViolation', () => {
    it('should log safety violation with proper context', () => {
      const violationDetails = {
        foodType: 'prepared_meal',
        preparedAt: '2026-02-01T04:00:00.000Z',
        safetyWindowHours: 4
      };
      const request = {
        ip: '127.0.0.1',
        get: jest.fn().mockReturnValue('test-agent'),
        url: '/api/listings',
        method: 'POST'
      };

      logSafetyViolation('EXPIRED_FOOD', violationDetails, request);

      expect(errorSpy).toHaveBeenCalledWith(
        expect.stringContaining('"level":"ERROR"')
      );
      expect(errorSpy).toHaveBeenCalledWith(
        expect.stringContaining('"message":"Safety validation failed"')
      );
      expect(errorSpy).toHaveBeenCalledWith(
        expect.stringContaining('"violationType":"EXPIRED_FOOD"')
      );
      expect(errorSpy).toHaveBeenCalledWith(
        expect.stringContaining('"foodType":"prepared_meal"')
      );
      expect(errorSpy).toHaveBeenCalledWith(
        expect.stringContaining('"ip":"127.0.0.1"')
      );
    });

    it('should handle missing request object', () => {
      const violationDetails = { reason: 'test' };

      logSafetyViolation('INVALID_HYGIENE', violationDetails);

      expect(errorSpy).toHaveBeenCalledWith(
        expect.stringContaining('"violationType":"INVALID_HYGIENE"')
      );
      expect(errorSpy).toHaveBeenCalledWith(
        expect.stringContaining('"reason":"test"')
      );
    });
  });

  describe('logDatabaseOperation', () => {
    it('should log database operation with performance metrics', () => {
      const details = { count: 5, query: 'find' };
      const duration = 0; // 0ms duration

      logDatabaseOperation('findListings', details, duration);

      expect(logSpy).toHaveBeenCalledWith(
        expect.stringContaining('"level":"INFO"')
      );
      expect(logSpy).toHaveBeenCalledWith(
        expect.stringContaining('"message":"Database operation completed: findListings"')
      );
      expect(logSpy).toHaveBeenCalledWith(
        expect.stringContaining('"operation":"findListings"')
      );
      expect(logSpy).toHaveBeenCalledWith(
        expect.stringContaining('"count":5')
      );
      expect(logSpy).toHaveBeenCalledWith(
        expect.stringContaining('"duration":"0ms"')
      );
      expect(logSpy).toHaveBeenCalledWith(
        expect.stringContaining('"performance":"NORMAL"')
      );
    });

    it('should detect slow operations', () => {
      const duration = 2000; // 2 seconds
      const details = { query: 'complex-aggregation' };

      logDatabaseOperation('slowQuery', details, duration);

      expect(logSpy).toHaveBeenCalledWith(
        expect.stringContaining('"performance":"SLOW"')
      );
      expect(logSpy).toHaveBeenCalledWith(
        expect.stringContaining('"duration":"2000ms"')
      );
    });

    it('should handle missing details', () => {
      const duration = 0;

      logDatabaseOperation('simpleOperation', {}, duration);

      expect(logSpy).toHaveBeenCalledWith(
        expect.stringContaining('"operation":"simpleOperation"')
      );
      expect(logSpy).toHaveBeenCalledWith(
        expect.stringContaining('"details":{}')
      );
    });

    it('should handle errors in database operations', () => {
      const duration = 0;
      const error = new Error('Connection timeout');

      logDatabaseOperation('failedOperation', {}, duration, error);

      expect(errorSpy).toHaveBeenCalledWith(
        expect.stringContaining('"level":"ERROR"')
      );
      expect(errorSpy).toHaveBeenCalledWith(
        expect.stringContaining('"message":"Database operation failed: failedOperation"')
      );
      expect(errorSpy).toHaveBeenCalledWith(
        expect.stringContaining('"name":"Error"')
      );
      expect(errorSpy).toHaveBeenCalledWith(
        expect.stringContaining('"message":"Connection timeout"')
      );
    });
  });

  describe('LOG_LEVELS constants', () => {
    it('should have correct log level constants', () => {
      expect(LOG_LEVELS.ERROR).toBe('ERROR');
      expect(LOG_LEVELS.WARN).toBe('WARN');
      expect(LOG_LEVELS.INFO).toBe('INFO');
      expect(LOG_LEVELS.DEBUG).toBe('DEBUG');
    });
  });

  describe('structured logging format', () => {
    it('should always include timestamp', () => {
      logInfo('Test message');

      expect(logSpy).toHaveBeenCalledWith(
        expect.stringContaining('"timestamp":"2026-02-01T10:00:00.000Z"')
      );
    });

    it('should produce valid JSON', () => {
      logError('Test error', { key: 'value' });

      const loggedMessage = errorSpy.mock.calls[0][0];
      expect(() => JSON.parse(loggedMessage)).not.toThrow();
    });

    it('should handle complex nested objects', () => {
      const complexContext = {
        user: { id: 1, name: 'test' },
        metadata: { tags: ['a', 'b'], count: 5 }
      };

      logInfo('Complex log', complexContext);

      const loggedMessage = logSpy.mock.calls[0][0];
      const parsed = JSON.parse(loggedMessage);
      expect(parsed.user.id).toBe(1);
      expect(parsed.metadata.tags).toEqual(['a', 'b']);
    });
  });
});