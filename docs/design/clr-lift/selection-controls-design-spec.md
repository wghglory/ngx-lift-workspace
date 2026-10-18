# Combobox and autocomplete

Owner: clr-lift maintainers. Package: clr-lift. Approval: feature API pending; template/contract coverage updated
October 17, 2026.

Status: **Draft; API approval pending**. Updated October 17, 2026. All new symbols are proposed. Shared requirements:
[development workflow](../component-development.md) and [staged form integrations](forms-compatibility-design-spec.md).

## Applicable contracts

Selection identity, CVA/validation, keyboard/overlay focus, localized messages and remote cancellation/paging apply.
Suggestion text and committed values stay distinct; no public cache or reusable engine is approved here.

## Background

Combobox selects known values; autocomplete edits text with suggestions. Search text, highlighted option, committed
value, and option label have separate identities. Multi-select pills represent selected values, not arbitrary search
terms. Keep these public semantics distinct even when a private overlay/request mechanism is shared.

## Goals

- G1: Users select one or several remote entities with clear loading, no-result, failure and retry states.
- G2: Users enter text efficiently with optional suggestions, without unexpected selection or text loss.
- G3: Applications handle large result sets without downloading or rendering the entire dataset.
- G4: Developers use simple typed options and the Angular 21 form integrations with Clarity presentation.

## Non-Goals

### Not now

tokenizing pasted text, creating remote entities, arbitrary object-valued forms, drag-sorting pills, and a public
headless selection framework. Add free-tag creation only through a separately reviewed use case and value contract.

### Outside this API

backend search indexing, authorization, unbounded global caches, or selecting all remote matches implicitly.

## Industry evidence and current gaps

