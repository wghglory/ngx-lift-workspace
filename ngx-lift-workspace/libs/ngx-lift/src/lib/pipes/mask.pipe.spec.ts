import {TestBed} from '@angular/core/testing';

import {MaskOptions, MaskPipe} from './mask.pipe';

describe('MaskPipe', () => {
  let pipe: MaskPipe;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MaskPipe],
    });

    pipe = TestBed.inject(MaskPipe);
  });

  it('should create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should return the original value if options are not provided', () => {
    const result = pipe.transform('example');
    expect(result).toBe('example');
  });

  it('should return the original value if unmaskedPrefixLength or unmaskedSuffixLength are negative', () => {
    const options: MaskOptions = {unmaskedPrefixLength: -1, unmaskedSuffixLength: 2};
    const result = pipe.transform('example', options);
    expect(result).toBe('example');
  });

  it('should return the original value if masked is false', () => {
    const options: MaskOptions = {masked: false};
    const result = pipe.transform('example-not-masked', options);
    expect(result).toBe('example-not-masked');
  });

  it('should mask characters based on options', () => {
    const options: MaskOptions = {unmaskedPrefixLength: 2, unmaskedSuffixLength: 1};
    const result = pipe.transform('example', options);
    expect(result).toBe('ex****e');
  });

  it('should use default options if not provided', () => {
    const result = pipe.transform('example-long-word');
    expect(result).toBe('exampl*****g-word');
  });
});
