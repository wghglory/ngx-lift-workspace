import {EffectRef, Injector, Signal} from '@angular/core';
import {AbstractControl, FormControlStatus, FormGroup, ValidationErrors, ValidatorFn} from '@angular/forms';

/**
 * Handle returned by revalidation listeners allowing manual cleanup.
 */
export interface RevalidateSubscription {
  /**
   * Unsubscribes from revalidation changes.
   */
  unsubscribe(): void;
  /**
   * Alias for `unsubscribe()`.
   */
  destroy(): void;
}

/**
 * Options for `bindControlDisabled`.
 */
export interface BindControlDisabledOptions<T = unknown> {
  /**
   * The Angular `Injector` to use for creating effects.
   * If not provided, the current injection context is used.
   */
  injector?: Injector;

  /**
   * Whether to emit value and status change events when enabling or disabling the control.
   * Defaults to `true` to ensure reactive status signals update synchronously.
   *
   * @default true
   */
  emitEvent?: boolean;

  /**
   * Whether to reset the control when it becomes disabled.
   *
   * @default false
   */
  resetOnDisable?: boolean;

  /**
   * The value to assign when `resetOnDisable` is triggered.
   * If omitted, calls `control.reset()`.
   */
  resetValue?: T;
}

/**
 * Options for `bindControlIf`.
 */
export interface BindControlIfOptions {
  /**
   * The Angular `Injector` to use for creating effects.
   * If not provided, the current injection context is used.
   */
  injector?: Injector;

  /**
   * Whether to preserve the control's value in memory while it is detached,
   * restoring it when the condition evaluates back to `true`.
   *
   * @default false
   */
  preserveValue?: boolean;

  /**
   * Optional callback invoked whenever controls are mounted or unmounted.
   */
  onControlsChange?: () => void;
}

/**
 * Options for `bindControlValidators`.
 */
export interface BindControlValidatorsOptions {
  /**
   * The Angular `Injector` to use. Defaults to current injection context.
   */
  injector?: Injector;

  /**
   * Whether to emit events when updating validity. Defaults to `true`.
   */
  emitEvent?: boolean;

  /**
   * Whether to call `updateValueAndValidity()` immediately after applying new validators.
   * Defaults to `true`.
   */
  updateValueAndValidity?: boolean;
}

/**
 * Reactive signal representation of an Angular `AbstractControl`'s complete state.
 */
export interface ControlStateSignals<T = unknown> {
  /** Current value of the control. */
  readonly value: Signal<T>;
  /** Complete validation status (`'VALID' | 'INVALID' | 'PENDING' | 'DISABLED'`). */
  readonly status: Signal<FormControlStatus>;
  /** Whether the control passes validation. */
  readonly valid: Signal<boolean>;
  /** Whether the control has validation errors. */
  readonly invalid: Signal<boolean>;
  /** Whether the control has been modified by the user. */
  readonly dirty: Signal<boolean>;
  /** Whether the control has not been modified by the user. */
  readonly pristine: Signal<boolean>;
  /** Whether the control has received and lost focus. */
  readonly touched: Signal<boolean>;
  /** Whether the control has not been touched. */
  readonly untouched: Signal<boolean>;
  /** Whether the control is disabled. */
  readonly disabled: Signal<boolean>;
  /** Whether the control is enabled. */
  readonly enabled: Signal<boolean>;
  /** Whether asynchronous validation is pending. */
  readonly pending: Signal<boolean>;
  /** Current validation errors or `null`. */
  readonly errors: Signal<ValidationErrors | null>;
}

/**
 * Options for `controlValue`.
 */
export interface ControlValueOptions {
  /**
   * The Angular `Injector` to use for creating signals.
   * If not provided, the current injection context is used.
   */
  injector?: Injector;

  /**
   * Optional debounce duration in milliseconds.
   */
  debounceTime?: number;
}

/**
 * Options for `controlStatus`.
 */
export interface ControlStatusOptions {
  /**
   * The Angular `Injector` to use for creating signals.
   * If not provided, the current injection context is used.
   */
  injector?: Injector;
}

/**
 * Options for `controlState`.
 */
export interface ControlStateOptions {
  /**
   * The Angular `Injector` to use for creating signals.
   * If not provided, the current injection context is used.
   */
  injector?: Injector;

  /**
   * Optional debounce duration in milliseconds for the `value` signal.
   */
  debounceTime?: number;
}

