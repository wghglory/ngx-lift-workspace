<a name="upload-and-reactive-api-code-review"></a>

# Upload and reactive API review index

Keep this review as historical evidence and regression context. Use the linked architecture specs for the current API
contract; the findings describe baseline `e0facfd7`, reviewed on 2026-11-26, rather than outstanding defects.

| Review                                                       | Scope                                                                    | Findings |
| ------------------------------------------------------------ | ------------------------------------------------------------------------ | -------: |
| [Upload](upload-review.md)                                   | Queue, picker, folder traversal, and panel                               |        7 |
| [Query and resources](query-review.md)                       | `queryResource`, `queryResources`, `mutateResource`, and `resourceAsync` |       16 |
| [Reactive utilities and forms](reactive-utilities-review.md) | `computedAsync`, signal forms, submission helpers, and `poll`            |        8 |

## Fix disposition

PRs #264–#268 address 19 findings, including all four P1s. PR #269 addresses the remaining 12, including the initially
partial direct-factory local override and zero-argument validator fixes. All 31 findings have code fixes; PR merge and
package publication remain separate gates. Keep this index at its original path so existing PR references remain useful.

## Compatibility and migration

- **`poll`: source-breaking type correction.** With `forceRefresh`, the direct `pollingFn` input or `paramsBuilder`
  input includes `undefined`. Handle the absent first input, for example `paramsBuilder: id => id ?? defaultId`.
  Callbacks that ignore the input need no migration.
- **`SignalForm.value`: source-breaking type correction.** Its value now follows `FormGroup<TControls>['value']`:
  enabled groups may omit disabled children. Handle optional fields, use field signals for individual controls, or use
  `rawValue()` when the payload must include disabled controls. `rawValue` is derived from `getRawValue()`.
- **Zero-argument validators: observable identity change.** Nullable callbacks remain installed as dispatchers. A
  null-returning getter clears effective validation, but `control.validator` may still be a function. Use `[validator]`
  when `hasValidator` or validator removal depends on the original function identity. The public one-argument
  `resolveValidators` call retains its snapshot return behavior. Disposing a binding stops policy getter reads and
  leaves its last selected validators in their original composition slot, preserving error precedence. An ambiguous
  callback observed only returning null retires empty; pass `[validator]` when it must remain active independently of
  the binding. This identity boundary also applies to validators returned by bare getters. Pass a Signal/computed policy
  when those selected validators need individual `hasValidator` or `removeValidators` calls after disposal.
- **Upload component state:** the exposed `disabledState` member is now a read-only `Signal<boolean>`, combining the
  disabled input and CVA state. Consumers writing `disabledState.set()` must use the disabled input or form control API.
  Component input/output names and the chosen-file value contract remain unchanged.

