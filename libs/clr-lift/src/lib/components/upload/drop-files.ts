// FileSystemEntry paths are not always copied into File.webkitRelativePath by browsers.
const droppedPaths = new WeakMap<File, string>();

/** Relative display/identity hint only; never a server storage key. */
export function relativeFilePath(file: File): string {
  const path = (file.webkitRelativePath || droppedPaths.get(file) || '').replace(/^\/+/, '');
  // Root-level dropped entries have a basename path; native file selection has no relative path.
  return path.includes('/') ? path : '';
}

/**
 * Collects the files behind one drag-and-drop drop, traversing dropped folders.
 *
 * `webkitGetAsEntry()` must be called synchronously while the drop event is dispatching:
 * the `DataTransfer` item list is cleared once the handler yields, so entries are captured
 * first and walked asynchronously afterwards.
 */
export async function filesFromDataTransfer(dataTransfer: DataTransfer): Promise<readonly File[]> {
  const items = dataTransfer.items;
  if (!items?.length) return Array.from(dataTransfer.files);
  const entries: FileSystemEntry[] = [];
  for (const item of Array.from(items)) {
    if (item.kind !== 'file') continue;
    const entry = item.webkitGetAsEntry?.();
    if (entry) entries.push(entry);
  }
  if (!entries.length) return Array.from(dataTransfer.files);
  if (!entries.some((entry) => entry.isDirectory)) return Array.from(dataTransfer.files);
  return filesFromEntries(entries);
}

/** Walks dropped entries depth-first, flattening folder contents in encounter order. */
export async function filesFromEntries(entries: readonly FileSystemEntry[]): Promise<readonly File[]> {
  const nested = await Promise.all(entries.map((entry) => walkEntry(entry)));
  return nested.flat();
}

async function walkEntry(entry: FileSystemEntry): Promise<readonly File[]> {
  if (entry.isFile) {
    return new Promise((resolve) => {
      (entry as FileSystemFileEntry).file(
        (file) => {
          if (entry.fullPath) droppedPaths.set(file, entry.fullPath.replace(/^\//, ''));
          resolve([file]);
        },
        () => resolve([]),
      );
    });
  }
  const reader = (entry as FileSystemDirectoryEntry).createReader();
  const children: FileSystemEntry[] = [];
  for (;;) {
    // readEntries returns at most 100 entries per call and must be repeated until it yields an empty batch.
    const batch = await new Promise<FileSystemEntry[]>((resolve) => {
      reader.readEntries(
        (next) => resolve(next),
        () => resolve([]),
      );
    });
    if (!batch.length) break;
    children.push(...batch);
  }
  const nested = await Promise.all(children.map((child) => walkEntry(child)));
  return nested.flat();
}
