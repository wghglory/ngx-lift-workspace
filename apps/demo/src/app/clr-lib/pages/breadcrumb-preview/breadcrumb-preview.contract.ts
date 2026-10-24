/** Demo-local #185 helper contracts; the item shape matches the public breadcrumb contract. */
export interface BreadcrumbItem {
  readonly id: string;
  readonly label: string;
  readonly href?: string;
  readonly context?: string;
}

export interface BreadcrumbLinkContext {
  readonly $implicit: BreadcrumbItem;
}

export type ObjectPathLocation =
  | {readonly kind: 'bucket'; readonly bucket: string}
  | {readonly kind: 'prefix'; readonly bucket: string; readonly prefix: string}
  | {readonly kind: 'object'; readonly bucket: string; readonly key: string};

export interface BuildObjectPathBreadcrumbsOptions {
  readonly bucket: string;
  readonly key: string;
  readonly kind: 'prefix' | 'object';
  readonly rootPrefix?: string;
  readonly emptySegmentLabel: string;
  readonly hrefFor: (location: ObjectPathLocation) => string;
}

/** Slash browsing convention only: never decode, normalize, trim or query storage. */
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
