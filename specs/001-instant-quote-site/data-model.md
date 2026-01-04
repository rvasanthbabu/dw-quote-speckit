# Data Model: Instant Dwelling Quote Site

**Feature**: Instant Dwelling Quote Site  
**Branch**: 001-instant-quote-site  
**Date**: 2026-01-01

## Purpose

This document defines the data entities, their relationships, and validation rules for the instant dwelling quote application. All entities are represented as TypeScript interfaces for type safety and JSON schemas for validation.

---

## Core Entities

### Property

Represents a residential dwelling for which an insurance quote is being calculated.

**TypeScript Interface**:

```typescript
interface Property {
  address: PropertyAddress;
  squareFeet: number; // Property size in square feet
  coverage: number; // Desired coverage amount in dollars
}

interface PropertyAddress {
  street: string; // Street address
  city: string; // City name
  state: string; // Two-letter state code (e.g., "TX")
  zipCode: string; // Five-digit zip code
}
```

**JSON Schema**:

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "type": "object",
  "required": ["address", "squareFeet", "coverage"],
  "properties": {
    "address": {
      "type": "object",
      "required": ["street", "city", "state", "zipCode"],
      "properties": {
        "street": { "type": "string", "minLength": 5 },
        "city": { "type": "string", "minLength": 2 },
        "state": {
          "type": "string",
          "pattern": "^[A-Z]{2}$",
          "description": "Two-letter state code"
        },
        "zipCode": {
          "type": "string",
          "pattern": "^\\d{5}$",
          "description": "Five-digit zip code"
        }
      }
    },
    "squareFeet": {
      "type": "integer",
      "minimum": 100,
      "maximum": 50000,
      "description": "Property size in square feet"
    },
    "coverage": {
      "type": "number",
      "minimum": 50000,
      "maximum": 2000000,
      "description": "Desired coverage amount in dollars"
    }
  }
}
```

**Validation Rules**:

- Street address: Required, minimum 5 characters
- City: Required, minimum 2 characters
- State: Required, exactly 2 uppercase letters (US state codes)
- Zip code: Required, exactly 5 digits
- Square feet: Required, integer between 100 and 50,000
- Coverage: Required, number between $50,000 and $2,000,000

**Relationships**:

- One Property → One Quote (quote calculated from property details)
- One Property → One LocationRiskFactor (via zip code lookup)

---

### Quote

Represents a calculated insurance quote for a property.

**TypeScript Interface**:

```typescript
interface Quote {
  property: Property; // Input property details
  amount: number; // Annual premium in dollars
  isHighValue: boolean; // True if amount exceeds threshold
  breakdown: QuoteBreakdown; // Calculation details
  timestamp: string; // ISO 8601 timestamp
  status: "standard" | "contact_required";
}

interface QuoteBreakdown {
  baseRate: number; // Base rate per square foot
  riskMultiplier: number; // Location risk multiplier
  coverageMultiplier: number; // Coverage tier multiplier
  subtotal: number; // Before risk adjustment
  total: number; // Final amount
}
```

**JSON Schema**:

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "type": "object",
  "required": [
    "property",
    "amount",
    "isHighValue",
    "breakdown",
    "timestamp",
    "status"
  ],
  "properties": {
    "property": { "$ref": "#/definitions/Property" },
    "amount": {
      "type": "number",
      "minimum": 0,
      "description": "Annual premium in dollars"
    },
    "isHighValue": {
      "type": "boolean",
      "description": "True if amount exceeds high-value threshold"
    },
    "breakdown": {
      "type": "object",
      "required": [
        "baseRate",
        "riskMultiplier",
        "coverageMultiplier",
        "subtotal",
        "total"
      ],
      "properties": {
        "baseRate": { "type": "number" },
        "riskMultiplier": { "type": "number" },
        "coverageMultiplier": { "type": "number" },
        "subtotal": { "type": "number" },
        "total": { "type": "number" }
      }
    },
    "timestamp": {
      "type": "string",
      "format": "date-time",
      "description": "ISO 8601 timestamp of quote calculation"
    },
    "status": {
      "type": "string",
      "enum": ["standard", "contact_required"],
      "description": "Quote status: standard (show amount) or contact_required (show contact message)"
    }
  }
}
```

**Business Rules**:

- Amount is calculated based on property details and risk factors
- isHighValue = true when amount > $5,000/year
- status = 'contact_required' when isHighValue = true
- status = 'standard' when isHighValue = false
- Timestamp uses ISO 8601 format (YYYY-MM-DDTHH:mm:ss.sssZ)
- Quotes are stateless (not persisted in MVP)

**Relationships**:

- One Quote → One Property (the property being quoted)
- Quote uses QuoteRules and LocationRiskFactor for calculation

---

### LocationRiskFactor

Represents risk assessment data for a geographic location.

**TypeScript Interface**:

```typescript
interface LocationRiskFactor {
  zipCode: string; // Five-digit zip code
  risk: "low" | "medium" | "high";
  multiplier: number; // Risk adjustment multiplier
  description?: string; // Optional risk description
}
```

