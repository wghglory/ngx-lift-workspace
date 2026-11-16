import {ChangeDetectionStrategy, Component, signal} from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {ClarityModule} from '@clr/angular';
import {PageContainerComponent, TranslatePipe} from 'clr-lift';
import {FileSelection, fileExtensionValidator} from 'ngx-lift';

import {CodeBlockComponent} from '../../../../shared/components/code-block/code-block.component';
import {DemoPlaygroundComponent} from '../../../../shared/components/demo-playground/demo-playground.component';
import {highlight} from '../../../../shared/utils/highlight.util';

@Component({
  selector: 'app-file-extension-validator',
  imports: [
    ClarityModule,
    PageContainerComponent,
    ReactiveFormsModule,
    TranslatePipe,
    DemoPlaygroundComponent,
    CodeBlockComponent,
  ],
  templateUrl: './file-extension-validator.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FileExtensionValidatorComponent {
  readonly form = new FormGroup({
    fileName: new FormControl('', [Validators.required, fileExtensionValidator(['.png', 'jpg'])]),
    files: new FormControl<FileSelection>(null, [fileExtensionValidator(['.png', 'jpg'])]),
  });

  readonly selectedNames = signal<readonly string[]>([]);

  readonly firstTaskCode = highlight(`import {ChangeDetectionStrategy, Component} from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {ClarityModule} from '@clr/angular';
import {FileSelection, fileExtensionValidator} from 'ngx-lift';

@Component({
  selector: 'app-upload-form',
  imports: [ClarityModule, ReactiveFormsModule],
  templateUrl: './upload-form.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UploadFormComponent {
  form = new FormGroup({
    fileName: new FormControl('', [Validators.required, fileExtensionValidator(['.png', 'jpg'])]),
    files: new FormControl<FileSelection>(null, [fileExtensionValidator(['.png', 'jpg'])]),
  });

  onFiles(event: Event): void {
    if (this.form.disabled) {
      return;
    }
    const files = (event.target as HTMLInputElement).files;
    this.form.controls.files.setValue(files);
  }

  reset(fileInput: HTMLInputElement): void {
    this.form.reset({fileName: '', files: null});
    fileInput.value = '';
  }
}`);

  readonly firstTaskHtml = highlight(`<form [formGroup]="form" clrForm>
  <clr-input-container>
    <label for="file-name">File name</label>
    <input id="file-name" clrInput formControlName="fileName" />
    <clr-control-error *clrIfError="'required'">Required</clr-control-error>
    <clr-control-error *clrIfError="'invalidFileExtension'">Use a .png or .jpg file</clr-control-error>
  </clr-input-container>
  <label for="files">Select files</label>
  <input #fileInput id="files" type="file" multiple [disabled]="form.disabled" (change)="onFiles($event)" />
  <button type="button" (click)="reset(fileInput)">Clear</button>
</form>`);

  readonly basicUsageCode = highlight(`import {FormControl, FormGroup, Validators} from '@angular/forms';
import {fileExtensionValidator} from 'ngx-lift';

const form = new FormGroup({
  fileName: new FormControl('', [Validators.required, fileExtensionValidator(['.png', 'jpg'])]),
});

form.controls.fileName.setValue('photo.PNG'); // valid
form.controls.fileName.setValue('notes.txt'); // hasError('invalidFileExtension') === true`);

  readonly advancedCode = highlight(`import {FormControl, FormGroup, Validators} from '@angular/forms';
import {FileSelection, fileExtensionValidator} from 'ngx-lift';

const backup = new FormGroup({
  archive: new FormControl<FileSelection>(null, [Validators.required, fileExtensionValidator('tar.gz')]),
});

// A FileList from <input type="file" multiple>, an array of files, a single
// file, or a file name string are all accepted. The suffix check is
// case-insensitive and supports compound suffixes such as .tar.gz.`);

  readonly signatureCode = highlight(
    `fileExtensionValidator(allowedExtensions: string | readonly string[]): ValidatorFn;`,
  );

  get isDisabled(): boolean {
    return this.form.disabled;
  }

  onFiles(event: Event): void {
    if (this.form.disabled) {
      return;
    }
    const files = (event.target as HTMLInputElement).files;
    this.form.controls.files.setValue(files);
    this.selectedNames.set(Array.from(files ?? []).map((file) => file.name));
  }

  reset(fileInput?: HTMLInputElement): void {
    this.form.reset({fileName: '', files: null});
    this.selectedNames.set([]);
    if (fileInput) {
      fileInput.value = '';
    }
  }

  toggleDisabled(): void {
    if (this.form.disabled) {
      this.form.enable();
    } else {
      this.form.disable();
    }
  }
}
