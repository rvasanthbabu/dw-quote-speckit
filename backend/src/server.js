import app from './app.js';
import { loadLocationRiskFactors, loadQuoteRules } from './services/data-service.js';

const PORT = process.env.PORT || 3000;

// Preload data files on server startup
async function startServer() {
  try {
    console.log('Loading data files...');
    await loadLocationRiskFactors();
    await loadQuoteRules();
    console.log('Data files loaded successfully');

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      console.log(`Health check: http://localhost:${PORT}/health`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();