**JSON Schema**:

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "type": "object",
  "required": ["zipCode", "risk", "multiplier"],
  "properties": {
    "zipCode": {
      "type": "string",
      "pattern": "^\\d{5}$"
    },
    "risk": {
      "type": "string",
      "enum": ["low", "medium", "high"]
    },
    "multiplier": {
      "type": "number",
      "minimum": 0.5,
      "maximum": 3.0,
      "description": "Risk adjustment factor applied to quote"
    },
    "description": {
      "type": "string",
      "description": "Optional human-readable risk description"
    }
  }
}
```

**Storage Format** (`backend/src/data/location-risk-factors.json`):

```json
{
  "zipCodeRiskFactors": {
    "78701": {
      "risk": "low",
      "multiplier": 1.0,
      "description": "Low flood/fire risk area"
    },
    "78702": {
      "risk": "medium",
      "multiplier": 1.2,
      "description": "Moderate risk area"
    },
    "90001": {
      "risk": "high",
      "multiplier": 1.5,
      "description": "High risk area"
    },
    "33139": {
      "risk": "high",
      "multiplier": 1.8,
      "description": "Hurricane-prone coastal area"
    }
  },
  "defaultRisk": {
    "risk": "medium",
    "multiplier": 1.2,
    "description": "Default risk for unmapped zip codes"
  }
}
```

**Lookup Rules**:

- Look up risk factor by exact zip code match
- If zip code not found, use defaultRisk
- Risk levels: low (1.0x), medium (1.2x), high (1.5-2.0x)

---

### QuoteRules

Represents business rules and configuration for quote calculation.

**TypeScript Interface**:

```typescript
interface QuoteRules {
  baseRatePerSqFt: number; // Base rate per square foot
  coverageMultipliers: CoverageMultipliers; // Coverage tier multipliers
  highValueThreshold: number; // Dollar amount triggering "Contact Us"
  limits: PropertyLimits; // Min/max validation limits
  contactInfo: ContactInfo; // Contact details for high-value quotes
}

interface CoverageMultipliers {
  [tier: string]: number; // e.g., "50000-100000": 0.8
}

interface PropertyLimits {
  minPropertySize: number;
  maxPropertySize: number;
  minCoverage: number;
  maxCoverage: number;
}

interface ContactInfo {
  phone: string;
  email: string;
  message: string;
}
```

**JSON Schema**:

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "type": "object",
  "required": [
    "baseRatePerSqFt",
    "coverageMultipliers",
    "highValueThreshold",
    "limits",
    "contactInfo"
  ],
  "properties": {
    "baseRatePerSqFt": {
      "type": "number",
      "minimum": 0,
      "description": "Base rate per square foot in dollars"
    },
    "coverageMultipliers": {
      "type": "object",
      "description": "Multipliers for different coverage tiers",
      "additionalProperties": { "type": "number" }
    },
    "highValueThreshold": {
      "type": "number",
      "minimum": 0,
      "description": "Annual premium threshold for high-value properties"
    },
    "limits": {
      "type": "object",
      "required": [
        "minPropertySize",
        "maxPropertySize",
        "minCoverage",
        "maxCoverage"
      ],
      "properties": {
        "minPropertySize": { "type": "integer", "minimum": 0 },
        "maxPropertySize": { "type": "integer" },
        "minCoverage": { "type": "number", "minimum": 0 },
        "maxCoverage": { "type": "number" }
      }
    },
    "contactInfo": {
      "type": "object",
      "required": ["phone", "email", "message"],
      "properties": {
        "phone": { "type": "string" },
        "email": { "type": "string", "format": "email" },
        "message": { "type": "string" }
      }
    }
  }
}
```

**Storage Format** (`backend/src/data/quote-rules.json`):

```json
{
  "baseRatePerSqFt": 0.5,
  "coverageMultipliers": {
    "50000-100000": 0.8,
    "100001-500000": 1.0,
    "500001-1000000": 1.2,
    "1000001-2000000": 1.5
  },
  "highValueThreshold": 5000,
  "limits": {
    "minPropertySize": 100,
    "maxPropertySize": 50000,
    "minCoverage": 50000,
    "maxCoverage": 2000000
  },
  "contactInfo": {
    "phone": "1-800-555-0100",
    "email": "quotes@dwellinginsurance.com",
    "message": "This property requires personalized assessment. Please contact us for a custom quote."
  }
}
```

---

## Quote Calculation Algorithm

The quote calculation follows this formula:

```
1. Determine base cost:
   baseCost = squareFeet × baseRatePerSqFt

2. Apply coverage multiplier:
   coverageTier = findCoverageTier(coverage, coverageMultipliers)
   adjustedCost = baseCost × coverageTier.multiplier

3. Apply location risk multiplier:
   riskFactor = lookupRiskFactor(zipCode, locationRiskFactors)
   finalAmount = adjustedCost × riskFactor.multiplier

4. Determine status:
   if (finalAmount > highValueThreshold) {
     status = 'contact_required'
     isHighValue = true
   } else {
     status = 'standard'
     isHighValue = false
   }

5. Return Quote with breakdown
```

