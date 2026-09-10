/**
 * AlignFin Utility Functions & Formatters
 */

/**
 * Format a number into Indian Rupee (INR) currency format (e.g. ₹1,28,762)
 * @param {number|string} val - Number to format
 * @returns {string} Formatted currency string
 */
function formatINR(val) {
  if (val === undefined || val === null) return '₹0';
  return '₹' + Number(val).toLocaleString('en-IN');
}
