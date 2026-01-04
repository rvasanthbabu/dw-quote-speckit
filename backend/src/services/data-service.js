import { readFile } from 'fs/promises';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

let locationRiskFactors = null;
let quoteRules = null;

/**
 * Load location risk factors from JSON file
 * @returns {Promise<Object>} Location risk factors data
 */
export async function loadLocationRiskFactors() {
  if (!locationRiskFactors) {
    const dataPath = join(__dirname, '../data/location-risk-factors.json');
    const data = await readFile(dataPath, 'utf-8');
    locationRiskFactors = JSON.parse(data);
  }
  return locationRiskFactors;
}

/**
 * Load quote rules from JSON file
 * @returns {Promise<Object>} Quote rules data
 */
export async function loadQuoteRules() {
  if (!quoteRules) {
    const dataPath = join(__dirname, '../data/quote-rules.json');
    const data = await readFile(dataPath, 'utf-8');
    quoteRules = JSON.parse(data);
  }
  return quoteRules;
}

/**
 * Get risk factor for a specific zip code
 * @param {string} zipCode - Five-digit zip code
 * @returns {Promise<Object>} Risk factor with multiplier
 */
export async function getRiskFactor(zipCode) {
  const data = await loadLocationRiskFactors();
  return data.zipCodeRiskFactors[zipCode] || data.defaultRisk;
}
