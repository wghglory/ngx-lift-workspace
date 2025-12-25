# Code Review

Perform a comprehensive code review of the current changes, following all tech standards and documentation defined in
this codebase. The rules defined in `.cursor/rules/` have the highest priority and must be strictly enforced.

## Objective

**IMPORTANT**: This command reviews **ONLY the changed/submitted code** (staged, unstaged, or specified files), **NOT
the entire codebase**.

Review the changed code against the comprehensive tech standards defined in this workspace, including:

- TypeScript strict mode compliance
- Angular 20 patterns and best practices
- Clarity Design System guidelines
- Testing standards (Vitest & Playwright)
- RxJS patterns
- Nx workspace boundaries
- Accessibility requirements
- Code quality standards (ESLint, Prettier, JSDoc)
- Definition of Done checklist

**CRITICAL**: This command **MUST automatically detect, suggest, and apply fixes** for all issues found. After applying
fixes, provide a summary report for manual review. The user will manually review the applied fixes before committing.

## Process

1. **Identify Files to Review**
   - **ONLY review changed/submitted files** - do NOT review the entire codebase
   - If no specific files are mentioned, review all changed files (staged and unstaged) from git
   - If specific files are mentioned, review only those files
   - Include related test files for components/services being reviewed (only if they are also changed)
   - Use `git status` and `git diff` to identify what has actually changed
   - **DO NOT** scan the entire codebase for issues - only review files that have been modified

2. **Read and Analyze Code**
   - Read **ONLY the changed files** and their immediate dependencies (if changed)
   - Read related files (component, template, styles, spec files) **ONLY if they are part of the changes**
   - Understand the context and purpose of the changes
   - **DO NOT** read unrelated files from the codebase
   - Focus on what was actually modified, not the entire project

