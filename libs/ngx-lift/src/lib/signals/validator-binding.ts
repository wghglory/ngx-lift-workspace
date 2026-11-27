import {isSignal, Signal, untracked} from '@angular/core';
import {AbstractControl, ValidationErrors, ValidatorFn, Validators} from '@angular/forms';

type ValidatorPolicy = ValidatorFn | ValidatorFn[] | null;
type ValidatorResult = ValidatorPolicy | ValidationErrors;
type ValidatorSource = ValidatorPolicy | Signal<ValidatorPolicy> | (() => ValidatorPolicy);
type ReadValidator = (control?: AbstractControl) => ValidatorResult;

/** Resolves the current public value without installing a live policy dispatcher. */
export function resolveValidatorSnapshot(source: ValidatorSource, control?: AbstractControl): ValidatorPolicy {
  if (isSignal(source)) return source();
  if (typeof source !== 'function' || source.length !== 0) return source as ValidatorPolicy;
  const resolved = (source as ReadValidator)(control);
  return resolved === null || typeof resolved === 'function' || Array.isArray(resolved)
    ? (resolved as ValidatorPolicy)
    : (source as ValidatorFn);
}

/** Owns ambiguous zero-argument callbacks only for the lifetime of their binding effect. */
export function createValidatorBinding(control: AbstractControl, source: ValidatorSource) {
  if (isSignal(source) || typeof source !== 'function' || source.length !== 0) {
    return {validators: resolveValidatorSnapshot(source, control), destroy: () => undefined};
  }

  let reader: ReadValidator | undefined = source as ReadValidator;
  let lastResult = reader(control);
  let isValidator = isErrors(lastResult);
  const dispatcher: ValidatorFn = (target) => {
    const read = reader;
    if (read) {
      // Only the binding effect owns policy dependencies, never an application effect validating the control.
      lastResult = untracked(() => read(target));
      isValidator ||= isErrors(lastResult);
    }
    return evaluate(lastResult, target);
  };
  return {
    validators: dispatcher,
    destroy: () => {
      if (!reader) return;
      // Keep the dispatcher in its original composition slot so shared-key error precedence does not change.
      // Known validators continue normal Angular validation; getter policies stop reading their source.
      const frozen = isValidator ? (reader as ValidatorFn) : asPolicy(lastResult);
      reader = undefined;
      lastResult = frozen;
    },
  };
}

function isErrors(value: ValidatorResult): value is ValidationErrors {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

function asPolicy(value: ValidatorResult): ValidatorPolicy {
  if (Array.isArray(value)) return [...value];
  return typeof value === 'function' ? (value as ValidatorFn) : null;
}

function evaluate(value: ValidatorResult, control: AbstractControl): ValidationErrors | null {
  if (typeof value === 'function') return value(control);
  if (Array.isArray(value)) return Validators.compose(value)?.(control) ?? null;
  return value;
}
