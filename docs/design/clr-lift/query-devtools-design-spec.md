# Query devtools

Status: Implemented locally, unreleased. Updated October 17, 2026. The maintainer requested completion of the
docked-panel revision in this session. Local acceptance evidence is recorded below; publication and human
accessibility/language acceptance are separate.

## Background and goals

The October 17 data-first revision is approved for implementation: consolidate actions, emphasize cached values, add
state/tag filters, and distinguish a paused view update from an explicit network refetch. Mutation inspection, state
simulation, cache editing and destructive actions remain deferred.

The metadata-only modal made application interaction difficult and exposed eight mostly technical columns. The query
inspector now opens a nonmodal bottom panel, allowing developers to inspect cached data while reproducing application
behavior. Inspection reads local snapshots; Refetch deliberately executes one existing query loader.

- G1: Keep the application operable while inspecting queries in a resizable panel.
- G2: Search, filter, sort and paginate a compact query list with readable state badges.
- G3: Inspect one cached value, error and query's metadata without creating observers or extending retention.
- G4: Refetch one existing key with its registered policies and request deduplication.
- G5: Install once at application root and exclude the renderer from normal production builds.

Forms integration is inapplicable: the tool is a read-only developer inspector, not an application form control. Cache
editing, mutation replay, invalidation/cancellation/reset/removal controls, request history and browser extensions are
outside this increment. Invalidation by shared tags can affect multiple queries; removal currently detaches observers.
Do not simulate exact-key invalidation or cancellation through these broader operations.

## Industry comparisons

Primary documentation/source reviewed October 16, 2026. These are adopt/adapt decisions, not a claim of feature parity.

