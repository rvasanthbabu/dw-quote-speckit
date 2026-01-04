# Implementation Plan: Instant Dwelling Quote Site

**Branch**: `001-instant-quote-site` | **Date**: 2026-01-01 | **Spec**: [spec.md](spec.md)
**Input**: Feature specification from `/specs/001-instant-quote-site/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

Build a single-page web application for instant dwelling insurance quotes. Users enter property details (address, size, coverage amount) and receive a calculated quote within seconds. High-value quotes (>$5,000/year) trigger a "Contact Us" message. The application uses React.js frontend with Bootstrap, Node.js/Express backend serving the application, local JSON file for mock quote data, and Cypress for end-to-end testing with 100% code coverage requirement.

## Technical Context

**Language/Version**: JavaScript ES2020+ (Node.js 18+ LTS for backend, modern browsers for frontend)  
**Primary Dependencies**: React 18, Bootstrap 5, Express 4, Cypress 13  
**Storage**: JSON files with atomic write operations (quote rules, location risk factors)  
**Testing**: Cypress for E2E tests (100% code coverage target), Jest for unit tests  
**Target Platform**: Web browsers (Chrome, Firefox, Safari, Edge - last 2 versions), Node.js server environment
**Project Type**: Web application (frontend + backend separation)  
**Performance Goals**: LCP < 2.5s on 3G networks, TTI < 3.5s, quote calculation < 3s, form validation < 200ms  
**Constraints**: JS bundle < 200KB gzipped, mobile-first (≤428px viewport), WCAG 2.1 Level AA compliance  
**Scale/Scope**: Single-page application, 3 user stories, ~15 functional requirements, MVP for quote generation only

## Constitution Check

_GATE: Must pass before Phase 0 research. Re-check after Phase 1 design._

### I. Mobile-First Design (NON-NEGOTIABLE)

✅ **PASS** - Bootstrap 5 provides mobile-first responsive grid system out of the box. Touch targets will be ≥44x44px using Bootstrap button classes (btn-lg). Single-page form design optimized for mobile viewport (≤428px). CSS approach uses Bootstrap's mobile-first breakpoints (sm, md, lg, xl).

### II. Performance Budget (NON-NEGOTIABLE)

✅ **PASS** - React + Bootstrap bundle estimated at ~150KB gzipped (well under 200KB limit). Client-side quote calculation ensures instant response. Code splitting and lazy loading not required for single-page MVP. Express serves static assets with compression middleware. Cypress performance tests will verify LCP < 2.5s and TTI < 3.5s targets.

### III. Workflow-Driven User Experience

⚠️ **DEVIATION JUSTIFIED** - Specification explicitly requires single-page interface (FR-001), not multi-step workflow. Constitution principle III assumes multi-step workflows, but this MVP intentionally uses single-page form for simplicity. Form still provides real-time validation (on blur and submit) and clear error guidance per constitution requirements. Future iterations may add multi-step workflow if user testing shows need.

**Justification**: Single-page approach is explicit business requirement. Reduces friction for quick quotes. Still maintains validation quality and user guidance principles.

### IV. Data Simplicity

✅ **PASS** - Using JSON file storage for quote calculation rules and location risk factors as constitution requires. Quote calculation logic isolated in dedicated module with abstracted data access. No database required for MVP. Atomic file writes not required as data is read-only for MVP (no quote persistence).

### V. Progressive Enhancement & Graceful Degradation

✅ **PASS** - HTML form uses standard form submission as fallback (action="/api/quote" method="POST"). Server-side Express endpoint handles requests when JavaScript unavailable. Critical CSS inlined, Bootstrap loaded asynchronously. Error messages are human-readable and accessible.

### Additional Constitution Compliance

**Testing (Constitution: Test-Driven)**
✅ **PASS** - Cypress E2E tests with 100% code coverage requirement exceeds constitution's 80% business logic / 60% overall target. Jest unit tests for quote calculation module.

**Accessibility**
✅ **PASS** - Bootstrap 5 provides WCAG 2.1 Level AA compliant components. Form labels, ARIA attributes, and keyboard navigation built into Bootstrap. Cypress accessibility plugin will verify compliance.

**Security**
✅ **PASS** - Express input sanitization middleware (express-validator). No PII logging. HTTPS in production. Client and server-side validation.

**Code Quality**
✅ **PASS** - ESLint with Airbnb config enforces style. JSDoc comments for public APIs. Quote calculation module kept simple (cyclomatic complexity < 10).

### Gate Status: ✅ APPROVED TO PROCEED

All constitution principles pass or have justified deviations. Single deviation (single-page vs. multi-step workflow) is explicit business requirement and maintains spirit of constitution principles.

## Project Structure

### Documentation (this feature)

```text
specs/001-instant-quote-site/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
├── contracts/           # Phase 1 output (/speckit.plan command)
│   └── quote-api.yaml   # OpenAPI spec for quote endpoint
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)