3. **Comprehensive Review Checklist**

   ### TypeScript & Code Quality
   - [ ] **Strict Mode**: Code compiles with TypeScript strict mode enabled
   - [ ] **No `any` Types**: No use of `any` type; use proper types or `unknown` with type guards
   - [ ] **Type Safety**: All functions have proper return types
   - [ ] **DRY Principle**: No code duplication; reusable code extracted
   - [ ] **JSDoc Documentation**: All exported functions, classes, interfaces, types, and constants have comprehensive
         JSDoc comments
     - Include `@param` tags for all parameters
     - Include `@returns` or `@return` tags
     - Include `@template` tags for generics
     - Include `@example` blocks for complex functions
   - [ ] **Copyright Header**: Copyright header included in all files
   - [ ] **ESLint**: Code passes ESLint without errors or warnings
   - [ ] **Prettier**: Code is properly formatted with Prettier
   - [ ] **Lint Justification**: Any lint suppressions have explicit justification

   ### Angular 20 Patterns
   - [ ] **Standalone Components**: All components are standalone (no NgModules)
   - [ ] **Change Detection**: All components use `ChangeDetectionStrategy.OnPush`
   - [ ] **Signal Inputs**: Use `input()` instead of `@Input()` decorators
   - [ ] **Signal Outputs**: Use `output()` instead of `@Output()` decorators
   - [ ] **ViewChild/ViewChildren**: Use signal-based view queries (`viewChild`, `viewChildren`)
   - [ ] **Dependency Injection**: Use `inject()` function instead of constructor injection (unless required)
   - [ ] **Lifecycle Hooks**:
     - No subscription logic in constructor
     - Initialization in `ngOnInit`
     - View-related initialization in `ngAfterViewInit`
     - Cleanup in `ngOnDestroy`
   - [ ] **Computed Signals**: Use `computed()` for derived state
   - [ ] **Effects**: Use `effect()` only for side effects; never manipulate DOM in effects
   - [ ] **Control Flow**: Use new Angular control flow syntax (`@if`, `@for`, `@switch`) instead of `*ngIf`, `*ngFor`
   - [ ] **Track Functions**: All `@for` loops have track functions (`track item.id`)
   - [ ] **Async Pipe**: Observables use async pipe in templates (no manual subscriptions)
   - [ ] **Method Calls in Templates**: No method calls in templates (use computed signals or pipes)
   - [ ] **Self-Closing Tags**: Use self-closing tags when possible (`<br />`, `<img />`, `<input />`)
   - [ ] **Class/Style Bindings**: Prefer `[class.className]` and `[style.property]` over `ngClass`/`ngStyle`
   - [ ] **Reactive Forms**: Prefer reactive forms over template-driven forms
   - [ ] **Route Params**: Use `injectParams()` and `injectQueryParams()` from ngx-lift

   ### Clarity Design System
   - [ ] **Clarity Components**: Use Clarity Angular components (`clr-*`) over raw HTML
   - [ ] **No Hard-coded Colors**: Use Clarity SASS variables for all colors (no hex codes, rgb values)
   - [ ] **SASS Variables**: Use Clarity spacing, typography, and color variables
   - [ ] **Component Scoping**: Styles scoped to component using `:host`
   - [ ] **No Global Styles**: Avoid `::ng-deep` unless absolutely necessary
   - [ ] **Icons**: Use `@cds/core` icons (`<cds-icon>`) when appropriate
   - [ ] **Responsive Design**: Use Clarity grid system for responsive layouts
   - [ ] **Theme Support**: Support Clarity dark theme

   ### Accessibility
   - [ ] **ARIA Attributes**: Appropriate ARIA attributes included
   - [ ] **Keyboard Navigation**: All interactive elements are keyboard accessible
   - [ ] **Focus Management**: Focus managed appropriately (modals, dialogs, dynamic content)
   - [ ] **Semantic HTML**: Use semantic HTML elements where possible
   - [ ] **Labels**: All form controls have associated labels
   - [ ] **Alert Roles**: Alert components include `role="alert"`

   ### Testing
   - [ ] **Test Files**: Test files exist for all components/services (`*.spec.ts`)
   - [ ] **Vitest Framework**: Tests use Vitest (not Jasmine/Jest)
   - [ ] **Test Structure**: Tests follow AAA pattern (Arrange, Act, Assert)
   - [ ] **Test Imports**: Correct imports (`describe`, `it`, `expect`, `beforeEach`, `vi` from `vitest`)
   - [ ] **Signal Inputs Testing**: Use `fixture.componentRef.setInput()` for signal inputs
   - [ ] **Vitest Spies**: Use `vi.spyOn()` instead of `spyOn()`
   - [ ] **Test Selectors**: Use `getByRole` or `data-test-id` attributes (not CSS classes)
   - [ ] **Coverage**: Minimum 60% coverage; critical paths aim for 80%+
   - [ ] **E2E Tests**: E2E tests (Playwright) added where applicable
   - [ ] **Type Safety**: No `any` types in tests; use proper types or `unknown` with type guards

   ### RxJS Patterns
   - [ ] **Signals First**: Prefer Angular Signals over Observables for component state
   - [ ] **Observable Creation**: Use appropriate creation functions (`of`, `from`, `fromEvent`)
   - [ ] **Operators**: Use operators correctly (`map`, `filter`, `switchMap`, `catchError`, etc.)
   - [ ] **ngx-lift Operators**: Use ngx-lift operators when appropriate (`createAsyncState`, `switchMapWithAsyncState`,
         etc.)
   - [ ] **Error Handling**: Errors handled with `catchError` operator
   - [ ] **Subscription Management**: Use async pipe or `DestroyRef` for subscriptions
   - [ ] **No Manual Subscriptions**: Avoid manual subscriptions in components (use async pipe)
   - [ ] **Memory Leaks**: All subscriptions properly unsubscribed in `ngOnDestroy`

   ### Nx Workspace
   - [ ] **Project Structure**: Code follows Nx project structure conventions
   - [ ] **Module Boundaries**: Respects Nx project boundaries; no circular dependencies
   - [ ] **Path Mappings**: Use path mappings from `tsconfig.base.json`
   - [ ] **Dependency Rules**: Follows Nx dependency rules based on tags
   - [ ] **Code Organization**: Code organized by feature/domain

   ### State Management & Performance
   - [ ] **Signals for State**: Component state uses signals
   - [ ] **Computed Signals**: Derived state uses `computed()`
   - [ ] **OnPush Strategy**: All components use `ChangeDetectionStrategy.OnPush`
   - [ ] **Track Functions**: All `@for` loops have track functions
   - [ ] **Lazy Loading**: Non-critical components use `@defer`
   - [ ] **Minimize Change Detection**: Use signals and computed values to minimize change detection

   ### i18n (Internationalization)
   - [ ] **Transloco**: All user-visible text uses Transloco
   - [ ] **Label Case**: Labels use sentence case
   - [ ] **Title Case**: Titles use title case
   - [ ] **Translation Keys**: Translation keys follow naming conventions

   ### Error Handling
   - [ ] **Error Handling**: Proper error handling implemented
   - [ ] **Error Messages**: Meaningful error messages via Transloco keys
   - [ ] **Error Logging**: Errors logged appropriately (no sensitive information)
   - [ ] **Reactive Error Handling**: Async errors handled gracefully with `catchError` and error signals

