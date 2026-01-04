import React from 'react';
import { Form, InputGroup } from 'react-bootstrap';
import { formatCurrency } from '../utils/formatters';

function CoverageAmountInput({ value, onChange, error }) {
  return (
    <Form.Group className="mb-3">
      <Form.Label htmlFor="coverage">Coverage Amount *</Form.Label>
      <InputGroup>
        <InputGroup.Text>$</InputGroup.Text>
        <Form.Control
          type="number"
          id="coverage"
          name="coverage"
          value={value || ''}
          onChange={onChange}
          isInvalid={!!error}
          required
          min={50000}
          max={2000000}
          step={1000}
          placeholder="300000"
        />
        {error && (
          <Form.Control.Feedback type="invalid" data-testid="coverage-error">
            {error}
          </Form.Control.Feedback>
        )}
      </InputGroup>
      <Form.Text className="text-muted">
        Between $50,000 and $2,000,000
      </Form.Text>
    </Form.Group>
  );
}

export default CoverageAmountInput;
