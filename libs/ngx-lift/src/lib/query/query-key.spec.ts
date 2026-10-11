import {describe, expect, it} from 'vitest';

import {QueryKey} from './query.models';
import {serializeQueryKey} from './query-key';

describe('serializeQueryKey', () => {
  it('distinguishes types, delimiters, and nested structures', () => {
    const keys: QueryKey[] = [['a:b', 'c'], ['a', 'b:c'], [1], ['1'], [null], ['null'], [['a', 'b']], ['a', 'b']];
    expect(new Set(keys.map(serializeQueryKey)).size).toBe(keys.length);
  });

  it('normalizes object property ordering at every depth', () => {
    expect(serializeQueryKey(['rows', {filter: {b: 2, a: 1}, page: 0}])).toBe(
      serializeQueryKey(['rows', {page: 0, filter: {a: 1, b: 2}}]),
    );
  });

  it('allows repeated references when they are not circular', () => {
    const filter = {region: 'east'};
    expect(serializeQueryKey([filter, filter])).toBe('[{"region":"east"},{"region":"east"}]');
  });

  it.each([undefined, NaN, Infinity, () => undefined, Symbol('id'), new Date(), new Map(), BigInt(1)])(
    'rejects unsupported parameter %s',
    (value) => {
      expect(() => serializeQueryKey([value] as unknown as QueryKey)).toThrow(TypeError);
    },
  );

  it('rejects circular references, sparse arrays, symbols, and accessors', () => {
    const circular: Record<string, unknown> = {};
    circular['self'] = circular;
    const sparse = new Array(2);
    const symbolProperty = {[Symbol('scope')]: 'secret'};
    const accessor = Object.defineProperty({}, 'region', {enumerable: true, get: () => 'east'});
    for (const value of [circular, sparse, symbolProperty, accessor]) {
      expect(() => serializeQueryKey([value] as unknown as QueryKey)).toThrow(TypeError);
    }
  });
});
