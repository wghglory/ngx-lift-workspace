import {Subject} from 'rxjs';
import {describe, expect, it} from 'vitest';

import {mergeWithTrack} from './merge-with-track.operator';

describe('mergeWithTrack operator', () => {
  it('should track latest values and the index of the emitting source', () => {
    const source1$ = new Subject<number>();
    const source2$ = new Subject<string>();

    const emissions: {values: Record<number, number | string>; lastEmittedIndex: number | null}[] = [];

    mergeWithTrack<number | string>([source1$, source2$]).subscribe((event) => {
      emissions.push(event);
    });

    source1$.next(100);
    expect(emissions).toEqual([{values: {0: 100}, lastEmittedIndex: 0}]);

    source2$.next('apple');
    expect(emissions).toEqual([
      {values: {0: 100}, lastEmittedIndex: 0},
      {values: {0: 100, 1: 'apple'}, lastEmittedIndex: 1},
    ]);

    source1$.next(200);
    expect(emissions[2]).toEqual({
      values: {0: 200, 1: 'apple'},
      lastEmittedIndex: 0,
    });
  });
});
