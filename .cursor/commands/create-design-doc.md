# Create UI Design Document

Generates UI design documents from requirements. Analyzes codebase, gathers context, and produces detailed design +
overview following templates.

## Input

- **Feature Name**: `[FEATURE_NAME]` (kebab-case)
- **Requirements**: Path to `design/requirements/[FILE].md`, PRD path, or inline description
- **JIRA ID**: `[JIRA-ID]` (optional)
- **Stakeholders**: List (optional)

## Steps

1. **Validate & Setup**
   - Verify feature name format (kebab-case)
   - Check requirement file exists or prompt for inline
   - Check if design doc exists (ask: update/new version/cancel)
   - Load templates: `design-template.md`, `design-overview-template.md`
   - Set output paths: `[FEATURE_NAME].md`, `[FEATURE_NAME]-overview.md`

2. **Gather Requirements**
   - Read requirement file/PRD/inline description
   - Extract: problem statement, user stories, acceptance criteria, user roles, mockups
   - Identify: use cases, success criteria, dependencies, constraints

3. **Analyze Codebase**
   - Search for similar features/components
   - Review `tsconfig.base.json` for available libraries
   - Check `apps/` and `libs/` structure
   - Read rules: `.cursor/rules/nx.mdc`, `.cursor/rules/angular.mdc`, `.cursor/rules/clarity.mdc`,
     `.cursor/rules/rxjs.mdc`, `.cursor/rules/general.mdc`
   - Identify reusable components (forms, grids, modals, wizards)

4. **Design Architecture**
   - **Components**: List new components (name, purpose, inputs/outputs, state approach)
   - **Services**: Data access, business logic, state (NGXS), utilities
   - **Data Models**: Request/response, view models, form models, enums
   - **State Management**: Component-local (signals) vs feature (NGXS) vs global
   - **Routing**: Paths, guards, lazy loading, navigation flow
   - **API Integration**: Endpoints, request/response, auth, error handling, mocks

5. **Design Patterns & Reuse**
   - Find similar implementations in codebase
   - Map requirements to Clarity components
   - Document accessibility considerations per UI element

6. **Estimate Complexity**
   - **Complexity**: Low (single component) / Moderate (multiple) / High (complex workflows)
   - **Breakdown**: Components, services, stores, APIs, tests
   - **SWAG**:
     - Design & Prototyping: X-Y weeks
     - Development: X-Y weeks
     - Testing & Deployment: X-Y weeks
     - Total: X-Y weeks (Z months)
   - **Team Size**: Number and skill levels needed

7. **Dependencies & Risks**
   - **Critical Dependencies**: Table with owner, status, risk level, mitigation
   - **Technical Risks**: Impact, probability, mitigation
   - **Scope Risks**: Out-of-scope items that might creep

8. **Generate Design Documents**

   **Detailed Design** (`[FEATURE_NAME].md`):
   - Header (title, JIRA, stakeholders)
   - Problem Statement, Glossary, Goals, Non-Goals
   - Big Picture (release scope, user flow, screens)
   - Diagram/Mockup (ASCII art, layouts, navigation)
     - **Formatting Requirements**: See [ASCII Art Formatting Requirements](#ascii-art-formatting-requirements) section
   - New Design Elements (components, patterns, accessibility)
   - New Requirements from UI Platform
   - DSM UI Integration (build, CI/CD, scalability, security, lifecycle, errors, VCF)
   - Implementation Plan (phases, order, testing)
   - API Contracts (endpoints, examples, errors, mocks)
   - State Management Details (NGXS state, actions, selectors, effects)
   - Component Specifications (purpose, inputs/outputs, state, accessibility, testing)
   - Localization Strategy (i18n keys, translation files)
   - Testing Strategy (unit, E2E, accessibility, performance)
   - Success Criteria (functional, quality, performance, accessibility)

   **Overview** (`[FEATURE_NAME]-overview.md`):
   - Header (tech lead, UI dev, eng mgr, VGL)
   - Overview (2-3 paragraph summary)
   - High-Level Requirements Table (role, use case, UI, description)
   - Mockup/Screenshot reference
     - **Formatting Requirements**: See [ASCII Art Formatting Requirements](#ascii-art-formatting-requirements) section
   - SWAG (complexity, team size, time estimates, dependencies/risks summary)
   - Implementation Status (if work started)
   - Success Criteria summary
   - Related Documentation links

9. **Review & Validate**
   - **Completeness**: All template sections filled, no placeholders
   - **Technical Accuracy**: Component names, paths, imports, Clarity components, state management
   - **Architectural Alignment**: Nx boundaries, standalone, OnPush, signals, NGXS, Transloco, accessibility
   - **Quality**: Measurable goals, success criteria, testing strategy, realistic estimates
   - **Formatting**: All ASCII art diagrams, flow charts, and mockups must follow
     [ASCII Art Formatting Requirements](#ascii-art-formatting-requirements)

10. **Generate Output**
    - Write design documents to `design/`
    - Provide summary report with documents, architecture, dependencies, next steps

## ASCII Art Formatting Requirements

All ASCII art boxes, diagrams, flow charts, and mockups in design documents must follow these formatting requirements:

- **Box Alignment**: All vertical borders (│) must align perfectly - use fixed-width boxes with consistent character
  count
- **Right Border**: Right-side borders (│┐┘) must align vertically in the same column
- **Left Border**: Left-side borders (│┌└) must align vertically in the same column
- **Label Alignment**: Left-side labels must use consistent spacing after colons (e.g., "Label: " with fixed width for
  alignment)
- **Input Fields**: Input fields `[________________]` must be aligned within their sections with consistent spacing
- **Buttons/Actions**: Buttons and actions aligned to the right must start at the same column position
- **Box Characters**: Use consistent box-drawing characters (┌─┐│├┤└┘) - never mix with ASCII characters
- **Spacing**: Use consistent spacing (2-4 spaces) for indentation and padding within boxes
- **Flow Charts**: Arrows (→ ↓ ↑ ←) and connectors must align with box borders
- **Multi-line Content**: Multi-line text within boxes must maintain consistent left padding
- **Radio/Checkboxes**: Radio buttons (○ ●) and checkboxes must be indented consistently (2-4 spaces)

## Important Notes

**Do NOT:**

- Generate code (design only)
- Assume backend APIs without evidence
- Invent requirements
- Skip codebase analysis
- Use generic examples

**DO:**

- Analyze codebase for reusable patterns
- Follow all architectural rules
- Provide specific, actionable recommendations
- Identify concrete dependencies and risks
- Give realistic time estimates
- Reference existing similar features
- Consider accessibility and i18n from start

## Design Quality Standards

- **Specific**: Reference actual components/services in codebase
- **Actionable**: Engineers can implement from design
- **Realistic**: Time estimates account for testing/polish/bugs
- **Complete**: All aspects covered (UI, state, API, testing, i18n, a11y)
- **Aligned**: Follows all architectural rules

## Related Rules

- `.cursor/rules/nx.mdc` - Module boundaries and Nx workspace
- `.cursor/rules/general.mdc` - Core standards and service patterns
- `.cursor/rules/angular.mdc` - Component patterns and Angular 19
- `.cursor/rules/clarity.mdc` - UI components and Clarity Design System
- `.cursor/rules/rxjs.mdc` - RxJS patterns and observable management
- `.cursor/rules/testing.mdc` - Testing approach with Vitest and Playwright
