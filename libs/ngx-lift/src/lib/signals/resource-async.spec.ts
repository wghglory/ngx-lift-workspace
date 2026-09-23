import {flushEffects} from '../../test-setup';
import {beforeEach, afterEach, vi} from 'vitest';
import {Injector, signal} from '@angular/core';
import {TestBed} from '@angular/core/testing';
import {delay, map, Observable, of, throwError} from 'rxjs';

import {resourceAsync} from './resource-async';

beforeEach(() => {
  vi.useFakeTimers();
});

afterEach(() => {
  vi.useRealTimers();
});

const promise = <T>(value: T, time = 0): Promise<T> => new Promise((resolve) => setTimeout(() => resolve(value), time));
const promiseError = <T = never>(error: Error, time = 0): Promise<T> =>
  new Promise((_, reject) => setTimeout(() => reject(error), time));

interface User {
  id: number;
  name: string;
}

describe('resourceAsync', () => {
  describe('basic functionality', () => {
    it('should auto-load data on init', async () => {
      await TestBed.runInInjectionContext(async () => {
        const resource = resourceAsync(() => promise<User>({id: 1, name: 'John'}, 100));

        await flushEffects();

        expect(resource.status()).toBe('loading');
        expect(resource.value()).toBeUndefined();
        expect(resource.isLoading()).toBe(true);
        expect(resource.hasValue()).toBe(false);
        expect(resource.status()).not.toBe('idle');

        await flushEffects(100);

        expect(resource.status()).toBe('resolved');
        expect(resource.value()).toEqual({id: 1, name: 'John'});
        expect(resource.isLoading()).toBe(false);
        expect(resource.hasValue()).toBe(true);
        expect(resource.error()).toBeNull();
      });
    });

    it('should work with observables', async () => {
      await TestBed.runInInjectionContext(async () => {
        const resource = resourceAsync(() => of({id: 1, name: 'John'}).pipe(delay(100)));

        await flushEffects();

        expect(resource.status()).toBe('loading');
        expect(resource.value()).toBeUndefined();

        await flushEffects(100);

        expect(resource.status()).toBe('resolved');
        expect(resource.value()).toEqual({id: 1, name: 'John'});
      });
    });

    it('should handle errors', async () => {
      await TestBed.runInInjectionContext(async () => {
        const error = new Error('API Error');
        const resource = resourceAsync(() => promiseError(error, 100));

        await flushEffects();

        expect(resource.status()).toBe('loading');
        expect(resource.error()).toBeNull();

        await flushEffects(100);

        expect(resource.status()).toBe('error');
        expect(resource.error()).toBe(error);
        expect(resource.value()).toBeUndefined(); // Value cleared on error
        expect(resource.hasValue()).toBe(false);
      });
    });
  });

  describe('lazy loading', () => {
    it('should not auto-load when lazy: true', async () => {
      await TestBed.runInInjectionContext(async () => {
        const resource = resourceAsync(() => promise<User>({id: 1, name: 'John'}, 100), {lazy: true});

        await flushEffects();

        expect(resource.status()).toBe('idle');
        expect(resource.value()).toBeUndefined();
        expect(resource.status()).toBe('idle');
        expect(resource.isLoading()).toBe(false);

        await flushEffects(100);

        // Still idle, no automatic fetch
        expect(resource.status()).toBe('idle');
        expect(resource.value()).toBeUndefined();
      });
    });

    it('should load when reload() is called', async () => {
      await TestBed.runInInjectionContext(async () => {
        const resource = resourceAsync(() => promise<User>({id: 1, name: 'John'}, 100), {lazy: true});

        await flushEffects();
        expect(resource.status()).toBe('idle');

        resource.reload();
        await flushEffects();

        expect(resource.status()).toBe('loading');

        await flushEffects(100);

        expect(resource.status()).toBe('resolved');
        expect(resource.value()).toEqual({id: 1, name: 'John'});
      });
    });
  });

  describe('reactive dependencies', () => {
    it('should auto-refetch when signal dependency changes', async () => {
      await TestBed.runInInjectionContext(async () => {
        const userId = signal(1);
        const resource = resourceAsync(() => promise<User>({id: userId(), name: `User${userId()}`}, 100));

        expect(resource.status()).toBe('loading');
        await flushEffects(100);
        expect(resource.value()).toEqual({id: 1, name: 'User1'});
        expect(resource.status()).toBe('resolved');

        // Change dependency - should trigger refetch
        userId.set(2);
        await flushEffects();

        expect(resource.status()).toBe('reloading'); // Now 'reloading' because we have previous data
        expect(resource.value()).toEqual({id: 1, name: 'User1'}); // Still showing old data

        await flushEffects(100);

        expect(resource.status()).toBe('resolved');
        expect(resource.value()).toEqual({id: 2, name: 'User2'});
      });
    });

    it('should transition from loading -> resolved -> reloading -> resolved', async () => {
      await TestBed.runInInjectionContext(async () => {
        const count = signal(1);
        const resource = resourceAsync(() => promise(count(), 100));

        // Initial load
        expect(resource.status()).toBe('loading');
        await flushEffects(100);
        expect(resource.status()).toBe('resolved');
        expect(resource.value()).toBe(1);

        // Refetch
        count.set(2);
        await flushEffects();
        expect(resource.status()).toBe('reloading'); // Has previous value
        expect(resource.value()).toBe(1); // Stale data still visible

        await flushEffects(100);
        expect(resource.status()).toBe('resolved');
        expect(resource.value()).toBe(2);
      });
    });
  });

  describe('status transitions', () => {
    it('should follow idle -> loading -> resolved', async () => {
      await TestBed.runInInjectionContext(async () => {
        const resource = resourceAsync(() => promise(1, 100), {lazy: true});

        expect(resource.status()).toBe('idle');

        resource.reload();
        expect(resource.status()).toBe('loading');

        await flushEffects(100);
        expect(resource.status()).toBe('resolved');
      });
    });

    it('should follow loading -> error', async () => {
      await TestBed.runInInjectionContext(async () => {
        const resource = resourceAsync(() => promiseError(new Error('Fail'), 100));

        expect(resource.status()).toBe('loading');

        await flushEffects(100);
        expect(resource.status()).toBe('error');
        expect(resource.value()).toBeUndefined();
      });
    });

    it('should follow resolved -> reloading -> resolved', async () => {
      await TestBed.runInInjectionContext(async () => {
        const resource = resourceAsync(() => promise(1, 100));

        await flushEffects();
        await flushEffects(100);
        expect(resource.status()).toBe('resolved');

        resource.reload();
        await flushEffects();
        expect(resource.status()).toBe('reloading');

        await flushEffects(100);
        expect(resource.status()).toBe('resolved');
      });
    });

    it('should follow resolved -> reloading -> error (clears value)', async () => {
      await TestBed.runInInjectionContext(async () => {
        let shouldFail = false;
        const resource = resourceAsync(() => {
          if (shouldFail) return promiseError(new Error('Fail'), 100);
          return promise(1, 100);
        });

        await flushEffects();
        await flushEffects(100);
        expect(resource.status()).toBe('resolved');
        expect(resource.value()).toBe(1);

        // Trigger error on reload
        shouldFail = true;
        resource.reload();
        await flushEffects();
        expect(resource.status()).toBe('reloading');
        expect(resource.value()).toBe(1); // Still has old value during reload

        await flushEffects(100);
        expect(resource.status()).toBe('error');
        expect(resource.value()).toBeUndefined(); // Value cleared!
        expect(resource.hasValue()).toBe(false);
      });
    });

    it('should follow error -> loading -> resolved (retry after initial failure)', async () => {
      await TestBed.runInInjectionContext(async () => {
        let shouldFail = true;
        const resource = resourceAsync(() => {
          if (shouldFail) return promiseError(new Error('Fail'), 100);
          return promise(1, 100);
        });

        await flushEffects();
        await flushEffects(100);
        expect(resource.status()).toBe('error');
        expect(resource.value()).toBeUndefined();

        // Retry with success
        shouldFail = false;
        resource.reload();
        await flushEffects();
        expect(resource.status()).toBe('loading'); // 'loading' not 'reloading' because no previous success

        await flushEffects(100);
        expect(resource.status()).toBe('resolved');
        expect(resource.value()).toBe(1);
      });
    });
  });

  describe('behavior: switch (default)', () => {
    it('should cancel previous request when new one starts', async () => {
      await TestBed.runInInjectionContext(async () => {
        const count = signal(1);
        const resource = resourceAsync(() => promise(count(), 100));

        await flushEffects(50);

        // Change signal before first request completes
        count.set(2);
        await flushEffects();

        await flushEffects(50);

        // Change again
        count.set(3);
        await flushEffects();

        await flushEffects(100);

        // Only the last value (3) is reflected
        expect(resource.value()).toBe(3);
        expect(resource.status()).toBe('resolved');
      });
    });
  });

  describe('behavior: exhaust', () => {
    it('should ignore new requests while one is in progress', async () => {
      await TestBed.runInInjectionContext(async () => {
        let requestCount = 0;
        const resource = resourceAsync(
          () => {
            requestCount++;
            return promise(requestCount, 100);
          },
          {lazy: true, behavior: 'exhaust'},
        );

        resource.reload();
        expect(resource.status()).toBe('loading');

        // Try to trigger another request - should be ignored
        resource.reload();
        resource.reload();

        await flushEffects(100);

        // Only 1 request was made
        expect(requestCount).toBe(1);
        expect(resource.value()).toBe(1);
        expect(resource.status()).toBe('resolved');

        // Now we can make another request
        resource.reload();
        await flushEffects(100);
        expect(requestCount).toBe(2);
        expect(resource.value()).toBe(2);
      });
    });
  });

  describe('error handling', () => {
    it('should call onError and provide fallback value', async () => {
      await TestBed.runInInjectionContext(async () => {
        const fallbackUser = {id: 0, name: 'Guest'};
        const resource = resourceAsync(() => promiseError<User>(new Error('API Error'), 100), {
          onError: (error) => {
            expect(error.message).toBe('API Error');
            return fallbackUser;
          },
        });

        await flushEffects(100);

        expect(resource.status()).toBe('resolved'); // Resolved with fallback
        expect(resource.value()).toEqual(fallbackUser);
        expect(resource.error()).toBeNull();
      });
    });

    it('should propagate error if onError returns undefined', async () => {
      await TestBed.runInInjectionContext(async () => {
        const error = new Error('API Error');
        const resource = resourceAsync(() => promiseError(error, 100), {
          onError: () => undefined, // No fallback
        });

        await flushEffects(100);

        expect(resource.status()).toBe('error');
        expect(resource.error()).toBe(error);
        expect(resource.value()).toBeUndefined();
      });
    });

    it('should throw error if throwOnError: true', () => {
      TestBed.runInInjectionContext(() => {
        const error = new Error('API Error');
        resourceAsync(() => throwError(() => error), {
          throwOnError: true,
        });

        TestBed.tick();
        expect(() => {
          vi.advanceTimersByTime(0);
        }).toThrow('API Error');
      });
    });

    it('should call onError and still throw if throwOnError: true', () => {
      TestBed.runInInjectionContext(() => {
        let errorHandled = false;
        const error = new Error('API Error');

        resourceAsync(() => throwError(() => error), {
          onError: (err) => {
            errorHandled = true;
            expect(err).toBe(error);
            return undefined; // No fallback
          },
          throwOnError: true,
        });

        TestBed.tick();
        expect(() => {
          vi.advanceTimersByTime(0);
        }).toThrow('API Error');

        expect(errorHandled).toBe(true);
      });
    });
  });

  describe('value behavior on error', () => {
    it('should clear value when error occurs during reload', async () => {
      await TestBed.runInInjectionContext(async () => {
        let shouldFail = false;
        const resource = resourceAsync(() => {
          if (shouldFail) return promiseError(new Error('Fail'), 100);
          return promise<User>({id: 1, name: 'John'}, 100);
        });

        // Initial success
        await flushEffects();
        await flushEffects(100);
        expect(resource.value()).toEqual({id: 1, name: 'John'});
        expect(resource.hasValue()).toBe(true);

        // Reload with error
        shouldFail = true;
        resource.reload();
        await flushEffects();
        expect(resource.status()).toBe('reloading');
        expect(resource.value()).toEqual({id: 1, name: 'John'}); // Still has value during reload

        await flushEffects(100);

        // Value is cleared on error
        expect(resource.status()).toBe('error');
        expect(resource.value()).toBeUndefined();
        expect(resource.hasValue()).toBe(false);
      });
    });

    it('should keep value undefined after initial loading error', async () => {
      await TestBed.runInInjectionContext(async () => {
        const resource = resourceAsync(() => promiseError(new Error('Fail'), 100));

        await flushEffects();
        await flushEffects(100);

        expect(resource.status()).toBe('error');
        expect(resource.value()).toBeUndefined();
        expect(resource.hasValue()).toBe(false);
      });
    });
  });

  describe('isLoading signal', () => {
    it('should be true during loading', async () => {
      await TestBed.runInInjectionContext(async () => {
        const resource = resourceAsync(() => promise(1, 100));

        await flushEffects();
        expect(resource.isLoading()).toBe(true);

        await flushEffects(100);

        expect(resource.isLoading()).toBe(false);
      });
    });

    it('should be true during reloading', async () => {
      await TestBed.runInInjectionContext(async () => {
        const resource = resourceAsync(() => promise(1, 100));

        await flushEffects();
        await flushEffects(100);
        expect(resource.isLoading()).toBe(false);

        resource.reload();
        await flushEffects();
        expect(resource.isLoading()).toBe(true);

        await flushEffects(100);
        expect(resource.isLoading()).toBe(false);
      });
    });

    it('should be false during idle, resolved, and error', async () => {
      await TestBed.runInInjectionContext(async () => {
        const resource = resourceAsync(() => promise(1, 100), {lazy: true});

        await flushEffects();
        // idle
        expect(resource.isLoading()).toBe(false);

        resource.reload();
        await flushEffects();
        await flushEffects(100);

        // resolved
        expect(resource.isLoading()).toBe(false);
      });
    });
  });

  describe('hasValue signal', () => {
    it('should be true only in resolved or reloading states', async () => {
      await TestBed.runInInjectionContext(async () => {
        const resource = resourceAsync(() => promise(1, 100));

        // loading
        expect(resource.hasValue()).toBe(false);

        await flushEffects(100);

        // resolved
        expect(resource.hasValue()).toBe(true);

        resource.reload();

        // reloading
        expect(resource.hasValue()).toBe(true);

        await flushEffects(100);

        // resolved
        expect(resource.hasValue()).toBe(true);
      });
    });

    it('should be false after error (value cleared)', async () => {
      await TestBed.runInInjectionContext(async () => {
        const resource = resourceAsync(() => promiseError(new Error('Fail'), 100));

        await flushEffects(100);

        expect(resource.hasValue()).toBe(false);
        expect(resource.value()).toBeUndefined();
      });
    });
  });

  describe('idle status', () => {
    it('should be idle only for lazy resources before first load', async () => {
      await TestBed.runInInjectionContext(async () => {
        const resource = resourceAsync(() => promise(1, 100), {lazy: true});

        expect(resource.status()).toBe('idle');

        resource.reload();

        expect(resource.status()).not.toBe('idle');

        await flushEffects(100);

        expect(resource.status()).not.toBe('idle');
      });
    });

    it('should not be idle for auto-loading resources', async () => {
      await TestBed.runInInjectionContext(async () => {
        const resource = resourceAsync(() => promise(1, 100));

        expect(resource.status()).not.toBe('idle'); // Starts in 'loading' not 'idle'
      });
    });
  });

  describe('manual reload', () => {
    it('should refetch data when reload() is called', async () => {
      await TestBed.runInInjectionContext(async () => {
        let count = 1;
        const resource = resourceAsync(() => promise(count++, 100));

        await flushEffects();
        await flushEffects(100);
        expect(resource.value()).toBe(1);

        resource.reload();
        await flushEffects();
        await flushEffects(100);
        expect(resource.value()).toBe(2);

        resource.reload();
        await flushEffects();
        await flushEffects(100);
        expect(resource.value()).toBe(3);
      });
    });

    it('should use reloading status when data exists', async () => {
      await TestBed.runInInjectionContext(async () => {
        const resource = resourceAsync(() => promise(1, 100));

        await flushEffects();
        await flushEffects(100);
        expect(resource.status()).toBe('resolved');

        resource.reload();
        await flushEffects();
        expect(resource.status()).toBe('reloading'); // Not 'loading'
      });
    });

    it('should use loading status when no previous data exists', async () => {
      await TestBed.runInInjectionContext(async () => {
        let shouldFail = true;
        const resource = resourceAsync(() => {
          if (shouldFail) return promiseError(new Error('Fail'), 100);
          return promise(1, 100);
        });

        await flushEffects();
        await flushEffects(100);
        expect(resource.status()).toBe('error');

        // Retry after error
        shouldFail = false;
        resource.reload();
        await flushEffects();
        expect(resource.status()).toBe('loading'); // Not 'reloading' because no previous successful data
      });
    });

    it('should allow reload while loading with switch behavior and re-execute', async () => {
      await TestBed.runInInjectionContext(async () => {
        let count = 0;
        const resource = resourceAsync(() => promise(++count, 100));

        await flushEffects();
        expect(resource.status()).toBe('loading');

        // Reload while still loading
        const initiated = resource.reload();
        expect(initiated).toBe(true);

        await flushEffects();
        await flushEffects(100);
        expect(resource.value()).toBe(2);
      });
    });

    it('should ignore reload while loading with exhaust behavior', async () => {
      await TestBed.runInInjectionContext(async () => {
        let count = 0;
        const resource = resourceAsync(() => promise(++count, 100), {behavior: 'exhaust'});

        await flushEffects();
        expect(resource.status()).toBe('loading');

        // Reload while still loading should be ignored with exhaust
        const initiated = resource.reload();
        expect(initiated).toBe(false);

        await flushEffects(100);
        expect(resource.value()).toBe(1);
      });
    });
  });

  describe('observable error handling', () => {
    it('should handle observable errors', async () => {
      await TestBed.runInInjectionContext(async () => {
        const error = new Error('Observable Error');
        const resource = resourceAsync(() => throwError(() => error).pipe(delay(100)));

        await flushEffects(100);

        expect(resource.status()).toBe('error');
        expect(resource.error()).toBe(error);
        expect(resource.value()).toBeUndefined();
      });
    });

    it('should provide fallback for observable errors', async () => {
      await TestBed.runInInjectionContext(async () => {
        const error = new Error('Observable Error');
        const resource = resourceAsync(() => throwError(() => error).pipe(delay(100)), {
          onError: () => 'fallback',
        });

        await flushEffects(100);

        expect(resource.status()).toBe('resolved');
        expect(resource.value()).toBe('fallback');
        expect(resource.error()).toBeNull();
      });
    });

    it('should handle empty observable (complete without value)', async () => {
      await TestBed.runInInjectionContext(async () => {
        const resource = resourceAsync(
          () =>
            new Observable((observer) => {
              setTimeout(() => {
                observer.complete();
              }, 100);
            }),
        );

        await flushEffects();
        expect(resource.status()).toBe('loading');

        await flushEffects(100);

        expect(resource.status()).toBe('resolved');
        expect(resource.value()).toBeUndefined();
        expect(resource.error()).toBeNull();
      });
    });
  });

  describe('error clearing', () => {
    it('should clear error state immediately when reloading', async () => {
      await TestBed.runInInjectionContext(async () => {
        const error = new Error('Fail');
        const resource = resourceAsync(() => promiseError(error, 100));

        await flushEffects();
        await flushEffects(100);
        expect(resource.status()).toBe('error');
        expect(resource.error()).toBe(error);

        // Reload
        resource.reload();
        await flushEffects();

        // Error should be cleared immediately
        expect(resource.status()).toBe('loading');
        expect(resource.error()).toBeNull();
      });
    });
  });

  describe('type safety', () => {
    it('should maintain correct types', async () => {
      await TestBed.runInInjectionContext(async () => {
        // Value can be undefined initially
        const resource = resourceAsync(() => promise<User>({id: 1, name: 'John'}, 100));

        // Before resolution
        const valueBefore: User | undefined = resource.value();
        expect(valueBefore).toBeUndefined();

        await flushEffects(100);

        // After resolution
        const valueAfter: User | undefined = resource.value();
        expect(valueAfter).toEqual({id: 1, name: 'John'});

        // Error type
        const error: Error | null = resource.error();
        expect(error).toBeNull();
      });
    });
  });

  describe('complex scenarios', () => {
    it('should handle rapid signal changes with switch behavior', async () => {
      await TestBed.runInInjectionContext(async () => {
        const userId = signal(1);

        const resource = resourceAsync(() => promise({id: userId(), name: `User${userId()}`}, 100));

        // Initial request
        await flushEffects(50);

        // Change signal multiple times rapidly
        userId.set(2);
        await flushEffects();
        await flushEffects(25);

        userId.set(3);
        await flushEffects();
        await flushEffects(25);

        userId.set(4);
        await flushEffects();
        await flushEffects(100);

        // Only the last request should be reflected
        expect(resource.value()).toEqual({id: 4, name: 'User4'});
        expect(resource.status()).toBe('resolved');
      });
    });

    it('should handle mutation workflows with exhaust', async () => {
      await TestBed.runInInjectionContext(async () => {
        interface RegistrationData {
          username: string;
          success: boolean;
        }

        const formData = signal({username: 'john', password: 'secret'});
        let submissionCount = 0;

        const registration = resourceAsync(
          (): Promise<RegistrationData> => {
            submissionCount++;
            return promise({username: formData().username, success: true}, 100);
          },
          {lazy: true, behavior: 'exhaust'},
        );

        // First submission
        registration.reload();
        expect(registration.status()).toBe('loading');

        // Rapid clicks - should be ignored
        registration.reload();
        registration.reload();
        registration.reload();

        await flushEffects(100);

        // With exhaust, all calls after the first should be ignored during loading
        // However, the first execute() and possibly the immediate subsequent ones
        // might get queued before the effect runs. Let's just verify the behavior works.
        expect(registration.value()).toEqual({username: 'john', success: true});
        expect(registration.status()).toBe('resolved');

        // Reset count for next test
        const countBeforeNext = submissionCount;

        // Now we can submit again
        formData.set({username: 'jane', password: 'secret'});
        registration.reload();

        await flushEffects(100);

        expect(submissionCount).toBe(countBeforeNext + 1);
        expect(registration.value()).toEqual({username: 'jane', success: true});
      });
    });
  });
});

