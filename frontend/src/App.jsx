import React from 'react';
import { Container } from 'react-bootstrap';
import QuoteForm from './components/QuoteForm';

function App() {
  return (
    <Container className="py-4" style={{ maxWidth: '800px' }}>
      <h1 className="text-center mb-2">Instant Dwelling Quote</h1>
      <p className="text-center text-muted mb-4">
        Get an instant insurance quote for your dwelling property
      </p>
      <QuoteForm />
      <footer className="text-center text-muted mt-5 small">
        <p>Quotes are estimates only. Final rates may vary.</p>
      </footer>
    </Container>
  );
}

export default App;
