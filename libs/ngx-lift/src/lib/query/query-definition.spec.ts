import {of} from 'rxjs';
import {describe, expect, expectTypeOf, it} from 'vitest';

import {defineQuery} from './query-definition';
import {QueryDefinition} from './query.models';

describe('defineQuery', () => {
  it('returns the same query definition object unchanged', () => {
    const input = {
      key: ['users', 1],
      loader: () => Promise.resolve({id: 1, name: 'Alice'}),
      staleTime: 5000,
      gcTime: 10000,
      tags: [{type: 'User', id: 1}],
    };
    const definition = defineQuery(input);
    expect(definition).toBe(input);
    expectTypeOf(definition).toEqualTypeOf<QueryDefinition<{id: number; name: string}>>();

    expect(definition.key).toEqual(['users', 1]);
    expect(definition.staleTime).toBe(5000);
    expect(definition.gcTime).toBe(10000);
    expect(definition.tags).toEqual([{type: 'User', id: 1}]);
  });

  it('infers the data type from an Observable loader', () => {
    const definition = defineQuery({
      key: ['posts'],
      loader: () => of([{id: 1, title: 'Test'}]),
    });
    expectTypeOf(definition).toEqualTypeOf<QueryDefinition<{id: number; title: string}[]>>();

    expect(definition.key).toEqual(['posts']);
    const source = definition.loader({
      abortSignal: new AbortController().signal,
      refresh: false,
    });
    expect(source).toBeDefined();
  });
});
