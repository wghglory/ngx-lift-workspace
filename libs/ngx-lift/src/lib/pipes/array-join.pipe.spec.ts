import {ArrayJoinPipe} from './array-join.pipe';

describe('ArrayJoinPipe', () => {
  let pipe: ArrayJoinPipe;

  beforeEach(() => {
    pipe = new ArrayJoinPipe();
  });

  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should join array elements with default separator', () => {
    const inputArray = ['apple', 'banana', 'orange'];
    const result = pipe.transform(inputArray);
    expect(result).toBe('apple,banana,orange');
  });

  it('should join array elements with a custom separator', () => {
    const inputArray = ['apple', 'banana', 'orange'];
    const separator = '-';
    const result = pipe.transform(inputArray, separator);
    expect(result).toBe('apple-banana-orange');
  });

  it('should return the input string as is', () => {
    const inputString = 'Hello, World!';
    const result = pipe.transform(inputString);
    expect(result).toBe(inputString);
  });

  it('should return non-array, non-string input unchanged', () => {
    const inputObject = {key: 'value'};
    const result = pipe.transform(inputObject);
    expect(result).toBe(inputObject);
  });
});
