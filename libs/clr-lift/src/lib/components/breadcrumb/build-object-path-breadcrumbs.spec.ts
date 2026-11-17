import {buildObjectPathBreadcrumbs, BuildObjectPathBreadcrumbsOptions, ObjectPathLocation} from '../../../index';

function build(overrides: Partial<BuildObjectPathBreadcrumbsOptions> = {}) {
  const locations: ObjectPathLocation[] = [];
  const result = buildObjectPathBreadcrumbs({
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
  return {result, locations};
}

function items(overrides: Partial<BuildObjectPathBreadcrumbsOptions> = {}) {
  const built = build(overrides);
  if (!built.result.ok) throw built.result.error;
  return {...built, items: built.result.items};
}

describe('public exact-key breadcrumb construction', () => {
  it('constructs the requested trail and passes exact domain locations to application routing', () => {
    const {items: trail, locations} = items();
    expect(trail.map((item) => item.label)).toEqual(['bucket-1', 'folder-1', 'folder-nested-2', 'object-4']);
    expect(locations).toEqual([
      {kind: 'bucket', bucket: 'bucket-1'},
      {kind: 'prefix', bucket: 'bucket-1', prefix: 'folder-1/'},
      {kind: 'prefix', bucket: 'bucket-1', prefix: 'folder-1/folder-nested-2/'},
      {kind: 'object', bucket: 'bucket-1', key: 'folder-1/folder-nested-2/object-4'},
    ]);
    expect(trail.map((item) => item.context)).toEqual([
      'bucket-1',
      'folder-1/',
      'folder-1/folder-nested-2/',
      'folder-1/folder-nested-2/object-4',
    ]);
    expect(trail.every((item) => item.href?.startsWith('/app?location='))).toBe(true);
  });

  it('represents the empty prefix as the bucket alone', () => {
    expect(items({key: '', kind: 'prefix'}).locations).toEqual([{kind: 'bucket', bucket: 'bucket-1'}]);
  });

  it('starts at the permitted prefix and never calls the destination factory for higher locations', () => {
    const {items: trail, locations} = items({key: 'allowed/a/item', rootPrefix: 'allowed/'});
    expect(trail.map((item) => item.label)).toEqual(['allowed', 'a', 'item']);
    expect(locations).toEqual([
      {kind: 'prefix', bucket: 'bucket-1', prefix: 'allowed/'},
      {kind: 'prefix', bucket: 'bucket-1', prefix: 'allowed/a/'},
      {kind: 'object', bucket: 'bucket-1', key: 'allowed/a/item'},
    ]);
    expect(items({key: 'allowed/', kind: 'prefix', rootPrefix: 'allowed/'}).items).toHaveLength(1);
  });

  it('retains leading/repeated empty segments, percent escapes, Unicode and dot segments literally', () => {
    const key = '/a//%2F/雪/e\u0301/.././object';
    const {items: trail, locations} = items({key});
    expect(trail.map((item) => item.label)).toEqual([
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
    expect(trail.map((item) => item.context)).toContain('/a//%2F/雪/e\u0301/../');
  });

  it('distinguishes a slash-ending object from a same-key prefix and a bucket', () => {
    const {items: trail, locations} = items({key: 'a/', kind: 'object'});
    expect(locations).toEqual([
      {kind: 'bucket', bucket: 'bucket-1'},
      {kind: 'prefix', bucket: 'bucket-1', prefix: 'a/'},
      {kind: 'object', bucket: 'bucket-1', key: 'a/'},
    ]);
    expect(trail.at(-1)?.label).toBe('(empty)');
    expect(new Set(trail.map((item) => item.id)).size).toBe(3);
    expect(items({key: '/', kind: 'object'}).items).toHaveLength(3);
  });

  it('keeps identity stable across label/URL changes and distinct across repeated names and buckets', () => {
    const first = items({key: 'same/same/'}).items;
    const second = items({key: 'same/same/', emptySegmentLabel: 'leer', hrefFor: () => '/different'}).items;
    expect(first.map((item) => item.id)).toEqual(second.map((item) => item.id));
    expect(new Set(first.map((item) => item.id)).size).toBe(first.length);
    expect(items({key: 'same/same/', bucket: 'other'}).items[1].id).not.toBe(first[1].id);
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
  ] satisfies Partial<BuildObjectPathBreadcrumbsOptions>[])(
    'settles an error result for ambiguous or out-of-root input: %j',
    (options) => {
      expect(build(options).result.ok).toBe(false);
    },
  );
});

it('renders whitespace-only labels visibly without changing their raw locations or identities', () => {
  const key = 'a/ /\t/\n/\u00a0/object';
  const {items: trail, locations} = items({key});
  expect(trail.map((item) => item.label)).toEqual(['bucket-1', 'a', '" "', '"\\t"', '"\\n"', '"\u00a0"', 'object']);
  expect(trail.map((item) => item.context)).toEqual([
    'bucket-1',
    'a/',
    'a/ /',
    'a/ /\t/',
    'a/ /\t/\n/',
    'a/ /\t/\n/\u00a0/',
    key,
  ]);
  expect(locations.at(-1)).toEqual({kind: 'object', bucket: 'bucket-1', key});
  expect(trail[2].id).toBe(JSON.stringify(['prefix', 'bucket-1', 'a/ /']));
  expect(items({key: ' a /object'}).items[1].label).toBe(' a ');
});

it('validates scope before invoking a destination and settles callback failures as error results', () => {
  const hrefFor = vi.fn(() => '/');
  expect(build({key: 'allowed-other/item', rootPrefix: 'allowed/', hrefFor}).result.ok).toBe(false);
  expect(hrefFor).not.toHaveBeenCalled();
  expect(build({hrefFor: () => ' '}).result).toMatchObject({ok: false, error: {code: 'blank-destination'}});
  expect(
    build({
      hrefFor: () => {
        throw new Error('Application routing failed');
      },
    }).result,
  ).toMatchObject({ok: false, error: {code: 'destination-failed'}});
});

it('preserves frozen inputs and callback data while constructing the same empty-segment trail', () => {
  const options = Object.freeze({
    bucket: 'b',
    key: '//',
    kind: 'object' as const,
    emptySegmentLabel: '(empty)',
    hrefFor: () => '/',
  });
  const result = buildObjectPathBreadcrumbs(options);
  if (!result.ok) throw result.error;
  expect(result.items.map(({label}) => label)).toEqual(['b', '(empty)', '(empty)', '(empty)']);
  expect(result.items.map(({context}) => context)).toEqual(['b', '/', '//', '//']);
  expect(new Set(result.items.map(({id}) => id)).size).toBe(4);
});

describe('deepened navigation contract', () => {
  it('encodes raw fields once through the helper and owns collection prefixing', () => {
    const encode = vi.fn((raw: string) => encodeURIComponent(raw));
    const destination = vi.fn((location: {kind: string}) => `/app/${location.kind}`);
    const result = buildObjectPathBreadcrumbs({
      bucket: 'bucket-1',
      key: 'folder-1/object-4',
      kind: 'object',
      emptySegmentLabel: '(empty)',
      navigation: {
        encode,
        destination,
        collection: {id: 'all', label: 'All buckets', href: '/buckets'},
      },
    });
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.items[0]).toEqual({id: 'all', label: 'All buckets', href: '/buckets'});
    expect(result.items.map((item) => item.href)).toEqual(['/buckets', '/app/bucket', '/app/prefix', '/app/object']);
    expect(encode).toHaveBeenCalledWith('bucket-1');
    expect(encode).toHaveBeenCalledWith('folder-1/');
    expect(destination).toHaveBeenCalledTimes(3);
  });

  it('omits the collection item for a restricted root and settles a blank destination as an error', () => {
    const restricted = buildObjectPathBreadcrumbs({
      bucket: 'b',
      key: 'allowed/item',
      kind: 'object',
      rootPrefix: 'allowed/',
      emptySegmentLabel: '(empty)',
      navigation: {
        destination: () => '/app',
        collection: {id: 'all', label: 'All', href: '/all'},
      },
    });
    expect(restricted.ok).toBe(true);
    if (restricted.ok) expect(restricted.items.some((item) => item.id === 'all')).toBe(false);

    const blank = buildObjectPathBreadcrumbs({
      bucket: 'b',
      key: 'item',
      kind: 'object',
      emptySegmentLabel: '(empty)',
      navigation: {destination: () => ' '},
    });
    expect(blank).toMatchObject({ok: false, error: {code: 'blank-destination'}});
  });
});
