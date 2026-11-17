import {BreadcrumbItem} from './breadcrumb.model';

/** Exact domain location passed to the application destination factory; never URL-decoded. */
export type ObjectPathLocation =
  | {readonly kind: 'bucket'; readonly bucket: string}
  | {readonly kind: 'prefix'; readonly bucket: string; readonly prefix: string}
  | {readonly kind: 'object'; readonly bucket: string; readonly key: string};

/** A location whose raw fields were encoded once by the helper for destination assembly. */
export type EncodedObjectPathLocation =
  | {readonly kind: 'bucket'; readonly bucket: string}
  | {readonly kind: 'prefix'; readonly bucket: string; readonly prefix: string}
  | {readonly kind: 'object'; readonly bucket: string; readonly key: string};

/** Stable machine-readable reasons an object-path trail cannot be constructed. */
export type ObjectPathErrorCode =
  | 'blank-bucket'
  | 'blank-empty-label'
  | 'invalid-kind'
  | 'invalid-key'
  | 'invalid-root'
  | 'blank-destination'
  | 'destination-failed';

/** A rejected object-path construction, owned by the helper instead of caller-side exceptions. */
export interface ObjectPathError {
  readonly code: ObjectPathErrorCode;
  readonly message: string;
}

/** The helper always settles into one of these two shapes; it never throws for application input. */
export type BuildObjectPathResult =
  | {readonly ok: true; readonly items: readonly BreadcrumbItem[]}
  | {readonly ok: false; readonly error: ObjectPathError};

/** Application navigation contract. The helper owns encoding and optional collection prefixing. */
export interface ObjectPathNavigation {
  /** Encode each raw domain value once; defaults to `encodeURIComponent`. */
  readonly encode?: (raw: string) => string;
  /** Build a destination from once-encoded fields. Application owns the route shape. */
  readonly destination: (location: EncodedObjectPathLocation) => string;
  /** Prepend this collection item only when no `rootPrefix` restricts the trail. */
  readonly collection?: {
    readonly id: string;
    readonly label: string;
    readonly href: string;
  };
}

/** Options for slash-delimited browsing. This contract does not establish authorization or existence. */
export interface BuildObjectPathBreadcrumbsOptions {
  readonly bucket: string;
  readonly key: string;
  readonly kind: 'prefix' | 'object';
  /** Nonempty slash-terminated permitted root. Higher locations are excluded, including callback calls. */
  readonly rootPrefix?: string;
  /** Caller-localized visible label for an empty segment. Whitespace-only segments use JSON quoting. */
  readonly emptySegmentLabel: string;
  /** Owns URL encoding, destination assembly and collection prefixing. Preferred over `hrefFor`. */
  readonly navigation?: ObjectPathNavigation;
  /** @deprecated Pass `navigation` instead. Receives raw locations and requires caller-owned encoding. */
  readonly hrefFor?: (location: ObjectPathLocation) => string;
}

function fail(code: ObjectPathErrorCode, message: string): BuildObjectPathResult {
  return {ok: false, error: {code, message}};
}

/**
 * Construct bucket/prefix/object items synchronously from exact route or API state.
 * Preserves every slash, Unicode code unit, percent escape and dot segment. The renderer stays generic.
 * A slash-ending object has a same-key prefix ancestor and a distinct object leaf.
 * Invalid scope, invalid input and destination failures settle as an `ObjectPathError` instead of throwing;
 * application field data is never decoded or normalized.
 * No storage requests, authorization checks, existence inference or URL normalization are performed.
 */
export function buildObjectPathBreadcrumbs(options: BuildObjectPathBreadcrumbsOptions): BuildObjectPathResult {
  const {bucket, key, kind, rootPrefix, emptySegmentLabel, navigation, hrefFor} = options;
  if (!bucket.trim()) return fail('blank-bucket', 'Bucket must be nonblank');
  if (!emptySegmentLabel.trim()) return fail('blank-empty-label', 'emptySegmentLabel must be nonblank');
  if (kind !== 'prefix' && kind !== 'object') return fail('invalid-kind', 'Explicit prefix/object kind required');
  if (kind === 'prefix' && key !== '' && !key.endsWith('/')) return fail('invalid-key', 'Prefix must end with /');
  if (kind === 'object' && key === '') return fail('invalid-key', 'Object key must be nonempty');
  if (rootPrefix !== undefined && (!rootPrefix || !rootPrefix.endsWith('/') || !key.startsWith(rootPrefix))) {
    return fail('invalid-root', 'rootPrefix must be a nonempty complete prefix containing the key');
  }

  const encode = navigation?.encode ?? ((raw: string) => encodeURIComponent(raw));
  const encodeLocation = (location: ObjectPathLocation): EncodedObjectPathLocation => {
    if (location.kind === 'bucket') return {kind: 'bucket', bucket: encode(location.bucket)};
    if (location.kind === 'prefix')
      return {kind: 'prefix', bucket: encode(location.bucket), prefix: encode(location.prefix)};
    return {kind: 'object', bucket: encode(location.bucket), key: encode(location.key)};
  };

  const items: BreadcrumbItem[] = [];
  const legacyHrefFor = hrefFor;
  const destinationFor = (location: ObjectPathLocation): string | ObjectPathError => {
    try {
      const href = navigation ? navigation.destination(encodeLocation(location)) : legacyHrefFor?.(location);
      if (!href?.trim()) return {code: 'blank-destination', message: 'Destination factory returned a blank value'};
      return href;
    } catch {
      return {code: 'destination-failed', message: 'Application destination failed'};
    }
  };
  const add = (location: ObjectPathLocation, raw: string, label: string): ObjectPathError | null => {
    const href = destinationFor(location);
    if (typeof href !== 'string') return href;
    items.push({
      id: JSON.stringify([location.kind, bucket, raw]),
      label: label === '' ? emptySegmentLabel : label.trim() ? label : JSON.stringify(label),
      context: raw,
      href,
    });
    return null;
  };

  const collection = navigation?.collection;
  if (rootPrefix === undefined && collection) {
    if (!collection.href?.trim()) return fail('blank-destination', 'collection.href must be nonblank');
    items.push({id: collection.id, label: collection.label, href: collection.href});
  }

  if (rootPrefix === undefined) {
    const error = add({kind: 'bucket', bucket}, bucket, bucket);
    if (error) return fail(error.code, error.message);
  }
  for (let index = key.indexOf('/'); index !== -1; index = key.indexOf('/', index + 1)) {
    const prefix = key.slice(0, index + 1);
    if (rootPrefix !== undefined && prefix.length < rootPrefix.length) continue;
    const previousSlash = key.lastIndexOf('/', index - 1);
    const error = add({kind: 'prefix', bucket, prefix}, prefix, key.slice(previousSlash + 1, index));
    if (error) return fail(error.code, error.message);
  }
  if (kind === 'object') {
    const error = add({kind: 'object', bucket, key}, key, key.slice(key.lastIndexOf('/') + 1));
    if (error) return fail(error.code, error.message);
  }
  return {ok: true, items};
}
