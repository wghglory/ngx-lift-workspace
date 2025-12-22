import {isPromise} from './is-promise.util';

describe('isPromise', () => {
  it('should return true for a valid Promise', () => {
    const promise = new Promise((resolve) => {
      resolve('Resolved');
    });

    expect(isPromise(promise)).toBe(true);
  });

  it('should return false for a non-Promise object', () => {
    const nonPromiseObject = {then: 'Not a function'};

    expect(isPromise(nonPromiseObject)).toBe(false);
  });

  it('should return false for a null value', () => {
    expect(isPromise(null)).toBe(false);
  });

  it('should return false for an undefined value', () => {
    expect(isPromise(undefined)).toBe(false);
  });

  it('should return false for a primitive value', () => {
    expect(isPromise(42)).toBe(false);
    expect(isPromise('string')).toBe(false);
    expect(isPromise(true)).toBe(false);
  });

  it('should return false for a function', () => {
    expect(isPromise(() => {})).toBe(false);
  });

  it('should return false for an object without a then method', () => {
    const emptyObject = {};

    expect(isPromise(emptyObject)).toBe(false);
  });

  it('should return false for an object with a non-function then method', () => {
    const objectWithNonFunctionThen = {then: 42};

    expect(isPromise(objectWithNonFunctionThen)).toBe(false);
  });
});
