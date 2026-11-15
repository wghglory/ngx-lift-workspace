// @vitest-environment node
import {describe, expect, it} from 'vitest';
import {downloadFile} from './file-download.util';

describe('downloadFile without a DOM', () => {
  it('is a no-op when window and document are unavailable', () => {
    expect(typeof window).toBe('undefined');
    expect(typeof document).toBe('undefined');
    expect(() => downloadFile('data', 'file.txt')).not.toThrow();
    expect(() => downloadFile(new Blob(['data']), 'file.txt')).not.toThrow();
    expect(() => downloadFile('data', '')).not.toThrow();
  });
});
