import express from 'express';
import { body, validationResult } from 'express-validator';
import { getQuote } from '../services/quote-service.js';

const router = express.Router();

/**
 * POST /api/quote
 * Calculate insurance quote for a property
 */
router.post(
  '/quote',
  [
    // Validation rules using express-validator
    body('address.street').notEmpty().isLength({ min: 5 }).withMessage('Street address is required (min 5 characters)'),
    body('address.city').notEmpty().isLength({ min: 2 }).withMessage('City is required (min 2 characters)'),
    body('address.state').matches(/^[A-Z]{2}$/).withMessage('State must be 2-letter code (e.g., TX)'),
    body('address.zipCode').matches(/^\d{5}$/).withMessage('Zip code must be 5 digits'),
    body('squareFeet').isInt({ min: 100, max: 50000 }).withMessage('Property size must be between 100 and 50,000 sq ft'),
    body('coverage').isFloat({ min: 50000, max: 2000000 }).withMessage('Coverage amount must be between $50,000 and $2,000,000'),
  ],
  async (req, res) => {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: {
          message: 'Validation failed',
          details: errors.array().map((err) => err.msg),
        },
      });
    }

    try {
      const property = req.body;
      const result = await getQuote(property);

      if (!result.success) {
        return res.status(422).json({
          error: {
            message: 'Unable to process quote',
            details: result.errors,
          },
        });
      }

      return res.status(200).json(result.quote);
    } catch (error) {
      console.error('Quote route error:', error);
      return res.status(500).json({
        error: {
          message: 'Internal server error',
          status: 500,
        },
      });
    }
  },
);

export default router;
