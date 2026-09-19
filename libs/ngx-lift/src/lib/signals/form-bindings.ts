import {
  assertInInjectionContext,
  computed,
  DestroyRef,
  effect,
  EffectRef,
  inject,
  Injector,
  isSignal,
  runInInjectionContext,
  Signal,
  untracked,
} from '@angular/core';
import {AbstractControl, FormGroup, ValidatorFn} from '@angular/forms';
import {merge, Observable} from 'rxjs';

import {
  BindControlDisabledOptions,
  BindControlIfOptions,
  BindControlValidatorsOptions,
  RevalidateSubscription,
  WatchControlOptions,
} from '../models/to-signal-form.model';
import {controlValue} from './form-signals';

/**
 * Declaratively binds an Angular `AbstractControl`'s enabled/disabled state to a boolean `Signal` or predicate function.
 *
 * Runs inside an Angular reactive effect and automatically updates the control whenever the condition changes.
 * Defaults to `emitEvent: true` so reactive status signals and validation states update immediately.
 *
 * @example
 * ```typescript
 * bindControlDisabled(this.form.controls.storageGb, this.isAutoScalingEnabled, {
 *   resetOnDisable: true,
 *   resetValue: 250,
 * });
 * ```
 *
 * @param control The `AbstractControl` (or `FormControl`, `FormGroup`, `FormArray`) to manage.
 * @param condition A boolean `Signal` or getter function that evaluates whether the control should be disabled.
 * @param options Configuration for injector, resetOnDisable, and event emission.
 * @returns An Angular `EffectRef` that can be destroyed if manual teardown is needed.
 */
export function bindControlDisabled<T = unknown>(
  control: AbstractControl<T> | AbstractControl,
  condition: Signal<boolean> | (() => boolean),
  options?: BindControlDisabledOptions<T>,
): EffectRef {
  let injector = options?.injector;
  if (!injector) {
    assertInInjectionContext(bindControlDisabled);
    injector = inject(Injector);
  }

  const emitEvent = options?.emitEvent ?? true;
  const resetOnDisable = options?.resetOnDisable ?? false;

  return effect(
    () => {
      const shouldDisable = Boolean(condition());

      untracked(() => {
        if (shouldDisable) {
          if (control.enabled) {
            if (resetOnDisable) {
              if (options?.resetValue !== undefined) {
                control.reset(options.resetValue, {emitEvent: false});
              } else {
                control.reset(undefined, {emitEvent: false});
              }
            }
            control.disable({emitEvent});
          }
        } else {
          if (control.disabled) {
            control.enable({emitEvent});
          }
        }
      });
    },
    {injector},
  );
}

/**
 * Resolves a validator argument into `ValidatorFn | ValidatorFn[] | null`.
 * Supports a raw `ValidatorFn`, array of validators, `null`, `Signal`, or a 0-argument getter function.
 */
export function resolveValidators(
  validators:
    | ValidatorFn
    | ValidatorFn[]
    | null
    | Signal<ValidatorFn | ValidatorFn[] | null>
    | (() => ValidatorFn | ValidatorFn[] | null),
): ValidatorFn | ValidatorFn[] | null {
  if (isSignal(validators)) {
    return validators();
  }
  if (typeof validators === 'function') {
    return validators.length === 0
      ? (validators as () => ValidatorFn | ValidatorFn[] | null)()
      : (validators as ValidatorFn);
  }
  return validators;
}

/**
 * Declaratively synchronizes an `AbstractControl`'s validators with a reactive signal or getter.
 *
 * Replaces the control's synchronous validators and re-evaluates validity whenever the signal emits.
 *
 * @example
 * ```typescript
 * bindControlValidators(this.form.controls.password, () =>
 *   this.authMode() === 'sql' ? [Validators.required, Validators.minLength(8)] : null
 * );
 * ```
 *
 * @param control The `AbstractControl` whose validators should be managed.
 * @param validators A `Signal` or getter returning the active `ValidatorFn`, array of validators, or `null`.
 * @param options Configuration options.
 * @returns An `EffectRef` for lifecycle management.
 */
