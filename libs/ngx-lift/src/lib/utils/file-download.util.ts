/**
 * Triggers a browser file download for a given string or Blob content.
 *
 * Appends a temporary anchor tag to `document.body` for cross-browser reliability (including Firefox),
 * triggers a click, and asynchronously revokes the created object URL to prevent memory leaks.
 *
 * @param content The text content (string) or Blob to download.
 * @param fileName The desired filename for the downloaded file (e.g., `'report.json'`).
 * @param mimeType Optional MIME type when `content` is a string (defaults to `'text/plain;charset=utf-8'`).
 *
 * @example
 * ```typescript
 * // Download text or JSON
 * downloadFile('{"status":"ok"}', 'config.json', 'application/json');
 *
 * // Download Blob
 * downloadFile(myBlob, 'export.csv');
 * ```
 */
export function downloadFile(content: string | Blob, fileName: string, mimeType = 'text/plain;charset=utf-8'): void {
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    return;
  }

  const blob = typeof content === 'string' ? new Blob([content], {type: mimeType}) : content;
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');

  link.href = url;
  link.download = fileName;

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  setTimeout(() => {
    window.URL.revokeObjectURL(url);
  }, 150);
}
