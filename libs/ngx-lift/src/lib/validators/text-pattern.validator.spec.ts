import {FormControl} from '@angular/forms';
import {describe, expect, it} from 'vitest';

import {noSpaceAllowed, onlyAsciiCharsAllowed} from './text-pattern.validator';

describe('text-pattern.validator', () => {
  describe('noSpaceAllowed', () => {
    it('should return null for empty values', () => {
      expect(noSpaceAllowed(new FormControl(''))).toBeNull();
      expect(noSpaceAllowed(new FormControl(null))).toBeNull();
    });

    it('should return null for strings without whitespace', () => {
      expect(noSpaceAllowed(new FormControl('valid-username_123'))).toBeNull();
    });

    it('should return { noSpaceAllowed: true } for strings containing spaces or tabs', () => {
      expect(noSpaceAllowed(new FormControl('invalid username'))).toEqual({noSpaceAllowed: true});
      expect(noSpaceAllowed(new FormControl('tab\tcharacter'))).toEqual({noSpaceAllowed: true});
    });
  });

  describe('onlyAsciiCharsAllowed', () => {
    it('should return null for empty values', () => {
      expect(onlyAsciiCharsAllowed(new FormControl(''))).toBeNull();
      expect(onlyAsciiCharsAllowed(new FormControl(null))).toBeNull();
    });

    it('should return null for ASCII characters', () => {
      expect(onlyAsciiCharsAllowed(new FormControl('Hello World 123!@#'))).toBeNull();
    });

    it('should return { onlyAsciiCharsAllowed: true } for strings with non-ASCII characters', () => {
      expect(onlyAsciiCharsAllowed(new FormControl('héllö'))).toEqual({onlyAsciiCharsAllowed: true});
      expect(onlyAsciiCharsAllowed(new FormControl('你好'))).toEqual({onlyAsciiCharsAllowed: true});
    });
  });
});
