import {RangePipe} from './range.pipe';

describe('RangePipe', () => {
  let pipe: RangePipe;

  beforeEach(() => {
    pipe = new RangePipe();
  });

  it('should create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should return an empty array when start is equal to end', () => {
    const result = pipe.transform([5, 5]);
    expect(result).toEqual([]);
  });

  it('should return an array with one element when start is less than end by one', () => {
    const result = pipe.transform([5, 6]);
    expect(result).toEqual([5]);
  });

  it('should return an array with multiple elements when start is less than end', () => {
    const result = pipe.transform([3, 10]);
    expect(result).toEqual([3, 4, 5, 6, 7, 8, 9]);
  });

  it('should return an array when start is greater than end', () => {
    const result = pipe.transform([10, 3]);
    expect(result).toEqual([10, 9, 8, 7, 6, 5, 4]);
  });

  it('should handle negative numbers correctly', () => {
    const result = pipe.transform([-5, 5]);
    expect(result).toEqual([-5, -4, -3, -2, -1, 0, 1, 2, 3, 4]);
  });

  it('should handle stepper', () => {
    const result = pipe.transform([-5, 5, 2]);
    expect(result).toEqual([-5, -3, -1, 1, 3]);
  });

  it('should handle stepper and fromRight', () => {
    const result = pipe.transform([-5, 5, 2, true]);
    expect(result).toEqual([3, 1, -1, -3, -5]);
  });
});
