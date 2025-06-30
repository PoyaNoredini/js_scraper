/**
 * Validate extracted data by checking its minimum length.
 * @param {string|null} data - The extracted data (text, address, phone, etc.)
 * @param {number} minLength - Minimum required length (default: 100)
 * @returns {string|null} - Returns data if valid, otherwise null
 */
function validateLength(data, maxLength) {
  if (data && data.trim().length <= maxLength) {
    return data.trim();
  }
  return null;
}

module.exports = {
  validateLength
};
