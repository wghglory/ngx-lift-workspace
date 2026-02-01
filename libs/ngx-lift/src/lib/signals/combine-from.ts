/* eslint-disable @typescript-eslint/no-explicit-any */
import {assertInInjectionContext, computed, Injector, isSignal, Signal, untracked} from '@angular/core';
import {toObservable, toSignal} from '@angular/core/rxjs-interop';
import {
  combineLatest,
  distinctUntilChanged,
  from,
  identity,
  isObservable,
  ObservableInput,
  ObservableInputTuple,
  OperatorFunction,
  startWith,
} from 'rxjs';

type ObservableSignalInput<T> = ObservableInput<T> | Signal<T>;

type ObservableSignalInputTuple<T> = {
  [K in keyof T]: ObservableSignalInput<T[K]> | (() => T[K]);
};

// pick from ToSignalOptions
export type CombineFromOptions<IValue> = {
  readonly injector?: Injector;
  readonly initialValue?: IValue;
};

// array inputs only
export function combineFrom<Input extends readonly unknown[], Output = Input>(
  sources: readonly [...ObservableSignalInputTuple<Input>],
): Signal<Output>;

// ---------- 3 args with array inputs -------------
// combineFrom([signal, obs$], pipeOperator, { initialValue: [1,2] }), Input is [signal, obs$]
// 1. no initialValue
export function combineFrom<Input extends readonly unknown[], Output = Input>(
  sources: readonly [...ObservableSignalInputTuple<Input>],
  operator?: OperatorFunction<Input, Output>,
  options?: CombineFromOptions<undefined>,
): Signal<Output | undefined>;
// 2. initialValue is null, returning type should include null
export function combineFrom<Input extends readonly unknown[], Output = Input>(
  sources: readonly [...ObservableSignalInputTuple<Input>],
  operator?: OperatorFunction<Input, Output>,
  options?: CombineFromOptions<null>,
): Signal<Output | null>;
// 3. provide initialValue
export function combineFrom<Input extends readonly unknown[], Output = Input>(
  sources: readonly [...ObservableSignalInputTuple<Input>],
  operator?: OperatorFunction<Input, Output>,
  options?: CombineFromOptions<Output>,
): Signal<Output>;

// ---------- 2 args with array inputs -------------
// 1. no initialValue
export function combineFrom<Input extends readonly unknown[], Output = Input>(
  sources: readonly [...ObservableSignalInputTuple<Input>],
  options?: CombineFromOptions<undefined>,
): Signal<Output | undefined>;
// 2. initialValue is null, returning type should include null
export function combineFrom<Input extends readonly unknown[], Output = Input>(
  sources: readonly [...ObservableSignalInputTuple<Input>],
  options?: CombineFromOptions<null>,
): Signal<Output | null>;
// 3. provide initialValue
export function combineFrom<Input extends readonly unknown[], Output = Input>(
  sources: readonly [...ObservableSignalInputTuple<Input>],
  options?: CombineFromOptions<Output>,
): Signal<Output>;

// object input only, e.g. Input is { a: signal, b: obs$ }
export function combineFrom<Input extends object, Output = Input>(
  sources: ObservableSignalInputTuple<Input>,
): Signal<Output>;

// ----------------- 3 args with object input --------------------
export function combineFrom<Input extends object, Output = Input>(
  sources: ObservableSignalInputTuple<Input>,
  operator?: OperatorFunction<Input, Output>,
  options?: CombineFromOptions<undefined>,
): Signal<Output | undefined>;
export function combineFrom<Input extends object, Output = Input>(
  sources: ObservableSignalInputTuple<Input>,
  operator?: OperatorFunction<Input, Output>,
  options?: CombineFromOptions<null>,
): Signal<Output | null>;
export function combineFrom<Input extends object, Output = Input>(
  sources: ObservableSignalInputTuple<Input>,
  operator?: OperatorFunction<Input, Output>,
  options?: CombineFromOptions<Output>,
): Signal<Output>;

// ----------------- 2 args with object input --------------------
export function combineFrom<Input extends object, Output = Input>(
  sources: ObservableSignalInputTuple<Input>,
  options?: CombineFromOptions<undefined>,
): Signal<Output | undefined>;
export function combineFrom<Input extends object, Output = Input>(
  sources: ObservableSignalInputTuple<Input>,
  options?: CombineFromOptions<null>,
): Signal<Output | null>;
export function combineFrom<Input extends object, Output = Input>(
  sources: ObservableSignalInputTuple<Input>,
  options?: CombineFromOptions<Output>,
): Signal<Output>;

