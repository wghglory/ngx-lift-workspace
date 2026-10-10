import {FormControl} from '@angular/forms';
import {describe, expect, it} from 'vitest';

import {fileExtensionValidator} from './file-extension.validator';

describe('fileExtensionValidator', () => {
  const mockFile = (name: string): File => ({name}) as File;

  it('should return null for empty file list', () => {
    const validator = fileExtensionValidator('.json');
    expect(validator(new FormControl(null))).toBeNull();
    expect(validator(new FormControl([]))).toBeNull();
  });

  it('should return null when all files match single allowed extension', () => {
    const validator = fileExtensionValidator('.keytab');
    const control = new FormControl([mockFile('krb5.keytab')]);
    expect(validator(control)).toBeNull();
  });

  it('should return null when matching multiple allowed extensions', () => {
    const validator = fileExtensionValidator(['.pem', '.crt']);
    const control = new FormControl([mockFile('server.crt'), mockFile('ca.PEM')]);
    expect(validator(control)).toBeNull();
  });

  it('should return { invalidExtension: true } when any file extension does not match', () => {
    const validator = fileExtensionValidator(['.jpg', '.png']);
    const control = new FormControl([mockFile('photo.jpg'), mockFile('script.sh')]);
    expect(validator(control)).toEqual({invalidExtension: true});
  });

  it('should return { invalidExtension: true } for files without extension', () => {
    const validator = fileExtensionValidator('.txt');
    const control = new FormControl([mockFile('README')]);
    expect(validator(control)).toEqual({invalidExtension: true});
  });
});
