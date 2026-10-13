import {of} from 'rxjs';
import {describe, expect, it} from 'vitest';

import {defineQuery} from './query-definition';

describe('defineQuery', () => {
  it('returns the same query definition object unchanged', () => {
    const definition = defineQuery({
      key: ['users', 1],
      loader: () => Promise.resolve({id: 1, name: 'Alice'}),
      staleTime: 5000,
      gcTime: 10000,
      tags: [{type: 'User', id: 1}],
    });

    expect(definition.key).toEqual(['users', 1]);
    expect(definition.staleTime).toBe(5000);
    expect(definition.gcTime).toBe(10000);
    expect(definition.tags).toEqual([{type: 'User', id: 1}]);
  });

  it('preserves Observable loader return types and execution', async () => {
    const definition = defineQuery({
      key: ['posts'],
      loader: () => of([{id: 1, title: 'Test'}]),
    });

    expect(definition.key).toEqual(['posts']);
    const source = definition.loader({
      abortSignal: new AbortController().signal,
      refresh: false,
    });
    expect(source).toBeDefined();
  });
});
