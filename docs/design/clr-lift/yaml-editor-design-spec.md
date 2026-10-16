# YAML viewer, editor, and future form synchronization

Status: **Draft; API approval pending**. Updated October 15, 2026. New symbols are proposed.

## Background

Users need a reusable YAML surface now and a safe form/editor integration for later resource workflows.

## Goals

- G1: Users inspect, copy, download and edit YAML using a Clarity surface, with useful diagnostics when validation is
  configured.
- G2: Developers bind raw text through standard forms without depending on editor-engine internals.
- G3: A later Postgres form/YAML workflow preserves valid user data and never replaces a valid resource with an invalid
  draft. Terminology: draft text can be invalid; a parsed document is syntactically valid; a committed resource also
  passes domain validation.

## Non-Goals

Not now: shipping application-specific Postgres create/edit integration, collaborative editing, a general IDE, multiple
documents, custom YAML tags, or arbitrary schema discovery. Diff is a later increment after basic editing is reliable.
Outside this API: backend authorization, persistence, Kubernetes admission, resource-version conflict resolution, and
secret policy.

## Industry evidence and existing behavior

An existing application's viewer, YAML editor and diff editor were inspected locally. Useful observed patterns include
theme mapping, readonly/edit modes, resizing in tabs/split panels, model updates, and redaction at the display/export
boundary. Its store, global loader and application-specific models do not belong in clr-lift. Reimplement independently;
do not copy proprietary code into the public package.

