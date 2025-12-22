import {firstValueFrom, of} from 'rxjs';
import {toArray} from 'rxjs/operators';
import {vi} from 'vitest';

import {distinctOnChange} from './distinct-on-change.operator';

describe('distinctOnChange', () => {
  it('should emit distinct values and call onChangeCallback when values change', async () => {
    const onChangeCallbackSpy = vi.fn();

    const source$ = of(1, 2, 2, 3, 3, 4).pipe(
      distinctOnChange((previousValue, currentValue) => onChangeCallbackSpy(previousValue, currentValue)),
      toArray(),
    );

    const result = await firstValueFrom(source$);
    expect(result).toEqual([1, 2, 3, 4]);
    expect(onChangeCallbackSpy).toHaveBeenCalledTimes(3);
    expect(onChangeCallbackSpy).toHaveBeenCalledWith(1, 2);
    expect(onChangeCallbackSpy).toHaveBeenCalledWith(2, 3);
    expect(onChangeCallbackSpy).toHaveBeenCalledWith(3, 4);
  });

  it('should handle distinct values when using a custom comparator', async () => {
    const onChangeCallbackSpy = vi.fn();

    const customComparator = (prev: number[], curr: number[]) => prev[0] === curr[0];

    const source$ = of([1], [1], [2], [3], [3], [4], [4], [5]).pipe(
      distinctOnChange(
        (previousValue, currentValue) => onChangeCallbackSpy(previousValue, currentValue),
        customComparator,
      ),
      toArray(),
    );

    const result = await firstValueFrom(source$);
    expect(result).toEqual([[1], [2], [3], [4], [5]]);
    expect(onChangeCallbackSpy).toHaveBeenCalledTimes(4); // Callback should be called for each change
    expect(onChangeCallbackSpy).toHaveBeenCalledWith([1], [2]);
    expect(onChangeCallbackSpy).toHaveBeenCalledWith([2], [3]);
    expect(onChangeCallbackSpy).toHaveBeenCalledWith([3], [4]);
    expect(onChangeCallbackSpy).toHaveBeenCalledWith([4], [5]);
  });

  it('should handle an empty source observable', async () => {
    const onChangeCallbackSpy = vi.fn();

    const source$ = of().pipe(
      distinctOnChange((previousValue, currentValue) => onChangeCallbackSpy(previousValue, currentValue)),
      toArray(),
    );

    const result = await firstValueFrom(source$);
    expect(result).toEqual([]);
    expect(onChangeCallbackSpy).not.toHaveBeenCalled(); // Callback should not be called for an empty observable
  });
});
