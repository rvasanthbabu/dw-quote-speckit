import { calculateQuote } from '../../src/models/quote-calculation.js';

describe('Quote Calculation Module', () => {
  const mockRiskFactor = {
    risk: 'low',
    multiplier: 1.0,
    description: 'Low risk area',
  };

  const mockQuoteRules = {
    baseRatePerSqFt: 0.5,
    coverageMultipliers: {
      '50000-100000': 0.8,
      '100001-500000': 1.0,
      '500001-1000000': 1.2,
      '1000001-2000000': 1.5,
    },
    highValueThreshold: 5000,
  };

  describe('Standard Quote Calculation', () => {
    it('calculates quote correctly for standard property', () => {
      const property = {
        address: {
          street: '123 Main St',
          city: 'Austin',
          state: 'TX',
          zipCode: '78701',
        },
        squareFeet: 2000,
        coverage: 300000,
      };

      const quote = calculateQuote(property, mockRiskFactor, mockQuoteRules);

      // Expected: 2000 * 0.5 * 1.0 * 1.0 = $1,000
      expect(quote.amount).toBe(1000);
      expect(quote.isHighValue).toBe(false);
      expect(quote.status).toBe('standard');
      expect(quote.property).toEqual(property);
      expect(quote.breakdown.baseRate).toBe(0.5);
      expect(quote.breakdown.coverageMultiplier).toBe(1.0);
      expect(quote.breakdown.riskMultiplier).toBe(1.0);
    });

    it('applies coverage multiplier correctly for low coverage tier', () => {
      const property = {
        address: { street: '123 Main St', city: 'Austin', state: 'TX', zipCode: '78701' },
        squareFeet: 1000,
        coverage: 80000, // Falls in 50000-100000 tier (0.8x)
      };

      const quote = calculateQuote(property, mockRiskFactor, mockQuoteRules);

      // Expected: 1000 * 0.5 * 0.8 * 1.0 = $400
      expect(quote.amount).toBe(400);
      expect(quote.breakdown.coverageMultiplier).toBe(0.8);
    });

    it('applies coverage multiplier correctly for high coverage tier', () => {
      const property = {
        address: { street: '123 Main St', city: 'Austin', state: 'TX', zipCode: '78701' },
        squareFeet: 1000,
        coverage: 1500000, // Falls in 1000001-2000000 tier (1.5x)
      };

      const quote = calculateQuote(property, mockRiskFactor, mockQuoteRules);

      // Expected: 1000 * 0.5 * 1.5 * 1.0 = $750
      expect(quote.amount).toBe(750);
      expect(quote.breakdown.coverageMultiplier).toBe(1.5);
    });

    it('applies risk multiplier correctly for high-risk location', () => {
      const highRiskFactor = {
        risk: 'high',
        multiplier: 1.8,
        description: 'Hurricane-prone area',
      };

      const property = {
        address: { street: '321 Beach Blvd', city: 'Miami', state: 'FL', zipCode: '33139' },
        squareFeet: 2000,
        coverage: 300000,
      };

      const quote = calculateQuote(property, highRiskFactor, mockQuoteRules);

      // Expected: 2000 * 0.5 * 1.0 * 1.8 = $1,800
      expect(quote.amount).toBe(1800);
      expect(quote.breakdown.riskMultiplier).toBe(1.8);
    });
  });

  describe('High-Value Threshold', () => {
    it('identifies high-value quote when amount exceeds $5,000', () => {
      const property = {
        address: { street: '123 Main St', city: 'Austin', state: 'TX', zipCode: '78701' },
        squareFeet: 10000,
        coverage: 1500000,
      };

      const quote = calculateQuote(property, mockRiskFactor, mockQuoteRules);

      // Expected: 10000 * 0.5 * 1.5 * 1.0 = $7,500 (exceeds $5,000)
      expect(quote.amount).toBe(7500);
      expect(quote.isHighValue).toBe(true);
      expect(quote.status).toBe('contact_required');
    });

    it('does not flag as high-value when amount is exactly $5,000', () => {
      const property = {
        address: { street: '123 Main St', city: 'Austin', state: 'TX', zipCode: '78701' },
        squareFeet: 10000,
        coverage: 300000,
      };

      const quote = calculateQuote(property, mockRiskFactor, mockQuoteRules);

      // Expected: 10000 * 0.5 * 1.0 * 1.0 = $5,000 (at threshold)
      expect(quote.amount).toBe(5000);
      expect(quote.isHighValue).toBe(false);
      expect(quote.status).toBe('standard');
    });
  });

  describe('Decimal Precision', () => {
    it('rounds quote amount to 2 decimal places', () => {
      const property = {
        address: { street: '123 Main St', city: 'Austin', state: 'TX', zipCode: '78701' },
        squareFeet: 1337,
        coverage: 300000,
      };

      const quote = calculateQuote(property, mockRiskFactor, mockQuoteRules);

      // Expected: 1337 * 0.5 * 1.0 * 1.0 = $668.50
      expect(quote.amount).toBe(668.5);
      expect(quote.amount.toString()).toMatch(/^\d+(\.\d{1,2})?$/);
    });
  });

  describe('Quote Metadata', () => {
    it('includes timestamp in ISO 8601 format', () => {
      const property = {
        address: { street: '123 Main St', city: 'Austin', state: 'TX', zipCode: '78701' },
        squareFeet: 2000,
        coverage: 300000,
      };

      const quote = calculateQuote(property, mockRiskFactor, mockQuoteRules);

      expect(quote.timestamp).toBeDefined();
      expect(new Date(quote.timestamp).toISOString()).toBe(quote.timestamp);
    });

    it('includes complete breakdown of calculation', () => {
      const property = {
        address: { street: '123 Main St', city: 'Austin', state: 'TX', zipCode: '78701' },
        squareFeet: 2000,
        coverage: 300000,
      };

      const quote = calculateQuote(property, mockRiskFactor, mockQuoteRules);

      expect(quote.breakdown).toHaveProperty('baseRate');
      expect(quote.breakdown).toHaveProperty('riskMultiplier');
      expect(quote.breakdown).toHaveProperty('coverageMultiplier');
      expect(quote.breakdown).toHaveProperty('subtotal');
      expect(quote.breakdown).toHaveProperty('total');
      expect(quote.breakdown.total).toBe(quote.amount);
    });
  });
});
