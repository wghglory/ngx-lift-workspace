import {AbstractControl, FormArray, FormControlStatus, FormGroup} from '@angular/forms';
import {merge, Observable, Subscription} from 'rxjs';

const excludedValue = Symbol('excluded form value');

// Angular rebuilds group/array values on validity updates. Snapshot the mounted controls and
// their aggregate values so a replacement is visible even when the new leaf has the same value.
function snapshotSource(source: AbstractControl | null): unknown[] {
  const parts: unknown[] = [];
  function visit(control: AbstractControl, value: unknown): void {
    parts.push(control, value !== excludedValue);
    if (control instanceof FormArray) {
      const entries = Array.isArray(value) ? value : [];
      // An onlySelf change can leave the cached aggregate out of sync with the children's enabled flags.
      parts.push(control.length, entries.length);
      let index = 0;
      for (const child of control.controls) {
        visit(child, index < entries.length && (child.enabled || control.disabled) ? entries[index++] : excludedValue);
      }
    } else if (control instanceof FormGroup) {
      const fields = Object.entries<AbstractControl>(control.controls);
      parts.push(fields.length);
      for (const [key, child] of fields) {
        parts.push(key);
        visit(
          child,
          value && typeof value === 'object' && Object.hasOwn(value, key) ? Reflect.get(value, key) : excludedValue,
        );
      }
    } else {
      parts.push(value);
    }
  }
  if (source) visit(source, source.value);
  return parts;
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
  let previousSnapshot = snapshotSource(previousSource);
  let statusBeforePendingUpdate: FormControlStatus | undefined;
  const pendingTargets = new WeakSet<AbstractControl>();

  return merge(owner.valueChanges as Observable<unknown>, owner.statusChanges).subscribe(() => {
    const source = getSource();
    let valueChanged = false;
    if (source !== previousSource || !Object.is(source?.value, previousValue)) {
      const snapshot = snapshotSource(source);
      valueChanged =
        snapshot.length !== previousSnapshot.length ||
        snapshot.some((part, i) => !Object.is(part, previousSnapshot[i]));
      previousSnapshot = snapshot;
    }
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
        if (nested) statusBeforePendingUpdate = source.pending ? sourceStatus : undefined;
      } finally {
        updatingSource = previousUpdatingSource;
      }
    }
  });
}
