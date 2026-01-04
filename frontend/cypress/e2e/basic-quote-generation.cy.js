/// <reference types="cypress" />

describe('User Story 1: Basic Quote Generation', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('displays quote form on page load', () => {
    // Verify all required form fields are visible
    cy.get('input[name="street"]').should('be.visible');
    cy.get('input[name="city"]').should('be.visible');
    cy.get('input[name="state"]').should('be.visible');
    cy.get('input[name="zipCode"]').should('be.visible');
    cy.get('input[name="squareFeet"]').should('be.visible');
    cy.get('input[name="coverage"]').should('be.visible');
    cy.get('button[type="submit"]').should('be.visible');
  });

  it('calculates and displays standard quote for valid property', () => {
    // Test case: 2000 sqft, $300k coverage, Austin TX (78701)
    // Expected: ~$1,000/year (2000 * 0.5 * 1.0 * 1.0)
    cy.fixture('valid-properties').then((properties) => {
      const standardProperty = properties[0]; // Austin property
      cy.fillQuoteForm(standardProperty);
      cy.submitQuoteForm();
      cy.verifyQuoteDisplayed();
      cy.get('[data-testid="quote-amount"]').should('be.visible').and('contain', '$');
    });
  });

  it('quote displays within 2 seconds of submission', () => {
    cy.fixture('valid-properties').then((properties) => {
      const property = properties[0];
      cy.fillQuoteForm(property);
      
      const startTime = Date.now();
      cy.submitQuoteForm();
      
      cy.verifyQuoteDisplayed().then(() => {
        const elapsed = Date.now() - startTime;
        expect(elapsed).to.be.lessThan(2000);
      });
    });
  });

  it('quote appears below form without page reload', () => {
    cy.fixture('valid-properties').then((properties) => {
      const property = properties[0];
      cy.fillQuoteForm(property);
      cy.submitQuoteForm();
      
      // Verify quote result appears
      cy.verifyQuoteDisplayed();
      
      // Verify form is still visible (not replaced)
      cy.get('input[name="street"]').should('be.visible');
      
      // Verify URL hasn't changed (no page reload)
      cy.url().should('eq', Cypress.config().baseUrl + '/');
    });
  });

  it('quote formats currency correctly with dollar sign and commas', () => {
    cy.fixture('valid-properties').then((properties) => {
      const property = properties[0];
      cy.fillQuoteForm(property);
      cy.submitQuoteForm();
      
      // Verify currency format: $X,XXX.XX/year
      cy.get('[data-testid="quote-amount"]')
        .should('be.visible')
        .invoke('text')
        .should('match', /\$[\d,]+\.\d{2}/);
    });
  });

  it('clears previous quote when input field changes', () => {
    cy.fixture('valid-properties').then((properties) => {
      const property = properties[0];
      
      // Submit first quote
      cy.fillQuoteForm(property);
      cy.submitQuoteForm();
      cy.verifyQuoteDisplayed();
      
      // Change an input field
      cy.get('input[name="squareFeet"]').clear().type('3000');
      
      // Verify previous quote is cleared
      cy.get('[data-testid="quote-result"]').should('not.exist');
    });
  });

  it('Start Over button resets form and quote', () => {
    cy.fixture('valid-properties').then((properties) => {
      const property = properties[0];
      
      // Fill form and submit
      cy.fillQuoteForm(property);
      cy.submitQuoteForm();
      cy.verifyQuoteDisplayed();
      
      // Click Start Over
      cy.clickStartOver();
      
      // Verify form is cleared
      cy.get('input[name="street"]').should('have.value', '');
      cy.get('input[name="city"]').should('have.value', '');
      cy.get('input[name="state"]').should('have.value', '');
      cy.get('input[name="zipCode"]').should('have.value', '');
      cy.get('input[name="squareFeet"]').should('have.value', '');
      cy.get('input[name="coverage"]').should('have.value', '');
      
      // Verify quote is cleared
      cy.get('[data-testid="quote-result"]').should('not.exist');
    });
  });
});
