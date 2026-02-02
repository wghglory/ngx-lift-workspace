---
name: Clarity Timepicker Implementation
overview:
  Create a comprehensive Clarity Design System timepicker component (`cll-timepicker`) for clr-lift library with all
  Google Material features, including input integration, dropdown with customizable intervals, validation, toggle button
  component, forms integration, i18n support, and accessibility compliance.
todos:
  - id: create-types-utils
    content: Create timepicker types, interfaces, and utility functions (parsing, formatting, interval generation)
    status: pending
  - id: create-main-component
    content:
      Implement TimepickerComponent with dropdown, options generation, keyboard navigation, and ControlValueAccessor
    status: pending
  - id: create-input-directive
    content: Implement TimepickerInputDirective with time parsing, validation, and form control integration
    status: pending
  - id: create-toggle-component
    content: Implement TimepickerToggleComponent with clock icon and custom icon projection support
    status: pending
  - id: create-i18n
    content:
      Create timepicker.l10n.ts with translations for 12+ locales (en, de, es, fr, it, ja, ko, pt, zh-CN, zh-TW, nl, ru)
    status: pending
  - id: write-unit-tests
    content: Write comprehensive unit tests for all components, directive, and utility functions (60%+ coverage)
    status: pending
  - id: create-demo-page
    content:
      Create demo page with 8 examples showcasing all features (basic, intervals, validation, datepicker integration,
      locales)
    status: pending
  - id: update-exports
    content: Update library exports in index.ts files to expose timepicker components
    status: pending
  - id: add-documentation
    content: Add comprehensive JSDoc comments to all public APIs with usage examples
    status: pending
  - id: verify-accessibility
    content: Verify ARIA compliance, keyboard navigation, and screen reader support
    status: pending
isProject: false
---

# Clarity Timepicker Implementation Plan

## Overview

Implement a production-ready timepicker component for the clr-lift library that follows Clarity Design System patterns
and includes all features from Google Material's timepicker.

## Architecture

### Core Components Structure

```
libs/clr-lift/src/lib/components/timepicker/
├── timepicker.component.ts        # Main timepicker dropdown
├── timepicker.component.html
├── timepicker.component.scss
├── timepicker.component.spec.ts
├── timepicker-input.directive.ts  # Input directive [matTimepicker]
├── timepicker-input.directive.spec.ts
├── timepicker-toggle.component.ts # Toggle button component
├── timepicker-toggle.component.html
├── timepicker-toggle.component.scss
├── timepicker-toggle.component.spec.ts
├── timepicker.l10n.ts            # Translations
├── timepicker.types.ts           # TypeScript interfaces
├── timepicker.utils.ts           # Utility functions
├── timepicker.utils.spec.ts
└── index.ts                       # Public exports
```

## Component Design

### 1. **TimepickerComponent** (`cll-timepicker`)

**Purpose**: Dropdown menu displaying time options with keyboard navigation.

**Key Features**:

- Dropdown with customizable time intervals (15m, 30m, 1h, custom)
- Keyboard navigation (Arrow keys, Enter, Escape)
- Scroll to selected time on open
- Min/max time bounds support
- Custom options list support
- ARIA combobox pattern implementation

**Signal Inputs**:

```typescript
interval = input<string>('30m'); // '30m', '1h', '90 minutes', etc.
options = input<TimepickerOption[]>(); // Custom options array
min = input<Date | string | null>(null); // Minimum allowed time
max = input<Date | string | null>(null); // Maximum allowed time
ariaLabel = input<string>('');
ariaLabelledby = input<string>('');
```

**Implementation Pattern**: Similar to
`[file-reader.component.ts](libs/clr-lift/src/lib/components/file-reader/file-reader.component.ts)` with
ControlValueAccessor, Validator.

### 2. **TimepickerInputDirective** (`cllTimepicker`)

**Purpose**: Connects input element to timepicker dropdown, manages value binding.

**Key Features**:

- ControlValueAccessor implementation
- Parse time string input (12h/24h formats)
- Validation (parse errors, min/max bounds)
- Integration with Angular Forms
- Auto-format on blur

**Directive Selector**: `[cllTimepicker]`

**Signal Inputs**:

```typescript
cllTimepicker = input.required<TimepickerComponent>(); // Reference to timepicker
cllTimepickerMin = input<Date | string | null>(null);
cllTimepickerMax = input<Date | string | null>(null);
```

**Validation Errors**:

