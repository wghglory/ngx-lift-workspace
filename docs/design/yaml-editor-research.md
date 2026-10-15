# YAML editing: implementation evidence and dependency decision

Retrieved October 15, 2026. This note records source inspection, not a measured browser or package benchmark. The
recommendation remains a proposal for maintainer review.

## Recommendation

Keep the base clr-lift text viewer/editor free of a mandatory editor engine. A Clarity-styled textarea and escaped `pre`
viewer can cover bounded plain-text editing, copying, and downloading. Label this capability accurately: it does not
provide syntax highlighting, folding, schema completion, or YAML validation by itself.

Evaluate CodeMirror 6 first only when approved use cases require structured editing. Evaluate Monaco with monaco-yaml
when schema-driven authoring justifies its language-service and deployment requirements. Avoid building our own code
editor or YAML parser. These are architectural recommendations based on the evidence below.

An engine integration should have an isolated package and dependency boundary, with engine packages installed only by
consumers choosing it. A dynamic import inside the main package can defer browser loading while still imposing
installation, licensing, update, and dependency-audit costs. A secondary entry point alone does not remove mandatory
dependencies declared by its containing package. Confirm the actual installed-package behavior in the spike.

## Engine comparison

| Option                                  | What it provides                                                             | What remains separate                                                            | Decision                                                           |
| --------------------------------------- | ---------------------------------------------------------------------------- | -------------------------------------------------------------------------------- | ------------------------------------------------------------------ |
| Native textarea and escaped `pre`       | Browser text editing and plain viewing, without another editor engine        | YAML parsing, semantic validation, highlighting, completion, folding             | Base capability for bounded documents; do not promise IDE behavior |
| CodeMirror 6 with YAML language support | Configurable editing plus YAML syntax-tree support, indentation, and folding | YAML-to-object conversion, domain validation, JSON Schema diagnostics/completion | First optional engine candidate                                    |
| Monaco with monaco-yaml                 | Monaco editing plus YAML language services and schema-aware authoring        | Application rules, persistence, form synchronization, worker/assets deployment   | Advanced optional candidate when proven necessary                  |

CodeMirror separates editor state/view and extensions. Its YAML package uses a Lezer syntax parser and adds editing
metadata; this is not a YAML-to-object API or a JSON Schema validation service. The inspected basic YAML setup has no
worker registration requirement. Additional language-server integrations may introduce their own workers or network
requirements. Sources: [view package](https://github.com/codemirror/view),
[YAML implementation](https://github.com/codemirror/lang-yaml/blob/main/src/yaml.ts).

Monaco's built-in YAML highlighting and monaco-yaml's language services are distinct. monaco-yaml requires a web worker
and a bundler; its integration instructions register a YAML worker. Remote schema fetching is configurable and disabled
by default; applications can supply schema objects directly. Worker paths and asset generation depend on the
application's bundler. Source: [monaco-yaml integration and FAQ](https://github.com/remcohaszing/monaco-yaml#readme).

No bundle-size figures are claimed here. Compare production installed consumers, chosen features, compressed chunks,
worker assets, initial rendering, and typing responsiveness before accepting an engine.

## Verified open-source application patterns

### OpenShift Console: Monaco plus application-owned YAML behavior

The resource authoring UI uses a general editor wrapper with explicit YAML integration. Its
[CodeEditor.tsx](https://github.com/openshift/console/blob/master/frontend/packages/console-shared/src/components/editor/CodeEditor.tsx)
registers YAML services and updates schemas when the application's schema definitions refresh.
[yaml-editor-utils.ts](https://github.com/openshift/console/blob/master/frontend/packages/console-shared/src/components/editor/yaml-editor-utils.ts)
calls `configureMonacoYaml`, supplies a converted OpenAPI schema, and enables validation, hover, and completion.

The separate [edit-yaml.tsx](https://github.com/openshift/console/blob/master/frontend/public/components/edit-yaml.tsx)
parses submitted YAML with `js-yaml`, applies resource rules, and handles persistence and stale resource versions. The
useful pattern is separation of editor services from application validation and saving; adopting Monaco does not provide
the complete form-to-YAML workflow. This is source evidence, not a claim that this application's UX or deployment
configuration has been executed in this review.

### JupyterLab: CodeMirror 6 with lazy language loading

[editor.ts](https://github.com/jupyterlab/jupyterlab/blob/main/packages/codemirror/src/editor.ts) wraps CodeMirror 6
`EditorView` and connects it to the application's shared document model. Its
[language.ts](https://github.com/jupyterlab/jupyterlab/blob/main/packages/codemirror/src/language.ts) registers YAML
extensions/MIME types and dynamically imports `@codemirror/legacy-modes/mode/yaml` through a `StreamLanguage` adapter.
This verifies real YAML editing support in a general editor. That registry entry does not establish YAML schema
validation or schema-aware completion, and it does not use `@codemirror/lang-yaml` in the inspected source.

These examples demonstrate two credible approaches, not a popularity ranking or a requirement to copy their stacks.

## CSP implications

Content Security Policy (CSP) is an application-delivered browser policy restricting which resources may execute or
load. An editor integration must respect the host's script, style, worker, and network rules. The policy belongs to the
host application; a library should document its resource needs and test a restrictive deployment rather than require
broad allowances. Source: [W3C CSP Level 3](https://www.w3.org/TR/CSP3/).

CodeMirror creates editor styles and exposes `EditorView.cspNonce` for the host-provided nonce. This covers generated
style elements, not every CSP concern or arbitrary inline style usage. Source:
[editorview.ts](https://github.com/codemirror/view/blob/main/src/editorview.ts). Monaco-yaml requires worker setup; the
selected worker URLs must satisfy the host's `worker-src` policy. Optional remote schema loading also requires permitted
network access. Prefer bundled same-origin assets and local schemas where suitable; do not assume that `blob:`, external
CDNs, or `unsafe-eval` are universally required.

## Keep parsing and future form synchronization separate

Syntax trees used for highlighting do not replace semantic YAML parsing. Introduce a maintained YAML parser only when
parsing, serialization, or form synchronization is approved, and justify its package boundary independently of the
editor. Define YAML version, multi-document behavior, aliases/tags, duplicate keys, resource bounds, and comment
preservation before implementation. A parser with document editing support can preserve comments and formatting;
conversion through plain JavaScript objects alone is not a preservation strategy. See the
[yaml library's document API](https://eemeli.org/yaml/#documents).

During invalid or incomplete edits, preserve the user's text and the last valid form state. Define ownership, conflict
handling, validation timing, and explicit apply behavior before promising bidirectional synchronization.

Source freshness: the CodeMirror GitHub repositories now point to the project's new forge. Their move notice is visible
in the [YAML repository](https://github.com/codemirror/lang-yaml); the new forge could not be retrieved in this review.
Recheck the canonical source and package versions during the implementation spike.