/**
 * Options for `formState`.
 */
export interface FormStateOptions {
  /**
   * The Angular `Injector` to use for creating signals.
   * If not provided, the current injection context is used.
   */
  injector?: Injector;

  /**
   * Optional debounce duration in milliseconds for the form-level `value` and `rawValue` signals.
   */
  debounceTime?: number;
}

/**
 * Reactive signal representation of an Angular `FormGroup`'s complete state.
 */
export interface FormStateSignals<T = unknown> extends ControlStateSignals<T> {
  /** Current raw value of the form, preserving values from disabled controls. */
  readonly rawValue: Signal<T>;
}

/**
 * Infers the raw value object type from an Angular form controls dictionary.
 */
export type FormRawValue<TControls> = {
  [K in keyof TControls]: TControls[K] extends AbstractControl<infer V> ? V : unknown;
};

/**
 * Configuration options for `toSubmitValue` and `formSubmitValue`.
 */
export interface ToSubmitValueOptions<TInput extends object = Record<string, unknown>, TOutput = Partial<TInput>> {
  /**
   * Whether to include values from disabled form controls.
   * When `true`, uses `form.getRawValue()`; when `false`, uses `form.value`.
   * Only applicable when the source is an `AbstractControl` / `FormGroup`.
   *
   * @default true
   */
  includeDisabled?: boolean;

  /**
   * Keys to unconditionally omit from the prepared submit value.
   * Useful for stripping UI-only form controls (e.g., `confirmPassword`, `termsAccepted`).
   */
  omit?: (keyof TInput | string)[];

  /**
   * Whether to omit properties whose value is an empty string (`""`).
   *
   * @default false
   */
  omitEmptyStrings?: boolean;

  /**
   * Whether to omit properties whose value is `null` or `undefined`.
   *
   * @default false
   */
  omitNull?: boolean;

  /**
   * Custom predicate to conditionally omit properties based on value, key, or the entire form object.
   */
  omitIf?: (value: unknown, key: string, raw: Record<string, unknown>) => boolean;

  /**
   * Whether to recursively sanitize nested objects.
   *
   * @default false
   */
  deep?: boolean;

  /**
   * Optional custom transformation function applied to the sanitized submit value object.
   */
  transform?: (submitValue: Record<string, unknown>) => TOutput;
}

/**
 * Options for `formSubmitValue`.
 */
export interface FormSubmitValueOptions<
  TInput extends object = Record<string, unknown>,
  TOutput = Partial<TInput>,
> extends ToSubmitValueOptions<TInput, TOutput> {
  /**
   * The Angular `Injector` to use for creating signals.
   * If not provided, the current injection context is used.
   */
  injector?: Injector;

  /**
   * Optional debounce duration in milliseconds before emitting a recalculated submit value.
   */
  debounceTime?: number;
}

/**
 * Enhanced `AbstractControl` instance exposing reactive state signals and declarative binding helpers.
 */
export type SignalEnhancedControl<C extends AbstractControl = AbstractControl> = C & {
  /** Reactive state signals for this specific control. */
  readonly state: ControlStateSignals<C extends AbstractControl<infer V> ? V : unknown>;

  /** Declaratively binds this control's enabled/disabled status to a boolean Signal. */
  bindDisabled(
    condition: Signal<boolean> | (() => boolean),
    options?: BindControlDisabledOptions<C extends AbstractControl<infer V> ? V : unknown>,
  ): void;

  /** Declaratively synchronizes this control's validators with a reactive Signal or getter. */
  bindValidators(
    validators:
      | ValidatorFn
      | ValidatorFn[]
      | null
      | Signal<ValidatorFn | ValidatorFn[] | null>
      | (() => ValidatorFn | ValidatorFn[] | null),
    options?: BindControlValidatorsOptions,
  ): EffectRef;

  /** Automatically re-validates this control whenever a source control's value or status changes. */
  revalidateOn(
    sourceControl: AbstractControl | Signal<unknown> | (() => unknown),
    options?: {injector?: Injector},
  ): RevalidateSubscription;

  /**
   * Reactively executes a callback outside the tracking context (`untracked`) whenever this control's value changes.
   * Safe for setting other control values or updating state without `NG0600` signal write errors.
   */
  watch(
    callback: (
      value: C extends AbstractControl<infer V> ? V : unknown,
      prevValue?: C extends AbstractControl<infer V> ? V : unknown,
    ) => void,
    options?: WatchControlOptions,
  ): EffectRef;
};