```text
backend/
├── src/
│   ├── models/
│   │   └── quote-calculation.js      # Quote calculation business logic module
│   ├── services/
│   │   ├── quote-service.js          # Quote calculation orchestration
│   │   └── data-service.js           # JSON file data access abstraction
│   ├── routes/
│   │   └── quote-routes.js           # Express route handlers
│   ├── middleware/
│   │   ├── validation.js             # Input validation middleware
│   │   └── error-handler.js          # Error handling middleware
│   ├── data/
│   │   ├── location-risk-factors.json  # Zip code risk multipliers
│   │   └── quote-rules.json            # Base rates and thresholds
│   ├── app.js                        # Express app configuration
│   └── server.js                     # Server entry point
├── tests/
│   ├── unit/
│   │   ├── quote-calculation.test.js
│   │   └── quote-service.test.js
│   └── integration/
│       └── quote-routes.test.js
├── package.json
└── .eslintrc.json

frontend/
├── public/
│   ├── index.html                    # Entry HTML with SSR fallback
│   └── favicon.ico
├── src/
│   ├── components/
│   │   ├── QuoteForm.jsx            # Main form component
│   │   ├── PropertyAddressInput.jsx  # Address input fields
│   │   ├── PropertySizeInput.jsx     # Square footage input
│   │   ├── CoverageAmountInput.jsx   # Coverage amount input
│   │   ├── QuoteResult.jsx          # Quote display or contact message
│   │   ├── FormValidation.jsx       # Validation error display
│   │   └── LoadingSpinner.jsx       # Loading indicator
│   ├── services/
│   │   ├── quote-api.js             # API client for quote endpoint
│   │   └── validation.js            # Client-side validation logic
│   ├── utils/
│   │   ├── formatters.js            # Currency formatting utilities
│   │   └── constants.js             # Constants (thresholds, limits)
│   ├── App.jsx                      # Root component
│   ├── index.jsx                    # React entry point
│   └── styles/
│       └── custom.scss              # Bootstrap customizations
├── cypress/
│   ├── e2e/
│   │   ├── basic-quote-generation.cy.js    # US1 tests
│   │   ├── high-value-handling.cy.js       # US2 tests
│   │   ├── form-validation.cy.js           # US3 tests
│   │   └── edge-cases.cy.js                # Edge case tests
│   ├── support/
│   │   ├── commands.js              # Custom Cypress commands
│   │   └── e2e.js                   # Global config
│   └── fixtures/
│       ├── valid-properties.json     # Test data
│       └── invalid-inputs.json       # Test data for validation
├── package.json
├── vite.config.js                   # Vite build configuration
├── cypress.config.js                # Cypress configuration
└── .eslintrc.json

.github/
└── workflows/
    └── ci.yml                       # CI pipeline (tests, coverage)

```

**Structure Decision**: Selected Web Application structure (Option 2) with separate backend and frontend directories. Backend uses Express for API and static file serving. Frontend uses React with Vite for fast development and optimized production builds. Cypress tests live in frontend directory as they test the integrated application. This separation enables independent development and testing of client and server concerns while maintaining simple deployment (Express serves built React app).

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

No violations requiring complexity justification. The single deviation (single-page vs. multi-step workflow) is an explicit business requirement documented in Constitution Check, not added complexity.

---

## Phase 1 Post-Design Constitution Re-evaluation

After completing research, data model, contracts, and quickstart documentation, re-evaluating constitution compliance:

### Design Validation

✅ **Mobile-First Design**:

- Data model supports responsive form with Bootstrap components
- API contract designed for fast responses (< 3s)
- Touch targets in component design specs (44x44px minimum)
- No design decisions that compromise mobile experience

✅ **Performance Budget**:

- JSON data files are small (<10KB total), loaded once at startup
- Quote calculation algorithm is O(1) complexity (hash lookups only)
- No heavy dependencies introduced (React + Bootstrap within budget)
- API contract specifies response times
- Quickstart includes Lighthouse CI verification steps

✅ **Workflow-Driven UX**:

- Form validation rules documented in data model
- Real-time validation strategy in research.md
- Error handling and user guidance patterns defined
- Single-page deviation remains justified (explicit requirement)

✅ **Data Simplicity**:

- JSON file structure finalized in data-model.md
- Data access abstraction layer designed (data-service.js)
- No database complexity added
- Migration path documented for future

✅ **Progressive Enhancement**:

- API contract includes fallback endpoint
- HTML form submission documented in quickstart
- Server-side validation specified
- Graceful degradation patterns confirmed

### Final Gate Status: ✅ APPROVED FOR IMPLEMENTATION

Design phase complete. All constitution principles maintained. No new violations introduced. Architecture supports all performance and accessibility targets.

**Next Step**: Run `/speckit.tasks` to generate detailed implementation task list organized by user story.

---

## Summary

This implementation plan provides:

✅ **Complete technical architecture** with React, Bootstrap, Express, Cypress  
✅ **Research documentation** justifying all technology choices  
✅ **Data model** with TypeScript interfaces and JSON schemas  
✅ **API contract** (OpenAPI 3.0 specification)  
✅ **Quickstart guide** for rapid development setup  
✅ **Constitution compliance** verified pre and post-design  
✅ **Agent context updated** with technology stack  
✅ **Performance targets** specified and testable  
✅ **Testing strategy** with 100% code coverage goal

**Branch**: `001-instant-quote-site`  
**Ready for**: Implementation task breakdown (`/speckit.tasks`)  
**Estimated complexity**: Low (single-page MVP, no database, standard tech stack)
