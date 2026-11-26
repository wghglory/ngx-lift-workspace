import {AbstractControl, FormControlStatus, StatusChangeEvent, ValueChangeEvent} from '@angular/forms';
import {Subscription} from 'rxjs';

/** Observe the source through its owner so a path can disappear and later resolve to a new control. */
export function subscribeToRevalidation(
  owner: AbstractControl,
  getSource: () => AbstractControl | null,
  getTargets: () => readonly (AbstractControl | null)[],
): Subscription {
  let previousSource = getSource();
  let previousValue: unknown = previousSource?.value;
  let previousStatus = previousSource?.status;
  let updatingTarget: AbstractControl | null = null;
  const pendingValidators = new Map<AbstractControl, FormControlStatus | undefined>();

  return owner.events.subscribe((event) => {
    if (!(event instanceof ValueChangeEvent || event instanceof StatusChangeEvent)) return;

    const source = getSource();
    const valueChanged = source !== previousSource || !Object.is(source?.value, previousValue);
    const statusChanged = source?.status !== previousStatus;
    previousSource = source;
    previousValue = source?.value;
    previousStatus = source?.status;

    // Keep the latest group value even while Angular propagates our own target update.
    if (event.source === updatingTarget || !source || (!valueChanged && !statusChanged)) return;

    if (!valueChanged && event instanceof StatusChangeEvent && pendingValidators.has(event.source)) {
      const validatedStatus = pendingValidators.get(event.source);
      pendingValidators.delete(event.source);
      // A target has finished its own validation, or an ancestor has returned to the status we validated.
      if (validatedStatus === undefined || validatedStatus === source.status) return;
    }

    pendingValidators.clear();
    const sourceStatus = source.status;
    const previousTarget = updatingTarget;
    try {
      for (const target of getTargets()) {
        if (!target) continue;
        updatingTarget = target;
        target.updateValueAndValidity();
        for (let control: AbstractControl | null = target; control; control = control.parent) {
          if (control.pending && control.asyncValidator) {
            pendingValidators.set(control, control === target ? undefined : sourceStatus);
          }
        }
      }
    } finally {
      updatingTarget = previousTarget;
    }
  });
}
