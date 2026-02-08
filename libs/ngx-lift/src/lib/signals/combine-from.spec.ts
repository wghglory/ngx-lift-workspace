import {computed, signal} from '@angular/core';
import {fakeAsync, TestBed, tick} from '@angular/core/testing';
import {BehaviorSubject, delay, map, of} from 'rxjs';
import {pipe} from 'rxjs';

import {combineFrom} from './combine-from';

describe(combineFrom.name, () => {
  describe('array inputs', () => {
    it('should combine signals into an array', fakeAsync(() => {
      TestBed.runInInjectionContext(() => {
        const sig1 = signal(1);
        const sig2 = signal('hello');
        const sig3 = signal(true);

        const combined = combineFrom([sig1, sig2, sig3]);

        tick();
        expect(combined()).toEqual([1, 'hello', true]);

        sig1.set(2);
        tick();
        expect(combined()).toEqual([2, 'hello', true]);

        sig2.set('world');
        tick();
        expect(combined()).toEqual([2, 'world', true]);

        sig3.set(false);
        tick();
        expect(combined()).toEqual([2, 'world', false]);
      });
    }));

    it('should combine observables into an array', fakeAsync(() => {
      TestBed.runInInjectionContext(() => {
        const obs1$ = new BehaviorSubject(10);
        const obs2$ = new BehaviorSubject('test');

        const combined = combineFrom([obs1$, obs2$]);

        tick();
        expect(combined()).toEqual([10, 'test']);

        obs1$.next(20);
        tick();
        expect(combined()).toEqual([20, 'test']);

        obs2$.next('updated');
        tick();
        expect(combined()).toEqual([20, 'updated']);
      });
    }));

    it('should combine mixed signals and observables', fakeAsync(() => {
      TestBed.runInInjectionContext(() => {
        const sig = signal(5);
        const obs$ = new BehaviorSubject('data');

        const combined = combineFrom([sig, obs$]);

        tick();
        expect(combined()).toEqual([5, 'data']);

        sig.set(10);
        tick();
        expect(combined()).toEqual([10, 'data']);

        obs$.next('updated');
        tick();
        expect(combined()).toEqual([10, 'updated']);
      });
    }));

    it('should work with initialValue', () => {
      TestBed.runInInjectionContext(() => {
        const obs$ = of(1).pipe(delay(100));
        const sig = signal(2);

        const combined = combineFrom([obs$, sig], {initialValue: [0, 0]});

        expect(combined()).toEqual([0, 0]);
      });
    });

    it('should work with RxJS operators', fakeAsync(() => {
      TestBed.runInInjectionContext(() => {
        const sig1 = signal(2);
        const sig2 = signal(3);

        const combined = combineFrom([sig1, sig2], pipe(map(([a, b]: [number, number]) => a * b)));

        tick();
        expect(combined()).toBe(6);

        sig1.set(4);
        tick();
        expect(combined()).toBe(12);

        sig2.set(5);
        tick();
        expect(combined()).toBe(20);
      });
    }));

    it('should work with operator and initialValue', fakeAsync(() => {
      TestBed.runInInjectionContext(() => {
        const obs$ = of(2).pipe(delay(100));
        const sig = signal(3);

        const combined = combineFrom([obs$, sig], pipe(map(([a, b]: [number, number]) => a + b)), {initialValue: 0});

        expect(combined()).toBe(0);

        tick(100);
        expect(combined()).toBe(5);
      });
    }));
  });

  describe('object inputs', () => {
    it('should combine signals into an object', fakeAsync(() => {
      TestBed.runInInjectionContext(() => {
        const name = signal('John');
        const age = signal(30);
        const active = signal(true);

        const combined = combineFrom({name, age, active});

        tick();
        expect(combined()).toEqual({name: 'John', age: 30, active: true});

        name.set('Jane');
        tick();
        expect(combined()).toEqual({name: 'Jane', age: 30, active: true});

        age.set(25);
        tick();
        expect(combined()).toEqual({name: 'Jane', age: 25, active: true});
      });
    }));

    it('should combine observables into an object', fakeAsync(() => {
      TestBed.runInInjectionContext(() => {
        const count$ = new BehaviorSubject(1);
        const text$ = new BehaviorSubject('hello');

        const combined = combineFrom({count: count$, text: text$});

        tick();
        expect(combined()).toEqual({count: 1, text: 'hello'});

        count$.next(2);
        tick();
        expect(combined()).toEqual({count: 2, text: 'hello'});

        text$.next('world');
        tick();
        expect(combined()).toEqual({count: 2, text: 'world'});
      });
    }));

    it('should combine mixed signals and observables into object', fakeAsync(() => {
      TestBed.runInInjectionContext(() => {
        const userId = signal(123);
        const userData$ = new BehaviorSubject({name: 'Alice'});

        const combined = combineFrom({userId, userData: userData$});

        tick();
        expect(combined()).toEqual({userId: 123, userData: {name: 'Alice'}});

        userId.set(456);
        tick();
        expect(combined()).toEqual({userId: 456, userData: {name: 'Alice'}});

        userData$.next({name: 'Bob'});
        tick();
        expect(combined()).toEqual({userId: 456, userData: {name: 'Bob'}});
      });
    }));

    it('should work with initialValue', () => {
      TestBed.runInInjectionContext(() => {
        const obs$ = of(100).pipe(delay(100));
        const sig = signal('test');

        const combined = combineFrom({value: obs$, label: sig}, {initialValue: {value: 0, label: ''}});

        expect(combined()).toEqual({value: 0, label: ''});
      });
    });

    it('should work with RxJS operators', fakeAsync(() => {
      TestBed.runInInjectionContext(() => {
        const firstName = signal('John');
        const lastName = signal('Doe');

        const combined = combineFrom(
          {firstName, lastName},
          pipe(map(({firstName, lastName}: {firstName: string; lastName: string}) => `${firstName} ${lastName}`)),
        );

        tick();
        expect(combined()).toBe('John Doe');

        firstName.set('Jane');
        tick();
        expect(combined()).toBe('Jane Doe');

        lastName.set('Smith');
        tick();
        expect(combined()).toBe('Jane Smith');
      });
    }));
  });

  describe('computed signals', () => {
    it('should work with computed signals', fakeAsync(() => {
      TestBed.runInInjectionContext(() => {
        const count = signal(5);
        const doubled = computed(() => count() * 2);

        const combined = combineFrom([count, doubled]);

        tick();
        expect(combined()).toEqual([5, 10]);

        count.set(10);
        tick();
        expect(combined()).toEqual([10, 20]);
      });
    }));

    it('should work with computed in object', fakeAsync(() => {
      TestBed.runInInjectionContext(() => {
        const price = signal(100);
        const tax = computed(() => price() * 0.1);
        const total = computed(() => price() + tax());

        const combined = combineFrom({price, tax, total});

        tick();
        expect(combined()).toEqual({price: 100, tax: 10, total: 110});

        price.set(200);
        tick();
        expect(combined()).toEqual({price: 200, tax: 20, total: 220});
      });
    }));
  });

  describe('function inputs', () => {
    it('should support function as input', fakeAsync(() => {
      TestBed.runInInjectionContext(() => {
        const sig = signal(5);
        const fn = () => 10;

        const combined = combineFrom([sig, fn]);

        tick();
        expect(combined()).toEqual([5, 10]);

        sig.set(15);
        tick();
        expect(combined()).toEqual([15, 10]);
      });
    }));

    it('should support reactive function', fakeAsync(() => {
      TestBed.runInInjectionContext(() => {
        const count = signal(3);
        const multiplier = () => count() * 2;

        const combined = combineFrom([count, multiplier]);

        tick();
        expect(combined()).toEqual([3, 6]);

        count.set(5);
        tick();
        expect(combined()).toEqual([5, 10]);
      });
    }));
  });

  describe('edge cases', () => {
    it('should handle empty array', fakeAsync(() => {
      TestBed.runInInjectionContext(() => {
        const combined = combineFrom([], {initialValue: []});

        tick();
        expect(combined()).toEqual([]);
      });
    }));

    it('should handle single signal', fakeAsync(() => {
      TestBed.runInInjectionContext(() => {
        const sig = signal(42);

        const combined = combineFrom([sig]);

        tick();
        expect(combined()).toEqual([42]);

        sig.set(100);
        tick();
        expect(combined()).toEqual([100]);
      });
    }));

    it('should handle undefined initialValue', () => {
      TestBed.runInInjectionContext(() => {
        const obs$ = of(1).pipe(delay(100));

        const combined = combineFrom([obs$], {initialValue: undefined});

        expect(combined()).toBeUndefined();
      });
    });

    it('should handle null initialValue', () => {
      TestBed.runInInjectionContext(() => {
        const obs$ = of(1).pipe(delay(100));

        const combined = combineFrom([obs$], {initialValue: null});

        expect(combined()).toBeNull();
      });
    });

    it('should throw error when no sources provided', () => {
      TestBed.runInInjectionContext(() => {
        expect(() => {
          // @ts-expect-error testing invalid input
          combineFrom();
        }).toThrow(TypeError);
      });
    });

    it('should throw error when sources is not an object', () => {
      TestBed.runInInjectionContext(() => {
        expect(() => {
          combineFrom(123);
        }).toThrow(TypeError);
      });
    });

    it('should throw error when 3 args without operator', () => {
      TestBed.runInInjectionContext(() => {
        const sig = signal(1);
        expect(() => {
          // @ts-expect-error testing invalid input
          combineFrom([sig], {initialValue: 0}, {});
        }).toThrow(TypeError);
      });
    });
  });

  describe('reactivity', () => {
    it('should emit when any signal changes', fakeAsync(() => {
      TestBed.runInInjectionContext(() => {
        const sig1 = signal(1);
        const sig2 = signal(2);
        const sig3 = signal(3);

        const combined = combineFrom([sig1, sig2, sig3]);

        const results: number[][] = [];
        const stop = computed(() => {
          const val = combined();
          if (val) results.push([...val]);
        });

        tick();
        stop(); // Trigger initial computation
        expect(results).toEqual([[1, 2, 3]]);

        sig1.set(10);
        tick();
        stop();
        expect(results).toEqual([
          [1, 2, 3],
          [10, 2, 3],
        ]);

        sig2.set(20);
        tick();
        stop();
        expect(results).toEqual([
          [1, 2, 3],
          [10, 2, 3],
          [10, 20, 3],
        ]);

        sig3.set(30);
        tick();
        stop();
        expect(results).toEqual([
          [1, 2, 3],
          [10, 2, 3],
          [10, 20, 3],
          [10, 20, 30],
        ]);
      });
    }));

    it('should emit when any observable changes', fakeAsync(() => {
      TestBed.runInInjectionContext(() => {
        const obs1$ = new BehaviorSubject(1);
        const obs2$ = new BehaviorSubject(2);

        const combined = combineFrom([obs1$, obs2$]);

        tick();
        expect(combined()).toEqual([1, 2]);

        obs1$.next(10);
        tick();
        expect(combined()).toEqual([10, 2]);

        obs2$.next(20);
        tick();
        expect(combined()).toEqual([10, 20]);

        obs1$.next(100);
        obs2$.next(200);
        tick();
        expect(combined()).toEqual([100, 200]);
      });
    }));

    it('should not emit duplicate values from observables', fakeAsync(() => {
      TestBed.runInInjectionContext(() => {
        const obs$ = new BehaviorSubject(1);
        const sig = signal('test');

        const combined = combineFrom([obs$, sig]);

        const results: [number, string][] = [];
        const stop = computed(() => {
          const value = combined();
          if (value) {
            results.push(value);
          }
        });

        tick();
        stop();
        expect(results).toEqual([[1, 'test']]);

        // Emit same value - should be filtered by distinctUntilChanged
        obs$.next(1);
        tick();
        stop();
        expect(results).toEqual([[1, 'test']]); // No new emission

        // Emit different value
        obs$.next(2);
        tick();
        stop();
        expect(results).toEqual([
          [1, 'test'],
          [2, 'test'],
        ]);
      });
    }));
  });

  describe('real-world scenarios', () => {
    it('should work for view model pattern', fakeAsync(() => {
      TestBed.runInInjectionContext(() => {
        // Simulate a component with multiple data sources
        const users$ = new BehaviorSubject([{id: 1, name: 'Alice'}]);
        const isLoading$ = new BehaviorSubject(false);
        const searchTerm = signal('');
        const page = signal(1);

        const vm = combineFrom({
          users: users$,
          isLoading: isLoading$,
          searchTerm,
          page,
        });

        tick();
        expect(vm()).toEqual({
          users: [{id: 1, name: 'Alice'}],
          isLoading: false,
          searchTerm: '',
          page: 1,
        });

        isLoading$.next(true);
        tick();
        expect(vm()?.isLoading).toBe(true);

        searchTerm.set('ali');
        tick();
        expect(vm()?.searchTerm).toBe('ali');

        page.set(2);
        tick();
        expect(vm()?.page).toBe(2);
      });
    }));

    it('should work for filtering data', fakeAsync(() => {
      TestBed.runInInjectionContext(() => {
        const users = signal([
          {id: 1, name: 'Alice', age: 25},
          {id: 2, name: 'Bob', age: 30},
          {id: 3, name: 'Charlie', age: 35},
        ]);
        const minAge = signal(0);

        const filteredUsers = combineFrom(
          [users, minAge],
          pipe(
            map(([users, min]: [{id: number; name: string; age: number}[], number]) =>
              users.filter((u) => u.age >= min),
            ),
          ),
        );

        tick();
        expect(filteredUsers()?.length).toBe(3);

        minAge.set(30);
        tick();
        expect(filteredUsers()).toEqual([
          {id: 2, name: 'Bob', age: 30},
          {id: 3, name: 'Charlie', age: 35},
        ]);

        minAge.set(40);
        tick();
        expect(filteredUsers()).toEqual([]);
      });
    }));

    it('should work for form validation', fakeAsync(() => {
      TestBed.runInInjectionContext(() => {
        const username = signal('');
        const password = signal('');
        const email = signal('');

        const formValid = combineFrom(
          {username, password, email},
          pipe(
            map(({username, password, email}: {username: string; password: string; email: string}) => {
              return username.length > 0 && password.length >= 6 && email.includes('@');
            }),
          ),
        );

        tick();
        expect(formValid()).toBe(false);

        username.set('john');
        tick();
        expect(formValid()).toBe(false);

        password.set('secret123');
        tick();
        expect(formValid()).toBe(false);

        email.set('john@example.com');
        tick();
        expect(formValid()).toBe(true);
      });
    }));

    it('should work for computed values from multiple sources', fakeAsync(() => {
      TestBed.runInInjectionContext(() => {
        const price = signal(100);
        const quantity = signal(2);
        const taxRate = signal(0.1);

        const invoice = combineFrom(
          {price, quantity, taxRate},
          pipe(
            map(({price, quantity, taxRate}: {price: number; quantity: number; taxRate: number}) => {
              const subtotal = price * quantity;
              const tax = subtotal * taxRate;
              const total = subtotal + tax;
              return {subtotal, tax, total};
            }),
          ),
        );

        tick();
        expect(invoice()).toEqual({subtotal: 200, tax: 20, total: 220});

        quantity.set(3);
        tick();
        expect(invoice()).toEqual({subtotal: 300, tax: 30, total: 330});

        taxRate.set(0.2);
        tick();
        expect(invoice()).toEqual({subtotal: 300, tax: 60, total: 360});
      });
    }));
  });

  describe('type safety', () => {
    it('should maintain correct types for arrays', fakeAsync(() => {
      TestBed.runInInjectionContext(() => {
        const num = signal(1);
        const str = signal('hello');
        const bool = signal(true);

        const combined = combineFrom([num, str, bool]);

        tick();
        // TypeScript should infer: Signal<[number, string, boolean] | undefined>
        const result: [number, string, boolean] | undefined = combined();
        expect(result).toEqual([1, 'hello', true]);
      });
    }));

    it('should maintain correct types for objects', fakeAsync(() => {
      TestBed.runInInjectionContext(() => {
        const id = signal(123);
        const name = signal('Test');

        const combined = combineFrom({id, name});

        tick();
        // TypeScript should infer: Signal<{id: number, name: string} | undefined>
        const result: {id: number; name: string} | undefined = combined();
        expect(result).toEqual({id: 123, name: 'Test'});
      });
    }));

    it('should work with initialValue types', () => {
      TestBed.runInInjectionContext(() => {
        const obs$ = of(1).pipe(delay(100));

        const combined = combineFrom([obs$], {initialValue: [0]});

        // With initialValue, type should not include undefined
        const result = combined();
        expect(result).toEqual([0]);
      });
    });
  });
});
