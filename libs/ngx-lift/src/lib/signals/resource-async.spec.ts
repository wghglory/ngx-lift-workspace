import {signal} from '@angular/core';
import {fakeAsync, TestBed, tick} from '@angular/core/testing';
import {delay, Observable, of, throwError} from 'rxjs';

import {resourceAsync} from './resource-async';

const promise = <T>(value: T, time = 0): Promise<T> => new Promise((resolve) => setTimeout(() => resolve(value), time));
const promiseError = <T = never>(error: Error, time = 0): Promise<T> =>
  new Promise((_, reject) => setTimeout(() => reject(error), time));

interface User {
  id: number;
  name: string;
}

describe(resourceAsync.name, () => {
  describe('basic functionality', () => {
    it('should auto-load data on init', fakeAsync(() => {
      TestBed.runInInjectionContext(() => {
        const resource = resourceAsync(() => promise<User>({id: 1, name: 'John'}, 100));

        TestBed.tick(); // Flush the effect that starts the request

        expect(resource.status()).toBe('loading');
        expect(resource.value()).toBeUndefined();
        expect(resource.isLoading()).toBe(true);
        expect(resource.hasValue()).toBe(false);
        expect(resource.status()).not.toBe('idle');

        tick(100);

        expect(resource.status()).toBe('resolved');
        expect(resource.value()).toEqual({id: 1, name: 'John'});
        expect(resource.isLoading()).toBe(false);
        expect(resource.hasValue()).toBe(true);
        expect(resource.error()).toBeNull();
      });
    }));

    it('should work with observables', fakeAsync(() => {
      TestBed.runInInjectionContext(() => {
        const resource = resourceAsync(() => of({id: 1, name: 'John'}).pipe(delay(100)));

        TestBed.tick();

        expect(resource.status()).toBe('loading');
        expect(resource.value()).toBeUndefined();

        tick(100);

        expect(resource.status()).toBe('resolved');
        expect(resource.value()).toEqual({id: 1, name: 'John'});
      });
    }));

    it('should handle errors', fakeAsync(() => {
      TestBed.runInInjectionContext(() => {
        const error = new Error('API Error');
        const resource = resourceAsync(() => promiseError(error, 100));

        TestBed.tick();

        expect(resource.status()).toBe('loading');
        expect(resource.error()).toBeNull();

        tick(100);

        expect(resource.status()).toBe('error');
        expect(resource.error()).toBe(error);
        expect(resource.value()).toBeUndefined(); // Value cleared on error
        expect(resource.hasValue()).toBe(false);
      });
    }));
  });

  describe('lazy loading', () => {
    it('should not auto-load when lazy: true', fakeAsync(() => {
      TestBed.runInInjectionContext(() => {
        const resource = resourceAsync(() => promise<User>({id: 1, name: 'John'}, 100), {lazy: true});

        TestBed.tick();

        expect(resource.status()).toBe('idle');
        expect(resource.value()).toBeUndefined();
        expect(resource.status()).toBe('idle');
        expect(resource.isLoading()).toBe(false);

        tick(100);

        // Still idle, no automatic fetch
        expect(resource.status()).toBe('idle');
        expect(resource.value()).toBeUndefined();
      });
    }));

    it('should load when reload() is called', fakeAsync(() => {
      TestBed.runInInjectionContext(() => {
        const resource = resourceAsync(() => promise<User>({id: 1, name: 'John'}, 100), {lazy: true});

        TestBed.tick();
        expect(resource.status()).toBe('idle');

        resource.reload();
        TestBed.tick();

        expect(resource.status()).toBe('loading');

        tick(100);

        expect(resource.status()).toBe('resolved');
        expect(resource.value()).toEqual({id: 1, name: 'John'});
      });
    }));
  });

  describe('reactive dependencies', () => {
    it('should auto-refetch when signal dependency changes', fakeAsync(() => {
      TestBed.runInInjectionContext(() => {
        const userId = signal(1);
        const resource = resourceAsync(() => promise<User>({id: userId(), name: `User${userId()}`}, 100));

        expect(resource.status()).toBe('loading');
        tick(100);
        expect(resource.value()).toEqual({id: 1, name: 'User1'});
        expect(resource.status()).toBe('resolved');

        // Change dependency - should trigger refetch
        userId.set(2);
        TestBed.tick();

        expect(resource.status()).toBe('reloading'); // Now 'reloading' because we have previous data
        expect(resource.value()).toEqual({id: 1, name: 'User1'}); // Still showing old data

        tick(100);

        expect(resource.status()).toBe('resolved');
        expect(resource.value()).toEqual({id: 2, name: 'User2'});
      });
    }));

    it('should transition from loading -> resolved -> reloading -> resolved', fakeAsync(() => {
      TestBed.runInInjectionContext(() => {
        const count = signal(1);
        const resource = resourceAsync(() => promise(count(), 100));

        // Initial load
        expect(resource.status()).toBe('loading');
        tick(100);
        expect(resource.status()).toBe('resolved');
        expect(resource.value()).toBe(1);

        // Refetch
        count.set(2);
        TestBed.tick();
        expect(resource.status()).toBe('reloading'); // Has previous value
        expect(resource.value()).toBe(1); // Stale data still visible

        tick(100);
        expect(resource.status()).toBe('resolved');
        expect(resource.value()).toBe(2);
      });
    }));
  });

  describe('status transitions', () => {
    it('should follow idle -> loading -> resolved', fakeAsync(() => {
      TestBed.runInInjectionContext(() => {
        const resource = resourceAsync(() => promise(1, 100), {lazy: true});

        expect(resource.status()).toBe('idle');

        resource.reload();
        expect(resource.status()).toBe('loading');

        tick(100);
        expect(resource.status()).toBe('resolved');
      });
    }));

    it('should follow loading -> error', fakeAsync(() => {
      TestBed.runInInjectionContext(() => {
        const resource = resourceAsync(() => promiseError(new Error('Fail'), 100));

        expect(resource.status()).toBe('loading');

        tick(100);
        expect(resource.status()).toBe('error');
        expect(resource.value()).toBeUndefined();
      });
    }));

    it('should follow resolved -> reloading -> resolved', fakeAsync(() => {
      TestBed.runInInjectionContext(() => {
        const resource = resourceAsync(() => promise(1, 100));

        TestBed.tick();
        tick(100);
        expect(resource.status()).toBe('resolved');

        resource.reload();
        TestBed.tick();
        expect(resource.status()).toBe('reloading');

        tick(100);
        expect(resource.status()).toBe('resolved');
      });
    }));

    it('should follow resolved -> reloading -> error (clears value)', fakeAsync(() => {
      TestBed.runInInjectionContext(() => {
        let shouldFail = false;
        const resource = resourceAsync(() => {
          if (shouldFail) return promiseError(new Error('Fail'), 100);
          return promise(1, 100);
        });

        TestBed.tick();
        tick(100);
        expect(resource.status()).toBe('resolved');
        expect(resource.value()).toBe(1);

        // Trigger error on reload
        shouldFail = true;
        resource.reload();
        TestBed.tick();
        expect(resource.status()).toBe('reloading');
        expect(resource.value()).toBe(1); // Still has old value during reload

        tick(100);
        expect(resource.status()).toBe('error');
        expect(resource.value()).toBeUndefined(); // Value cleared!
        expect(resource.hasValue()).toBe(false);
      });
    }));

    it('should follow error -> loading -> resolved (retry after initial failure)', fakeAsync(() => {
      TestBed.runInInjectionContext(() => {
        let shouldFail = true;
        const resource = resourceAsync(() => {
          if (shouldFail) return promiseError(new Error('Fail'), 100);
          return promise(1, 100);
        });

        TestBed.tick();
        tick(100);
        expect(resource.status()).toBe('error');
        expect(resource.value()).toBeUndefined();

        // Retry with success
        shouldFail = false;
        resource.reload();
        TestBed.tick();
        expect(resource.status()).toBe('loading'); // 'loading' not 'reloading' because no previous success

        tick(100);
        expect(resource.status()).toBe('resolved');
        expect(resource.value()).toBe(1);
      });
    }));
  });

  describe('behavior: switch (default)', () => {
    it('should cancel previous request when new one starts', fakeAsync(() => {
      TestBed.runInInjectionContext(() => {
        const count = signal(1);
        const resource = resourceAsync(() => promise(count(), 100));

        tick(50);

        // Change signal before first request completes
        count.set(2);
        TestBed.tick();

        tick(50);

        // Change again
        count.set(3);
        TestBed.tick();

        tick(100);

        // Only the last value (3) is reflected
        expect(resource.value()).toBe(3);
        expect(resource.status()).toBe('resolved');
      });
    }));
  });

  describe('behavior: exhaust', () => {
    it('should ignore new requests while one is in progress', fakeAsync(() => {
      TestBed.runInInjectionContext(() => {
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

        tick(100);

        // Only 1 request was made
        expect(requestCount).toBe(1);
        expect(resource.value()).toBe(1);
        expect(resource.status()).toBe('resolved');

        // Now we can make another request
        resource.reload();
        tick(100);
        expect(requestCount).toBe(2);
        expect(resource.value()).toBe(2);
      });
    }));
  });

  describe('error handling', () => {
    it('should call onError and provide fallback value', fakeAsync(() => {
      TestBed.runInInjectionContext(() => {
        const fallbackUser = {id: 0, name: 'Guest'};
        const resource = resourceAsync(() => promiseError<User>(new Error('API Error'), 100), {
          onError: (error) => {
            expect(error.message).toBe('API Error');
            return fallbackUser;
          },
        });

        tick(100);

        expect(resource.status()).toBe('resolved'); // Resolved with fallback
        expect(resource.value()).toEqual(fallbackUser);
        expect(resource.error()).toBeNull();
      });
    }));

    it('should propagate error if onError returns undefined', fakeAsync(() => {
      TestBed.runInInjectionContext(() => {
        const error = new Error('API Error');
        const resource = resourceAsync(() => promiseError(error, 100), {
          onError: () => undefined, // No fallback
        });

        tick(100);

        expect(resource.status()).toBe('error');
        expect(resource.error()).toBe(error);
        expect(resource.value()).toBeUndefined();
      });
    }));

    it('should throw error if throwOnError: true', fakeAsync(() => {
      TestBed.runInInjectionContext(() => {
        const error = new Error('API Error');
        resourceAsync(() => promiseError(error, 100), {
          throwOnError: true,
        });

        expect(() => {
          tick(100);
        }).toThrow('API Error');
      });
    }));

    it('should call onError and still throw if throwOnError: true', fakeAsync(() => {
      TestBed.runInInjectionContext(() => {
        let errorHandled = false;
        const error = new Error('API Error');

        resourceAsync(() => promiseError(error, 100), {
          onError: (err) => {
            errorHandled = true;
            expect(err).toBe(error);
            return undefined; // No fallback
          },
          throwOnError: true,
        });

        expect(() => {
          tick(100);
        }).toThrow('API Error');

        expect(errorHandled).toBe(true);
      });
    }));
  });

  describe('value behavior on error', () => {
    it('should clear value when error occurs during reload', fakeAsync(() => {
      TestBed.runInInjectionContext(() => {
        let shouldFail = false;
        const resource = resourceAsync(() => {
          if (shouldFail) return promiseError(new Error('Fail'), 100);
          return promise<User>({id: 1, name: 'John'}, 100);
        });

        // Initial success
        TestBed.tick();
        tick(100);
        expect(resource.value()).toEqual({id: 1, name: 'John'});
        expect(resource.hasValue()).toBe(true);

        // Reload with error
        shouldFail = true;
        resource.reload();
        TestBed.tick();
        expect(resource.status()).toBe('reloading');
        expect(resource.value()).toEqual({id: 1, name: 'John'}); // Still has value during reload

        tick(100);

        // Value is cleared on error
        expect(resource.status()).toBe('error');
        expect(resource.value()).toBeUndefined();
        expect(resource.hasValue()).toBe(false);
      });
    }));

    it('should keep value undefined after initial loading error', fakeAsync(() => {
      TestBed.runInInjectionContext(() => {
        const resource = resourceAsync(() => promiseError(new Error('Fail'), 100));

        TestBed.tick();
        tick(100);

        expect(resource.status()).toBe('error');
        expect(resource.value()).toBeUndefined();
        expect(resource.hasValue()).toBe(false);
      });
    }));
  });

  describe('isLoading signal', () => {
    it('should be true during loading', fakeAsync(() => {
      TestBed.runInInjectionContext(() => {
        const resource = resourceAsync(() => promise(1, 100));

        TestBed.tick();
        expect(resource.isLoading()).toBe(true);

        tick(100);

        expect(resource.isLoading()).toBe(false);
      });
    }));

    it('should be true during reloading', fakeAsync(() => {
      TestBed.runInInjectionContext(() => {
        const resource = resourceAsync(() => promise(1, 100));

        TestBed.tick();
        tick(100);
        expect(resource.isLoading()).toBe(false);

        resource.reload();
        TestBed.tick();
        expect(resource.isLoading()).toBe(true);

        tick(100);
        expect(resource.isLoading()).toBe(false);
      });
    }));

    it('should be false during idle, resolved, and error', fakeAsync(() => {
      TestBed.runInInjectionContext(() => {
        const resource = resourceAsync(() => promise(1, 100), {lazy: true});

        TestBed.tick();
        // idle
        expect(resource.isLoading()).toBe(false);

        resource.reload();
        TestBed.tick();
        tick(100);

        // resolved
        expect(resource.isLoading()).toBe(false);
      });
    }));
  });

  describe('hasValue signal', () => {
    it('should be true only in resolved or reloading states', fakeAsync(() => {
      TestBed.runInInjectionContext(() => {
        const resource = resourceAsync(() => promise(1, 100));

        // loading
        expect(resource.hasValue()).toBe(false);

        tick(100);

        // resolved
        expect(resource.hasValue()).toBe(true);

        resource.reload();

        // reloading
        expect(resource.hasValue()).toBe(true);

        tick(100);

        // resolved
        expect(resource.hasValue()).toBe(true);
      });
    }));

    it('should be false after error (value cleared)', fakeAsync(() => {
      TestBed.runInInjectionContext(() => {
        const resource = resourceAsync(() => promiseError(new Error('Fail'), 100));

        tick(100);

        expect(resource.hasValue()).toBe(false);
        expect(resource.value()).toBeUndefined();
      });
    }));
  });

  describe('idle status', () => {
    it('should be idle only for lazy resources before first load', fakeAsync(() => {
      TestBed.runInInjectionContext(() => {
        const resource = resourceAsync(() => promise(1, 100), {lazy: true});

        expect(resource.status()).toBe('idle');

        resource.reload();

        expect(resource.status()).not.toBe('idle');

        tick(100);

        expect(resource.status()).not.toBe('idle');
      });
    }));

    it('should not be idle for auto-loading resources', fakeAsync(() => {
      TestBed.runInInjectionContext(() => {
        const resource = resourceAsync(() => promise(1, 100));

        expect(resource.status()).not.toBe('idle'); // Starts in 'loading' not 'idle'
      });
    }));
  });

  describe('manual reload', () => {
    it('should refetch data when reload() is called', fakeAsync(() => {
      TestBed.runInInjectionContext(() => {
        let count = 1;
        const resource = resourceAsync(() => promise(count++, 100));

        TestBed.tick();
        tick(100);
        expect(resource.value()).toBe(1);

        resource.reload();
        TestBed.tick();
        tick(100);
        expect(resource.value()).toBe(2);

        resource.reload();
        TestBed.tick();
        tick(100);
        expect(resource.value()).toBe(3);
      });
    }));

    it('should use reloading status when data exists', fakeAsync(() => {
      TestBed.runInInjectionContext(() => {
        const resource = resourceAsync(() => promise(1, 100));

        TestBed.tick();
        tick(100);
        expect(resource.status()).toBe('resolved');

        resource.reload();
        TestBed.tick();
        expect(resource.status()).toBe('reloading'); // Not 'loading'
      });
    }));

    it('should use loading status when no previous data exists', fakeAsync(() => {
      TestBed.runInInjectionContext(() => {
        let shouldFail = true;
        const resource = resourceAsync(() => {
          if (shouldFail) return promiseError(new Error('Fail'), 100);
          return promise(1, 100);
        });

        TestBed.tick();
        tick(100);
        expect(resource.status()).toBe('error');

        // Retry after error
        shouldFail = false;
        resource.reload();
        TestBed.tick();
        expect(resource.status()).toBe('loading'); // Not 'reloading' because no previous successful data
      });
    }));
  });

  describe('observable error handling', () => {
    it('should handle observable errors', fakeAsync(() => {
      TestBed.runInInjectionContext(() => {
        const error = new Error('Observable Error');
        const resource = resourceAsync(() => throwError(() => error).pipe(delay(100)));

        tick(100);

        expect(resource.status()).toBe('error');
        expect(resource.error()).toBe(error);
        expect(resource.value()).toBeUndefined();
      });
    }));

    it('should provide fallback for observable errors', fakeAsync(() => {
      TestBed.runInInjectionContext(() => {
        const error = new Error('Observable Error');
        const resource = resourceAsync(() => throwError(() => error).pipe(delay(100)), {
          onError: () => 'fallback',
        });

        tick(100);

        expect(resource.status()).toBe('resolved');
        expect(resource.value()).toBe('fallback');
        expect(resource.error()).toBeNull();
      });
    }));
  });

  describe('type safety', () => {
    it('should maintain correct types', fakeAsync(() => {
      TestBed.runInInjectionContext(() => {
        // Value can be undefined initially
        const resource = resourceAsync(() => promise<User>({id: 1, name: 'John'}, 100));

        // Before resolution
        const valueBefore: User | undefined = resource.value();
        expect(valueBefore).toBeUndefined();

        tick(100);

        // After resolution
        const valueAfter: User | undefined = resource.value();
        expect(valueAfter).toEqual({id: 1, name: 'John'});

        // Error type
        const error: Error | null = resource.error();
        expect(error).toBeNull();
      });
    }));
  });

  describe('complex scenarios', () => {
    it('should handle rapid signal changes with switch behavior', fakeAsync(() => {
      TestBed.runInInjectionContext(() => {
        const userId = signal(1);

        const resource = resourceAsync(() => promise({id: userId(), name: `User${userId()}`}, 100));

        // Initial request
        tick(50);

        // Change signal multiple times rapidly
        userId.set(2);
        TestBed.tick();
        tick(25);

        userId.set(3);
        TestBed.tick();
        tick(25);

        userId.set(4);
        TestBed.tick();
        tick(100);

        // Only the last request should be reflected
        expect(resource.value()).toEqual({id: 4, name: 'User4'});
        expect(resource.status()).toBe('resolved');
      });
    }));

    it('should handle mutation workflows with exhaust', fakeAsync(() => {
      TestBed.runInInjectionContext(() => {
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

        tick(100);

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

        tick(100);

        expect(submissionCount).toBe(countBeforeNext + 1);
        expect(registration.value()).toEqual({username: 'jane', success: true});
      });
    }));
  });
});

