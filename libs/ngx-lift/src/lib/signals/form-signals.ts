import {
  assertInInjectionContext,
  computed,
  DestroyRef,
  inject,
  Injector,
  Signal,
  signal,
  untracked,
} from '@angular/core';
import {AbstractControl, FormControlStatus, FormGroup} from '@angular/forms';
import {debounceTime, distinctUntilChanged, map, merge, Observable, startWith} from 'rxjs';

import {
  ControlStateOptions,
  ControlStateSignals,
  ControlStatusOptions,
  ControlValueOptions,
  FormStateOptions,
  FormStateSignals,
} from '../models/to-signal-form.model';
import {isEqual} from '../utils/is-equal.util';

/**
 * Creates an Observable stream that emits on both value changes and status changes of a control.
 */
export function createControlEventStream(control: AbstractControl): Observable<unknown> {
  if ('events' in control && control.events) {
    return control.events.pipe(startWith(null));
  }
  return merge(control.valueChanges as Observable<unknown>, control.statusChanges).pipe(startWith(null));
}

/**
 * Safe conversion from an Observable to a Signal that can be invoked from within
 * reactive contexts without triggering Angular NG0602 errors.
 */
export function safeToSignal<T>(source$: Observable<T>, initialValue: T, injector: Injector): Signal<T> {
  const state = signal<T>(initialValue);
  const destroyRef = injector.get(DestroyRef);

  let isFirst = true;
  const sub = source$.subscribe((val) => {
    if (isFirst) {
      isFirst = false;
      if (val === initialValue || isEqual(val, initialValue)) {
        return;
      }
    }
    untracked(() => {
      state.set(val);
    });
  });

  destroyRef.onDestroy(() => {
    sub.unsubscribe();
  });

  return state.asReadonly();
}

/**
 * Returns a reactive `Signal<T>` representing an `AbstractControl`'s current value.
 *
 * @example
 * ```typescript
 * readonly engine = controlValue(this.form.controls.engine);
 * readonly search = controlValue(this.form.controls.query, {debounceTime: 300});
 * ```
 *
 * @param control The `AbstractControl` (or `FormControl`) to observe.
 * @param options Options for injector and debouncing.
 * @returns A reactive `Signal<T>` of the control's value.
 */
export function controlValue<T = unknown>(
  control: AbstractControl<T> | AbstractControl,
  options?: ControlValueOptions,
): Signal<T> {
  let injector = options?.injector;
  if (!injector) {
    assertInInjectionContext(controlValue);
    injector = inject(Injector);
  }

  let stream$: Observable<T> = control.valueChanges as Observable<T>;

  if (options?.debounceTime !== undefined && options.debounceTime > 0) {
    stream$ = stream$.pipe(debounceTime(options.debounceTime));
  }

  return safeToSignal(stream$, control.value as T, injector);
}

/**
 * Returns a reactive `Signal<FormControlStatus>` representing an `AbstractControl`'s validation status.
 *
 * @example
 * ```typescript
 * readonly nameStatus = controlStatus(this.form.controls.name);
 * ```
 *
 * @param control The `AbstractControl` to observe.
 * @param options Options for injector.
 * @returns A reactive `Signal<FormControlStatus>` emitting `'VALID' | 'INVALID' | 'PENDING' | 'DISABLED'`.
 */
export function controlStatus(control: AbstractControl, options?: ControlStatusOptions): Signal<FormControlStatus> {
  let injector = options?.injector;
  if (!injector) {
    assertInInjectionContext(controlStatus);
    injector = inject(Injector);
  }

  const stream$ = control.statusChanges.pipe(distinctUntilChanged());
  return safeToSignal(stream$, control.status, injector);
}

/**
 * Returns a complete bundle of reactive Signals representing an `AbstractControl`'s full state.
 *
 * @example
 * ```typescript
 * readonly passwordState = controlState(this.form.controls.password);
 * ```
 *
 * @param control The `AbstractControl` to observe.
 * @param options Options for injector and debouncing.
 * @returns A `ControlStateSignals` bundle with `.value()`, `.valid()`, `.invalid()`, `.touched()`, etc.
 */
export function controlState<T = unknown>(
  control: AbstractControl<T> | AbstractControl,
  options?: ControlStateOptions,
): ControlStateSignals<T> {
  let injector = options?.injector;
  if (!injector) {
    assertInInjectionContext(controlState);
    injector = inject(Injector);
  }

  const valSignal = controlValue<T>(control, options);
  const statusSignal = controlStatus(control, {injector});

  const eventStream$ = createControlEventStream(control);
  const eventTick = safeToSignal(eventStream$, null, injector);

  const valid = computed(() => statusSignal() === 'VALID');
  const invalid = computed(() => statusSignal() === 'INVALID');
  const pending = computed(() => statusSignal() === 'PENDING');
  const disabled = computed(() => statusSignal() === 'DISABLED');
  const enabled = computed(() => statusSignal() !== 'DISABLED');

  const dirty = computed(() => {
    eventTick();
    return control.dirty;
  });

  const pristine = computed(() => {
    eventTick();
    return control.pristine;
  });

  const touched = computed(() => {
    eventTick();
    return control.touched;
  });

  const untouched = computed(() => {
    eventTick();
    return control.untouched;
  });

  const errors = computed(() => {
    eventTick();
    return control.errors;
  });

  return {
    value: valSignal,
    status: statusSignal,
    valid,
    invalid,
    dirty,
    pristine,
    touched,
    untouched,
    disabled,
    enabled,
    pending,
    errors,
  };
}

/**
 * Returns a complete bundle of reactive Signals representing a `FormGroup`'s full state,
 * including `.rawValue()` which preserves values from disabled controls.
 *
 * @example
 * ```typescript
 * readonly formSignals = formState(this.form);
 * ```
 *
 * @param form The `FormGroup` to observe.
 * @param options Options for injector and debouncing.
 * @returns A `FormStateSignals` bundle with `.value()`, `.rawValue()`, `.valid()`, `.invalid()`, etc.
 */
export function formState<T = Record<string, unknown>>(
  form: FormGroup | AbstractControl<T>,
  options?: FormStateOptions,
): FormStateSignals<T> {
  let injector = options?.injector;
  if (!injector) {
    assertInInjectionContext(formState);
    injector = inject(Injector);
  }

  const baseState = controlState<T>(form, options);

  const computeRaw = (): T => {
    if (typeof (form as FormGroup).getRawValue === 'function') {
      return (form as FormGroup).getRawValue();
    }
    return form.value;
  };

  let rawStream$: Observable<T> = createControlEventStream(form).pipe(
    map(() => computeRaw()),
    distinctUntilChanged((a, b) => isEqual(a, b)),
  );

  if (options?.debounceTime !== undefined && options.debounceTime > 0) {
    rawStream$ = createControlEventStream(form).pipe(
      debounceTime(options.debounceTime),
      map(() => computeRaw()),
      distinctUntilChanged((a, b) => isEqual(a, b)),
    );
  }

  const rawValueSignal = safeToSignal(rawStream$, computeRaw(), injector);

  return {
    ...baseState,
    rawValue: rawValueSignal,
  };
}