| Source                                                                                                                                                                                                                   | Observed pattern                                                                                                   | Decision                                                                                                                                                                                                       |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [TanStack Query React devtools](https://tanstack.com/query/latest/docs/framework/react/devtools)                                                                                                                         | Separate devtools package; floating corner toggle; bottom panel; embedded mode; production exclusion               | Adopt the corner launcher, docked panel and development-first distribution. Keep the existing component integration as well as root installation.                                                              |
| [TanStack Query Angular devtools](https://tanstack.com/query/latest/docs/framework/angular/devtools) and [package exports](https://github.com/TanStack/query/blob/main/packages/angular-query-experimental/package.json) | Root provider feature; development export resolves to the implementation and default export to a stub              | Adopt root installation and conditional package exports, without making core ngx-lift depend on the UI library.                                                                                                |
| [TanStack devtools implementation](https://github.com/TanStack/query/blob/main/packages/query-devtools/src/Devtools.tsx)                                                                                                 | Key search/sort, selected-query details, data explorer, refetch/invalidate/reset/remove actions, keyboard resizing | Adopt master/detail inspection and targeted refetch. Defer actions whose safe semantics our client does not yet expose.                                                                                        |
| [SWR devtools documentation](https://swr.vercel.app/docs/advanced/devtools)                                                                                                                                              | Documents a community browser extension with a browser DevTools panel                                              | Learn from separation of developer UI and application UI. Do not require an extension or describe the extension as an official Vercel project.                                                                 |
| [Clarity datagrid detail pane](https://clarity.design/documentation/datagrid/code/detail-pane) and installed datagrid source                                                                                             | A list can expose details for one selected item                                                                    | Keep native grid filtering/sorting/paging. Compose an adjacent inspector with existing Clarity controls rather than introducing another grid.                                                                  |
| [Angular Material sidenav source documentation](https://github.com/angular/components/blob/main/src/material/sidenav/sidenav.md)                                                                                         | Backdrop and focus behavior vary by drawer mode                                                                    | Use a nonmodal region, without a backdrop or focus trap, so developers can operate the application. Do not add Material.                                                                                       |
| [NG-ZORRO drawer](https://ng.ant.design/components/drawer/en)                                                                                                                                                            | Bottom placement, preview content and extra actions                                                                | Adapt the layout pattern. Do not add NG-ZORRO or use a small signpost for large values.                                                                                                                        |
| [Angular isDevMode](https://angular.dev/api/core/isDevMode), [build environments](https://angular.dev/tools/cli/environments), [deferred loading](https://angular.dev/guide/templates/defer)                             | Development-mode checks, build-specific replacement files, and deferred chunks solve different problems            | Retain a runtime guard and use conditional package exports for strict exclusion. File replacement is a fallback for custom builders. Loading later does not itself mean code is absent from production output. |

## Public API and root setup

Register once at application root:

```typescript
import {ApplicationConfig} from '@angular/core';
import {provideQueryDevtools} from 'clr-lift/devtools';

export const appConfig: ApplicationConfig = {
  providers: [provideQueryDevtools()],
};
```

`QUERY_CLIENT` already has a root factory. Add `provideQueryClient(options)` only to customize the client. Core ngx-lift
has no dependency on clr-lift. The provider installs one floating launcher after browser rendering, deduplicates
repeated registration and removes its component/view/host on application destruction. It is inert during SSR and in
production.

The root launcher inspects the root `QUERY_CLIENT`; it does not aggregate clients overridden in child injectors. The
`queryResources` demo uses that shared client, with zero inactive retention and cancellation when its last observer
leaves, so page-owned mock loaders are released on navigation.

For an inline launcher or a scoped client, import QueryDevtoolsComponent from clr-lift:

```html
<cll-query-devtools [client]="scopedQueryClient" />
```

| Input    | Type                     | Default               | Behavior                                                                                  |
| -------- | ------------------------ | --------------------- | ----------------------------------------------------------------------------------------- |
| enabled  | boolean                  | isDevMode()           | False closes the panel, releases selected data and stops the diagnostic timer.            |
| client   | QueryClient or undefined | Injected QUERY_CLIENT | Caller-owned client; switching clients clears selection and replaces the snapshot source. |
| launcher | 'inline' or 'floating'   | 'inline'              | Inline labeled button or floating icon launcher; the root provider uses floating.         |

The caller retains client ownership. `[enabled]="true"` supports the documentation preview deliberately in production;
this explicit component import bypasses the root provider's production-exclusion contract.

## Interaction and columns

The follow-up layout revision delegates all column sizing to Clarity, without fixed widths or minimum widths on columns.
Query key is first and Tags is second in both layouts. The full list also shows Failed attempts and Refetch. Clicking a
tag filters that list; Refetch opens the inspector and runs only that row's loader. Opening the inspector switches to
the compact five-column list and moves query actions into the inspector, so actions are not duplicated in the same view.
Column widths follow content and available space; no column is explicitly stretched to consume the remaining width.
Narrow screens retain horizontal scrolling. Existing cache inspection behavior and application-client ownership are
unchanged.

The launcher has an accessible name and tooltip. The panel is a labeled region with no backdrop or focus trap; opening
focuses Search keys. Close restores focus to its launcher. Escape dismisses an inner grid filter first, then the
selected inspector, then the panel when focus is inside it. There is no global shortcut. The panel uses the native
manual Popover API's top layer to escape clipping/stacking from application and playground containers. It remains
nonmodal; native popover support is required for that positioning guarantee in current supported browsers. No overlay
engine is added.

Pointer dragging and Up/Down on the resize separator change height. Full height uses the available viewport. Closing
releases selected payload references; height alone is retained in session storage, with storage failure tolerated. On
narrow screens selection replaces the list with an inspector and Back restores the list. Reduced motion disables the
slide animation. Existing Clarity controls and tokens provide light/dark, compact and RTL support; canonical keys and
value paths retain LTR direction.

| Compact column | Purpose                                                                                                   |
| -------------- | --------------------------------------------------------------------------------------------------------- |
| Query key      | Canonical key, key search/filter/sort and click-to-inspect.                                               |
| Tags           | Shared memberships, sortable/filterable; click a tag to show matching queries.                            |
| State          | Localized lowercase English badge with text as well as color.                                             |
| Observers      | Active subscriptions, sortable and numerically filterable; zero means inactive.                           |
| Updated        | Seconds since last success, exact localized timestamp on focus/hover, sorted by the underlying timestamp. |

The existing Clarity datagrid owns filters, sort and pagination (20 entries per page). Refreshing snapshots retains that
view state. Clicking a key selects the query; no row action column duplicates inspector controls. A separate key search
and tag selector compose with state-count buttons. Counts reflect the search/tag matches before the state filter;
inactive is an independent zero-observer filter. Selecting a tag in Details returns to the matching query list and
clears search/state filters, without invalidating anything. The selected query header groups Refetch and a Clarity
overflow menu containing Copy key. Copy JSON and expand/collapse controls belong to the value toolbar. Copy feedback
appears beside its control; refetch failures appear inside the selected inspector. Data receives 60% of desktop width.
Panel utilities use consistent quiet icon buttons with localized names/tooltips; maximize and pause expose pressed
state. Error tabs show a visible indicator when an error or retry failure exists. Primary state precedence is retrying
for a pending retry wait, refreshing for pending work with cached data, loading for pending work without data, error for
a terminal error, fresh/stale for a resolved value, otherwise idle. Raw status such as resolved remains in Details.
Inactive is an observer-count dimension, independent of freshness. Details shows failure count, retry time,
staleTime/gcTime, GC/poll delays, outstanding reads, tag memberships and cached-data freshness. No-data entries do not
display a freshness claim.

The toolbar shows query count and outstanding reads, not inferred HTTP request count. A live/paused indicator describes
inspector updates. Pause updates stops its one-second timer without pausing application queries or deep-cloning mutable
application values. Only while paused, Update view samples local state without fetching or requiring a search key;
timestamped status feedback confirms that read. Explicit Refetch can also update the paused view. No diagnostics timer
or payload reads run while closed.

## Data, errors and large values

Data, Error and Details tabs inspect only the selected key through `getSnapshot(key)`. Data is the loader result, which
may be transformed; raw HTTP headers/status/history are not available. Errors remain inspectable while cached data is
retained after a failed refresh. Eviction shows a missing-entry message and removes actions/data. Closing, disabling,
client switching and destruction release selected payload/error references.

The data tree opens its first level, expands through descriptors without executing getters/toJSON hooks, and pages
collections 100 items at a time. Rendering is bounded to 500 rows and depth 20; string previews show at most 2,000
characters. The preview note appears only when paging, depth, node or string limits are reached. Root values update on
new snapshot references; Update view also rebuilds previews after in-place changes. Cycles, bigint, undefined,
functions, accessors and inaccessible objects have structural summaries. JavaScript Error and Angular HttpErrorResponse
objects expose their own fields through descriptors; other custom objects are summarized rather than traversed.
Arbitrary Proxy traps cannot have hard execution-time guarantees.

Expand all recursively opens the current preview pages within the same 500-row/depth-20 limits, without enumerating
every page of a large collection. Collapse all closes the tree. Paging remains explicit, and these controls never fetch
or create query observers. Conditional row cells each have a single projectable root so Angular can assign them to
Clarity's cell slot without suppressing projection diagnostics.

Copy JSON runs an explicit bounded serialization attempt. It copies complete JSON only, up to 256 KiB in UTF-8; cycles,
accessors, unsupported values, sparse arrays and oversized data produce a visible explanation, never silent truncation.
Clipboard and Refetch failures use `cll-alert`. Data renders through Angular text interpolation.

## Refetch contract in ngx-lift

```typescript
refetchQuery<T = unknown>(key: QueryKey): Promise<T> | undefined;
```

The method looks up an existing entry, invokes the same manual-request machinery as reload with refresh=true and uses
its most recently registered loader/policies. It bypasses completed fresh data, joins a current pending request and
creates neither a query entry nor an observer. Missing keys return undefined. A destroyed client throws consistently
with other client operations; loader failures reject and update the normal query error state. Inactive entries retain
normal collection behavior. Inactive manual refetches restart retention at invocation, consistently with fetchQuery; a
pending read remains protected even after that retention interval elapses. The optional generic is a caller assertion
about cached data, not an inference from an untyped key. All observers of the selected key receive the result; unrelated
keys are unaffected.

## Production and installed-package boundary

`clr-lift/devtools` exports types first, development implementation second and a default no-op stub last. The no-op
imports only Angular's provider helper. The development implementation is packaged as the secondary entry point
`clr-lift/devtools/development`; the primary entry point does not re-export the provider, avoiding a dependency cycle.
The runtime isDevMode/browser guard is additional protection, not the mechanism for excluding the renderer.

Angular's application builder selects development/production package conditions. Custom builders must select development
only for development; default resolution safely produces no launcher. The demo's source aliases bypass installed export
maps, so its development file replacement mirrors the same provider boundary. Ordinary consumers use the single package
import above without replacement files. The production-built documentation preview is an explicit exception.

No runtime dependency is added. Verify conditional resolution and Angular-linked browser bundles against fresh installed
tarballs, including an ordinary clr-lift component in the same consumer. The production bundle must have no
panel/inspector implementation in eager or lazy output; an unloaded development chunk is insufficient. An empty provider
stub is allowed.

## Key and tag ownership

Demo keys use `['current-user']`, `['databases', id]` and `['projects', id]`, without placement/demo prefixes. The
profile query/mutation share `{type: 'current-user'}`. An auth namespace is optional when useful for grouping. Every
result-changing parameter or authorization scope remains part of identity. A singleton current-user key requires
clearing old-session data on account switching, or using an opaque session-scoped key. Never include credentials in
keys.

In large applications, domain-owned `*.queries.ts` modules contain key/tag factories and complete read definitions;
components own their observers and import those definitions. Equal keys must represent the same data/loader contract.
The team demo shows shared definitions and independent observer lifetimes. Renames/deletions require reference search
and domain review rather than a mutable global key registry. Keys also identify in-flight work when data reuse is
disabled.

## Demo and acceptance

The Angular Lift root uses provideQueryDevtools(). The queryResource page shows that app.config.ts setup plus a working
inline preview and matching component/HTML excerpts. All demo prose and library messages use supported locales with
runtime language switching. Structural JavaScript type markers and canonical identities remain technical values.

| Use case        | Required evidence                                                                                                                           |
| --------------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| Root lifecycle  | One launcher across navigation; duplicate registration and teardown; SSR guard and both render modes.                                       |
| Nonmodal panel  | Application focus remains available; repeated open/close, resizing, full height, narrow/dark/RTL and Escape/focus return in three browsers. |
| Query discovery | Native key/state/numeric filters, sort, pagination and retained view state; localized empty states.                                         |
| Inspection      | No new reads/observers/retention; errors, eviction, cycles, accessors, large arrays and limits.                                             |
| Refetch         | Selected loader only, shared consumer updates, deduplication, cached-data failure and missing/destroyed/inactive cases.                     |
| Distribution    | Fresh strict peers/types, development/default export behavior, installed Angular-linked production renderer exclusion.                      |
| Scale           | 200/2,000-entry list and 100,000-item payload checks, bounded DOM and measured snapshot/render cost.                                        |

## Local evidence

Data-first baseline validation, October 17, 2026 (latest full-list/expansion evidence follows below):

- Core suite: 883 tests pass, including targeted existing-key refetch, pending-read deduplication, cached-data failure,
  missing/destroyed clients and inactive collection.
- clr-lift suite: 322 tests pass. Inspector coverage includes closed/paused/disposed timer behavior, client switching,
  eviction, response expansion and paging, accessor/cycle handling, full-value copy, error inspection, in-place data
  refresh, composed state/tag filters, retained tag labels after eviction, view-read feedback and locale parity. Demo
  suite: 238 tests pass. Tooling: 16 checks and the two-space snippet formatter pass.
- All 219 Playwright cases are verified across Chromium, Firefox and WebKit: 213 passed in the full run, then six passed
  in a focused rerun after updating stale narrow-column and always-visible snapshot-button expectations. No application
  code changed between those runs. Coverage includes all 57 demo routes at desktop/narrow sizes and 11 demo languages.
  Checks verify panel actions, keyboard resizing, bottom positioning, selection focus/return, filters, dark mode and
  RTL. Individual tabs fit their scroll container and wrap long labels; this also prevents WebKit from swallowing a
  click during overflow scrolling.
- Fresh tarball consumers pass strict peers/types and zoneless/ZoneJS checks, including conditional provider loading,
  duplicate registration, ownership and teardown. Angular-linked browser bundles using another clr-lift component
  exclude the devtools renderer for production and include it for development.
- Three production browser checks confirm no global launcher and a working explicit documentation preview. Library/demo
  production builds, bundle isolation, lint/types, formatting and translation checks pass. Both the floating provider
  and copyable root setup are present in the app; no unimplemented provider example remains.
- The 100,000-item response opens its first 100 items and pages locally, without another request. Grid scale checks
  retain 20 DOM rows with 200 and 2,000 entries. Initial snapshot/grid work measured approximately 122 and 103 ms
  respectively in JSDOM under concurrent test load; these are test-environment measurements, not browser performance
  guarantees.
- Light/narrow and dark/RTL screenshots were inspected. Native top-layer positioning avoids playground clipping; Clarity
  semantic link/label tokens preserve themed state and action contrast.

Human assistive-technology and native-speaker acceptance, full SSR/hydration integration, CI, merge and publication
remain separate gates. Release preparation must select versions for both libraries. Inspection remains compatible with
the declared ngx-lift 21.3 peer minimum; Refetch controls are shown only when the client exposes refetchQuery. The
current matching workspace tarballs prove the full feature set, and a legacy-client regression proves read-only
inspection remains usable without that method.

Review hardening: asynchronous action feedback is scoped to the current inspector context, so closing, selecting a
query, or switching clients cannot receive feedback from an earlier action. Provider cleanup also releases a pending
installation when its injector is destroyed before the first render.

## Follow-up review contract

[Angular effect options](https://angular.dev/api/core/CreateEffectOptions) allow signal writes by default, including in
Angular 21; untracked keeps cleanup reads out of dependency tracking rather than granting write permission. Opening a
paused panel or switching its client takes one initial snapshot; pause suppresses periodic updates. An explicit refetch
settles the snapshot in its original open panel even after a tab/selection change, but completion from a previous panel
session or client must not change the current paused view.

Date previews and JSON copying use Date intrinsics rather than application getters or overridden serializers. Valid
dates copy as ISO strings and invalid dates as null. Resize bounds and separator values follow viewport changes and full
height; drag storage writes occur at completion. Copy feedback is cleared on context changes and destruction.

Earlier review validation, before the data-first revision: pnpm run validate passed with 883 core, 319 clr-lift and 237
demo tests, coverage gates, zero lint warnings, strict types, production builds, bundle checks and fresh installed
consumers. The 210 browser checks pass in Chromium, Firefox and WebKit. Nine additional drag repetitions verify
persistence and reopening after waiting for panel animation to finish. Regressions also cover paused client
changes/reopening, late refetch completions, stable tree focus, Date method getters, viewport/full-height separator
values and pending-read GC past the retention interval.

Full-list and expansion follow-up validation, October 17: pnpm run validate passes with 883 core, 325 clr-lift and 238
demo tests, lint/types, coverage, production builds, bundle checks and fresh strict-peer package consumers. The 24
affected browser checks pass across Chromium, Firefox and WebKit, including wide/compact lists, row refetch, composed
filters, bounded value expansion, narrow layouts, dark/RTL and 11 demo languages. Five additional WebKit reproductions
verify the full key-cell target after grid focus scrolling. Large-array expansion retains paging within the 500-row
budget; descriptor-based expansion preserves page offsets, avoids getters and terminates on cycles/depth limits.

Projection/layout follow-up: development and production builds report no NG8011 diagnostics without suppressions. Native
projected-row assertions verify tags, failure counts and Refetch cells; Key and Tags remain first/second with Clarity
automatic column sizing in both layouts. Only Expand all/Collapse all remain. pnpm run validate passes with 1,446 unit
tests and installed-package checks; all 24 targeted three-browser cases pass, including column order, projected
diagnostics, refetch, bounded expansion, filters, narrow/dark/RTL and supported demo languages.
