/**
 * Unit tests for Database configuration (src/config/db.js)
 *
 * GOAL:
 * - Test db.js WITHOUT connecting to a real MongoDB server.
 *
 * WHAT WE MOCK:
 * - mongoose.connect(): simulate success/failure
 * - mongoose.connection.on(): verify event handlers are registered
 * - mongoose.connection.close(): simulate graceful shutdown close success/failure
 * - logger (logInfo/logError/logWarning): verify expected logs
 * - process.exit(): prevent Jest from exiting
 * - process.on(): verify SIGINT/SIGTERM handlers are registered
 *
 * IMPORTANT:
 * This test file is written to match your CURRENT src/config/db.js:
 * ✅ On success: logs "MongoDB connected successfully" and returns conn
 * ✅ Registers events: error, disconnected, reconnected
 * ✅ Registers graceful shutdown handlers: SIGINT, SIGTERM
 * ✅ On ANY failure: logs "MongoDB connection failed" then process.exit(1)
 */

describe('Database Configuration (Unit)', () => {
  let mongoose;
  let logger;
  let connectDB;

  // Save original process env
  let originalEnv;

  // Spies
  let exitSpy;
  let processOnSpy;

  /**
   * Helper: load db module with fresh mocks every test
   * Why: require() is cached, and db.js reads env + binds event handlers at runtime.
   */
  const loadFreshModule = () => {
    jest.resetModules();

    // Mock mongoose
    jest.doMock('mongoose', () => ({
      connect: jest.fn(),
      connection: {
        on: jest.fn(),
        close: jest.fn(),
      },
    }));

    // Mock logger
    jest.doMock('../../src/utils/logger', () => ({
      logError: jest.fn(),
      logInfo: jest.fn(),
      logWarning: jest.fn(),
    }));

    // Import mocked deps
    mongoose = require('mongoose');
    logger = require('../../src/utils/logger');

    // Import module under test AFTER mocks
    connectDB = require('../../src/config/db');
  };

  beforeEach(() => {
    // Preserve environment variables
    originalEnv = { ...process.env };

    // Provide defaults expected by db.js
    process.env.NODE_ENV = 'test';
    process.env.MONGODB_URI = 'mongodb://localhost:27017/testdb';

    // Prevent actual exit
    exitSpy = jest.spyOn(process, 'exit').mockImplementation(() => {});

    // Spy on process.on for signal handler checks
    processOnSpy = jest.spyOn(process, 'on');

    // Load module fresh per test
    loadFreshModule();

    jest.clearAllMocks();
  });

  afterEach(() => {
    process.env = originalEnv;
    exitSpy.mockRestore();
    processOnSpy.mockRestore();
  });

  /* ============================================================
     SUCCESSFUL CONNECTION
     ============================================================ */
  describe('Successful Connection', () => {
    it('should connect with correct options and log success', async () => {
      const mockConn = {
        connection: {
          host: 'test-host',
          name: 'test-database',
          readyState: 1,
        },
      };

      mongoose.connect.mockResolvedValue(mockConn);

      const returnedConn = await connectDB();

      // Connect called with URI + options exactly as in db.js
      expect(mongoose.connect).toHaveBeenCalledWith(
        'mongodb://localhost:27017/testdb',
        {
          useNewUrlParser: true,
          useUnifiedTopology: true,
          maxPoolSize: 10,
          serverSelectionTimeoutMS: 5000,
          socketTimeoutMS: 45000,
        }
      );

      // Logs success in db.js format
      expect(logger.logInfo).toHaveBeenCalledWith(
        'MongoDB connected successfully',
        {
          host: 'test-host',
          database: 'test-database',
          readyState: 1,
        }
      );

      // Returns connection object
      expect(returnedConn).toBe(mockConn);

      // Signal handlers registered
      expect(process.on).toHaveBeenCalledWith('SIGINT', expect.any(Function));
      expect(process.on).toHaveBeenCalledWith('SIGTERM', expect.any(Function));
    });

    it('should register mongoose connection event handlers', async () => {
      mongoose.connect.mockResolvedValue({
        connection: { host: 'h', name: 'n', readyState: 1 },
      });

      await connectDB();

      // db.js registers these 3 handlers
      expect(mongoose.connection.on).toHaveBeenCalledWith('error', expect.any(Function));
      expect(mongoose.connection.on).toHaveBeenCalledWith('disconnected', expect.any(Function));
      expect(mongoose.connection.on).toHaveBeenCalledWith('reconnected', expect.any(Function));
    });

    it('should log when mongoose emits "error"', async () => {
      mongoose.connect.mockResolvedValue({
        connection: { host: 'h', name: 'n', readyState: 1 },
      });

      await connectDB();

      // Grab the actual handler function passed to `on('error', handler)`
      const errorHandler = mongoose.connection.on.mock.calls.find(
        ([eventName]) => eventName === 'error'
      )[1];

      const err = new Error('Connection lost');
      errorHandler(err);

      // db.js: logError('MongoDB connection error', {}, err)
      expect(logger.logError).toHaveBeenCalledWith(
        'MongoDB connection error',
        {},
        err
      );
    });

    it('should log when mongoose emits "disconnected"', async () => {
      mongoose.connect.mockResolvedValue({
        connection: { host: 'h', name: 'n', readyState: 1 },
      });

      await connectDB();

      const disconnectedHandler = mongoose.connection.on.mock.calls.find(
        ([eventName]) => eventName === 'disconnected'
      )[1];

      disconnectedHandler();

      expect(logger.logWarning).toHaveBeenCalledWith('MongoDB disconnected');
    });

    it('should log when mongoose emits "reconnected"', async () => {
      mongoose.connect.mockResolvedValue({
        connection: { host: 'h', name: 'n', readyState: 1 },
      });

      await connectDB();

      const reconnectedHandler = mongoose.connection.on.mock.calls.find(
        ([eventName]) => eventName === 'reconnected'
      )[1];

      reconnectedHandler();

      expect(logger.logInfo).toHaveBeenCalledWith('MongoDB reconnected');
    });
  });

  /* ============================================================
     ENV VALIDATION (MONGODB_URI missing)
     ============================================================ */
  describe('Environment Validation', () => {
    it('should log failure and exit(1) when MONGODB_URI is missing', async () => {
      delete process.env.MONGODB_URI;

      // Reload module so it reads fresh env state
      loadFreshModule();

      await connectDB();

      // db.js logs failure + exits(1)
      expect(logger.logError).toHaveBeenCalledWith(
        'MongoDB connection failed',
        expect.objectContaining({
          errorName: expect.any(String),
          connectionString: 'Missing',
        }),
        expect.any(Error)
      );

      expect(process.exit).toHaveBeenCalledWith(1);
      expect(mongoose.connect).not.toHaveBeenCalled();
    });
  });

  /* ============================================================
     CONNECTION FAILURES
     ============================================================ */
  describe('Connection Errors', () => {
    it('should log failure and exit(1) on generic connection error', async () => {
      const err = new Error('Connection failed');
      mongoose.connect.mockRejectedValue(err);

      await connectDB();

      expect(logger.logError).toHaveBeenCalledWith(
        'MongoDB connection failed',
        expect.objectContaining({
          errorName: err.name,
          connectionString: 'Present',
        }),
        err
      );

      expect(process.exit).toHaveBeenCalledWith(1);
    });

    it('should log troubleshooting info when error is MongoServerSelectionError', async () => {
      const err = new Error('Server selection error');
      err.name = 'MongoServerSelectionError';

      mongoose.connect.mockRejectedValue(err);

      await connectDB();

      // 1) main failure log
      expect(logger.logError).toHaveBeenCalledWith(
        'MongoDB connection failed',
        expect.objectContaining({
          errorName: 'MongoServerSelectionError',
          connectionString: 'Present',
        }),
        err
      );

      // 2) troubleshooting suggestions log (db.js only does this for MongoServerSelectionError)
      expect(logger.logError).toHaveBeenCalledWith(
        'MongoDB Atlas connection troubleshooting',
        expect.objectContaining({
          suggestions: expect.any(Array),
        })
      );

      expect(process.exit).toHaveBeenCalledWith(1);
    });
  });

  /* ============================================================
     GRACEFUL SHUTDOWN
     ============================================================ */
  describe('Graceful Shutdown', () => {
    it('SIGINT handler should close connection and exit(0) on success', async () => {
      mongoose.connect.mockResolvedValue({
        connection: { host: 'h', name: 'n', readyState: 1 },
      });

      await connectDB();

      const sigintHandler = process.on.mock.calls.find(
        ([signal]) => signal === 'SIGINT'
      )[1];

      mongoose.connection.close.mockResolvedValue();

      await sigintHandler();

      expect(logger.logInfo).toHaveBeenCalledWith('SIGINT received, closing MongoDB connection...');
      expect(mongoose.connection.close).toHaveBeenCalled();
      expect(logger.logInfo).toHaveBeenCalledWith('MongoDB connection closed through app termination');
      expect(process.exit).toHaveBeenCalledWith(0);
    });

    it('SIGTERM handler should exit(1) if close fails', async () => {
      mongoose.connect.mockResolvedValue({
        connection: { host: 'h', name: 'n', readyState: 1 },
      });

      await connectDB();

      const sigtermHandler = process.on.mock.calls.find(
        ([signal]) => signal === 'SIGTERM'
      )[1];

      const closeErr = new Error('close failed');
      mongoose.connection.close.mockRejectedValue(closeErr);

      await sigtermHandler();

      // db.js: logError('Error during MongoDB shutdown', {}, error)
      expect(logger.logError).toHaveBeenCalledWith(
        'Error during MongoDB shutdown',
        {},
        closeErr
      );

      expect(process.exit).toHaveBeenCalledWith(1);
    });
  });
});