export function bindControlValidators(
  control: AbstractControl,
  validators:
    | ValidatorFn
    | ValidatorFn[]
    | null
    | Signal<ValidatorFn | ValidatorFn[] | null>
    | (() => ValidatorFn | ValidatorFn[] | null),
  options?: BindControlValidatorsOptions,
): EffectRef {
  let injector = options?.injector;
  if (!injector) {
    assertInInjectionContext(bindControlValidators);
    injector = inject(Injector);
  }

  const emitEvent = options?.emitEvent ?? true;
  const updateValueAndValidity = options?.updateValueAndValidity ?? true;

  return effect(
    () => {
      const valFns = resolveValidators(validators);
      untracked(() => {
        control.setValidators(valFns);
        if (updateValueAndValidity) {
          control.updateValueAndValidity({emitEvent});
        }
      });
    },
    {injector},
  );
}

/**
 * Conditionally mounts or unmounts a single control or dictionary of controls to an Angular `FormGroup`
 * based on a reactive boolean `Signal` or predicate.
 *
 * Automatically wraps factory invocation in `untracked()` to avoid unwanted reactive dependencies.
 * If `preserveValue` is `true`, preserves control values in memory while unmounted and restores them upon remounting.
 *
 * @example
 * ```typescript
 * bindControlIf(
 *   this.form,
 *   () => this.authMode() === 'sql',
 *   () => ({
 *     password: new FormControl('', [Validators.required]),
 *     confirmPassword: new FormControl('', [Validators.required]),
 *   }),
 *   {preserveValue: true}
 * );
 * ```
 *
 * @param parent The parent `FormGroup` to add/remove controls from.
 * @param conditionOrName Control name (single mode) or boolean Signal/predicate (dictionary mode).
 * @param conditionOrControlsFactory Condition (single mode) or factory returning control dictionary.
 * @param controlFactoryOrOptions Control factory (single mode) or options (dictionary mode).
 * @param options Options for single control mode.
 * @returns An Angular `EffectRef` that can be destroyed if manual teardown is needed.
 */
