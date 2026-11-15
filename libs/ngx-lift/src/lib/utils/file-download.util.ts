/**
 * Triggers a browser download for string or `Blob` content.
 *
 * A temporary hidden anchor is attached to `document.body` for cross-browser reliability
 * (including Firefox), clicked once, removed synchronously, and its object URL is revoked on the
 * next task. On the server, or when the host does not expose object URLs, the call is a no-op.
 *
 * This helper only starts a download; it does not verify that the browser saved the file, and it
 * does not own the content's lifetime after the call returns.
 *
 * @param content The text content (string) or `Blob` to download.
 * @param fileName A non-empty desired filename, e.g. `'report.json'`.
 * @param mimeType MIME type used when `content` is a string; defaults to
 * `'text/plain;charset=utf-8'`. Ignored for `Blob` content, which keeps its own type.
 * @returns Nothing. The function is intentionally fire-and-forget.
 * @throws {RangeError} If `fileName` is empty or whitespace only.
 * @throws {TypeError} If `content` is neither a string nor a `Blob`.
 *
 * @example
 * ```typescript
 * // Download text or JSON
 * downloadFile('{"status":"ok"}', 'config.json', 'application/json');
 *
 * // Download a generated Blob
 * const blob = new Blob(['name,role\nAlice,Admin'], {type: 'text/csv'});
 * downloadFile(blob, 'users.csv');
 * ```
 */
export function downloadFile(content: string | Blob, fileName: string, mimeType = 'text/plain;charset=utf-8'): void {
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    return;
  }

  if (typeof fileName !== 'string' || !fileName.trim()) {
    throw new RangeError('downloadFile requires a non-empty fileName.');
  }
  if (typeof content !== 'string' && !(content instanceof Blob)) {
    throw new TypeError('downloadFile requires a string or Blob content.');
  }
  if (typeof window.URL?.createObjectURL !== 'function' || typeof window.URL.revokeObjectURL !== 'function') {
    return;
  }

  const blob = typeof content === 'string' ? new Blob([content], {type: mimeType}) : content;
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');

  link.href = url;
  link.download = fileName;
  link.hidden = true;

  document.body.appendChild(link);
  try {
    link.click();
  } finally {
    link.remove();
    setTimeout(() => window.URL.revokeObjectURL(url), 0);
  }
}
