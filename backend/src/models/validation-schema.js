/**
 * Validation schema for property input
 * Shared between client and server
 */

export const propertyValidationRules = {
  address: {
    street: {
      required: true,
      minLength: 5,
      errorMessage: 'Street address is required (min 5 characters)',
    },
    city: {
      required: true,
      minLength: 2,
      errorMessage: 'City is required (min 2 characters)',
    },
    state: {
      required: true,
      pattern: /^[A-Z]{2}$/,
      errorMessage: 'State must be 2-letter code (e.g., TX)',
    },
    zipCode: {
      required: true,
      pattern: /^\d{5}$/,
      errorMessage: 'Zip code must be 5 digits',
    },
  },
  squareFeet: {
    required: true,
    type: 'integer',
    min: 100,
    max: 50000,
    errorMessage: 'Property size must be between 100 and 50,000 sq ft',
  },
  coverage: {
    required: true,
    type: 'number',
    min: 50000,
    max: 2000000,
    errorMessage: 'Coverage amount must be between $50,000 and $2,000,000',
  },
};

/**
 * Validate property object
 * @param {Object} property - Property to validate
 * @returns {Object} { valid: boolean, errors: Array }
 */
export function validateProperty(property) {
  const errors = [];

  if (!property) {
    return { valid: false, errors: ['Property object is required'] };
  }

  // Validate address
  if (!property.address) {
    errors.push('Address is required');
  } else {
    const { address } = property;
    const { street, city, state, zipCode } = propertyValidationRules.address;

    if (!address.street || address.street.length < street.minLength) {
      errors.push(street.errorMessage);
    }
    if (!address.city || address.city.length < city.minLength) {
      errors.push(city.errorMessage);
    }
    if (!address.state || !state.pattern.test(address.state)) {
      errors.push(state.errorMessage);
    }
    if (!address.zipCode || !zipCode.pattern.test(address.zipCode)) {
      errors.push(zipCode.errorMessage);
    }
  }

  // Validate squareFeet
  const { squareFeet: sqFtRule } = propertyValidationRules;
  if (typeof property.squareFeet !== 'number' || !Number.isInteger(property.squareFeet)) {
    errors.push(sqFtRule.errorMessage);
  } else if (property.squareFeet < sqFtRule.min || property.squareFeet > sqFtRule.max) {
    errors.push(sqFtRule.errorMessage);
  }

  // Validate coverage
  const { coverage: coverageRule } = propertyValidationRules;
  if (typeof property.coverage !== 'number') {
    errors.push(coverageRule.errorMessage);
  } else if (property.coverage < coverageRule.min || property.coverage > coverageRule.max) {
    errors.push(coverageRule.errorMessage);
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}
