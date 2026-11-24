import {expectTypeOf} from 'vitest';

import {omitBy, pickBy} from './pick-by.util';

describe('pickBy function', () => {
  it('should pick properties based on the given condition', () => {
    const inputObject = {
      name: 'John',
      age: 25,
      city: 'New York',
      isActive: true,
    };

    const predicate = (value: unknown, key: string) => typeof value === 'string' || key === 'isActive';

    const result = pickBy(inputObject, predicate);

    expect(result).toEqual({
      name: 'John',
      city: 'New York',
      isActive: true,
    });
  });

  it('should return an empty object if no properties satisfy the condition', () => {
    const inputObject = {
      age: 25,
      isActive: true,
    };

    const predicate = (value: unknown) => typeof value === 'string' && value.length > 10;

    const result = pickBy(inputObject, predicate);

    expect(result).toEqual({});
  });

  it('should handle an empty input object', () => {
    const inputObject = {};
    const predicate = () => true;

    const result = pickBy(inputObject, predicate);

    expect(result).toEqual({});
  });

  it('should handle a predicate that always returns true', () => {
    const inputObject = {
      name: 'John',
      age: 25,
      city: 'New York',
      isActive: true,
    };

    const predicate = () => true;

    const result = pickBy(inputObject, predicate);

    expect(result).toEqual(inputObject);
  });

  it('preserves an own __proto__ data property without changing the result prototype', () => {
    const source: Record<string, unknown> = JSON.parse('{"__proto__":{"unexpected":true},"safe":1}');
    const result = pickBy(source, () => true);
    expect(Object.getPrototypeOf(result)).toBe(Object.prototype);
    expect(Object.hasOwn(result, '__proto__')).toBe(true);
    expect(result['__proto__']).toEqual({unexpected: true});
  });

  it('negates the predicate when options.negate is true', () => {
    const input = {a: 1, b: 2, c: 3, d: 4};

    expect(pickBy(input, (value) => value % 2 === 0, {negate: true})).toEqual({a: 1, c: 3});
    expect(pickBy(input, () => true, {negate: true})).toEqual({});
    expect(pickBy(input, () => false, {negate: true})).toEqual(input);
  });

  it('preserves prototype safety when negating', () => {
    const source: Record<string, unknown> = JSON.parse('{"__proto__":{"unexpected":true},"safe":1}');
    const result = pickBy(source, () => false, {negate: true});
    expect(Object.getPrototypeOf(result)).toBe(Object.prototype);
    expect(Object.hasOwn(result, '__proto__')).toBe(true);
    expect(result['__proto__']).toEqual({unexpected: true});
  });

  it('keeps the deprecated omitBy alias equivalent to negated pickBy', () => {
    const input = {name: 'John', age: 25, city: 'New York', isActive: true};
    const predicate = (value: unknown) => typeof value === 'string';

    expect(omitBy(input, predicate)).toEqual(pickBy(input, predicate, {negate: true}));
    expect(omitBy(input, predicate)).toEqual({age: 25, isActive: true});
  });
});

