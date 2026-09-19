/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  assertInInjectionContext,
  computed,
  Injector,
  isSignal,
  runInInjectionContext,
  Signal,
  untracked,
} from '@angular/core';
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

import {isPromise} from '../utils/is-promise.util';

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
 * Combines multiple `Signal`, `Observable`, `Promise`, or getter function sources into a single `Signal`.
 * Similar to RxJS `combineLatest`, but returns an Angular Signal and seamlessly handles Signals,
 * Observables, and functions with glitch-free initialization.
 *
 * Supported source types:
 * - **Signal**: Converted via `toObservable()`, initialized with the current value to prevent dropped emissions,
 *   and deduplicated via `distinctUntilChanged()`.
 * - **Observable**: Deduplicated via `distinctUntilChanged()`.
 * - **Function `() => T`**: Evaluated and wrapped in Angular `computed()`, then converted via `toObservable()`.
 * - **Promise**: Converted via `from(promise)` without redundant `distinctUntilChanged()`. Note that Promises
 *   resolve asynchronously in a microtask; therefore, the combined Signal will hold `undefined` (or `initialValue`)
 *   until the Promise resolves.
 * - **Other `ObservableInput`**: Converted via `from()`.
 *
 * The function supports:
 * - Array of sources: Returns a Signal emitting an array of combined values.
 * - Object of sources: Returns a Signal emitting an object with matching keys.
 * - Optional RxJS operator: Apply transformations or side-effects to the combined emissions.
 * - Optional initial value: Set an initial value for the resulting Signal before all async sources emit.
 * - Optional custom injector: Pass `{ injector }` to create signals outside of a component constructor.
 *
 * @template Input - The type of the input sources (array or object).
 * @template Output - The type of the output Signal (defaults to Input).
 *
 * @param sources - Array or object of Signal, Observable, Promise, or function values to combine.
 * @param operator - Optional RxJS operator function to transform the combined values.
 * @param options - Optional configuration object:
 *   - `initialValue`: Initial value for the Signal (recommended when combining async sources without sync emission).
 *   - `injector`: Angular Injector to use for signal conversion when called outside an injection context.
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
 *
 * // With Promise and custom Injector
 * const userWithConfig = combineFrom(
 *   { user: userSignal, config: fetchConfigPromise },
 *   { injector: customInjector, initialValue: { user: null, config: null } }
 * );
 * ```
 */
export function combineFrom<Input = any, Output = Input>(...args: any[]): Signal<Output | null | undefined> {
  const {normalizedSources, hasInitValue, operator, options} = normalizeArgs<Input, Output>(args);

  if (!options?.injector) {
    assertInInjectionContext(combineFrom);
  }

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

  const sources = args[0];
  const hasOperator = typeof args[1] === 'function';

  if (args.length === 3 && !hasOperator) {
    throw new TypeError('combineFrom needs a pipe operator as the second argument');
  }

  const operator = (hasOperator ? args[1] : identity) as OperatorFunction<Input, Output>;
  const options = (hasOperator ? args[2] : args[1]) as CombineFromOptions<Output> | undefined;

  const hasInitValue = options?.initialValue !== undefined;

  const normalizedSources = Object.entries(sources).reduce(
    (acc, [keyOrIndex, source]) => {
      if (isSignal(source)) {
        // fix angular NG0950: Input is required but no value is available yet.
        // when input.required is used as combineFrom's input, its value is undefined, untracked(source) will throw error
        let initialValue: unknown;
        let hasInitialVal = false;
        try {
          initialValue = untracked(source);
          hasInitialVal = true;
        } catch {
          hasInitialVal = false;
        }
        const obs$ = toObservable(source, {
          injector: options?.injector,
        });
        acc[keyOrIndex] = hasInitialVal
          ? obs$.pipe(startWith(initialValue), distinctUntilChanged())
          : obs$.pipe(distinctUntilChanged());
      } else if (isObservable(source)) {
        acc[keyOrIndex] = source.pipe(distinctUntilChanged());
      } else if (typeof source === 'function') {
        // seldom use: pass function like () => 5
        const fn = source as () => unknown;
        let initialVal: unknown;
        let hasInitialVal = false;
        try {
          initialVal = options?.injector ? runInInjectionContext(options.injector, fn) : fn();
          hasInitialVal = true;
        } catch {
          hasInitialVal = false;
        }
        const computedRes = options?.injector
          ? runInInjectionContext(options.injector, () => computed(fn))
          : computed(fn);
        const obs$ = toObservable(computedRes, {
          injector: options?.injector,
        });
        acc[keyOrIndex] = hasInitialVal
          ? obs$.pipe(startWith(initialVal), distinctUntilChanged())
          : obs$.pipe(distinctUntilChanged());
      } else if (isPromise(source)) {
        // Promises emit a single resolved value asynchronously (microtask) and complete.
        // distinctUntilChanged is omitted as redundant for single-emission sources.
        acc[keyOrIndex] = from(source);
      } else if (source != null) {
        // pass other ObservableInput (iterables, etc.)
        acc[keyOrIndex] = from(source as any).pipe(distinctUntilChanged());
      } else {
        throw new TypeError(
          `combineFrom: Invalid source at "${keyOrIndex}". Expected a Signal, Observable, Promise, or function, but received ${source}.`,
        );
      }
      return acc;
    },
    (Array.isArray(sources) ? [] : {}) as any,
  );

  return {normalizedSources, operator, hasInitValue, options};
}
