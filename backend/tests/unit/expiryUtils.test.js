/**
 * Unit tests for expiry utilities
 * Requirements: 3.1, 3.3, 3.5
 */

const { 
  calculateExpiryTime, 
  markExpiredListings, 
  isExpired,
  isWithinSafetyWindow,
  getSafetyWindow,
  getActiveListings,
  checkListingExpiry
} = require('../../src/utils/expiryUtils');

const Listing = require('../../src/models/Listing');

// Mock the Listing model for testing
jest.mock('../../src/models/Listing');

describe('Expiry Utilities', () => {
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
    jest.clearAllMocks();
    // Clean console mocking approach
    logSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
    errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    logSpy.mockRestore();
    errorSpy.mockRestore();
  });

  describe('calculateExpiryTime', () => {
    it('should calculate expiry time for prepared meal (4 hours)', () => {
      const preparedAt = new Date('2026-02-01T08:00:00.000Z');
      const expiryTime = calculateExpiryTime(preparedAt, 'prepared_meal');
      
      expect(expiryTime).toEqual(new Date('2026-02-01T12:00:00.000Z'));
    });

    it('should calculate expiry time for fresh produce (24 hours)', () => {
      const preparedAt = new Date('2026-02-01T08:00:00.000Z');
      const expiryTime = calculateExpiryTime(preparedAt, 'fresh_produce');
      
      expect(expiryTime).toEqual(new Date('2026-02-02T08:00:00.000Z'));
    });

    it('should calculate expiry time for bakery item (12 hours)', () => {
      const preparedAt = new Date('2026-02-01T08:00:00.000Z');
      const expiryTime = calculateExpiryTime(preparedAt, 'bakery_item');
      
      expect(expiryTime).toEqual(new Date('2026-02-01T20:00:00.000Z'));
    });

    it('should use default safety window for unknown food type', () => {
      const preparedAt = new Date('2026-02-01T08:00:00.000Z');
      const expiryTime = calculateExpiryTime(preparedAt, 'unknown_food');
      
      // Should default to 4 hours
      expect(expiryTime).toEqual(new Date('2026-02-01T12:00:00.000Z'));
    });

    it('should throw error for missing preparedAt', () => {
      expect(() => {
        calculateExpiryTime(null, 'prepared_meal');
      }).toThrow('Both preparedAt and foodType are required');
    });

    it('should throw error for missing foodType', () => {
      const preparedAt = new Date();
      expect(() => {
        calculateExpiryTime(preparedAt, null);
      }).toThrow('Both preparedAt and foodType are required');
    });
  });

  describe('isExpired', () => {
    it('should return true for past expiry time', () => {
      const pastTime = new Date('2026-02-01T08:00:00.000Z'); // 2 hours before frozen time
      expect(isExpired(pastTime)).toBe(true);
    });

    it('should return false for future expiry time', () => {
      const futureTime = new Date('2026-02-01T12:00:00.000Z'); // 2 hours after frozen time
      expect(isExpired(futureTime)).toBe(false);
    });

    it('should throw error for missing expiry time', () => {
      expect(() => {
        isExpired(null);
      }).toThrow('Expiry time is required');
    });
  });

  describe('markExpiredListings', () => {
    it('should mark expired listings and return count', async () => {
      const mockResult = { modifiedCount: 3 };
      Listing.updateMany.mockResolvedValue(mockResult);

      const result = await markExpiredListings();

      expect(Listing.updateMany).toHaveBeenCalledWith(
        { 
          expiryTime: { $lt: expect.any(Date) }, 
          status: 'active' 
        },
        { 
          $set: { status: 'expired' } 
        }
      );
      expect(result).toBe(3);
    });

    it('should handle zero expired listings', async () => {
      const mockResult = { modifiedCount: 0 };
      Listing.updateMany.mockResolvedValue(mockResult);

      const result = await markExpiredListings();

      expect(result).toBe(0);
      // Don't test logging behavior - focus on return value and query shape
    });

    it('should handle database errors', async () => {
      const error = new Error('Database connection failed');
      Listing.updateMany.mockRejectedValue(error);

      await expect(markExpiredListings()).rejects.toThrow('Database connection failed');
      // The actual implementation uses structured logging, so we just verify error was logged
      expect(errorSpy).toHaveBeenCalled();
    });
  });

  describe('isWithinSafetyWindow', () => {
    it('should return true for food within safety window', () => {
      // 2 hours before frozen time (within 4-hour window for prepared_meal)
      const recentTime = new Date('2026-02-01T08:00:00.000Z');
      expect(isWithinSafetyWindow(recentTime, 'prepared_meal')).toBe(true);
    });

    it('should return false for food outside safety window', () => {
      // 6 hours before frozen time (outside 4-hour window for prepared_meal)
      const oldTime = new Date('2026-02-01T04:00:00.000Z');
      expect(isWithinSafetyWindow(oldTime, 'prepared_meal')).toBe(false);
    });

    it('should return false for missing parameters', () => {
      expect(isWithinSafetyWindow(null, 'prepared_meal')).toBe(false);
      expect(isWithinSafetyWindow(new Date(), null)).toBe(false);
    });
  });

  describe('getSafetyWindow', () => {
    it('should return correct safety window for each food type', () => {
      expect(getSafetyWindow('prepared_meal')).toBe(4);
      expect(getSafetyWindow('fresh_produce')).toBe(24);
      expect(getSafetyWindow('bakery_item')).toBe(12);
      expect(getSafetyWindow('packaged_food')).toBe(720);
      expect(getSafetyWindow('dairy_product')).toBe(168);
    });

    it('should return default safety window for unknown food type', () => {
      expect(getSafetyWindow('unknown_food')).toBe(4);
    });
  });

  describe('getActiveListings', () => {
    it('should mark expired listings and return active ones', async () => {
      const mockListings = [
        { _id: '1', status: 'active', foodType: 'prepared_meal' },
        { _id: '2', status: 'active', foodType: 'fresh_produce' }
      ];
      
      Listing.updateMany.mockResolvedValue({ modifiedCount: 1 });
      Listing.find.mockReturnValue({
        sort: jest.fn().mockResolvedValue(mockListings)
      });

      const result = await getActiveListings();

      expect(Listing.updateMany).toHaveBeenCalled();
      expect(Listing.find).toHaveBeenCalledWith({ status: 'active' });
      expect(result).toEqual(mockListings);
    });

    it('should handle database errors', async () => {
      const error = new Error('Database error');
      Listing.updateMany.mockRejectedValue(error);

      await expect(getActiveListings()).rejects.toThrow('Database error');
      // The actual implementation uses structured logging, so we just verify error was logged
      expect(errorSpy).toHaveBeenCalled();
    });
  });

  describe('checkListingExpiry', () => {
    it('should mark expired listing and return updated listing', async () => {
      const mockListing = {
        _id: 'test-id',
        status: 'active',
        expiryTime: new Date('2026-02-01T08:00:00.000Z'), // Past date (before frozen time)
        save: jest.fn().mockResolvedValue()
      };
      
      Listing.findById.mockResolvedValue(mockListing);

      const result = await checkListingExpiry('test-id');

      expect(Listing.findById).toHaveBeenCalledWith('test-id');
      expect(mockListing.status).toBe('expired');
      expect(mockListing.save).toHaveBeenCalled();
      // The actual implementation uses structured logging, so we just verify log was called
      expect(logSpy).toHaveBeenCalled();
      expect(result).toBe(mockListing);
    });

    it('should not modify non-expired listing', async () => {
      const mockListing = {
        _id: 'test-id',
        status: 'active',
        expiryTime: new Date('2026-02-01T12:00:00.000Z'), // Future date (after frozen time)
        save: jest.fn()
      };
      
      Listing.findById.mockResolvedValue(mockListing);

      const result = await checkListingExpiry('test-id');

      expect(mockListing.status).toBe('active');
      expect(mockListing.save).not.toHaveBeenCalled();
      expect(result).toBe(mockListing);
    });

    it('should return null for non-existent listing', async () => {
      Listing.findById.mockResolvedValue(null);

      const result = await checkListingExpiry('non-existent-id');

      expect(result).toBeNull();
    });

    it('should handle database errors', async () => {
      const error = new Error('Database error');
      Listing.findById.mockRejectedValue(error);

      await expect(checkListingExpiry('test-id')).rejects.toThrow('Database error');
      // The actual implementation uses structured logging, so we just verify error was logged
      expect(errorSpy).toHaveBeenCalled();
    });
  });
});