# Quickstart Guide: Instant Dwelling Quote Site

**Feature**: Instant Dwelling Quote Site  
**Branch**: 001-instant-quote-site  
**Date**: 2026-01-01

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js**: 18.x LTS or higher ([Download](https://nodejs.org/))
- **npm**: 9.x or higher (included with Node.js)
- **Git**: For cloning the repository
- **Modern web browser**: Chrome, Firefox, Safari, or Edge (last 2 versions)

## Quick Start (5 minutes)

```bash
# 1. Clone the repository and checkout feature branch
git clone <repository-url>
cd dw-quote
git checkout 001-instant-quote-site

# 2. Install dependencies for both frontend and backend
cd backend && npm install && cd ../frontend && npm install && cd ..

# 3. Start the development servers
npm run dev

# 4. Open your browser
# Frontend: http://localhost:5173
# Backend API: http://localhost:3000
```

The application should now be running with hot module reload enabled.

---

## Project Structure Overview

```
dw-quote/
├── backend/               # Node.js/Express server
│   ├── src/
│   │   ├── models/       # Quote calculation business logic
│   │   ├── services/     # Data and quote services
│   │   ├── routes/       # Express route handlers
│   │   ├── middleware/   # Validation and error handling
│   │   └── data/         # JSON data files (quote rules, risk factors)
│   └── tests/            # Jest unit and integration tests
├── frontend/             # React application
│   ├── src/
│   │   ├── components/   # React components
│   │   ├── services/     # API client and validation
│   │   └── utils/        # Formatters and constants
│   └── cypress/          # E2E tests
└── specs/                # Feature specifications and planning docs
```

---

## Development Setup (Detailed)

### 1. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Expected dependencies:
# - express: Web server framework
# - express-validator: Input validation middleware
# - helmet: Security headers middleware
# - compression: Gzip compression middleware
# - cors: CORS middleware
# - jest: Testing framework

# Create data files (if not exists)
mkdir -p src/data
cp examples/location-risk-factors.json src/data/
cp examples/quote-rules.json src/data/

# Run tests
npm test

# Run tests with coverage
npm run test:coverage

# Start development server (with nodemon for auto-restart)
npm run dev

# Server runs on http://localhost:3000
```

### 2. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Expected dependencies:
# - react: UI library
# - react-dom: React DOM rendering
# - react-bootstrap: Bootstrap React components
# - bootstrap: CSS framework
# - vite: Build tool
# - cypress: E2E testing
# - @cypress/code-coverage: Coverage plugin

# Start development server (with HMR)
npm run dev

# Application runs on http://localhost:5173
# Vite will auto-open browser
```

### 3. Environment Configuration

Create environment files for local development:

**backend/.env**:

```bash
NODE_ENV=development
PORT=3000
FRONTEND_URL=http://localhost:5173
```

**frontend/.env**:

```bash
VITE_API_URL=http://localhost:3000/api
```

---

## Running Tests

### Backend Unit Tests (Jest)

```bash
cd backend

# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage report
npm run test:coverage

# Coverage report location: backend/coverage/
# Open backend/coverage/lcov-report/index.html in browser
```

### Frontend E2E Tests (Cypress)

```bash
cd frontend

# Open Cypress interactive test runner
npm run cypress:open

# Run Cypress tests in headless mode
npm run cypress:run

# Run Cypress with code coverage
npm run cypress:coverage

# Coverage report location: frontend/coverage/
# Open frontend/coverage/lcov-report/index.html in browser
```

### Run All Tests

```bash
# From project root
npm run test:all

# This runs:
# 1. Backend unit tests with coverage
# 2. Frontend Cypress E2E tests with coverage
# 3. Generates combined coverage report
```

---

## Key npm Scripts

### Backend Scripts

| Command                 | Description                           |
| ----------------------- | ------------------------------------- |
| `npm run dev`           | Start development server with nodemon |
| `npm start`             | Start production server               |
| `npm test`              | Run Jest unit tests                   |
| `npm run test:watch`    | Run tests in watch mode               |
| `npm run test:coverage` | Run tests with coverage report        |
| `npm run lint`          | Run ESLint                            |
| `npm run lint:fix`      | Run ESLint with auto-fix              |

### Frontend Scripts

| Command                    | Description                      |
| -------------------------- | -------------------------------- |
| `npm run dev`              | Start Vite dev server with HMR   |
| `npm run build`            | Build production bundle          |
| `npm run preview`          | Preview production build locally |
| `npm run cypress:open`     | Open Cypress interactive runner  |
| `npm run cypress:run`      | Run Cypress tests headless       |
| `npm run cypress:coverage` | Run Cypress with code coverage   |
| `npm run lint`             | Run ESLint                       |
| `npm run lint:fix`         | Run ESLint with auto-fix         |

---

## Testing User Stories

### User Story 1: Basic Quote Generation

```bash
# Start application
npm run dev

# Manual test:
# 1. Open http://localhost:5173
# 2. Enter property details:
#    - Address: 123 Main St, Austin, TX, 78701
#    - Square feet: 2000
#    - Coverage: $300,000
# 3. Click "Get Quote"
# 4. Verify quote displays (e.g., "$1,200/year")

# Automated test:
cd frontend
npm run cypress:open
# Select: basic-quote-generation.cy.js
```

### User Story 2: High-Value Quote Handling

```bash
# Manual test:
# 1. Enter property details:
#    - Address: 456 Estate Dr, Beverly Hills, CA, 90210
#    - Square feet: 10,000
#    - Coverage: $2,000,000
# 2. Click "Get Quote"
# 3. Verify "Contact Us" message displays

# Automated test:
cd frontend
npm run cypress:open
# Select: high-value-handling.cy.js
```

### User Story 3: Form Validation

```bash
# Manual test:
# 1. Enter invalid square feet (e.g., -100)
# 2. Tab out of field
# 3. Verify inline error message appears
# 4. Try to submit form
# 5. Verify submission blocked and all errors highlighted

# Automated test:
cd frontend
npm run cypress:open
# Select: form-validation.cy.js
```

---

## Development Workflow

### Making Changes

1. **Create feature branch** (if not already on 001-instant-quote-site):

   ```bash
   git checkout -b 001-instant-quote-site
   ```

2. **Make changes** in either backend or frontend

3. **Run tests** to ensure changes don't break existing functionality:

   ```bash
   # Backend
   cd backend && npm test

   # Frontend
   cd frontend && npm run cypress:run
   ```

4. **Check code quality**:

   ```bash
   npm run lint
   ```

5. **Commit changes**:
   ```bash
   git add .
   git commit -m "feat: add property size validation"
   ```

### Code Quality Checks

The project uses ESLint for code quality:

```bash
# Check for linting errors
npm run lint

# Auto-fix linting errors
npm run lint:fix
```

**ESLint Configuration**:

- Airbnb JavaScript Style Guide
- React plugins for JSX
- TypeScript support (if using .ts files)
- Accessibility rules (jsx-a11y)

---

## Configuration Files

### backend/package.json

Key scripts and dependencies are defined here.

### frontend/vite.config.js

Vite build configuration:

- React plugin for JSX support
- Istanbul plugin for code coverage
- Build output to `frontend/dist`
- Proxy API requests to backend during development

### frontend/cypress.config.js

Cypress E2E testing configuration:

- Test file patterns
- Base URL: http://localhost:5173
- Viewport sizes for mobile testing (375x667)
- Code coverage plugin integration
- Screenshot and video settings

### .eslintrc.json

ESLint configuration for code quality:

- Extends Airbnb config
- React and JSX rules
- Accessibility rules

---

## Data Files

### backend/src/data/location-risk-factors.json

Maps zip codes to risk factors. Example:

```json
{
  "zipCodeRiskFactors": {
    "78701": { "risk": "low", "multiplier": 1.0 },
    "90210": { "risk": "high", "multiplier": 1.5 }
  },
  "defaultRisk": { "risk": "medium", "multiplier": 1.2 }
}
```

**To add new zip codes**: Edit this file and restart backend server.

### backend/src/data/quote-rules.json

Quote calculation configuration. Example:

```json
{
  "baseRatePerSqFt": 0.5,
  "coverageMultipliers": {
    "50000-100000": 0.8,
    "100001-500000": 1.0,
    "500001-1000000": 1.2,
    "1000001-2000000": 1.5
  },
  "highValueThreshold": 5000
}
```

**To adjust pricing**: Edit this file and restart backend server.

---

## Production Build

### Build for Production

```bash
# Build frontend
cd frontend
npm run build
# Output: frontend/dist/

# Build will:
# - Minify JavaScript and CSS
# - Tree-shake unused code
# - Optimize images
# - Generate source maps

# Test production build locally
npm run preview
# Serves production build on http://localhost:4173
```

### Deploy Backend + Frontend

```bash
# Backend serves the built frontend
cd backend
npm start

# Server will:
# - Serve static files from frontend/dist
# - Provide /api/quote endpoint
# - Handle SPA fallback routing
# - Run on port 3000 (or PORT env variable)
```

---

## Performance Verification

### Lighthouse CI

```bash
# Install Lighthouse CI
npm install -g @lhci/cli

# Run Lighthouse audit
cd frontend
npm run build
npm run preview

# In separate terminal
lhci autorun --collect.url=http://localhost:4173

# Check results:
# - Performance score > 90
# - LCP < 2.5s
# - TTI < 3.5s
# - Accessibility score 100
```

### Bundle Size Analysis

```bash
cd frontend
npm run build

# Check build output for bundle sizes
# Main bundle should be < 200KB gzipped
```

---

## Troubleshooting

### Port Already in Use

If ports 3000 or 5173 are already in use:

```bash
# Backend (change in backend/.env)
PORT=3001

# Frontend (Vite will auto-increment to 5174 if 5173 is busy)
# Or specify in package.json:
"dev": "vite --port 5174"
```

### Module Not Found Errors

```bash
# Clear node_modules and reinstall
cd backend && rm -rf node_modules package-lock.json && npm install
cd frontend && rm -rf node_modules package-lock.json && npm install
```

### Cypress Tests Failing

```bash
# Ensure dev server is running
npm run dev

# Clear Cypress cache
npx cypress cache clear
npx cypress install

# Run tests with browser visible for debugging
npm run cypress:open
```

### Coverage Not Generated

```bash
# Ensure Istanbul plugin is installed
cd frontend
npm install --save-dev vite-plugin-istanbul @cypress/code-coverage

# Check vite.config.js includes istanbul plugin
# Check cypress/support/e2e.js imports '@cypress/code-coverage/support'
```

---

## Next Steps

After quickstart:

1. Review [spec.md](./spec.md) for full feature requirements
2. Review [data-model.md](./data-model.md) for entity definitions
3. Review [contracts/quote-api.yaml](./contracts/quote-api.yaml) for API specification
4. Run `/speckit.tasks` to generate implementation task list
5. Begin implementation following Constitution principles

---

## Additional Resources

- **React Documentation**: https://react.dev/
- **Bootstrap Documentation**: https://getbootstrap.com/docs/5.0/
- **Express Documentation**: https://expressjs.com/
- **Cypress Documentation**: https://docs.cypress.io/
- **Vite Documentation**: https://vitejs.dev/
- **Project Constitution**: [.specify/memory/constitution.md](../../../.specify/memory/constitution.md)

---

## Getting Help

- Check [plan.md](./plan.md) for technical decisions
- Check [research.md](./research.md) for technology rationale
- Review Constitution for development principles
- Run tests to verify implementation matches specifications
