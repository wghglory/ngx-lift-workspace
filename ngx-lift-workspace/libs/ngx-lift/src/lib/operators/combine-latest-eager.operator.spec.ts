import {of, Subject} from 'rxjs';
import {take} from 'rxjs/operators';

import {combineLatestEager} from './combine-latest-eager.operator';

describe('combineLatestEager', () => {
  it('should combine latest observables and start with null if startWithNullForAll is true', (done) => {
    const obs1$ = of(1);
    const obs2$ = new Subject<number>();

    const result$ = combineLatestEager([obs1$, obs2$], true);

    result$.pipe(take(1)).subscribe((result) => {
      expect(result[1]).toEqual(null);
      done();
    });
  });

  it('should combine latest observables and start without null if startWithNullForAll is false', (done) => {
    const obs1$ = of(1);
    const obs2$ = new Subject<number>();

    const result$ = combineLatestEager([obs1$, obs2$], false);

    result$.pipe(take(1)).subscribe((result) => {
      expect(result).toEqual([1, null]);
      done();
    });
  });

  it('should handle dictionary of observables and start with null if startWithNullForAll is true', (done) => {
    const obs1$ = of(1);
    const obs2$ = new Subject<number>();

    const result$ = combineLatestEager({obs1: obs1$, obs2: obs2$}, true);

    result$.pipe(take(1)).subscribe((result) => {
      expect(result).toEqual({obs1: 1, obs2: null});
      done();
    });
  });

  it('should handle dictionary of observables and start without null if startWithNullForAll is false', (done) => {
    const obs1$ = of(1);
    const obs2$ = new Subject<number>();

    const result$ = combineLatestEager({obs1: obs1$, obs2: obs2$}, false);

    result$.pipe(take(1)).subscribe((result) => {
      expect(result).toEqual({obs1: 1, obs2: null});
      done();
    });
  });
});
