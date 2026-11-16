import {FormControl} from '@angular/forms';
import {describe, expect, it} from 'vitest';

import {NamedFile, fileExtensionValidator} from './file-extension.validator';

const validate = (validator: ReturnType<typeof fileExtensionValidator>, value: unknown) =>
  validator(new FormControl(value));

const file = (name: string): NamedFile => ({name});
const fileList = (...names: string[]): FileList =>
  ({
    length: names.length,
    ...Object.fromEntries(names.map((name, index) => [index, file(name)])),
  }) as unknown as FileList;

describe('fileExtensionValidator', () => {
  const validator = fileExtensionValidator(['.png', 'jpg']);

  it('allows empty selections so a separate required rule can own them', () => {
    expect(validate(validator, null)).toBeNull();
    expect(validate(validator, undefined)).toBeNull();
    expect(validate(validator, '')).toBeNull();
    expect(validate(validator, fileList())).toBeNull();
    expect(validate(validator, [])).toBeNull();
  });

  it('accepts a single file, a file array, a FileList and a file name string', () => {
    expect(validate(validator, file('photo.PNG'))).toBeNull();
    expect(validate(validator, [file('a.png'), file('b.jpg')])).toBeNull();
    expect(validate(validator, fileList('a.png', 'b.JPG'))).toBeNull();
    expect(validate(validator, 'photo.png')).toBeNull();
  });

  it('reads names from array entries and rejects blank names', () => {
    expect(validate(validator, ['photo.png', file('notes.JPG')])).toBeNull();
    expect(validate(validator, fileList('  photo.png', 'b.jpg'))).toBeNull();
    expect(validate(validator, [file('  ')])).toEqual({invalidFileExtension: true});
  });

  it('rejects the selection when any file has a disallowed extension', () => {
    expect(validate(validator, fileList('a.png', 'notes.txt'))).toEqual({invalidFileExtension: true});
    expect(validate(validator, 'notes.txt')).toEqual({invalidFileExtension: true});
    expect(validate(validator, 'archive.png.exe')).toEqual({invalidFileExtension: true});
  });

  it('supports compound extensions, single arguments and trimmed configuration', () => {
    const compound = fileExtensionValidator('tar.gz');
    expect(validate(compound, 'backup.TAR.GZ')).toBeNull();
    expect(validate(compound, 'backup.gz')).toEqual({invalidFileExtension: true});
    expect(validate(compound, 'backup.tar')).toEqual({invalidFileExtension: true});
    expect(validate(fileExtensionValidator(' png '), 'photo.png')).toBeNull();
    expect(() => fileExtensionValidator('p ng')).toThrow(/invalid extension/);
  });

  it('rejects unsupported control value shapes and unnamed entries', () => {
    expect(validate(validator, 42)).toEqual({invalidFileExtension: true});
    expect(validate(validator, [file('')])).toEqual({invalidFileExtension: true});
    expect(validate(validator, [null])).toEqual({invalidFileExtension: true});
  });

  it('fails fast on an empty or malformed configuration', () => {
    expect(() => fileExtensionValidator([])).toThrow(/at least one allowed extension/);
    expect(() => fileExtensionValidator('')).toThrow(/non-empty string extensions/);
    expect(() => fileExtensionValidator(['.png', 42 as unknown as string])).toThrow(/non-empty string extensions/);
    expect(() => fileExtensionValidator('..png')).toThrow(/invalid extension/);
    expect(() => fileExtensionValidator('a/b')).toThrow(/invalid extension/);
  });
});
