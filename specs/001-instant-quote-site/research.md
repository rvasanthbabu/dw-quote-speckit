# Research: Instant Dwelling Quote Site

**Feature**: Instant Dwelling Quote Site  
**Branch**: 001-instant-quote-site  
**Date**: 2026-01-01

## Purpose

This document captures research findings and technology decisions for implementing the instant dwelling quote site. All unknowns from Technical Context have been resolved and best practices identified for the chosen technology stack.

---

## React 18 + Bootstrap 5 Integration

### Decision
Use React 18 with Bootstrap 5 via `react-bootstrap` wrapper library for component-based UI with mobile-first responsive design.

### Rationale
- **react-bootstrap** provides React components that wrap Bootstrap 5, avoiding direct DOM manipulation
- Bootstrap 5 removed jQuery dependency, making it lighter and React-compatible
- Mobile-first grid system aligns with Constitution Principle I
- Accessibility features (ARIA attributes) built into Bootstrap 5 components support WCAG 2.1 Level AA compliance
- Bundle size: Bootstrap 5 CSS (~25KB gzipped) + react-bootstrap (~50KB gzipped) fits within 200KB budget

### Alternatives Considered
- **Tailwind CSS**: More flexible but requires custom component building, increasing development time for MVP
- **Material-UI**: Heavier bundle size (~90KB gzipped base) and Material Design doesn't match insurance industry conventions
- **Plain Bootstrap + React**: Requires manual DOM refs and lifecycle management, increasing complexity

### Best Practices
- Use Bootstrap's utility classes for spacing and layout (mt-3, p-4, etc.)
- Customize Bootstrap variables in SCSS for brand colors and touch target sizes (44px minimum)
- Use react-bootstrap components (Form, Button, Alert) for consistency and accessibility
- Implement responsive breakpoints: mobile (default), tablet (≥576px), desktop (≥768px)

