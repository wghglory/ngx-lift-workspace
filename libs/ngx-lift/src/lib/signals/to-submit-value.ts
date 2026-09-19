import {assertInInjectionContext, inject, Injector, Signal} from '@angular/core';
import {AbstractControl, FormArray, FormGroup} from '@angular/forms';
import {debounceTime, distinctUntilChanged, map} from 'rxjs';

import {FormRawValue, FormSubmitValueOptions, ToSubmitValueOptions} from '../models/to-signal-form.model';
import {isEqual} from '../utils/is-equal.util';
import {createControlEventStream, safeToSignal} from './form-signals';

/**
 * Type guard for Angular AbstractControl instances.
 */
function isAbstractControl(val: unknown): val is AbstractControl {
  return typeof val === 'object' && val !== null && 'value' in val && 'status' in val && 'valueChanges' in val;
}

/**
 * Type guard for plain javascript objects (excluding arrays, dates, File, Blob, custom classes).
 */
function isPlainObject(val: unknown): val is Record<string, unknown> {
  if (typeof val !== 'object' || val === null || Array.isArray(val)) {
    return false;
  }
  const proto = Object.getPrototypeOf(val);
  return proto === Object.prototype || proto === null;
}

/**
 * Recursively sanitizes elements of an array.
 */
function sanitizeArray(arr: unknown[], options?: ToSubmitValueOptions): unknown[] {
  const shouldOmitNull = options?.omitNull ?? false;
  return arr
    .filter((item) => {
      if (options?.omitEmptyStrings && item === '') {
        return false;
      }
      if (shouldOmitNull && (item === null || item === undefined)) {
        return false;
      }
      return true;
    })
    .map((item) => {
      if (isPlainObject(item)) {
        return sanitizeObject(item, options);
      }
      if (Array.isArray(item)) {
        return sanitizeArray(item, options);
      }
      return item;
    });
}

/**
 * Recursively or shallowly sanitizes an object based on the provided `ToSubmitValueOptions`.
 */
function sanitizeObject(obj: Record<string, unknown>, options?: ToSubmitValueOptions): Record<string, unknown> {
  const result: Record<string, unknown> = {};
  const omitList = options?.omit;
  const excludeSet = omitList ? new Set<string>(omitList.map(String)) : undefined;
  const shouldOmitNull = options?.omitNull ?? false;

  for (const [key, value] of Object.entries(obj)) {
    if (excludeSet?.has(key)) {
      continue;
    }
    if (options?.omitEmptyStrings && value === '') {
      continue;
    }
    if (shouldOmitNull && (value === null || value === undefined)) {
      continue;
    }
    if (options?.omitIf && options.omitIf(value, key, obj)) {
      continue;
    }

    if (options?.deep) {
      if (isPlainObject(value)) {
        result[key] = sanitizeObject(value as Record<string, unknown>, options);
      } else if (Array.isArray(value)) {
        result[key] = sanitizeArray(value, options);
      } else {
        result[key] = value;
      }
    } else {
      result[key] = value;
    }
  }

  return result;
}

/**
 * Extracts and sanitizes form data into a clean submission value.
 *
 * @example
 * ```typescript
 * const submitValue = toSubmitValue(this.form, {
 *   omit: ['confirmPassword', 'termsAccepted'],
 *   omitEmptyStrings: true,
 * });
 * ```
 *
 * @param source The `FormGroup`, `FormArray`, `AbstractControl`, or raw data object.
 * @param options Configuration options for omission, pruning, and transformation.
 * @returns The sanitized submission value ready for HTTP requests or mutation resources.
 */
export function toSubmitValue<
  TControls extends {[K in keyof TControls]: AbstractControl},
  TOutput = Partial<FormRawValue<TControls>>,
