import {BreadcrumbItem} from './breadcrumb.model';

/** Exact domain location passed to the application destination factory; never URL-decoded. */
export type ObjectPathLocation =
  | {readonly kind: 'bucket'; readonly bucket: string}
  | {readonly kind: 'prefix'; readonly bucket: string; readonly prefix: string}
  | {readonly kind: 'object'; readonly bucket: string; readonly key: string};

/** Options for slash-delimited browsing. This contract does not establish authorization or existence. */
export interface BuildObjectPathBreadcrumbsOptions {
  readonly bucket: string;
  readonly key: string;
  readonly kind: 'prefix' | 'object';
  /** Nonempty slash-terminated permitted root. Higher locations are excluded, including callback calls. */
  readonly rootPrefix?: string;
  /** Caller-localized visible label for an empty segment. Whitespace-only segments use JSON quoting. */
  readonly emptySegmentLabel: string;
  /** Called once per returned location, including current. Encode raw keys once in your URL scheme. */
  readonly hrefFor: (location: ObjectPathLocation) => string;
}

/**
 * Construct bucket/prefix/object items synchronously from exact route or API state.
 * Preserves every slash, Unicode code unit, percent escape and dot segment. The renderer stays generic.
 * A slash-ending object has a same-key prefix ancestor and a distinct object leaf.
 * @throws For blank bucket/empty label/destination, invalid kind/key, or an invalid/outside permitted root.
 * No storage requests, authorization checks, existence inference or URL normalization are performed.
 */
export function buildObjectPathBreadcrumbs(options: BuildObjectPathBreadcrumbsOptions): readonly BreadcrumbItem[] {
  const {bucket, key, kind, rootPrefix, emptySegmentLabel, hrefFor} = options;
  if (!bucket.trim() || !emptySegmentLabel.trim()) throw new Error('Bucket and emptySegmentLabel must be nonblank');
  if (kind !== 'prefix' && kind !== 'object') throw new Error('Explicit prefix/object kind required');
  if (kind === 'prefix' && key !== '' && !key.endsWith('/')) throw new Error('Prefix must end with /');
  if (kind === 'object' && key === '') throw new Error('Object key must be nonempty');
  if (rootPrefix !== undefined && (!rootPrefix || !rootPrefix.endsWith('/') || !key.startsWith(rootPrefix))) {
    throw new Error('rootPrefix must be a nonempty complete prefix containing the key');
  }
  const items: BreadcrumbItem[] = [];
  const add = (location: ObjectPathLocation, raw: string, label: string) => {
    const href = hrefFor(location);
    if (!href.trim()) throw new Error('hrefFor must return a nonblank application destination');
    items.push({
      id: JSON.stringify([location.kind, bucket, raw]),
      label: label === '' ? emptySegmentLabel : label.trim() ? label : JSON.stringify(label),
      context: raw,
      href,
    });
  };
  if (rootPrefix === undefined) add({kind: 'bucket', bucket}, bucket, bucket);
  for (let index = key.indexOf('/'); index !== -1; index = key.indexOf('/', index + 1)) {
    const prefix = key.slice(0, index + 1);
    if (rootPrefix !== undefined && prefix.length < rootPrefix.length) continue;
    const previousSlash = key.lastIndexOf('/', index - 1);
    add({kind: 'prefix', bucket, prefix}, prefix, key.slice(previousSlash + 1, index));
  }
  if (kind === 'object') add({kind: 'object', bucket, key}, key, key.slice(key.lastIndexOf('/') + 1));
  return items;
}
