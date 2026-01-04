---
description: "Task list for Instant Dwelling Quote Site implementation"
---

# Tasks: Instant Dwelling Quote Site

**Input**: Design documents from `/specs/001-instant-quote-site/`
**Prerequisites**: plan.md (tech stack), spec.md (user stories), research.md (decisions), data-model.md (entities), contracts/ (API spec)

**Tests**: Cypress E2E tests are REQUIRED for 100% code coverage per specification.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies on incomplete tasks)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Backend**: `backend/src/` for source, `backend/tests/` for tests
- **Frontend**: `frontend/src/` for source, `frontend/cypress/` for E2E tests
- Web application structure with separate backend and frontend directories

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [x] T001 Initialize backend Node.js project with package.json in backend/
- [x] T002 Initialize frontend React project with package.json in frontend/
- [x] T003 [P] Configure ESLint for backend with Airbnb config in backend/.eslintrc.json
- [x] T004 [P] Configure ESLint for frontend with Airbnb + React config in frontend/.eslintrc.json
- [x] T005 [P] Create backend directory structure (src/models, src/services, src/routes, src/middleware, src/data, tests/)
- [x] T006 [P] Create frontend directory structure (src/components, src/services, src/utils, cypress/e2e, cypress/support, cypress/fixtures)
- [x] T007 [P] Install backend dependencies (express, express-validator, helmet, compression, cors, jest)
- [x] T008 [P] Install frontend dependencies (react, react-dom, react-bootstrap, bootstrap, vite, cypress, @cypress/code-coverage)
- [x] T009 [P] Configure Vite with Istanbul plugin for code coverage in frontend/vite.config.js
- [x] T010 [P] Configure Cypress with code coverage plugin in frontend/cypress.config.js
- [x] T011 [P] Add npm scripts for dev, test, and coverage in both backend and frontend package.json files

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T012 Create JSON data file with location risk factors in backend/src/data/location-risk-factors.json
- [x] T013 Create JSON data file with quote rules in backend/src/data/quote-rules.json
- [x] T014 [P] Create data service for loading JSON files in backend/src/services/data-service.js
- [x] T015 [P] Create quote calculation module (pure function) in backend/src/models/quote-calculation.js
- [x] T016 Create validation schema (shared between client/server) in backend/src/models/validation-schema.js
- [x] T017 [P] Create Express app configuration with middleware in backend/src/app.js
- [x] T018 [P] Create server entry point in backend/src/server.js
- [x] T019 [P] Create React root component in frontend/src/App.jsx
- [x] T020 [P] Create React entry point in frontend/src/index.jsx
- [x] T021 [P] Create HTML entry file with SSR fallback form in frontend/public/index.html
- [x] T022 [P] Create constants file with limits and thresholds in frontend/src/utils/constants.js
- [x] T023 [P] Create currency formatter utility in frontend/src/utils/formatters.js
- [x] T024 [P] Create Cypress custom commands for reusable test actions in frontend/cypress/support/commands.js
- [x] T025 [P] Create test fixture with valid property data in frontend/cypress/fixtures/valid-properties.json
- [x] T026 [P] Create test fixture with invalid input data in frontend/cypress/fixtures/invalid-inputs.json

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Basic Quote Generation (Priority: P1) 🎯 MVP

**Goal**: Users can enter property details and receive an instant calculated quote on the same page

**Independent Test**: Enter property details (address, size, coverage), click "Get Quote", verify quote displays instantly without page reload

### Cypress Tests for User Story 1 (100% Coverage Required)

