# Construct bucket and object breadcrumbs

Use `buildObjectPathBreadcrumbs` from `clr-lift` when your application knows the current bucket and exact prefix or
object key. It constructs a trail synchronously, including on a direct link. The generic `BreadcrumbComponent` still
accepts ordinary application items and never parses storage keys itself. No storage SDK or new runtime dependency is
required.

## First trail

```ts
import {BreadcrumbItem, buildObjectPathBreadcrumbs, ObjectPathLocation} from 'clr-lift';

function hrefFor(location: ObjectPathLocation): string {
  const bucket = encodeURIComponent(location.bucket);
  switch (location.kind) {
    case 'bucket':
      return `/browse?bucket=${bucket}`;
    case 'prefix':
      return `/browse?bucket=${bucket}&prefix=${encodeURIComponent(location.prefix)}`;
    case 'object':
      return `/object?bucket=${bucket}&key=${encodeURIComponent(location.key)}`;
  }
}

const items: readonly BreadcrumbItem[] = buildObjectPathBreadcrumbs({
  bucket: 'bucket-1',
  key: 'folder-1/folder-nested-2/object-4',
  kind: 'object',
  emptySegmentLabel: '(empty segment)', // Use your application's translation.
  hrefFor,
});
// bucket-1 > folder-1 > folder-nested-2 > object-4
```

Import `BreadcrumbComponent` into your Angular component and bind `<cll-breadcrumb [items]="items" />`. The last item
renders current text even though the helper calls `hrefFor` for it. The default renderer supplies real ordinary anchors.
For Angular Router navigation, supply a consumer-owned real-anchor `linkTemplate` as shown in the
[breadcrumb README](../../libs/clr-lift/README.md#breadcrumb-navigation). Both retain native modified-click and
context-menu behavior.

Compose translated application items such as “Buckets” outside the helper. Give them IDs distinct from generated IDs.
For a restricted root, omit application items that would expose unavailable higher locations.

## Where the data comes from

A bucket listing supplies bucket names. An object-list response with `Prefix` and `Delimiter: '/'` supplies immediate
`CommonPrefixes` and `Contents` with full object keys. Use these entries for the content list and navigate with their
exact values. The current route's bucket, key and explicit kind supply breadcrumb ancestry; the response is not an
ancestor array. There is no request per ancestor, click-history requirement or folder-marker lookup.

The [working demo](https://ngx-lift.vercel.app/clr-lift/components/breadcrumb) includes controlled SDK-shaped backend
fixtures, bucket listing, prefix/object navigation, direct links, empty results, scope validation and reset. The example
code shows application-owned URL construction; route and response details are available in a disclosure. No live cloud
account is involved.

## Reference

`buildObjectPathBreadcrumbs(options: BuildObjectPathBreadcrumbsOptions): readonly BreadcrumbItem[]`

| Option              | Contract                                                                                                 |
| ------------------- | -------------------------------------------------------------------------------------------------------- |
| `bucket`            | Required nonblank exact bucket identity; used as the bucket label and callback data                      |
| `key`               | Exact current prefix or object key; never decoded, trimmed, normalized or inferred from labels           |
| `kind`              | Required `'prefix'` or `'object'`; distinguishes a listing from object details                           |
| `rootPrefix`        | Optional nonempty slash-terminated permitted root, included as the first item; key must start with it    |
| `emptySegmentLabel` | Required nonblank caller-translated label used only for empty segments                                   |
| `hrefFor`           | Synchronous `(location: ObjectPathLocation) => string`; called once per returned item, including current |

`ObjectPathLocation` is a discriminated union:

```ts
type ObjectPathLocation =
  | {readonly kind: 'bucket'; readonly bucket: string}
  | {readonly kind: 'prefix'; readonly bucket: string; readonly prefix: string}
  | {readonly kind: 'object'; readonly bucket: string; readonly key: string};
```

Empty `key` with `kind: 'prefix'` generates only the bucket. Nonempty prefixes must end in `/`; object keys must be
nonempty. A slash-ending object generates both the same-key prefix ancestor and a separate object leaf. Their callback
kinds and IDs differ. Invalid kind/key/root, blank bucket/empty label and blank callback destinations throw developer
diagnostics. Callback exceptions propagate to the application. The renderer validates destination safety separately.

Every slash contributes an exact cumulative prefix, including leading/repeated slashes and empty segments. For
`/same//%2F/雪/../object`, the prefix contexts include `/`, `/same/`, `/same//`, `/same//%2F/`, `/same//%2F/雪/`, and
`/same//%2F/雪/../`. Unicode code units, literal percent escapes and dot segments stay unchanged. Whitespace-only labels
use JSON quoting; labels with visible characters retain surrounding whitespace. Destination data always retains the
original characters. Encode the raw domain key once when building your URL and decode it once at the application's route
boundary. Do not place raw storage keys into filesystem-normalizing path APIs.

Each ID is `JSON.stringify([kind, bucket, exactPrefixOrKey])`, with the bucket identity in the third slot for the bucket
item. IDs stay stable across language/destination changes, and distinguish repeated names, buckets and resource kinds.
`context` is the exact prefix/key (bucket identity for the bucket item), independently of the display label.

For `rootPrefix: 'allowed/'`, no bucket or higher ancestor is emitted or passed to `hrefFor`. A key outside that exact
prefix throws before any callback. This only validates structure: the application/server still owns permissions,
resource existence and destination access. Constructed prefixes need not exist as separate storage resources. APIs with
opaque parent IDs need host-supplied ancestry instead of this helper.

The helper has no browser globals, form value, I/O or async lifecycle. It works inside or outside Angular; navigation
inside a form remains navigation, and the renderer's addressless actions remain form-safe. Display labels belong to the
caller; there are no built-in helper UI messages. See the [canonical spec](../design/clr-lift/breadcrumb-design-spec.md)
for rendering, accessibility and language acceptance boundaries.
