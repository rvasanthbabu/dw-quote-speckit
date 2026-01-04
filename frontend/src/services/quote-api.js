import axios from 'axios';
import { API_ENDPOINTS } from '../utils/constants';

/**
 * Calculate quote by calling the backend API
 * @param {Object} property - Property details
 * @returns {Promise<Object>} Quote result
 */
export async function calculateQuote(property) {
  try {
    const response = await axios.post(API_ENDPOINTS.QUOTE, property);
    return {
      success: true,
      quote: response.data,
    };
  } catch (error) {
    console.error('Error calculating quote:', error);
    
    if (error.response) {
      // Server responded with error
      return {
        success: false,
        errors: error.response.data.error?.details || [error.response.data.error?.message || 'Failed to calculate quote'],
      };
    }
    
    // Network or other error
    return {
      success: false,
      errors: ['Unable to connect to quote service. Please try again later.'],
    };
  }
}

/**
 * Check health of the API
 * @returns {Promise<Object>} Health status
 */
export async function checkHealth() {
  try {
    const response = await axios.get(API_ENDPOINTS.HEALTH);
    return response.data;
  } catch (error) {
    console.error('Health check failed:', error);
    return { status: 'error' };
  }
}