- [ ] T027 [P] [US1] Create Cypress test file for basic quote generation in frontend/cypress/e2e/basic-quote-generation.cy.js
- [ ] T028 [US1] Write Cypress test: "displays quote form on page load" - verify all input fields visible
- [ ] T029 [US1] Write Cypress test: "calculates and displays standard quote for valid property" - 2000 sqft, $300k coverage, Austin TX
- [ ] T030 [US1] Write Cypress test: "quote displays within 2 seconds of submission" - verify performance requirement
- [ ] T031 [US1] Write Cypress test: "quote appears below form without page reload" - verify SPA behavior
- [ ] T032 [US1] Write Cypress test: "quote formats currency correctly with dollar sign and commas" - verify $1,200.00/year format
- [ ] T033 [US1] Write Cypress test: "clears previous quote when input field changes" - verify FR-012
- [ ] T034 [US1] Write Cypress test: "Start Over button resets form and quote" - verify FR-013

### Backend Implementation for User Story 1

- [ ] T035 [P] [US1] Write Jest unit test for quote calculation module in backend/tests/unit/quote-calculation.test.js
- [ ] T036 [US1] Implement quote calculation logic (ensure tests pass) in backend/src/models/quote-calculation.js
- [ ] T037 [P] [US1] Write Jest unit test for quote service in backend/tests/unit/quote-service.test.js
- [ ] T038 [US1] Implement quote service orchestration in backend/src/services/quote-service.js
- [ ] T039 [P] [US1] Create Express route handler for POST /api/quote in backend/src/routes/quote-routes.js
- [ ] T040 [P] [US1] Create validation middleware using express-validator in backend/src/middleware/validation.js
- [ ] T041 [P] [US1] Create error handling middleware in backend/src/middleware/error-handler.js
- [ ] T042 [US1] Write Jest integration test for quote API endpoint in backend/tests/integration/quote-routes.test.js
- [ ] T043 [US1] Register quote routes in Express app in backend/src/app.js

### Frontend Implementation for User Story 1

- [ ] T044 [P] [US1] Create QuoteForm component with state management in frontend/src/components/QuoteForm.jsx
- [ ] T045 [P] [US1] Create PropertyAddressInput component (street, city, state, zip) in frontend/src/components/PropertyAddressInput.jsx
- [ ] T046 [P] [US1] Create PropertySizeInput component in frontend/src/components/PropertySizeInput.jsx
- [ ] T047 [P] [US1] Create CoverageAmountInput component in frontend/src/components/CoverageAmountInput.jsx
- [ ] T048 [P] [US1] Create LoadingSpinner component in frontend/src/components/LoadingSpinner.jsx
- [ ] T049 [US1] Create QuoteResult component to display standard quote in frontend/src/components/QuoteResult.jsx
- [ ] T050 [P] [US1] Create API client service for quote endpoint in frontend/src/services/quote-api.js
- [ ] T051 [P] [US1] Import and configure quote calculation module for client-side use in QuoteForm component
- [ ] T052 [US1] Wire up form submission to calculate quote client-side in QuoteForm.jsx
- [ ] T053 [US1] Add "Start Over" button with reset functionality in QuoteForm.jsx
- [ ] T054 [US1] Import QuoteForm into App.jsx and render main layout
- [ ] T055 [P] [US1] Create Bootstrap custom styles for mobile-first layout in frontend/src/styles/custom.scss

**Checkpoint**: Run Cypress tests to verify User Story 1 is fully functional and independently testable. MVP is now complete!

---

## Phase 4: User Story 2 - High-Value Quote Handling (Priority: P2)

**Goal**: Display "Contact Us" message instead of quote amount when calculated quote exceeds $5,000/year

**Independent Test**: Enter property details that trigger high-value quote (large property, high coverage), verify "Contact Us" message with clickable contact info displays instead of quote amount

### Cypress Tests for User Story 2 (100% Coverage Required)

- [ ] T056 [P] [US2] Create Cypress test file for high-value handling in frontend/cypress/e2e/high-value-handling.cy.js
- [ ] T057 [US2] Write Cypress test: "displays Contact Us message for quote over $5,000" - 10k sqft, $2M coverage
- [ ] T058 [US2] Write Cypress test: "Contact Us message includes phone number and email link" - verify clickable contact info
- [ ] T059 [US2] Write Cypress test: "quote at exactly $5,000 threshold triggers Contact Us message" - verify threshold is inclusive
- [ ] T060 [US2] Write Cypress test: "Contact Us message does not show dollar amount" - verify quote amount hidden