### References
- [React-Bootstrap Docs](https://react-bootstrap.github.io/)
- [Bootstrap 5 Mobile-First](https://getbootstrap.com/docs/5.0/layout/breakpoints/)

---

## Client-Side Quote Calculation with Node.js/Express Backend

### Decision
Implement quote calculation logic as a shared JavaScript module that runs both client-side (instant feedback) and server-side (fallback for no-JS).

### Rationale
- **Client-side calculation**: Meets "instant quote" requirement (0 network latency for calculation)
- **Server-side fallback**: Supports progressive enhancement (Constitution Principle V)
- **Shared module**: Single source of truth for business logic, easier testing and maintenance
- **JSON data files**: Risk factors and pricing rules loaded at server startup, cached in memory
- Express serves static React build and provides `/api/quote` endpoint for fallback

### Alternatives Considered
- **Server-side only**: Requires network round-trip for every quote, violates "instant" requirement
- **Client-side only**: Breaks progressive enhancement, no fallback for JavaScript-disabled browsers
- **Separate implementations**: Risk of logic divergence between client and server

### Best Practices
- Export quote calculation as pure function: `calculateQuote(property) => { amount, isHighValue }`
- Bundle calculation module with React app (Vite handles this)
- Include same module in Express backend using ES6 imports
- Validate inputs on both client and server (defense in depth)
- Load JSON data files once at server startup, cache in memory for performance
- Use atomic file reads (synchronous read during startup acceptable)

### Implementation Pattern
```javascript
// Shared module: quote-calculation.js
export function calculateQuote(property, riskFactors, quoteRules) {
  // Business logic here
  return { amount, isHighValue, breakdown };
}

// Client: import and use directly
// Server: import and wrap in Express route handler
```

---

## Cypress E2E Testing with 100% Code Coverage

### Decision
Use Cypress 13 for end-to-end testing with `@cypress/code-coverage` plugin to achieve 100% code coverage requirement.

### Rationale
- **Cypress**: Modern E2E testing with excellent React support and debugging experience
- **Code coverage plugin**: Instruments code via Istanbul/NYC to measure coverage during E2E tests
- **100% coverage goal**: Ensures all user flows, edge cases, and validation paths are tested
- Real browser testing validates mobile responsiveness and accessibility
- Fast execution compared to Selenium-based alternatives

### Alternatives Considered
- **Playwright**: Similar capabilities but Cypress has better React ecosystem integration
- **Jest + React Testing Library only**: Unit tests alone can't verify integrated user flows
- **Selenium**: Slower execution and more brittle tests

### Best Practices
- Organize tests by user story: `basic-quote-generation.cy.js`, `high-value-handling.cy.js`, `form-validation.cy.js`
- Use data-testid attributes for reliable selectors (not CSS classes that may change)
- Create custom Cypress commands for repeated actions (fillPropertyForm, submitQuote)
- Test mobile viewport (375px width) and desktop (1280px width)
- Use fixtures for test data (valid-properties.json, invalid-inputs.json)
- Run Cypress in CI with code coverage report generation
- Install `@cypress/code-coverage` plugin and configure Istanbul instrumentation in Vite

### Code Coverage Setup
```javascript
// vite.config.js
import istanbul from 'vite-plugin-istanbul';

export default {
  plugins: [
    react(),
    istanbul({
      include: 'src/**/*.{js,jsx}',
      exclude: ['node_modules', 'cypress'],
      requireEnv: false
    })
  ]
};

// cypress.config.js
import '@cypress/code-coverage/support';
```

### References
- [Cypress Code Coverage Guide](https://docs.cypress.io/guides/tooling/code-coverage)
- [100% Coverage Strategy](https://www.cypress.io/blog/2020/10/27/best-practices-for-code-coverage/)

---

## Express.js for Static File Serving and API

### Decision
Use Express 4 as lightweight server for serving React build and providing `/api/quote` fallback endpoint.

### Rationale
- **Simplicity**: Express is minimal and well-understood for serving static assets
- **Fast setup**: No framework overhead, just middleware and routes
- **Dual purpose**: Serves static files (React build) and API endpoint in single process
- **Deployment simplicity**: Single Node.js process, no separate frontend/backend deployments needed for MVP
- Constitution Principle V requires server-side fallback, Express provides this with minimal complexity

### Alternatives Considered
- **Next.js**: Overkill for single-page app, adds unnecessary complexity for MVP
- **Separate static file server (nginx)**: Requires additional deployment complexity
- **Serverless functions**: Adds latency, violates instant quote requirement

### Best Practices
- Use `express.static` to serve React build from `frontend/dist`
- Implement `/api/quote` POST endpoint with same calculation logic as client
- Use `express-validator` middleware for input sanitization
- Enable compression middleware for gzip responses
- Add security headers with `helmet` middleware
- Implement error handling middleware for consistent error responses
- Serve `index.html` for all non-API routes (SPA fallback)

### Server Structure
```javascript
// backend/src/app.js
import express from 'express';
import helmet from 'helmet';
import compression from 'compression';
import quoteRoutes from './routes/quote-routes.js';

const app = express();

app.use(helmet());
app.use(compression());
app.use(express.json());
app.use('/api', quoteRoutes);
app.use(express.static('frontend/dist'));
app.get('*', (req, res) => res.sendFile('frontend/dist/index.html'));

export default app;
```

---

## Jest for Unit Testing

### Decision
Use Jest 29 for unit testing business logic (quote calculation module, validation functions, utilities).

### Rationale
- **Fast execution**: Parallel test running for quick feedback
- **React ecosystem**: Excellent support for testing JavaScript/React code
- **Mocking capabilities**: Easy to mock JSON data files for isolated unit tests
- **Coverage reporting**: Built-in Istanbul coverage reports
- Complements Cypress (unit tests for logic, E2E tests for integration)

### Best Practices
- Focus unit tests on pure functions: quote calculation, validation, formatters
- Mock JSON data files in tests using Jest mocks
- Test edge cases: boundary values, invalid inputs, null/undefined handling
- Aim for 100% coverage of business logic modules
- Use descriptive test names: `test('calculates quote for 2000 sqft property in low-risk area')`
- Separate unit tests from integration tests (different directories)

---

## Vite for Frontend Build

### Decision
Use Vite 5 as build tool for React frontend.

### Rationale
- **Fast dev server**: Hot module replacement (HMR) for rapid development
- **Optimized builds**: Tree-shaking and code splitting out of the box
- **Small bundles**: Better than Create React App for bundle size optimization
- **ES modules**: Modern JavaScript features without Webpack complexity
- Easy Istanbul instrumentation for code coverage via plugins

### Alternatives Considered
- **Create React App**: Slower builds, larger bundles, eject required for customization
- **Webpack**: More complex configuration, slower than Vite
- **Parcel**: Less mature ecosystem for React

### Best Practices
- Configure build output to `frontend/dist` for Express to serve
- Enable gzip compression in production build
- Use Vite's built-in code splitting for optimal loading
- Configure environment variables for API endpoints
- Use `vite-plugin-istanbul` for code coverage instrumentation

---

## JSON Data Structure for Quote Rules

### Decision
Store location risk factors and quote calculation rules in JSON files: `location-risk-factors.json` and `quote-rules.json`.

### Rationale
- **Simplicity**: No database setup required for MVP (Constitution Principle IV)
- **Version control**: Changes to pricing rules tracked in Git
- **Performance**: Files loaded once at server startup, cached in memory
- **Easy updates**: Non-technical users can update risk factors by editing JSON
- **Future migration path**: Data structure designed to easily migrate to database later

### Data Structure

**location-risk-factors.json**:
```json
{
  "zipCodeRiskFactors": {
    "78701": { "risk": "low", "multiplier": 1.0 },
    "78702": { "risk": "medium", "multiplier": 1.2 },
    "90001": { "risk": "high", "multiplier": 1.5 }
  },
  "defaultRisk": { "risk": "medium", "multiplier": 1.2 }
}
```

**quote-rules.json**:
```json
{
  "baseRatePerSqFt": 0.50,
  "coverageMultipliers": {
    "50000-100000": 0.8,
    "100001-500000": 1.0,
    "500001-1000000": 1.2,
    "1000001-2000000": 1.5
  },
  "highValueThreshold": 5000,
  "minPropertySize": 100,
  "maxPropertySize": 50000,
  "minCoverage": 50000,
  "maxCoverage": 2000000
}
```

### Best Practices
- Load JSON files synchronously during server initialization (blocking is acceptable at startup)
- Cache parsed JSON in memory for fast access during quote calculation
- Validate JSON schema on load (use JSON Schema validator)
- Abstract file access behind data service layer for future database migration
- Document JSON structure in data-model.md

---

## Form Validation Strategy

### Decision
Implement validation on both client and server using shared validation schema, with HTML5 validation as baseline.

### Rationale
- **Progressive enhancement**: HTML5 validation works without JavaScript
- **Client-side validation**: Immediate feedback (Constitution Principle III: real-time validation)
- **Server-side validation**: Security requirement (defense in depth)
- **Shared schema**: Single source of truth reduces duplication and drift

### Implementation Layers

1. **HTML5 attributes**: `required`, `type="number"`, `min`, `max`, `pattern`
2. **Client-side JavaScript**: Custom validation on blur events, displays Bootstrap error styles
3. **Server-side Express**: `express-validator` middleware validates before processing

### Validation Rules
```javascript
// Shared validation schema
export const propertyValidation = {
  address: { required: true, minLength: 5 },
  city: { required: true, minLength: 2 },
  state: { required: true, length: 2 },
  zipCode: { required: true, pattern: /^\d{5}$/ },
  squareFeet: { required: true, min: 100, max: 50000, type: 'integer' },
  coverage: { required: true, min: 50000, max: 2000000, type: 'currency' }
};
```

### Best Practices
- Show validation errors inline next to fields (not just at top of form)
- Use Bootstrap's `is-invalid` and `invalid-feedback` classes
- Clear error when user starts typing in field
- Prevent form submission if client-side validation fails
- Display server-side errors if client-side validation bypassed
- Use ARIA attributes for screen reader accessibility (`aria-invalid`, `aria-describedby`)

---

## Summary of Resolved Unknowns

All technical context items have been clarified:

✅ **Language/Version**: JavaScript ES2020+, Node.js 18+ LTS  
✅ **Primary Dependencies**: React 18, Bootstrap 5 (via react-bootstrap), Express 4, Cypress 13, Jest 29, Vite 5  
✅ **Storage**: JSON files for quote rules and location risk factors  
✅ **Testing**: Cypress for E2E with 100% coverage target, Jest for unit tests  
✅ **Target Platform**: Modern web browsers + Node.js server  
✅ **Performance Goals**: Achieved via client-side calculation, Vite optimization, Bootstrap's mobile-first approach  
✅ **Constraints**: 200KB bundle met via selective dependencies, mobile-first via Bootstrap, accessibility via Bootstrap + ARIA  
✅ **Scale/Scope**: Single-page MVP, 3 user stories, read-only data (no database needed)

---

## Next Steps

Phase 0 research complete. Proceed to Phase 1:
1. Generate data-model.md with entity definitions and JSON schemas
2. Create contracts/quote-api.yaml with OpenAPI spec for API endpoint
3. Create quickstart.md with setup and development instructions
4. Update agent context with technology stack
5. Re-evaluate Constitution Check with design details