export function bindControlIf<K extends string, C extends AbstractControl>(
  parent: FormGroup,
  condition: Signal<boolean> | (() => boolean),
  controlsFactory: () => Record<K, C>,
  options?: BindControlIfOptions,
): EffectRef;
export function bindControlIf<C extends AbstractControl>(
  parent: FormGroup,
  controlName: string,
  condition: Signal<boolean> | (() => boolean),
  controlFactory: () => C,
  options?: BindControlIfOptions,
): EffectRef;
export function bindControlIf(
  parent: FormGroup,
  arg1: string | Signal<boolean> | (() => boolean),
  arg2: Signal<boolean> | (() => boolean) | (() => Record<string, AbstractControl>),
  arg3?: (() => AbstractControl) | BindControlIfOptions,
  arg4?: BindControlIfOptions,
): EffectRef {
  let isSingleMode = false;
  let controlName = '';
  let condition: Signal<boolean> | (() => boolean);
  let controlFactory: (() => AbstractControl) | undefined;
  let controlsFactory: (() => Record<string, AbstractControl>) | undefined;
  let options: BindControlIfOptions | undefined;

  if (typeof arg1 === 'string') {
    isSingleMode = true;
    controlName = arg1;
    condition = arg2 as Signal<boolean> | (() => boolean);
    controlFactory = arg3 as () => AbstractControl;
    options = arg4;
  } else {
    isSingleMode = false;
    condition = arg1;
    controlsFactory = arg2 as () => Record<string, AbstractControl>;
    options = arg3 as BindControlIfOptions | undefined;
  }

  let injector = options?.injector;
  if (!injector) {
    assertInInjectionContext(bindControlIf);
    injector = inject(Injector);
  }

  const preserveValue = options?.preserveValue ?? false;
  const preservedValues = new Map<string, unknown>();
  const mountedKeys = new Set<string>();
  const controlCache = new Map<string, AbstractControl>();

  return effect(
    () => {
      const shouldBePresent = Boolean(condition());

      untracked(() => {
        if (isSingleMode && controlName && controlFactory) {
          const isCurrentlyPresent = Boolean(parent.get(controlName));

          if (shouldBePresent && !isCurrentlyPresent) {
            let ctrl = controlCache.get(controlName);
            if (!ctrl) {
              const factory = controlFactory;
              ctrl = untracked(() => factory());
              if (preserveValue) {
                controlCache.set(controlName, ctrl);
              }
            }
            if (preserveValue && preservedValues.has(controlName)) {
              ctrl.setValue(preservedValues.get(controlName));
            }
            parent.addControl(controlName, ctrl);
            options?.onControlsChange?.();
          } else if (!shouldBePresent && isCurrentlyPresent) {
            if (preserveValue) {
              const currentCtrl = parent.get(controlName);
              const val =
                currentCtrl && typeof (currentCtrl as FormGroup).getRawValue === 'function'
                  ? (currentCtrl as FormGroup).getRawValue()
                  : currentCtrl?.value;
              preservedValues.set(controlName, val);
            } else {
              controlCache.delete(controlName);
            }
            parent.removeControl(controlName);
            options?.onControlsChange?.();
          }
        } else if (!isSingleMode && controlsFactory) {
          if (shouldBePresent) {
            const isAlreadyMounted =
              mountedKeys.size > 0 && Array.from(mountedKeys).every((k) => Boolean(parent.get(k)));
            if (isAlreadyMounted) {
              return;
            }

            let controls: Record<string, AbstractControl> = {};
            if (preserveValue && controlCache.size > 0) {
              for (const [k, c] of controlCache.entries()) {
                controls[k] = c;
              }
            } else {
              const factory = controlsFactory;
              controls = untracked(() => factory());
              if (preserveValue) {
                for (const [k, c] of Object.entries(controls)) {
                  controlCache.set(k, c);
                }
              }
            }

            let changed = false;
            for (const [key, ctrl] of Object.entries(controls)) {
              if (!parent.get(key)) {
                if (preserveValue && preservedValues.has(key)) {
                  ctrl.setValue(preservedValues.get(key));
                }
                parent.addControl(key, ctrl);
                mountedKeys.add(key);
                changed = true;
              }
            }
            if (changed) {
              options?.onControlsChange?.();
            }
          } else {
            let changed = false;
            for (const key of Array.from(mountedKeys)) {
              const currentCtrl = parent.get(key);
              if (currentCtrl) {
                if (preserveValue) {
                  const val =
                    typeof (currentCtrl as FormGroup).getRawValue === 'function'
                      ? (currentCtrl as FormGroup).getRawValue()
                      : currentCtrl.value;
                  preservedValues.set(key, val);
                } else {
                  controlCache.delete(key);
                }
                parent.removeControl(key);
                changed = true;
              }
              mountedKeys.delete(key);
            }
            if (changed) {
              options?.onControlsChange?.();
            }
          }
        }
      });
    },
    {injector},
  );
}

/**
 * Automatically re-triggers validation on a target control whenever a source control,
 * Signal, or Observable value or status changes.
 *
 * Returns a `RevalidateSubscription` for manual unregistration if needed.
 *
 * @example
 * ```typescript
 * revalidateOnChange(this.form.controls.confirmPassword, this.form.controls.password);
 * ```
 *
 * @param target The control to be re-validated.
 * @param source The trigger source (control, Signal, or getter).
 * @param options Configuration for injector.
 * @returns A `RevalidateSubscription` handle.
 */