/**
 * Options for `watchControl` and `sf.watch`.
 */
export interface WatchControlOptions {
  /**
   * The Angular `Injector` to use for creating the underlying effect.
   * If not provided, the current injection context is used.
   */
  injector?: Injector;

  /**
   * Whether to execute the callback immediately with the initial value upon creation.
   *
   * @default false
   */
  immediate?: boolean;
}

/**
 * Mapped type for `sf.controls`.
 * Provides strongly typed dot-notation access for all registered controls.
 */
export type SignalFormControls<TControls extends {[K in keyof TControls]: AbstractControl}> = {
  readonly [K in keyof TControls]: SignalEnhancedControl<TControls[K]>;
};

/**
 * Mapped type for `sf.fields`.
 * Provides strongly typed dot-notation access for all registered control signals.
 */
export type SignalFormFields<TControls extends {[K in keyof TControls]: AbstractControl}> = {
  readonly [K in keyof TControls]: ControlStateSignals<TControls[K] extends AbstractControl<infer V> ? V : unknown>;
};

/**
 * Options for configuring `toSignalForm`.
 */
export interface ToSignalFormOptions<
  TValue extends object = Record<string, unknown>,
  TSubmitValue = Partial<TValue>,
> extends ToSubmitValueOptions<TValue, TSubmitValue> {
  /**
   * The Angular `Injector` to use. Defaults to the current injection context.
   */
  injector?: Injector;

  /**
   * Configuration for preparing the backend submission value.
   * Can also be set directly on top-level options (e.g. `omit: [...]`).
   */
  submitValue?: ToSubmitValueOptions<TValue, TSubmitValue>;

  /**
   * Optional debounce duration in milliseconds for the form-level `value` and `submitValue` streams.
   */
  debounceTime?: number;
}

/**
 * A unified, reactive signal facade for Angular `FormGroup`.
 */
export interface SignalForm<
  TControls extends {[K in keyof TControls]: AbstractControl} = Record<string, AbstractControl>,
  TValue extends object = FormRawValue<TControls>,
  TSubmitValue = Partial<TValue>,
