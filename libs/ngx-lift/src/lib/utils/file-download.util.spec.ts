import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest';
import {downloadFile} from './file-download.util';

describe('downloadFile', () => {
  let createObjectURLMock: ReturnType<typeof vi.fn>;
  let revokeObjectURLMock: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    vi.useFakeTimers();
    createObjectURLMock = vi.fn().mockReturnValue('blob:mock-url');
    revokeObjectURLMock = vi.fn();
    window.URL.createObjectURL = createObjectURLMock;
    window.URL.revokeObjectURL = revokeObjectURLMock;
    vi.spyOn(HTMLAnchorElement.prototype, 'click').mockReturnValue();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should trigger download for string content', () => {
    const appendChildSpy = vi.spyOn(document.body, 'appendChild');
    const removeChildSpy = vi.spyOn(document.body, 'removeChild');

    downloadFile('{"hello":"world"}', 'test.json', 'application/json');

    expect(createObjectURLMock).toHaveBeenCalled();
    expect(appendChildSpy).toHaveBeenCalled();
    expect(removeChildSpy).toHaveBeenCalled();

    vi.advanceTimersByTime(200);
    expect(revokeObjectURLMock).toHaveBeenCalledWith('blob:mock-url');
  });

  it('should trigger download for Blob content', () => {
    const blob = new Blob(['binary data'], {type: 'application/octet-stream'});
    downloadFile(blob, 'file.bin');

    expect(createObjectURLMock).toHaveBeenCalledWith(blob);

    vi.advanceTimersByTime(200);
    expect(revokeObjectURLMock).toHaveBeenCalledWith('blob:mock-url');
  });
});
