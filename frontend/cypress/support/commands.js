import '@cypress/code-coverage/support';

// Custom commands for reusable test actions

/**
 * Fill in the quote form with property details
 */
Cypress.Commands.add('fillQuoteForm', (property) => {
  cy.get('input[name="street"]').clear().type(property.address.street);
  cy.get('input[name="city"]').clear().type(property.address.city);
  cy.get('input[name="state"]').clear().type(property.address.state);
  cy.get('input[name="zipCode"]').clear().type(property.address.zipCode);
  cy.get('input[name="squareFeet"]').clear().type(property.squareFeet.toString());
  cy.get('input[name="coverage"]').clear().type(property.coverage.toString());
});

/**
 * Submit the quote form
 */
Cypress.Commands.add('submitQuoteForm', () => {
  cy.get('button[type="submit"]').contains(/get quote/i).click();
});

/**
 * Verify quote result is displayed
 */
Cypress.Commands.add('verifyQuoteDisplayed', () => {
  cy.get('[data-testid="quote-result"]').should('be.visible');
});

/**
 * Verify contact message is displayed
 */
Cypress.Commands.add('verifyContactMessageDisplayed', () => {
  cy.get('[data-testid="contact-message"]').should('be.visible');
  cy.contains(/contact us/i).should('be.visible');
});

/**
 * Click the Start Over button
 */
Cypress.Commands.add('clickStartOver', () => {
  cy.get('button').contains(/start over/i).click();
});

/**
 * Verify form validation error for a specific field
 */
Cypress.Commands.add('verifyValidationError', (fieldName, errorMessage) => {
  cy.get(`[data-testid="${fieldName}-error"]`).should('be.visible').and('contain', errorMessage);
});
