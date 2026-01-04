/**
 * Calculate insurance quote for a property
 * @param {Object} property - Property details
 * @param {Object} property.address - Property address
 * @param {string} property.address.zipCode - Five-digit zip code
 * @param {number} property.squareFeet - Property size in square feet
 * @param {number} property.coverage - Desired coverage amount
 * @param {Object} riskFactor - Location risk factor
 * @param {number} riskFactor.multiplier - Risk multiplier
 * @param {Object} quoteRules - Quote calculation rules
 * @returns {Object} Quote with amount, breakdown, and status
 */
export function calculateQuote(property, riskFactor, quoteRules) {
  const { squareFeet, coverage } = property;
  const { baseRatePerSqFt, coverageMultipliers, highValueThreshold } = quoteRules;

  // Step 1: Calculate base cost
  const baseCost = squareFeet * baseRatePerSqFt;

  // Step 2: Apply coverage multiplier
  const coverageMultiplier = getCoverageMultiplier(coverage, coverageMultipliers);
  const adjustedCost = baseCost * coverageMultiplier;

  // Step 3: Apply location risk multiplier
  const finalAmount = adjustedCost * riskFactor.multiplier;

  // Step 4: Determine status
  const isHighValue = finalAmount > highValueThreshold;
  const status = isHighValue ? 'contact_required' : 'standard';

  // Step 5: Return quote with breakdown
  return {
    property,
    amount: Math.round(finalAmount * 100) / 100, // Round to 2 decimal places
    isHighValue,
    breakdown: {
      baseRate: baseRatePerSqFt,
      riskMultiplier: riskFactor.multiplier,
      coverageMultiplier,
      subtotal: Math.round(adjustedCost * 100) / 100,
      total: Math.round(finalAmount * 100) / 100,
    },
    timestamp: new Date().toISOString(),
    status,
  };
}

/**
 * Get coverage multiplier based on coverage amount
 * @param {number} coverage - Coverage amount in dollars
 * @param {Object} multipliers - Coverage tier multipliers
 * @returns {number} Multiplier for the coverage tier
 */
function getCoverageMultiplier(coverage, multipliers) {
  const tiers = {
    '50000-100000': [50000, 100000],
    '100001-500000': [100001, 500000],
    '500001-1000000': [500001, 1000000],
    '1000001-2000000': [1000001, 2000000],
  };

  // Find matching tier
  for (const [tierKey, [min, max]] of Object.entries(tiers)) {
    if (coverage >= min && coverage <= max) {
      return multipliers[tierKey];
    }
  }

  // Default to middle tier if no match (should not happen with validation)
  return multipliers['100001-500000'] || 1.0;
}