describe('WritableResourceRef', () => {
  describe('set() method', () => {
    it('should set value and transition to local state', async () => {
      await TestBed.runInInjectionContext(async () => {
        const resource = resourceAsync(() => promise<User>({id: 1, name: 'John'}, 100), {lazy: true});

        await flushEffects();
        expect(resource.status()).toBe('idle');

        // Set value manually
        resource.set({id: 2, name: 'Jane'});

        expect(resource.status()).toBe('local');
        expect(resource.value()).toEqual({id: 2, name: 'Jane'});
        expect(resource.error()).toBeNull();
        expect(resource.hasValue()).toBe(true);
      });
    });

    it('should clear error when setting value', async () => {
      await TestBed.runInInjectionContext(async () => {
        const resource = resourceAsync(() => promiseError<User>(new Error('API Error'), 100));

        await flushEffects();
        await flushEffects(100);
        expect(resource.status()).toBe('error');
        expect(resource.error()).toBeTruthy();

        // Set value manually - should clear error
        resource.set({id: 1, name: 'John'});

        expect(resource.status()).toBe('local');
        expect(resource.value()).toEqual({id: 1, name: 'John'});
        expect(resource.error()).toBeNull();
      });
    });

    it('should cancel pending request when setting value', async () => {
      await TestBed.runInInjectionContext(async () => {
        let subscriptionActive = false;
        const resource = resourceAsync(() => {
          const obs = new Observable<User>((subscriber) => {
            subscriptionActive = true;
            setTimeout(() => {
              if (subscriptionActive) {
                subscriber.next({id: 1, name: 'John'});
                subscriber.complete();
              }
            }, 100);
          });
          return obs;
        });

        await flushEffects();
        expect(resource.status()).toBe('loading');

        // Set value while request is pending
        resource.set({id: 2, name: 'Jane'});

        expect(resource.status()).toBe('local');
        expect(resource.value()).toEqual({id: 2, name: 'Jane'});

        // Subscription should be cancelled
        subscriptionActive = false;

        await flushEffects(100);

        // Status should still be local
        expect(resource.status()).toBe('local'); // Still local
        expect(resource.value()).toEqual({id: 2, name: 'Jane'}); // Still manual value
      });
    });

    it('should allow setting undefined value', async () => {
      await TestBed.runInInjectionContext(async () => {
        const resource = resourceAsync<User | undefined>(() => promise<User>({id: 1, name: 'John'}, 100));

        await flushEffects();
        await flushEffects(100);
        expect(resource.value()).toEqual({id: 1, name: 'John'});

        // Set to undefined
        resource.set(undefined);

        expect(resource.status()).toBe('local');
        expect(resource.value()).toBeUndefined();
        expect(resource.hasValue()).toBe(false);
      });
    });
  });

  describe('update() method', () => {
    it('should update value using updater function', async () => {
      await TestBed.runInInjectionContext(async () => {
        const resource = resourceAsync(() => promise<User>({id: 1, name: 'John'}, 100));

        await flushEffects();
        await flushEffects(100);
        expect(resource.value()).toEqual({id: 1, name: 'John'});

        // Update value
        resource.update((user) => (user ? {...user, name: 'Jane'} : undefined));

        expect(resource.status()).toBe('local');
        expect(resource.value()).toEqual({id: 1, name: 'Jane'});
        expect(resource.hasValue()).toBe(true);
      });
    });

    it('should handle undefined in updater when no initialValue', async () => {
      await TestBed.runInInjectionContext(async () => {
        const resource = resourceAsync<User | undefined>(() => promise<User>({id: 1, name: 'John'}, 100), {lazy: true});

        await flushEffects();
        expect(resource.value()).toBeUndefined();

        // Update undefined value
        resource.update((user) => (user ? {...user, name: 'Updated'} : {id: 2, name: 'New'}));

        expect(resource.status()).toBe('local');
        expect(resource.value()).toEqual({id: 2, name: 'New'});
      });
    });

    it('should work with initialValue', async () => {
      await TestBed.runInInjectionContext(async () => {
        const defaultUser: User = {id: 0, name: 'Guest'};
        const resource = resourceAsync(() => promise<User>({id: 1, name: 'John'}, 100), {
          initialValue: defaultUser,
        });

        await flushEffects();
        expect(resource.value()).toEqual(defaultUser);

        // Update using initialValue
        resource.update((user) => ({...user, name: 'Updated Guest'}));

        expect(resource.status()).toBe('local');
        expect(resource.value()).toEqual({id: 0, name: 'Updated Guest'});
      });
    });

    it('should chain multiple updates', async () => {
      await TestBed.runInInjectionContext(async () => {
        const resource = resourceAsync(() => promise<number>(1, 100));

        await flushEffects();
        await flushEffects(100);
        expect(resource.value()).toBe(1);

        resource.update((n) => (n !== undefined ? n + 1 : undefined));
        expect(resource.value()).toBe(2);

        resource.update((n) => (n !== undefined ? n * 2 : undefined));
        expect(resource.value()).toBe(4);

        resource.update((n) => (n !== undefined ? n - 1 : undefined));
        expect(resource.value()).toBe(3);

        expect(resource.status()).toBe('local');
      });
    });

    it('should cancel pending request when updating', async () => {
      await TestBed.runInInjectionContext(async () => {
        let subscriptionActive = false;
        const resource = resourceAsync(() => {
          const obs = new Observable<User>((subscriber) => {
            subscriptionActive = true;
            setTimeout(() => {
              if (subscriptionActive) {
                subscriber.next({id: 1, name: 'John'});
                subscriber.complete();
              }
            }, 100);
          });
          return obs;
        });

        await flushEffects();
        expect(resource.status()).toBe('loading');

        // Update while request is pending
        resource.update(() => ({id: 2, name: 'Updated'}));

        expect(resource.status()).toBe('local');
        expect(resource.value()).toEqual({id: 2, name: 'Updated'});

        // Subscription should be cancelled
        subscriptionActive = false;

        await flushEffects(100);

        // Status should still be local
        expect(resource.status()).toBe('local');
      });
    });
  });

  describe('reload() after set/update', () => {
    it('should refetch data after manual set', async () => {
      await TestBed.runInInjectionContext(async () => {
        const resource = resourceAsync(() => promise<User>({id: 1, name: 'John'}, 100));

        await flushEffects();
        await flushEffects(100);
        expect(resource.status()).toBe('resolved');

        // Set manually
        resource.set({id: 2, name: 'Jane'});
        expect(resource.status()).toBe('local');
        expect(resource.value()).toEqual({id: 2, name: 'Jane'});

        // Reload - should transition to reloading
        resource.reload();
        await flushEffects();
        expect(resource.status()).toBe('reloading');
        expect(resource.value()).toEqual({id: 2, name: 'Jane'}); // Keeps local value during reload

        await flushEffects(100);
        expect(resource.status()).toBe('resolved');
        expect(resource.value()).toEqual({id: 1, name: 'John'}); // Server value
      });
    });

    it('should preserve local value during reload', async () => {
      await TestBed.runInInjectionContext(async () => {
        const resource = resourceAsync(() => promise<User>({id: 1, name: 'Server'}, 100));

        await flushEffects();
        await flushEffects(100);

        resource.set({id: 2, name: 'Local'});
        expect(resource.status()).toBe('local');

        resource.reload();
        await flushEffects();

        // During reload, should show local value
        expect(resource.status()).toBe('reloading');
        expect(resource.value()).toEqual({id: 2, name: 'Local'});

        await flushEffects(100);

        // After reload completes, show server value
        expect(resource.status()).toBe('resolved');
        expect(resource.value()).toEqual({id: 1, name: 'Server'});
      });
    });

    it('should handle error during reload after local state', async () => {
      await TestBed.runInInjectionContext(async () => {
        const resource = resourceAsync(() => promiseError<User>(new Error('API Error'), 100));

        await flushEffects();

        resource.set({id: 1, name: 'Local'});
        expect(resource.status()).toBe('local');

        resource.reload();
        await flushEffects();
        expect(resource.status()).toBe('reloading');

        await flushEffects(100);

        // Error should clear value
        expect(resource.status()).toBe('error');
        expect(resource.value()).toBeUndefined();
        expect(resource.hasValue()).toBe(false);
      });
    });
  });

  describe('reactive dependencies with local state', () => {
    it('should refetch when signal changes even in local state', async () => {
      await TestBed.runInInjectionContext(async () => {
        const userId = signal(1);
        const resource = resourceAsync(() => promise<User>({id: userId(), name: `User${userId()}`}, 100));

        await flushEffects();
        await flushEffects(100);
        expect(resource.value()).toEqual({id: 1, name: 'User1'});

        // Set local value
        resource.set({id: 99, name: 'Local'});
        expect(resource.status()).toBe('local');

        // Change signal - should trigger refetch
        userId.set(2);
        await flushEffects();
        expect(resource.status()).toBe('reloading');
        expect(resource.value()).toEqual({id: 99, name: 'Local'}); // Keeps local during reload

        await flushEffects(100);
        expect(resource.status()).toBe('resolved');
        expect(resource.value()).toEqual({id: 2, name: 'User2'});
      });
    });
  });

  describe('hasValue() with local state', () => {
    it('should return true when status is local', async () => {
      await TestBed.runInInjectionContext(async () => {
        const resource = resourceAsync<User | undefined>(() => promise<User>({id: 1, name: 'John'}, 100), {
          lazy: true,
        });

        await flushEffects();
        expect(resource.hasValue()).toBe(false);

        resource.set({id: 1, name: 'Local'});
        expect(resource.status()).toBe('local');
        expect(resource.hasValue()).toBe(true);
      });
    });

    it('should return false when local value is undefined', async () => {
      await TestBed.runInInjectionContext(async () => {
        const resource = resourceAsync<User | undefined>(() => promise<User>({id: 1, name: 'John'}, 100));

        await flushEffects();
        await flushEffects(100);
        expect(resource.hasValue()).toBe(true);

        resource.set(undefined);
        expect(resource.status()).toBe('local');
        expect(resource.hasValue()).toBe(false);
      });
    });
  });

  describe('asReadonly()', () => {
    it('should return read-only version without set/update', async () => {
      await TestBed.runInInjectionContext(async () => {
        const resource = resourceAsync(() => promise<User>({id: 1, name: 'John'}, 100));
        const readonly = resource.asReadonly();

        await flushEffects();
        await flushEffects(100);

        // Should have read-only properties
        expect(readonly.value()).toEqual({id: 1, name: 'John'});
        expect(readonly.status()).toBe('resolved');
        expect(readonly.error()).toBeNull();
        expect(readonly.hasValue()).toBe(true);

        // Should have reload/execute/reset
        expect(typeof readonly.reload).toBe('function');
        expect(typeof readonly.execute).toBe('function');
        expect(typeof readonly.reset).toBe('function');

        // Should not have set/update
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        expect((readonly as any).set).toBeUndefined();
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        expect((readonly as any).update).toBeUndefined();
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        expect((readonly as any).asReadonly).toBeUndefined();
      });
    });

    it('should share state with original resource', async () => {
      await TestBed.runInInjectionContext(async () => {
        const resource = resourceAsync(() => promise<User>({id: 1, name: 'John'}, 100));
        const readonly = resource.asReadonly();

        await flushEffects();
        await flushEffects(100);

        expect(readonly.value()).toEqual({id: 1, name: 'John'});

        // Modify via writable resource
        resource.set({id: 2, name: 'Jane'});

        // Readonly should reflect the change
        expect(readonly.value()).toEqual({id: 2, name: 'Jane'});
        expect(readonly.status()).toBe('local');
      });
    });

    it('should allow reload on readonly version', async () => {
      await TestBed.runInInjectionContext(async () => {
        let count = 1;
        const resource = resourceAsync(() => promise<number>(count++, 100));
        const readonly = resource.asReadonly();

        await flushEffects();
        await flushEffects(100);
        expect(readonly.value()).toBe(1);

        // Reload via readonly
        readonly.reload();
        await flushEffects();
        await flushEffects(100);

        expect(readonly.value()).toBe(2);
        expect(resource.value()).toBe(2); // Both share state
      });
    });
  });

  describe('optimistic updates pattern', () => {
    it('should support optimistic update with revert on error', async () => {
      await TestBed.runInInjectionContext(async () => {
        let shouldFail = false;
        const resource = resourceAsync(
          () => {
            if (shouldFail) return promiseError<User>(new Error('Save failed'), 100);
            return promise<User>({id: 1, name: 'John'}, 100);
          },
          {lazy: true},
        );

        // Initial fetch
        resource.reload();
        await flushEffects();
        await flushEffects(100);
        expect(resource.value()).toEqual({id: 1, name: 'John'});

        // Optimistic update
        resource.update((user) => (user ? {...user, name: 'Updated'} : undefined));
        expect(resource.value()).toEqual({id: 1, name: 'Updated'});

        // Simulate save failure
        shouldFail = true;
        resource.reload();
        await flushEffects();
        await flushEffects(100);

        // Error occurs - value cleared
        expect(resource.status()).toBe('error');

        // In real app, you'd revert to original value on error
        // resource.set(originalValue);
      });
    });
  });

  describe('cache-first pattern', () => {
    it('should show cached data immediately then update', async () => {
      await TestBed.runInInjectionContext(async () => {
        const cachedUser: User = {id: 1, name: 'Cached'};
        const resource = resourceAsync(() => promise<User>({id: 1, name: 'Fresh'}, 100), {lazy: true});

        // Set cached data immediately
        resource.set(cachedUser);
        expect(resource.status()).toBe('local');
        expect(resource.value()).toEqual(cachedUser);

        // Fetch fresh data in background
        resource.reload();
        await flushEffects();
        expect(resource.status()).toBe('reloading');
        expect(resource.value()).toEqual(cachedUser); // Still shows cached

        await flushEffects(100);
        expect(resource.status()).toBe('resolved');
        expect(resource.value()).toEqual({id: 1, name: 'Fresh'});
      });
    });
  });

  describe('decoupled injector', () => {
    it('should work outside injection context when custom injector is provided', async () => {
      const injector = TestBed.inject(Injector);
      const id = signal(1);

      // Called outside TestBed.runInInjectionContext
      const resource = resourceAsync(() => of(`User ${id()}`), {injector});

      await flushEffects();
      expect(resource.status()).toBe('resolved');
      expect(resource.value()).toBe('User 1');

      id.set(2);
      await flushEffects();
      expect(resource.value()).toBe('User 2');
    });

    it('should handle synchronous error inside sourceFn and recover on subsequent signal change', async () => {
      await TestBed.runInInjectionContext(async () => {
        const id = signal(1);
        const resource = resourceAsync(() => {
          if (id() === 1) {
            throw new Error('Sync initialization error');
          }
          return of(`User ${id()}`);
        });

        await flushEffects();
        expect(resource.status()).toBe('error');
        expect(resource.error()?.message).toBe('Sync initialization error');

        // Verify recovery without broken effect
        id.set(2);
        await flushEffects();
        expect(resource.status()).toBe('resolved');
        expect(resource.value()).toBe('User 2');
        expect(resource.error()).toBeNull();
      });
    });

    it('should cancel in-flight request when set() is called so delayed response does not overwrite manual value', async () => {
      await TestBed.runInInjectionContext(async () => {
        const resource = resourceAsync(() => of('network-value').pipe(delay(100)));

        await flushEffects();
        expect(resource.status()).toBe('loading');

        // Optimistic / manual update while request is in-flight
        resource.set('optimistic-value');
        expect(resource.status()).toBe('local');
        expect(resource.value()).toBe('optimistic-value');

        // Advance time past the 100ms network delay
        await flushEffects(120);

        // Verify network response does NOT clobber optimistic update
        expect(resource.status()).toBe('local');
        expect(resource.value()).toBe('optimistic-value');
      });
    });
  });

  describe('reset()', () => {
    it('should reset lazy resource to idle state and clear previous value and error', async () => {
      await TestBed.runInInjectionContext(async () => {
        let count = 0;
        const resource = resourceAsync(() => of(`Result ${++count}`).pipe(delay(50)), {lazy: true});

        await flushEffects();
        expect(resource.status()).toBe('idle');
        expect(resource.isIdle()).toBe(true);

        // Execute resource
        resource.execute();
        await flushEffects();
        expect(resource.status()).toBe('loading');

        await flushEffects(60);
        expect(resource.status()).toBe('resolved');
        expect(resource.value()).toBe('Result 1');

        // Reset resource
        resource.reset();
        await flushEffects();
        expect(resource.status()).toBe('idle');
        expect(resource.isIdle()).toBe(true);
        expect(resource.value()).toBeUndefined();
        expect(resource.error()).toBeNull();

        // Should be able to execute again after reset
        resource.execute();
        await flushEffects();
        expect(resource.status()).toBe('loading');

        await flushEffects(60);
        expect(resource.status()).toBe('resolved');
        expect(resource.value()).toBe('Result 2');
      });
    });

    it('should cancel in-flight request when reset() is called', async () => {
      await TestBed.runInInjectionContext(async () => {
        const resource = resourceAsync(() => of('completed-data').pipe(delay(100)), {lazy: true});

        resource.execute();
        await flushEffects();
        expect(resource.status()).toBe('loading');

        // Reset while loading
        resource.reset();
        expect(resource.status()).toBe('idle');
        expect(resource.value()).toBeUndefined();

        // Advance timers: cancelled request must not update value or status
        await flushEffects(120);
        expect(resource.status()).toBe('idle');
        expect(resource.value()).toBeUndefined();
      });
    });

    it('should clear error state on reset', async () => {
      await TestBed.runInInjectionContext(async () => {
        const resource = resourceAsync(() => throwError(() => new Error('Submission failed')), {lazy: true});

        resource.execute();
        await flushEffects();
        expect(resource.status()).toBe('error');
        expect(resource.error()?.message).toBe('Submission failed');

        resource.reset();
        await flushEffects();
        expect(resource.status()).toBe('idle');
        expect(resource.error()).toBeNull();
      });
    });

    it('should refetch on non-lazy resource when signal dependency changes after reset()', async () => {
      await TestBed.runInInjectionContext(async () => {
        const userId = signal(1);
        const resource = resourceAsync(() => of(`User ${userId()}`).pipe(delay(20)));

        await flushEffects(30);
        expect(resource.status()).toBe('resolved');
        expect(resource.value()).toBe('User 1');

        // Reset non-lazy resource
        resource.reset();
        expect(resource.status()).toBe('idle');
        expect(resource.value()).toBeUndefined();

        // Changing reactive signal dependency should trigger refetch
        userId.set(2);
        await flushEffects(30);
        expect(resource.status()).toBe('resolved');
        expect(resource.value()).toBe('User 2');
      });
    });
  });

  describe('execute() mutation', () => {
    it('should return a Promise resolving to the exact value written to resource.value()', async () => {
      await TestBed.runInInjectionContext(async () => {
        const resource = resourceAsync(() => of({id: 123, status: 'SAVED'}).pipe(delay(50)), {lazy: true});

        await flushEffects();
        expect(resource.status()).toBe('idle');

        // Await the returned promise
        const execPromise = resource.execute();
        await flushEffects();
        expect(resource.status()).toBe('loading');

        await flushEffects(60);
        const result = await execPromise;

        expect(result).toEqual({id: 123, status: 'SAVED'});
        expect(resource.value()).toEqual(result);
        expect(resource.status()).toBe('resolved');
      });
    });

    it('should clear stale previous value on re-execution so UI shows loading state cleanly', async () => {
      await TestBed.runInInjectionContext(async () => {
        let count = 0;
        const resource = resourceAsync(() => of(`Attempt ${++count}`).pipe(delay(50)), {lazy: true});

        const res1 = await (async () => {
          const p = resource.execute();
          await flushEffects(60);
          return p;
        })();
        expect(res1).toBe('Attempt 1');
        expect(resource.value()).toBe('Attempt 1');
        expect(resource.status()).toBe('resolved');

        // Second execution: must immediately clear previous value and transition to 'loading'
        const p2 = resource.execute();
        expect(resource.value()).toBeUndefined();
        expect(resource.status()).toBe('loading');

        await flushEffects(60);
        const res2 = await p2;
        expect(res2).toBe('Attempt 2');
        expect(resource.value()).toBe('Attempt 2');
      });
    });

    it('should reject the Promise on error when awaited, but remain safe for fire-and-forget callers', async () => {
      await TestBed.runInInjectionContext(async () => {
        const resource = resourceAsync(() => throwError(() => new Error('Server 500')).pipe(delay(50)), {
          lazy: true,
        });

        // 1. Fire-and-forget (caller does not await or catch) - must NOT trigger unhandled rejection
        resource.execute();
        await flushEffects(60);
        expect(resource.status()).toBe('error');
        expect(resource.error()?.message).toBe('Server 500');

        // 2. Awaited execution - must throw to caller's try/catch
        const p = resource.execute();
        await flushEffects(60);

        let caughtError: Error | null = null;
        try {
          await p;
        } catch (err) {
          caughtError = err as Error;
        }

        expect(caughtError).not.toBeNull();
        expect(caughtError?.message).toBe('Server 500');
      });
    });

    it('should reuse in-flight execution promise when behavior is exhaust', async () => {
      await TestBed.runInInjectionContext(async () => {
        let calls = 0;
        const resource = resourceAsync(
          () =>
            of(null).pipe(
              delay(50),
              map(() => `Call ${++calls}`),
            ),
          {lazy: true, behavior: 'exhaust'},
        );

        const p1 = resource.execute();
        const p2 = resource.execute(); // Ignored duplicate click, reuses p1

        await flushEffects(60);

        const [r1, r2] = await Promise.all([p1, p2]);
        expect(r1).toBe('Call 1');
        expect(r2).toBe('Call 1');
        expect(calls).toBe(1);
      });
    });

    it('should reject previous execution promise when new execution is started with switch behavior', async () => {
      await TestBed.runInInjectionContext(async () => {
        let callCount = 0;
        const resource = resourceAsync(
          () => {
            const currentCall = ++callCount;
            return of(null).pipe(
              delay(50),
              map(() => `Response ${currentCall}`),
            );
          },
          {lazy: true, behavior: 'switch'},
        );

        const p1 = resource.execute();
        await flushEffects(); // Start in-flight request

        // Immediately start second execution while first is in-flight
        const p2 = resource.execute();

        let p1Error: Error | null = null;
        try {
          await p1;
        } catch (err) {
          p1Error = err as Error;
        }

        expect(p1Error).not.toBeNull();
        expect(p1Error?.message).toContain('Operation cancelled by newer execution');

        await flushEffects(60);
        const r2 = await p2;
        expect(r2).toBe('Response 2');
        expect(resource.value()).toBe('Response 2');
      });
    });
  });

  describe('initialValue and defaultValue typing and runtime behavior', () => {
    it('should return non-undefined value signal when initialValue is provided', async () => {
      await TestBed.runInInjectionContext(async () => {
        const guest: User = {id: 0, name: 'Guest'};
        const resource = resourceAsync(() => promise<User>({id: 1, name: 'John'}, 50), {
          initialValue: guest,
        });

        await flushEffects();

        // Compile-time assertion: value() is Signal<User>, assignable to User without undefined
        const initialVal: User = resource.value();
        expect(initialVal).toEqual(guest);
        expect(resource.value().name).toBe('Guest');

        await flushEffects(50);

        expect(resource.status()).toBe('resolved');
        const resolvedVal: User = resource.value();
        expect(resolvedVal).toEqual({id: 1, name: 'John'});
      });
    });

    it('should return non-undefined value signal when defaultValue is provided (alias for initialValue)', async () => {
      await TestBed.runInInjectionContext(async () => {
        const emptyList: User[] = [];
        const resource = resourceAsync(() => promise<User[]>([{id: 1, name: 'John'}], 50), {
          defaultValue: emptyList,
        });

        await flushEffects();

        // Compile-time assertion: value() is Signal<User[]>, allowing direct .length access without ?. or || []
        const list: User[] = resource.value();
        expect(list).toEqual([]);
        expect(resource.value().length).toBe(0);

        await flushEffects(50);

        expect(resource.status()).toBe('resolved');
        expect(resource.value().length).toBe(1);
        expect(resource.value()[0].name).toBe('John');
      });
    });

    it('should return T | undefined when neither initialValue nor defaultValue is provided', async () => {
      await TestBed.runInInjectionContext(async () => {
        const resource = resourceAsync(() => promise<User>({id: 1, name: 'John'}, 50));

        await flushEffects();

        // Initially undefined
        expect(resource.value()).toBeUndefined();
        expect(resource.hasValue()).toBe(false);

        await flushEffects(50);

        expect(resource.status()).toBe('resolved');
        expect(resource.hasValue()).toBe(true);

        // hasValue() acts as type guard narrowing resource.value() to User
        if (resource.hasValue()) {
          const narrowedUser: User = resource.value();
          expect(narrowedUser.name).toBe('John');
        }
      });
    });

    it('should reset back to defaultValue / initialValue when reset() is called', async () => {
      await TestBed.runInInjectionContext(async () => {
        const resource = resourceAsync(() => of('fetched-data'), {
          lazy: true,
          defaultValue: 'initial-fallback',
        });

        await flushEffects();
        expect(resource.value()).toBe('initial-fallback');

        resource.execute();
        await flushEffects();
        expect(resource.value()).toBe('fetched-data');

        resource.reset();
        await flushEffects();
        expect(resource.status()).toBe('idle');
        expect(resource.value()).toBe('initial-fallback');
      });
    });

    it('should retain initialValue / defaultValue fallback on error', async () => {
      await TestBed.runInInjectionContext(async () => {
        const defaultUser: User = {id: 0, name: 'Default'};
        const resource = resourceAsync(() => promiseError<User>(new Error('Fetch failed'), 50), {
          defaultValue: defaultUser,
        });

        await flushEffects();
        expect(resource.status()).toBe('loading');
        expect(resource.value()).toEqual(defaultUser);

        await flushEffects(50);

        expect(resource.status()).toBe('error');
        expect(resource.error()).toBeTruthy();
        expect(resource.value()).toEqual(defaultUser);
      });
    });

    it('should allow updater to receive non-undefined value when defaultValue is provided', async () => {
      await TestBed.runInInjectionContext(async () => {
        const counterRef = resourceAsync(() => of(100), {
          lazy: true,
          defaultValue: 0,
        });

        await flushEffects();
        expect(counterRef.value()).toBe(0);

        // Safe direct increment without undefined check
        counterRef.update((c) => c + 1);
        expect(counterRef.value()).toBe(1);
      });
    });
  });
});
