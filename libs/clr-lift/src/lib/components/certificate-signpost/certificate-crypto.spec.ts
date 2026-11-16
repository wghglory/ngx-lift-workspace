import {createHash} from 'node:crypto';

import {describe, expect, it} from 'vitest';

import {md5, sha1, sha256} from './certificate-crypto';

describe('certificate digest helpers', () => {
  it('matches standard digest vectors', () => {
    const bytes = new TextEncoder().encode('abc');
    expect(md5(bytes)).toBe('900150983CD24FB0D6963F7D28E17F72');
    expect(sha1(bytes)).toBe('A9993E364706816ABA3E25717850C26C9CD0D89D');
    expect(sha256(bytes)).toBe('BA7816BF8F01CFEA414140DE5DAE2223B00361A396177A9CB410FF61F20015AD');
  });

  it('matches empty-input digest vectors', () => {
    const bytes = new Uint8Array();
    expect(md5(bytes)).toBe('D41D8CD98F00B204E9800998ECF8427E');
    expect(sha1(bytes)).toBe('DA39A3EE5E6B4B0D3255BFEF95601890AFD80709');
    expect(sha256(bytes)).toBe('E3B0C44298FC1C149AFBF4C8996FB92427AE41E4649B934CA495991B7852B855');
  });

  it('hashes inputs that cross a block boundary', () => {
    const bytes = new TextEncoder().encode('a'.repeat(80));
    const digest = (algorithm: string) => createHash(algorithm).update(bytes).digest('hex').toUpperCase();
    expect(md5(bytes)).toBe(digest('md5'));
    expect(sha1(bytes)).toBe(digest('sha1'));
    expect(sha256(bytes)).toBe(digest('sha256'));
  });
});
