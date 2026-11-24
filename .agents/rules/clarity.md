---
globs: ['libs/clr-lift/**', 'apps/demo/**']
alwaysApply: false
---

# Clarity and rendered behavior

Use public Clarity primitives when they fit the interaction; semantic native HTML is appropriate where it is clearer. A
reusable wrapper should add a demonstrated capability rather than mirror an existing component's inputs.

- Use theme-aware Clarity tokens for shared UI and verify the rendered light/dark states. Keep essential actions
  reachable at narrow widths and with long translations; consider zoom, direction and reduced motion where relevant.
- Give controls accessible names, descriptions and state. Prefer their visible labels; add ARIA for missing semantics,
  not as a replacement for correct HTML. Associate Clarity toggle labels with the actual input using unique IDs.
- Track focus ownership when actions replace rows or open/close overlays. Restore focus to a connected, meaningful
  target without overriding a deliberate user move elsewhere.
- Keep determinate progress when real progress is available. Announce meaningful async outcomes and validation errors
  without flooding assistive technology with byte-by-byte updates.
- Follow the [accessibility and localization contract](../../docs/guides/accessibility-and-localization.md) for owned
  messages, rendered-state checks and the distinction between automated and independent human acceptance.
