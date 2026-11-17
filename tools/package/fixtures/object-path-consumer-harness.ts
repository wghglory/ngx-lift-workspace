// Pure data + option factory shared by the demo breadcrumb page and the isolated
// installed-package consumer. No Angular runtime imports; `clr-lift` resolves to
// the workspace source in the demo and to the installed tarball in the consumer.
import type {BuildObjectPathBreadcrumbsOptions, EncodedObjectPathLocation, ObjectPathLocation} from 'clr-lift';

/** Exact keys used by both the demo playground and the packaged render proof. */
export const objectPathFixtureData = Object.freeze({
  bucket: 'bucket-1',
  key: '/%2F/雪/../marker/',
  rootPrefix: '/',
  emptySegmentLabel: '(empty)',
});

/** Raw locations the deepened helper must emit for {@link objectPathFixtureData}. */
export const expectedObjectPathLocations: readonly ObjectPathLocation[] = Object.freeze([
  {kind: 'prefix', bucket: 'bucket-1', prefix: '/'},
  {kind: 'prefix', bucket: 'bucket-1', prefix: '/%2F/'},
  {kind: 'prefix', bucket: 'bucket-1', prefix: '/%2F/雪/'},
  {kind: 'prefix', bucket: 'bucket-1', prefix: '/%2F/雪/../'},
  {kind: 'prefix', bucket: 'bucket-1', prefix: '/%2F/雪/../marker/'},
  {kind: 'object', bucket: 'bucket-1', key: '/%2F/雪/../marker/'},
]);

/** URL strategy injected by a consumer that owns its own routes. */
export type ObjectPathDestination = (location: EncodedObjectPathLocation) => string;

/**
 * Build one canonical options object. The helper owns encoding; only the destination
 * is consumer-owned, so an option change is made once here and reused everywhere.
 */
export function createObjectPathOptions(
  destination: ObjectPathDestination,
  overrides: Partial<BuildObjectPathBreadcrumbsOptions> = {},
): BuildObjectPathBreadcrumbsOptions {
  return {
    bucket: objectPathFixtureData.bucket,
    key: objectPathFixtureData.key,
    kind: 'object',
    rootPrefix: objectPathFixtureData.rootPrefix,
    emptySegmentLabel: objectPathFixtureData.emptySegmentLabel,
    navigation: {destination},
    ...overrides,
  };
}

/** The default encoding-only destination used by the packaged consumer. */
export const encodedObjectPathDestination: ObjectPathDestination = (location) => {
  if (location.kind === 'bucket') return '/browse?bucket=' + location.bucket;
  if (location.kind === 'prefix') return '/browse?prefix=' + location.prefix;
  return '/object?key=' + location.key;
};
