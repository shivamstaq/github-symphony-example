/**
 * Tests for the auth module.
 *
 * Root cause of flakiness (now fixed):
 *   The original test checked token expiry by calling Date.now() immediately
 *   after generateToken() and asserting the timestamps were exactly equal.
 *   Even a sub-millisecond delay between the two calls caused the assertion
 *   to fail intermittently.
 *
 * Fix:
 *   Assert that expiresAt is within an acceptable tolerance window of the
 *   expected value, and use jest.useFakeTimers() where deterministic time
 *   control is needed.
 */

const { generateToken, isTokenValid } = require('./auth');

describe('auth module', () => {
  describe('generateToken', () => {
    it('returns a token string and an expiresAt timestamp', () => {
      const result = generateToken('user-1');
      expect(typeof result.token).toBe('string');
      expect(result.token).toHaveLength(64); // sha256 hex
      expect(typeof result.expiresAt).toBe('number');
    });

    it('sets expiresAt approximately one hour from now', () => {
      const before = Date.now();
      const { expiresAt } = generateToken('user-1');
      const after = Date.now();

      const ONE_HOUR_MS = 3600 * 1000;
      // FIX: use a tolerance range instead of exact equality.
      // The old flaky assertion was: expect(expiresAt).toBe(Date.now() + ONE_HOUR_MS)
      // which raced against real clock progression.
      expect(expiresAt).toBeGreaterThanOrEqual(before + ONE_HOUR_MS);
      expect(expiresAt).toBeLessThanOrEqual(after + ONE_HOUR_MS);
    });

    it('honours a custom ttl', () => {
      const TTL = 5000;
      const before = Date.now();
      const { expiresAt } = generateToken('user-2', TTL);
      const after = Date.now();

      expect(expiresAt).toBeGreaterThanOrEqual(before + TTL);
      expect(expiresAt).toBeLessThanOrEqual(after + TTL);
    });
  });

  describe('isTokenValid', () => {
    beforeEach(() => {
      jest.useFakeTimers();
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    it('returns true for a freshly generated token', () => {
      const tokenObj = generateToken('user-1');
      expect(isTokenValid(tokenObj)).toBe(true);
    });

    it('returns false for an expired token', () => {
      const TTL = 1000;
      const tokenObj = generateToken('user-1', TTL);

      // Advance time past the token's lifetime.
      jest.advanceTimersByTime(TTL + 1);

      expect(isTokenValid(tokenObj)).toBe(false);
    });

    it('returns false for a null token object', () => {
      expect(isTokenValid(null)).toBe(false);
    });

    it('returns false when expiresAt is missing', () => {
      expect(isTokenValid({ token: 'abc' })).toBe(false);
    });
  });
});