>(source: FormGroup<TControls>, options?: ToSubmitValueOptions<FormRawValue<TControls>, TOutput>): TOutput;
export function toSubmitValue<TItem = unknown, TOutput = TItem[]>(
  source: FormArray,
  options?: ToSubmitValueOptions<Record<string, unknown>, TOutput>,
): TOutput;
export function toSubmitValue<TInput extends object = Record<string, unknown>, TOutput = Partial<TInput>>(
  source: AbstractControl | TInput,
  options?: ToSubmitValueOptions<TInput, TOutput>,
): TOutput;
export function toSubmitValue<TInput extends object = Record<string, unknown>, TOutput = Partial<TInput>>(
  source: FormGroup | FormArray | AbstractControl | TInput,
  options?: ToSubmitValueOptions<TInput, TOutput>,
): TOutput {
  let rawData: unknown;

  if (isAbstractControl(source)) {
    const includeDisabled = options?.includeDisabled ?? true;
    if (includeDisabled && typeof (source as FormGroup).getRawValue === 'function') {
      rawData = (source as FormGroup).getRawValue();
    } else {
      rawData = source.value;
    }
  } else {
    rawData = source;
  }

  let sanitized: unknown;
  if (Array.isArray(rawData)) {
    sanitized = sanitizeArray(rawData, options as ToSubmitValueOptions);
  } else if (isPlainObject(rawData)) {
    sanitized = sanitizeObject(rawData, options as ToSubmitValueOptions);
  } else if (rawData !== undefined && rawData !== null) {
    if (options?.omitEmptyStrings && rawData === '') {
      sanitized = undefined;
    } else {
      sanitized = rawData;
    }
  } else if (rawData === null) {
    sanitized = options?.omitNull ? undefined : null;
  } else {
    sanitized = undefined;
  }

  if (options?.transform) {
    return options.transform(sanitized as Record<string, unknown>) as TOutput;
  }

  return sanitized as TOutput;
}

/**
 * Creates a reactive Angular `Signal<TOutput>` that continuously transforms a form's
 * state into a sanitized submission value.
 *
 * @example
 * ```typescript
 * readonly clusterData = formSubmitValue(this.form, {
 *   omit: ['confirmPassword'],
 * });
 * ```
 *
 * @param form The `FormGroup`, `FormArray`, or `AbstractControl` to observe.
 * @param options Options for omission, pruning, transformation, and debouncing.
 * @returns A reactive `Signal<TOutput>` emitting the latest sanitized submission value.
 */
export function formSubmitValue<
  TControls extends {[K in keyof TControls]: AbstractControl},
  TOutput = Partial<FormRawValue<TControls>>,
>(form: FormGroup<TControls>, options?: FormSubmitValueOptions<FormRawValue<TControls>, TOutput>): Signal<TOutput>;
export function formSubmitValue<TItem = unknown, TOutput = TItem[]>(
  form: FormArray,
  options?: FormSubmitValueOptions<Record<string, unknown>, TOutput>,
): Signal<TOutput>;
export function formSubmitValue<TInput extends object = Record<string, unknown>, TOutput = Partial<TInput>>(
  form: FormGroup | FormArray | AbstractControl,
  options?: FormSubmitValueOptions<TInput, TOutput>,
): Signal<TOutput>;
export function formSubmitValue<TInput extends object = Record<string, unknown>, TOutput = Partial<TInput>>(
  form: FormGroup | FormArray | AbstractControl,
  options?: FormSubmitValueOptions<TInput, TOutput>,
): Signal<TOutput> {
  let injector = options?.injector;
  if (!injector) {
    assertInInjectionContext(formSubmitValue);
    injector = inject(Injector);
  }

  const compute = (): TOutput => toSubmitValue<TInput, TOutput>(form, options);

  let stream$ = createControlEventStream(form).pipe(
    map(() => compute()),
    distinctUntilChanged((a, b) => isEqual(a, b)),
  );

  if (options?.debounceTime !== undefined && options.debounceTime > 0) {
    stream$ = createControlEventStream(form).pipe(
      debounceTime(options.debounceTime),
      map(() => compute()),
      distinctUntilChanged((a, b) => isEqual(a, b)),
    );
  }

  return safeToSignal(stream$, compute(), injector);
}
