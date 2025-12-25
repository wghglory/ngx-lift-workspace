import {assertInInjectionContext, inject, type Signal} from '@angular/core';
import {toSignal} from '@angular/core/rxjs-interop';
import {ActivatedRoute, type Params} from '@angular/router';
import {map} from 'rxjs';

type QueryParamsTransformFn<Output> = (params: Params) => Output;

/**
 * The `InputOptions` interface defines options for configuring the behavior of the `injectQueryParams` function.
 *
 * @template Output - The expected type of the read value.
 */
export interface QueryParamsOptions<Output> {
  /**
   * A transformation function to convert the written value to the expected read value.
   *
   * @param v - The value to transform.
   * @returns The transformed value.
   */
  transform?: (v: string) => Output;

  /**
   * The initial value to use if the query parameter is not present or undefined.
   */
  initialValue?: Output;
}

/**
 * The `injectQueryParams` function allows you to access and manipulate query parameters from the current route.
 *
 * @returns A `Signal` that emits the entire query parameters object.
 */
export function injectQueryParams(): Signal<Params>;

/**
 * The `injectQueryParams` function allows you to access and manipulate query parameters from the current route.
 * It retrieves the value of a query parameter based on a custom transform function applied to the query parameters object.
 *
 * @template Output - The expected type of the read value.
 * @param {QueryParamsTransformFn<Output>} fn - A transform function that takes the query parameters object (`params: Params`) and returns the desired value.
 * @returns {Signal} A `Signal` that emits the transformed value based on the provided custom transform function.
 *
 * @example
 * const searchValue = injectQueryParams((params) => params['search'] as string);
 */
export function injectQueryParams<Output>(fn: QueryParamsTransformFn<Output>): Signal<Output>;

/**
 * The `injectQueryParams` function allows you to access and manipulate query parameters from the current route.
 *
 * @param {string} key - The name of the query parameter to retrieve.
 * @returns {Signal} A `Signal` that emits the value of the specified query parameter, or `null` if it's not present.
 */
export function injectQueryParams(key: string): Signal<string | null>;

// for boolean or number, if initialValue is provided, transform is a must
export function injectQueryParams(
  key: string,
  options: {transform: (v: string) => boolean; initialValue: boolean},
): Signal<boolean>;
export function injectQueryParams(
  key: string,
  options: {transform: (v: string) => number; initialValue: number},
): Signal<number>;
// for string, transform is optional
export function injectQueryParams(
  key: string,
  options: {transform?: (v: string) => string; initialValue: string},
): Signal<string>;

// initialValue not provided, must provide transform fn
export function injectQueryParams(
  key: string,
  options: {transform: (v: string) => boolean; initialValue?: undefined},
): Signal<boolean | null>;
export function injectQueryParams(
  key: string,
  options: {transform: (v: string) => number; initialValue?: undefined},
): Signal<number | null>;
export function injectQueryParams(
  key: string,
  options: {transform: (v: string) => string; initialValue?: undefined},
): Signal<string | null>;

/**
 * The `injectQueryParams` function allows you to access and manipulate query parameters from the current route.
 *
 * @template Output - The expected type of the read value.
 * @param {string} keyOrParamsTransform - The name of the query parameter to retrieve, or a transform function to apply to the query parameters object.
 * @param {QueryParamsOptions} options - Optional configuration options for the query parameter.
 * @returns {QueryParamsOptions} A `Signal` that emits the transformed value of the specified query parameter, or the entire query parameters object if no key is provided.
 *
 * @example
 * const search = injectQueryParams('search'); // returns the value of the 'search' query param
 * const search = injectQueryParams(p => p['search'] as string); // same as above but can be used with a custom transform function
 * const idParam = injectQueryParams('id', {transform: numberAttribute}); // returns the value fo the 'id' query params and transforms it into a number
 * const idParam = injectQueryParams(p => numberAttribute(p['id'])); // same as above but can be used with a custom transform function
 * const queryParams = injectQueryParams(); // returns the entire query params object
 */
export function injectQueryParams<Output>(
  keyOrParamsTransform?: string | QueryParamsTransformFn<Output>,
  options: QueryParamsOptions<Output> = {},
): Signal<Output | Params | string | boolean | number | null> {
  assertInInjectionContext(injectQueryParams);

  const route = inject(ActivatedRoute);
  const initialQueryParams = route.snapshot.queryParams;

  const {transform, initialValue} = options;

  // injectQueryParams(): Signal<Params>
  if (!keyOrParamsTransform) {
    return toSignal(route.queryParams, {initialValue: initialQueryParams});
  }

  // injectQueryParams<Output>(fn: QueryParamsTransformFn<Output>): Signal<Output>
  if (typeof keyOrParamsTransform === 'function') {
    return toSignal(route.queryParams.pipe(map(keyOrParamsTransform)), {
      initialValue: keyOrParamsTransform(initialQueryParams),
    });
  }

  // keyOrParamsTransform is string.
  const getParam = (params: Params) => {
    const param = params?.[keyOrParamsTransform] as string | string[] | undefined;

    if (!param) {
      return initialValue ?? null;
    }

    if (Array.isArray(param)) {
      if (param.length < 1) {
        return initialValue ?? null;
      }
      return transform ? transform(param[0]) : param[0];
    }

    return transform ? transform(param) : param;
  };

  return toSignal(route.queryParams.pipe(map(getParam)), {
    initialValue: getParam(initialQueryParams),
  });
}
