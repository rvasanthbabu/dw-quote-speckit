import express from 'express';
import helmet from 'helmet';
import compression from 'compression';
import cors from 'cors';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import quoteRoutes from './routes/quote-routes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

// Security middleware
app.use(helmet({
  contentSecurityPolicy: false, // Allow inline scripts for development
}));

// Compression middleware
app.use(compression());

// CORS middleware
app.use(cors());

// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Serve static frontend files
const frontendDist = join(__dirname, '../../frontend/dist');
app.use(express.static(frontendDist));

// API routes
app.use('/api', quoteRoutes);

// Error handling middleware (add last)
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    error: {
      message: err.message || 'Internal server error',
      status: err.status || 500,
    },
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: {
      message: 'Not found',
      status: 404,
    },
  });
});

export default app;