4. **Run Automated Checks** (ONLY for changed files/projects)
   - Identify which projects contain the changed files
   - Run TypeScript compilation check: `npx nx run [project]:build` (only for affected projects)
   - Run ESLint: `npx nx lint [project]` (only for projects with changed files)
   - Check for Prettier formatting issues (only in changed files)
   - Review test coverage if available (only for changed test files)
   - **DO NOT** run checks on the entire workspace - only check what was changed

5. **Automatically Detect and Fix Issues** (ONLY in changed files)

   **CRITICAL**: After identifying issues **in the changed files**, **AUTOMATICALLY apply fixes** to the code. Do not
   just report issues - fix them directly.

   **IMPORTANT**: Only fix issues in files that are part of the current changes. Do NOT fix issues in unrelated files
   from the codebase.

   ### Automatic Fix Categories

   #### TypeScript & Code Quality Fixes
   - **Missing JSDoc**: Add comprehensive JSDoc comments to all exported functions, classes, interfaces, types, and
     constants
   - **Missing Copyright Header**: Add copyright header to files missing it
   - **Prettier Formatting**: Automatically format code with Prettier
   - **Type Safety**: Fix `any` types by replacing with proper types or `unknown` with type guards
   - **Return Types**: Add explicit return types to functions missing them

   #### Angular 20 Pattern Fixes
   - **@Input() → input()**: Replace `@Input()` decorators with `input()` signal inputs
   - **@Output() → output()**: Replace `@Output()` decorators with `output()` signal outputs
   - **@ViewChild/@ViewChildren → viewChild/viewChildren**: Replace with signal-based view queries
   - **Constructor Injection → inject()**: Replace constructor injection with `inject()` function
   - **Missing OnPush**: Add `ChangeDetectionStrategy.OnPush` to components missing it
   - **Old Control Flow → New Control Flow**: Replace `*ngIf` with `@if`, `*ngFor` with `@for`, etc.
   - **Missing Track Functions**: Add track functions to `@for` loops
   - **Manual Subscriptions → Async Pipe**: Replace manual subscriptions with async pipe in templates
   - **Method Calls in Templates**: Replace with computed signals or pipes
   - **Self-Closing Tags**: Convert tags to self-closing format where appropriate
   - **ngClass/ngStyle → Property Bindings**: Replace with `[class.className]` and `[style.property]`

   #### Clarity Design System Fixes
   - **Hard-coded Colors**: Replace hex codes and rgb values with Clarity SASS variables
   - **Raw HTML → Clarity Components**: Replace raw HTML with appropriate Clarity components
   - **Missing SASS Variables**: Replace hard-coded spacing/typography with Clarity variables
   - **Global Styles**: Remove or scope `::ng-deep` usage

   #### Testing Fixes
   - **Jasmine/Jest → Vitest**: Replace test framework imports and APIs
   - **spyOn() → vi.spyOn()**: Replace with Vitest spies
   - **Test Selectors**: Update to use `getByRole` or `data-test-id` attributes
   - **Signal Input Testing**: Update to use `fixture.componentRef.setInput()`

   #### RxJS Pattern Fixes
   - **Manual Subscriptions**: Replace with async pipe or `DestroyRef`
   - **Missing Error Handling**: Add `catchError` operators to observables
   - **Memory Leaks**: Add proper unsubscription in `ngOnDestroy`

   ### Fix Application Process
   1. **For each issue found in changed files**:
      - Verify the file is part of the current changes (staged/unstaged)
      - Read the file containing the issue
      - Identify the exact location (line numbers)
      - Apply the fix directly to the file
      - Ensure the fix follows the codebase standards
      - **DO NOT** fix issues in files that are not part of the current changes

   2. **Fix Order** (apply fixes in this order to avoid conflicts):
      - First: TypeScript compilation errors
      - Second: ESLint errors
      - Third: Angular pattern fixes (signals, OnPush, etc.)
      - Fourth: Clarity Design System fixes
      - Fifth: Testing fixes
      - Sixth: Code quality fixes (JSDoc, formatting, etc.)
      - Last: Performance optimizations

   3. **After applying fixes**:
      - Re-read the file to verify the fix was applied correctly
      - Check if the fix introduced any new issues
      - Ensure the file still compiles and passes linting

