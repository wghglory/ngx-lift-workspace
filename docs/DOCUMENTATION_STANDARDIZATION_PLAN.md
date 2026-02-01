# Documentation Standardization Implementation Plan

This document outlines the plan to standardize all documentation pages in the demo app according to the
[Documentation Standards](./DOCUMENTATION_STANDARDS.md).

## Current State Analysis

### Identified Inconsistencies

1. **Title Format**
   - ❌ Mixed: `title="Name"` vs `[title]="'name'"`
   - ✅ Standard: `[title]="'ExactExportName'"`

2. **Spacing**
   - ❌ Mixed: `space-y-3`, `space-y-4`, `space-y-6`, `space-y-9`
   - ✅ Standard: `space-y-9` (container), `space-y-4` (sections), `space-y-3` (articles)

3. **Section Structure**
   - ❌ Inconsistent: Some have "Overview", "API Reference", "Basic Usage", "Examples"
   - ❌ Others have just "Usage" or no clear structure
   - ✅ Standard: Overview → Basic Usage → Examples → API Reference → Advanced Usage

4. **Import Statements**
   - ❌ Some pages show imports, others don't
   - ❌ Inconsistent placement (sometimes in Overview, sometimes missing, sometimes in dedicated section)
   - ✅ Standard: Import statements included at the top of each code example block

5. **API Reference**
   - ❌ Some have detailed API docs, others have none
   - ❌ Inconsistent format
   - ✅ Standard: Complete API Reference section with inputs/outputs/signatures

6. **Code Examples**
   - ❌ Inconsistent naming (`code`, `exampleCode`, `usageCode`, etc.)
   - ❌ Missing `lang` attributes
   - ✅ Standard: Descriptive names, proper `lang` attributes

7. **Heading Hierarchy**
   - ❌ Inconsistent use of H2, H3, H4
   - ✅ Standard: H2 for sections, H3 for examples, H4 for API subsections

## Implementation Strategy

### Phase 1: Create Standard Template Components (Optional Enhancement)

**Goal**: Create reusable template snippets or a generator to ensure consistency.

**Tasks**:

- [ ] Create template snippets for common patterns
- [ ] Document template usage in standards guide

**Priority**: Low (can be done later)

### Phase 2: Standardize ngx-lift Pages

**Goal**: Standardize all ngx-lift documentation pages.

#### 2.1 Operators (6 pages)

- [ ] `create-async-state` - ✅ Already well-structured, needs minor adjustments
- [ ] `combine-latest-eager`
- [ ] `distinct-on-change`
- [ ] `logger`
- [ ] `poll`
- [ ] `switch-map-with-async-state`

**Standardization Tasks per Page**:

1. Fix title format
2. Remove Import section (if exists)
3. Add imports to top of all code examples
4. Move API Reference to end (after Examples)
5. Ensure consistent spacing
6. Standardize code example names
7. Ensure proper heading hierarchy

#### 2.2 Pipes (5 pages)

- [ ] `array-join-pipe` - ✅ Already well-structured, needs minor adjustments
- [ ] `byte-converter-pipe`
- [ ] `is-https-pipe`
- [ ] `mask-pipe`
- [ ] `range-pipe`

#### 2.3 Signals (6 pages)

- [ ] `combine-from`
- [ ] `computed-async`
- [ ] `create-trigger`
- [ ] `inject-params` - Needs structure improvements
- [ ] `inject-query-params`
- [ ] `merge-from`

#### 2.4 Utilities (6 pages)

- [ ] `difference-in-days`
- [ ] `idle-detection-demo`
- [ ] `is-empty`
- [ ] `is-equal`
- [ ] `pick-by`
- [ ] `url`

#### 2.5 Validators (5 pages)

- [ ] `date-range-validator`
- [ ] `if-validator`
- [ ] `intersection-validator`
- [ ] `unique-validator`
- [ ] `url-validator` - Needs structure improvements

**Total ngx-lift Pages**: 28 pages

### Phase 3: Standardize clr-lift Pages

**Goal**: Standardize all clr-lift documentation pages.

#### 3.1 Components (13 pages)

- [ ] `alert-demo` - Needs structure improvements
- [ ] `certificate-demo`
- [ ] `clr-datagrid-util`
- [ ] `dg-state`
- [ ] `file-reader-demo` - Needs structure improvements
- [ ] `key-value-inputs-demo`
- [ ] `multi-alerts-demo`
- [ ] `spinner-demo` - Needs structure improvements
- [ ] `status-indicator-demo`
- [ ] `timeline-wizard-demo`
- [ ] `toast-demo`
- [ ] `tooltip-demo`

**Total clr-lift Pages**: 13 pages

### Phase 4: Verification and Testing

**Goal**: Ensure all pages meet standards and work correctly.

**Tasks**:

- [ ] Visual review of all pages
- [ ] Verify all code examples are correct
- [ ] Check all imports are accurate
- [ ] Test all live demos
- [ ] Verify responsive design
- [ ] Check accessibility

