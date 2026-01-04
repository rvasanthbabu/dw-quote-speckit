/**
 * Format a number as currency (USD)
 * @param {number} amount - Amount to format
 * @returns {string} Formatted currency string (e.g., "$1,200.00")
 */
export function formatCurrency(amount) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

/**
 * Format a number with commas as thousands separator
 * @param {number} num - Number to format
 * @returns {string} Formatted number string (e.g., "1,200")
 */
export function formatNumber(num) {
  return new Intl.NumberFormat('en-US').format(num);
}

/**
 * Parse currency string to number
 * @param {string} currencyStr - Currency string (e.g., "$1,200.00")
 * @returns {number} Parsed number
 */
export function parseCurrency(currencyStr) {
  return parseFloat(currencyStr.replace(/[^0-9.-]+/g, ''));
}