describe('predicate value narrowing', () => {
  const bounds: {min: number | null; max: number | null} = {min: 0, max: null};
  const isNumber = (value: unknown): value is number => typeof value === 'number';
  const isNull = (value: unknown): value is null => value === null;

  it('narrows numeric bounds without losing zero or mutating the input', () => {
    const result = pickBy(bounds, isNumber);
    expectTypeOf(result).toEqualTypeOf<{min?: number; max?: number}>();
    expect(result).toEqual({min: 0});
    expect(bounds).toEqual({min: 0, max: null});
    expect(pickBy({min: null, max: null}, isNumber)).toEqual({});
    // @ts-expect-error Filtering cannot guarantee that a key is present.
    const required: {min: number} = result;
    void required;
  });

  it('supports inferred predicates and explicit false negation', () => {
    const inferred = pickBy(bounds, (value) => typeof value === 'number');
    const explicit = pickBy(bounds, isNumber, {negate: false});
    expectTypeOf(inferred).toEqualTypeOf<{min?: number; max?: number}>();
    expectTypeOf(explicit).toEqualTypeOf<typeof inferred>();
    expect(explicit).toEqual({min: 0});
  });

  it('narrows inverse filtering and the deprecated alias consistently', () => {
    const inverse = pickBy(bounds, isNull, {negate: true});
    const alias = omitBy(bounds, isNull);
    expectTypeOf(inverse).toEqualTypeOf<{min?: number; max?: number}>();
    expectTypeOf(alias).toEqualTypeOf<typeof inverse>();
    expect(inverse).toEqual({min: 0});
    expect(alias).toEqual(inverse);
  });

  it('keeps conservative types for boolean predicates and dynamic negation', () => {
    const predicate = (value: unknown): boolean => typeof value === 'number';
    const options: {negate: boolean} = {negate: true};
    const normal = pickBy(bounds, predicate);
    const inverse = omitBy(bounds, predicate);
    const dynamic = pickBy(bounds, isNumber, options);
    expectTypeOf(normal).toEqualTypeOf<Partial<typeof bounds>>();
    expectTypeOf(inverse).toEqualTypeOf<Partial<typeof bounds>>();
    expectTypeOf(dynamic).toEqualTypeOf<Partial<typeof bounds>>();
    expect(dynamic).toEqual({max: null});
  });

  it('preserves literals and readonly modifiers for heterogeneous properties', () => {
    const source: {readonly count: 0 | null; label: string | null} = {count: 0, label: 'ready'};
    const numeric = pickBy(source, (value) => typeof value === 'number');
    expectTypeOf(numeric).toEqualTypeOf<{readonly count?: 0; label?: never}>();
    const nonNull = omitBy(source, isNull);
    expectTypeOf(nonNull).toEqualTypeOf<{readonly count?: 0; label?: string}>();
    expect(nonNull).toEqual(source);
  });

  it('narrows unknown dictionary values without collapsing them to never', () => {
    const source: Record<string, unknown> = {count: 0, label: 'ready'};
    const numeric = pickBy(source, isNumber);
    expectTypeOf(numeric).toEqualTypeOf<Partial<Record<string, number>>>();
    expect(numeric).toEqual({count: 0});
  });
});

describe('review regressions', () => {
  const isNumber = (value: unknown): value is number => typeof value === 'number';

  it('does not narrow options whose negation is hidden by structural widening', () => {
    const hidden: object = {negate: true};
    const result = pickBy({min: 0, max: null} as {min: number | null; max: number | null}, isNumber, hidden);
    expectTypeOf(result).toEqualTypeOf<{min?: number | null; max?: number | null}>();
    expect(result).toEqual({max: null});
  });

  it('retains contextual typing for inline numeric callbacks in every mode', () => {
    const source = {a: 1, b: 2};
    expect(pickBy(source, (value) => value % 2 === 0)).toEqual({b: 2});
    expect(pickBy(source, (value) => value % 2 === 0, {negate: true})).toEqual({a: 1});
    expect(omitBy(source, (value) => value % 2 === 0)).toEqual({a: 1});
  });

  it('supports reusable guards broader than literal source values', () => {
    const source: {min: 0 | null; max: 1 | null} = {min: 0, max: null};
    const picked = pickBy(source, isNumber);
    const inverse = pickBy(source, isNumber, {negate: true});
    const alias = omitBy(source, isNumber);
    expectTypeOf(picked).toEqualTypeOf<{min?: 0; max?: 1}>();
    expectTypeOf(inverse).toEqualTypeOf<{min?: null; max?: null}>();
    expectTypeOf(alias).toEqualTypeOf<typeof inverse>();
    expect(picked).toEqual({min: 0});
    expect(inverse).toEqual({max: null});
    expect(alias).toEqual(inverse);
  });

  it.each(['pick', 'negate', 'alias'] as const)('copies the tested getter value in %s mode', (mode) => {
    let reads = 0;
    const source = {
      get min(): number | null {
        return ++reads === 1 ? 1 : null;
      },
    };
    const isNull = (value: unknown): value is null => value === null;
    const result =
      mode === 'pick'
        ? pickBy(source, isNumber)
        : mode === 'negate'
          ? pickBy(source, isNull, {negate: true})
          : omitBy(source, isNull);
    expect(result).toEqual({min: 1});
    expect(reads).toBe(1);
  });
});
