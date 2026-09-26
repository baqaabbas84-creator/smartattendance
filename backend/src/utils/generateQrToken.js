const crypto = require('crypto');

/**
 * Generate a secure cryptographic QR token for an attendance session
 * The token is a random hex string — it does NOT contain student data
 * @returns {string} 64-character hex string
 */
const generateQrToken = () => {
  return crypto.randomBytes(32).toString('hex');
};

module.exports = generateQrToken;
