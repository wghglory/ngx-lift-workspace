import {describe, expect, it} from 'vitest';

import {DatagridCustomNumericFilter} from './datagrid-custom-numeric.filter';

interface TestItem {
  id: number;
  score: number;
  metrics?: {
    memory?: number;
  };
  invalid?: unknown;
}

describe('DatagridCustomNumericFilter', () => {
  it('should accept all items when low and high are null or undefined', () => {
    const filter = new DatagridCustomNumericFilter<TestItem>('score');
    const item: TestItem = {id: 1, score: 50};

    expect(filter.accepts(item, null, null)).toBe(true);
    expect(filter.accepts(item, undefined, undefined)).toBe(true);
  });

  it('should filter within range [low, high] inclusively', () => {
    const filter = new DatagridCustomNumericFilter<TestItem>('score');

    expect(filter.accepts({id: 1, score: 10}, 10, 20)).toBe(true);
    expect(filter.accepts({id: 2, score: 15}, 10, 20)).toBe(true);
    expect(filter.accepts({id: 3, score: 20}, 10, 20)).toBe(true);
    expect(filter.accepts({id: 4, score: 9}, 10, 20)).toBe(false);
    expect(filter.accepts({id: 5, score: 21}, 10, 20)).toBe(false);
  });

  it('should filter with only low bound (>= low)', () => {
    const filter = new DatagridCustomNumericFilter<TestItem>('score');

    expect(filter.accepts({id: 1, score: 10}, 10, null)).toBe(true);
    expect(filter.accepts({id: 2, score: 25}, 10, null)).toBe(true);
    expect(filter.accepts({id: 3, score: 5}, 10, null)).toBe(false);
  });

  it('should filter with only high bound (<= high)', () => {
    const filter = new DatagridCustomNumericFilter<TestItem>('score');

    expect(filter.accepts({id: 1, score: 10}, null, 10)).toBe(true);
    expect(filter.accepts({id: 2, score: 5}, null, 10)).toBe(true);
    expect(filter.accepts({id: 3, score: 15}, null, 10)).toBe(false);
  });

  it('should support 0 and negative numbers correctly', () => {
    const filter = new DatagridCustomNumericFilter<TestItem>('score');

    expect(filter.accepts({id: 1, score: 0}, -5, 5)).toBe(true);
    expect(filter.accepts({id: 2, score: -5}, -10, 0)).toBe(true);
    expect(filter.accepts({id: 3, score: -15}, -10, 0)).toBe(false);
  });

  it('should resolve nested dot notation paths', () => {
    const filter = new DatagridCustomNumericFilter<TestItem>('metrics.memory');

    expect(filter.accepts({id: 1, score: 0, metrics: {memory: 1024}}, 512, 2048)).toBe(true);
    expect(filter.accepts({id: 2, score: 0, metrics: {memory: 4096}}, 512, 2048)).toBe(false);
    expect(filter.accepts({id: 3, score: 0, metrics: {}}, 512, 2048)).toBe(false);
    expect(filter.accepts({id: 4, score: 0}, 512, 2048)).toBe(false);
  });

  it('should reject non-number or NaN values when a bound is set', () => {
    const filter = new DatagridCustomNumericFilter<TestItem>('invalid');

    expect(filter.accepts({id: 1, score: 0, invalid: 'string'}, 0, 100)).toBe(false);
    expect(filter.accepts({id: 2, score: 0, invalid: NaN}, 0, 100)).toBe(false);
    expect(filter.accepts({id: 3, score: 0, invalid: null}, 0, 100)).toBe(false);
  });
});
