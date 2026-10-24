# Breadcrumbs

Owner: clr-lift maintainers. Package: clr-lift. Updated October 24, 2026. Approval: the maintainer accepted the three
grill decisions, approved continuing with the construction approach, and requested configurable breadcrumb font size.
The five-ticket delivery breakdown is approved. The first ticket proves the exact SPA/helper integration and interaction
details before public exports.

Status: **Ticket #186 simple breadcrumb and #187 responsive ancestry implemented**, authorized by the maintainer's
`/implement` request. The component/item/link-template contracts exercised in #185 are approved for this increment.
Responsive ancestry (#187) is implemented below. The public object-key helper (#188) and scale hardening (#189) have
separate delivery evidence.

### Ticket #187 responsive ancestry

The maintainer's `/implement` request authorizes the approved overflow contract. Add `maxVisible` (default four, minimum
two, nonfinite values use four), counting actual items only. Preserve first/current and a contiguous suffix of recent
ancestors. A browser-only intrinsic text probe observes current inherited typography independently of host width;
resize, visual viewport and font-loading events schedule one measurement per animation frame. At insufficient widths,
remove recent ancestors before truncating essential labels. A disclosure is also available when truncation alone hides
text, including a singleton. Unmeasured rendering uses the count ceiling; no browser globals are required during render.

Use the approved manual native popover and Clarity surface/link/focus tokens. All supplied locations appear in order in
the scrollable panel, with full context/depth and noninteractive current text. Scrolling, rather than filtering,
provides reachability in this increment. Panel primary typography inherits `--cll-breadcrumb-font-size`; secondary
context uses relative sizing. Native anchors and consumer-owned SPA templates retain destinations and modified-click
behavior. Opening focuses the first ancestor; Escape/close restore the trigger, Shift+Tab returns to it, forward Tab
exits normally, and path replacement dismisses without restoring host route focus. Measurement rescues focus only if it
removes this instance's focused trail control. Observers/listeners and pending measurement work are disposed on
destruction.

Owned messages are show details, panel name and close, plus the deep playground description, width control, path
replacement and stationary-list explanation. All eleven locales and existing library aliases ship together. Public-host,
three-browser, accessibility and installed-consumer checks cover this increment. SSR/hydration support remains unclaimed
until exercised with an actual server/hydration harness; count-based rendering is the server-safe fallback.

### Ticket #186 public increment

Export `BreadcrumbComponent`, `BreadcrumbItem` and `BreadcrumbLinkContext` from `clr-lift`. The component accepts
required immutable `items`, optional `ariaLabel` (localized Breadcrumb), optional consumer-owned
`linkTemplate: TemplateRef<BreadcrumbLinkContext>`, and emits original addressless ancestors via `navigate`. It wraps
all supplied locations in its original #186 behavior; #187 adds the responsive ceiling and details described above.
Empty trails render no landmark; singleton trails render current text. Duplicate IDs, invisible labels, blank navigation
names and blank or unsafe destinations throw developer diagnostics. IDs may be empty and repeated labels are valid.
Destinations are relative URLs or URLs with http, https, mailto, tel or ftp schemes; script/data and other schemes are
rejected before rendering, including on the current item. No URL or identity is ever built from labels.

Destination syntax is also checked with the URL parser against a fixed HTTPS base, independent of browser globals.
Malformed absolute or protocol-relative URLs (for example `https://` or `//[`) throw the same diagnostic. Parsing is
validation only: the supplied destination is rendered unchanged, preserving relative routes, queries and fragments.

Each list item exposes its supplied context or ordered display trail plus localized one-based depth as a description.
The public CSS property `--cll-breadcrumb-font-size` inherits and accepts Angular style binding, falling back to Clarity
inline typography. Relative line height and wrapping allow live font changes without measurement or browser listeners;
#187 can observe the resulting host size. No runtime dependency or router peer is added. The component is safe to render
without browser globals; hydration adds no client-only DOM work. Native links retain normal browser actions; custom SPA
anchors remain owned by the consumer. Action controls explicitly use `type="button"` inside native forms.

Owned library messages: navigation name and depth description. Owned demo messages: title, introduction, SPA example,
API explanation, native/action/empty examples and selected location/form state. All supported locales and library
aliases ship together. The public demo route is `/clr-lift/components/breadcrumb`, with a database/server fixture,
copyable playground source, native and SPA navigation, action identity, singleton/empty and typography examples.

