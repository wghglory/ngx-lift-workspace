# Datagrid selection implementation and acceptance

Updated October 31, 2026. Scope: [issue #200](https://github.com/wghglory/ngx-lift-workspace/issues/200) and the
[#201](https://github.com/wghglory/ngx-lift-workspace/issues/201) server-page example. The production increment and the
server-page fixture/demo are implemented locally and the automated gates below pass. Independent human acceptance and
publication remain separate.

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

The server-paged playground (`data-testid="selection-server"`) loads a 26-row checked-in inventory through a demo HTTP
interceptor. The interceptor serves only the requested scope/name/status/sort/page identity with a bounded page size and
forwards those parameters to the underlying asset request so Playwright can hold or fail a specific page. Saved keys,
scoped select-all/clear, empty and failure states, Retry, refresh, reset-while-loading, stale responses and
readonly/disabled behavior are exercised against that boundary. The direct form also verifies the eligibility reaction:
restored maintenance keys keep submit disabled with a readable error, stay readable and removable, and clearing them
restores validity without any key or touch write. The reusable picker playground
(`data-testid="selection-server-picker"`) is exercised as a second binding: the picker owns its paged query, its
scope/status controls and its failure, retry and refresh paths, while the parent owns keys, required validation and the
saved-key baseline.

Displayed source is generated from the eighteen runnable source/template files by
`node tools/demo/datagrid-selection-examples.mjs --write`. The tooling target checks for drift.

## Automated evidence

| Gate                          | Evidence                                                                                                                                                                                                                                                                                                                        |
| ----------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Focused real-host regressions | 19 passing tests for model writes, reconciliation, scope, guards, focus, cleanup, native row/radio paths, arbitrary count/async errors and wrapper ownership/diagnostics.                                                                                                                                                       |
| Repository validation         | pnpm run validate passed: formatting, tooling, all locale checks, lint, production types, 1,618 unit tests and coverage thresholds (883 ngx-lift, 453 clr-lift, 282 demo), package/demo builds, bundle checks and fresh installed consumers.                                                                                    |
| Browser journeys              | 54 passing checks across Chromium, Firefox and WebKit, including both themes, horizontal/compact/RTL/200-percent-text reflow, saved-selection recovery and async submit buffering.                                                                                                                                              |
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
BASE_URL=http://localhost:4307 pnpm nx e2e demo-e2e -- datagrid-selection.spec.ts --workers=2
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
height through fresh object replacement. The retained height uses rem units for text scaling. The viewport is
re-measured only when its row counts or density change, never on a selection-only render: a complete inventory sizes to
its content so a smaller replacement can shrink again, while a filtered or partially displayed subset retains the
tallest height it has shown. A page with no supplied rows (an in-flight or initially failed request) also keeps that
height, so a transient empty inventory does not collapse the grid.

- Independent native-language and manual assistive-technology acceptance are pending under the repository contract.
  Automated checks do not provide those approvals.
- Local acceptance does not establish CI at the pull request commit, merge, deployment or npm publication; each requires
  its own evidence.
- Angular 21 is the supported baseline. No native Signal Forms, SSR/hydration or native virtual-scroll acceptance is
  claimed. Application-scoped ID generation avoids a module-global request counter; this alone is not hydration proof.
- The local inventory examples intentionally render supplied unpaged rows. #201 adds separate server-page coverage
  below; full policy create/edit workflows remain with #202 and are not certified by this local increment.
- No runtime dependency or package version/peer-range change is needed. Release versioning/publication remains an
  independently authorized release operation.

## Demo feedback follow-up (October 31, 2026)

The native HTML reset action cleared Clarity's pagination input and checkbox DOM state independently of the Angular
model. Browser regressions reproduced an empty current-page input and an unchecked Organization 2 despite the owner
still containing org-2. Both Reactive Forms examples now use ordinary buttons calling the existing directive's
resetForm(). This restores their nonNullable constructor defaults and submitted state without running the browser reset
action.

Nine focused checks pass across Chromium, Firefox and WebKit: direct reset restores Organization 2, picker reset
restores Organization 1, page inputs remain populated on pages 1 and 2, saved writes after reset/refresh stay checked,
and the in-page API reference renders its six inputs and accessor/binding contract. The demo now explains the
saved/unresolved keys and initial reset values in all eleven locales, shows the real picker-parent sources, and groups
the validation example's dependencies, form state, grid configuration and actions. Displayed sources were generated from
fourteen runnable files at that checkpoint; #201 extends the same generator to eighteen.

Follow-up checks also pass: all 282 demo unit tests, demo/e2e lint and type checks, eleven-locale completeness, source
drift/formatting checks and the production demo build. Existing e2e lint warnings remain; there are no lint errors.
Independent human language and assistive-technology acceptance remain separate from this automated evidence.

The complete updated feature suite passes all 54 browser checks, including automated accessibility in both themes,
eleven-locale switching and the new reset/reference regressions. The earlier 1,618-test full-library/package validation
above predates this demo-only follow-up; library implementation, dependencies and public signatures are unchanged.

## Review closeout (October 31, 2026)

The first two-axis review of this branch found three standards gaps and four spec gaps. Added: CHANGELOG and README
entries, section spacing and a grouped parent-source example; a cleanup regression; the async
eligibility/submit-buffering example with all eleven locale messages; and corrected source/browser counts. A follow-up
review found two standards gaps (demo injection spacing and missing JSDoc on new demo exports) and one spec gap: the
async Reset used direct `form.reset` and left the failed-submission error visible. The reset now calls the reactive form
directive's `resetForm()`, the browser journey asserts the failed submit clears, and the new demo exports are
documented. The reset deviation is recorded on #200: the native browser reset action remains intentionally unused
because it clears Clarity pagination and selection DOM state independently of Angular; direct `form.reset()` is
documented in the reference, while the examples expose `resetForm()` from ordinary buttons. The full 54-check datagrid
journey passed again after these changes.

## Server pages (#201) — October 31, 2026

The new server-page playground example keeps the existing `DatagridSelectionComponent` and caller-written native Clarity
grid. It adds no selection engine, renderer, public input or #200 contract change. The page requests one bounded page
from a controlled HTTP fixture for the current scope, name, status, sort, page and page size; that identity is also the
shared query key. Rows use native `@for` rendering rather than `*clrDgItems`, so Clarity does not paginate an
already-paged response. A settled total remains visible while the next page loads, preventing server pagination from
clamping to page 1.

Saved keys from pages that were not requested remain in the form and in the selected-key summary. The summary resolves a
name only after that row has loaded; absence from the supplied page is never treated as deletion. The saved-key action
restores Elm, Koa, Oak and Willow, including maintenance Elm. Select-all and scoped clear affect only the supplied
current logical page and preserve out-of-scope keys. Submission serializes every selected key in order and never emits a
wildcard or all-server sentinel. Failure, Retry, refresh failure, empty success and reset-while-loading keep the grid
mounted; reads never change the owner, and Reset uses the owner's form API. Readonly/disabled and stale-response paths
use the same owner.

The direct form also demonstrates the application eligibility reaction. A sync validator rejects keys whose
authoritative data says maintenance, and an effect re-runs validation whenever a fresh page response establishes new
authoritative statuses. Keys, touch and dirty state stay untouched while validity changes; restoring Elm and Oak keeps
them readable, removable and reportable, and removing them restores validity without fabricating a user edit.

The new reusable picker playground (`data-testid="selection-server-picker"`) wraps the same server domain in a business
picker component. The picker, not the page, owns the queryResource, loading, failure and retry, including its own
scope/status controls, native name filter, sort and pagination. The host uses the proposed accessor directive plus one
`cllDatagridSelectionBinding` on the inner field, with no picker CVA callbacks, own form control or public
valueChange/blurred/validation wiring. The parent owns values, required validation, the saved-key baseline, the key-only
submit DTO, readonly/disabled ownership and the reset. Baseline keys Maple (org-s-13) and Yarrow (org-s-25) live on
pages the picker has not requested and stay selected across page and scope changes.

The fixture clamps its page size to 20 defensively and the demo keeps a damped settled total; both are deliberate
server-side protections of the same page identity and are noted here as locally scoped fixture behavior. Native
page/filter/sort/scope requests drive the server; the demo's refresh control is an ordinary demo affordance that calls
the page's `reload()`.

| Gate                     | Result                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| ------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Focused library tests    | 18 focused real-host selection tests pass, including five new server-page cases for page replacement, scoped select/clear, loading/readonly/disabled writes, unavailable selected rows and destroy/remount, plus a complete-inventory re-measure regression.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| Three-browser journeys   | Eleven Playwright journeys are defined for Chromium, Firefox and WebKit (33 checks); 22 pass locally at this head (11 Chromium + 11 Firefox). WebKit cannot launch in the rootless verification sandbox: no `/dev/dri` device exists and WPE headless cannot create an EGL display, so its 11 checks remain a CI gate. They cover request identity/saved keys, scoped select-all/clear/submit with future arrivals unselected, keyboard filter/footer focus, unavailable saved keys with the eligibility reaction, empty/failure/retry/refresh, stale page/scope/filter and reset-while-loading, readonly/disabled with axe in both themes, server-evidence localization, the picker-owned paging/recovery binding, failure/retry/readonly/disabled ownership in the picker, and all eleven locales.                                                                                                                                                                                                                                                |
| Demo and e2e checks      | Demo and demo-e2e type checks pass; demo lint and demo-e2e lint pass with zero errors (ten pre-existing e2e warnings). The demo production build passes.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| Localization and source  | All eleven dictionaries contain 2,252/2,252 keys with no check errors; displayed source matches the eighteen runnable source/template files. The three eleven-locale selection journeys assert one shared `SELECTION_LOCALE_LABELS` table.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| Validation and departure | 36 checks (18 scenarios in Chromium and Firefox) from `datagrid-selection.spec.ts` pass at this head, repeating stories 24-26 at the public hosts after the library constructor change.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             |
| Packed consumers         | `pnpm run verify:packages` passes at this head (story 55): packed exact-key helper, breadcrumb and datagrid selection, installed query consumers/devtools/providers, production and development import graphs, and a fresh tarball consumer with strict TypeScript.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |     |
| Browser command          | `BASE_URL=http://localhost:4307 pnpm nx e2e demo-e2e -- datagrid-selection-server.spec.ts --workers=1`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| Accessibility rules      | Every `expectAccessible` call runs the complete WCAG 2.0/2.1/2.2 A/AA tag set with no rule disabled. The maintainer-approved exception is a selector-scoped `exclude` limited to inert Clarity buttons (`button[disabled]`, `button[aria-disabled="true"]`, `button.btn-disabled`, `button.disabled`): they fail color-contrast by design and cannot be activated. Disabled non-button controls and every other node remain in the scan. Clarity 18's `button[clrLoading]` sets `disabled` while loading and never applies a `clr-loading` class (its default-state content span is `clr-loading-btn-content`), so the removed class selector was dead. The exclusion is passed through the axe context, not `RunOptions` (where it is ignored at runtime); the reason is recorded in `apps/demo-e2e/src/support/accessibility.ts`. Chromium and Firefox journeys verify the rule set in both themes with no new color-contrast violations; violations, incomplete checks and passed rule IDs are attached to the Playwright artifact for each run. |
| Source drift             | `node tools/demo/datagrid-selection-examples.mjs` runs in the `tooling-test` target and validates all eighteen displayed sources against the nine runnable example pairs, including `server` and `serverPicker`.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |

Limitations: this is a controlled local HTTP fixture over checked-in JSON, not a live business API. The interceptor is
the server boundary: it alone reads the checked-in inventory and returns one bounded page for the requested
scope/name/status/sort/page identity. The application never holds or slices the complete inventory; the native name
filter emits real requests, while scope and status are ordinary application controls that join the same query identity.
Server-side matching uses canonical organization names and the status enum rather than translated UI text; translated
value matching (story 53) belongs to the local custom filter example from #200, not to this HTTP contract. The fixture
does not fetch every page, verify server-side authorization or prove backend deletion semantics. A selected row's
availability is authoritative only after that row has loaded; unresolved off-page keys stay selected but unverified. The
demo submits keys only, so a real consumer still has to resolve those keys against its server. Strict installed package
consumers are recorded for #200 above; `pnpm run verify:packages` was re-run at this PR's head and passes (story 55).
Validation and composite-departure journeys were repeated at this head in Chromium and Firefox (stories 24-26); the
WebKit leg remains a CI gate because the rootless verification sandbox has no EGL/DRM device. Automated checks cannot
substitute for an independent assistive-technology assessment (story 45), native-speaker review of the eleven locales,
or CI at a pull-request commit; those remain open and are recorded separately per
`docs/guides/accessibility-and-localization.md`. Merge, deployment and publication remain separate gates.