### Implementation for User Story 2

- [ ] T061 [US2] Update quote calculation module to set isHighValue flag when amount > $5,000 in backend/src/models/quote-calculation.js
- [ ] T062 [US2] Add Jest test cases for high-value threshold logic in backend/tests/unit/quote-calculation.test.js
- [ ] T063 [US2] Update QuoteResult component to conditionally render Contact Us message in frontend/src/components/QuoteResult.jsx
- [ ] T064 [US2] Add contact info (phone, email) from quote-rules.json to Contact Us message in QuoteResult.jsx
- [ ] T065 [US2] Style Contact Us message with Bootstrap Alert component (prominent, accessible) in QuoteResult.jsx

**Checkpoint**: Run Cypress tests to verify User Story 2 is fully functional and independently testable

---

## Phase 5: User Story 3 - Form Validation & User Guidance (Priority: P3)

**Goal**: Real-time form validation with clear, specific error messages to guide users toward correct data entry

**Independent Test**: Enter various invalid inputs (empty fields, wrong formats, out-of-range values), verify specific inline error messages appear immediately on blur and prevent submission

### Cypress Tests for User Story 3 (100% Coverage Required)

- [ ] T066 [P] [US3] Create Cypress test file for form validation in frontend/cypress/e2e/form-validation.cy.js
- [ ] T067 [US3] Write Cypress test: "shows error for non-numeric property size on blur" - verify inline error message
- [ ] T068 [US3] Write Cypress test: "shows error for negative property size" - verify "positive number" message
- [ ] T069 [US3] Write Cypress test: "shows error for empty required field on submit" - verify "required" message
- [ ] T070 [US3] Write Cypress test: "highlights invalid field with red border" - verify visual feedback (FR-010)
- [ ] T071 [US3] Write Cypress test: "shows warning for coverage outside recommended range" - $49k and $2.1M
- [ ] T072 [US3] Write Cypress test: "shows confirmation prompt for property size > 10,000 sqft" - verify edge case handling
- [ ] T073 [US3] Write Cypress test: "prevents form submission when validation fails" - verify FR-011
- [ ] T074 [US3] Write Cypress test: "clears error message when user corrects input" - verify UX flow
- [ ] T075 [US3] Write Cypress test: "validation error displays within 200ms of blur event" - verify performance requirement

### Implementation for User Story 3

- [ ] T076 [P] [US3] Create client-side validation module matching server schema in frontend/src/services/validation.js
- [ ] T077 [P] [US3] Create FormValidation component for displaying inline errors in frontend/src/components/FormValidation.jsx
- [ ] T078 [US3] Add onBlur validation handlers to PropertyAddressInput component in PropertyAddressInput.jsx
- [ ] T079 [US3] Add onBlur validation handlers to PropertySizeInput component in PropertySizeInput.jsx
- [ ] T080 [US3] Add onBlur validation handlers to CoverageAmountInput component in CoverageAmountInput.jsx
- [ ] T081 [US3] Add HTML5 validation attributes (required, min, max, pattern) to all form inputs
- [ ] T082 [US3] Add Bootstrap is-invalid class and invalid-feedback styling to error states
- [ ] T083 [US3] Add confirmation prompt for property size > 10,000 sqft in QuoteForm.jsx
- [ ] T084 [US3] Add form submission prevention when validation errors exist in QuoteForm.jsx
- [ ] T085 [US3] Add ARIA attributes for screen reader accessibility (aria-invalid, aria-describedby) to form inputs

**Checkpoint**: Run Cypress tests to verify User Story 3 is fully functional and independently testable

---

## Phase 6: Edge Cases & Robustness

**Goal**: Handle edge cases and error scenarios gracefully

**Independent Test**: Verify system handles unsupported locations, service unavailability, JavaScript disabled, and maximum values without errors

### Cypress Tests for Edge Cases (100% Coverage Required)