Published specification: [GitHub issue #184](https://github.com/wghglory/ngx-lift-workspace/issues/184), labeled
`ready-for-agent` by the `to-spec` workflow. The component naming was approved as `BreadcrumbComponent` /
`cll-breadcrumb`. The helper contract was subsequently approved for #188; see its delivery evidence below.

## Conversation synthesis and review boundary

After `grill-with-docs` and `to-spec`, the maintainer explicitly answered “yes for the 3 decisions.” This approval
covers root semantics, preserving SPA link behavior, and the anchored nonmodal surface. The maintainer then requested
practical database/bucket examples and an explanation of API data and breadcrumb construction. This revision adds that
developer learning path. The subsequent “I approve, continue” records approval of the construction approach and
continuation to delivery planning; it does not make the helper an existing export.

| Decision         | Current evidence and proposed resolution                                                                                                                                                                                                | Review state                                                      |
| ---------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------- |
| Navigation root  | Treat the first caller-supplied location as the navigation root, including an authorized prefix; reachability covers supplied ancestors only.                                                                                           | Approved in chat                                                  |
| SPA links        | Preserve browser link behavior for URL-addressable SPA ancestors. Existing demo navigation uses real anchors with Angular RouterLink. The action-button example below covers addressless state transitions, not the final SPA contract. | Behavior approved; exact integration seam under review            |
| Ancestor surface | Use an anchored, nonmodal Clarity-styled panel so opening ancestry does not move the object list. This replaces the earlier inline-card recommendation.                                                                                 | Approved; demo-local preview and positioning/focus contract below |

The library currently declares no direct Angular Router peer. Review either a consumer-owned link integration or an
explicit router contract before adding public routing types/dependencies. The native-link versus action-only split below
must not be treated as complete SPA integration.

Test primarily through the rendered public component in a host and the demo's real browser journeys. Reuse existing
tooltip focus/Escape browser tests, themed accessibility scans, navigation journeys and packed-consumer infrastructure.
Add public-package contract checks; keep partition/filter internals private. Confirmation of these test boundaries was
requested while preparing the parent issue. Ticket #185 now exercises the demo-local interfaces through helper tests and
real browser journeys; public-package component tests remain part of the subsequent delivery tickets.

Approved behavior and construction direction carry forward into the delivery plan. The first slice must demonstrate the
exact link/helper integration without reopening those approved product decisions. Do not treat an addressless action as
routed-link support, or a proposed example as an already available export.

## Applicable contracts

Rendered navigation, ancestor identity, resize/focus cleanup and localization apply. Prefixes are navigation state, not
a form value; no request cache or backend authorization is introduced.

## Background

Object-store prefixes can be much deeper than an application's route hierarchy. Every ancestor must remain reachable
without expanding a 30-level path across the page. Installed Clarity 18.4.0 supplies breadcrumbs, but its public inputs
cannot preserve the root while exposing a bounded, searchable ancestor surface.

## Goals

- G1: Users can reach any ancestor without a long wrapping breadcrumb consuming the page.
- G2: Long, repeated or localized folder names remain identifiable on narrow screens.
- G3: Applications retain ownership of routing, exact object keys and authorization.
- G4: The component uses Clarity typography, controls, spacing, density and themes.

## Non-Goals

### Not now

a full file browser, arbitrary descendant search, drag/drop, rename, an editable address bar, custom item templates,
remote filtering, virtual scrolling, or an overlay configuration API. The proposed first increment uses an anchored,
nonmodal ancestor panel.

### Outside this API

silently normalizing object-store keys as filesystem paths or fetching folder permissions. Breadcrumb is navigation;
ngModel/CVA/Signal Forms do not describe its value. It can sit beside any form.

## Industry evidence and current gaps

Primary sources inspected October 24, 2026; upstream default-branch links can change. Installed Clarity **18.4.0**
declarations and runtime bundle establish the local baseline.

| Source                                                                                                                                                                              | Verified source behavior                                                                                                                                                                                                                  | Adopt, adapt, or reject                                                                                                                                                                    |
| ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| [Clarity breadcrumbs](https://github.com/vmware-clarity/ng-clarity/blob/main/projects/angular/layout/breadcrumbs/breadcrumbs.ts), installed breadcrumb declarations/template/styles | Only `items` is a public input. The display limit is three; the template slices the last items, initially hiding a deep path's root. Expansion displays every item and the row wraps. No public slot, width budget or search hook exists. | Keep Clarity appearance, anchors and current-location semantics. A wrapper cannot satisfy G1/G2. Reject subclassing protected limits, private DOM queries and internal template overrides. |
| [Material UI Breadcrumbs](https://github.com/mui/material-ui/blob/master/packages/mui-material/src/Breadcrumbs/Breadcrumbs.js)                                                      | Configurable maximum and before/after counts; ellipsis expands all items and relocates focus.                                                                                                                                             | Adapt root/recent presentation and explicit focus ownership. Replace full inline expansion with a bounded ancestor panel. Reject Material styling/dependencies.                            |
| [NG-ZORRO breadcrumb](https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/components/breadcrumb/breadcrumb.component.ts)                                                          | Projection and optional automatic ancestry from activated routes.                                                                                                                                                                         | Keep caller-owned ancestry. Reject route-derived object prefixes and Ant styling.                                                                                                          |
| [Angular Material list documentation](https://github.com/angular/components/blob/main/src/material/list/list.md)                                                                    | Distinguishes navigation anchors, action buttons and selection-list options.                                                                                                                                                              | Adopt native navigation list semantics. Reject listbox/command-menu roles for a region containing links and a filter.                                                                      |

Recommendation: a small semantic `nav`/`ol` renderer with scoped layout CSS and public Clarity tokens, buttons, icons,
input and card styles. Do not copy internal `.clr-breadcrumb-*` CSS or introduce dependencies. Continue recommending
`clr-breadcrumbs` for ordinary short route hierarchies. This is a source-based gap assessment, not a rendered spike.

## Use cases and acceptance

| ID  | Task                                     | Acceptance                                                                               |
| --- | ---------------------------------------- | ---------------------------------------------------------------------------------------- |
| B1  | Navigate a 30-level object prefix        | Root, recent ancestors and current item stay visible; every hidden ancestor is reachable |
| B2  | Choose between identically named folders | Full ancestor context appears in the hidden list; stable keys prevent ambiguity          |
| B3  | Use a narrow viewport or 200% zoom       | Width-aware collapse, readable current label and accessible full name                    |
| B4  | Open an ancestor in another tab          | Real supplied links preserve standard browser behavior                                   |
| B5  | Change route while overflow is open      | Close stale content; the application owns focus after navigation                         |
| B6  | Navigate application state without URLs  | Ancestor button emits its original item; caller replaces the path; no form submission    |
| B7  | Browse 100 levels or change language     | Local search and runtime locale changes preserve order, identity and reachable ancestors |

B1/B3 cover G1; B2/B3/B7 cover G2; B4/B5/B6 cover G3; every rendered case covers G4. An empty filter result keeps the
input available for recovery. Empty and one-item paths, repeated labels, exact special-character URLs and external path
replacement belong to these acceptance cases.

## Developer learning journey and pedagogy plan

Prerequisites: a standalone Angular 21 host and ordered ancestor locations; no router or forms provider is required for
native links. The proposed demo destination is `/clr-lift/breadcrumb`.

| Reader task                          | Learning outcome                                                        | Destination / working example                             |
| ------------------------------------ | ----------------------------------------------------------------------- | --------------------------------------------------------- |
| Navigate to an ancestor              | Import one component and supply native links including current location | First playground: three-item path                         |
| Navigate a deep path at narrow width | Use overflow, context and search while retaining keyboard focus         | Deep-path playground: 30/100 levels and constrained width |
| Integrate application state          | Own exact prefixes and respond to action navigation                     | Action-mode playground with reset and a native form host  |
| Look up edge behavior                | Find identity, defaults, focus and SSR contracts                        | Demo API reference and this spec                          |

Add the two maintainer-requested teaching tasks: construct `Database > Sql servers > Sql server 1` from known route
labels/current entity data without context boilerplate; construct
`Buckets > bucket-1 > folder-1 > folder-nested-2 > object-4` from bucket/key state using the public helper and an
application URL factory. Demonstrate a direct link without click history and distinguish folder listing from object
details.

Validation and delivery: all journeys, the route and compiled playgrounds remain planned. Use `cll-page-container`,
`cds-layout` and `app-demo-playground`; show a first useful preview before advanced API tables. Browser navigation,
resize, keyboard and packed-consumer checks will verify the examples after implementation.

## Public API and examples

### Ticket #185 interaction preview

Implement a demo-local preview at `/clr-lift/components/breadcrumb-preview`. This ticket exercises provisional
contracts; it does not add library exports. The renderer accepts an optional `TemplateRef<BreadcrumbLinkContext>`
(`{$implicit: BreadcrumbItem}`) for URL-bearing ancestors. The application template supplies a real anchor and owns
RouterLink/UrlTree conversion; the renderer's default is a native `href` anchor. Addressless ancestors emit the original
item through `navigate` from `type="button"` controls.

The synchronous helper accepts `{bucket, key, kind, rootPrefix?, emptySegmentLabel, hrefFor}`. `kind` is explicitly
`'prefix' | 'object'`; callback data is a discriminated bucket/prefix/object union. An optional nonempty
slash-terminated `rootPrefix` becomes the first supplied location and excludes the bucket and all higher prefixes.
Prefix keys must be empty (bucket root) or slash-terminated; object keys must be nonempty. Exact empty, repeated,
percent, Unicode and dot segments survive unchanged. Empty segments use the caller's localized `emptySegmentLabel`;
whitespace-only segments use JSON-quoted display text while retaining exact raw locations. A slash-terminated object
includes its same-key prefix as an ancestor and a distinct object leaf. Invalid/outside-root requests throw developer
diagnostics. IDs encode `[kind, bucket, exactPrefixOrKey]` as JSON, independently of URLs and labels.

Use a manual native popover for the named nonmodal region, preserving DOM order and inherited typography in the top
layer. Position below the trigger when there is room, otherwise above, clamped to the viewport with scrollable wrapped
content. Focus the first ancestor on open; Tab and Shift+Tab follow document order with no trap. Escape/close restore
the trigger, outside pointer/focus dismissal preserves the external target, and path replacement closes without focus
restoration. Window/container/font changes reposition the preview panel, including open-panel ResizeObserver updates.
Production width partitioning and filtering remain later tickets. No new dependency or router peer is introduced.

Owned preview messages: title/scope, database/storage/action example names, Database/Sql servers/Buckets labels,
navigation/region/trigger/close names, empty-segment label, font-size/reset controls and selected-location summary.
Complete all eleven demo locales. Developer contract JSON and exact domain fixtures remain untranslated.

#### Run and inspect the preview

From the workspace root:

```sh
NX_SOCKET_DIR=/tmp/ngx-lift-nx pnpm nx run demo:serve --port=4307 --hmr=false
```

Open <http://localhost:4307/clr-lift/components/breadcrumb-preview>, also listed as **Breadcrumb interaction preview**
in Components. The short socket directory avoids the macOS Nx socket-length limit; it does not change project files. The
preview is intentionally contained under
[the demo page](../../../apps/demo/src/app/clr-lib/pages/breadcrumb-preview/breadcrumb-preview.component.ts), not either
library. Source contracts are in
[the provisional contract module](../../../apps/demo/src/app/clr-lib/pages/breadcrumb-preview/breadcrumb-preview.contract.ts).
Inspect the state disclosure for generated IDs, labels, contexts, destinations, selected action payload and form-submit
count. Select raw-key fixtures to exercise bucket root, repeated names, leading/repeated separators, literal `%2F`,
Unicode, dot segments and a permitted-prefix root with a slash-ending object. Fixture selection is URL-addressable too.

#### Exact preview signatures and link integration

```ts
interface BreadcrumbItem {
  readonly id: string;
  readonly label: string;
  readonly href?: string;
  readonly context?: string;
}
interface BreadcrumbLinkContext {
  readonly $implicit: BreadcrumbItem;
}
type ObjectPathLocation =
  | {readonly kind: 'bucket'; readonly bucket: string}
  | {readonly kind: 'prefix'; readonly bucket: string; readonly prefix: string}
  | {readonly kind: 'object'; readonly bucket: string; readonly key: string};
interface BuildObjectPathBreadcrumbsOptions {
  readonly bucket: string;
  readonly key: string;
  readonly kind: 'prefix' | 'object';
  readonly rootPrefix?: string;
  readonly emptySegmentLabel: string;
  readonly hrefFor: (location: ObjectPathLocation) => string;
}
declare function buildObjectPathBreadcrumbs(options: BuildObjectPathBreadcrumbsOptions): readonly BreadcrumbItem[];
```

The preview component has required `items` and `ariaLabel` signal inputs, optional `maxVisible` (default 4), optional
`linkTemplate: TemplateRef<BreadcrumbLinkContext>`, and `navigate: OutputEmitterRef<BreadcrumbItem>`. The proposed
production selector stays `cll-breadcrumb`; the runnable experiment uses `app-breadcrumb-preview-trail`. A production
localized default for `ariaLabel` belongs to #186. There is no item callback for URL activation: native links keep their
browser behavior and do not emit `navigate`. Current-location destinations are never interactive. Without a custom
template, ancestors with destinations render as ordinary anchors.

The application imports Angular RouterLink and Router and supplies this template:

```html
<app-breadcrumb-preview-trail [items]="items" ariaLabel="Buckets" [linkTemplate]="spaLink" />
<ng-template #spaLink let-item>
  <a style="font-size: inherit" [routerLink]="urlTree(item.href)" [attr.title]="item.context">{{ item.label }}</a>
</ng-template>
```

`urlTree(href: string): UrlTree` calls application-injected `Router.parseUrl(href)`. Parsing the complete URL preserves
its query parameters; passing a query-bearing string directly as RouterLink commands would encode it into the path. The
application template owns the real anchor, destination, optional target/rel and context description. It must preserve
native modified/middle/context-menu activation and inherit font size. This small template seam keeps router types out of
the item model and component imports. No runtime dependency, storage SDK, Angular Router peer or library export is
added. The existing Angular 21/Clarity 18.4 baseline is unchanged. The helper's `hrefFor` is called synchronously once
for every returned location, including current, and not for excluded higher locations.

| Input or boundary                                    | Settled preview behavior                                                                                                                                   |
| ---------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Empty key with `kind: 'prefix'`                      | Bucket root only; no synthetic empty prefix                                                                                                                |
| Empty key with `kind: 'object'`                      | Developer error; empty object keys are not supported                                                                                                       |
| Nonempty prefix                                      | Must end in `/`; arbitrary search prefixes are rejected                                                                                                    |
| `rootPrefix`                                         | Optional nonempty complete slash-terminated prefix; exact `startsWith` boundary; root itself is included, bucket/higher prefixes excluded; mismatch throws |
| Empty/repeated/leading segments                      | Preserve every exact cumulative prefix; use required caller-localized `emptySegmentLabel` only for empty display labels                                    |
| Percent escapes                                      | Literal `%2F` stays `%2F`; the application encodes the raw key once when constructing a URL                                                                |
| Unicode and dot segments                             | Preserve exact code units, including combining sequences, `.` and `..`; no normalization                                                                   |
| Object key ending `/`                                | Same-key prefix ancestor and separate object leaf with an empty-segment display label; different kind-based IDs/destinations                               |
| Bucket/prefix/object identity                        | Stable JSON tuple `[kind, bucket, exactKeyOrPrefix]`; labels and destinations never determine identity                                                     |
| Blank bucket/empty-segment label/URL callback result | Developer error; no silent destination fallback                                                                                                            |
| Authorization and existence                          | Application/server responsibility; this helper validates structure only and makes no network calls                                                         |

#### Settled panel and typography behavior

The overflow trigger controls a named `role="region"`, not a menu/listbox/dialog. Native `popover="manual"` places the
surface in the top layer, outside ancestor clipping while retaining DOM ancestry and CSS variables. The panel contains a
wrapped full-label path, ordered hidden ancestors with exact context, and a localized Close button. It never moves
surrounding content. No backdrop or focus trap is used. Trigger state uses `aria-expanded` and `aria-controls` with
per-instance IDs. Decorative separators are hidden from assistive technology.

Opening focuses the first hidden ancestor. Shift+Tab from that first control explicitly closes and returns to the
trigger. Tab from the final Close control hands focus to the next visible document control and closes; intermediate
controls use native Tab order. Explicit boundary handoff resolves observed WebKit top-layer tab-order differences.
Escape, Close and toggle-close restore trigger focus. Outside click/focus dismisses while preserving the external focus
target; a nonfocusable outside click restores a previously focused trigger so focus is not stranded in hidden content.
Navigating/replacing items closes without restoring focus; the application owns route focus. Listeners and observers are
removed on destruction.

Position below the trigger if there is enough room, otherwise on the side with more space; clamp to an 8px viewport
inset, wrap long text, and scroll within the available block size. Window resize, scrolling and host/open-panel
ResizeObserver events reposition the open panel. The page's deliberately clipping preview container demonstrates the
top-layer behavior. There is no generalized overlay engine or legacy-browser fallback. Production width partitioning,
stale-range focus rules, 30/100-level performance, filtering and SSR/hydration remain subsequent acceptance work.

`--cll-breadcrumb-font-size` defaults to Clarity's `--clr-base-typography-font-size-inline`. The range control changes
it at runtime; Reset removes the override. List items, ordinary links, host-supplied SPA links, breadcrumb action
buttons and panel labels use the same size; secondary context uses `0.85em`. The top layer retains the per-instance
override. Example:

```css
app-breadcrumb-preview-trail {
  --cll-breadcrumb-font-size: 1rem;
}
```

Locale switching changes demo names and helper empty-segment labels. It replaces the preview item list and therefore
closes an open panel; preserving a filter/query through locale changes is deferred with filtering. This preview wraps
rows at narrow widths instead of claiming the production width-aware partitioning promised in #187.

The standalone `BreadcrumbComponent` / `cll-breadcrumb` exports this item interface:

```ts
// Public item export from 'clr-lift' (#186). Further overflow inputs below remain deferred.
export interface BreadcrumbItem {
  readonly id: string;
  readonly label: string;
  readonly href?: string;
  readonly context?: string;
}
```

| Member       | Type                                       | Default and contract                                                                                   |
| ------------ | ------------------------------------------ | ------------------------------------------------------------------------------------------------------ |
| `items`      | required `readonly BreadcrumbItem[]` input | Ordered root through current location; never mutated                                                   |
| `maxVisible` | `number` input (#187)                      | `4`; ceiling on actual path items including root/current, excluding overflow; width may reduce it      |
| `ariaLabel`  | `string` input                             | Localized “Breadcrumb”; caller can supply a translated name distinguishing multiple landmarks          |
| `navigate`   | `BreadcrumbItem` output                    | Emits the original ancestor item only when it has no `href`; native links do not also emit this action |

`linkTemplate?: TemplateRef<BreadcrumbLinkContext>` is also available in #186; its `$implicit` value is the original
item. Consumers own the real anchor and RouterLink integration. The `maxVisible` input is implemented in #187. The
generic renderer is named `BreadcrumbComponent` / `cll-breadcrumb` for both application and object-store paths; the
public `buildObjectPathBreadcrumbs` helper remains specific to exact object keys. No published breadcrumb API is being
renamed because the increment is unreleased.

### Where items and context come from

The renderer consumes an ordered list of locations. A short application hierarchy is normally built from known route
structure plus the current entity's display name; it needs no path parser or explicit `context` values:

```ts
// Proposed component input; the server supplies the entity ID/name.
const server = {id: 'sql-1', name: 'Sql server 1'};
const items: readonly BreadcrumbItem[] = [
  {id: 'database', label: 'Database', href: '/database'},
  {id: 'sql-servers', label: 'Sql servers', href: '/database/sql-servers'},
  {id: server.id, label: server.name},
];
// Database > Sql servers > Sql server 1
```

Translate application-owned route labels. The final item is current text; previous items have caller-owned destinations.
`context` is optional display detail used in the ancestor panel/search. A caller does not need to repeat every label or
manually concatenate a full path for ordinary navigation. Without explicit context, the renderer derives a display-only
label trail and depth from the supplied list. That display trail never becomes a destination or storage key.

For object navigation, distinguish three sources of data:

| Data                             | Source                                                                    | Purpose                                                         |
| -------------------------------- | ------------------------------------------------------------------------- | --------------------------------------------------------------- |
| Bucket identity/name             | Bucket listing, application route or backend metadata                     | Bucket crumb and subsequent object-list requests                |
| Current prefix or object key     | Application route and selected API entry; also available on a direct link | Determines the ancestor chain without remembering click history |
| Immediate child prefixes/objects | Object-list API response                                                  | Populates the content list, not the ancestor chain              |

### Typical object-store API flow

For **S3 general purpose buckets**, object keys are flat strings. Slashes conventionally group them into a visual
hierarchy; ordinary folders need not exist as independent resources. A zero-byte folder marker is not required for an
ancestor to appear in the UI. See the official
[folder model](https://docs.aws.amazon.com/AmazonS3/latest/userguide/using-folders.html).

The usual navigation flow uses [ListBuckets](https://docs.aws.amazon.com/AmazonS3/latest/API/API_ListBuckets.html) for
the bucket page, then [ListObjectsV2](https://docs.aws.amazon.com/AmazonS3/latest/API/API_ListObjectsV2.html) with a
known bucket, current `Prefix` and `Delimiter: '/'` for each folder page. In SDK-shaped notation:

```ts
// Illustrative API data, not an SDK dependency or executable request.
const request = {Bucket: 'bucket-1', Prefix: 'folder-1/', Delimiter: '/'};
const response = {
  Prefix: 'folder-1/',
  CommonPrefixes: [{Prefix: 'folder-1/folder-nested-2/'}],
  Contents: [{Key: 'folder-1/readme.txt', Size: 120}],
};
```

The response is partial illustrative data, not a complete SDK response. `CommonPrefixes` supplies grouped child
prefixes; `Contents` supplies individual object keys at that listing level. Pagination belongs to the content list.
Clicking a returned child prefix updates route state and repeats the listing with that exact prefix. Clicking an object
uses its full key for the details/download flow. A backend proxy may reshape these fields; there is no universal JSON
folder-level API. The listing does not provide an ancestor array or guarantee ancestor permissions.

For a direct link to `bucket-1` and key `folder-1/folder-nested-2/object-4`, the bucket/key are already sufficient to
derive the display trail under an explicit slash-delimited browsing policy. No request per ancestor, folder-marker
lookup or traversal of all objects is needed. See the official
[prefix/delimiter model](https://docs.aws.amazon.com/AmazonS3/latest/userguide/using-prefixes.html).

### Optional object-path construction helper

Keep the renderer generic enough for both examples. Add an opt-in, synchronous `buildObjectPathBreadcrumbs` helper that
understands the caller-selected slash-delimited browsing convention. The helper is **implemented in #188**; it makes no
SDK calls and adds no storage-provider dependency. This explicit helper refines the earlier no-parser boundary: the
renderer never parses keys, while a caller may opt into the helper's documented delimiter policy.

```ts
// Public usage; compose translated application items outside the helper.
const items = [
  {id: 'buckets', label: 'Buckets', href: '/buckets'},
  ...buildObjectPathBreadcrumbs({
    bucket: 'bucket-1',
    key: 'folder-1/folder-nested-2/object-4',
    kind: 'object',
    emptySegmentLabel: '(empty segment)', // Localize this application-owned label.
    hrefFor: toAppHref,
  }),
];
// Buckets > bucket-1 > folder-1 > folder-nested-2 > object-4
```

The application composes its translated leading items, such as “Storage” and “Buckets”; the helper returns the bucket
and key-derived locations. `kind` explicitly distinguishes browsing a prefix from inspecting an object. Do not infer the
resource kind from a trailing slash: valid object keys and folder-marker policies may use one too.

| Generated label   | Generated display context           | Location given to application URL callback        |
| ----------------- | ----------------------------------- | ------------------------------------------------- |
| `bucket-1`        | `bucket-1`                          | Bucket `bucket-1`                                 |
| `folder-1`        | `folder-1/`                         | Prefix `folder-1/` in that bucket                 |
| `folder-nested-2` | `folder-1/folder-nested-2/`         | Prefix `folder-1/folder-nested-2/` in that bucket |
| `object-4`        | `folder-1/folder-nested-2/object-4` | Object with that exact full key                   |

The helper generates distinct stable IDs from location kind, bucket and exact prefix/key, plus display labels and
context. Developers do not manually repeat the cumulative prefixes. The last returned location is current; the renderer
ignores its destination if one was generated.

Public callback location data is a discriminated union: a bucket location has bucket identity; a prefix location has
bucket and exact prefix; an object location has bucket and exact object key. The public type is `ObjectPathLocation`,
exported with `BuildObjectPathBreadcrumbsOptions`. An application URL factory can look like this:

```ts
// Application-owned example; route shapes and URL encoding remain host policy.
function toAppHref(location: ObjectPathLocation): string {
  const base = `/buckets/${encodeURIComponent(location.bucket)}`;
  switch (location.kind) {
    case 'bucket':
      return base;
    case 'prefix':
      return `${base}?prefix=${encodeURIComponent(location.prefix)}`;
    case 'object':
      return `${base}/object?key=${encodeURIComponent(location.key)}`;
  }
}
```

`ObjectPathLocation` is proposed, not an available export. The callback constructs application URLs, not S3 API or
signed download URLs. Route encoding happens once at this boundary; pass domain keys to the helper, not an already
URL-encoded query value. Approved SPA link behavior still needs the separate integration seam described above.

Helper review must settle prefix-root scoping for restricted users, empty segments/labels, leading/repeated delimiters,
empty bucket-root keys and object keys ending in `/`. Preserve exact prefix/key substrings; never use filesystem
normalization, trim data, drop empty segments with `filter(Boolean)`, reinterpret `..`, or decode each segment. A prefix
argument represents a complete folder-browsing prefix, not an arbitrary text-search prefix. The helper computes
structure, not existence or authorization; applications must supply/restrict the permitted navigation root.

Acceptance examples include bucket root, current nested prefix, direct-linked object, repeated folder names, unusual
exact keys and the explicit authorized-prefix root. For opaque parent-ID APIs rather than key-based storage, the host
must obtain ancestor metadata from its API; this helper cannot reconstruct missing names or relationships.

### First task: native links

```ts
// Proposed example; not yet compiled against public exports.
import {Component} from '@angular/core';
import {BreadcrumbComponent, BreadcrumbItem} from 'clr-lift';

@Component({
  selector: 'app-object-location',
  imports: [BreadcrumbComponent],
  template: `<cll-breadcrumb [items]="items" />`,
})
export class ObjectLocationComponent {
  readonly items: readonly BreadcrumbItem[] = [
    {id: 'bucket', label: 'Backups', href: '/objects'},
    {id: 'prod/', label: 'prod', context: 'prod/', href: '/objects?prefix=prod%2F'},
    {id: 'prod/daily/', label: 'daily', context: 'prod/daily/'},
  ];
}
```

Current location is always text with `aria-current="page"`, even if it has an `href`. Earlier items with an `href` are
real anchors; preserve browser context menus and Ctrl/Cmd/middle-click. Use Angular's normal sanitized URL binding, with
no bypass or URL reconstruction. Applications supply destinations appropriate to their deployment base.

### Application-state navigation

For addressless application-state navigation, omit ancestor `href` values and bind `navigate`. Those ancestors render as
native buttons. URL-addressable SPA destinations need the separate link-preserving integration identified above; this
example does not define that integration or authorize a new router dependency.

```ts
// Proposed example; caller-owned prefix strings remain exact.
import {Component, signal} from '@angular/core';
import {BreadcrumbComponent, BreadcrumbItem} from 'clr-lift';

@Component({
  selector: 'app-prefix-location',
  imports: [BreadcrumbComponent],
  template: `
    <cll-breadcrumb [items]="items()" [maxVisible]="4" (navigate)="open($event)" />
    <button type="button" class="btn btn-sm" (click)="reset()">Reset</button>
  `,
})
export class PrefixLocationComponent {
  private readonly original: readonly BreadcrumbItem[] = [
    {id: '', label: 'Backups'},
    {id: 'daily/', label: 'daily'},
    {id: 'daily/2026/', label: '2026'},
    {id: 'daily/2026/daily/', label: 'daily'},
    {id: 'daily/2026/daily/reports/', label: 'reports'},
  ];
  readonly items = signal(this.original);

  open(item: BreadcrumbItem): void {
    const index = this.items().findIndex((candidate) => candidate.id === item.id);
    if (index >= 0) this.items.update((items) => items.slice(0, index + 1));
    // A host can instead navigate its router using the original item identity.
  }

  reset(): void {
    this.items.set(this.original);
  }
}
```

The demo translates “Backups” and “Reset”; folder labels remain caller data. There is no submitted form value and no
disabled/readonly input. All component buttons have `type="button"`; navigation must not submit a surrounding form.

### Defaults and invalid inputs

- Empty array: no navigation landmark. One item: current text only; no action or overflow.
- IDs are unique within a path; an empty root ID is valid. Labels contain visible text. Duplicate IDs, blank labels and
  empty/whitespace `href` strings are developer errors with clear diagnostics, rather than ambiguous navigation. Callers
  localize labels for empty object-key segments. Developer diagnostics are not product validation messages.
- `maxVisible` truncates finite numbers and clamps to at least two; non-finite values use four. Arrays/items update by
  replacement. No item or input is mutated.
- Missing `href` requires a caller binding to `navigate`. `context` is optional display text; callers supply exact full
  prefix context for repeated names or labels containing separators. Without context, show the ordered label trail and
  localized depth. The trail is display-only and never becomes a key or URL.

```html
<!-- Proposed deep-path configuration. -->
<cll-breadcrumb [items]="ancestors" [maxVisible]="4" />
```

Root + overflow + the two nearest ancestors + current location is the default deep-path presentation. The four-item
ceiling excludes overflow; width can reduce recent ancestors further. Hidden items form one contiguous middle range.

Do not decode/encode paths, collapse repeated slashes, interpret `..`, or normalize Unicode. Render labels/context as
text, never HTML. Object permissions and server acceptance remain caller concerns.

## Demo and validation plan

Follow the [workflow](../component-development.md) and [COMMANDS](../../COMMANDS.md). All checks below are planned, not
results from this revision:

- Clarity playgrounds for native links; 30/100-level navigation with width controls; repeated/long/special-character
  labels; action navigation/reset. Include empty/one-item paths, search recovery, input replacement, multiple instances
  and a native form host. Disabled/readonly states do not apply to this navigation API.
- Unit/public type tests for partition coverage/order, count normalization, invalid inputs, action payload identity,
  exact URLs, filter recovery, current semantics and immutable updates.
- If the helper is approved, test its public function boundary with exact generated labels, context, identity and URL
  callback data. Cover bucket/prefix/object locations, direct links, restricted roots, repeated/leading delimiters,
  empty segments, literal percent escapes, Unicode, `..`, and objects ending in `/`. Keep storage API calls mocked at
  the demo's existing network boundary; the helper itself must not fetch anything.
- Rendered focus/lifecycle tests for open/close/Escape, resizing with and without a surviving trigger, external focus,
  locale/density changes, observer/scheduled-work cleanup and repeated mounting.
- Chromium/Firefox/WebKit E2E for every hidden ancestor, exact destinations, modified link clicks, real
  application-state updates, no form submission, no page overflow and full-label access. Verify light/dark/compact/RTL,
  320 CSS px, 200% zoom, touch and long translated content. Automated accessibility scans supplement keyboard
  assertions.
- Strict packed Angular 21 imports/templates and DOM hosts in zoneless and ZoneJS modes; server-render/hydration checks
  before claiming that capability. Measure incremental bundle size and 100-level rendering/filter/resize workloads.
- Applicable formatting, locale, lint, type, unit, build, browser and installed-package gates. Full release validation,
  independent language/screen-reader acceptance, CI, merge and publication remain distinct.

## Terminology

An item ID is caller identity, label is display text, context is optional location detail, href is a supplied navigation
target, and an ancestor path is ordered caller data. First is root and last is current location. Object-store prefixes
are not normalized local filesystem paths.

## Behavior and architecture

### Width and collapse

The caller owns locations/URL construction; the component owns collapse, query and disclosure state. Use signal inputs,
derived state and OnPush change detection. The renderer never parses keys and its layout helpers remain private. The
separate opt-in construction helper has its own explicit delimiter/resource-kind policy and public tests.

After browser rendering, observe host inline size with `ResizeObserver`. Remove the oldest visible recent ancestor until
the row fits; restore recent ancestors when space grows, up to `maxVisible`. Measure actual available container width,
separators, gaps, trigger and label dimensions. Measurement must be independent of the already-collapsed row so items
can reappear. Use inert measurement content without duplicate focusable links or accessible labels; coalesce updates and
prevent observer feedback loops. Recompute for font, locale and density changes.

Keep root/current and overflow reachable. Shrink labels with ellipsis and logical CSS sizing to prevent page-level
horizontal overflow at supported narrow widths. When any text is truncated, the panel includes a full-text location
summary containing root/ancestor/current labels and context. Even if no ancestors are hidden, truncation exposes the
details trigger; a `title` tooltip alone does not satisfy keyboard/touch access to full labels.

### Anchored ancestor panel (proposed refinement)

The ellipsis is a Clarity link-style icon button with `aria-expanded` and `aria-controls`. The proposed panel is
anchored to that trigger without moving surrounding content. Use Clarity surface/spacing/border tokens, viewport-aware
positioning and a scrollable maximum block size; long context wraps. It is nonmodal and does not use selection-list or
command-menu semantics. Review the named-panel role, trigger relationship, collision/clipping behavior, outside
dismissal and keyboard/focus exit with the chosen positioning mechanism before implementation. Prefer browser APIs or
existing supported dependencies; no new runtime dependency is approved. The #185 preview below exercises this mechanism;
production integration remains a later ticket.

Above 20 hidden ancestors, show a labeled local filter matching label and supplied/display context with active-locale
case handling. Trim only the query, preserve original order, and never navigate on typing or filter out the location
summary. Render all matches for the supported 100-level case: bounded panel height does not imply bounded DOM or
virtualization. No requests occur; larger-scale guarantees remain deferred.

Opening focuses the filter when present, otherwise the first hidden ancestor, or the named region for details-only
content. Tab/Shift+Tab must offer predictable entry and exit; verify the final order in the anchored-panel preview.
Native Enter/Space activate buttons and Enter activates anchors. No custom arrow-key navigation is added. Escape and a
translated close button close and restore the trigger; toggle close keeps trigger focus.

Replacing the path closes the old panel and clears its query. Route navigation, external path updates and destruction do
not restore focus; the application owns route focus. When resize changes the hidden range, close stale content and
restore a surviving trigger only if focus was inside the panel. If that trigger disappears, focus current text
programmatically. Never steal focus from elsewhere on the page. Locale changes preserve valid query/focus when the
hidden range remains stable.

### Lifecycle, SSR and performance

Disconnect observers, cancel scheduled measurements and release DOM references on destroy. Instances have independent
state and unique panel/control IDs. Release any positioning, dismissal and focus listeners with the panel; no router
subscription or background polling is part of the proposed contract.

Server markup uses the deterministic count partition. Width measurement begins after hydration/render and server code
never accesses browser globals or dimensions. Without measurement support, keep the count partition, shrink labels and
retain ancestor access. SSR/hydration remains a planned gate rather than an established capability.

Partitioning/filtering is linear. Test 1/4/30/100 items and measure open/filter/resize cycles and teardown with the
actual renderer. This draft claims no timing, bundle or memory results and adds no runtime dependencies.

## Clarity, accessibility, and localization

### Public font-size customization

Provide a public `--cll-breadcrumb-font-size` CSS custom property. When unset, use Clarity's
`--clr-base-typography-font-size-inline`; this token is present in installed Clarity 18.4.0 breadcrumb styling. Do not
add a numeric Angular input or require consumers to target internal selectors.

```scss
/* Proposed styling contract; available when the component is implemented. */
cll-breadcrumb {
  --cll-breadcrumb-font-size: 1rem;
}
```

Consumers may scope the property to one component instance, bind it through Angular's style binding, or set it on an
ancestor for an application-wide default. Accept ordinary valid CSS font-size values, including relative units and
`clamp()` expressions; no library-specific numeric unit conversion is introduced.

Use the resulting font size for the path row and the ancestor panel's primary item labels. Secondary context and icon
sizes scale proportionally; line boxes must expand with larger text. Keep Clarity density and usable keyboard/touch
targets independent of a smaller font choice. If panel rendering changes DOM ancestry, forward the resolved typography
to the panel rather than losing the per-instance override.

Changing the property at runtime, changing the surrounding font environment, or increasing browser zoom must update
width/collapse/positioning measurements even when the host width itself is unchanged. Verify two differently sized
instances, default-token behavior, larger text at narrow widths, and the anchored panel's typography, containment, focus
outline and lack of clipping. Include a working demo font-size control and copyable CSS with translated owned labels.
Runtime evidence remains pending implementation.

### Shared visual and language acceptance

Clarity styling is required: public `--clr-*`/`--cds-*` typography, link/focus colors, spacing, surfaces and borders;
Clarity button, icon, input and card patterns; logical CSS for RTL. Do not add Material/Ant styles, Tailwind, a
hardcoded light palette, private breadcrumb selectors or a new theme system.

Use a named `nav` with an ordered list, decorative separators/icons hidden from assistive technology, and current text
with `aria-current="page"`. Give ancestor links/buttons meaningful names and context/depth descriptions distinguishing
repeated labels. Preserve visible focus; never nest interactive controls.

| Owned message   | Proposed English meaning                                                                 | Contract                                                                             |
| --------------- | ---------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------ |
| Navigation name | Breadcrumb                                                                               | Localized default; contextual caller override via `ariaLabel`                        |
| Trigger         | Show path details and ancestors                                                          | Icon-button name; expanded state comes from ARIA                                     |
| Region name     | Path details and ancestors                                                               | Names ancestor panel                                                                 |
| Filter          | Filter ancestors                                                                         | Persistent input label, not placeholder-only                                         |
| Empty result    | No matching ancestors                                                                    | Visible recovery state; query remains editable                                       |
| Result count    | `Matching ancestors: {count}`                                                            | Localized number, grammatically invariant message; polite status after query changes |
| Depth           | `Level {level}`                                                                          | Context without interpreting keys                                                    |
| Close           | Close path details                                                                       | Close-control label                                                                  |
| Demo            | Title, prose, examples, reset, depth/width controls, current prefix and API descriptions | All owned visible/announced messages                                                 |

Complete library/demo dictionaries for **en, zh-CN, zh-TW, de, es, fr, ja, ko, nl, pt-BR, ru**, preserving additional
aliases. Preserve placeholders, caller data and URLs. Runtime switching updates messages and measured layout; unrelated
renders do not repeatedly announce counts. Verify light/dark, compact, narrow, long text, 200% zoom, touch and RTL.
Independent native-speaker and assistive-technology acceptance owners remain unassigned; automated parity/axe checks do
not constitute those approvals.

## Compatibility, rollout, and risks

Target existing Angular 21/Clarity 18.4 without peer, dependency or package-version changes. The additive export leaves
existing page-container/Clarity consumers intact. Rollback removes the new component/demo; no key migration exists.
Measurement stability, responsive focus, long contexts and cleanup require implementation evidence. Native field binding
is inapplicable; larger-than-100-level scale and SSR/hydration readiness require their own evidence.

## Review decisions and delivery

Recommended choices for maintainer review:

1. Add the component/item API above; separate native anchors from action-only `navigate` events.
2. Use Clarity-styled semantic rendering because the public Clarity component cannot supply the required partition.
3. Default to four actual items, preserve root/current, adapt to container width, and propose an anchored nonmodal panel
   with local filtering above 20 hidden ancestors. Expose full text even when truncation alone creates the need for
   details.
4. Keep Angular 21, no new dependency, no form-value API and no configurable overlay in this increment.

The maintainer approved navigation-root semantics, SPA link behavior, the anchored nonmodal panel, and continuation with
the helper construction approach. The exact SPA/helper integration proof carries into the first ticket; do not ask for
approval of the same product decisions again. Configurable font size is included with the initial component delivery.

### Approved tracer-bullet tickets

The maintainer explicitly approved the five-ticket granularity and dependency structure in chat. The five tickets are
published as native sub-issues of the existing specification. Keep the parent issue body and state unchanged. The table
records the approved work boundaries and their blocking edges.

| Ticket                                                                                                                            | Blocked by                                                        | Independently verifiable outcome                                                                                                                                                                                                                                                                     |
| --------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [#185](https://github.com/wghglory/ngx-lift-workspace/issues/185): Validate the public contracts in a Clarity interaction preview | None                                                              | Demonstrate a simple database trail and a bucket/object trail, real SPA links plus modified-click behavior, the optional construction helper, anchored-panel focus/positioning, and font-size control. Record exact public signatures and integration/dependency choices before public exports.      |
| [#186](https://github.com/wghglory/ngx-lift-workspace/issues/186): Deliver simple breadcrumbs and configurable typography         | [#185](https://github.com/wghglory/ngx-lift-workspace/issues/185) | Ship a short database/server trail using the public component, semantic current location, ordinary/SPA links and addressless actions. Include optional-context behavior, CSS font control, localized working demo, public-host/browser tests and packed Angular 21 checks.                           |
| [#187](https://github.com/wghglory/ngx-lift-workspace/issues/187): Reach every ancestor in deep and narrow paths                  | [#186](https://github.com/wghglory/ngx-lift-workspace/issues/186) | Deliver root/current-preserving count/width collapse and the anchored, nonmodal ancestor panel. Include full-text access, no surrounding-content shift, resizing/font changes, keyboard exit, path replacement, cleanup, 30-level demo and three-browser coverage.                                   |
| [#188](https://github.com/wghglory/ngx-lift-workspace/issues/188): Build bucket/prefix/object trails from API state               | [#186](https://github.com/wghglory/ngx-lift-workspace/issues/186) | Export the approved synchronous construction helper and demonstrate bucket root, prefix and direct-linked object navigation with application-owned URLs. Include exact-key/context/identity, permitted-root cases, localization, public-function tests, browser journeys and packed-consumer checks. |
| [#189](https://github.com/wghglory/ngx-lift-workspace/issues/189): Find ancestors in long paths                                   | [#187](https://github.com/wghglory/ngx-lift-workspace/issues/187) | Deliver local label/context filtering above 20 hidden ancestors with preserved order, current context, recovery and localized result announcements. Include a 100-level working demo, runtime locale/font changes, measured performance and three-browser accessibility/keyboard coverage.           |

[#187](https://github.com/wghglory/ngx-lift-workspace/issues/187) and
[#188](https://github.com/wghglory/ngx-lift-workspace/issues/188) can proceed independently after
[#186](https://github.com/wghglory/ngx-lift-workspace/issues/186);
[#189](https://github.com/wghglory/ngx-lift-workspace/issues/189) needs
[#187](https://github.com/wghglory/ngx-lift-workspace/issues/187) but does not require the helper because it can consume
supplied items. Do not add false blocking edges merely to force a linear sequence. Every implementation slice owns
applicable localization, documentation and validation; there is no separate horizontal “add tests” or “translate
everything” ticket. The preview is an isolated review artifact rather than a claim that production exports or the full
demo exist.

No broad refactor is justified by the current source evidence. Start with the interaction/integration proof and reuse
existing demo, browser, accessibility and packed-package infrastructure. When all slices are complete, run the
applicable full repository gates and record CI, human acceptance, merge and publication independently; those results are
not implied by creating or closing tickets.

After API review, deliver library behavior/tests, then complete localized playgrounds and browser/packed-consumer
evidence as one acceptance scope. Record approval of this concrete revision before marking it Implementing.

## Evidence

- October 24, 2026: created the initial design branch from freshly fetched `origin/main` at `801225f`. The prior
  key/value branch and its commits remain intact.
- Inspected installed Clarity 18.4.0 breadcrumb declarations/runtime template/styles and fetched all four primary
  sources linked above. These were source findings at the design stage; the #185 preview now supplies rendered evidence
  below.
- Confirmed supported locales from the checker and demo switcher. Nx project discovery passed using
  `NX_SOCKET_DIR=/tmp/ngx-lift-nx` after the default socket path exceeded the platform length limit.
- At the initial design stage, only documentation changed. Ticket #185 evidence is recorded below; public exports,
  installed-package checks, SSR/hydration and independent human acceptance remain pending subsequent delivery.
- Documentation validation passed: Prettier on both changed Markdown files, all 25 relative link targets, and
  `git diff --check`. Component tests were not run for this documentation-only change.
- The maintainer subsequently approved all three grill decisions in chat. The exact SPA integration seam remains under
  review, and the new helper/examples respond to the maintainer's follow-up about normal database and object APIs.
  Recorded approved navigation terms in the [glossary](../../../GLOSSARY.md).
- The maintainer approved continuation with the construction approach and requested font-size control. Added the public
  CSS contract; the maintainer subsequently approved the five-ticket graph and publication. Published sub-issues
  #185–#189; the parent body and state remain unchanged.
- Verified S3 general-purpose prefix/delimiter and folder behavior against official AWS documentation. API payloads
  above are illustrative and the helper is proposed; no live bucket was queried or new export implemented.
- Published issue #184 through `gh`; GitHub resolves the `wghglory/ngx-lift` origin to the canonical
  `wghglory/ngx-lift-workspace` repository. Confirmed the canonical repository through the GitHub API.
- CI, merge, deployment and package publication have not been performed for this branch.

### Ticket #185 local acceptance evidence (October 24, 2026)

The requested database trail and bucket/prefix/object trail are runnable at the preview route documented above. The
experiment is implemented only in the demo; no production exports, dependency manifests, peers or version numbers are
changed. Existing local glossary/delivery-plan edits are retained. The preview's exact signatures, destination callback,
permitted-root policy, native/SPA templates, focus handoff and CSS sizing choices are recorded in this specification so
#186–#189 can proceed from concrete evidence.

- `NX_SOCKET_DIR=/tmp/ngx-lift-nx pnpm nx run demo:test`: **294 tests passed in 82 files**, including **15 focused
  helper tests** covering exact callback data, cumulative contexts, stable identity, raw-key edge cases and rejected
  inputs.
- `NX_SOCKET_DIR=/tmp/ngx-lift-nx pnpm nx run-many -t lint,typecheck -p demo,demo-e2e`: passed. The E2E lint target
  reports advisory warnings; no lint errors or TypeScript errors remain.
- `NX_SOCKET_DIR=/tmp/ngx-lift-nx pnpm nx run @ngx-lift-workspace/source:i18n-check`: all eleven dictionaries complete,
  2,095 keys per dictionary, zero errors. Browser journeys switch every non-English locale and inspect translated page
  titles, panel names and empty-segment labels. This is automated evidence, not native-speaker approval.
- `NX_SOCKET_DIR=/tmp/ngx-lift-nx pnpm nx run demo:build`: production build passed within configured budgets. This is
  demo build evidence, not installed-library consumer verification.
- Focused Playwright command (against the running preview):
  `BASE_URL=http://localhost:4307 NX_SOCKET_DIR=/tmp/ngx-lift-nx pnpm nx run demo-e2e:e2e -- src/breadcrumb-preview.spec.ts --workers=3`.
  The suite covers real native/SPA navigation and browser Back, modified/middle click, unhandled native context-menu
  events, form safety, stationary content, panel keyboard boundaries/toggle/Escape/Close, external focus preservation,
  exact-key direct links, restricted roots, runtime locale changes, runtime per-instance typography, 390px containment
  and open-panel axe scans in both themes. **Latest local result: 49 passed, 2 explicitly skipped** across Chromium,
  Firefox and WebKit (27.0s).
- A standalone plain-anchor reproduction showed that this macOS headless WebKit build does not create a new tab for
  Meta/middle click (middle click can navigate the current page). The two tab-creation tests are explicitly skipped for
  WebKit; actual tab creation passes in Chromium/Firefox. All three engines still exercise the real anchor, unprevented
  Ctrl/Meta/auxclick events and a native right-click event. OS context-menu contents and full Safari tab creation
  require independent manual browser acceptance; they are not claimed as automated passes.
- Formatting, relative documentation links and `git diff --check` are checked for this increment. Nx Cloud reports an
  unavailable remote cache because its organization exceeds the free-plan quota; local task results are independent of
  that cache warning. No CI run, merge, deployment or package publication is claimed.

Remaining boundaries: production exports/API approval and packed Angular consumers (#186/#188); width-aware collapse,
large-text/zoom/RTL/compact coverage, 30-level behavior and generalized lifecycle/positioning checks (#187); filtering
and measured 100-level behavior (#189). SSR/hydration and legacy popover support have not been tested or promised by the
preview. Independent language reviewers and assistive-technology assessors remain pending. No live storage API was
queried. The next maintainer step is review of these exercised interfaces before beginning #186.

### Preview visual-feedback follow-up

Maintainer screenshots exposed three issues that the original interaction/containment checks did not catch: an undefined
`--clr-color-neutral-0` token made the popover transparent; Clarity's button defaults gave the ellipsis a 72px minimum
width and capitalized addressless labels; and the full-path paragraph kept a fixed line height as font size increased.
Use the installed Clarity 18.4 `--clr-card-bg-color`, `--clr-card-border-color` and `--clr-global-font-color` surface
tokens, compact link-style navigation buttons, and inherited proportional paragraph line height. The surface
intentionally floats above stationary content; its background is opaque in both themes.

The font control now uses `clr-range-container`/`clrRange` for aligned Clarity range styling. The fixture picker uses
`clr-select-container`/`clrSelect` and an application-owned NgModel binding, so a directly linked fixture remains
selected after options render. Options show concise raw kind/key data; full callback/identity data stays in the state
disclosure. The navigation entry sits immediately after Alerts (Multiple).

Added a translated explanation in all eleven locales: buttons represent in-memory locations with no URL, such as a
wizard deliberately kept in local draft state. This example only updates selected state and demonstrates `type="button"`
form safety. A containing form does not determine navigation semantics: every URL-addressable location, including SPA
locations, remains a real link.

The feedback regression command first failed on the original 72px trigger and missing Clarity range class; browser
inspection also confirmed a fully transparent panel. After the fix, the full focused suite reports **40 passed, 2
explicitly skipped** across Chromium, Firefox and WebKit, including opaque surfaces, proportional large-text line
height, compact hit areas, ordinary-case action labels and direct-link fixture selection. AI visual inspection confirmed
the range thumb/track alignment and opaque large-text panel; this is not independent human visual or
assistive-technology acceptance. Production build, demo/E2E lint and type checks, eleven-locale translation checks and
formatting/diff checks passed. Existing E2E lint warnings remain advisory. No new dependency, library export, commit,
pull request or publication was introduced by this follow-up.

### Font-relative separator spacing and standard Close action

A further maintainer review found that separator gaps stayed at 4px while breadcrumb text grew from 13px to 30px. The
rendered-spacing regression reproduced a gap ratio of 1 for a font-size ratio of 2.31. Both sides of each decorative
separator now use `0.3em`, preserving the small-text spacing while increasing it proportionally with the breadcrumb
font. The overflow trigger has no extra horizontal minimum-width reservation; its glyph and surrounding gaps follow the
same scale as the other trail content. Its vertical hit area is retained.

Only navigation link-style buttons inherit breadcrumb typography. Close path details now uses the ordinary Clarity
`btn btn-outline` styling, including its default font size, independently of enlarged ancestor labels. A browser
regression compares its actual font size with the demo's ordinary Reset button at maximum breadcrumb font size.

The `…` trigger and an underlined `..` have separate meanings: the former opens hidden ancestors; the latter is literal
caller-owned data in the unusual-key fixture `/a//%2F/雪/../object`. The helper preserves those two dots and their exact
prefix destination; it does not turn them into an overflow marker or normalize them as filesystem parent navigation. The
added browser journey verifies both the literal label/destination and the overflow control.

The full focused browser suite now reports **43 passed, 2 explicitly skipped** across Chromium, Firefox and WebKit; the
existing headless WebKit tab-creation limitations remain unchanged. The production demo build passed. This change adds
no owned messages, dependencies or public API. Manual assistive-technology acceptance and remote CI remain separate
pending gates.

### Review corrections: scrolled anchors, destination kinds and whitespace

The three P2 review findings have dedicated regressions. Panel positioning now clamps both candidate anchor boundaries
to the viewport before calculating available block size. When scrolling moves the trigger outside the viewport, the open
nonmodal panel stays within the 8px viewport inset and scrolls internally; focus remains in the panel until an explicit
close or ordinary outside dismissal. It does not grow an off-screen-trigger distance larger than the viewport.

The preview host reads the URL's explicit `kind` before fixture defaults. Bucket/collection destinations use the empty
prefix root, prefix destinations require `prefix`, and object destinations require `key`; unknown kinds and missing
required destination parameters produce developer diagnostics. A supplied bucket is preserved. Fixture defaults apply
only in the absence of URL destination data; legacy prefix/key-only preview URLs remain supported. For example,
`?fixture=4&kind=object&key=object` now represents the object even though fixture 4 normally represents a prefix.
Restricted-root validation still applies to the resulting exact location.

The helper retains the localized placeholder for an actually empty segment. Whitespace-only labels use JSON quoting
(e.g. `" "` for a space and `"\t"` for a tab) so their controls have visible text. Labels containing visible characters
retain their original surrounding whitespace. IDs, contexts and destination callback payloads always preserve the raw
key, including spaces, tabs, newlines and Unicode whitespace. No source key is trimmed or normalized.

Review-fix validation: all **16 helper tests** passed, and the full focused browser suite passed **49 tests with 2
previously documented WebKit tab-creation skips**. The new scrolling and direct-link regressions pass in all three
engines. Each direct-link scenario now starts in an independent page, avoiding interrupted lazy imports from repeated
hard navigation; console/page-error assertions remain enabled. Demo production build, demo/E2E lint and type checks,
formatting and diff checks passed; advisory E2E lint warnings remain. The three inline review comments were replied to
and resolved. No additional package/publication/CI or independent human acceptance is claimed.

### Underline styling discussion (proposal, not a shipped option)

Installed Clarity 18.4 breadcrumb styles explicitly use `text-decoration: none`. The preview currently inherits global
anchor underlines, while its addressless buttons have no persistent underline. For the eventual component, prefer
Clarity-aligned navigation styling without persistent underlines, retain clear hover/focus treatment and
current-location distinction, and consider a CSS `--cll-breadcrumb-link-decoration` override for consumers who prefer
underlines. The custom link template would need to honor that styling property too. This extra property remains proposed
and is not implemented by the review fixes.

Underlines are not universally mandated for breadcrumb links; distinguishability, contrast, native semantics and visible
keyboard focus remain necessary. See [WCAG Use of Color](https://www.w3.org/WAI/WCAG22/Understanding/use-of-color.html)
and the [WAI-ARIA breadcrumb pattern](https://www.w3.org/WAI/ARIA/apg/patterns/breadcrumb/). Font size remains the
already exercised CSS property `--cll-breadcrumb-font-size`, with Clarity typography as the default. It is not an
Angular component input; the preview's range control writes that CSS property per instance.

### Focused PR integration validation

The #185 preview was transferred to a dedicated branch based on `origin/main` at `5d21127`, preserving the newer
key/value glossary, shared-form documentation and all eleven upstream dictionaries. Unrelated local changes to
`.github/workflows/deploy-demo.yml`, `netlify.toml` and `nx.json` were excluded; the original checkout and index were
left unchanged. This integration introduced no package or lockfile edits.

Fresh isolated-worktree verification passed: **298 demo tests in 82 files**, demo production build, demo/E2E lint and
type checks, and translation parity for **2,132 keys in each of eleven locales**. The earlier counts above describe the
original preview checkout; these counts include current-main additions. E2E lint retains three advisory warnings and has
no errors. Browser evidence and external CI status are reported in the focused PR; local success does not imply
independent language/assistive-technology acceptance, production library exports or publication.

## Ticket #186 local acceptance evidence

The maintainer selected this chat to reconcile overlapping work and requested the generic public names
`BreadcrumbComponent` / `cll-breadcrumb`, with `BreadcrumbItem` and `BreadcrumbLinkContext`. Source files, selectors,
translations, demo route, public exports, README, roadmap, changelog, tests and incoming spec links use those names.
There is one implementation and one public demo route: `/clr-lift/components/breadcrumb`.

Validated October 24, 2026 on `feat/186-breadcrumbs-public`:

- Formatting, 24 tooling tests, all eleven translation dictionaries, lint, all project type checks, coverage thresholds,
  all production builds and bundle checks passed through `NX_SOCKET_DIR=/tmp/ngx186 pnpm run validate`.
- Unit suites passed: ngx-lift 883 tests, clr-lift 399 tests, demo 298 tests. The breadcrumb component's TypeScript
  logic has 100% statement, branch, function and line coverage in this run. DOM/CSS behavior is covered separately
  below.
- `NX_SOCKET_DIR=/tmp/ngx186 pnpm nx run demo-e2e:e2e src/breadcrumb.spec.ts src/breadcrumb-preview.spec.ts --workers=3`:
  70 passed; two existing preview tab-creation checks remain skipped for headless WebKit. All 21 new public breadcrumb
  checks passed, including ordinary versus SPA/history ownership, native modified/context-menu events, keyboard action
  safety, empty/singleton trails, HTTP data/error recovery, all-locale runtime switching, inherited/per-instance font
  changes, narrow compact RTL and light/dark accessibility scans. The theme tests wait for the existing playground
  transition before scanning its final colors; WebKit uses Option+Tab for native-button traversal on macOS.
- Installed verification initially caught a test assertion expecting a relative RouterLink href in JSDOM, which resolved
  it against the document base. The assertion now checks the exact resolved URL.
  `NX_SOCKET_DIR=/tmp/ngx186 pnpm nx run @ngx-lift-workspace/source:package-verify` then passed: fresh strict peer
  install, public imports/types, strict Angular 21 templates, real DOM routing/actions/forms/replacement in zoneless and
  ZoneJS hosts, and the existing package import-graph checks. These DOM hosts supplement the three real-browser
  projects.
- `git diff --check` and the repository reference search found no old component/selector/type names or spec-path links.

This increment adds no runtime dependency, router peer or package version bump. The changelog records it under
Unreleased. CI at a pushed commit, merge, deployment and publication have not been performed. The full unrelated E2E
suite was not rerun. Independent native-speaker review for each supported language and manual assistive-technology
acceptance remain pending under the accessibility/language contract. The following #187 increment supersedes the
original short-trail overflow limitation; helper (#188) and scale hardening (#189) retain separate evidence.

### Simple-first demo teaching correction

The ordinary-link playground comes first and opens with its code visible. Its complete Angular example imports only
`BreadcrumbComponent` and supplies `[items]="items()"`. The component builds ancestor anchors automatically; the final
item always renders current text even if it has a destination. The separate SPA example demonstrates the optional
consumer-owned RouterLink template, with complete Router imports/methods and matching copyable HTML. This template is an
Angular `ng-template`, not a required breadcrumb syntax. The Angular Router integration decision is being clarified with
the maintainer; no router peer or implicit routing behavior has been introduced by this teaching correction.

Correction validation: demo/E2E lint and type checks, demo production build, changed-file formatting and
`git diff --check` passed. The public breadcrumb browser suite passed all 24 checks across Chromium, Firefox and WebKit,
including the new assertion that the first example renders automatic links and displays its simple code on initial load.
No library runtime behavior or package dependency changed in this correction.

### URL syntax review correction

Destination validation now rejects malformed absolute and protocol-relative URLs through the standard URL parser, while
retaining the original destination for rendering. Regression cases cover `https://`, `https://[invalid]`, `//[`, and
unchanged supported relative, query-only, fragment-only and explicit-scheme links. The clr-lift unit suite passed all
412 tests; clr-lift lint/type checks, changed-file formatting and `git diff --check` passed. Browser and installed
package checks were not rerun for this correction.

## Ticket #188 public construction helper

`buildObjectPathBreadcrumbs`, `BuildObjectPathBreadcrumbsOptions` and `ObjectPathLocation` are now public `clr-lift`
exports with the settled preview signature and boundary table above. The preview delegates to the same implementation.
The renderer remains generic. There is no new runtime dependency, storage client, request, router peer or version bump.

The public demo adds a working bucket browser with controlled ListBuckets/ListObjectsV2-shaped fixtures. Route state
owns exact bucket/key/kind/root; child listings supply full prefixes/keys. Direct-linked objects, an empty bucket,
repeated names, leading/repeated empty segments, literal percent escapes, Unicode, dot segments and a slash-ending
object are available. Restricted trails omit the collection/bucket/higher prefixes; fixture links and reset explicitly
switch the example scope. An invalid/outside-root route renders a translated recovery message. Constructed structure
never proves existence or authorization; object metadata is separately supplied by the fixture.

Owned messages use `breadcrumbStorage.*`: title, scope/fixture explanation, API flow, direct-link examples,
invalid-route recovery, child listing, empty state, object details, missing metadata and route/response/generated-data
disclosure. Existing translated Buckets, empty-segment and Reset labels are reused. All eleven locales are delivered
together. No helper-owned UI, form integration, keyboard surface or async lifecycle is introduced. The example uses the
existing real-anchor SPA integration, with ordinary browser semantics and current text supplied by the renderer.

See the [usage and reference guide](../../guides/object-path-breadcrumbs.md) for the public contract. Unit/public-type,
browser and packed Angular 21 consumer checks cover this increment; actual validation results are recorded below after
execution. Independent human language/assistive-technology review, CI, merge and publication remain separate gates.

### Ticket #188 local acceptance evidence (October 24, 2026)

- `NX_SOCKET_DIR=/tmp/ngx188 pnpm run validate`: passed formatting, tooling tests, all eleven locale dictionaries (2,157
  keys each), lint, production types, coverage thresholds, production builds, bundle boundaries and strict
  installed-package verification. Existing advisory E2E lint warnings remain. Unit suites passed 883 ngx-lift, 431
  clr-lift and 298 demo tests. The public helper's 18 tests cover callback payloads, exact contexts, stable IDs, roots,
  empty/repeated/whitespace segments, Unicode/percent/dot data, slash-ending objects, invalid inputs and callback
  failure propagation. Helper coverage: 100% lines/functions, 93.1% statements and 94.59% branches.
- `BASE_URL=http://localhost:4318 NX_SOCKET_DIR=/tmp/ngx188 pnpm nx run demo-e2e:e2e src/breadcrumb-storage.spec.ts --workers=3`:
  **27 passed** across Chromium, Firefox and WebKit. These journeys use visible generated ancestors independently of
  deep-overflow behavior. They cover bucket listing, prefix/object navigation, direct links with exact unusual keys,
  trailing-delimiter objects, restricted-root exclusion/recovery, reset, browser Back, native modified/context-menu
  event semantics, all-locale switching, keyboard focus, 390px containment and light/dark axe scans.
- The repository gate's fresh tarball install compiled the helper/options/location imports and discriminated-union
  negative type assertions under strict Angular 21 templates and strict peers. Both zoneless and ZoneJS DOM hosts passed
  exact callback scope/data, stable distinct identities, once-encoded destinations and generated rendering. This is
  installed-package evidence, separate from real-browser testing.
- A broader breadcrumb run also exercised the public component and original preview (their existing WebKit tab-creation
  skips remain). It exposed five failures in the already in-progress #187 deep suite: singleton-panel interaction in all
  three engines and two WebKit focus/navigation cases. Those failures are outside this independent helper slice; no
  passing full browser-suite claim is made. Full unrelated E2E was not run.
- Usage-guide relative links and `git diff --check` passed. Existing local #187 implementation/demo/translation work was
  retained; formatting and one equivalent web-first E2E assertion were adjusted for repository checks.

No live storage account, CI run, commit, merge, deployment or publication is claimed. Independent native-speaker and
manual assistive-technology acceptance remain pending. Maintainer review is the next gate for this helper increment;
responsive-overflow failures and #189 scale/filtering work retain their separate scope.

### Ticket #187 validation evidence (October 24, 2026)

- `NX_SOCKET_DIR=/tmp/ngx-nx pnpm run validate` passed after the final focus correction: repository formatting,
  tooling/translation checks, lint, type checks, coverage (883 ngx-lift, 432 clr-lift and 298 demo tests), all builds,
  bundle checks and fresh strict-peer packed consumers. `git diff --check` and subsequent changed-document formatting
  checks pass. The full unrelated browser suite was not run; the targeted public breadcrumb suite is recorded below.

- Public host: 24 breadcrumb tests pass, including the deterministic count fallback, contiguous recent suffix, repeated
  labels/exact destinations, count normalization, form safety, independent instances and observer teardown. The library
  allocates disclosure IDs per application rather than using process-global server state.
- Public browser journeys: **42 passed** across Chromium, Firefox and WebKit, using a fixed production snapshot so other
  work in the checkout cannot trigger development-server reloads. The 18 deep-path checks cover complete ordered
  ancestry, panel scrolling and bounds, unchanged surrounding layout, fixed-width font changes, 200% text sizing, narrow
  layouts, normal keyboard exit, close/Escape, external focus/path replacement, singleton truncation, multiple
  instances, native modified clicks and ordinary SPA navigation. Existing public journeys cover all eleven runtime
  locales, light/dark accessibility, compact RTL, native forms, HTTP recovery and link ownership. Automated scans
  include the open panel. Text enlargement is automated; native browser zoom and assistive-technology acceptance remain
  human checks.
- Sampled at a 1280×720 viewport: the 30-level fixture at a 640px host width and 18px inherited text renders three
  actual trail items, 30 panel rows and 29 native ancestor anchors in all three browsers. Chromium reports a 358px panel
  with 4411px scroll height; Firefox reports 357px/4412px; WebKit reports 357px/4410px. Page width remains 1280px. Tests
  scroll to and expose the final ancestor. This is measured 30-level layout evidence, not a 100-level performance
  guarantee.
- Installed Angular 21 zoneless/ZoneJS fixtures cover the public `maxVisible` input, 30-level unmeasured fallback,
  disclosure relationships, exact destinations and existing routing/actions/forms. No runtime dependency, router peer or
  package version changes are required for #187.
- Browser debugging found two correctness issues now covered by regressions: disclosure DOM must remain stable when the
  recent suffix changes, and WebKit can focus the containing navigation during an inside pointer-down before the
  anchor/button receives its click. Pointer-origin tracking preserves the pending inside activation without suppressing
  ordinary keyboard exit. The demo also memoizes singleton arrays so it does not replace the path on each render.

SSR/hydration remains unclaimed: stable count fallback and browser-only initialization are implemented, but an actual
server-render/hydration harness has not run. Independent language review, assistive-technology/native-zoom acceptance,
remote CI, merge, deployment and publication remain separate gates. Local filtering and 100-level scale hardening belong
to #189.

### Review feedback corrections (October 24, 2026)

The renderer uses the breadcrumb-specific `crumb-label` class so Clarity's global badge padding, border and margins do
not invalidate the text measurement. A boundary-width browser regression verifies that clipped text always has a details
disclosure. The disclosure has a minimum 24px target width, and its measurement budget includes that width plus
separator spacing; the compact RTL, enlarged-text accessibility journeys verify the target in both themes.

Forward Tab from Close now uses native sequential navigation. The existing outside-focus listener dismisses the panel
after focus moves, preserving browser handling of negative tab indices, inert ancestors, disabled fieldsets, visibility
and tab order. The regression places excluded controls before the next enabled button and checks both focus and
dismissal in Chromium, Firefox and WebKit. On macOS WebKit it uses Option+Tab for native button traversal. Shift+Tab
from the first ancestor still closes the panel and returns focus to the disclosure trigger.

The full focused breadcrumb browser run reports **124 passed and 2 skipped** across Chromium, Firefox and WebKit. The
two existing skips concern headless WebKit modifier/middle-click tab creation; the new feedback regressions pass in
every engine. Enlarged-text light/dark accessibility checks include projected SPA anchors and disclosure targets.

Final `pnpm run validate` passed: 883 ngx-lift, 432 clr-lift and 298 demo tests, repository formatting, tooling and
translation checks, lint, type checks, builds, bundle checks and strict-peer packed consumers. A verification browser
rerun had two Firefox popup-navigation timeouts; both existing modifier/middle-click cases passed on a focused retry.
The renderer and feedback test source hashes remained unchanged throughout that verification.