## Implementation Order

### Priority 1: High-Traffic Pages

1. `create-async-state` (ngx-lift operator)
2. `alert-demo` (clr-lift component)
3. `file-reader-demo` (clr-lift component)
4. `inject-params` (ngx-lift signal)

### Priority 2: Core Functionality

5. All other operators
6. All pipes
7. All signals
8. All validators

### Priority 3: Components

9. All clr-lift components

### Priority 4: Utilities

10. All utilities

## Standardization Checklist per Page

For each page, complete these tasks:

### HTML Template

- [ ] Title uses `[title]="'ExactExportName'"`
- [ ] Container has `customClass="space-y-9"`
- [ ] All sections have `class="space-y-4"`
- [ ] All articles have `class="space-y-3"`
- [ ] Overview section exists with clear description
- [ ] No Import section (removed)
- [ ] Basic Usage section exists
- [ ] Examples section exists with multiple examples
- [ ] API Reference section exists at the end (after Examples)
- [ ] Advanced Usage section exists (if applicable)
- [ ] All headings follow hierarchy (H2 → H3 → H4)
- [ ] All lists use `class="list-disc space-y-1 ml-6"`
- [ ] All code blocks have `lang` attribute

### TypeScript Component

- [ ] Import `highlight` utility
- [ ] No `importCode` property (removed)
- [ ] `basicUsageCode` property exists with imports at top
- [ ] All code examples include import statements at the top
- [ ] Code example properties have descriptive names
- [ ] All code examples use `highlight()` function
- [ ] Code examples are complete and runnable

### Content Quality

- [ ] Overview clearly explains what it does
- [ ] Overview explains when to use it
- [ ] All code examples include import statements at the top
- [ ] API Reference is complete and accurate (placed at end)
- [ ] Examples are practical and relatable
- [ ] Code examples have helpful comments
- [ ] All code examples are syntactically correct

## Example: Before and After

### Before (Inconsistent)

```html
<cll-page-container title="Alert" customClass="space-y-9">
  <section class="space-y-6">
    <p>Alerts are banners...</p>
    <h2>Usage</h2>
    <!-- No import section -->
    <!-- No API reference -->
    <!-- Examples mixed with usage -->
  </section>
</cll-page-container>
```

### After (Standardized)

```html
<cll-page-container [title]="'Alert'" customClass="space-y-9">
  <!-- Overview -->
  <section class="space-y-4">
    <h2>Overview</h2>
    <p>
      Alerts are banners that draw the user's attention to important messages. Use alerts to provide critical
      information that requires immediate user attention.
    </p>
  </section>

  <!-- Basic Usage -->
  <section class="space-y-4">
    <h2>Basic Usage</h2>
    <app-code-block [code]="basicUsageCode" lang="html" />
  </section>

  <!-- Examples -->
  <section class="space-y-4">
    <h2>Examples</h2>
    <article class="space-y-3">
      <h3>Standard Alerts</h3>
      <!-- Example content -->
    </article>
  </section>

  <!-- API Reference -->
  <section class="space-y-4">
    <h2>API Reference</h2>
    <!-- Complete API docs -->
  </section>
</cll-page-container>
```

**Note**: Import statements are included at the top of each code example block, not in a separate section.

## Timeline Estimate

### Phase 1: Template Components (Optional)

- **Duration**: 1-2 days
- **Priority**: Low

### Phase 2: ngx-lift Pages (28 pages)

- **Duration**: 2-3 weeks (1-2 pages per day)
- **Priority**: High

### Phase 3: clr-lift Pages (13 pages)

- **Duration**: 1-2 weeks (1-2 pages per day)
- **Priority**: High

### Phase 4: Verification

- **Duration**: 3-5 days
- **Priority**: High

**Total Estimated Time**: 4-6 weeks

## Success Criteria

✅ All pages follow the standard structure ✅ All pages have consistent spacing ✅ All code examples include import
statements at the top ✅ All pages have complete API references (at the end) ✅ All code examples are correct and
runnable ✅ All pages are visually consistent ✅ All pages are accessible ✅ All pages work on mobile devices

## Maintenance

After standardization:

1. **New Pages**: Must follow standards from day one
2. **Updates**: When updating existing pages, maintain standards
3. **Review**: Periodic review to ensure standards are maintained
4. **Documentation**: Keep standards document updated

## Resources

- [Documentation Standards](./DOCUMENTATION_STANDARDS.md) - Complete standards guide
- [Code Block Pattern Rules](../.cursor/rules/code-block-pattern.mdc) - Code block guidelines
- [Angular Guidelines](../.cursor/rules/angular.mdc) - Angular-specific guidelines

## Notes

- Start with high-priority pages to establish patterns
- Use find-and-replace where possible for common patterns
- Test each page after standardization
- Get feedback from users on improved consistency
