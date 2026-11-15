import {afterEach, beforeEach, describe, expect, expectTypeOf, it, vi} from 'vitest';
import {downloadFile} from './file-download.util';

describe('downloadFile', () => {
  let createObjectURLMock: ReturnType<typeof vi.fn>;
  let revokeObjectURLMock: ReturnType<typeof vi.fn>;
  let clickMock: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    vi.useFakeTimers();
    createObjectURLMock = vi.fn().mockReturnValue('blob:mock-url');
    revokeObjectURLMock = vi.fn();
    window.URL.createObjectURL = createObjectURLMock;
    window.URL.revokeObjectURL = revokeObjectURLMock;
    clickMock = vi.spyOn(HTMLAnchorElement.prototype, 'click').mockReturnValue();
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it('downloads string content with the requested MIME type and revokes the URL on the next task', () => {
    const appendSpy = vi.spyOn(document.body, 'appendChild');

    expect(() => downloadFile('{"hello":"world"}', 'test.json', 'application/json')).not.toThrow();

    expect(clickMock).toHaveBeenCalledTimes(1);
    const link = appendSpy.mock.calls[0][0] as HTMLAnchorElement;
    expect(link.tagName).toBe('A');
    expect(link.download).toBe('test.json');
    expect(link.href).toContain('blob:mock-url');
    expect(link.hidden).toBe(true);
    expect(document.body.contains(link)).toBe(false);
    expect(document.querySelector('a[download]')).toBeNull();

    const blob = createObjectURLMock.mock.calls[0][0] as Blob;
    expect(blob).toBeInstanceOf(Blob);
    expect(blob.type).toBe('application/json');
    expect(revokeObjectURLMock).not.toHaveBeenCalled();
    vi.runAllTimers();
    expect(revokeObjectURLMock).toHaveBeenCalledWith('blob:mock-url');
  });

  it('reuses a supplied Blob and ignores the string MIME default', () => {
    const blob = new Blob(['binary data'], {type: 'application/octet-stream'});
    downloadFile(blob, 'file.bin');
    expect(createObjectURLMock).toHaveBeenCalledWith(blob);
    vi.runAllTimers();
    expect(revokeObjectURLMock).toHaveBeenCalledWith('blob:mock-url');
  });

  it('revokes the URL even when the click fails', () => {
    clickMock.mockImplementation(() => {
      throw new Error('click blocked');
    });
    expect(() => downloadFile('data', 'file.txt')).toThrow('click blocked');
    expect(document.querySelector('a[download]')).toBeNull();
    vi.runAllTimers();
    expect(revokeObjectURLMock).toHaveBeenCalledWith('blob:mock-url');
  });

  it('rejects an empty file name before creating an object URL', () => {
    expect(() => downloadFile('data', '')).toThrow(RangeError);
    expect(() => downloadFile('data', '   ')).toThrow(RangeError);
    expect(createObjectURLMock).not.toHaveBeenCalled();
  });

  it('rejects content that is neither a string nor a Blob', () => {
    expect(() => downloadFile(42 as unknown as string, 'file.txt')).toThrow(TypeError);
    expect(createObjectURLMock).not.toHaveBeenCalled();
  });

  it('is a no-op when object URL creation is unavailable', () => {
    window.URL.createObjectURL = undefined as unknown as typeof URL.createObjectURL;

    expect(() => downloadFile('data', 'file.txt')).not.toThrow();
    expect(document.querySelector('a[download]')).toBeNull();
    expect(createObjectURLMock).not.toHaveBeenCalled();
  });

  it('is a no-op when object URL revocation is unavailable', () => {
    window.URL.revokeObjectURL = undefined as unknown as typeof URL.revokeObjectURL;

    expect(() => downloadFile('data', 'file.txt')).not.toThrow();
    expect(document.querySelector('a[download]')).toBeNull();
  });

  it('validates arguments before checking object URL support on a browser host', () => {
    window.URL.createObjectURL = undefined as unknown as typeof URL.createObjectURL;

    expect(() => downloadFile('data', '')).toThrow(RangeError);
    expect(() => downloadFile(42 as unknown as string, 'file.txt')).toThrow(TypeError);
    expect(document.querySelector('a[download]')).toBeNull();
  });

  it('exposes a void return type', () => {
    expectTypeOf(downloadFile).returns.toEqualTypeOf<void>();
  });
});
