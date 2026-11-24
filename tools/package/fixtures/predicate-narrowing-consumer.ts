import {distinctUntilChanged, map, type Observable, pairwise, pipe, startWith, type UnaryFunction} from 'rxjs';
import {isEqual, omitBy, pickBy} from 'ngx-lift';

const bounds: {min: number | null; max: number | null} = {min: 0, max: null};
const isNumber = (value: unknown): value is number => typeof value === 'number';
const isNull = (value: unknown): value is null => value === null;

const numeric = pickBy(bounds, isNumber);
const inverse = pickBy(bounds, isNull, {negate: true});
const legacy = omitBy(bounds, isNull);
const payloads: {min?: number; max?: number}[] = [numeric, inverse, legacy];

// @ts-expect-error Predicates cannot guarantee that a particular key survives.
const required: {min: number} = numeric;
// @ts-expect-error A numeric predicate cannot return null values.
const nullOnly: {min?: null; max?: null} = numeric;

const dynamicOptions: {negate: boolean} = {negate: true};
const dynamic = pickBy(bounds, isNumber, dynamicOptions);
// @ts-expect-error Dynamic negation may keep null values instead of numbers.
const uncertain: {min?: number; max?: number} = dynamic;

void [payloads, required, nullOnly, uncertain];

const literalBounds: {min: 0 | null; max: 1 | null} = {min: 0, max: null};
const literalPicked: {min?: 0; max?: 1} = pickBy(literalBounds, isNumber);
const literalInverse: {min?: null; max?: null} = pickBy(literalBounds, isNumber, {negate: true});
const literalAlias: {min?: null; max?: null} = omitBy(literalBounds, isNumber);
const hiddenOptions: object = {negate: true};
const hidden = pickBy(bounds, isNumber, hiddenOptions);
// @ts-expect-error Structurally hidden negation cannot promise numeric values.
const hiddenNumeric: {min?: number; max?: number} = hidden;
// @ts-expect-error A predicate accepting only strings cannot inspect number/null values.
pickBy(bounds, (value: string): value is 'ready' => value === 'ready');
const differentShapes: boolean = isEqual({name: 'Ada'}, {id: 1});
const differentPrimitives: boolean = isEqual(1, '1');
const explicitGeneric: boolean = isEqual<number>(1, 1);
void [
  literalPicked,
  literalInverse,
  literalAlias,
  hiddenNumeric,
  differentShapes,
  differentPrimitives,
  explicitGeneric,
];

// Explicit source type arguments preserve the original broad return contract.
const legacyPicked = pickBy<typeof bounds>(bounds, isNumber);
const legacyOmitted = omitBy<typeof bounds>(bounds, isNull);
legacyPicked.min = null;
legacyOmitted.max = null;
const booleanCallback = pickBy(bounds, (value): boolean => value !== null);
booleanCallback.min = null;
// Narrowed inference deliberately rejects reintroducing excluded values.
// @ts-expect-error Guard-filtered numeric results cannot subsequently contain null.
numeric.min = null;
const numericComparator: (left: number, right: number) => boolean = isEqual;
void [legacyPicked, legacyOmitted, booleanCallback, numericComparator];

// Preserve contextual inference when used as an RxJS comparator in an operator factory.
function equalityPipeline(enabled: boolean): UnaryFunction<Observable<number | null>, Observable<number | null>> {
  return pipe(
    startWith(null),
    pairwise(),
    map(([, current]) => current),
    enabled ? distinctUntilChanged(isEqual) : map((current) => current),
  );
}
void equalityPipeline;

const optionalBounds: {readonly min?: 0 | null; max?: 1 | null} = {min: 0, max: null};
const optionalPicked: {readonly min?: 0; max?: 1} = pickBy(optionalBounds, isNumber);
const optionalInverse: {readonly min?: null; max?: null} = pickBy(optionalBounds, isNumber, {negate: true});
const optionalAlias: {readonly min?: null; max?: null} = omitBy(optionalBounds, isNumber);
type UnionSource = {kind: 'a'; a: number | null} | {kind: 'b'; b: string | null};
function filterUnion(source: UnionSource) {
  const picked = pickBy(source, (value) => typeof value === 'number');
  const inverse: Partial<{kind: 'a'; a: null} | {kind: 'b'; b: string | null}> = pickBy(
    source,
    (value) => typeof value === 'number',
    {negate: true},
  );
  const alias: typeof inverse = omitBy(source, (value) => typeof value === 'number');
  if ('a' in picked) {
    const value: number | undefined = picked.a;
    // @ts-expect-error A number can survive filtering even though it belongs to a union-only key.
    const absent: undefined = picked.a;
    void [value, absent];
  }
  // @ts-expect-error A callback must accept values of union-only properties, not only common keys.
  pickBy(source, (value: 'a' | 'b'): value is 'a' => value === 'a');
  void [inverse, alias];
}
void [optionalPicked, optionalInverse, optionalAlias, filterUnion];
