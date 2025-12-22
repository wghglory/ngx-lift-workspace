import {assertInInjectionContext, inject, type Signal} from '@angular/core';
import {toSignal} from '@angular/core/rxjs-interop';
import {ActivatedRoute, type Params} from '@angular/router';
import {map} from 'rxjs';

type ParamsTransformFn<Output> = (params: Params) => Output;

/**
 * The `InputOptions` interface defines options for configuring the behavior of the `injectParams` function.
 *
 * @template Output - The expected type of the read value.
 */
export interface ParamsOptions<Output> {
  /**
   * A transformation function to convert the written value to the expected read value.
   *
   * @param v - The value to transform.
   * @returns The transformed value.
   */
  transform?: (v: string) => Output;

  /**
   * The initial value to use if the parameter is not present or undefined.
   */
  initialValue?: Output;
}

/**
 * Injects the params from the current route.
 * If a key is provided, returns the value of that key.
 * If a transform function is provided, returns the result of the function.
 * Otherwise, returns the entire params object.
 *
 * @example
 * const params = injectParams(); // Returns the entire params object
 * const userId = injectParams('id'); // Returns the value of the 'id' param
 * const userId = injectParams(p => p['id'] as string); // Returns the 'id' param using a custom transform function
 * const userId = injectParams('id', { transform: numberAttribute, initialValue: 1 });
 *
 * @param keyOrParamsTransform OPTIONAL The key of the param to return, or a transform function to apply to the params object
 */
export function injectParams(): Signal<Params>;

export function injectParams<Output>(fn: ParamsTransformFn<Output>): Signal<Output>;

export function injectParams(key: string): Signal<string | null>;

// for boolean or number, if initialValue is provided, transform is a must
export function injectParams(
  key: string,
  options: {transform: (v: string) => boolean; initialValue: boolean},
): Signal<boolean>;
export function injectParams(
  key: string,
  options: {transform: (v: string) => number; initialValue: number},
): Signal<number>;
// for string, transform is optional
export function injectParams(
  key: string,
  options: {transform?: (v: string) => string; initialValue: string},
): Signal<string>;

// initialValue not provided, must provide transform fn
export function injectParams(
  key: string,
  options: {transform: (v: string) => boolean; initialValue?: undefined},
): Signal<boolean | null>;
export function injectParams(
  key: string,
  options: {transform: (v: string) => number; initialValue?: undefined},
): Signal<number | null>;
export function injectParams(
  key: string,
  options: {transform: (v: string) => string; initialValue?: undefined},
): Signal<string | null>;

export function injectParams<Output>(
  keyOrParamsTransform?: string | ParamsTransformFn<Output>,
  options: ParamsOptions<Output> = {},
): Signal<Output | Params | string | boolean | number | null> {
  assertInInjectionContext(injectParams);

  const route = inject(ActivatedRoute);
  const initialParams = route.snapshot.params;

  const {transform, initialValue} = options;

  // injectParams(): Signal<Params>
  if (!keyOrParamsTransform) {
    return toSignal(route.params, {initialValue: initialParams});
  }

  // injectParams<Output>(fn: ParamsTransformFn<Output>): Signal<Output>
  if (typeof keyOrParamsTransform === 'function') {
    return toSignal(route.params.pipe(map(keyOrParamsTransform)), {initialValue: keyOrParamsTransform(initialParams)});
  }

  // keyOrParamsTransform is string.
  // export function injectParams(key: string): Signal<string | null>;
  // export function injectParams(key: string, options: { transform: (v: string) => boolean; initialValue: boolean }): Signal<boolean>;
  // export function injectParams(key: string, options: { transform: (v: string) => number; initialValue: number }): Signal<number>;
  // export function injectParams(key: string, options: { transform?: (v: string) => string; initialValue: string }): Signal<string>;
  // export function injectParams(key: string, options: { transform: (v: string) => boolean; initialValue?: undefined }): Signal<boolean | null>;
  // export function injectParams(key: string, options: { transform: (v: string) => number; initialValue?: undefined }): Signal<number | null>;
  // export function injectParams(key: string, options: { transform: (v: string) => string; initialValue?: undefined }): Signal<string | null>;
  const getParam = (params: Params) => {
    const param = params?.[keyOrParamsTransform] as string | undefined;

    if (!param) {
      return initialValue ?? null;
    }

    return transform ? transform(param) : param;
  };

  return toSignal(route.params.pipe(map(getParam)), {initialValue: getParam(initialParams)});
}
