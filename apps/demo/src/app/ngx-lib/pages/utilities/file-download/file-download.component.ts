import {ChangeDetectionStrategy, Component, signal} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {ClarityModule} from '@clr/angular';
import {PageContainerComponent} from 'clr-lift';
import {downloadFile} from 'ngx-lift';

import {CodeBlockComponent} from '../../../../shared/components/code-block/code-block.component';
import {highlight} from '../../../../shared/utils/highlight.util';

@Component({
  selector: 'app-file-download',
  imports: [PageContainerComponent, CodeBlockComponent, ClarityModule, FormsModule],
  templateUrl: './file-download.component.html',
  styleUrl: './file-download.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FileDownloadComponent {
  fileName = signal('export-data.json');
  fileContent = signal(`{
  "project": "ngx-lift",
  "exportedAt": "${new Date().toISOString()}",
  "features": ["signals", "operators", "pipes", "validators", "utilities"]
}`);

  codeSnippet = highlight(`
import {downloadFile} from 'ngx-lift';

// Download text or JSON
downloadFile('{"status":"ok"}', 'config.json', 'application/json');

// Download a generated Blob
const blob = new Blob(['name,role\\nAlice,Admin'], {type: 'text/csv'});
downloadFile(blob, 'users.csv');
  `);

  handleDownload(): void {
    downloadFile(this.fileContent(), this.fileName(), 'application/json');
  }
}