- [ ] T086 [P] Create Cypress test file for edge cases in frontend/cypress/e2e/edge-cases.cy.js
- [ ] T087 Write Cypress test: "shows unsupported location message for unmapped zip code" - verify defaultRisk fallback
- [ ] T088 Write Cypress test: "handles maximum property size (50,000 sqft) without error"
- [ ] T089 Write Cypress test: "handles maximum coverage ($2,000,000) without error"
- [ ] T090 Write Cypress test: "shows error message when API call fails" - mock network error
- [ ] T091 Write Cypress test: "form resets to empty state on page refresh" - verify no persistence
- [ ] T092 Write Cypress test: "mobile viewport (375px) displays form correctly" - verify mobile-first requirement
- [ ] T093 Write Cypress test: "touch targets are minimum 44x44px on mobile" - verify accessibility requirement

### Implementation for Edge Cases

- [ ] T094 [P] Add error handling for API call failures in quote-api.js client
- [ ] T095 [P] Add fallback to defaultRisk for unmapped zip codes in quote calculation module
- [ ] T096 [P] Add user-friendly error messages for network failures in QuoteForm.jsx
- [ ] T097 [P] Add logging for errors (no PII) in backend error handler middleware
- [ ] T098 [P] Verify HTML form fallback works with JavaScript disabled (manual test or Cypress with JS off)

---

## Phase 7: Performance, Accessibility & Polish

**Goal**: Verify performance targets, accessibility compliance, and production readiness

### Performance Verification

- [ ] T099 [P] Configure compression middleware in Express app for gzip responses
- [ ] T100 [P] Add Lighthouse CI configuration for automated performance testing
- [ ] T101 Run Lighthouse audit and verify LCP < 2.5s on 3G network simulation
- [ ] T102 Run Lighthouse audit and verify TTI < 3.5s on mid-tier mobile device simulation
- [ ] T103 Verify JavaScript bundle size < 200KB gzipped using build output analysis
- [ ] T104 Add Cypress test to verify quote calculation completes within 3 seconds

### Accessibility Verification

- [ ] T105 [P] Install Cypress accessibility plugin (cypress-axe)
- [ ] T106 Add Cypress accessibility test to verify WCAG 2.1 Level AA compliance for form
- [ ] T107 Manually test keyboard navigation through entire form (tab, enter, space)
- [ ] T108 Test with screen reader (VoiceOver or NVDA) to verify form labels and error announcements
- [ ] T109 Verify color contrast ratios meet 4.5:1 minimum for all text

### Production Readiness

- [ ] T110 [P] Add helmet middleware for security headers in backend/src/app.js
- [ ] T111 [P] Configure Express to serve frontend build from frontend/dist directory
- [ ] T112 [P] Add SPA fallback routing (serve index.html for all non-API routes) in Express app
- [ ] T113 [P] Create production build script in frontend package.json
- [ ] T114 [P] Add environment variable configuration for API URL in frontend
- [ ] T115 [P] Add environment variable configuration for port and CORS in backend
- [ ] T116 Create README.md with setup instructions at repository root
- [ ] T117 Verify backend Jest unit tests achieve 100% coverage of business logic
- [ ] T118 Verify Cypress E2E tests achieve 100% coverage requirement
- [ ] T119 Run complete test suite (backend + frontend) and verify all tests pass
- [ ] T120 Create production build and test locally with npm run preview

---

## Dependencies & Execution Order

### Phase Dependencies

1. **Phase 1 (Setup)** → Must complete before Phase 2
2. **Phase 2 (Foundational)** → Must complete before Phase 3, 4, or 5
3. **Phase 3 (US1)**, **Phase 4 (US2)**, **Phase 5 (US3)** → Can execute in parallel after Phase 2 ✅
4. **Phase 6 (Edge Cases)** → Depends on Phase 3, 4, 5 completion
5. **Phase 7 (Polish)** → Depends on all previous phases

### User Story Dependencies

