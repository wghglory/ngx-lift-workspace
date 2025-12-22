import {signal} from '@angular/core';

export function createTrigger() {
  const sourceSignal = signal(0);

  return {
    next: () => {
      sourceSignal.update((v) => v + 1);
    },
    value: sourceSignal.asReadonly(),
  };
}
