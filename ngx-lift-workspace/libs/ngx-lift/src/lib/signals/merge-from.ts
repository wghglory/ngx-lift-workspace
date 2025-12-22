import {assertInInjectionContext, Injector, isSignal, Signal, untracked} from '@angular/core';
import {toObservable, toSignal} from '@angular/core/rxjs-interop';
import {
  distinctUntilChanged,
  from,
  identity,
  isObservable,
  merge,
  ObservableInput,
  OperatorFunction,
  startWith,
} from 'rxjs';

type ObservableSignalInput<T> = ObservableInput<T> | Signal<T>;

type ObservableSignalInputTuple<T> = {
  [K in keyof T]: ObservableSignalInput<T[K]>;
};

// pick from ToSignalOptions
export type MergeFromOptions<T> = {
  readonly injector?: Injector;
  readonly initialValue?: T | null;
};

export function mergeFrom<Input extends readonly unknown[], Output = Input[number]>(
  sources: readonly [...ObservableSignalInputTuple<Input>],
  operator?: OperatorFunction<Input[number], Output>,
  options?: MergeFromOptions<Output>,
): Signal<Output>;

export function mergeFrom<Input extends readonly unknown[], Output = Input[number]>(
  sources: readonly [...ObservableSignalInputTuple<Input>],
  options?: MergeFromOptions<Output>,
): Signal<Output>;

// No object inputs

/**
 * merge multiple `Observable` or `Signal` sources into a `Signal` that emits the last value. It's like merge.
 *
 * @param {ObservableSignalInputTuple} sources - Array of `Observable` or `Signal` values
 * @param {OperatorFunction} [operator] - Operator to apply to the merge
 * @param {MergeFromOptions} [options] - Options including `initialValue` and `injector`
 * @returns Signal emitting the latest merge result
 *
 * @example
 * ```ts
 * export class Component {
 *   e$ = of(1).pipe(delay(1000));
 *   f = signal(2);
 *
 *   data = mergeFrom(
 *     [this.e$, this.f],
 *     pipe(
 *       switchMap((res) => of(`${res} is coming~`)),
 *       startWith(0),
 *     ),
 *   );
 * }
 * ```
 */
export function mergeFrom<Input extends readonly unknown[], Output = Input[number]>(...args: unknown[]) {
  assertInInjectionContext(mergeFrom);

  const [sources, operator = identity, options = {}] = parseArgs<Input, Output>(args);

  const normalizedSources = sources.map((source) => {
    if (isSignal(source)) {
      return toObservable(source, {injector: options.injector}).pipe(startWith(untracked(source)));
    }

    if (!isObservable(source)) {
      source = from(source);
    }

    return source.pipe(distinctUntilChanged());
  });

  const merged$ = merge(...normalizedSources).pipe(operator as OperatorFunction<Input[number], Output>);

  if (options.initialValue !== undefined) {
    return toSignal(merged$, {initialValue: options.initialValue as Output, injector: options.injector});
  }
  return toSignal(merged$, {requireSync: true, injector: options.injector});
}

function parseArgs<Input extends readonly unknown[], Output = Input[number]>(args: unknown[]) {
  if (!args || args.length < 1) {
    throw new TypeError('mergeFrom needs sources');
  }

  if (args.length === 1) {
    return [args[0] as readonly [...ObservableSignalInputTuple<Input>], undefined, undefined] as const;
  }

  if (args.length === 2) {
    const hasOperator = typeof args[1] === 'function';

    if (hasOperator) {
      return [
        args[0] as readonly [...ObservableSignalInputTuple<Input>],
        args[1] as OperatorFunction<Input[number], Output>,
        undefined,
      ] as const;
    }

    return [
      args[0] as readonly [...ObservableSignalInputTuple<Input>],
      undefined,
      args[1] as MergeFromOptions<Output>,
    ] as const;
  }

  return args as unknown as [
    readonly [...ObservableSignalInputTuple<Input>],
    OperatorFunction<Input[number], Output>,
    MergeFromOptions<Output>,
  ];
}
