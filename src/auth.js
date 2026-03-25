/**
 * Auth module — token generation and validation.
 */

const crypto = require('crypto');

const DEFAULT_TTL_MS = 3600 * 1000; // 1 hour

/**
 * Generate a signed token for a given userId.
 * @param {string} userId
 * @param {number} [ttlMs] - token lifetime in milliseconds
 * @returns {{ token: string, expiresAt: number }}
 */
function generateToken(userId, ttlMs = DEFAULT_TTL_MS) {
  const expiresAt = Date.now() + ttlMs;
  const payload = `${userId}:${expiresAt}`;
  const token = crypto.createHash('sha256').update(payload).digest('hex');
  return { token, expiresAt };
}

/**
 * Validate that a token has not expired.
 * @param {{ token: string, expiresAt: number }} tokenObj
 * @returns {boolean}
 */
function isTokenValid(tokenObj) {
  if (!tokenObj || typeof tokenObj.expiresAt !== 'number') {
    return false;
  }
  return Date.now() < tokenObj.expiresAt;
}

module.exports = { generateToken, isTokenValid };
