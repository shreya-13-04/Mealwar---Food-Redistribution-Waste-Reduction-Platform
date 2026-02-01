/**
 * Unit tests for Listing model (schema definition-level tests)
 *
 * What this verifies (WITHOUT DB):
 * - Fields exist + required constraints
 * - Enum values configured correctly
 * - Defaults (status, createdAt)
 * - timestamps option enabled
 * - Indexes registered (schema.index calls)
 * - Pre-save hook registered
 *
 * Note:
 * - We mock mongoose.Schema and mongoose.model
 * - This test checks schema configuration, not runtime DB behavior
 */

let mongoose;
let Listing;

/**
 * Mock mongoose completely so:
 * - No DB connection happens
 * - We can inspect schema constructor inputs + schema method calls
 */
jest.mock('mongoose', () => {
  // This object acts like a schema instance returned by `new mongoose.Schema(...)`
  const schemaInstance = {
    pre: jest.fn(),     // track middleware registration
    index: jest.fn(),   // track index registration
    statics: {},        // where you attach statics
    methods: {},        // where you attach methods
    // Mongoose document helpers used in your pre-save hook condition
    // (your middleware uses this.isNew / this.isModified...)
    // We don't execute middleware here, so not required.
  };

  // Mock Schema constructor
  const Schema = jest.fn().mockImplementation((definition, options) => {
    schemaInstance.definition = definition;
    schemaInstance.options = options;
    return schemaInstance;
  });

  // Mock model registration
  const model = jest.fn().mockReturnValue({});

  return {
    Schema,
    model,
    connection: { on: jest.fn(), once: jest.fn() },
  };
});

describe('Listing Model (Unit)', () => {
  beforeEach(() => {
    // Critical: clear require cache so the model file re-runs each test
    jest.resetModules();
    mongoose = require('mongoose');
    Listing = require('../../src/models/Listing'); // triggers Schema + indexes + pre + model()
  });

  it('should create a schema and register the model', () => {
    expect(mongoose.Schema).toHaveBeenCalledTimes(1);
    expect(mongoose.model).toHaveBeenCalledWith('Listing', expect.any(Object));
    expect(Listing).toBeDefined();
  });

  it('should enable timestamps', () => {
    const schemaOptions = mongoose.Schema.mock.calls[0][1];
    expect(schemaOptions).toEqual(expect.objectContaining({ timestamps: true }));
  });

  it('should define required fields', () => {
    const def = mongoose.Schema.mock.calls[0][0];

    // foodType required
    expect(def.foodType.required).toBeTruthy();

    // quantity required
    expect(def.quantity.required).toBeTruthy();

    // preparedAt required
    expect(def.preparedAt.required).toBeTruthy();

    // hygieneStatus required
    expect(def.hygieneStatus.required).toBeTruthy();

    // expiryTime is NOT required in your schema (auto-calculated)
    expect(def.expiryTime.required).toBeUndefined();
  });

  it('should configure enums correctly (values nested under enum.values)', () => {
    const def = mongoose.Schema.mock.calls[0][0];

    // foodType enum values
    expect(def.foodType.enum.values).toEqual([
      'prepared_meal',
      'fresh_produce',
      'packaged_food',
      'bakery_item',
      'dairy_product',
    ]);

    // hygieneStatus enum values
    expect(def.hygieneStatus.enum.values).toEqual([
      'excellent',
      'good',
      'acceptable',
    ]);

    // status enum values
    expect(def.status.enum.values).toEqual([
      'active',
      'expired',
      'claimed',
    ]);
  });

  it('should configure numeric constraints', () => {
    const def = mongoose.Schema.mock.calls[0][0];

    // quantity min is stored as [value, message] in your schema
    expect(def.quantity.min[0]).toBe(1);
    expect(def.quantity.type).toBe(Number);
  });

  it('should set default values', () => {
    const def = mongoose.Schema.mock.calls[0][0];

    // status default
    expect(def.status.default).toBe('active');

    // createdAt default is Date.now
    expect(def.createdAt.default).toBe(Date.now);
  });

  it('should register database indexes using schema.index()', () => {
    const schemaInstance = mongoose.model.mock.calls[0][1];

    // Your model registers 3 indexes:
    // 1) { status: 1, expiryTime: 1 }
    // 2) { foodType: 1 }
    // 3) { createdAt: -1 }
    expect(schemaInstance.index).toHaveBeenCalledTimes(3);

    // Verify each index call contains the expected keys
    expect(schemaInstance.index).toHaveBeenCalledWith({ status: 1, expiryTime: 1 });
    expect(schemaInstance.index).toHaveBeenCalledWith({ foodType: 1 });
    expect(schemaInstance.index).toHaveBeenCalledWith({ createdAt: -1 });
  });

  it("should register pre('save') middleware for expiry calculation", () => {
    const schemaInstance = mongoose.model.mock.calls[0][1];

    // The pre hook should be registered at least once for 'save'
    expect(schemaInstance.pre).toHaveBeenCalled();

    // Stronger check: first argument must be 'save'
    const calls = schemaInstance.pre.mock.calls;
    const hasSaveHook = calls.some(([hookName]) => hookName === 'save');
    expect(hasSaveHook).toBe(true);
  });

  it('should attach expected statics and methods', () => {
    const schemaInstance = mongoose.model.mock.calls[0][1];

    // Statics attached in your model
    expect(schemaInstance.statics).toHaveProperty('isExpired');
    expect(schemaInstance.statics).toHaveProperty('isSafe');
    expect(schemaInstance.statics).toHaveProperty('getSafetyWindow');

    // Methods attached in your model
    expect(schemaInstance.methods).toHaveProperty('isExpired');
    expect(schemaInstance.methods).toHaveProperty('isSafe');
  });
});
