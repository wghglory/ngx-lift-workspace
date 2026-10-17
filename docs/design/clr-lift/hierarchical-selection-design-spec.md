# Cascader and tree-select

Owner: clr-lift maintainers. Package: clr-lift. Approval: feature API pending; template/contract coverage updated
October 17, 2026.

Status: **Draft; API approval pending**. Updated October 17, 2026. Lower priority pending a named application consumer.

## Applicable contracts

Hierarchical value/identity, forms, keyboard/tree semantics, child-request cancellation and bounded rendering apply.
Cross-control shared state is not assumed; request ownership follows the proposed feature scope.

## Background

Cascader chooses a path one level at a time; tree-select exposes a hierarchy and can select nodes from multiple
branches.

## Goals

- G1: Users choose a location such as region → cluster → namespace without flattening away context.
- G2: Users choose independent tree nodes with explicit lazy-loading and selection behavior.
- G3: Applications keep stable node identity and bounded requests for large hierarchies.

## Non-Goals

### Not now

DAGs/multiple parents, drag/drop, hierarchy editing, or implicitly selecting unloaded descendants. Outside this API: a
command dropdown. Selection uses appropriate tree/listbox semantics, not menu-item actions. Initial tree checkbox
selection is independent; parent/descendant propagation requires its own reviewed contract.

## Industry evidence and current gaps

