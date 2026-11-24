import {describe, expect, it} from 'vitest';

import {filesFromDataTransfer, filesFromEntries, relativeFilePath} from './drop-files';

function fakeFile(name: string, body = 'content'): File {
  return new File([body], name);
}

function fileEntry(name: string): FileSystemFileEntry {
  const file = fakeFile(name);
  return {
    isFile: true,
    isDirectory: false,
    name,
    file: (success: FileCallback) => success(file),
  } as unknown as FileSystemFileEntry;
}

function fileEntryFailing(name: string): FileSystemFileEntry {
  return {
    isFile: true,
    isDirectory: false,
    name,
    file: (_success: FileCallback, error: (error: Error) => void) => error(new Error('unavailable')),
  } as unknown as FileSystemFileEntry;
}

/** readEntries yields at most 100 entries per call; `batches` simulates the server-side paging. */
function directoryEntry(name: string, batches: FileSystemEntry[][]): FileSystemDirectoryEntry {
  return {
    isFile: false,
    isDirectory: true,
    name,
    createReader: () => ({
      readEntries: (success: (entries: FileSystemEntry[]) => void) => success(batches.shift() ?? []),
    }),
  } as unknown as FileSystemDirectoryEntry;
}

function fakeDataTransfer(options: {
  files?: readonly File[];
  items?: {kind: string; webkitGetAsEntry?: () => FileSystemEntry | null}[];
}): DataTransfer {
  const items = options.items ?? [];
  return {
    files: options.files ?? [],
    items: {
      length: items.length,
      *[Symbol.iterator]() {
        yield* items;
      },
    },
  } as unknown as DataTransfer;
}

describe('filesFromEntries', () => {
  it('walks a nested directory tree in depth-first order', async () => {
    const tree = directoryEntry('root', [
      [fileEntry('a.zip'), directoryEntry('nested', [[fileEntry('b.zip'), fileEntry('c.zip')]])],
    ]);

    const files = await filesFromEntries([tree]);

    expect(files.map((file) => file.name)).toEqual(['a.zip', 'b.zip', 'c.zip']);
  });

  it('preserves available dropped-entry paths without changing the File name or bytes', async () => {
    const original = new File(['payload'], 'bundle.zip');
    const entry = {
      ...fileEntry('bundle.zip'),
      fullPath: '/releases/bundle.zip',
      file: (success: FileCallback) => success(original),
    };
    const [file] = await filesFromEntries([entry]);
    expect(file).toBe(original);
    expect(file.name).toBe('bundle.zip');
    expect(relativeFilePath(file)).toBe('releases/bundle.zip');
    expect(file.size).toBe(7);
  });

  it('collects directory children delivered in multiple readEntries batches', async () => {
    const tree = directoryEntry('root', [[fileEntry('first.zip')], [fileEntry('second.zip')], []]);

    const files = await filesFromEntries([tree]);

    expect(files.map((file) => file.name)).toEqual(['first.zip', 'second.zip']);
  });

  it('skips entries whose file callback fails', async () => {
    const files = await filesFromEntries([fileEntryFailing('locked.zip'), fileEntry('ok.zip')]);

    expect(files.map((file) => file.name)).toEqual(['ok.zip']);
  });
});

describe('filesFromDataTransfer', () => {
  it('returns the plain file list when no items are present', async () => {
    const files = [fakeFile('plain.zip')];

    const result = await filesFromDataTransfer(fakeDataTransfer({files}));

    expect(result).toEqual(files);
  });

  it('returns the plain file list when entries are plain files', async () => {
    const files = [fakeFile('plain.zip')];
    const items = [{kind: 'file', webkitGetAsEntry: () => fileEntry('entry.zip')}];

    const result = await filesFromDataTransfer(fakeDataTransfer({files, items}));

    expect(result).toEqual(files);
  });

  it('traverses dropped folders captured as directory entries', async () => {
    const items = [
      {
        kind: 'file',
        webkitGetAsEntry: () => directoryEntry('folder', [[fileEntry('inner.zip')]]),
      },
    ];

    const result = await filesFromDataTransfer(fakeDataTransfer({items}));

    expect(result.map((file) => file.name)).toEqual(['inner.zip']);
  });

  it('returns an empty list when item entries are unavailable', async () => {
    const items = [{kind: 'string', webkitGetAsEntry: () => null} as {kind: string; webkitGetAsEntry?: () => null}];

    const result = await filesFromDataTransfer(fakeDataTransfer({items}));

    expect(result).toEqual([]);
  });
});
