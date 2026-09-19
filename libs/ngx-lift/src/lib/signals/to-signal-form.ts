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
  signal,
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
  WatchControlOptions,
} from '../models/to-signal-form.model';
import {
  bindControlDisabled,
  bindControlIf,
  bindControlValidators,
  resolveValidators,
  revalidateOnChange,
  watchControl,
} from './form-bindings';
import {controlState, controlStatus, controlValue, formState} from './form-signals';
import {formSubmitValue} from './to-submit-value';

const ENHANCED_CONTROL_PROPS = new Set(['state', 'bindDisabled', 'bindValidators', 'revalidateOn', 'watch']);

/**
 * Creates a non-mutating Proxy over an `AbstractControl` that exposes `.state`, `.bindDisabled()`, `.bindValidators()`, and `.revalidateOn()`.
 */
function createControlProxy<C extends AbstractControl = AbstractControl>(
  ctrl: C,
  injector: Injector,
): SignalEnhancedControl<C> {
  let cachedState: ControlStateSignals<C extends AbstractControl<infer V> ? V : unknown> | undefined;

  const handlers: ProxyHandler<C> = {
    get(target, prop) {
      if (prop === 'state') {
        if (!cachedState) {
          cachedState = controlState(target, {injector}) as never;
        }
        return cachedState;
      }

      if (prop === 'bindDisabled') {
        return (condition: Signal<boolean> | (() => boolean), options?: BindControlDisabledOptions) => {
          return bindControlDisabled(target, condition, {...options, injector});
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

      if (prop === 'watch') {
        return (callback: (value: unknown, prevValue?: unknown) => void, options?: WatchControlOptions) => {
          return watchControl(target, callback, {...options, injector});
        };
      }

      const original = Reflect.get(target, prop, target);
      if (typeof original === 'function') {
        return original.bind(target);
      }
      return original;
    },
    has(target, prop) {
      if (typeof prop === 'string' && ENHANCED_CONTROL_PROPS.has(prop)) {
        return true;
      }
      return Reflect.has(target, prop);
    },
    ownKeys(target) {
      const keys = Reflect.ownKeys(target);
      for (const prop of ENHANCED_CONTROL_PROPS) {
        if (!keys.includes(prop)) {
          keys.push(prop);
        }
      }
      return keys;
    },
    getOwnPropertyDescriptor(target, prop) {
      if (typeof prop === 'string' && ENHANCED_CONTROL_PROPS.has(prop)) {
        return {
          enumerable: true,
          configurable: true,
          writable: false,
          value: (handlers.get as (t: C, p: string | symbol, r: unknown) => unknown)(target, prop, target),
        };
      }
      return Reflect.getOwnPropertyDescriptor(target, prop);
    },
  };

  return new Proxy(ctrl, handlers) as SignalEnhancedControl<C>;
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
  options?: ToSignalFormOptions<NoInfer<TValue>, TSubmitValue>,
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
    omitNull: options?.omitNull ?? options?.submitValue?.omitNull,
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
      controlsVersion();
      const ctrl = form.get(prop);
      if (!ctrl) {
        return undefined;
      }
      return getOrCreateControlProxy(ctrl);
    },
    has(target, prop: string | symbol) {
      controlsVersion();
      return typeof prop === 'string' && Boolean(form.get(prop));
    },
    ownKeys() {
      controlsVersion();
      return Object.keys(form.controls);
    },
    getOwnPropertyDescriptor(target, prop: string | symbol) {
      if (typeof prop === 'string') {
        controlsVersion();
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
      controlsVersion();
      const ctrl = form.get(prop);
      if (!ctrl) {
        return undefined;
      }
      return getOrCreateControlProxy(ctrl).state;
    },
    has(target, prop: string | symbol) {
      controlsVersion();
      return typeof prop === 'string' && Boolean(form.get(prop));
    },
    ownKeys() {
      controlsVersion();
      return Object.keys(form.controls);
    },
    getOwnPropertyDescriptor(target, prop: string | symbol) {
      if (typeof prop === 'string') {
        controlsVersion();
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

  const controlsVersion = signal(0);
  const notifyControlsChange = () => {
    controlsVersion.update((v) => v + 1);
  };

  const bindIfImpl = (
    arg1: string | Signal<boolean> | (() => boolean),
    arg2: Signal<boolean> | (() => boolean) | (() => Record<string, AbstractControl>),
    arg3?: (() => AbstractControl) | BindControlIfOptions,
    arg4?: BindControlIfOptions,
  ): EffectRef => {
    if (typeof arg1 === 'string') {
      const ctrlName = arg1;
      const cond = arg2 as Signal<boolean> | (() => boolean);
      const factory = arg3 as () => AbstractControl;
      const opts = arg4;
      return bindControlIf(form, ctrlName, cond, factory, {
        ...opts,
        injector,
        onControlsChange: () => {
          opts?.onControlsChange?.();
          notifyControlsChange();
        },
      });
    } else {
      const cond = arg1;
      const factory = arg2 as () => Record<string, AbstractControl>;
      const opts = arg3 as BindControlIfOptions | undefined;
      return bindControlIf(form, cond, factory, {
        ...opts,
        injector,
        onControlsChange: () => {
          opts?.onControlsChange?.();
          notifyControlsChange();
        },
      });
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
    hasControl(name: string) {
      controlsVersion();
      return Boolean(form.get(name));
    },

    watch: ((
      control: string | AbstractControl | Signal<unknown> | (() => unknown),
      callback: (value: unknown, prevValue?: unknown) => void,
      opts?: WatchControlOptions,
    ) => {
      const cb = callback as (value: unknown, prevValue?: unknown) => void;
      if (typeof control === 'string') {
        const dynamicSig = runInInjectionContext(injector, () =>
          computed(() => {
            controlsVersion();
            const c = form.get(control);
            if (!c) {
              return undefined;
            }
            return getOrCreateControlProxy(c).state.value();
          }),
        );
        return watchControl<unknown>(dynamicSig, cb, {...opts, injector});
      }
      return watchControl<unknown>(control as AbstractControl | Signal<unknown>, cb, {...opts, injector});
    }) as never,

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
    ): EffectRef {
      if (control instanceof AbstractControl) {
        return bindControlDisabled(control, condition, {...opts, injector});
      }

      const ctrlName = String(control);
      const emitEvent = opts?.emitEvent ?? true;
      const resetOnDisable = opts?.resetOnDisable ?? false;

      return effect(
        () => {
          controlsVersion();
          const shouldDisable = Boolean(condition());
          const targetCtrl = form.get(ctrlName);
          if (targetCtrl) {
            untracked(() => {
              if (shouldDisable) {
                if (targetCtrl.enabled) {
                  targetCtrl.disable({emitEvent});
                  if (resetOnDisable) {
                    if (opts?.resetValue !== undefined) {
                      targetCtrl.reset(opts.resetValue, {emitEvent});
                    } else {
                      targetCtrl.reset(undefined, {emitEvent});
                    }
                  }
                }
              } else {
                if (targetCtrl.disabled) {
                  targetCtrl.enable({emitEvent});
                }
              }
            });
          }
        },
        {injector},
      );
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
      if (control instanceof AbstractControl) {
        return bindControlValidators(control, validators, {...opts, injector});
      }

      const ctrlName = String(control);
      const emitEvent = opts?.emitEvent ?? true;
      const updateValueAndValidity = opts?.updateValueAndValidity ?? true;

      return effect(
        () => {
          controlsVersion();
          const valFns = resolveValidators(validators);
          const targetCtrl = form.get(ctrlName);
          if (targetCtrl) {
            untracked(() => {
              targetCtrl.setValidators(valFns);
              if (updateValueAndValidity) {
                targetCtrl.updateValueAndValidity({emitEvent});
              }
            });
          }
        },
        {injector},
      );
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
        const initialSrc = form.get(source);
        let prevVal: unknown = initialSrc ? initialSrc.value : undefined;
        let prevStatus = initialSrc ? initialSrc.status : '';
        let isSourceKnown = Boolean(initialSrc);

        const sub: Subscription = merge(form.valueChanges as Observable<unknown>, form.statusChanges).subscribe(() => {
          const srcCtrl = form.get(source);
          if (!srcCtrl) {
            prevVal = undefined;
            prevStatus = '';
            isSourceKnown = false;
            return;
          }
          const currentVal = srcCtrl.value;
          const currentStatus = srcCtrl.status;
          if (!isSourceKnown) {
            isSourceKnown = true;
            prevVal = currentVal;
            prevStatus = currentStatus;
            const target = getTarget();
            if (target) {
              target.updateValueAndValidity({emitEvent: true});
            }
            return;
          }
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

      if (targetControl instanceof AbstractControl) {
        return revalidateOnChange(targetControl, source as AbstractControl | Signal<unknown>, {injector});
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
            controlsVersion();
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
