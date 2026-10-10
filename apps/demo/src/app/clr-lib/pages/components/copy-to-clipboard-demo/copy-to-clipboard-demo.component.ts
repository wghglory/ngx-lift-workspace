import {ChangeDetectionStrategy, Component, signal} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {ClarityModule} from '@clr/angular';
import {CopyToClipboardComponent, PageContainerComponent} from 'clr-lift';

import {CodeBlockComponent} from '../../../../shared/components/code-block/code-block.component';
import {highlight} from '../../../../shared/utils/highlight.util';

@Component({
  selector: 'app-copy-to-clipboard-demo',
  imports: [ClarityModule, FormsModule, CopyToClipboardComponent, PageContainerComponent, CodeBlockComponent],
  templateUrl: './copy-to-clipboard-demo.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CopyToClipboardDemoComponent {
  sampleApiKey = signal('ak_live_8390fja093j109fj3109fj');
  lastCopied = signal<string>('');

  onCopied(val: string) {
    this.lastCopied.set(val);
  }

  basicExampleCode = highlight(`
import {CopyToClipboardComponent} from 'clr-lift';

@Component({
  imports: [CopyToClipboardComponent],
  template: \`
    <div class="flex items-center gap-2">
      <code>ak_live_8390fja093j109fj3109fj</code>
      <cll-copy-to-clipboard
        value="ak_live_8390fja093j109fj3109fj"
        tooltip="Copy API key"
        (copied)="onCopied($event)"
      />
    </div>
  \`
})
export class ApiKeyComponent {
  onCopied(val: string) {
    console.log('Copied:', val);
  }
}
  `);

  buttonTextExampleCode = highlight(`
<cll-copy-to-clipboard
  value="kubectl get pods -n kube-system"
  text="Copy Command"
  tooltip="Copy kubectl CLI snippet"
  size="sm"
/>
  `);

  disabledExampleCode = highlight(`
<cll-copy-to-clipboard
  value="https://internal.corp/admin"
  [disabled]="true"
  disabledTooltip="You do not have administrative permission to copy this URL"
/>
  `);
}