6. **Generate Review Report with Applied Fixes**

   Structure the review report as follows:

   ````markdown
   # Code Review Report

   ## Summary

   - **Files Reviewed**: [list of files]
   - **Overall Status**: ✅ Pass / ⚠️ Needs Attention / ❌ Fail
   - **Issues Found**: [count]
   - **Fixes Applied**: [count]
   - **Issues Remaining**: [count] (if any cannot be auto-fixed)

   ## Files Reviewed

   [List each file with its status and fix count]

   ## Fixes Applied

   ### [File Path]

   **Status**: ✅ Fixed / ⚠️ Partially Fixed / ❌ Needs Manual Review

   **Fixes Applied**:

   - [Fix description] (Line X)
   - [Fix description] (Line Y)

   **Before**:

   ```typescript
   [original code]
   ```
   ````

   **After**:

   ```typescript
   [fixed code]
   ```

   **Rule Reference**: [specific rule file and section]

   ### Issues That Could Not Be Auto-Fixed

   [List issues that require manual intervention with explanations]

   ## Checklist Results

   ### TypeScript & Code Quality
   - [ ] Strict mode compliance
   - [ ] No `any` types
   - [ ] JSDoc documentation
   - [ ] ESLint passes
   - [ ] Prettier formatted

   ### Angular 20 Patterns
   - [ ] Standalone components
   - [ ] OnPush strategy
   - [ ] Signal inputs/outputs
   - [ ] New control flow syntax
   - [ ] Track functions in @for

   ### Clarity Design System
   - [ ] Clarity components used
   - [ ] No hard-coded colors
   - [ ] SASS variables used

   ### Testing
   - [ ] Test files exist
   - [ ] Vitest framework
   - [ ] Coverage requirements met

   ### Accessibility
   - [ ] ARIA attributes
   - [ ] Keyboard navigation
   - [ ] Labels for form controls

   ### Nx Workspace
   - [ ] Module boundaries respected
   - [ ] No circular dependencies

   ## Recommendations

   [Specific recommendations for improvement]

   ## Definition of Done Status
   - [ ] UI uses `clr-*` components and Clarity variables only
   - [ ] Accessibility checked
   - [ ] Transloco keys implemented
   - [ ] Unit tests written with 60%+ coverage
   - [ ] E2E hooks added where applicable
   - [ ] Nx boundaries respected
   - [ ] Code formatted with Prettier; ESLint clean; TypeScript compiles
   - [ ] Copyright header included
   - [ ] JSDoc comments added for all exports

   ```

   ```

## Review Guidelines

### Priority Levels

1. **Critical Issues** (Must Fix):
   - TypeScript compilation errors
   - ESLint errors
   - Missing `ChangeDetectionStrategy.OnPush`
   - Use of `any` type
   - Missing JSDoc for exported items
   - Hard-coded colors
   - Missing accessibility attributes
   - Circular dependencies
   - Memory leaks (unsubscribed subscriptions)

2. **Warnings** (Should Fix):
   - ESLint warnings
   - Use of old Angular patterns (`@Input()` instead of `input()`)
   - Missing track functions in `@for`
   - Method calls in templates
   - Missing test coverage
   - Use of `ngClass`/`ngStyle` instead of property bindings

3. **Suggestions** (Nice to Have):
   - Code style improvements
   - Performance optimizations
   - Additional test cases
   - Documentation improvements

### Code Examples

When pointing out issues, provide:

- **Current Code**: Show the problematic code with file path and line numbers
- **Issue**: Explain what's wrong
- **Rule Reference**: Reference the specific rule from `.cursor/rules/`
- **Correct Code**: Show the corrected version following the standards

Example:

````markdown
### Issue: Using @Input() instead of signal input

**File**: `libs/clr-lift/src/lib/components/example.component.ts:15`

**Current Code**:

```typescript
@Input() name?: string;
```

**Issue**: Should use signal input instead of `@Input()` decorator per Angular 20 guidelines.

**Rule Reference**: `.cursor/rules/angular.mdc` - Signal-Based Development

**Correct Code**:

```typescript
name = input<string>();
```
````

## Requirements

