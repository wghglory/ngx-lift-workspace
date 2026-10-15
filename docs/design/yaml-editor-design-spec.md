# YAML viewer, editor, and future form synchronization

Status: **Draft; API approval pending**. Updated October 15, 2026. New symbols are proposed.

## Background

Users need a reusable YAML surface now and a safe form/editor integration for later resource workflows.

## Goals

- G1: Users inspect, copy, download and edit YAML using a Clarity surface with useful diagnostics.
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

Compare [Monaco](https://microsoft.github.io/monaco-editor/) for editing/diff capabilities with
[CodeMirror](https://codemirror.net/) as a lighter candidate. Use the public
[YAML document API](https://eemeli.org/yaml/) to evaluate comment-preserving edits and explicit parser limits.
[Red Hat's YAML language server](https://github.com/redhat-developer/yaml-language-server) illustrates schema validation
and completions; it is not automatically a browser dependency. A parser/editor spike must measure actual worker,
bundling, accessibility and CSP behavior before choosing the engine.

## Use cases and acceptance

| ID  | Task                                                  | Outcome and recovery                                                                                 |
| --- | ----------------------------------------------------- | ---------------------------------------------------------------------------------------------------- |
| Y1  | Inspect a resource                                    | Readonly text, copy/download, Clarity theme and translated actions; protected data stays redacted    |
| Y2  | Edit with syntax errors                               | Preserve raw text and undo history; diagnostics show line/column; invalid text remains editable      |
| Y3  | Validate against a supplied schema                    | Distinguish parse, schema and domain errors; outdated validation results are discarded               |
| Y4  | Open in a hidden tab/drawer or resize a split view    | Correct layout after reveal/resize; no cursor or text reset                                          |
| Y5  | Engine/worker fails to load                           | Clear retry state and usable text fallback; failure is not a blank editor                            |
| Y6  | Switch form/YAML views for a future Postgres resource | Valid changes synchronize under the explicit commit policy below                                     |
| Y7  | Edit a YAML field absent from the form                | Unknown fields survive subsequent form edits; incompatible edits block with a useful message         |
| Y8  | Reset, navigate away or replace the model             | Explicit dirty-draft handling; stale diagnostics and disposed models cannot update the next document |

## Proposed public API

Separate a lightweight `YamlViewerComponent` (`cll-yaml-viewer`, `text: string`) from `YamlEditorComponent`
(`cll-yaml-editor`, form value `string`). Readonly viewer has no CVA; editor follows all four
[form modes](forms-compatibility-design-spec.md). Editor inputs start with `label`, optional `schema`, `readonly`, and
feature-specific limits. Output `diagnosticsChange` carries severity/message/location; it is not another text value.
Parse/schema errors also participate in the owning form's validation through the shared form contract.

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

The editor always emits raw text edits, including invalid drafts. Debounced parse/schema validation has an independent
document revision and generation; a success for an older revision cannot mark the latest text valid. External
replacements have documented cursor/undo behavior; do not replace the entire model on every echoed form write. Loading a
different document gets a new model identity; dispose models, listeners, observers and workers when owned.

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

Lazy-load editor code and workers on use, with no engine in the ordinary clr-lift initial import graph. Evaluate a
secondary entry point only from measured consumer bundles. Viewer can remain a readonly lightweight surface. SSR renders
a stable fallback; hydrate the interactive editor only in the browser. Verify this boundary rather than claiming full
SSR support. Proposed initial editor budget: 1 MiB text and 20,000 lines, with explicit rejection/readonly fallback
above either limit; benchmark typical 100 KiB documents. Use bounded alias expansion/depth, deterministic parser
behavior, schema limits, and locally supplied/allowlisted schemas. Fetching arbitrary remote schemas is disabled by
default.

Clarity controls, borders, typography, focus and light/dark tokens surround the engine. Syntax colors need an explicit
accessible theme mapping. Translate toolbar, errors, diagnostics wrapper, announcements and demos in all supported
locales. Keep code text LTR while localizing the surrounding UI. Provide keyboard escape from the editor, accessible
diagnostics and a textarea fallback for assistive technology or engine failure.

Demo/playground: Y1–Y5 and Y8, all form modes, invalid text, schema errors, reset, theme/language switch, resize and
fallback. Future synchronization increment adds Y6–Y7 with unknown fields/comments/conflicts and real submitted data.
Unit/E2E: revision races, parse limits, exports, redaction boundary, worker failures, model disposal, undo preservation,
hidden-tab layout and keyboard flows in three browsers. Measure lazy chunks and repeated mount memory. Pending: engine,
entry point, parser dialect/limits, diagnostic validation integration and future sync mapping ownership. No engine
spike, implementation, Postgres integration, or performance measurement is complete.