| Reference                                                                                                                                                                                         | Verified behavior                                                                                     | Decision and gap                                                                                                |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------- |
| [Clarity async example](https://github.com/vmware-clarity/ng-clarity/blob/main/projects/website/src/app/documentation/demos/combobox/combobox-async.demo.html) and installed 18.4 types/templates | Multi-selection, selected pills, input event, loading and spinner already exist                       | Compose public APIs first; do not reimplement these merely because the initial assumption said they were absent |
| [NG-ZORRO Select](https://ng.ant.design/components/select/en)                                                                                                                                     | Remote search, multiple/tags, loading and scroll-end hooks                                            | Adapt remote states and bounded loading; do not copy every option or Ant styles                                 |
| [Material autocomplete](https://github.com/angular/components/blob/main/src/material/autocomplete/autocomplete.md)                                                                                | Text input with suggestions, separate display mapping, keyboard focus and optional required selection | Keep completion and entity-selection semantics explicit                                                         |
| [NG-ZORRO autocomplete](https://ng.ant.design/components/auto-complete/en)                                                                                                                        | Input/panel composition, grouping and configurable origin                                             | Keep a small default API; custom templates can follow proven demand                                             |
| [React Aria ComboBox](https://react-aria.adobe.com/ComboBox)                                                                                                                                      | Selection versus completion distinction, async collections and tags                                   | Adapt identity, separate input/value state and accessible interaction                                           |
| Existing application autocomplete (behavior reviewed)                                                                                                                                             | String options, CVA, local substring filtering, keyboard index and delayed blur                       | Rebuild independently; close gaps in disabled state, IME, listbox semantics, cancellation and focus races       |

Internal application code is behavioral context only; do not copy proprietary implementation into this MIT library. The
Clarity wrapper spike must prove form ownership, public filtering bypass, paging and keyboard behavior without private
member access. If it cannot, document the failing cases and review a Clarity-styled CDK/Angular Aria implementation. Do
not decide on a full replacement before that evidence exists.

## Use cases and acceptance

| ID  | Task                                                 | Outcome and failure behavior                                                                              |
| --- | ---------------------------------------------------- | --------------------------------------------------------------------------------------------------------- |
| S1  | Select one local owner                               | Store the stable owner key; clear produces null; duplicate labels remain distinct                         |
| S2  | Search a remote user directory                       | Debounced request, inline loading, error/retry; old responses never replace newer results                 |
| S3  | Edit preselected owners absent from the current page | Seed labels remain visible across searches; changing pages does not deselect                              |
| S4  | Select several owners as removable pills             | Keyboard and pointer add/remove once; overflow summary exposes all selected values                        |
| S5  | Search 100,000 server records                        | Fetch bounded pages, retain bounded results, render a bounded viewport; no fetch-all fallback             |
| S6  | Enter a name with optional suggestions               | Autocomplete keeps typed text when no suggestion is chosen; no fabricated selected key                    |
| S7  | Enter Chinese/Japanese via IME                       | Composition does not prematurely search, select, or submit; composition end triggers normal behavior      |
| S8  | Change tenant/filter while a page is loading         | Invalidate the old generation, reset cursor/results, retain only permitted selections under caller policy |
| S9  | Reset/disable/close/destroy during work              | No late UI writes or retained subscriptions; reopening follows documented reload policy                   |
| S10 | Navigate in a modal on a narrow screen               | Overlay follows scrolling/resizing, correct focus/escape behavior, no clipped controls                    |

## Developer learning journey and pedagogy plan

Prerequisites: Angular 21 forms and current Clarity combobox capabilities; proposed exports remain unavailable.

| Reader task                       | Learning outcome                                                         | Destination / working example                            |
| --------------------------------- | ------------------------------------------------------------------------ | -------------------------------------------------------- |
| Select one remote entity          | Explain selected identity, displayed label, clearing and submitted value | This spec, proposed combobox example                     |
| Add multi-selection or completion | Handle query changes, pending/error/empty state and stale results        | This spec, proposed multi-combobox/autocomplete examples |

Validation and delivery: All feature tutorials are planned. Complete the Clarity composition spike and API review before
route/source, three form hosts and browser evidence. The public API and behavior sections below own exact options and
limitations; examples introduce them after the first task.

## Public API and examples

Use primitive keys (`string | number`) for initial combobox values. Local mode supplies `options`; managed remote mode
supplies `loadOptions`. Supplying both is a configuration error. The component owns debounce/request/paging in managed
mode; the application owns auth, endpoint mapping and business filters. Do not also require consumers to build an RxJS
pipeline.

```typescript
import type {Observable} from 'rxjs';

export interface SelectOption<V extends string | number> {
  value: V;
  label: string;
  disabled?: boolean;
}
export interface OptionRequest {
  query: string;
  cursor?: string;
  signal: AbortSignal;
}
export interface OptionPage<V extends string | number> {
  items: readonly SelectOption<V>[];
  nextCursor?: string;
}
export type OptionLoader<V extends string | number> = (
  request: OptionRequest,
) => Observable<OptionPage<V>> | Promise<OptionPage<V>>;
```

Proposed exports: `ComboboxComponent` (`cll-combobox`, value `V | null`) and `MultiComboboxComponent`
(`cll-multi-combobox`, value `readonly V[]`). Separate selectors keep single/multiple value inference clear; review this
against one selector with a `multiple` input before approval. Shared defaults: `label`, `placeholder`, `options` or
`loadOptions`, `minSearchLength=0`, `debounceMs=250`. Remote context changes use a small `requestKey` input scoped by
tenant/filter; context changes invalidate requests even when the loader function identity remains stable.
`selectedOptions` seeds label metadata for edit flows and is not another source of selected values. A supplied seed does
not select anything; the form value owns selection. Unknown IDs display an explicit unavailable label and remain
removable until the caller supplies metadata or changes the value. No automatic silent deletion.

```typescript
import {Component, inject} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {FormControl, ReactiveFormsModule} from '@angular/forms';
import {ComboboxComponent, MultiComboboxComponent, type OptionLoader} from 'clr-lift'; // proposed

@Component({
  imports: [ReactiveFormsModule, ComboboxComponent, MultiComboboxComponent],
  template: `
    <cll-combobox label="Owner" [options]="owners" [formControl]="owner" />
    <cll-multi-combobox
      label="Reviewers"
      [loadOptions]="searchUsers"
      [selectedOptions]="initialReviewers"
      [formControl]="reviewers"
    />
  `,
})
export class OwnerExample {
  private readonly http = inject(HttpClient);
  readonly owners = [{value: 'u1', label: 'Ada'}];
  readonly owner = new FormControl<string | null>(null);
  readonly reviewers = new FormControl<readonly string[]>(['u1'], {nonNullable: true});
  readonly initialReviewers = this.owners;
  readonly searchUsers: OptionLoader<string> = ({query, cursor}) =>
    this.http.get<{items: {value: string; label: string}[]; nextCursor?: string}>('/api/users', {
      params: {q: query, ...(cursor ? {cursor} : {})},
    });
}
```

HttpClient Observables are accepted directly and canceled by unsubscribe. Promise loaders use the supplied AbortSignal;
all results also pass a generation check because not every Promise honors cancellation. No Observable adapter is
required. Autocomplete's default surface is `AutocompleteComponent` / `cll-autocomplete`, value `string`, with
`options: readonly string[]` for local completion. A remote `loadSuggestions` callback uses the same request context and
a string-page result; do not publish a generalized loader framework solely to share these two type aliases.

```html
<!-- Proposed; import AutocompleteComponent and FormsModule in the host. -->
<cll-autocomplete
  label="Database name"
  [options]="['orders', 'analytics']"
  [(ngModel)]="databaseName"
  name="databaseName"
/>
```

Autocomplete emits text edits normally; choosing a suggestion replaces the text once. Arrow highlighting does not
commit. Enter during IME composition does not choose an option. Escape dismisses the panel without discarding text. Blur
retains free text. Entity-only required selection uses the combobox. Avoid an initial `string | Entity` value union. The
shipping demos add ngModel and typed Reactive Forms + `toSignalForm` from the shared contract.

The [shared forms contract](forms-compatibility-design-spec.md#behavior-and-architecture) owns reset/clear differences,
Angular `updateOn`, intrinsic validation, composite touch and disabled-value serialization. Search loading does not
automatically mark the form pending. A Clarity composition spike must prove those behaviors through real Angular form
directives before implementation is considered verified; existing Clarity CVA support alone is insufficient.

## Behavior and architecture

States: idle/below-threshold → debouncing → initial loading → results/empty/error. Appending has separate loading/error
state so existing options and selected pills remain usable. A new query immediately invalidates the prior request, even
during debounce. First result resolves a finite loader; empty Observable completion is an error, not an empty page.
Close cancels outstanding work; reopen starts the current query again. No request occurs below the minimum length. Retry
uses the current query/cursor/generation and does not replay a superseded page. One append request at a time;
deduplicate by value, reject a repeated non-advancing cursor, and keep the server's order without client refiltering.

Server paging reduces network/data volume; virtualization reduces DOM cost. They are separate requirements. Propose a
50-item demo server page and at most 500 retained result options per query; after the cap, ask users to refine the
query. Selected metadata is tracked separately. Benchmark a 10,000-item local list and 100,000-record remote fixture,
keeping rendered option DOM below 100 at the chosen viewport. Record actual input latency and peak retained items. Start
with fixed-height text rows; variable-height virtualization requires another reviewed contract. An accessible Load more
action is available outside the listbox options, even when scroll-end loading is supported.

## Clarity, accessibility, and localization

Follow the [WAI-ARIA combobox pattern](https://www.w3.org/WAI/ARIA/apg/patterns/combobox/): named trigger,
listbox/options, expanded/controls/active-descendant state, focus on the input, and an active option that actually
exists in the DOM. Virtual navigation scrolls an option into view before referencing it. Disabled items are skipped.
Pills have named remove buttons and keyboard navigation; announce removal/result/error counts without announcing every
keystroke. Use Clarity containers, focus/invalid states, pills, spinners and design tokens. No Material/Ant runtime
styling.

## Demo and validation plan

Demo/playground cases S1–S10 cover the Angular 21 form integrations, latency/error/retry, out-of-order responses,
duplicate labels, disabled options, prefill, pill overflow, large data, IME, modal scrolling, runtime language switch
and dark/compact/RTL. Translate control states, remove labels, result counts, API docs and demo content in every
supported dictionary. Unit/type tests verify value inference, generation/cancellation, page dedup/caps, cursor loops,
label retention, events, reset and cleanup. Three-browser E2E verifies actual focus, selection/pill removal, stale
results and virtual navigation.

Deliver local single select → remote states/paging → multi-select → autocomplete → scale verification, each functional.
Pending API decisions: separate selectors, primitive keys, seeded-label behavior, remote request context, cap defaults,
and wrapper versus independently styled implementation after the public-API spike. No implementation or benchmark is
done.

## Platform delivery requirement

Initial delivery supports Angular 21 ngModel, typed Reactive Forms, and Reactive Forms + `toSignalForm` where this
feature owns a value. Native signal-field integration is deferred until the platform upgrade, then required under the
[shared forms contract](forms-compatibility-design-spec.md). Display-only surfaces and form containers have no field
value of their own. This requirement does not make proposed exports available.

## Terminology

Query text, highlighted option, committed primitive key and seeded display metadata are independent. A result page
belongs to one request context/generation; native signal fields remain the second delivery phase.

## Compatibility, rollout, and risks

Angular 21 CVA is the first target; native field support follows the deferred platform upgrade. No selected renderer or
runtime dependency is approved. Owner: maintainers must prove public Clarity filtering/paging and strict installed
consumer types before replacing its renderer. SSR/virtualization behavior requires separate acceptance.

## Review decisions and delivery

Feature APIs remain pending. Before implementing S1, review the public-Clarity composition spike, primitive value types
and empty/reset semantics; before remote delivery approve request context, bounded pages and cancellation. S1/S6 cover
G2/G4; S2/S3/S8/S9 cover G1; S5 covers G3. Acceptance demos/tests remain planned.

## Evidence

Checked against the current public exports and source at base `e4a43f9` on October 16, 2026. No proposed feature exports
or feature implementation exist; all feature demos/tests and measurements described here remain planned.
