---
globs: ['**/*.ts', '**/*.html']
alwaysApply: false
---

# Angular integration

Use the supported Angular baseline from the manifests and public APIs actually exported by the libraries. Prefer modern
standalone components, signal inputs/outputs and reactive state where they fit; avoid unrelated migrations in a fix.

- Keep derived state reactive. Mutable Reactive Forms properties do not become tracked merely by reading them inside
  computed(); use an appropriate form-to-signal bridge when needed.
- A CVA preserves the chosen-file/value contract independently of transport state. Model writes and disabled changes
  must not emit user changes. Verify change/touch ordering, reset and validation with real Angular form bindings.
- toSignalForm is a Reactive Forms facade, not native Signal Forms. Follow the existing
  [form compatibility contract](../../docs/design/clr-lift/forms-compatibility-design-spec.md).
- Use computed or linked state for derivation and effects for imperative integration. Subscriptions, effects and DOM
  work are valid tools when their timing, injection context and teardown match their owner.
- Preserve *clrDgItems where Clarity owns datagrid sorting, filtering and pagination. Cheap pure presentation helpers
  and event handlers in templates are acceptable; keep expensive or side-effecting work out of render evaluation.
- Use OnPush for new library/demo components and track repeated items by meaningful stable identity.