- `cllTimepickerParse`: Invalid time format
- `cllTimepickerMin`: Time before minimum
- `cllTimepickerMax`: Time after maximum

### 3. **TimepickerToggleComponent** (`cll-timepicker-toggle`)

**Purpose**: Button to open/close timepicker dropdown.

**Key Features**:

- Clock icon (default, customizable via projection)
- Disabled state synced with input
- ARIA attributes for accessibility
- `matIconSuffix` compatibility for form field integration

**Signal Inputs**:

```typescript
for = input.required<TimepickerComponent>(); // Reference to timepicker
disabled = input<boolean>(false);
```

**Template Projection**: Support custom icons via `cllTimepickerToggleIcon` attribute.

## Data Flow

```
User types in input → TimepickerInputDirective parses → Updates form control value
User clicks toggle → Opens TimepickerComponent dropdown
User selects option → Updates input value → Closes dropdown
Form control value changes → Updates timepicker display
```

## Key Implementation Details

### Time Parsing Utility (`timepicker.utils.ts`)

```typescript
/**
 * Parse time string to Date object
 * Supports: "2:30 PM", "14:30", "14.30", "2:30pm"
 */
export function parseTimeString(timeStr: string, baseDate?: Date): Date | null;

/**
 * Format Date to time string based on locale
 */
export function formatTime(date: Date, locale?: string): string;

/**
 * Generate time options array based on interval
 */
export function generateTimeOptions(interval: string, min?: Date | string, max?: Date | string): TimepickerOption[];

/**
 * Parse interval string: '30m', '1.5 hours', '90 minutes'
 */
export function parseInterval(interval: string): number; // returns minutes

/**
 * Check if time is within bounds
 */
export function isTimeInBounds(time: Date, min?: Date | null, max?: Date | null): boolean;
```

### TypeScript Interfaces (`timepicker.types.ts`)

```typescript
export interface TimepickerOption {
  value: Date;
  label: string;
  disabled?: boolean;
}

export type TimepickerInterval = string | number;

export interface TimepickerConfig {
  interval?: TimepickerInterval;
  ariaLabel?: string;
  ariaLabelledby?: string;
}
```

### Internationalization (`timepicker.l10n.ts`)

Following pattern from `[file-reader.l10n.ts](libs/clr-lift/src/lib/components/file-reader/file-reader.l10n.ts)`:

```typescript
export const timepickerTranslations: Record<string, Record<string, string>> = {
  en: {
    selectTime: 'Select time',
    invalidTime: 'Invalid time format',
    timeBeforeMin: 'Time must be after {0}',
    timeAfterMax: 'Time must be before {0}',
    noOptionsAvailable: 'No time options available',
  },
  // Additional locales: de, es, fr, it, ja, ko, pt, zh-CN, zh-TW, nl, ru
};
```

### Styling (`timepicker.component.scss`)

```scss
@import '../../shared/variables';

:host {
  display: block;
}

.timepicker-dropdown {
  background-color: $clr-color-neutral-0;
  border: 1px solid $clr-color-neutral-400;
  border-radius: $clr-border-radius;
  max-height: 300px;
  overflow-y: auto;
  box-shadow: $clr-box-shadow-md;
}

.timepicker-option {
  padding: $clr-baseline-padding;
  cursor: pointer;

  &:hover {
    background-color: $clr-color-action-50;
  }

  &.selected {
    background-color: $clr-color-action-100;
    font-weight: $clr-font-weight-semibold;
  }

  &[aria-disabled='true'] {
    opacity: 0.5;
    cursor: not-allowed;
  }
}
```

## Forms Integration Example

```typescript
@Component({
  template: `
    <clr-input-container>
      <label>Meeting Time</label>
      <input
        clrInput
        [cllTimepicker]="timepicker"
        [formControl]="timeControl"
      />
      <cll-timepicker-toggle clrIconSuffix [for]="timepicker" />
      <cll-timepicker #timepicker [interval]="'30m'" />

      <clr-control-error *clrIfError="'cllTimepickerParse'">
        Invalid time format
      </clr-control-error>
      <clr-control-error *clrIfError="'cllTimepickerMin'">
        Time must be after 9:00 AM
      </clr-control-error>
    </clr-input-container>
  `
})
```

## Datepicker Integration

Support binding to same form control as `clr-datepicker`:

