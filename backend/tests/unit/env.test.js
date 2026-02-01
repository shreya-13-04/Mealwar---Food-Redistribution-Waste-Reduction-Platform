/**
 * Unit tests for environment configuration (src/config/env.js)
 *
 * Key reality:
 * 1) env.js calls dotenv.config() immediately on module load.
 * 2) env.js calls validateEnvironment() immediately on module load inside try/catch.
 * 3) If validation fails:
 *    - it logs console.error('Environment validation failed:', error.message)
 *    - and calls process.exit(1) ONLY when config.nodeEnv !== 'test'
 * 4) validateEnvironment() itself DOES throw when called directly.
 *
 * So we test in TWO ways:
 * A) validateEnvironment() direct calls -> should throw / not throw (NO exit expected)
 * B) module-load behavior -> require() never throws (because env.js catches),
 *    but may call process.exit(1) depending on nodeEnv.
 */

describe('Environment Configuration (Unit)', () => {
  let originalEnv;

  // Console spies (we silence output during tests)
  let logSpy, errorSpy, warnSpy;

  // Prevent Jest from exiting if env.js calls process.exit()
  let exitSpy;

  /**
   * Loads env.js with a fresh module cache.
   * Also mocks dotenv + path so we can assert dotenv.config() path usage.
   *
   * NOTE:
   * - env.js executes on require(), so each test that cares about module-load
   *   behavior must use a fresh import (jest.resetModules()).
   */
  const loadFreshEnvModule = () => {
    jest.resetModules();

    // Mock dotenv + path BEFORE importing env.js
    jest.doMock('dotenv', () => ({ config: jest.fn() }));
    jest.doMock('path', () => ({
      resolve: jest.fn().mockReturnValue('/mocked/path/.env')
    }));

    // Now import the module under test (this triggers module-load validation)
    return require('../../src/config/env');
  };

  beforeEach(() => {
    originalEnv = { ...process.env };

    // Silence console output but keep ability to assert calls
    logSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
    errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});

    // Block process.exit so Jest doesn't terminate
    exitSpy = jest.spyOn(process, 'exit').mockImplementation(() => {});
  });

  afterEach(() => {
    process.env = originalEnv;

    logSpy.mockRestore();
    errorSpy.mockRestore();
    warnSpy.mockRestore();

    exitSpy.mockRestore();
  });

  /* ============================================================
     MODULE LOADING
     ============================================================ */
  describe('Module Loading', () => {
    it('should load dotenv with correct resolved path', () => {
      // IMPORTANT: to avoid exit during module load, make env valid and NODE_ENV=test
      process.env.NODE_ENV = 'test';
      process.env.MONGODB_URI = 'mongodb://localhost:27017/test';
      process.env.PORT = '3000';

      const envModule = loadFreshEnvModule();

      // Access mocked modules to assert calls
      const dotenv = require('dotenv');
      const path = require('path');

      // env.js: dotenv.config({ path: path.resolve(__dirname, '../../.env') });
      expect(path.resolve).toHaveBeenCalledWith(expect.any(String), '../../.env');
      expect(dotenv.config).toHaveBeenCalledWith({ path: '/mocked/path/.env' });

      // env.js logs success when validateEnvironment passes
      expect(console.log).toHaveBeenCalledWith('Environment validated successfully (test)');

      // Sanity: exports exist
      expect(envModule).toHaveProperty('config');
      expect(envModule).toHaveProperty('validateEnvironment');
    });
  });

  /* ============================================================
     validateEnvironment() DIRECT TESTS
     (This function throws; it does NOT call process.exit.)
     ============================================================ */
  describe('validateEnvironment', () => {
    it('should pass validation with all required variables', () => {
      // Load module safely (module-load validation should pass)
      process.env.NODE_ENV = 'test';
      process.env.MONGODB_URI = 'mongodb://localhost:27017/test';
      process.env.PORT = '3000';

      const { validateEnvironment } = loadFreshEnvModule();

      // Direct call should not throw
      expect(() => validateEnvironment()).not.toThrow();
      expect(process.exit).not.toHaveBeenCalled();
    });

    it('should throw error for missing MONGODB_URI', () => {
      /**
       * IMPORTANT:
       * If we load env.js with missing vars, module-load catch may call exit.
       * So we:
       * 1) load env.js with valid env
       * 2) then delete the variable
       * 3) call validateEnvironment directly
       */
      process.env.NODE_ENV = 'test';
      process.env.MONGODB_URI = 'mongodb://localhost:27017/test';
      process.env.PORT = '3000';

      const { validateEnvironment } = loadFreshEnvModule();

      delete process.env.MONGODB_URI;

      expect(() => validateEnvironment()).toThrow(
        'Missing required environment variables: MONGODB_URI'
      );

      // validateEnvironment itself never exits
      expect(process.exit).not.toHaveBeenCalled();
    });

    it('should throw error for missing PORT', () => {
      process.env.NODE_ENV = 'test';
      process.env.MONGODB_URI = 'mongodb://localhost:27017/test';
      process.env.PORT = '3000';

      const { validateEnvironment } = loadFreshEnvModule();

      delete process.env.PORT;

      expect(() => validateEnvironment()).toThrow(
        'Missing required environment variables: PORT'
      );

      expect(process.exit).not.toHaveBeenCalled();
    });

    it('should throw error for missing NODE_ENV', () => {
      /**
       * This is the one that was failing for you.
       * Reason: you were requiring env.js while NODE_ENV was missing,
       *         so env.js defaulted to 'development' and called exit(1).
       *
       * Fix: load env.js with NODE_ENV='test' FIRST, then delete NODE_ENV,
       * then call validateEnvironment().
       */
      process.env.NODE_ENV = 'test';
      process.env.MONGODB_URI = 'mongodb://localhost:27017/test';
      process.env.PORT = '3000';

      const { validateEnvironment } = loadFreshEnvModule();

      delete process.env.NODE_ENV;

      expect(() => validateEnvironment()).toThrow(
        'Missing required environment variables: NODE_ENV'
      );

      expect(process.exit).not.toHaveBeenCalled();
    });

    it('should throw error for multiple missing variables', () => {
      /**
       * Same fix: load safely first, then delete vars, then call validateEnvironment().
       */
      process.env.NODE_ENV = 'test';
      process.env.MONGODB_URI = 'mongodb://localhost:27017/test';
      process.env.PORT = '3000';

      const { validateEnvironment } = loadFreshEnvModule();

      delete process.env.MONGODB_URI;
      delete process.env.PORT;
      delete process.env.NODE_ENV;

      expect(() => validateEnvironment()).toThrow(
        'Missing required environment variables: MONGODB_URI, PORT, NODE_ENV'
      );

      expect(process.exit).not.toHaveBeenCalled();
    });

    it('should warn when safety window vars are missing (but not throw)', () => {
      process.env.NODE_ENV = 'test';
      process.env.MONGODB_URI = 'mongodb://localhost:27017/test';
      process.env.PORT = '3000';

      // Ensure safety vars are missing
      delete process.env.PREPARED_MEAL_SAFETY_WINDOW;
      delete process.env.FRESH_PRODUCE_SAFETY_WINDOW;
      delete process.env.PACKAGED_FOOD_SAFETY_WINDOW;
      delete process.env.BAKERY_ITEM_SAFETY_WINDOW;
      delete process.env.DAIRY_PRODUCT_SAFETY_WINDOW;

      const { validateEnvironment } = loadFreshEnvModule();

      expect(() => validateEnvironment()).not.toThrow();

      // validateEnvironment uses console.warn when safety vars are missing
      expect(console.warn).toHaveBeenCalled();
      expect(process.exit).not.toHaveBeenCalled();
    });
  });

  /* ============================================================
     CONFIG OBJECT TESTS
     (These test exported values and booleans)
     ============================================================ */
  describe('config object', () => {
    it('should export correct config values', () => {
      process.env.NODE_ENV = 'development';
      process.env.MONGODB_URI = 'mongodb://localhost:27017/testdb';
      process.env.PORT = '4000';
      process.env.LOG_LEVEL = 'debug';
      process.env.ENABLE_REQUEST_LOGGING = 'true';

      const { config } = loadFreshEnvModule();

      // Must match env.js key names exactly
      expect(config.mongodbUri).toBe('mongodb://localhost:27017/testdb');
      expect(config.port).toBe(4000);
      expect(config.nodeEnv).toBe('development');
      expect(config.logLevel).toBe('debug');
      expect(config.enableRequestLogging).toBe(true);

      expect(config.isDevelopment).toBe(true);
      expect(config.isProduction).toBe(false);
      expect(config.isTesting).toBe(false);
    });

    it('should handle production environment flags', () => {
      process.env.NODE_ENV = 'production';
      process.env.MONGODB_URI = 'mongodb://localhost:27017/testdb';
      process.env.PORT = '3000';

      const { config } = loadFreshEnvModule();

      expect(config.isProduction).toBe(true);
      expect(config.isDevelopment).toBe(false);
      expect(config.isTesting).toBe(false);
    });

    it('should handle test environment flags', () => {
      process.env.NODE_ENV = 'test';
      process.env.MONGODB_URI = 'mongodb://localhost:27017/testdb';
      process.env.PORT = '3000';

      const { config } = loadFreshEnvModule();

      expect(config.isTesting).toBe(true);
      expect(config.isProduction).toBe(false);
      expect(config.isDevelopment).toBe(false);
    });

    it('should convert PORT to a number', () => {
      process.env.NODE_ENV = 'test';
      process.env.MONGODB_URI = 'mongodb://localhost:27017/testdb';
      process.env.PORT = '5000';

      const { config } = loadFreshEnvModule();

      expect(config.port).toBe(5000);
      expect(typeof config.port).toBe('number');
    });

    it('should default LOG_LEVEL to info', () => {
      process.env.NODE_ENV = 'test';
      process.env.MONGODB_URI = 'mongodb://localhost:27017/testdb';
      process.env.PORT = '3000';
      delete process.env.LOG_LEVEL;

      const { config } = loadFreshEnvModule();

      expect(config.logLevel).toBe('info');
    });
  });

  /* ============================================================
     MODULE-LOAD VALIDATION BEHAVIOR
     (env.js catches errors; require() should NOT throw)
     ============================================================ */
  describe('Validation on module load', () => {
    it('should NOT throw during require() even if env is invalid (because env.js catches)', () => {
      delete process.env.MONGODB_URI;
      delete process.env.PORT;
      delete process.env.NODE_ENV;

      expect(() => loadFreshEnvModule()).not.toThrow();
    });

    it('should call process.exit(1) when validation fails and nodeEnv is NOT test', () => {
      /**
       * If NODE_ENV is missing, env.js sets nodeEnv = 'development'
       * and WILL call process.exit(1) inside catch.
       */
      delete process.env.MONGODB_URI;
      delete process.env.PORT;
      delete process.env.NODE_ENV;

      loadFreshEnvModule();

      expect(process.exit).toHaveBeenCalledWith(1);

      // env.js logs two args: console.error('Environment validation failed:', error.message)
      expect(console.error).toHaveBeenCalledWith(
        'Environment validation failed:',
        expect.stringContaining('Missing required environment variables')
      );
    });

    it('should NOT exit when validation fails but nodeEnv is test', () => {
      /**
       * Must set NODE_ENV=test at require time, otherwise env.js defaults to development and exits.
       */
      process.env.NODE_ENV = 'test';
      delete process.env.MONGODB_URI; // invalid env
      process.env.PORT = '3000';

      loadFreshEnvModule();

      expect(process.exit).not.toHaveBeenCalled();

      expect(console.error).toHaveBeenCalledWith(
        'Environment validation failed:',
        expect.stringContaining('Missing required environment variables')
      );
    });
  });
});
