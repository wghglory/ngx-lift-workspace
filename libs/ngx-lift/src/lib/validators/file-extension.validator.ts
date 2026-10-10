import {AbstractControl, ValidationErrors, ValidatorFn} from '@angular/forms';

/**
 * Validates that all files in a `FileList` control value have one of the allowed extensions.
 *
 * Extensions can be provided with or without a leading dot (e.g. `'.json'` or `'json'`).
 * Comparison is case-insensitive.
 *
 * @param allowedExtensions Allowed file extension or array of extensions (e.g. `'.pem'` or `['.png', '.jpg']`).
 * @returns A `ValidatorFn` returning `{ invalidExtension: true }` if any file fails, or `null` when valid.
 *
 * @example
 * ```typescript
 * const fileControl = new FormControl<FileList | null>(null, [
 *   fileExtensionValidator(['.crt', '.pem']),
 * ]);
 * ```
 */
export function fileExtensionValidator(allowedExtensions: string | string[]): ValidatorFn {
  const allowedList = (Array.isArray(allowedExtensions) ? allowedExtensions : [allowedExtensions]).map((ext) =>
    ext.toLowerCase().replace(/^\./, ''),
  );

  return (control: AbstractControl): ValidationErrors | null => {
    const fileList: FileList | File[] | null = control.value;

    if (!fileList || (fileList as {length?: number}).length === 0) {
      return null;
    }

    const files = Array.from(fileList as ArrayLike<File>);

    for (const file of files) {
      if (!file || !file.name) {
        continue;
      }

      const extension = file.name.split('.').pop()?.toLowerCase();
      if (!extension || !allowedList.includes(extension)) {
        return {invalidExtension: true};
      }
    }

    return null;
  };
}
