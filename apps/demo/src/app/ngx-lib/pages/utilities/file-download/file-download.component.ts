import {ChangeDetectionStrategy, Component, computed, inject, signal} from '@angular/core';
import {ClarityModule} from '@clr/angular';
import {PageContainerComponent, TranslatePipe, ClrLiftI18nService} from 'clr-lift';
import {downloadFile} from 'ngx-lift';

import {ApiTableComponent} from '../../../../shared/components/api-table';
import {CodeBlockComponent} from '../../../../shared/components/code-block/code-block.component';
import {DemoPlaygroundComponent} from '../../../../shared/components/demo-playground/demo-playground.component';
import {highlight} from '../../../../shared/utils/highlight.util';
import {localizedApiParameters} from '../../../../shared/utils/localized-api-parameters.util';

type DownloadStatus = 'idle' | 'started';

@Component({
  selector: 'app-file-download',
  imports: [
    ClarityModule,
    PageContainerComponent,
    TranslatePipe,
    CodeBlockComponent,
    ApiTableComponent,
    DemoPlaygroundComponent,
  ],
  templateUrl: './file-download.component.html',
  styleUrl: './file-download.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FileDownloadComponent {
  private readonly translationService = inject(ClrLiftI18nService);

  readonly fileName = signal('report.txt');
  readonly content = signal('Hello from ngx-lift!\nThis file is created in the browser.');
  readonly status = signal<DownloadStatus>('idle');
  readonly startedName = signal('');

  readonly canStart = computed(() => this.fileName().trim().length > 0);

  readonly statusText = computed(() => {
    this.translationService.currentLanguage();
    return this.status() === 'started'
      ? this.translationService.translate('downloadFile.startedStatus', this.startedName())
      : '';
  });

  readonly parameters = localizedApiParameters(this.translationService, [
    {name: 'content', type: 'string | Blob', descriptionKey: 'downloadFile.paramContent'},
    {name: 'fileName', type: 'string', descriptionKey: 'downloadFile.paramFileName'},
    {name: 'mimeType', type: 'string', descriptionKey: 'downloadFile.paramMimeType'},
  ]);

  readonly signatureCode = highlight(
    `downloadFile(content: string | Blob, fileName: string, mimeType = 'text/plain;charset=utf-8'): void;`,
  );

  readonly firstTaskCode = highlight(`import {downloadFile} from 'ngx-lift';

const content = 'Hello from ngx-lift!';
const fileName = 'report.txt';
downloadFile(content, fileName);`);

  readonly advancedCode = highlight(`import {downloadFile} from 'ngx-lift';

const csv = new Blob(['name,role\\nAlice,Admin'], {type: 'text/csv'});
downloadFile(csv, 'users.csv');`);

  setFileName(value: string): void {
    this.fileName.set(value);
  }

  setContent(value: string): void {
    this.content.set(value);
  }

  start(): void {
    const name = this.fileName().trim();
    if (!name) {
      this.status.set('idle');
      return;
    }
    downloadFile(this.content(), name);
    this.startedName.set(name);
    this.status.set('started');
  }
}