> {
  /** The underlying Angular `FormGroup` instance (pass to `<form [formGroup]="sf.form">`). */
  readonly form: FormGroup<TControls>;

  /** Strongly typed controls proxy. Each control is the authentic `AbstractControl` with `.state`. */
  readonly controls: SignalFormControls<TControls>;

  /** Strongly typed reactive field signals tree for all controls (`sf.fields.engine.value()`, `.valid()`, `.touched()`). */
  readonly fields: SignalFormFields<TControls>;

  // Form-level Signals
  /** Reactive signal emitting the form's current value (omits disabled controls). */
  readonly value: Signal<TValue>;
  /** Reactive signal emitting the complete raw value (preserves disabled controls). */
  readonly rawValue: Signal<TValue>;
  /** Reactive signal emitting `'VALID' | 'INVALID' | 'PENDING' | 'DISABLED'`. */
  readonly status: Signal<FormControlStatus>;
  /** Whether the form is currently valid. */
  readonly valid: Signal<boolean>;
  /** Whether the form has validation errors. */
  readonly invalid: Signal<boolean>;
  /** Whether any control in the form has been modified by the user. */
  readonly dirty: Signal<boolean>;
  /** Whether no control in the form has been modified by the user. */
  readonly pristine: Signal<boolean>;
  /** Whether any control in the form has been touched/blurred. */
  readonly touched: Signal<boolean>;
  /** Whether no control in the form has been touched/blurred. */
  readonly untouched: Signal<boolean>;
  /** Whether the form is disabled. */
  readonly disabled: Signal<boolean>;
  /** Whether the form is enabled. */
  readonly enabled: Signal<boolean>;
  /** Whether asynchronous validation is pending. */
  readonly pending: Signal<boolean>;
  /** Current validation errors on the form level. */
  readonly errors: Signal<ValidationErrors | null>;

  /** Continuous, reactive signal emitting the sanitized submission value (ready for `resourceAsync` or submission). */
  readonly submitValue: Signal<TSubmitValue>;

  // Control Inspection & Signal Helpers
  /** Checks whether a control with the given name currently exists in the form. */
  hasControl(name: keyof TControls | (string & {})): boolean;

  /**
   * Reactively watches a control's value signal or any Signal/getter and executes a callback
   * whenever the value changes. The callback is executed outside the tracking context (`untracked`)
   * to safely allow setting other control values or mutating state without `NG0600` signal write restrictions.
   *
   * @param control The control key (e.g. `'engine'`), control instance, Signal, or getter to watch.
   * @param callback The function executed when the value changes.
   * @param options Optional configuration including `injector` and `immediate`.
   * @returns An `EffectRef` that can be destroyed if manual teardown is needed.
   */
  watch<K extends string = keyof TControls & string>(
    control: K | AbstractControl | Signal<unknown> | (() => unknown),
    callback: (
      value: K extends keyof TControls ? (TControls[K] extends AbstractControl<infer V> ? V : unknown) : unknown,
      prevValue?: K extends keyof TControls ? (TControls[K] extends AbstractControl<infer V> ? V : unknown) : unknown,
    ) => void,
    options?: WatchControlOptions,
  ): EffectRef;

  /** Returns a reactive `Signal` of a child control's value with optional debouncing. */
  controlValue<K extends keyof TControls>(
    name: K,
    options?: {debounceTime?: number},
  ): Signal<TControls[K] extends AbstractControl<infer V> ? V : unknown>;
  controlValue<T = unknown>(name: string, options?: {debounceTime?: number}): Signal<T>;

  /** Returns a reactive `Signal` of a child control's status. */
  controlStatus(name: string): Signal<FormControlStatus>;

  /** Returns a comprehensive set of reactive signals for a child control. */
  controlState<K extends keyof TControls>(
    name: K,
    options?: {debounceTime?: number},
  ): ControlStateSignals<TControls[K] extends AbstractControl<infer V> ? V : unknown>;
  controlState<T = unknown>(name: string, options?: {debounceTime?: number}): ControlStateSignals<T>;

  // Declarative Behavior Bindings
  /** Declaratively binds a child control's disabled state to a boolean signal. Strongly typed to registered control keys or control instances. */
  bindDisabled<K extends string = keyof TControls & string>(
    control: K | AbstractControl,
    condition: Signal<boolean> | (() => boolean),
    options?: BindControlDisabledOptions<
      K extends keyof TControls ? (TControls[K] extends AbstractControl<infer V> ? V : unknown) : unknown
    >,
  ): void;

  /** Declaratively synchronizes a control's validators with a reactive Signal or getter. */
  bindValidators<K extends string = keyof TControls & string>(
    control: K | AbstractControl,
    validators:
      | ValidatorFn
      | ValidatorFn[]
      | null
      | Signal<ValidatorFn | ValidatorFn[] | null>
      | (() => ValidatorFn | ValidatorFn[] | null),
    options?: BindControlValidatorsOptions,
  ): EffectRef;

  /**
   * Conditionally mounts or unmounts one or multiple form controls based on a boolean Signal.
   */
  bindIf<K extends string, C extends AbstractControl>(
    condition: Signal<boolean> | (() => boolean),
    controlsFactory: () => Record<K, C>,
    options?: BindControlIfOptions,
  ): void;
  bindIf<C extends AbstractControl>(
    controlName: string,
    condition: Signal<boolean> | (() => boolean),
    controlFactory: () => C,
    options?: BindControlIfOptions,
  ): void;

  /**
   * Automatically re-validates a target control whenever a source control or Signal emits a new value.
   */
  revalidate<TTarget extends keyof TControls, TSource extends keyof TControls>(
    targetControl: TTarget | AbstractControl,
    source: TSource | AbstractControl | Signal<unknown> | (() => unknown),
  ): RevalidateSubscription;
  revalidate(
    targetControl: keyof TControls | string | AbstractControl,
    source: keyof TControls | string | AbstractControl | Signal<unknown> | (() => unknown),
  ): RevalidateSubscription;

  // Imperative Form Actions
  /** Resets the entire form or a specific control to its initial state. */
  reset(value?: unknown, options?: {onlySelf?: boolean; emitEvent?: boolean}): void;

  /** Marks all controls in the form tree as touched. */
  markAllAsTouched(): void;

  /** Marks all controls in the form tree as pristine. */
  markAsPristine(opts?: {onlySelf?: boolean}): void;

  /** Marks all controls in the form tree as untouched. */
  markAsUntouched(opts?: {onlySelf?: boolean}): void;
}