/**
 * Combines multiple `Observable` or `Signal` sources into a `Signal` that emits their combined values.
 * This function is similar to RxJS `combineLatest`, but works with both Observables and Signals,
 * and returns a Signal instead of an Observable.
 *
 * The function supports:
 * - Array of sources: Returns a Signal of an array
 * - Object of sources: Returns a Signal of an object with the same keys
 * - Optional RxJS operator: Apply transformations to the combined values
 * - Optional initial value: Provide an initial value for the Signal
 *
 * @template Input - The type of the input sources (array or object).
 * @template Output - The type of the output Signal (defaults to Input).
 *
 * @param sources - Array or object of `Observable` or `Signal` values to combine.
 * @param operator - Optional RxJS operator function to transform the combined values.
 * @param options - Optional configuration object:
 *   - `initialValue`: Initial value for the Signal (required if sources don't emit synchronously)
 *   - `injector`: Angular injector to use for signal conversion
 * @returns A Signal that emits the combined values from all sources.
 *
 * @example
 * ```typescript
 * // Array of sources
 * export class Component {
 *   private readonly userService = inject(UserService);
 *   page = signal(2);
 *
 *   data = combineFrom(
 *     [this.page, this.userService.users$],
 *     pipe(
 *       switchMap(([page, users]) => this.dataService.getData(page, users)),
 *       startWith([])
 *     )
 *   );
 * }
 *
 * // Object of sources
 * const vm = combineFrom({
 *   users: users$,
 *   filters: filtersSignal,
 *   page: pageSignal
 * });
 *
 * // With initial value
 * const data = combineFrom(
 *   [source1$, source2$],
 *   { initialValue: [null, null] }
 * );
 * ```
 */
export function combineFrom<Input = any, Output = Input>(...args: any[]): Signal<Output | null | undefined> {
  assertInInjectionContext(combineFrom);

  const {normalizedSources, hasInitValue, operator, options} = normalizeArgs<Input, Output>(args);

  const ret =
    hasInitValue && options?.initialValue !== undefined
      ? toSignal(combineLatest(normalizedSources).pipe(operator), {
          initialValue: options.initialValue,
          injector: options?.injector,
        })
      : // Note: requireSync is not used here to allow async sources without initialValue
        // The signal will be undefined until all sources emit at least once
        (toSignal(combineLatest(normalizedSources).pipe(operator), {
          injector: options?.injector,
        }) as Signal<Output | undefined>);

  return ret;
}

function normalizeArgs<Input, Output>(
  args: any[],
): {
  normalizedSources: ObservableInputTuple<Input>;
  operator: OperatorFunction<Input, Output>;
  hasInitValue: boolean;
  options: CombineFromOptions<Output> | undefined;
} {
  if (!args || args.length < 1 || typeof args[0] !== 'object') {
    throw new TypeError('combineFrom needs sources');
  }

  const hasOperator = typeof args[1] === 'function';

  if (args.length === 3 && !hasOperator) {
    throw new TypeError('combineFrom needs a pipe operator as the second argument');
  }

  // pass sources and options
  if (!hasOperator) {
    // add identity function to args at index 1 as operator function as x=>x
    args.splice(1, 0, identity);
  }

  // if no operator passed, identity will be operator
  const [sources, operator, options] = args;

  const hasInitValue = options?.initialValue !== undefined;

  const normalizedSources = Object.entries(sources).reduce(
    (acc, [keyOrIndex, source]) => {
      if (isSignal(source)) {
        // fix angular NG0950: Input is required but no value is available yet.
        // when input.required is used as combineFrom's input, its value is undefined, untracked(source) will throw error
        let initialValue: any;
        try {
          initialValue = untracked(source);
        } catch {
          // If the input is not set, skip startWith or provide a fallback
          initialValue = undefined;
        }
        // toObservable doesn't immediately emit initialValue of the signal
        acc[keyOrIndex] = toObservable(source, {
          injector: options?.injector,
        }).pipe(startWith(initialValue));
      } else if (isObservable(source)) {
        acc[keyOrIndex] = source.pipe(distinctUntilChanged());
      } else if (typeof source === 'function') {
        // seldom use: pass function like () => 5
        const computedRes = computed(source as () => unknown);
        acc[keyOrIndex] = toObservable(computedRes, {
          injector: options?.injector,
        }).pipe(startWith(source()));
      } else {
        // seldom use: pass promise, Map, array, etc that from accepts
        acc[keyOrIndex] = from(source as any).pipe(distinctUntilChanged());
      }
      return acc;
    },
    (Array.isArray(sources) ? [] : {}) as any,
  );

  return {normalizedSources, operator, hasInitValue, options};
}
