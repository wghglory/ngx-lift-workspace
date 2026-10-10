import {signal} from '@angular/core';
import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest';

import {flushEffects} from './flush-effects';

describe('flushEffects', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should flush pending timer delays and effects', async () => {
    let resolved = false;
    setTimeout(() => {
      resolved = true;
    }, 100);

    expect(resolved).toBe(false);
    await flushEffects(100);
    expect(resolved).toBe(true);
  });

  it('should support signal changes with zero delay', async () => {
    const s = signal(1);
    s.set(2);
    await flushEffects();
    expect(s()).toBe(2);
  });
});
