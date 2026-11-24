import {omitBy, pickBy} from 'ngx-lift';

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