**Example Calculation**:

```
Property: 2000 sq ft, Austin TX (78701, low risk), $300,000 coverage
- baseCost = 2000 × 0.50 = $1,000
- coverageMultiplier = 1.0 (for $100k-$500k tier)
- adjustedCost = $1,000 × 1.0 = $1,000
- riskMultiplier = 1.0 (78701 is low risk)
- finalAmount = $1,000 × 1.0 = $1,000/year
- isHighValue = false ($1,000 < $5,000)
- status = 'standard'
```

---

## Validation Rules Summary

### Property Input Validation

| Field      | Type    | Required | Min     | Max       | Pattern      | Error Message                                            |
| ---------- | ------- | -------- | ------- | --------- | ------------ | -------------------------------------------------------- |
| street     | string  | ✓        | 5 chars | -         | -            | "Street address is required (min 5 characters)"          |
| city       | string  | ✓        | 2 chars | -         | -            | "City is required (min 2 characters)"                    |
| state      | string  | ✓        | 2 chars | 2 chars   | `^[A-Z]{2}$` | "State must be 2-letter code (e.g., TX)"                 |
| zipCode    | string  | ✓        | 5 chars | 5 chars   | `^\d{5}$`    | "Zip code must be 5 digits"                              |
| squareFeet | integer | ✓        | 100     | 50,000    | -            | "Property size must be between 100 and 50,000 sq ft"     |
| coverage   | number  | ✓        | 50,000  | 2,000,000 | -            | "Coverage amount must be between $50,000 and $2,000,000" |

### Business Rule Validation

- If zip code not in location-risk-factors.json, use defaultRisk
- Coverage tier determined by finding matching range in coverageMultipliers
- High-value threshold checked after final calculation
- All monetary values rounded to 2 decimal places

---

## Data Flow Diagram

```
User Input (Property)
       ↓
[Client Validation]
       ↓
[Quote Calculation Module] ← [QuoteRules.json]
       ↓                     ← [LocationRiskFactors.json]
Quote Result
       ↓
[Display Logic]
       ↓
Standard Quote Display OR Contact Us Message
```

---

## State Management

**Client State** (React):

- Form input values (controlled components)
- Validation errors (per-field)
- Quote result (after calculation)
- Loading state (during calculation)

**No Persistence**:

- Quotes are not saved to database
- No user sessions or authentication
- Page refresh clears all state
- Each quote calculation is stateless

---

## Future Database Migration Path

When migrating from JSON files to database:

1. **Create tables**:

   - `properties` (if persisting user inputs)
   - `quotes` (if persisting quote history)
   - `location_risk_factors` (from JSON)
   - `quote_rules` (from JSON, versioned)

2. **Update data service layer**:

   - Replace file reads with database queries
   - Keep same interface (no changes to business logic)
   - Add connection pooling and error handling

3. **Preserve business logic**:
   - Quote calculation module unchanged
   - Validation rules unchanged
   - Only data access layer changes

---

## TypeScript Definitions File

All interfaces should be defined in `backend/src/models/types.ts` and `frontend/src/types/index.ts` (shared definitions):

```typescript
// types/index.ts (shared between frontend and backend)
export interface PropertyAddress {
  street: string;
  city: string;
  state: string;
  zipCode: string;
}

export interface Property {
  address: PropertyAddress;
  squareFeet: number;
  coverage: number;
}

export interface QuoteBreakdown {
  baseRate: number;
  riskMultiplier: number;
  coverageMultiplier: number;
  subtotal: number;
  total: number;
}

export interface Quote {
  property: Property;
  amount: number;
  isHighValue: boolean;
  breakdown: QuoteBreakdown;
  timestamp: string;
  status: "standard" | "contact_required";
}

export interface LocationRiskFactor {
  zipCode: string;
  risk: "low" | "medium" | "high";
  multiplier: number;
  description?: string;
}

export interface CoverageMultipliers {
  [tier: string]: number;
}

export interface PropertyLimits {
  minPropertySize: number;
  maxPropertySize: number;
  minCoverage: number;
  maxCoverage: number;
}

export interface ContactInfo {
  phone: string;
  email: string;
  message: string;
}

export interface QuoteRules {
  baseRatePerSqFt: number;
  coverageMultipliers: CoverageMultipliers;
  highValueThreshold: number;
  limits: PropertyLimits;
  contactInfo: ContactInfo;
}
```

---

## Summary

This data model provides:

- ✅ Clear entity definitions with TypeScript interfaces
- ✅ Comprehensive validation rules (client and server)
- ✅ JSON storage format for MVP (Constitution Principle IV)
- ✅ Quote calculation algorithm specification
- ✅ Future database migration path
- ✅ Shared types between frontend and backend
- ✅ Business rule documentation