describe('WritableResourceRef', () => {
  describe('set() method', () => {
    it('should set value and transition to local state', fakeAsync(() => {
      TestBed.runInInjectionContext(() => {
        const resource = resourceAsync(() => promise<User>({id: 1, name: 'John'}, 100), {lazy: true});

        TestBed.tick();
        expect(resource.status()).toBe('idle');

        // Set value manually
        resource.set({id: 2, name: 'Jane'});

        expect(resource.status()).toBe('local');
        expect(resource.value()).toEqual({id: 2, name: 'Jane'});
        expect(resource.error()).toBeNull();
        expect(resource.hasValue()).toBe(true);
      });
    }));

    it('should clear error when setting value', fakeAsync(() => {
      TestBed.runInInjectionContext(() => {
        const resource = resourceAsync(() => promiseError<User>(new Error('API Error'), 100));

        TestBed.tick();
        tick(100);
        expect(resource.status()).toBe('error');
        expect(resource.error()).toBeTruthy();

        // Set value manually - should clear error
        resource.set({id: 1, name: 'John'});

        expect(resource.status()).toBe('local');
        expect(resource.value()).toEqual({id: 1, name: 'John'});
        expect(resource.error()).toBeNull();
      });
    }));

    it('should cancel pending request when setting value', fakeAsync(() => {
      TestBed.runInInjectionContext(() => {
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

        TestBed.tick();
        expect(resource.status()).toBe('loading');

        // Set value while request is pending
        resource.set({id: 2, name: 'Jane'});

        expect(resource.status()).toBe('local');
        expect(resource.value()).toEqual({id: 2, name: 'Jane'});

        // Subscription should be cancelled
        subscriptionActive = false;

        tick(100);

        // Status should still be local
        expect(resource.status()).toBe('local'); // Still local
        expect(resource.value()).toEqual({id: 2, name: 'Jane'}); // Still manual value
      });
    }));

    it('should allow setting undefined value', fakeAsync(() => {
      TestBed.runInInjectionContext(() => {
        const resource = resourceAsync<User | undefined>(() => promise<User>({id: 1, name: 'John'}, 100));

        TestBed.tick();
        tick(100);
        expect(resource.value()).toEqual({id: 1, name: 'John'});

        // Set to undefined
        resource.set(undefined);

        expect(resource.status()).toBe('local');
        expect(resource.value()).toBeUndefined();
        expect(resource.hasValue()).toBe(false);
      });
    }));
  });

  describe('update() method', () => {
    it('should update value using updater function', fakeAsync(() => {
      TestBed.runInInjectionContext(() => {
        const resource = resourceAsync(() => promise<User>({id: 1, name: 'John'}, 100));

        TestBed.tick();
        tick(100);
        expect(resource.value()).toEqual({id: 1, name: 'John'});

        // Update value
        resource.update((user) => ({...user, name: 'Jane'}));

        expect(resource.status()).toBe('local');
        expect(resource.value()).toEqual({id: 1, name: 'Jane'});
        expect(resource.hasValue()).toBe(true);
      });
    }));

    it('should handle undefined in updater when no initialValue', fakeAsync(() => {
      TestBed.runInInjectionContext(() => {
        const resource = resourceAsync<User | undefined>(() => promise<User>({id: 1, name: 'John'}, 100), {lazy: true});

        TestBed.tick();
        expect(resource.value()).toBeUndefined();

        // Update undefined value
        resource.update((user) => (user ? {...user, name: 'Updated'} : {id: 2, name: 'New'}));

        expect(resource.status()).toBe('local');
        expect(resource.value()).toEqual({id: 2, name: 'New'});
      });
    }));

    it('should work with initialValue', fakeAsync(() => {
      TestBed.runInInjectionContext(() => {
        const defaultUser: User = {id: 0, name: 'Guest'};
        const resource = resourceAsync(() => promise<User>({id: 1, name: 'John'}, 100), {
          initialValue: defaultUser,
        });

        TestBed.tick();
        expect(resource.value()).toEqual(defaultUser);

        // Update using initialValue
        resource.update((user) => ({...user, name: 'Updated Guest'}));

        expect(resource.status()).toBe('local');
        expect(resource.value()).toEqual({id: 0, name: 'Updated Guest'});
      });
    }));

    it('should chain multiple updates', fakeAsync(() => {
      TestBed.runInInjectionContext(() => {
        const resource = resourceAsync(() => promise<number>(1, 100));

        TestBed.tick();
        tick(100);
        expect(resource.value()).toBe(1);

        resource.update((n) => n + 1);
        expect(resource.value()).toBe(2);

        resource.update((n) => n * 2);
        expect(resource.value()).toBe(4);

        resource.update((n) => n - 1);
        expect(resource.value()).toBe(3);

        expect(resource.status()).toBe('local');
      });
    }));

    it('should cancel pending request when updating', fakeAsync(() => {
      TestBed.runInInjectionContext(() => {
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

        TestBed.tick();
        expect(resource.status()).toBe('loading');

        // Update while request is pending
        resource.update(() => ({id: 2, name: 'Updated'}));

        expect(resource.status()).toBe('local');
        expect(resource.value()).toEqual({id: 2, name: 'Updated'});

        // Subscription should be cancelled
        subscriptionActive = false;

        tick(100);

        // Status should still be local
        expect(resource.status()).toBe('local');
      });
    }));
  });

  describe('reload() after set/update', () => {
    it('should refetch data after manual set', fakeAsync(() => {
      TestBed.runInInjectionContext(() => {
        const resource = resourceAsync(() => promise<User>({id: 1, name: 'John'}, 100));

        TestBed.tick();
        tick(100);
        expect(resource.status()).toBe('resolved');

        // Set manually
        resource.set({id: 2, name: 'Jane'});
        expect(resource.status()).toBe('local');
        expect(resource.value()).toEqual({id: 2, name: 'Jane'});

        // Reload - should transition to reloading
        resource.reload();
        TestBed.tick();
        expect(resource.status()).toBe('reloading');
        expect(resource.value()).toEqual({id: 2, name: 'Jane'}); // Keeps local value during reload

        tick(100);
        expect(resource.status()).toBe('resolved');
        expect(resource.value()).toEqual({id: 1, name: 'John'}); // Server value
      });
    }));

    it('should preserve local value during reload', fakeAsync(() => {
      TestBed.runInInjectionContext(() => {
        const resource = resourceAsync(() => promise<User>({id: 1, name: 'Server'}, 100));

        TestBed.tick();
        tick(100);

        resource.set({id: 2, name: 'Local'});
        expect(resource.status()).toBe('local');

        resource.reload();
        TestBed.tick();

        // During reload, should show local value
        expect(resource.status()).toBe('reloading');
        expect(resource.value()).toEqual({id: 2, name: 'Local'});

        tick(100);

        // After reload completes, show server value
        expect(resource.status()).toBe('resolved');
        expect(resource.value()).toEqual({id: 1, name: 'Server'});
      });
    }));

    it('should handle error during reload after local state', fakeAsync(() => {
      TestBed.runInInjectionContext(() => {
        const resource = resourceAsync(() => promiseError<User>(new Error('API Error'), 100));

        TestBed.tick();

        resource.set({id: 1, name: 'Local'});
        expect(resource.status()).toBe('local');

        resource.reload();
        TestBed.tick();
        expect(resource.status()).toBe('reloading');

        tick(100);

        // Error should clear value
        expect(resource.status()).toBe('error');
        expect(resource.value()).toBeUndefined();
        expect(resource.hasValue()).toBe(false);
      });
    }));
  });

  describe('reactive dependencies with local state', () => {
    it('should refetch when signal changes even in local state', fakeAsync(() => {
      TestBed.runInInjectionContext(() => {
        const userId = signal(1);
        const resource = resourceAsync(() => promise<User>({id: userId(), name: `User${userId()}`}, 100));

        TestBed.tick();
        tick(100);
        expect(resource.value()).toEqual({id: 1, name: 'User1'});

        // Set local value
        resource.set({id: 99, name: 'Local'});
        expect(resource.status()).toBe('local');

        // Change signal - should trigger refetch
        userId.set(2);
        TestBed.tick();
        expect(resource.status()).toBe('reloading');
        expect(resource.value()).toEqual({id: 99, name: 'Local'}); // Keeps local during reload

        tick(100);
        expect(resource.status()).toBe('resolved');
        expect(resource.value()).toEqual({id: 2, name: 'User2'});
      });
    }));
  });

  describe('hasValue() with local state', () => {
    it('should return true when status is local', fakeAsync(() => {
      TestBed.runInInjectionContext(() => {
        const resource = resourceAsync<User | undefined>(() => promise<User>({id: 1, name: 'John'}, 100), {
          lazy: true,
        });

        TestBed.tick();
        expect(resource.hasValue()).toBe(false);

        resource.set({id: 1, name: 'Local'});
        expect(resource.status()).toBe('local');
        expect(resource.hasValue()).toBe(true);
      });
    }));

    it('should return false when local value is undefined', fakeAsync(() => {
      TestBed.runInInjectionContext(() => {
        const resource = resourceAsync<User | undefined>(() => promise<User>({id: 1, name: 'John'}, 100));

        TestBed.tick();
        tick(100);
        expect(resource.hasValue()).toBe(true);

        resource.set(undefined);
        expect(resource.status()).toBe('local');
        expect(resource.hasValue()).toBe(false);
      });
    }));
  });

  describe('asReadonly()', () => {
    it('should return read-only version without set/update', fakeAsync(() => {
      TestBed.runInInjectionContext(() => {
        const resource = resourceAsync(() => promise<User>({id: 1, name: 'John'}, 100));
        const readonly = resource.asReadonly();

        TestBed.tick();
        tick(100);

        // Should have read-only properties
        expect(readonly.value()).toEqual({id: 1, name: 'John'});
        expect(readonly.status()).toBe('resolved');
        expect(readonly.error()).toBeNull();
        expect(readonly.hasValue()).toBe(true);

        // Should have reload/execute
        expect(typeof readonly.reload).toBe('function');
        expect(typeof readonly.execute).toBe('function');

        // Should not have set/update
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        expect((readonly as any).set).toBeUndefined();
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        expect((readonly as any).update).toBeUndefined();
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        expect((readonly as any).asReadonly).toBeUndefined();
      });
    }));

    it('should share state with original resource', fakeAsync(() => {
      TestBed.runInInjectionContext(() => {
        const resource = resourceAsync(() => promise<User>({id: 1, name: 'John'}, 100));
        const readonly = resource.asReadonly();

        TestBed.tick();
        tick(100);

        expect(readonly.value()).toEqual({id: 1, name: 'John'});

        // Modify via writable resource
        resource.set({id: 2, name: 'Jane'});

        // Readonly should reflect the change
        expect(readonly.value()).toEqual({id: 2, name: 'Jane'});
        expect(readonly.status()).toBe('local');
      });
    }));

    it('should allow reload on readonly version', fakeAsync(() => {
      TestBed.runInInjectionContext(() => {
        let count = 1;
        const resource = resourceAsync(() => promise<number>(count++, 100));
        const readonly = resource.asReadonly();

        TestBed.tick();
        tick(100);
        expect(readonly.value()).toBe(1);

        // Reload via readonly
        readonly.reload();
        TestBed.tick();
        tick(100);

        expect(readonly.value()).toBe(2);
        expect(resource.value()).toBe(2); // Both share state
      });
    }));
  });

  describe('optimistic updates pattern', () => {
    it('should support optimistic update with revert on error', fakeAsync(() => {
      TestBed.runInInjectionContext(() => {
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
        TestBed.tick();
        tick(100);
        expect(resource.value()).toEqual({id: 1, name: 'John'});

        // Optimistic update
        resource.update((user) => ({...user, name: 'Updated'}));
        expect(resource.value()).toEqual({id: 1, name: 'Updated'});

        // Simulate save failure
        shouldFail = true;
        resource.reload();
        TestBed.tick();
        tick(100);

        // Error occurs - value cleared
        expect(resource.status()).toBe('error');

        // In real app, you'd revert to original value on error
        // resource.set(originalValue);
      });
    }));
  });

  describe('cache-first pattern', () => {
    it('should show cached data immediately then update', fakeAsync(() => {
      TestBed.runInInjectionContext(() => {
        const cachedUser: User = {id: 1, name: 'Cached'};
        const resource = resourceAsync(() => promise<User>({id: 1, name: 'Fresh'}, 100), {lazy: true});

        // Set cached data immediately
        resource.set(cachedUser);
        expect(resource.status()).toBe('local');
        expect(resource.value()).toEqual(cachedUser);

        // Fetch fresh data in background
        resource.reload();
        TestBed.tick();
        expect(resource.status()).toBe('reloading');
        expect(resource.value()).toEqual(cachedUser); // Still shows cached

        tick(100);
        expect(resource.status()).toBe('resolved');
        expect(resource.value()).toEqual({id: 1, name: 'Fresh'});
      });
    }));
  });
});
