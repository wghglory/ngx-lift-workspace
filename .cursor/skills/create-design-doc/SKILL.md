---
name: create-design-doc
description: >-
  Generate comprehensive UI design documents and architecture specifications from requirements. Use when designing a new
  feature, drafting an architecture spec, planning component structure, or producing design and design-overview
  documents.
---

# Create UI Design Document

Generates UI design documents and architecture specifications from feature requirements. Analyzes the monorepo codebase,
gathers context, and produces detailed architecture specifications and high-level executive overviews.

## Input

- **Feature Name**: `[FEATURE_NAME]` (kebab-case)
- **Requirements**: Path to requirement document, PRD, or inline description
- **Stakeholders / Team**: List (optional)

## Steps

### 1. Validate & Setup

- Verify feature name format (kebab-case).
- Check if design document exists (ask: update / new version / cancel).
- Set output paths: `design/[FEATURE_NAME].md` and `design/[FEATURE_NAME]-overview.md`.

### 2. Gather Requirements

- Extract problem statement, user stories, acceptance criteria, and user roles.
- Identify use cases, success criteria, dependencies, and constraints.

### 3. Analyze Monorepo Codebase

- Search for similar features and components across `libs/ngx-lift/`, `libs/clr-lift/`, and `apps/demo/`.
- Review `tsconfig.base.json` for available libraries and path mappings.
- Consult `.cursor/rules/`:
  - `nx.mdc` for module boundaries and library structure.
  - `angular.mdc` for modern Angular patterns (signals, OnPush, control flow).
  - `clarity.mdc` for Clarity Design System component mappings.
  - `rxjs.mdc` for reactive streaming and async state.
  - `general.mdc` for TypeScript strict mode and coding standards.

### 4. Design Architecture

- **Components**: Component hierarchy, inputs (`input()`), outputs (`output()`), state management.
- **State Management**: Signals (`signal()`, `computed()`, `resourceAsync()`), reactive form bridges (`toSignalForm()`).
- **Services**: API contracts, caching, error handling, mock data.
- **Routing**: Standalone routes, route params (`injectParams()`), lazy loading.

### 5. Design Patterns & Reuse

- Map requirements to Clarity Angular components (`clr-*`) or `clr-lift` components.
- Document accessibility considerations (ARIA labels, keyboard focus, form containers).

### 6. Estimate Complexity & SWAG

- **Complexity**: Low (single component) / Moderate (multiple components) / High (complex multi-step flows).
- **Time Estimates**: Design & Prototyping, Development, Testing & Verification.

### 7. Dependencies & Risks

- **Critical Dependencies**: External APIs, shared library utilities.
- **Technical Risks**: Impact, probability, and concrete mitigation steps.

### 8. Generate Documents

#### Detailed Design (`design/[FEATURE_NAME].md`):

- Header (title, stakeholders, date)
- Problem Statement, Goals, Non-Goals
- Architecture & Component Hierarchy
- ASCII Art Layout / Flow Diagrams (consistent box-drawing borders `┌─┐│└┘`)
- Data Models & API Contracts
- State Management & Reactivity (Signals, `toSignalForm`, `resourceAsync`)
- Testing Strategy (unit tests with Vitest, coverage >60%)
- Success Criteria & Definition of Done

#### Overview (`design/[FEATURE_NAME]-overview.md`):

- Executive summary (2-3 paragraphs)
- High-level requirements table
- Milestone timeline & SWAG breakdown
- Implementation status & related links

## Important Notes

**Do NOT:**

- Generate speculative code instead of design specifications.
- Invent requirements without context or confirmation.
- Skip codebase analysis for existing patterns.

**DO:**

- Follow all workspace architectural rules (modern Angular, Clarity Design System, strict TypeScript).
- Provide specific, actionable implementation steps for engineers.
