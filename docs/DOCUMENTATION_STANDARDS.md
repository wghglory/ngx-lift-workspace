# Documentation Standards for Demo App

Public library behavior is designed through the [component development workflow](design/component-development.md).
Create or update its spec before implementation using the [spec template](design/templates/component-design-spec.md).
These standards define demo-page presentation; the workflow defines API review and feature acceptance.

This document defines the standards for all documentation pages in the demo app to ensure consistency, clarity, and ease
of use for public users.

## Table of Contents

1. [Documentation Pedagogy & Progressive Disclosure](#documentation-pedagogy--progressive-disclosure)
2. [Page Structure & The 5-Stage Blueprint](#page-structure--the-5-stage-blueprint)
3. [Prohibited Documentation Anti-Patterns](#prohibited-documentation-anti-patterns)
4. [Spacing and Layout](#spacing-and-layout)
5. [Title Format](#title-format)
6. [Required Sections](#required-sections)
7. [Code Examples](#code-examples)
8. [Import Statements in Code Examples](#import-statements-in-code-examples)
9. [API Reference Format](#api-reference-format)
10. [Component vs Utility/Operator/Pipe/Validator](#component-vs-utilityoperatorpipevalidator)
11. [Examples and Demos](#examples-and-demos)
12. [Migration Checklist](#migration-checklist)

---

## Documentation Pedagogy & Progressive Disclosure

Following the **Diátaxis documentation framework**, documentation is curated according to developer intent:

- **Tutorials (Learning Journey)**: Minimal friction onboarding ("3-Minute Quick Start").
- **How-To Guides (Problem-Oriented Recipes)**: Concrete enterprise patterns and recovery solutions.
- **Concepts (Mental Models)**: Visualized lifecycles, Stale-While-Revalidate timing, and caching architecture.
- **Reference (Technical Lookup)**: Complete API signatures, input/output tables, and signal state matrices.

Always respect the developer's cognitive load: developers must build an accurate mental model and run working code
before being confronted with technical edge-case matrices or internal configuration DSLs.

---

## Page Structure & The 5-Stage Blueprint

All documentation and demo pages MUST follow the **5-Stage Progressive Disclosure Blueprint**:

1. **Stage 1: The 30-Second Elevator Pitch**
   - 1–2 plain-English sentences answering: _What is it?_ and _What specific friction or boilerplate does it eliminate?_
   - Strictly no warning banners, naming lectures, or comparative technical matrices in this fold.

2. **Stage 2: The 3-Minute Quick Start (Live Preview First)**
   - Minimal runnable snippet (<15 lines) accompanied immediately by its interactive preview.
   - For UI components, the interactive control appears directly here so the user immediately sees what it looks like.

3. **Stage 3: The Core Mental Model**
   - Plain-English explanation and visual timeline (e.g., Stale-While-Revalidate, Reactive Bridge, Concurrency).
   - Clarify the primary metaphor and dispel common developer misconceptions.

4. **Stage 4: Practical Progressive Recipes**
   - Sequenced or tabbed examples spanning Beginner (parameters), Intermediate (error recovery), and Advanced
     (caching/coordination).

5. **Stage 5: Deep Technical Reference**
   - API tables (Inputs, Outputs, Methods, Options).
   - Complete boolean state matrices (`status()`, `isInitialLoading()`, `isRefreshing()`, `isLoading()`, etc.).
   - Architectural guides (Key factories, domain ownership, and tool decision trees).

```html
<cll-page-container [title]="'ComponentName'">
  <!-- Stage 1: Overview & Elevator Pitch -->
  <p>
    Clear, concise description of what the component/utility/operator/pipe/validator does, when to use it, and why it's
    useful.
  </p>

  <!-- Stage 2: Quick Start & Examples -->
  <section cds-layout="vertical gap:md">
    <h2>Examples</h2>

    <article cds-layout="vertical gap:sm">
      <h3>Example 1: Title</h3>
      <p>Description of what this example demonstrates:</p>
      <app-demo-playground ... />
    </article>

    <article cds-layout="vertical gap:sm">
      <h3>Example 2: Title</h3>
      <p>Description of what this example demonstrates:</p>
      <app-code-block [code]="example1Code" lang="typescript" />
    </article>
  </section>

  <!-- Stage 5: API Reference & Architecture Section -->
  <section cds-layout="vertical gap:md">
    <h2>API Reference</h2>
    <!-- API details, tables, matrices here -->
  </section>
</cll-page-container>
```

---

## Prohibited Documentation Anti-Patterns

1. **No Premature Architectural Banners**:
   - Never place naming convention alerts, domain key architecture callouts, or dense comparative matrices at the very
     top of a page before the developer has seen what the feature does and how to use it.
   - Domain key patterns and naming rules belong in dedicated architecture sections or guides.

2. **No Inverted Example Flow**:
   - Do not bury working interactive component previews beneath 4–5 static code blocks.
   - For complex UI components (e.g. `dgState`, `cll-timeline-wizard`), place the interactive playground in the top
     fold.

3. **No "Encyclopedia Trap" (Reference Before Concept)**:
   - Do not lead with 5×7 boolean signal matrices (`status()`, `hasValue()`, `isInitialLoading()`, etc.) before
     explaining what those signals mean. Put the reference matrix in Stage 5 at the bottom.

---

## Spacing and Layout

Use Clarity `cds-layout` attributes and design tokens. Tailwind was removed; do not add Tailwind utility classes to new
examples. Keep the page container's built-in spacing and use native list indentation. `app-demo-playground` can replace
an article when an interactive example needs controls, preview, and code tabs.

Clarity tab hosts must use block layout so vertical margins take effect. Shared demo styles separate tab navigation from
preceding tables/prose and separate active panels from navigation. Keep this policy in the shared stylesheet; do not
patch individual pages with blank elements or repeated margins. Verify the rendered distance, including narrow screens
and translated tab labels.

### Standard Clarity Layout Attributes

- **Page Container**: the built-in page container spacing (spacing between major sections)
- **Sections**: `cds-layout="vertical gap:md"` (spacing between elements within a section)
- **Articles**: `cds-layout="vertical gap:sm"` (spacing between elements within an example/article)
- **Lists**: `cds-layout="vertical gap:xs"` (for unordered lists)

### Section Hierarchy

- **H1**: Automatically generated by `cll-page-container` (page title)
- **H2**: Main sections (Examples, API Reference)
- **H3**: Subsections within Examples (e.g., "Example 1: Title", "Example 2: Title", etc.)
- **H4**: Sub-subsections (e.g., within API Reference for method signatures)
- **Overview**: Simple paragraph (no heading) at the top of the page

---

## Title Format

### Standard Format

Use the exact name of the component/utility/operator/pipe/validator as it appears in the library:

```html
<!-- For components -->
<cll-page-container [title]="'Alert'">
  <!-- For operators -->
  <cll-page-container [title]="'createAsyncState'">
    <!-- For pipes -->
    <cll-page-container [title]="'ArrayJoinPipe'">
      <!-- For validators -->
      <cll-page-container [title]="'urlValidator'">
        <!-- For utilities -->
        <cll-page-container
          [title]="'injectParams'"
        ></cll-page-container></cll-page-container></cll-page-container></cll-page-container
></cll-page-container>
```

**Rules:**

- Use signal input syntax: `[title]="'Name'"`
- Match the exact export name from the library
- Use PascalCase for classes/components, camelCase for functions/operators
- No extra formatting (no "Component" suffix unless it's part of the actual name)

---

## Required Sections

### 1. Overview (Required)

**Purpose**: Explain what the component/utility does, when to use it, and why it's useful.

**Structure**:

```html
<!-- Overview -->
<p>Clear description (2-4 sentences) explaining: - What it does - When to use it - Key benefits</p>
<!-- Additional paragraphs if needed -->
```

### 2. Examples (Required)

**Purpose**: Show various use cases and patterns, starting with the most basic/common use case.

**Structure**:

```html
<section cds-layout="vertical gap:md">
  <h2>Examples</h2>

  <article cds-layout="vertical gap:sm">
    <h3>Example 1: Title</h3>
    <p>Description of what this example demonstrates:</p>
    <app-code-block [code]="basicUsageCode" lang="typescript" />
    <!-- Optional: Live demo -->
  </article>

  <article cds-layout="vertical gap:sm">
    <h3>Example 2: Title</h3>
    <p>Description of what this example demonstrates:</p>
    <app-code-block [code]="exampleCode" lang="typescript" />
    <!-- Live demo if applicable -->
  </article>

  <!-- Additional examples -->
  <article cds-layout="vertical gap:sm">
    <h3>Example 3: Title</h3>
    <p>Description of what this example demonstrates:</p>
    <app-code-block [code]="advancedCode" lang="typescript" />
  </article>
</section>
```

**Note**: Import statements should be included at the top of each code example block. Examples should be numbered
sequentially (Example 1, Example 2, etc.), with the first example typically showing the simplest, most common use case.

### 4. API Reference (Required for Components, Optional for Utilities)

**Purpose**: Document all inputs, outputs, methods, and configuration options.

**Structure for Components**:

```html
<section cds-layout="vertical gap:md">
  <h2>API Reference</h2>
  <div cds-layout="vertical gap:sm">
    <h3>ComponentName</h3>
    <p>Brief description of the component.</p>

    <h4>Inputs</h4>
    <ul cds-layout="vertical gap:xs">
      <li><code>inputName</code>: <em>(Type)</em> Description of the input. Defaults to <code>defaultValue</code>.</li>
    </ul>

    <h4>Outputs</h4>
    <ul cds-layout="vertical gap:xs">
      <li><code>outputName</code>: <em>(Type)</em> Description of when this output is emitted.</li>
    </ul>
  </div>
</section>
```

**Structure for Functions/Operators**:

```html
<section cds-layout="vertical gap:md">
  <h2>API Reference</h2>
  <div cds-layout="vertical gap:sm">
    <h3>functionName</h3>
    <p>Brief description of the function.</p>

    <h4>Signature</h4>
    <div cds-layout="vertical gap:xs">
      <p><code>functionName&lt;T&gt;(param1: Type1, param2?: Type2): ReturnType</code></p>
      <p><strong>Parameters:</strong></p>
      <ul cds-layout="vertical gap:xs">
        <li><code>param1</code>: <em>(Required)</em> Description.</li>
        <li><code>param2</code>: <em>(Optional)</em> Description. Defaults to <code>defaultValue</code>.</li>
      </ul>
      <p><strong>Returns:</strong> Description of return value.</p>
    </div>
  </div>
</section>
```

---

## Code Examples

### Code Block Format

Always use the `highlight()` utility function in TypeScript:

```typescript
import {highlight} from '../../../../shared/utils/highlight.util';

export class ComponentName {
  basicUsageCode = highlight(`
import { ComponentName } from 'library-name';

// Code example here
// Use proper indentation
// Include complete, runnable examples
// Import statements should be at the top
  `);
}
```

**Important**: All code examples MUST include import statements at the top of the code block.

### Code Block Language Tags

Always specify the `lang` attribute:

- `lang="typescript"` - For TypeScript code
- `lang="html"` - For HTML templates
- `lang="scss"` - For styles (rarely needed)

### Code Example Best Practices

1. **Import Statements**: **ALWAYS** include import statements at the top of each code block
2. **Complete Examples**: Include full, runnable code (imports, component decorator, etc.)
3. **Real-World Scenarios**: Use practical, relatable examples
4. **Comments**: Add helpful comments explaining key parts
5. **Output Comments**: Show expected output when relevant:

   ```typescript
   // Output: "1,2,3,4"
   ```

6. **Preview parity**: The live preview must demonstrate the inputs, actions, data and state transitions shown in its
   code. A callout explaining an interactive example cannot replace that example. When illustrating component/service
   ownership, use the actual owning component/service in the preview. Show loading, refresh and error behavior
   consistently. Code and preview may use translations and a simulated transport, but must describe the same user
   workflow. Use two spaces per indentation level in the page source and highlighted examples. Run
   `pnpm run format:examples`; tooling checks enforce this for embedded code. Format the contents of code strings
   explicitly; formatting the surrounding TypeScript does not format template-literal snippets. Expand multi-statement
   methods and query definition objects, and keep excerpt closing braces aligned with their declarations. Present UI
   markup in an HTML example or a component template; do not represent it with commented-out HTML. Check every tab, not
   only the initially selected panel.
7. **Action labels**: Use short, translated action names such as "Update name" or "Refresh". Keep method paths,
   signatures and implementation explanations in prose or code. Do not place API calls in button labels or use CSS
   truncation to hide them. Check each supported language and narrow screens.
8. **Service naming and spacing**: Application services use the `Service` suffix. Name injected service fields after the
   full class name in camelCase (`teamService = inject(TeamService)`). Separate the injection group from state and query
   declarations with one blank line. Choose `providedIn: 'root'` for application-wide services; provide feature or page
   services at their owner when their state should have that lifetime. Apply these conventions to the live
   implementation and displayed examples.

Use domain service names such as `TeamService`, `DatabaseService` and `ProjectService` in examples. Keys and tags should
also describe the domain (`['teams', scope, 'members']`); omit page-specific demo prefixes.

Changes to shared demo layout require a route-wide browser scan. Pair structural scans (missing previews, inputs and
button labels) with behavior checks for changed examples; scans alone cannot prove semantic equivalence.

### Code Block Naming Convention

Use descriptive names:

- `basicUsageCode` - Basic usage example
- `example1Code`, `example2Code` - Specific examples
- `advancedCode` - Advanced usage
- `templateCode` - Template-specific code
- `tsCode` - TypeScript code
- `htmlCode` - HTML code

---

## Import Statements in Code Examples

### Standard Import Format

**All code examples MUST include import statements at the top of the code block.**

```typescript
basicUsageCode = highlight(`
import { ComponentName } from 'library-name';

@Component({
  // component code
})
export class ExampleComponent {
  // implementation
}
`);
```

### Multiple Imports

If multiple items are needed, include all imports at the top:

```typescript
exampleCode = highlight(`
import { Component1, Component2, Utility1 } from 'library-name';
import { OtherModule } from 'other-library';

// rest of code
`);
```

### Import with Module

If importing from a module:

```typescript
exampleCode = highlight(`
import { ModuleName } from 'library-name';

// rest of code
`);
```

### HTML Template Examples

For HTML template examples, include the import in the TypeScript component code:

```typescript
templateCode = highlight(`
import { ComponentName } from 'library-name';

@Component({
  imports: [ComponentName],
  template: \`
    <component-name />
  \`
})
export class ExampleComponent { }
`);
```

---

## API Reference Format

### For Components

```html
<section cds-layout="vertical gap:md">
  <h2>API Reference</h2>
  <div cds-layout="vertical gap:sm">
    <h3>ComponentName</h3>
    <p>Brief description of what the component does.</p>

    <h4>Inputs</h4>
    <ul cds-layout="vertical gap:xs">
      <li><code>inputName</code>: <em>(Type)</em> Description. Defaults to <code>defaultValue</code>.</li>
    </ul>

    <h4>Outputs</h4>
    <ul cds-layout="vertical gap:xs">
      <li><code>outputName</code>: <em>(Type)</em> Description of when emitted.</li>
    </ul>

    <h4>Methods</h4>
    <ul cds-layout="vertical gap:xs">
      <li><code>methodName(param: Type): ReturnType</code> - Description.</li>
    </ul>
  </div>
</section>
```

### For Functions/Operators

```html
<section cds-layout="vertical gap:md">
  <h2>API Reference</h2>
  <div cds-layout="vertical gap:sm">
    <h3>functionName</h3>
    <p>Brief description of the function.</p>

    <h4>Signature</h4>
    <div cds-layout="vertical gap:xs">
      <p>
        <code>functionName&lt;T, E&gt;(param1: Type1, param2?: Type2): ReturnType</code>
      </p>
      <p><strong>Parameters:</strong></p>
      <ul cds-layout="vertical gap:xs">
        <li><code>param1</code>: <em>(Required)</em> Description.</li>
        <li><code>param2</code>: <em>(Optional)</em> Description. Defaults to <code>defaultValue</code>.</li>
      </ul>
      <p><strong>Returns:</strong> Description of return value.</p>
    </div>
  </div>
</section>
```

### For Pipes

```html
<section cds-layout="vertical gap:md">
  <h2>API Reference</h2>
  <div cds-layout="vertical gap:sm">
    <h3>PipeName</h3>
    <p>Angular pipe that does X.</p>

    <h4>Transform Method</h4>
    <div cds-layout="vertical gap:xs">
      <p><strong>Signature:</strong></p>
      <p><code>transform(value: Type, param?: ParamType): ReturnType</code></p>
      <p><strong>Parameters:</strong></p>
      <ul cds-layout="vertical gap:xs">
        <li><code>value</code>: Description.</li>
        <li><code>param</code>: <em>(Optional)</em> Description. Defaults to <code>defaultValue</code>.</li>
      </ul>
      <p><strong>Returns:</strong> Description.</p>
    </div>
  </div>
</section>
```

---

## Component vs Utility/Operator/Pipe/Validator

### Components (clr-lift)

**Structure**:

1. Overview - What the component does
2. Examples - Various use cases (with imports in code), numbered sequentially (Example 1, Example 2, etc.)
3. API Reference - Inputs, Outputs, Methods

**Focus**: Visual components, inputs/outputs, styling options, content projection.

### Utilities (ngx-lift)

**Structure**:

1. Overview - What the utility does
2. Examples - Various use cases (with imports in code), numbered sequentially (Example 1, Example 2, etc.)
3. API Reference - Function signature, parameters, return type

**Focus**: Function signatures, parameters, return types, use cases.

### Operators (ngx-lift)

**Structure**:

1. Overview - What the operator does, when to use it
2. Examples - Various scenarios (with imports in code), numbered sequentially (Example 1, Example 2, etc.)
3. API Reference - Operator signature, parameters

**Focus**: RxJS integration, observable chains, error handling.

### Pipes (ngx-lift)

**Structure**:

1. Overview - What the pipe does
2. Examples - Various use cases (with imports in code), numbered sequentially (Example 1, Example 2, etc.)
3. API Reference - Transform method signature

**Focus**: Template usage, transform method, parameters.

### Validators (ngx-lift)

**Structure**:

1. Overview - What the validator does, when to use it
2. Examples - Various validation scenarios (with imports in code), numbered sequentially (Example 1, Example 2, etc.)
3. API Reference - Validator function signature

**Focus**: Form integration, validation rules, error messages.

---

## Examples and Demos

### Live Demos

When applicable, include live, interactive demos:

```html
<article cds-layout="vertical gap:sm">
  <h3>Example Title</h3>
  <p>Description:</p>
  <!-- Live demo component -->
  <app-live-demo />
  <app-code-block [code]="exampleCode" lang="typescript" />
</article>
```

### Code-Only Examples

For utilities, operators, and validators, code examples are usually sufficient:

```html
<article cds-layout="vertical gap:sm">
  <h3>Example Title</h3>
  <p>Description:</p>
  <app-code-block [code]="exampleCode" lang="typescript" />
</article>
```

### Callouts

Use `<cll-callout>` for important notes:

```html
<cll-callout>
  <p>Important note or warning about usage.</p>
</cll-callout>
```

---

## Migration Checklist

When standardizing an existing page:

- [ ] **Title**: Use signal input syntax `[title]="'Name'"`
- [ ] **Pedagogy**: Follow the 5-Stage Progressive Disclosure Blueprint (Elevator pitch -> Quick Start -> Mental Model
      -> Recipes -> Reference)
- [ ] **No Premature Banners**: No naming convention or domain architecture callout banners before the overview and
      basic usage
- [ ] **Container**: Use the built-in page container spacing
- [ ] **Sections**: All sections use `cds-layout="vertical gap:md"`
- [ ] **Articles**: All articles use `cds-layout="vertical gap:sm"`
- [ ] **Overview**: Clear, concise description (2-4 sentences)
- [ ] **Examples**: Section with multiple examples, numbered sequentially (Example 1, Example 2, etc.)
- [ ] **API Reference**: Complete documentation and signal state matrices at the end (after Examples)
- [ ] **Code Blocks**: All use `highlight()` utility, proper `lang` attribute
- [ ] **Imports in Code**: All code examples include import statements at the top
- [ ] **Spacing**: Consistent Clarity layout attributes throughout
- [ ] **Headings**: Proper hierarchy (H2 for sections, H3 for examples)
- [ ] **Lists**: Use `cds-layout="vertical gap:xs"` for unordered lists
- [ ] **Code Naming**: Descriptive names (basicUsageCode, example1Code, etc.)

---

## Example: Complete Standardized Page

### TypeScript Component

```typescript
import {ChangeDetectionStrategy, Component} from '@angular/core';
import {ClarityModule} from '@clr/angular';
import {PageContainerComponent} from 'clr-lift';

import {CodeBlockComponent} from '../../../../shared/components/code-block/code-block.component';
import {highlight} from '../../../../shared/utils/highlight.util';

@Component({
  selector: 'app-example',
  imports: [ClarityModule, PageContainerComponent, CodeBlockComponent],
  templateUrl: './example.component.html',
  styleUrl: './example.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExampleComponent {
  basicUsageCode = highlight(`
import {ExampleUtility} from 'ngx-lift';

@Component({
  template: \`
    <div>{{ result }}</div>
  \`
})
export class ExampleComponent {
  result = ExampleUtility.doSomething('input');
}
  `);

  example1Code = highlight(`
// Example 1 code here
  `);

  example2Code = highlight(`
// Example 2 code here
  `);
}
```

### HTML Template

```html
<cll-page-container [title]="'exampleUtility'">
  <!-- Overview -->
  <p>
    The <code>exampleUtility</code> function does X, Y, and Z. Use it when you need to... It provides benefits such
    as...
  </p>

  <!-- Examples -->
  <section cds-layout="vertical gap:md">
    <h2>Examples</h2>

    <article cds-layout="vertical gap:sm">
      <h3>Example 1: Title</h3>
      <p>Description of what this example demonstrates:</p>
      <app-code-block [code]="basicUsageCode" lang="typescript" />
    </article>

    <article cds-layout="vertical gap:sm">
      <h3>Example 2: Title</h3>
      <p>Description of what this example demonstrates:</p>
      <app-code-block [code]="example1Code" lang="typescript" />
    </article>

    <article cds-layout="vertical gap:sm">
      <h3>Example 3: Title</h3>
      <p>Description of what this example demonstrates:</p>
      <app-code-block [code]="example2Code" lang="typescript" />
    </article>

    <!-- Additional examples (optional) -->
    <article cds-layout="vertical gap:sm">
      <h3>Example 4: Title</h3>
      <p>Description of what this example demonstrates:</p>
      <app-code-block [code]="advancedCode" lang="typescript" />
    </article>
  </section>

  <!-- API Reference -->
  <section cds-layout="vertical gap:md">
    <h2>API Reference</h2>
    <div cds-layout="vertical gap:sm">
      <h3>exampleUtility</h3>
      <p>Brief description of the utility.</p>

      <h4>Signature</h4>
      <div cds-layout="vertical gap:xs">
        <p><code>exampleUtility(param: Type): ReturnType</code></p>
        <p><strong>Parameters:</strong></p>
        <ul cds-layout="vertical gap:xs">
          <li><code>param</code>: <em>(Required)</em> Description.</li>
        </ul>
        <p><strong>Returns:</strong> Description of return value.</p>
      </div>
    </div>
  </section>
</cll-page-container>
```

---

## Quick Reference

### Clarity Layout Attributes

- Page container: built-in page container spacing
- Sections: `cds-layout="vertical gap:md"`
- Articles: `cds-layout="vertical gap:sm"`
- Lists: `cds-layout="vertical gap:xs"`

### Section Order

1. Overview
2. Examples (numbered sequentially: Example 1, Example 2, etc.)
3. API Reference

### Code Block Pattern

```typescript
// In component
codeName = highlight(`code here`);

// In template
<app-code-block [code]="codeName" lang="typescript" />
```

### Title Format

```html
<cll-page-container [title]="'ExactExportName'"></cll-page-container>
```

---

## Notes

- **Consistency is Key**: Follow these standards exactly for all pages
- **User-Focused**: Write for users who are learning the library
- **Complete Examples**: Always provide full, runnable code
- **Clear Descriptions**: Use plain language, avoid jargon
- **Progressive Disclosure**: Start simple, then show advanced usage