```typescript
@Component({
  template: `
    <clr-date-container>
      <label>Meeting Date</label>
      <input clrDate [formControl]="dateTimeControl" />
    </clr-date-container>

    <clr-input-container>
      <label>Meeting Time</label>
      <input clrInput [cllTimepicker]="timepicker" [formControl]="dateTimeControl" />
      <cll-timepicker-toggle clrIconSuffix [for]="timepicker" />
      <cll-timepicker #timepicker />
    </clr-input-container>
  `
})
```

## Accessibility Requirements

Following ARIA combobox pattern:

- Input: `role="combobox"`, `aria-expanded`, `aria-controls`, `aria-activedescendant`
- Dropdown: `role="listbox"`, `aria-label` or `aria-labelledby`
- Options: `role="option"`, `aria-selected`, `aria-disabled`
- Keyboard support: Arrow keys, Enter, Escape, Tab
- Screen reader announcements for selection

## Testing Strategy

### Unit Tests (`*.spec.ts`)

Following pattern from
`[file-reader.component.spec.ts](libs/clr-lift/src/lib/components/file-reader/file-reader.component.spec.ts)`:

1. **TimepickerComponent Tests**:

- Generate options with different intervals
- Handle min/max bounds
- Keyboard navigation
- Selection updates value
- Custom options array

1. **TimepickerInputDirective Tests**:

- Parse valid time strings (12h, 24h)
- Parse error validation
- Min/max validation
- Form control integration
- Value formatting on blur

1. **TimepickerToggleComponent Tests**:

- Toggle opens/closes dropdown
- Disabled state
- Custom icon projection

1. **Utility Functions Tests**:

- `parseTimeString()` with various formats
- `parseInterval()` with different strings
- `generateTimeOptions()` with intervals
- `isTimeInBounds()` validation

### Coverage Target

Minimum 60% coverage per
[testing guidelines](workspace://libs/clr-lift/src/lib/components/file-reader/file-reader.component.spec.ts).

## Demo Application

Create demo page at `apps/demo/src/app/clr-lib/pages/timepicker-demo/`:

```
timepicker-demo/
├── timepicker-demo.component.ts
├── timepicker-demo.component.html
├── timepicker-demo.component.scss
└── timepicker-demo.component.spec.ts
```

**Demo Examples**:

1. Basic timepicker with default interval
2. Timepicker with custom intervals (15m, 1h, 3.5h)
3. Timepicker with min/max validation
4. Timepicker with custom options array
5. Timepicker + datepicker integration
6. Timepicker with custom toggle icon
7. Timepicker with different locales
8. Reactive forms integration with validation

## Library Exports

Update `[libs/clr-lift/src/lib/components/index.ts](libs/clr-lift/src/lib/components/index.ts)`:

```typescript
export * from './timepicker';
```

Create `libs/clr-lift/src/lib/components/timepicker/index.ts`:

```typescript
export * from './timepicker.component';
export * from './timepicker-input.directive';
export * from './timepicker-toggle.component';
export * from './timepicker.types';
export * from './timepicker.utils';
```

## Documentation Requirements

Following JSDoc pattern from
`[file-reader.component.ts](libs/clr-lift/src/lib/components/file-reader/file-reader.component.ts)`:

- Component class: Purpose, features, usage example
- All public inputs/outputs: Description, type, default value
- All exported functions: Purpose, parameters, return type, examples
- Utility functions: Edge cases, format specifications

## Configuration

Create `MAT_TIMEPICKER_CONFIG` injection token (optional):

```typescript
export const MAT_TIMEPICKER_CONFIG = new InjectionToken<TimepickerConfig>('MAT_TIMEPICKER_CONFIG');
```

Allows app-wide defaults:

```typescript
providers: [{provide: MAT_TIMEPICKER_CONFIG, useValue: {interval: '15m'}}];
```

## Migration Considerations

Since this is a new component (not migrating from Material), ensure:

- Naming follows Clarity conventions (`cll-*` prefix)
- API surface matches Material for familiarity
- Clarity Design System styling patterns
- Integration with existing clr-lift components

## Quality Checklist

Before completion, verify:

- All components pass ESLint without errors
- TypeScript strict mode passes
- 60%+ test coverage achieved
- JSDoc comments on all public APIs
- Demo app showcases all features
- i18n translations for 12+ locales
- ARIA compliance verified
- No circular dependencies
- Tree-shakable structure
- Clarity SASS variables used (no hard-coded colors)
- `ChangeDetectionStrategy.OnPush` on all components
- Signal inputs used throughout
- No `standalone: true` in component decorators