export function revalidateOnChange(
  target: AbstractControl | AbstractControl[],
  source: AbstractControl | Signal<unknown> | (() => unknown),
  options?: {injector?: Injector},
): RevalidateSubscription {
  let injector = options?.injector;
  if (!injector) {
    assertInInjectionContext(revalidateOnChange);
    injector = inject(Injector);
  }

  const targets = Array.isArray(target) ? target : [target];
  const trigger = () => {
    for (const t of targets) {
      t.updateValueAndValidity({emitEvent: true});
    }
  };

  const destroyRef = injector.get(DestroyRef);
  let cleanup = () => {
    // Initial no-op until assigned
  };

  if (source instanceof AbstractControl) {
    let prevVal = source.value;
    let prevStatus = source.status;
    const sub = merge(source.valueChanges as Observable<unknown>, source.statusChanges).subscribe(() => {
      const currentVal = source.value;
      const currentStatus = source.status;
      if (currentVal !== prevVal || currentStatus !== prevStatus) {
        prevVal = currentVal;
        prevStatus = currentStatus;
        trigger();
      }
    });
    cleanup = () => sub.unsubscribe();
  } else if (isSignal(source) || typeof source === 'function') {
    const effectRef = effect(
      () => {
        source();
        untracked(() => {
          trigger();
        });
      },
      {injector},
    );
    cleanup = () => effectRef.destroy();
  }

  let isCleanedUp = false;
  const unreg = destroyRef.onDestroy(() => {
    if (!isCleanedUp) {
      isCleanedUp = true;
      cleanup();
    }
  });

  const safeCleanup = (): void => {
    if (isCleanedUp) return;
    isCleanedUp = true;
    cleanup();
    unreg();
  };

  return {
    unsubscribe: safeCleanup,
    destroy: safeCleanup,
  };
}

/**
 * Reactively watches a control's value signal or any getter/Signal and executes a callback
 * whenever the value changes. The callback is executed outside the tracking context (`untracked`)
 * so state mutations or control value updates can be made safely without `NG0600` signal write restrictions.
 *
 * @example
 * ```typescript
 * // Watch control directly
 * watchControl(this.form.controls.engine, (engine) => {
 *   this.syncVersionForEngine(engine);
 * });
 *
 * // Watch any Signal or getter
 * watchControl(() => this.engine(), (engine) => {
 *   this.syncVersionForEngine(engine);
 * });
 * ```
 *
 * @param source An `AbstractControl`, `Signal`, or getter function.
 * @param callback Function to execute with `(newValue, oldValue)`.
 * @param options Optional configuration including `Injector` and `immediate`.
 * @returns An Angular `EffectRef` that can be destroyed if manual teardown is needed.
 */
export function watchControl<T>(
  source: AbstractControl<T> | Signal<T> | (() => T),
  callback: (value: T, prevValue: T | undefined) => void,
  options?: WatchControlOptions<T>,
): EffectRef {
  let injector = options?.injector;
  if (!injector) {
    assertInInjectionContext(watchControl);
    injector = inject(Injector);
  }

  let sig: Signal<T>;
  if (source instanceof AbstractControl) {
    sig = controlValue(source, {injector});
  } else if (isSignal(source)) {
    sig = source;
  } else {
    sig = runInInjectionContext(injector, () => computed(source));
  }

  const immediate = options?.immediate ?? false;
  let prevValue: T | undefined = undefined;
  let isFirst = true;

  return effect(
    () => {
      const currentValue = sig();
      if (isFirst) {
        isFirst = false;
        if (immediate) {
          untracked(() => {
            callback(currentValue, undefined);
          });
        }
        prevValue = currentValue;
        return;
      }

      const isChanged = options?.equal ? !options.equal(prevValue as T, currentValue) : currentValue !== prevValue;

      if (isChanged) {
        const old = prevValue;
        prevValue = currentValue;
        untracked(() => {
          callback(currentValue, old);
        });
      }
    },
    {injector},
  );
}