- **MUST** review **ONLY changed/submitted files** - NOT the entire codebase
- **MUST** use `git status` and `git diff` to identify what has actually changed
- **MUST** review against all rules in `.cursor/rules/` directory (for changed files only)
- **MUST** check TypeScript compilation (only for affected projects)
- **MUST** check ESLint compliance (only for changed files)
- **MUST** verify Definition of Done checklist (for changed files only)
- **MUST automatically apply fixes** for all issues that can be auto-fixed (in changed files only)
- **MUST** provide specific file paths and line numbers for issues
- **MUST** reference specific rules when pointing out issues
- **MUST** show before/after code for all applied fixes
- **MUST** provide a summary of all fixes applied
- **MUST** indicate which issues could not be auto-fixed and why
- **MUST NOT** review or fix files that are not part of the current changes
- **SHOULD** run automated checks (TypeScript, ESLint) only for affected projects
- **SHOULD** check test coverage if available (only for changed test files)
- **SHOULD** review related test files for components/services (only if they are also changed)
- **SHOULD** apply fixes in the correct order to avoid conflicts
- **SHOULD** verify fixes don't introduce new issues

## Technology Stack Reference

When reviewing, ensure compliance with:

- **Angular**: 20.3.0
- **Nx**: 22.0.0
- **Clarity**: @clr/angular 17.12.1
- **Vitest**: 3.0.0
- **Playwright**: 1.36.0
- **TypeScript**: 5.9.2 (strict mode)
- **ESLint**: 9.8.0

## Rule Files Reference

Always reference these rule files when reviewing:

- `.cursor/rules/general.mdc` - Core standards and Definition of Done
- `.cursor/rules/angular.mdc` - Angular 20 patterns
- `.cursor/rules/clarity.mdc` - Clarity Design System guidelines
- `.cursor/rules/testing.mdc` - Testing standards
- `.cursor/rules/rxjs.mdc` - RxJS patterns
- `.cursor/rules/nx.mdc` - Nx workspace guidelines

## Example Review Workflow

For a component file review (ONLY changed files):

1. **Identify changed files** using `git status` and `git diff`
2. **Read ONLY the changed component file, template, styles, and spec file** (if they are part of changes)
3. **Check all checklist items systematically** (for changed files only)
4. **Run TypeScript and ESLint checks** (only for affected projects)
5. **Automatically apply fixes** (only in changed files):
   - Replace `@Input() name?: string;` with `name = input<string>();`
   - Add `ChangeDetectionStrategy.OnPush` if missing
   - Replace `*ngIf` with `@if` in templates
   - Add track functions to `@for` loops
   - Replace hard-coded colors with Clarity variables
   - Add JSDoc comments to exported items
   - Format code with Prettier
6. **Generate comprehensive report** showing:
   - All issues found
   - All fixes applied (with before/after code)
   - Issues that require manual review
7. **Provide summary** for user to review before committing

## Automatic Fix Examples

### Example 1: Signal Input Fix

**File**: `libs/clr-lift/src/lib/components/example.component.ts:15`

**Before**:

```typescript
@Input() name?: string;
```

**After** (automatically applied):

```typescript
name = input<string>();
```

**Rule Reference**: `.cursor/rules/angular.mdc` - Signal-Based Development

### Example 2: OnPush Strategy Fix

**File**: `libs/clr-lift/src/lib/components/example.component.ts:8`

**Before**:

```typescript
@Component({
  selector: 'app-example',
  standalone: true,
  // Missing changeDetection
})
```

**After** (automatically applied):

```typescript
@Component({
  selector: 'app-example',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
```

**Rule Reference**: `.cursor/rules/angular.mdc` - Component Architecture

### Example 3: Hard-coded Color Fix

**File**: `libs/clr-lift/src/lib/components/example.component.scss:10`

**Before**:

```scss
color: #333;
```

**After** (automatically applied):

```scss
color: $clr-color-neutral-700;
```

**Rule Reference**: `.cursor/rules/clarity.mdc` - Styling Guidelines

## Important Notes

- **All fixes are applied automatically** - the user will review the changes before committing
- **Fixes are applied in a safe order** to avoid conflicts
- **Each fix is documented** with before/after code and rule reference
- **Issues that cannot be auto-fixed** are clearly marked with explanations
- **The user manually reviews** all applied fixes before committing

The review should be thorough, specific, and actionable, automatically fixing issues while providing clear documentation
of all changes made.
