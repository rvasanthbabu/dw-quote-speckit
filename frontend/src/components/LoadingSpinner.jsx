import React from 'react';
import { Spinner } from 'react-bootstrap';

function LoadingSpinner() {
  return (
    <div className="text-center my-4">
      <Spinner animation="border" role="status" variant="primary">
        <span className="visually-hidden">Calculating quote...</span>
      </Spinner>
      <p className="mt-2 text-muted">Calculating your quote...</p>
    </div>
  );
}

export default LoadingSpinner;
