import {buildObjectPathBreadcrumbs, BuildObjectPathBreadcrumbsOptions, ObjectPathLocation} from '../../../index';

function build(overrides: Partial<BuildObjectPathBreadcrumbsOptions> = {}) {
  const locations: ObjectPathLocation[] = [];
  const items = buildObjectPathBreadcrumbs({
    bucket: 'bucket-1',
    key: 'folder-1/folder-nested-2/object-4',
    kind: 'object',
    emptySegmentLabel: '(empty)',
    hrefFor: (location) => {
      locations.push(location);
      return `/app?location=${encodeURIComponent(JSON.stringify(location))}`;
    },
    ...overrides,
  });
  return {items, locations};
}

describe('public exact-key breadcrumb construction', () => {
  it('constructs the requested trail and passes exact domain locations to application routing', () => {
    const {items, locations} = build();
    expect(items.map((item) => item.label)).toEqual(['bucket-1', 'folder-1', 'folder-nested-2', 'object-4']);
    expect(locations).toEqual([
      {kind: 'bucket', bucket: 'bucket-1'},
      {kind: 'prefix', bucket: 'bucket-1', prefix: 'folder-1/'},
      {kind: 'prefix', bucket: 'bucket-1', prefix: 'folder-1/folder-nested-2/'},
      {kind: 'object', bucket: 'bucket-1', key: 'folder-1/folder-nested-2/object-4'},
    ]);
    expect(items.map((item) => item.context)).toEqual([
      'bucket-1',
      'folder-1/',
      'folder-1/folder-nested-2/',
      'folder-1/folder-nested-2/object-4',
    ]);
    expect(items.every((item) => item.href?.startsWith('/app?location='))).toBe(true);
  });

  it('represents the empty prefix as the bucket alone', () => {
    expect(build({key: '', kind: 'prefix'}).locations).toEqual([{kind: 'bucket', bucket: 'bucket-1'}]);
  });

  it('starts at the permitted prefix and never calls the destination factory for higher locations', () => {
    const {items, locations} = build({key: 'allowed/a/item', rootPrefix: 'allowed/'});
    expect(items.map((item) => item.label)).toEqual(['allowed', 'a', 'item']);
    expect(locations).toEqual([
      {kind: 'prefix', bucket: 'bucket-1', prefix: 'allowed/'},
      {kind: 'prefix', bucket: 'bucket-1', prefix: 'allowed/a/'},
      {kind: 'object', bucket: 'bucket-1', key: 'allowed/a/item'},
    ]);
    expect(build({key: 'allowed/', kind: 'prefix', rootPrefix: 'allowed/'}).items).toHaveLength(1);
  });

  it('retains leading/repeated empty segments, percent escapes, Unicode and dot segments literally', () => {
    const key = '/a//%2F/雪/e\u0301/.././object';
    const {items, locations} = build({key});
    expect(items.map((item) => item.label)).toEqual([
      'bucket-1',
      '(empty)',
      'a',
      '(empty)',
      '%2F',
      '雪',
      'e\u0301',
      '..',
      '.',
      'object',
    ]);
    expect(locations.at(-1)).toEqual({kind: 'object', bucket: 'bucket-1', key});
    expect(items.map((item) => item.context)).toContain('/a//%2F/雪/e\u0301/../');
  });

  it('distinguishes a slash-ending object from a same-key prefix and a bucket', () => {
    const {items, locations} = build({key: 'a/', kind: 'object'});
    expect(locations).toEqual([
      {kind: 'bucket', bucket: 'bucket-1'},
      {kind: 'prefix', bucket: 'bucket-1', prefix: 'a/'},
      {kind: 'object', bucket: 'bucket-1', key: 'a/'},
    ]);
    expect(items.at(-1)?.label).toBe('(empty)');
    expect(new Set(items.map((item) => item.id)).size).toBe(3);
    expect(build({key: '/', kind: 'object'}).items).toHaveLength(3);
  });

  it('keeps identity stable across label/URL changes and distinct across repeated names and buckets', () => {
    const first = build({key: 'same/same/'}).items;
    const second = build({key: 'same/same/', emptySegmentLabel: 'leer', hrefFor: () => '/different'}).items;
    expect(first.map((item) => item.id)).toEqual(second.map((item) => item.id));
    expect(new Set(first.map((item) => item.id)).size).toBe(first.length);
    expect(build({key: 'same/same/', bucket: 'other'}).items[1].id).not.toBe(first[1].id);
  });

  it.each([
    {key: 'not-a-complete-prefix', kind: 'prefix'},
    {key: '', kind: 'object'},
    {rootPrefix: ''},
    {rootPrefix: 'folder'},
    {rootPrefix: 'other/'},
    {rootPrefix: 'folder-1x/'},
    {bucket: ''},
    {emptySegmentLabel: ' '},
    {hrefFor: () => ' '},
  ] satisfies Partial<BuildObjectPathBreadcrumbsOptions>[])('rejects ambiguous or out-of-root input: %j', (options) => {
    expect(() => build(options)).toThrow();
  });
});

it('renders whitespace-only labels visibly without changing their raw locations or identities', () => {
  const key = 'a/ /\t/\n/\u00a0/object';
  const {items, locations} = build({key});
  expect(items.map((item) => item.label)).toEqual(['bucket-1', 'a', '" "', '"\\t"', '"\\n"', '"\u00a0"', 'object']);
  expect(items.map((item) => item.context)).toEqual([
    'bucket-1',
    'a/',
    'a/ /',
    'a/ /\t/',
    'a/ /\t/\n/',
    'a/ /\t/\n/\u00a0/',
    key,
  ]);
  expect(locations.at(-1)).toEqual({kind: 'object', bucket: 'bucket-1', key});
  expect(items[2].id).toBe(JSON.stringify(['prefix', 'bucket-1', 'a/ /']));
  expect(build({key: ' a /object'}).items[1].label).toBe(' a ');
});

it('validates scope before invoking an application callback and propagates callback failures', () => {
  const hrefFor = vi.fn(() => '/');
  expect(() => build({key: 'allowed-other/item', rootPrefix: 'allowed/', hrefFor})).toThrow();
  expect(hrefFor).not.toHaveBeenCalled();
  const failure = new Error('Application routing failed');
  expect(() =>
    build({
      hrefFor: () => {
        throw failure;
      },
    }),
  ).toThrow(failure);
});

it('preserves frozen inputs and callback data while constructing the same empty-segment trail', () => {
  const options = Object.freeze({
    bucket: 'b',
    key: '//',
    kind: 'object' as const,
    emptySegmentLabel: '(empty)',
    hrefFor: () => '/',
  });
  const items = buildObjectPathBreadcrumbs(options);
  expect(items.map(({label}) => label)).toEqual(['b', '(empty)', '(empty)', '(empty)']);
  expect(items.map(({context}) => context)).toEqual(['b', '/', '//', '//']);
  expect(new Set(items.map(({id}) => id)).size).toBe(4);
});
