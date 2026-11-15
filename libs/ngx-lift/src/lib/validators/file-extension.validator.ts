import {AbstractControl, ValidationErrors, ValidatorFn} from '@angular/forms';

import {isEmptyControlValue} from './validator-value.util';

/** A file-like value with a name; `File` satisfies this shape without a browser dependency. */
export interface NamedFile {
  readonly name: string;
}

/** Values a form control can hold when it represents a file selection. */
export type FileSelection = FileList | readonly NamedFile[] | NamedFile | string | null;

const EXTENSION_PATTERN = /^\.[^.\s/\\]+(?:\.[^.\s/\\]+)*$/;

function normalizeExtension(extension: string): string {
  const trimmed = extension.trim().toLowerCase();
  return trimmed.startsWith('.') ? trimmed : `.${trimmed}`;
}

function isNamedFile(value: unknown): value is NamedFile {
  return typeof value === 'object' && value !== null && typeof (value as NamedFile).name === 'string';
}

function isFileList(value: unknown): value is ArrayLike<NamedFile> {
  return (
    typeof value === 'object' &&
    value !== null &&
    !isNamedFile(value) &&
    typeof (value as {length?: unknown}).length === 'number'
  );
}

/**
 * Creates a validator that checks every selected file name against a list of allowed extensions.
 *
 * Accepts a `FileList`, an array of files, a single file, or a single file name as a string, which
 * also makes server-rendered and programmatically populated controls testable. Extensions may be
 * supplied with or without a leading dot and are compared case-insensitively; compound suffixes
 * such as `.tar.gz` are supported. An empty selection is valid so that a selection can be made
 * mandatory with `Validators.required` instead.
 *
 * The configuration is validated when the factory is called: an empty list, a whitespace-only
 * extension, or an extension with inner whitespace, a path separator, or an empty segment throws a
 * developer error rather than producing a validator that can never pass. Surrounding whitespace is
 * trimmed before normalization, so `' png '` is equivalent to `'.png'`.
 *
 * @param allowedExtensions One extension (for example `'.png'`) or a list of extensions.
 * @returns A `ValidatorFn` that returns `{invalidFileExtension: true}` when any selected file
 * does not end with an allowed extension, or `null` when all files pass or no file is selected.
 * @throws Error when the allowed extension configuration is empty or malformed.
 *
 * @example
 * ```typescript
 * import {FormControl, Validators} from '@angular/forms';
 * import {FileSelection, fileExtensionValidator} from 'ngx-lift';
 *
 * const certificates = new FormControl<FileSelection>(null, [
 *   Validators.required,
 *   fileExtensionValidator(['.crt', 'pem']),
 * ]);
 * ```
 */
export function fileExtensionValidator(allowedExtensions: string | readonly string[]): ValidatorFn {
  const requested: readonly unknown[] = Array.isArray(allowedExtensions) ? allowedExtensions : [allowedExtensions];

  if (requested.length === 0) {
    throw new Error('fileExtensionValidator requires at least one allowed extension.');
  }

  const allowed = requested.map((extension) => {
    if (typeof extension !== 'string' || !extension.trim()) {
      throw new Error('fileExtensionValidator requires non-empty string extensions.');
    }
    const normalized = normalizeExtension(extension);
    if (!EXTENSION_PATTERN.test(normalized)) {
      throw new Error(`fileExtensionValidator received an invalid extension: ${extension}`);
    }
    return normalized;
  });

  return (control: AbstractControl): ValidationErrors | null => {
    const value: unknown = control.value;

    if (isEmptyControlValue(value) || value === undefined) {
      return null;
    }

    let entries: readonly unknown[];
    if (typeof value === 'string') {
      entries = [value];
    } else if (isNamedFile(value)) {
      entries = [value];
    } else if (isFileList(value)) {
      entries = Array.from(value as ArrayLike<NamedFile>);
    } else {
      return {invalidFileExtension: true};
    }

    if (entries.length === 0) {
      return null;
    }

    for (const entry of entries) {
      const name = typeof entry === 'string' ? entry : isNamedFile(entry) ? entry.name : undefined;
      if (typeof name !== 'string' || !name || !allowed.some((suffix) => name.toLowerCase().endsWith(suffix))) {
        return {invalidFileExtension: true};
      }
    }

    return null;
  };
}
