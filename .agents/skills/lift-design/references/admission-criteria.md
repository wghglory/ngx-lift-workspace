# Admission criteria

Apply every test to each proposed public symbol. Evidence beats intention: a demo is not a consumer, and a PR that
already contains code is not approval. Tests that fail produce a `Reject` or `Request consumer evidence` verdict; state
which test failed and cite the source.

## Tests

| Test | Question | Fails when |
| --- | --- | --- |
| Consumer | Is there a named real consumer and use case outside the demo app? | The only example is a toy demo, a hypothetical, or "users might want this". |
| Native API | Does a stable browser, RxJS, or Angular API already do this? | The proposal is a thin wrapper with no added contract, state, or correctness guarantee. |
| Existing export | Does ngx-lift or clr-lift already cover the behavior? | A near-duplicate export exists and the difference is cosmetic. |
| Domain coupling | Is the API independent of one application domain? | Fields, names, or callbacks encode one product's entities (for example infrastructure resources or one vendor's layout). |
| Private API | Does it depend only on public contracts? | It reaches into another library's internal service, private property, generated CSS class, or framework-internal attribute. |
| Global side effects | Are effects scoped to the host and cleaned up? | It mutates `document.head`, injects global styles, or writes to `console` from library code. |
| Timing and purity | Is behavior driven by state, not magic timing or impure work? | It relies on fixed delays to wait for animations or an impure pipe to observe mutable form state. |
| Accessibility | Are keyboard, focus, motion, and semantics defined? | Scrolling, focus, or announcements are added without keyboard/reduced-motion/name handling. |
| Language | Can every owned message ship in all supported locales? | Visible or announced strings are hardcoded in one language in the library or demo. |
| Dependency | Is any new runtime dependency justified? | Cost, alternatives, and consumer evidence are absent from the spec. |
| Fit | Does it fit the roadmap and package boundary? | No delivery sequence position, or a secondary entry point is proposed without bundle evidence. |

## Verdicts

- `Proceed to spec`: every test passes or has a recorded, evidence-backed adaptation. Continue to industry comparison.
- `Request consumer evidence`: the idea may be sound but no real consumer or use case can be cited. Hold the spec until a
  consumer is named.
- `Reject`: a core test fails, especially thin wrapper, existing export, domain coupling, private API, or global side
  effects. Report in chat with the failing test and the alternative that covers the need. Open no PR and export nothing.

## Reporting

Keep the decision reproducible: list the check date, source URLs, and the exact symbols rejected. Separate automated
evidence from maintainer judgement. Do not describe a rejection as a pass, a deferral as an approval, or a demo as an
accepted use case.
