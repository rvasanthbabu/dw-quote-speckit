import React from 'react';
import { Card, Alert } from 'react-bootstrap';
import { formatCurrency } from '../utils/formatters';

function QuoteResult({ quote }) {
  if (!quote) return null;

  // Display contact message for high-value quotes
  if (quote.isHighValue && quote.status === 'contact_required') {
    return (
      <Card className="mt-4" data-testid="contact-message">
        <Card.Body>
          <Alert variant="info">
            <Alert.Heading>Contact Us for a Custom Quote</Alert.Heading>
            <p>{quote.contactInfo?.message || 'This property requires personalized assessment.'}</p>
            <hr />
            <p className="mb-0">
              <strong>Phone:</strong> {quote.contactInfo?.phone || '1-800-555-0100'}
              <br />
              <strong>Email:</strong>{' '}
              <a href={`mailto:${quote.contactInfo?.email || 'quotes@dwellinginsurance.com'}`}>
                {quote.contactInfo?.email || 'quotes@dwellinginsurance.com'}
              </a>
            </p>
          </Alert>
        </Card.Body>
      </Card>
    );
  }

  // Display standard quote with amount
  return (
    <Card className="mt-4" data-testid="quote-result">
      <Card.Body>
        <Card.Title>Your Estimated Quote</Card.Title>
        <div className="my-3">
          <h2 className="text-primary" data-testid="quote-amount">
            {formatCurrency(quote.amount)}/year
          </h2>
        </div>
        <Card.Text className="text-muted">
          <small>
            Based on {quote.property.squareFeet} sq ft property with{' '}
            {formatCurrency(quote.property.coverage)} coverage in{' '}
            {quote.property.address.city}, {quote.property.address.state}
          </small>
        </Card.Text>
        {quote.breakdown && (
          <details className="mt-3">
            <summary className="text-muted" style={{ cursor: 'pointer' }}>
              View calculation breakdown
            </summary>
            <div className="mt-2 small">
              <p>Base Rate: ${quote.breakdown.baseRate}/sq ft</p>
              <p>Coverage Multiplier: {quote.breakdown.coverageMultiplier}x</p>
              <p>Risk Multiplier: {quote.breakdown.riskMultiplier}x</p>
              <p>Subtotal: {formatCurrency(quote.breakdown.subtotal)}</p>
              <p><strong>Total: {formatCurrency(quote.breakdown.total)}/year</strong></p>
            </div>
          </details>
        )}
      </Card.Body>
    </Card>
  );
}

export default QuoteResult;
