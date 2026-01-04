/**
 * Application constants
 */

export const LIMITS = {
  MIN_PROPERTY_SIZE: 100,
  MAX_PROPERTY_SIZE: 50000,
  MIN_COVERAGE: 50000,
  MAX_COVERAGE: 2000000,
};

export const HIGH_VALUE_THRESHOLD = 5000;

export const VALIDATION_PATTERNS = {
  STATE: /^[A-Z]{2}$/,
  ZIP_CODE: /^\d{5}$/,
};

export const ERROR_MESSAGES = {
  STREET_REQUIRED: 'Street address is required (min 5 characters)',
  CITY_REQUIRED: 'City is required (min 2 characters)',
  STATE_INVALID: 'State must be 2-letter code (e.g., TX)',
  ZIP_CODE_INVALID: 'Zip code must be 5 digits',
  PROPERTY_SIZE_INVALID: 'Property size must be between 100 and 50,000 sq ft',
  COVERAGE_INVALID: 'Coverage amount must be between $50,000 and $2,000,000',
};

export const API_ENDPOINTS = {
  QUOTE: '/api/quote',
  HEALTH: '/health',
};
