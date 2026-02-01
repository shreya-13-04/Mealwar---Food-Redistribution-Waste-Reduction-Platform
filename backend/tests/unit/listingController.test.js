/**
 * tests/unit/listingController.test.js
 *
 * Unit tests for src/controllers/listingController.js
 *
 * GOAL:
 * - Test controller logic in isolation (pure unit tests).
 *
 * WHAT WE MOCK:
 * - Listing model:
 *   - constructor: new Listing(data)
 *   - statics: Listing.findById(), Listing.findByIdAndDelete()
 * - expiryUtils:
 *   - markExpiredListings(), getActiveListings()
 * - asyncHandler:
 *   - mocked to return the function directly (no wrapper)
 *
 * NOTE ABOUT CONSOLE:
 * - The controller logs errors using console.error().
 * - In unit tests, we silence console.error/console.log to avoid noisy output.
 */

describe('Listing Controller (Unit)', () => {
  let req, res, next;

  let controller;

  // Listing constructor mock (used by `new Listing(...)`)
  let ListingCtorMock;

  // Listing statics mock (used by Listing.findById etc.)
  let ListingStatics;

  // expiry utils mocks
  let expiryUtilsMock;

  // console spies (silence output)
  let logSpy;
  let errorSpy;

  const loadControllerFresh = () => {
    jest.resetModules();

    // --- Mock Listing model (constructor + statics) ---
    ListingCtorMock = jest.fn();

    ListingStatics = {
      findById: jest.fn(),
      findByIdAndDelete: jest.fn(),
      findByIdAndUpdate: jest.fn(),
    };

    jest.doMock('../../src/models/Listing', () => {
      function Listing(data) {
        return ListingCtorMock(data);
      }
      Listing.findById = ListingStatics.findById;
      Listing.findByIdAndDelete = ListingStatics.findByIdAndDelete;
      Listing.findByIdAndUpdate = ListingStatics.findByIdAndUpdate;
      return Listing;
    });

    // --- Mock expiry utils (must return Promises because controller uses .then()) ---
    expiryUtilsMock = {
      markExpiredListings: jest.fn(),
      getActiveListings: jest.fn(),
    };
    jest.doMock('../../src/utils/expiryUtils', () => expiryUtilsMock);

    // --- Mock asyncHandler ---
    jest.doMock('../../src/middlewares/errorHandler', () => ({
      asyncHandler: (fn) => fn
    }));

    controller = require('../../src/controllers/listingController');
  };

  beforeAll(() => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2026-02-01T10:00:00.000Z'));
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  beforeEach(() => {
    // Silence console to avoid noisy test output
    logSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
    errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    loadControllerFresh();

    req = {
      body: {},
      params: {},
      query: {},
      ip: '127.0.0.1'
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis()
    };

    next = jest.fn();

    jest.clearAllMocks();
  });

  afterEach(() => {
    logSpy.mockRestore();
    errorSpy.mockRestore();
  });

  /* ============================================================
     createListing
     ============================================================ */
  describe('createListing', () => {
    it('should reject missing required fields (400) and log error', async () => {
      req.body = { foodType: 'prepared_meal' }; // missing others

      await controller.createListing(req, res, next);

      // Response assertions
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: false,
          error: 'Missing required fields',
          details: expect.objectContaining({
            missingFields: ['quantity', 'preparedAt', 'hygieneStatus']
          })
        })
      );

      // Optional: assert the controller logged (without printing)
      expect(console.error).toHaveBeenCalledWith(
        'Missing required fields for listing creation:',
        expect.objectContaining({
          missingFields: ['quantity', 'preparedAt', 'hygieneStatus'],
          providedFields: ['foodType'],
          ip: '127.0.0.1'
        })
      );
    });

    it('should create listing when valid and safe, then return 201', async () => {
      req.body = {
        foodType: 'prepared_meal',
        quantity: 5,
        preparedAt: '2026-02-01T08:00:00.000Z',
        hygieneStatus: 'good'
      };

      const mockDoc = {
        _id: 'test-id',
        expiryTime: new Date('2026-02-01T12:00:00.000Z'),
        isSafe: jest.fn().mockReturnValue(true),
        save: jest.fn().mockResolvedValue(),
        status: 'active'
      };

      ListingCtorMock.mockReturnValue(mockDoc);

      await controller.createListing(req, res, next);

      expect(ListingCtorMock).toHaveBeenCalledWith(
        expect.objectContaining({
          foodType: 'prepared_meal',
          quantity: 5,
          preparedAt: expect.any(Date),
          hygieneStatus: 'good'
        })
      );

      expect(mockDoc.save).toHaveBeenCalled();

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          data: mockDoc,
          message: 'Listing created successfully'
        })
      );
    });

    it('should return 422 if listing fails safety check', async () => {
      req.body = {
        foodType: 'prepared_meal',
        quantity: 5,
        preparedAt: '2026-02-01T08:00:00.000Z',
        hygieneStatus: 'good'
      };

      const mockDoc = {
        _id: 'test-id',
        expiryTime: new Date('2026-02-01T12:00:00.000Z'),
        isSafe: jest.fn().mockReturnValue(false),
        save: jest.fn()
      };

      ListingCtorMock.mockReturnValue(mockDoc);

      await controller.createListing(req, res, next);

      expect(res.status).toHaveBeenCalledWith(422);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: false,
          error: 'Listing does not meet safety requirements'
        })
      );

      expect(mockDoc.save).not.toHaveBeenCalled();
    });

    it('should return mock 201 response when save throws timeout/buffering error', async () => {
      req.body = {
        foodType: 'prepared_meal',
        quantity: 5,
        preparedAt: '2026-02-01T08:00:00.000Z',
        hygieneStatus: 'good'
      };

      const mockDoc = {
        _id: 'test-id',
        expiryTime: new Date('2026-02-01T12:00:00.000Z'),
        isSafe: jest.fn().mockReturnValue(true),
        save: jest.fn().mockRejectedValue(new Error('buffering timed out'))
      };

      ListingCtorMock.mockReturnValue(mockDoc);

      await controller.createListing(req, res, next);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          message: expect.stringContaining('(test mode)'),
          note: expect.any(String)
        })
      );
    });
  });

  /* ============================================================
     getListings
     ============================================================ */
  describe('getListings', () => {
    it('should call markExpiredListings & getActiveListings and return 200', async () => {
      const mockListings = [
        { _id: '1', foodType: 'prepared_meal', status: 'active' }
      ];

      expiryUtilsMock.markExpiredListings.mockResolvedValue(2);
      expiryUtilsMock.getActiveListings.mockResolvedValue(mockListings);

      await controller.getListings(req, res, next);

      expect(expiryUtilsMock.markExpiredListings).toHaveBeenCalled();
      expect(expiryUtilsMock.getActiveListings).toHaveBeenCalled();

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          data: mockListings,
          meta: expect.objectContaining({
            expiredMarked: 2,
            totalActive: 1
          })
        })
      );
    });

    it('should return empty listings on timeout/buffering error (200)', async () => {
      expiryUtilsMock.markExpiredListings.mockRejectedValue(new Error('Database operation timeout'));
      expiryUtilsMock.getActiveListings.mockResolvedValue([{ _id: 'x' }]);

      await controller.getListings(req, res, next);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          data: []
        })
      );
    });
  });

  /* ============================================================
     getListingById
     ============================================================ */
  describe('getListingById', () => {
    it('should call Listing.findById and return 200 when found', async () => {
      req.params.id = 'test-id';

      const mockDoc = {
        _id: 'test-id',
        status: 'active',
        isExpired: jest.fn().mockReturnValue(false),
        save: jest.fn()
      };

      ListingStatics.findById.mockResolvedValue(mockDoc);

      await controller.getListingById(req, res, next);

      expect(ListingStatics.findById).toHaveBeenCalledWith('test-id');
      expect(res.status).toHaveBeenCalledWith(200);
    });

    it('should return 404 when listing not found', async () => {
      req.params.id = 'test-id';
      ListingStatics.findById.mockResolvedValue(null);

      await controller.getListingById(req, res, next);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: false,
          error: 'Listing not found'
        })
      );
    });

    it('should mark listing expired when isExpired() true and status is active', async () => {
      req.params.id = 'test-id';

      const mockDoc = {
        _id: 'test-id',
        status: 'active',
        isExpired: jest.fn().mockReturnValue(true),
        save: jest.fn().mockResolvedValue()
      };

      ListingStatics.findById.mockResolvedValue(mockDoc);

      await controller.getListingById(req, res, next);

      expect(mockDoc.status).toBe('expired');
      expect(mockDoc.save).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
    });
  });

  /* ============================================================
     updateListing
     ============================================================ */
  describe('updateListing', () => {
    it('should update status and save when listing exists', async () => {
      req.params.id = 'test-id';
      req.body = { status: 'claimed' };

      const mockDoc = {
        _id: 'test-id',
        status: 'active',
        save: jest.fn().mockResolvedValue()
      };

      ListingStatics.findById.mockResolvedValue(mockDoc);

      await controller.updateListing(req, res, next);

      expect(ListingStatics.findById).toHaveBeenCalledWith('test-id');
      expect(mockDoc.status).toBe('claimed');
      expect(mockDoc.save).toHaveBeenCalled();

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          data: mockDoc,
          message: 'Listing updated successfully'
        })
      );
    });

    it('should return 400 for invalid status', async () => {
      req.params.id = 'test-id';
      req.body = { status: 'invalid_status' };

      const mockDoc = { _id: 'test-id', status: 'active', save: jest.fn() };
      ListingStatics.findById.mockResolvedValue(mockDoc);

      await controller.updateListing(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: false,
          error: 'Invalid status'
        })
      );

      expect(mockDoc.save).not.toHaveBeenCalled();
    });

    it('should return 404 if listing not found', async () => {
      req.params.id = 'test-id';
      ListingStatics.findById.mockResolvedValue(null);

      await controller.updateListing(req, res, next);

      expect(res.status).toHaveBeenCalledWith(404);
    });
  });

  /* ============================================================
     deleteListing
     ============================================================ */
  describe('deleteListing', () => {
    it('should find listing then delete it', async () => {
      req.params.id = 'test-id';

      const mockDoc = {
        _id: 'test-id',
        foodType: 'prepared_meal',
        quantity: 5,
        status: 'active'
      };

      ListingStatics.findById.mockResolvedValue(mockDoc);
      ListingStatics.findByIdAndDelete.mockResolvedValue(mockDoc);

      await controller.deleteListing(req, res, next);

      expect(ListingStatics.findById).toHaveBeenCalledWith('test-id');
      expect(ListingStatics.findByIdAndDelete).toHaveBeenCalledWith('test-id');

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          data: expect.objectContaining({
            deletedListing: expect.objectContaining({
              id: 'test-id'
            })
          }),
          message: 'Listing deleted successfully'
        })
      );
    });

    it('should return 404 if listing not found', async () => {
      req.params.id = 'test-id';
      ListingStatics.findById.mockResolvedValue(null);

      await controller.deleteListing(req, res, next);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(ListingStatics.findByIdAndDelete).not.toHaveBeenCalled();
    });
  });
});
