import {AbstractControl, FormArray, FormControlStatus, FormGroup} from '@angular/forms';
import {merge, Observable, Subscription} from 'rxjs';

// Angular rebuilds group and array values on every validity update. Compare their enabled fields,
// retaining the normal identity semantics of object-valued FormControls.
function sameControlValue(control: AbstractControl, previous: unknown, current: unknown): boolean {
  if (Object.is(previous, current)) return true;

  if (control instanceof FormArray && Array.isArray(previous) && Array.isArray(current)) {
    const children = control.controls.filter((child) => child.enabled || control.disabled);
    return (
      previous.length === current.length &&
      children.every((child, i) => sameControlValue(child, previous[i], current[i]))
    );
  }

  if (
    control instanceof FormGroup &&
    previous &&
    current &&
    typeof previous === 'object' &&
    typeof current === 'object'
  ) {
    const fields = Object.keys(current);
    return (
      fields.length === Object.keys(previous).length &&
      fields.every(
        (key) =>
          Object.hasOwn(previous, key) &&
          sameControlValue(control.controls[key], Reflect.get(previous, key), Reflect.get(current, key)),
      )
    );
  }

  return false;
}

function containsControl(source: AbstractControl, target: AbstractControl): boolean {
  for (let control: AbstractControl | null = target; control; control = control.parent) {
    if (control.events === source.events) return true;
  }
  return false;
}

// Bindings on the same source can synchronously observe one another's target updates.
let updatingSource: AbstractControl | null = null;

/**
 * Revalidates mounted targets when the source changes value or status.
 * @param owner The control whose streams report changes, including dynamic source mounts.
 * @param getSource Resolves the current source or null when its path is absent.
 * @param getTargets Resolves the current targets, including any dynamically mounted controls.
 * @returns The subscription to unsubscribe when the binding ends.
 */
export function subscribeToRevalidation(
  owner: AbstractControl,
  getSource: () => AbstractControl | null,
  getTargets: () => readonly (AbstractControl | null)[],
): Subscription {
  let previousSource = getSource();
  let previousValue: unknown = previousSource?.value;
  let previousStatus = previousSource?.status;
  let statusBeforePendingUpdate: FormControlStatus | undefined;
  const pendingTargets = new WeakSet<AbstractControl>();

  return merge(owner.valueChanges as Observable<unknown>, owner.statusChanges).subscribe(() => {
    const source = getSource();
    const valueChanged =
      source !== previousSource || (source !== null && !sameControlValue(source, previousValue, source.value));
    const statusChanged = source?.status !== previousStatus;
    previousSource = source;
    previousValue = source?.value;
    previousStatus = source?.status;

    if (!source) return;
    const sourceStatus = source.status;
    for (const target of getTargets()) {
      if (!target) continue;
      const targetCompleted = !target.pending && pendingTargets.delete(target);
      if (!valueChanged && !statusChanged) continue;

      // Only nested targets can feed their status back into the observed source.
      const nested = containsControl(source, target);
      if (
        !valueChanged &&
        nested &&
        (targetCompleted || updatingSource?.events === source.events || sourceStatus === statusBeforePendingUpdate)
      ) {
        continue;
      }

      const previousUpdatingSource = updatingSource;
      updatingSource = source;
      try {
        target.updateValueAndValidity();
        if (nested && target.pending && target.asyncValidator) pendingTargets.add(target);
        statusBeforePendingUpdate = nested && source.pending ? sourceStatus : undefined;
      } finally {
        updatingSource = previousUpdatingSource;
      }
    }
  });
}
