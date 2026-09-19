import {
  assertInInjectionContext,
  DestroyRef,
  effect,
  inject,
  Injector,
  isSignal,
  Signal,
  untracked,
} from '@angular/core';
import {AbstractControl, FormGroup, ValidatorFn} from '@angular/forms';
import {merge, Observable, Subscription} from 'rxjs';

import {
  BindControlDisabledOptions,
  BindControlIfOptions,
  BindControlValidatorsOptions,
  ControlStateSignals,
  FormRawValue,
  FormSubmitValueOptions,
  SignalEnhancedControl,
  SignalForm,
  SignalFormControls,
  SignalFormFields,
  ToSignalFormOptions,
  ToSubmitValueOptions,
} from '../models/to-signal-form.model';
import {bindControlDisabled, bindControlIf, bindControlValidators, revalidateOnChange} from './form-bindings';
import {controlState, controlStatus, controlValue, formState} from './form-signals';
import {formSubmitValue} from './to-submit-value';

/**
 * Creates a non-mutating Proxy over an `AbstractControl` that exposes `.state`, `.bindDisabled()`, `.bindValidators()`, and `.revalidateOn()`.
 */
function createControlProxy<C extends AbstractControl = AbstractControl>(
  ctrl: C,
  injector: Injector,
): SignalEnhancedControl<C> {
  let cachedState: ControlStateSignals<C extends AbstractControl<infer V> ? V : unknown> | undefined;

  return new Proxy(ctrl, {
    get(target, prop, receiver) {
      if (prop === 'state') {
        if (!cachedState) {
          cachedState = controlState(target, {injector}) as never;
        }
        return cachedState;
      }

      if (prop === 'bindDisabled') {
        return (condition: Signal<boolean> | (() => boolean), options?: BindControlDisabledOptions) => {
          bindControlDisabled(target, condition, {...options, injector});
        };
      }

      if (prop === 'bindValidators') {
        return (
          validators:
            | ValidatorFn
            | ValidatorFn[]
            | null
            | Signal<ValidatorFn | ValidatorFn[] | null>
            | (() => ValidatorFn | ValidatorFn[] | null),
          options?: BindControlValidatorsOptions,
        ) => {
          return bindControlValidators(target, validators, {...options, injector});
        };
      }

      if (prop === 'revalidateOn') {
        return (
          sourceControl: AbstractControl | Signal<unknown> | (() => unknown),
          options?: {injector?: Injector},
        ) => {
          return revalidateOnChange(target, sourceControl, {...options, injector});
        };
      }

      const original = Reflect.get(target, prop, receiver);
      if (typeof original === 'function') {
        return original.bind(target);
      }
      return original;
    },
  }) as SignalEnhancedControl<C>;
}

/**
 * Wraps an Angular `FormGroup` into a unified, reactive signal-based facade (`SignalForm`).
 *
 * Provides strongly-typed signal properties for all form fields, form-level state signals,
 * declarative lifecycle bindings (`bindIf`, `bindDisabled`, `bindValidators`, `revalidate`),
 * and a continuous, sanitized `submitValue` signal ready for backend consumption.
 *
 * @example
 * ```typescript
 * readonly form = new FormGroup({
 *   clusterName: new FormControl('', [Validators.required]),
 *   confirmPassword: new FormControl(''),
 * });
 *
 * readonly sf = toSignalForm(this.form, {
 *   omit: ['confirmPassword'],
 * });
 *
 * // Access signals:
 * sf.valid(); // Signal<boolean>
 * sf.fields.clusterName.value(); // Signal<string>
 * sf.submitValue(); // Signal<Partial<FormValue>>
 * ```
 *
 * @param form The Angular `FormGroup` to wrap.
 * @param options Configuration options for submission value preparation, debouncing, and dependency injection.
 * @returns A strongly typed `SignalForm` facade.
 */
export function toSignalForm<
  TControls extends {[K in keyof TControls]: AbstractControl} = Record<string, AbstractControl>,
  TValue extends object = FormRawValue<TControls>,
  TSubmitValue = Partial<TValue>,