[NG-ZORRO Cascader](https://ng.ant.design/components/cascader/en) provides path selection and async loading.
[NG-ZORRO TreeSelect](https://ng.ant.design/components/tree-select/en) illustrates lazy data, strict checking, search,
selected-tag summaries and virtual height. Adapt these distinct interaction models rather than adding modes to a generic
dropdown. Evaluate Clarity tree/checkbox/overlay composition before choosing a new renderer.

## Use cases and acceptance

| ID  | Task                                           | Acceptance and recovery                                                                             |
| --- | ---------------------------------------------- | --------------------------------------------------------------------------------------------------- |
| H1  | Choose one namespace through its parents       | Value is an ordered key path; loading a branch does not select it                                   |
| H2  | Choose nodes in different folders              | Independent selected keys survive collapse/search and page changes                                  |
| H3  | Expand a remote branch                         | Per-branch loading/error/retry; late results cannot overwrite a different context                   |
| H4  | Search unloaded hierarchy                      | A server result includes its ancestor path; local filtering never pretends to search unloaded nodes |
| H5  | Edit an existing selection before parents load | Supplied path/label seeds render immediately and reconcile by key                                   |

## Developer learning journey and pedagogy plan

Prerequisites: A named hierarchy consumer and Angular 21 forms; API approval is pending.

| Reader task               | Learning outcome                                                 | Destination / working example                       |
| ------------------------- | ---------------------------------------------------------------- | --------------------------------------------------- |
| Choose one hierarchy path | Distinguish loaded nodes, selectable values and missing children | This spec, proposed cascader example                |
| Select lazy tree nodes    | Recover child-load failures without committing stale selections  | This spec, proposed tree-select and lazy-load cases |

Validation and delivery: All examples and destinations are planned. A consumer, child paging/search decisions and
keyboard acceptance are prerequisites to implementation. The public API and behavior sections below own exact options
and limitations; examples introduce them after the first task.

## Public API and examples

Use a minimal
`HierarchyNode {key: string; label: string; hasChildren: boolean; disabled?: boolean; children?: readonly HierarchyNode[]}`.
`hasChildren=true` plus missing children means unloaded; an empty loaded branch is not an endless spinner. Node keys are
unique across the tree; duplicate keys and cyclic input produce a useful configuration error. Local `nodes` or a managed
child loader are distinct modes. A loader accepts parent key, cursor, context key and AbortSignal, returning a finite
Observable/Promise page; scope identity, cancellation, dedup and caps follow the selection contract.

Proposed `CascaderComponent` / `cll-cascader` value: `readonly string[] | null` (one complete path, leaf-only
initially). `TreeSelectComponent` / `cll-tree-select`: `string | null`; `MultiTreeSelectComponent` /
`cll-multi-tree-select`: `readonly string[]`. Independent checkbox selection is the initial multi contract. Parent
selection never means unknown descendants are selected. Review separate selectors versus a typed mode before approval.

```html
<!-- Proposed; import CascaderComponent and MultiTreeSelectComponent, plus ReactiveFormsModule. -->
<cll-cascader label="Namespace" [nodes]="locations" [formControl]="namespacePath" />
<cll-multi-tree-select label="Folders" [nodes]="folders" [formControl]="selectedFolderKeys" />
```

Example values: namespace path `['region-a', 'cluster-b', 'namespace-c']`; selected folders `['folder-7', 'folder-9']`.
Leaf-only cascader cannot commit a partial path. Changing an ancestor clears the downstream draft and cancels its loads;
the prior committed value remains until the new path is complete or explicitly cleared. Node removal makes a selected
value visibly unavailable instead of silently discarding it. Caller decides how to resolve authorization/context
changes.

Search modes are explicit: loaded-node filter versus server search returning paths. Revealing a result loads ancestors
with per-path errors and cancellation. Use a flattened visible-node projection for virtualization; expanded state, focus
and selection have separate keys. Honor tree keyboard semantics, visible active nodes and screen-reader level/position.
Use Clarity tokens/checkboxes, responsive stacked levels on narrow screens, and translated loading/empty/retry/selection
text.

## Demo and validation plan

Follow the [workflow](../component-development.md) and the Angular 21 form integrations. Demos cover H1–H5, duplicate
labels, disabled ancestors/leaves, context switching, failed branches, 10,000 loaded nodes and a large paged remote
hierarchy. Provide playground source, reset, validation and submitted paths/keys in every supported language. Unit/type
tests cover path validity, independent check behavior, unloaded leaves, cycles, duplicate keys, branch races and
disposal. Three-browser E2E covers keyboard levels/selection, search reveal, virtualization and focus after collapse.
Deliver cascader before multi-tree only after the consumer confirms the needed selection model. Pending: child paging,
server search result shape, Clarity composition, single/multiple selectors and scale budgets. No implementation is
complete.

## Platform delivery requirement

Initial delivery supports Angular 21 ngModel, typed Reactive Forms, and Reactive Forms + `toSignalForm` where this
feature owns a value. Native signal-field integration is deferred until the platform upgrade, then required under the
[shared forms contract](forms-compatibility-design-spec.md). Display-only surfaces and form containers have no field
value of their own. This requirement does not make proposed exports available.

## Terminology

A cascader value is one complete ordered path. Tree values are independent node keys. Unloaded children differ from an
empty loaded branch; focus, expansion and selection have distinct identities.

## Behavior and architecture

A branch request belongs to context, parent and cursor; cancel/invalidate it on context change, ancestor replacement or
disposal. A changed selected node is reported unavailable until owner policy resolves it. Cache/render bounds must be
set independently: virtualization does not limit retained nodes or requests.

## Clarity, accessibility, and localization

Use tree/listbox semantics appropriate to the chosen renderer, not command-menu semantics. Describe level/position, skip
disabled selections, render the active item before referencing it, and restore focus after collapse. Translate
per-branch loading/error/retry, unavailable labels and selected-count summaries; verify RTL and touch layouts.

## Compatibility, rollout, and risks

Angular 21 CVA first; all three proposed selectors require native fields after the platform upgrade. No child-loader
export or Clarity replacement is approved. Maintainers must settle finite page/cap/search shapes and prove installed
types/cancellation before remote or large-tree acceptance.

## Review decisions and delivery

H1 covers G1; H2/H5 cover G2; H3/H4 cover G3. A named consumer and precise selection model precede implementation.
Review a bounded local cascader first; approve remote loading, search reveal and multi-tree independently.

## Evidence

Checked against the current public exports and source at base `e4a43f9` on October 16, 2026. No proposed feature exports
or feature implementation exist; all feature demos/tests and measurements described here remain planned.
