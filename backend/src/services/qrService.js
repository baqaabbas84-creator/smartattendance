const QRCode = require('qrcode');
const generateQrToken = require('../utils/generateQrToken');

/**
 * Generate a QR code for an attendance session
 * QR contains ONLY: sessionId + secure token — NO student data
 * @param {string} sessionId - Unique session identifier
 * @returns {{ token: string, qrDataUrl: string }}
 */
const generateSessionQR = async (sessionId) => {
  const token = generateQrToken();

  // Data embedded in QR — minimal and safe
  const qrPayload = JSON.stringify({
    sessionId,
    token,
    app: 'SmartAttendance',
  });

  // Generate QR as base64 data URL (for frontend display)
  const qrDataUrl = await QRCode.toDataURL(qrPayload, {
    errorCorrectionLevel: 'H',
    margin: 2,
    width: 300,
    color: {
      dark: '#1e293b',
      light: '#ffffff',
    },
  });

  return { token, qrDataUrl };
};

/**
 * Parse QR payload from scanned data
 * @param {string} rawData - Raw string from QR scan
 * @returns {{ sessionId: string, token: string } | null}
 */
const parseQRPayload = (rawData) => {
  try {
    const data = typeof rawData === 'string' ? JSON.parse(rawData) : rawData;
    if (!data.sessionId || !data.token) return null;
    return { sessionId: data.sessionId, token: data.token };
  } catch {
    return null;
  }
};

module.exports = { generateSessionQR, parseQRPayload };
