import React from 'react';
import { Form } from 'react-bootstrap';

function PropertyAddressInput({ values, onChange, errors }) {
  return (
    <>
      <Form.Group className="mb-3">
        <Form.Label htmlFor="street">Street Address *</Form.Label>
        <Form.Control
          type="text"
          id="street"
          name="street"
          value={values.street || ''}
          onChange={onChange}
          isInvalid={!!errors.street}
          required
          minLength={5}
          placeholder="123 Main St"
        />
        {errors.street && (
          <Form.Control.Feedback type="invalid" data-testid="street-error">
            {errors.street}
          </Form.Control.Feedback>
        )}
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label htmlFor="city">City *</Form.Label>
        <Form.Control
          type="text"
          id="city"
          name="city"
          value={values.city || ''}
          onChange={onChange}
          isInvalid={!!errors.city}
          required
          minLength={2}
          placeholder="Austin"
        />
        {errors.city && (
          <Form.Control.Feedback type="invalid" data-testid="city-error">
            {errors.city}
          </Form.Control.Feedback>
        )}
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label htmlFor="state">State *</Form.Label>
        <Form.Control
          type="text"
          id="state"
          name="state"
          value={values.state || ''}
          onChange={onChange}
          isInvalid={!!errors.state}
          required
          pattern="[A-Z]{2}"
          maxLength={2}
          placeholder="TX"
          style={{ textTransform: 'uppercase' }}
        />
        <Form.Text className="text-muted">Two-letter state code (e.g., TX, CA)</Form.Text>
        {errors.state && (
          <Form.Control.Feedback type="invalid" data-testid="state-error">
            {errors.state}
          </Form.Control.Feedback>
        )}
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label htmlFor="zipCode">Zip Code *</Form.Label>
        <Form.Control
          type="text"
          id="zipCode"
          name="zipCode"
          value={values.zipCode || ''}
          onChange={onChange}
          isInvalid={!!errors.zipCode}
          required
          pattern="\d{5}"
          maxLength={5}
          placeholder="78701"
        />
        {errors.zipCode && (
          <Form.Control.Feedback type="invalid" data-testid="zipCode-error">
            {errors.zipCode}
          </Form.Control.Feedback>
        )}
      </Form.Group>
    </>
  );
}

export default PropertyAddressInput;
