import {IsHttpsPipe} from './is-https.pipe';

describe('IsHttpsPipe', () => {
  let pipe: IsHttpsPipe;

  beforeEach(() => {
    pipe = new IsHttpsPipe();
  });

  it('should create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should return true for a valid URL', () => {
    const validUrl = 'https://example.com';
    const result = pipe.transform(validUrl);
    expect(result).toBeTruthy();
  });

  it('should return false for an invalid URL', () => {
    const invalidUrl = 'http://example.com';
    const result = pipe.transform(invalidUrl);
    expect(result).toBeFalsy();
  });
});
