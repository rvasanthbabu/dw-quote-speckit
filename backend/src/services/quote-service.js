import { calculateQuote } from '../models/quote-calculation.js';
import { getRiskFactor, loadQuoteRules } from './data-service.js';
import { validateProperty } from '../models/validation-schema.js';

/**
 * Calculate quote for a property
 * @param {Object} property - Property details
 * @returns {Promise<Object>} Quote result or error
 */
export async function getQuote(property) {
  // Validate property input
  const validation = validateProperty(property);
  if (!validation.valid) {
    return {
      success: false,
      errors: validation.errors,
    };
  }

  try {
    // Load data
    const riskFactor = await getRiskFactor(property.address.zipCode);
    const quoteRules = await loadQuoteRules();

    // Calculate quote
    const quote = calculateQuote(property, riskFactor, quoteRules);

    // Add contact info for high-value quotes
    if (quote.isHighValue) {
      quote.contactInfo = quoteRules.contactInfo;
    }

    return {
      success: true,
      quote,
    };
  } catch (error) {
    console.error('Error calculating quote:', error);
    return {
      success: false,
      errors: ['Failed to calculate quote. Please try again later.'],
    };
  }
}
