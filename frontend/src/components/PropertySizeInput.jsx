import React from 'react';
import { Form, InputGroup } from 'react-bootstrap';
import { formatNumber } from '../utils/formatters';

function PropertySizeInput({ value, onChange, error }) {
  return (
    <Form.Group className="mb-3">
      <Form.Label htmlFor="squareFeet">Property Size *</Form.Label>
      <InputGroup>
        <Form.Control
          type="number"
          id="squareFeet"
          name="squareFeet"
          value={value || ''}
          onChange={onChange}
          isInvalid={!!error}
          required
          min={100}
          max={50000}
          placeholder="2000"
        />
        <InputGroup.Text>sq ft</InputGroup.Text>
        {error && (
          <Form.Control.Feedback type="invalid" data-testid="squareFeet-error">
            {error}
          </Form.Control.Feedback>
        )}
      </InputGroup>
      <Form.Text className="text-muted">
        Between 100 and 50,000 square feet
      </Form.Text>
    </Form.Group>
  );
}

export default PropertySizeInput;