>(
  form: FormGroup<TControls>,
  options?: ToSignalFormOptions<TValue, TSubmitValue>,
): SignalForm<TControls, TValue, TSubmitValue> {
  const injector = options?.injector ?? (assertInInjectionContext(toSignalForm), inject(Injector));

  // Form-level state signals
  const state = formState<TValue>(form as unknown as AbstractControl<TValue>, {
    injector,
    debounceTime: options?.debounceTime,
  });

  // Submission Value signal
  const resolvedSubmitOptions: ToSubmitValueOptions<TValue, TSubmitValue> = {
    includeDisabled: options?.includeDisabled ?? options?.submitValue?.includeDisabled,
    omit: options?.omit ?? options?.submitValue?.omit,
    omitEmptyStrings: options?.omitEmptyStrings ?? options?.submitValue?.omitEmptyStrings,
    omitNil: options?.omitNil ?? options?.submitValue?.omitNil,
    omitIf: options?.omitIf ?? options?.submitValue?.omitIf,
    deep: options?.deep ?? options?.submitValue?.deep,
    transform: options?.transform ?? options?.submitValue?.transform,
  };

  const submitValueSig = formSubmitValue<TValue, TSubmitValue>(form, {
    ...resolvedSubmitOptions,
    injector,
    debounceTime: options?.debounceTime,
  } as FormSubmitValueOptions<TValue, TSubmitValue>);

  const enhancedControlCache = new WeakMap<AbstractControl, unknown>();

  const getOrCreateControlProxy = <C extends AbstractControl>(ctrl: C): SignalEnhancedControl<C> => {
    let proxy = enhancedControlCache.get(ctrl) as SignalEnhancedControl<C> | undefined;
    if (!proxy) {
      proxy = createControlProxy(ctrl, injector);
      enhancedControlCache.set(ctrl, proxy);
    }
    return proxy;
  };

  // Pre-create proxies for all initial controls in non-reactive context
  for (const ctrl of Object.values(form.controls)) {
    getOrCreateControlProxy(ctrl);
  }

  // Enhanced Controls Proxy
  const controlsProxy = new Proxy(form.controls as unknown as Record<string, AbstractControl>, {
    get(target, prop: string | symbol) {
      if (typeof prop !== 'string') {
        return Reflect.get(target, prop);
      }
      const ctrl = form.get(prop);
      if (!ctrl) {
        return undefined;
      }
      return getOrCreateControlProxy(ctrl);
    },
    has(target, prop: string | symbol) {
      return typeof prop === 'string' && form.contains(prop);
    },
    ownKeys() {
      return Object.keys(form.controls);
    },
    getOwnPropertyDescriptor(target, prop: string | symbol) {
      if (typeof prop === 'string') {
        const ctrl = form.get(prop);
        if (ctrl) {
          return {
            enumerable: true,
            configurable: true,
            value: getOrCreateControlProxy(ctrl),
          };
        }
      }
      return undefined;
    },
  }) as unknown as SignalFormControls<TControls>;

  // Enhanced Fields Proxy (sf.fields.clusterName.valid(), sf.fields.engine.value())
  const fieldsProxy = new Proxy({} as SignalFormFields<TControls>, {
    get(target, prop: string | symbol) {
      if (typeof prop !== 'string') {
        return Reflect.get(target, prop);
      }
      const ctrl = form.get(prop);
      if (!ctrl) {
        return undefined;
      }
      return getOrCreateControlProxy(ctrl).state;
    },
    has(target, prop: string | symbol) {
      return typeof prop === 'string' && form.contains(prop);
    },
    ownKeys() {
      return Object.keys(form.controls);
    },
    getOwnPropertyDescriptor(target, prop: string | symbol) {
      if (typeof prop === 'string') {
        const ctrl = form.get(prop);
        if (ctrl) {
          return {
            enumerable: true,
            configurable: true,
            value: getOrCreateControlProxy(ctrl).state,
          };
        }
      }
      return undefined;
    },
  });

  const bindIfImpl = (
    arg1: string | Signal<boolean> | (() => boolean),
    arg2: Signal<boolean> | (() => boolean) | (() => Record<string, AbstractControl>),
    arg3?: (() => AbstractControl) | BindControlIfOptions,
    arg4?: BindControlIfOptions,
  ): void => {
    if (typeof arg1 === 'string') {
      const ctrlName = arg1;
      const cond = arg2 as Signal<boolean> | (() => boolean);
      const factory = arg3 as () => AbstractControl;
      const opts = arg4;
      bindControlIf(form, ctrlName, cond, factory, {...opts, injector});
    } else {
      const cond = arg1;
      const factory = arg2 as () => Record<string, AbstractControl>;
      const opts = arg3 as BindControlIfOptions | undefined;
      bindControlIf(form, cond, factory, {...opts, injector});
    }
  };

  const facade: SignalForm<TControls, TValue, TSubmitValue> = {
    form,
    controls: controlsProxy,
    fields: fieldsProxy,

    // Form signals
    value: state.value,
    rawValue: state.rawValue,
    status: state.status,
    valid: state.valid,
    invalid: state.invalid,
    dirty: state.dirty,
    pristine: state.pristine,
    touched: state.touched,
    untouched: state.untouched,
    disabled: state.disabled,
    enabled: state.enabled,
    pending: state.pending,
    errors: state.errors,
    submitValue: submitValueSig,

    // Control Inspection & Signal Helpers
    control(name: string) {
      return form.get(name) as never;
    },

    hasControl(name: string) {
      return form.contains(name);
    },

    field(name: string) {
      const ctrl = form.get(name);
      if (!ctrl) {
        throw new Error(`[toSignalForm] Control "${name}" not found in FormGroup.`);
      }
      return getOrCreateControlProxy(ctrl).state as never;
    },

    controlValue(name: string, opts?: {debounceTime?: number}) {
      const ctrl = form.get(name);
      if (!ctrl) {
        throw new Error(`[toSignalForm] Control "${name}" not found in FormGroup.`);
      }
      return controlValue(ctrl, {...opts, injector}) as never;
    },

    controlStatus(name: string) {
      const ctrl = form.get(name);
      if (!ctrl) {
        throw new Error(`[toSignalForm] Control "${name}" not found in FormGroup.`);
      }
      return controlStatus(ctrl, {injector});
    },

    controlState(name: string, opts?: {debounceTime?: number}) {
      const ctrl = form.get(name);
      if (!ctrl) {
        throw new Error(`[toSignalForm] Control "${name}" not found in FormGroup.`);
      }
      return controlState(ctrl, {...opts, injector}) as never;
    },

    // Declarative Behavior Bindings
    bindDisabled(
      control: keyof TControls | string | AbstractControl,
      condition: Signal<boolean> | (() => boolean),
      opts?: BindControlDisabledOptions<unknown>,
    ) {
      const ctrl = control instanceof AbstractControl ? control : form.get(String(control));
      if (!ctrl) {
        throw new Error(`[toSignalForm] Control "${String(control)}" not found for bindDisabled.`);
      }
      bindControlDisabled(ctrl, condition, {...opts, injector});
    },

    bindValidators(
      control: keyof TControls | string | AbstractControl,
      validators:
        | ValidatorFn
        | ValidatorFn[]
        | null
        | Signal<ValidatorFn | ValidatorFn[] | null>
        | (() => ValidatorFn | ValidatorFn[] | null),
      opts?: BindControlValidatorsOptions,
    ) {
      const ctrl = control instanceof AbstractControl ? control : form.get(String(control));
      if (!ctrl) {
        throw new Error(`[toSignalForm] Control "${String(control)}" not found for bindValidators.`);
      }
      return bindControlValidators(ctrl, validators, {...opts, injector});
    },

    bindIf: bindIfImpl as SignalForm<TControls, TValue, TSubmitValue>['bindIf'],

    revalidate(
      targetControl: keyof TControls | string | AbstractControl,
      source: keyof TControls | string | AbstractControl | Signal<unknown> | (() => unknown),
    ) {
      const getTarget = (): AbstractControl | null => {
        if (targetControl instanceof AbstractControl) {
          return targetControl;
        }
        return form.get(String(targetControl));
      };

      if (typeof source === 'string') {
        const destroyRef = injector.get(DestroyRef);
        let prevVal: unknown = undefined;
        let prevStatus = '';

        const sub: Subscription = merge(form.valueChanges as Observable<unknown>, form.statusChanges).subscribe(() => {
          const srcCtrl = form.get(source);
          const currentVal = srcCtrl ? srcCtrl.value : form.value;
          const currentStatus = srcCtrl ? srcCtrl.status : form.status;
          if (currentVal !== prevVal || currentStatus !== prevStatus) {
            prevVal = currentVal;
            prevStatus = currentStatus;
            const target = getTarget();
            if (target) {
              target.updateValueAndValidity({emitEvent: true});
            }
          }
        });

        let isCleanedUp = false;
        const unreg = destroyRef.onDestroy(() => {
          if (!isCleanedUp) {
            isCleanedUp = true;
            sub.unsubscribe();
          }
        });

        const safeCleanup = (): void => {
          if (isCleanedUp) return;
          isCleanedUp = true;
          sub.unsubscribe();
          unreg();
        };

        return {
          unsubscribe: safeCleanup,
          destroy: safeCleanup,
        };
      }

      const initialTarget = getTarget();
      if (initialTarget) {
        return revalidateOnChange(initialTarget, source as AbstractControl | Signal<unknown>, {injector});
      }

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
            const target = getTarget();
            if (target) {
              target.updateValueAndValidity({emitEvent: true});
            }
          }
        });
        cleanup = () => sub.unsubscribe();
      } else if (isSignal(source) || typeof source === 'function') {
        const effectRef = effect(
          () => {
            source();
            untracked(() => {
              const target = getTarget();
              if (target) {
                target.updateValueAndValidity({emitEvent: true});
              }
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
    },

    // Imperative Form Actions
    reset(value, opts) {
      form.reset(value as never, opts);
    },

    markAllAsTouched() {
      form.markAllAsTouched();
    },

    markAsPristine(opts) {
      form.markAsPristine(opts);
    },

    markAsUntouched(opts) {
      form.markAsUntouched(opts);
    },
  };

  return facade;
}
