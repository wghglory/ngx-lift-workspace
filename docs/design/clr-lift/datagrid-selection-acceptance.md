# Datagrid selection implementation and acceptance

Updated October 30, 2026. Scope: [issue #200](https://github.com/wghglory/ngx-lift-workspace/issues/200). The production
increment is implemented locally and the automated gates below pass. Independent human acceptance and publication remain
separate.

## Delivered behavior

clr-lift exports DatagridSelectionComponent, DatagridSelectionAccessorDirective and DatagridSelectionBindingDirective,
plus DatagridSelectionKey, DatagridSelectionValue and DatagridItemAvailability. One caller-written label and native grid
define the field. The grid supplies data, mode, identity, loading, columns, filters and pagination. The shell supplies
the CVA, ordered stable-key reconciliation, field presentation and composite focus. It does not fetch data or allocate a
second form control.

The adapter preserves unresolved keys, immutable incoming values and caller-owned native row restrictions. Owner
writes/reset and object replacement do not echo changes. Single radios and optional native row-click mode share the same
value bridge. Header pointer/Space actions select or clear only the eligible filtered logical scope; a single-mode
header never selects an item. Loading, readonly and Angular disabled state guard applicable selection paths. Loading
does not disable the form owner. Selected unavailable items remain removable; explanations are visible and associated
with their checkboxes.

The optional picker host directive forwards the original owner's value, disabled state, validation and Angular
change/blur/submit buffering through one explicit inner binding. Missing/multiple/conflicting bindings and duplicate
accessors are diagnosed. Composite focus includes label help, grid/footer and Clarity-owned portals, including the
interval before a portal's ARIA target is attached. Departure cancels focus restoration; row replacement can restore
focus only while the composite remains active.

Required deliberately uses Angular RequiredValidator with direct form bindings. The grid describes the requirement
without an invalid aria-required attribute. Parent controls own count/async/business rules and localized error text. The
examples explicitly omit disabled fields from DTOs through toSignalForm's existing omitIf option, including Angular's
wholly disabled FormGroup case.

## Runnable examples

Run `pnpm nx serve demo --port=4307 --hmr=false` and open
[/clr-lift/components/datagrid-selection](http://localhost:4307/clr-lift/components/datagrid-selection). The route needs
no login. Its HttpClient service reads the checked-in organizations JSON asset; Playwright controls failure/loading
responses at that HTTP boundary. This is local fixture evidence, not a live business API integration.

The page includes direct multiple/single controls, formControlName with toSignalForm, a reusable picker and ngModel. It
exposes owner writes/reset, disabled/readonly, horizontal layout, availability, native filters/pagination and
refresh/retry. Direct status text matching and sorting resolve the visible translations; language/dictionary changes
refresh native processing without replacing active queries or values. The picker retains a separate ordinary enum filter
component. All owned library and demo messages cover the eleven supported locales; existing library aliases remain
available.

Displayed source is generated from the ten runnable source/template files by
`node tools/demo/datagrid-selection-examples.mjs --write`. The tooling target checks for drift.

## Automated evidence

| Gate                          | Evidence                                                                                                                                                                                                                                                                                                                        |
| ----------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Focused real-host regressions | 18 passing tests for model writes, reconciliation, scope, guards, focus, native row/radio paths, arbitrary count/async errors and wrapper ownership/diagnostics.                                                                                                                                                                |
| Repository validation         | pnpm run validate passed: formatting, tooling, all locale checks, lint, production types, 1,618 unit tests and coverage thresholds (883 ngx-lift, 453 clr-lift, 282 demo), package/demo builds, bundle checks and fresh installed consumers.                                                                                    |
| Browser journeys              | 33 passing checks across Chromium, Firefox and WebKit, including both themes and horizontal/compact/RTL/200-percent-text reflow.                                                                                                                                                                                                |
| Packed Angular 21 consumers   | Fresh isolated strict peer install; strictTemplates and skipLibCheck=false; direct, picker, ngModel and facade hosts in zoneless and ZoneJS DOM render modes. Nine negative template contracts reject removed shell inputs and invalid native cell access.                                                                      |
| Rendering bounds              | The rendered native scroll box has a positive height and a real scroll range: 120 supplied items measure 360px with 3,993px of scroll content. Five items fit naturally and retain height through filtering, empty results and refreshed objects. The pager stays outside the viewport; this is not virtual-windowing evidence. |
| Accessibility/locales         | Automated axe scans in both themes; native label/grid associations, unique generated IDs, error/helper/availability descriptions, keyboard loading guards, popup departure and all eleven locale switches. Human review remains separate.                                                                                       |

Tests use the real Angular/Clarity hosts and the production exports. The packed DOM fixtures supply browser observer
shims; real-browser checks supply separate browser evidence. Historical declaration/native seam experiments are not
counted as production acceptance.

The repository unit coverage thresholds pass. Real-host unit coverage and the native browser rendering checks provide
separate evidence; browser geometry is asserted on a measurable element, not a display:contents wrapper.

Reproduce the feature browser suite against the local server:

```bash
BASE_URL=http://localhost:4307 pnpm nx e2e demo-e2e --grep='datagrid-selection.spec.ts' --workers=2
```

## Standards and Spec review

Standards review found three issues: inaccessible availability reasons, drifting displayed source and an undiscoverable
API reference. All were addressed. Spec review found five selection/focus paths: native permissions changing during a
lock, focus restoration after departure, single-header Space, single native row clicks and rejection of an unavailable
single item through a cell action. Each was corrected; the final spec review confirmed the last correction. An
additional regression covers the single Clear loading lock before items arrive. A subsequent review caught a native
viewport measurement defect. That finding and its regression coverage are recorded below and are now resolved.

## Boundaries and remaining acceptance

The Clear/signpost presentation follow-up uses matching standard secondary Clear/Reset buttons and Clarity's built-in
information-icon trigger with a localized accessible name. Consumer examples and generated source agree. Builds, lint,
types, formatting and all 30 feature browser checks were rerun for this presentation update; the full unit/package
results above describe the implementation acceptance run.

The label/error follow-up keeps the organization label and signpost together with an 8px gap and top-aligns the label
group in horizontal forms. It removes the vertical error border and renders the native clr-control-error icon/text
pattern below the grid. The clr-error class is limited to the feedback wrapper, preserving neutral grid/pager/filter
styling. All 18 focused form regressions and 30 three-browser checks pass, including the invalid state accessibility
scan, inline-label spacing and horizontal/reflow checks. Builds, lint, types and locale checks also pass for this
update.

The viewport review follow-up replaces the display:contents content-wrapper measurement with Clarity's real native
scroll box. Before the fix, 120 items grew to roughly 4,000px and filtering collapsed the visible grid; the original
geometry checks passed because they measured a zero-height wrapper. The corrected assertions failed in all three
browsers before the fix. All nine targeted checks now pass, and the complete feature suite passes all 33 checks. They
verify nonzero dimensions, internal scrolling, footer placement, small-inventory natural sizing and stable filtered
height through fresh object replacement. The retained height uses rem units for text scaling.

- Independent native-language and manual assistive-technology acceptance are pending under the repository contract.
  Automated checks do not provide those approvals.
- Local acceptance does not establish CI at the pull request commit, merge, deployment or npm publication; each requires
  its own evidence.
- Angular 21 is the supported baseline. No native Signal Forms, SSR/hydration or native virtual-scroll acceptance is
  claimed. Application-scoped ID generation avoids a module-global request counter; this alone is not hydration proof.
- The local inventory examples intentionally render supplied unpaged rows. Server-page and full policy create/edit
  acceptance remain with #201 and #202; their scope is not certified by this local increment.
- No runtime dependency or package version/peer-range change is needed. Release versioning/publication remains an
  independently authorized release operation.

## Demo feedback follow-up (October 31, 2026)

The native HTML reset action cleared Clarity's pagination input and checkbox DOM state independently of the Angular
model. Browser regressions reproduced an empty current-page input and an unchecked South despite the owner still
containing org-2. Both Reactive Forms examples now use ordinary buttons calling the existing directive's resetForm().
This restores their nonNullable constructor defaults and submitted state without running the browser reset action.

Nine focused checks pass across Chromium, Firefox and WebKit: direct reset restores South, picker reset restores North,
page inputs remain populated on pages 1 and 2, saved writes after reset/refresh stay checked, and the in-page API
reference renders its six inputs and accessor/binding contract. The demo now explains the saved/unresolved keys and
initial reset values in all eleven locales, shows the real picker-parent sources, and groups the validation example's
dependencies, form state, grid configuration and actions. Displayed sources are generated from twelve runnable files.

Follow-up checks also pass: all 282 demo unit tests, demo/e2e lint and type checks, eleven-locale completeness, source
drift/formatting checks and the production demo build. Existing e2e lint warnings remain; there are no lint errors.
Independent human language and assistive-technology acceptance remain separate from this automated evidence.

The complete updated feature suite passes all 42 browser checks, including automated accessibility in both themes,
eleven-locale switching and the new reset/reference regressions. The earlier 1,618-test full-library/package validation
above predates this demo-only follow-up; library implementation, dependencies and public signatures are unchanged.
