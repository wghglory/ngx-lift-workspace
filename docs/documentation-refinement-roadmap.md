# Demo documentation status

Engineering delivery for the demo teaching improvements is complete. Newcomer comprehension remains the open human gate;
independent language approval and the manual assistive-technology waiver are recorded in the
[acceptance contract](guides/accessibility-and-localization.md). The waiver is not a pass.

## Shared acceptance criteria

- Begin with what the API helps the reader do and the problem it removes. State prerequisites and required setup.
- A tutorial's first meaningful action comes before advanced architecture, comparisons and state matrices.
- Keep visible example behavior and displayed source consistent. TypeScript contains logic/setup; HTML contains the
  template when both tabs exist. Code is shown initially, and the caret reflects actual visibility.
- Clearly label focused excerpts. A starter must include required imports and setup, or link directly to them.
- Add a mental model only where it explains otherwise surprising behavior. Pure pipes/helpers do not need a five-stage
  tutorial or an artificial interactive playground.
- Keep API reference reachable with stable routes/anchors. Naming and domain organization belong in a focused guide.
- Preserve useful safety, accessibility and lifecycle notes beside the relevant operation.
- Validate affected examples, translations, narrow layouts, keyboard interaction and important failure/recovery paths.
  Run relevant unit/coverage, tooling, type/lint and build gates; use browser checks for changed interactions.
- Track implementation, automated verification, newcomer comprehension, native-language review and remote CI separately.
  A reordered page or passing screenshot does not establish that a first-time reader can follow it.

Current demo pages follow the [documentation standards](documentation-standards.md). Query reader outcomes are owned by
the [query documentation plan](query-documentation-plan.md).
