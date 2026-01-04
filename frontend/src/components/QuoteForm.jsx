import React, { useState } from 'react';
import { Form, Button, Card, Row, Col, Alert } from 'react-bootstrap';
import PropertyAddressInput from './PropertyAddressInput';
import PropertySizeInput from './PropertySizeInput';
import CoverageAmountInput from './CoverageAmountInput';
import LoadingSpinner from './LoadingSpinner';
import QuoteResult from './QuoteResult';
import { calculateQuote } from '../services/quote-api';

function QuoteForm() {
  const [formData, setFormData] = useState({
    street: '',
    city: '',
    state: '',
    zipCode: '',
    squareFeet: '',
    coverage: '',
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [quote, setQuote] = useState(null);
  const [apiError, setApiError] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    // Clear quote when any input changes
    if (quote) {
      setQuote(null);
    }
    
    // Clear error for this field
    if (errors[name]) {
      setErrors({ ...errors, [name]: null });
    }
    
    // Update form data
    setFormData({
      ...formData,
      [name]: name === 'state' ? value.toUpperCase() : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Clear previous errors and results
    setErrors({});
    setApiError(null);
    setQuote(null);
    setLoading(true);

    try {
      // Build property object
      const property = {
        address: {
          street: formData.street,
          city: formData.city,
          state: formData.state,
          zipCode: formData.zipCode,
        },
        squareFeet: parseInt(formData.squareFeet, 10),
        coverage: parseFloat(formData.coverage),
      };

      // Call API
      const result = await calculateQuote(property);

      if (result.success) {
        setQuote(result.quote);
      } else {
        setApiError(result.errors.join(', '));
      }
    } catch (error) {
      console.error('Form submission error:', error);
      setApiError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleStartOver = () => {
    setFormData({
      street: '',
      city: '',
      state: '',
      zipCode: '',
      squareFeet: '',
      coverage: '',
    });
    setErrors({});
    setQuote(null);
    setApiError(null);
  };

  return (
    <div>
      <Card>
        <Card.Body>
          <Card.Title className="h4 mb-4">Get Your Quote</Card.Title>
          
          {apiError && (
            <Alert variant="danger" dismissible onClose={() => setApiError(null)}>
              {apiError}
            </Alert>
          )}

          <Form onSubmit={handleSubmit}>
            <fieldset disabled={loading}>
              <h5 className="mb-3">Property Address</h5>
              <PropertyAddressInput
                values={{
                  street: formData.street,
                  city: formData.city,
                  state: formData.state,
                  zipCode: formData.zipCode,
                }}
                onChange={handleInputChange}
                errors={errors}
              />

              <hr className="my-4" />

              <h5 className="mb-3">Property Details</h5>
              <Row>
                <Col md={6}>
                  <PropertySizeInput
                    value={formData.squareFeet}
                    onChange={handleInputChange}
                    error={errors.squareFeet}
                  />
                </Col>
                <Col md={6}>
                  <CoverageAmountInput
                    value={formData.coverage}
                    onChange={handleInputChange}
                    error={errors.coverage}
                  />
                </Col>
              </Row>

              <div className="d-grid gap-2 d-md-flex justify-content-md-end mt-4">
                {quote && (
                  <Button
                    variant="outline-secondary"
                    onClick={handleStartOver}
                    className="px-4"
                  >
                    Start Over
                  </Button>
                )}
                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  className="px-5"
                  disabled={loading}
                >
                  {loading ? 'Calculating...' : 'Get Quote'}
                </Button>
              </div>
            </fieldset>
          </Form>
        </Card.Body>
      </Card>

      {loading && <LoadingSpinner />}
      {quote && <QuoteResult quote={quote} />}
    </div>
  );
}

export default QuoteForm;