- **US1 (Basic Quote Generation)**: No dependencies on other user stories ✅ **MVP**
- **US2 (High-Value Handling)**: Extends US1 (depends on QuoteResult component)
- **US3 (Form Validation)**: Extends US1 (depends on form components)

### Critical Path (Sequential Tasks)

These tasks must be executed in order as they have dependencies:

1. T001-T011 (Setup) → T012-T026 (Foundation)
2. T027-T034 (US1 Tests) should be written FIRST before T035-T055 (US1 Implementation)
3. T035-T036 (Quote calculation logic) → T037-T038 (Quote service) → T039-T043 (API routes)
4. T044-T054 (Frontend components) → Build on each other, execute in sequence
5. T061 (Update calculation) → Must happen after T036 is complete
6. T063-T065 (QuoteResult update) → Must happen after T049 is complete
7. T099-T120 (Polish) → Require all features complete

### Parallel Execution Opportunities

These tasks can be executed simultaneously by different developers:

**After Phase 1 Complete**:

- Developer A: T012-T018 (Backend foundation)
- Developer B: T019-T026 (Frontend foundation)

**After Phase 2 Complete** (Maximum Parallelism):

- **Team US1**: T027-T055 (Basic Quote Generation)
  - Tester: T027-T034 (Write Cypress tests)
  - Backend Dev: T035-T043 (Backend implementation)
  - Frontend Dev: T044-T055 (Frontend implementation)
- **Team US2**: T056-T065 (High-Value Handling) - Can start immediately after US1 foundation
- **Team US3**: T066-T085 (Form Validation) - Can start immediately after US1 foundation

**After All User Stories Complete**:

- Developer A: T086-T098 (Edge cases)
- Developer B: T099-T109 (Performance & accessibility)
- Developer C: T110-T120 (Production readiness)

---

## Implementation Strategy

### MVP First (Recommended)

**Week 1**: Phase 1 (Setup) + Phase 2 (Foundation)
**Week 2**: Phase 3 (User Story 1 - Basic Quote Generation) ← **Deploy this as MVP**
**Week 3**: Phase 4 (User Story 2) + Phase 5 (User Story 3)
**Week 4**: Phase 6 (Edge Cases) + Phase 7 (Polish) → Full Release

### Incremental Delivery Benefits

- **After Week 2**: MVP deployed, users can get basic quotes
- **After Week 3**: High-value handling and validation added
- **After Week 4**: Production-ready with edge cases and polish

Each user story is independently testable and deployable!

---

## Task Summary

**Total Tasks**: 120
**Phase 1 (Setup)**: 11 tasks
**Phase 2 (Foundational)**: 15 tasks (BLOCKING)
**Phase 3 (US1 - MVP)**: 29 tasks (8 tests + 9 backend + 12 frontend)
**Phase 4 (US2)**: 10 tasks (5 tests + 5 implementation)
**Phase 5 (US3)**: 20 tasks (10 tests + 10 implementation)
**Phase 6 (Edge Cases)**: 12 tasks (8 tests + 4 implementation)
**Phase 7 (Polish)**: 23 tasks (6 performance + 5 accessibility + 12 production)

**Parallelizable Tasks**: 58 tasks marked with [P]
**Independent Test Criteria**: Each user story (US1, US2, US3) has complete Cypress test suite

**MVP Scope**: Phases 1-3 (55 tasks) deliver basic quote generation - the core value proposition

---

## Validation Checklist

✅ All tasks follow format: `- [ ] [TaskID] [P?] [Story?] Description with file path`
✅ Tasks organized by user story (Phase 3=US1, Phase 4=US2, Phase 5=US3)
✅ Each user story has independent test criteria and Cypress tests
✅ Tests written BEFORE implementation (T027-T034 before T035-T055)
✅ File paths specified in every task description
✅ Parallelizable tasks marked with [P]
✅ Story labels added for user story phases ([US1], [US2], [US3])
✅ Dependencies clearly documented
✅ MVP scope identified (Phase 3 = User Story 1)
✅ 100% code coverage requirement addressed with comprehensive Cypress tests