See the [open-source research](yaml-editor-research.md) for implementation evidence and source limitations. Compare
[CodeMirror](https://codemirror.net/) as the first rich-editor candidate with
[Monaco](https://microsoft.github.io/monaco-editor/) when IDE capabilities justify it. Neither engine is approved as a
dependency. [YAML language support](https://github.com/codemirror/lang-yaml) supplies editor syntax behavior; it does
not establish semantic validation or a comment-preserving resource transformation contract. Evaluate a maintained
[YAML document parser](https://eemeli.org/yaml/) separately if synchronization is approved.

## Dependency decision and staged scope

1. **Base viewer and basic editor:** escaped text in a Clarity-styled pre/code surface and a native textarea
   respectively. No mandatory editor engine, YAML parser, schema validator, worker, CDN or Angular editor-wrapper
   package. This stage deliberately provides text editing, not IDE features. Do not emulate a rich editor with a fragile
   highlight overlay.
2. **Validation:** an optional application-provided validation callback or a separately approved integration supplies
   diagnostics. The text shell does not parse YAML itself or claim semantic validity when no validator is configured.
   Syntax highlighting, parsing, schema validation and domain validation are different responsibilities.
3. **Rich editing:** evaluate a minimal CodeMirror 6 feature set first if line numbers, folding, search and highlighting
   are important enough to justify an engine. Monaco is a candidate only for a demonstrated need such as schema-driven
   completions, hovers or advanced diff. Do not ship both engines as a default feature set.
4. **Form synchronization:** justify a real document parser independently of the editor choice. A textarea plus parser
   can synchronize a form; an editor engine without a suitable parser cannot guarantee lossless field updates.

Installing ordinary ngx-lift/clr-lift must not require an optional engine or its wrapper/transitive packages. A
secondary entry point or dynamic import does not by itself meet that requirement. The spike must verify package
metadata, strict installation without the engine, public declarations, and unused-consumer bundles. If root peers cannot
remain truly optional, use a separately installed integration package. Keep this boundary small; do not build a public
adapter framework for hypothetical engines. Parser/schema integrations follow the same dependency policy.

Record compressed transferred JS/CSS and workers, retained package/dependency cost, startup/first-edit latency and
memory against the native baseline. Measure the actual selected feature set; no package-size or tree-shaking claim is
acceptance evidence. No dependencies, package split, or engine implementation are introduced by this draft.

## Use cases and acceptance

| ID  | Task                                                  | Outcome and recovery                                                                                         |
| --- | ----------------------------------------------------- | ------------------------------------------------------------------------------------------------------------ |
| Y1  | Inspect a resource                                    | Readonly text, copy/download, Clarity theme and translated actions; protected data stays redacted            |
| Y2  | Edit with syntax errors                               | Preserve raw text and undo history; configured validation reports line/column; invalid text remains editable |
| Y3  | Validate through an optional schema integration       | Distinguish parse, schema and domain errors; outdated validation results are discarded                       |
| Y4  | Open in a hidden tab/drawer or resize a split view    | Correct layout after reveal/resize; no cursor or text reset                                                  |
| Y5  | Engine/worker fails to load                           | Clear retry state and usable text fallback; failure is not a blank editor                                    |
| Y6  | Switch form/YAML views for a future Postgres resource | Valid changes synchronize under the explicit commit policy below                                             |
| Y7  | Edit a YAML field absent from the form                | Unknown fields survive subsequent form edits; incompatible edits block with a useful message                 |
| Y8  | Reset, navigate away or replace the model             | Explicit dirty-draft handling; stale diagnostics and disposed models cannot update the next document         |

## Proposed public API

Separate a lightweight `YamlViewerComponent` (`cll-yaml-viewer`, `text: string`) from `YamlEditorComponent`
(`cll-yaml-editor`, form value `string`). Readonly viewer has no CVA; editor follows the Angular 21
[form integrations](forms-compatibility-design-spec.md). Base editor inputs start with `label`, `readonly`, and
feature-specific limits. An optional `validateText` callback is a proposed extension point; its exact sync/async result
signature and validation ownership need API review. A schema input belongs to the optional schema integration, not the
base text shell. When configured, `diagnosticsChange` carries severity/message/location; it is not another text value.
Parse/schema errors from that integration participate in the owning form through the shared contract. Absence of
validation does not indicate that the text is valid YAML, and the viewer/basic editor never attempts an implicit
text-to-object conversion.

```typescript
import {Component} from '@angular/core';
import {FormControl, ReactiveFormsModule} from '@angular/forms';
import {YamlEditorComponent, YamlViewerComponent} from 'clr-lift'; // proposed

@Component({
  imports: [ReactiveFormsModule, YamlEditorComponent, YamlViewerComponent],
  template: `
    <cll-yaml-viewer [text]="safePreview" />
    <cll-yaml-editor label="Resource YAML" [formControl]="yaml" />
  `,
})
export class YamlExample {
  readonly safePreview = 'name: analytics\n';
  readonly yaml = new FormControl(this.safePreview, {nonNullable: true});
}
```

Copy/download uses the supplied display text. Redaction is the caller's explicit boundary; displaying unredacted text
and merely hiding it with CSS is unacceptable. The library does not infer secret paths. No resource content is logged.
Do not expose raw Monaco/CodeMirror instance types in the default public API.

## Text, parse and synchronization behavior

The editor always emits raw text edits, including invalid drafts. When configured, debounced parse/schema validation has
an independent document revision and generation; a success for an older revision cannot mark the latest text valid.
External replacements have documented cursor/undo behavior; do not replace the entire model on every echoed form write.
Loading a different document gets a new model identity; dispose models, listeners, observers and workers when owned.

Future synchronization lives in a separate application/controller boundary with one committed resource and a draft:

1. Form edits patch only mapped fields in the current document representation. Preserve unknown keys and comments where
   the parser supports them; tests prove round trips. Do not regenerate the full YAML from a reduced form object.
2. YAML edits remain draft until parse + schema + domain validation pass and the user applies them. This explicit apply
   boundary is the default; automatic applying can be reconsidered through a separate use case.
3. A YAML syntax error leaves the last valid resource/form unchanged. Switching to the form requires applying valid YAML
   or explicitly discarding the draft. Canceling that choice leaves the draft intact.
4. Edits carry a base revision. If both form and YAML change from that revision, block overwriting and offer explicit
   conflict resolution. Reset/undo has a defined owner; guard against serialization feedback loops.
5. Unsupported YAML constructs, unmappable types, and server-owned fields get explicit outcomes. Initial sync accepts a
   single mapping document, string keys and JSON-compatible values; reject duplicate keys and custom tags.
   Anchors/aliases remain outside initial sync, even if standalone text editing can display them. Never silently drop
   them.

## Loading, performance, presentation and validation

An optional rich-editor integration lazy-loads its code and any required workers on use, with no engine in the ordinary
clr-lift import graph or mandatory install. Viewer remains a readonly lightweight surface. SSR renders a stable
fallback; hydrate the interactive editor only in the browser. Verify this boundary rather than claiming full SSR
support. Proposed initial editor budget: 1 MiB text and 20,000 lines, with explicit rejection/readonly fallback above
either limit; benchmark typical 100 KiB documents. Optional parsing/schema integrations use bounded alias
expansion/depth, deterministic parser behavior, schema limits, and locally supplied/allowlisted schemas. Fetching
arbitrary remote schemas is disabled by default.

### Content Security Policy (CSP)

CSP is a browser-enforced policy normally delivered by the application's `Content-Security-Policy` HTTP response header.
It restricts executable scripts, styles, worker URLs and network destinations; the hosting application owns it. See the
[CSP specification](https://www.w3.org/TR/CSP3/) and
[Angular security guide](https://angular.dev/best-practices/security). An engine integration must work within a
documented policy, not instruct consumers to disable protection.

The base text shell needs no editor-specific worker/network policy. Rich integrations test self-hosted assets under
`worker-src 'self'` and deny unapproved external schema requests with `connect-src`. A loader using blob worker URLs may
need different permission; prefer permitted self-hosted worker files when feasible. Test exact deployed asset URLs and
base paths. No CDN, `unsafe-eval`, or broadly permissive policy is an assumed prerequisite. CodeMirror also injects
styles: its [cspNonce facet](https://github.com/codemirror/view/blob/main/src/editorview.ts) can attach the
application's nonce to editor styles. A nonce is a fresh per-response authorization token, not a fixed config string. It
does not by itself settle every inline-style, Trusted Types or worker constraint. Verify the chosen engine and
application build under an enforced production policy, with a useful text fallback when optional enhancement fails.

### Presentation and validation

Clarity controls, borders, typography, focus and light/dark tokens surround the text surface or optional engine. Syntax
colors need an explicit accessible theme mapping. Translate toolbar, errors, diagnostics wrapper, announcements and
demos in all supported locales. Keep code text LTR while localizing the surrounding UI. Provide keyboard escape from the
editor, accessible diagnostics and a textarea fallback for assistive technology or engine failure.

Demo/playground: Y1–Y5 and Y8, all form modes, invalid text, schema errors, reset, theme/language switch, resize and
fallback. Base editing demonstrates the text-only boundary explicitly; validation/engine-specific cases run only in
their optional integrations. Future synchronization increment adds Y6–Y7 with unknown fields/comments/conflicts and real
submitted data. Unit/E2E: revision races, parse limits, exports, redaction boundary, worker failures, model disposal,
undo preservation, hidden-tab layout and keyboard flows in three browsers. Measure lazy chunks and repeated mount
memory. Pending: engine, package boundary, measured engine costs, parser dialect/limits, diagnostic validation
integration and future sync mapping ownership. No engine spike, implementation, Postgres integration, or performance
measurement is complete.

## Platform delivery requirement

Initial delivery supports Angular 21 ngModel, typed Reactive Forms, and Reactive Forms + `toSignalForm` where this
feature owns a value. Native signal-field integration is deferred until the platform upgrade, then required under the
[shared forms contract](forms-compatibility-design-spec.md). Display-only surfaces and form containers have no field
value of their own. This requirement does not make proposed exports available.
