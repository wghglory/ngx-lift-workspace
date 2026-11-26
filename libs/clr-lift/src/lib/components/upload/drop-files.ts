// FileSystemEntry paths are not always copied into File.webkitRelativePath by browsers.
const droppedPaths = new WeakMap<File, string>();
type ReportUnreadable = (path: string) => void;

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
export async function filesFromDataTransfer(
  dataTransfer: DataTransfer,
  reportUnreadable?: ReportUnreadable,
): Promise<readonly File[]> {
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
  return filesFromEntries(entries, reportUnreadable);
}

/** Walks dropped entries depth-first, flattening folder contents in encounter order. */
export async function filesFromEntries(
  entries: readonly FileSystemEntry[],
  reportUnreadable?: ReportUnreadable,
): Promise<readonly File[]> {
  const nested = await Promise.all(entries.map((entry) => walkEntry(entry, '', reportUnreadable)));
  return nested.flat();
}

async function walkEntry(
  entry: FileSystemEntry,
  parentPath: string,
  reportUnreadable?: ReportUnreadable,
): Promise<readonly File[]> {
  const path = (entry.fullPath || [parentPath, entry.name].filter(Boolean).join('/')).replace(/^\/+/, '');
  if (entry.isFile) {
    try {
      const file = await new Promise<File>((resolve, reject) => (entry as FileSystemFileEntry).file(resolve, reject));
      if (path) droppedPaths.set(file, path);
      return [file];
    } catch {
      reportUnreadable?.(path);
      return [];
    }
  }
  const children: FileSystemEntry[] = [];
  try {
    const reader = (entry as FileSystemDirectoryEntry).createReader();
    for (;;) {
      // readEntries returns at most 100 entries per call and must be repeated until it yields an empty batch.
      const batch = await new Promise<FileSystemEntry[]>((resolve, reject) => reader.readEntries(resolve, reject));
      if (!batch.length) break;
      children.push(...batch);
    }
  } catch {
    // Earlier pages remain usable if the browser refuses a later read.
    reportUnreadable?.(path);
  }
  const nested = await Promise.all(children.map((child) => walkEntry(child, path, reportUnreadable)));
  return nested.flat();
}