These are not all strictly non-breaking fixes. The two public type corrections and any direct dependence on changed
validator/state identities require migration review before release. The prior 21.x SemVer exception in
[deployment guidance](../deployment.md#version-policy) records specific earlier approvals; it does not implicitly
approve every later breaking change.

## Follow-up verification

At PR #269 commit `1dfcb088`: 1,143 headless tests, 598 Clarity tests, and 352 demo tests passed. Lint, type checks,
library builds, and packed-library export/type/import checks passed. The full fresh-consumer check stopped on npm
registry fetch error 23 locally; its subsequent browser checks were not run. This does not establish human browser
acceptance or package publication.

The subsequent GitHub review follow-up passed 1,175 headless, 598 Clarity, and 352 demo tests. It also checked packed
form and query consumers in zoneless and ZoneJS modes using existing peers and a cached compatible ZoneJS package. These
checks cover public resolver snapshots, binding disposal, and replacement execution after teardown writes. PR CI skips
`verify:packages`; neither its green result nor the linked-peer checks establish a fresh-peer installation.

## Historical section links

The original fragment anchors remain below, so existing links to the former combined report still land beside a direct
link to the finding or section in its new report.

- <a name="1-upload-files"></a> [Upload files](upload-review.md#upload-files)

- <a name="p1--a-pending-folder-drop-can-move-to-a-different-destination"></a>
  [P1 · A pending folder drop can move to a different destination](upload-review.md#p1--a-pending-folder-drop-can-move-to-a-different-destination)

- <a name="p1--resetting-the-form-can-still-start-the-discarded-upload"></a>
  [P1 · Resetting the form can still start the discarded upload](upload-review.md#p1--resetting-the-form-can-still-start-the-discarded-upload)

- <a name="p2--concurrent-chunk-failures-can-retry-a-permanent-rejection"></a>
  [P2 · Concurrent chunk failures can retry a permanent rejection](upload-review.md#p2--concurrent-chunk-failures-can-retry-a-permanent-rejection)

- <a name="p2--the-picker-can-enable-itself-while-its-form-control-is-disabled"></a>
  [P2 · The picker can enable itself while its form control is disabled](upload-review.md#p2--the-picker-can-enable-itself-while-its-form-control-is-disabled)

- <a name="p2--unreadable-folder-entries-disappear-from-a-successful-batch"></a>
  [P2 · Unreadable folder entries disappear from a successful batch](upload-review.md#p2--unreadable-folder-entries-disappear-from-a-successful-batch)

- <a name="p2--a-server-reported-failure-displays-english-in-a-translated-panel"></a>
  [P2 · A server-reported failure displays English in a translated panel](upload-review.md#p2--a-server-reported-failure-displays-english-in-a-translated-panel)

- <a name="p3--chunk-scheduling-allocates-a-worklist-proportional-to-the-files-chunk-count"></a>
  [P3 · Chunk scheduling allocates a worklist proportional to the file's chunk count](upload-review.md#p3--chunk-scheduling-allocates-a-worklist-proportional-to-the-files-chunk-count)

- <a name="2-queryresource-and-queryresources"></a>
  [queryResource and queryResources](query-review.md#queryresource-and-queryresources)

- <a name="3-mutateresource"></a> [mutateResource](query-review.md#mutateresource)

- <a name="4-resourceasync"></a> [resourceAsync](query-review.md#resourceasync)

- <a name="p1--one-execution-can-start-a-cold-thenable-twice"></a>
  [P1 · One execution can start a cold thenable twice](query-review.md#p1--one-execution-can-start-a-cold-thenable-twice)

- <a name="5-computedasync"></a> [computedAsync](reactive-utilities-review.md#computedasync)

- <a name="p2--an-object-comparator-receives-an-undeclared-undefined-value"></a>
  [P2 · An object comparator receives an undeclared undefined value](reactive-utilities-review.md#p2--an-object-comparator-receives-an-undeclared-undefined-value)

- <a name="6-tosignalform-and-submission-helpers"></a>
  [toSignalForm and submission helpers](reactive-utilities-review.md#tosignalform-and-submission-helpers)

- <a name="p1--editing-a-sibling-can-recursively-revalidate-a-nested-field"></a>
  [P1 · Editing a sibling can recursively revalidate a nested field](reactive-utilities-review.md#p1--editing-a-sibling-can-recursively-revalidate-a-nested-field)

- <a name="adjacent-api-consistency"></a>
  [Adjacent API consistency](reactive-utilities-review.md#adjacent-api-consistency)

## Original severity definitions

| Priority | Triage meaning                                                                                                                                                                                 |
| -------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| P1       | Address first. A supported interaction can send a file to the wrong destination, start a discarded upload, execute external work twice, or enter recursive validation during an ordinary edit. |
| P2       | Schedule a correctness fix. A specific input, lifecycle transition, or call order produces wrong data, a stalled caller, or an unusable control.                                               |
| P3       | Follow up on diagnostic accuracy, example quality, or an efficiency improvement.                                                                                                               |

<a name="verification"></a>

## Original baseline verification

- The repository-pinned Nx/Vitest targets passed **323 headless tests in eight files** covering upload models and queue
  plus all six named APIs, and **76 Clarity upload tests in three files** covering the picker, drop traversal, and
  panel. The adjacent polling suite passed **18 tests**.
- Temporary Angular/Vitest probes exercised the reported upload, query, mutation, async resource, and form scenarios.
  They used controlled promises, Observable teardown, real Angular form bindings, and explicit effect ticks as
  appropriate. The form type examples also compiled under strict TypeScript. The chunk scheduling improvement and the
  discarded `finally` example come from source inspection.
- Verification covers local library behavior and the cited demo scenario. Browser end-to-end runs, production
  transports, and package publication were outside this review. The deliverable is this report.
