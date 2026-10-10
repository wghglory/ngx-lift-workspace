import {ChangeDetectionStrategy, Component, signal} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {ClarityModule} from '@clr/angular';
import {MaskedValueFieldComponent, PageContainerComponent} from 'clr-lift';

import {CodeBlockComponent} from '../../../../shared/components/code-block/code-block.component';
import {highlight} from '../../../../shared/utils/highlight.util';

@Component({
  selector: 'app-masked-value-field-demo',
  imports: [ClarityModule, FormsModule, MaskedValueFieldComponent, PageContainerComponent, CodeBlockComponent],
  templateUrl: './masked-value-field-demo.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MaskedValueFieldDemoComponent {
  password = signal('AdminP@ssw0rd!2026');
  apiSecret = signal('sec_live_98ab76cd54ef32ba10fe98dc');
  emptyValue = signal<string | null>(null);

  basicExampleCode = highlight(`
import {MaskedValueFieldComponent} from 'clr-lift';

@Component({
  imports: [MaskedValueFieldComponent],
  template: \`
    <cll-masked-value-field [value]="password" />
  \`
})
export class PasswordDisplayComponent {
  password = 'AdminP@ssw0rd!2026';
}
  `);

  copyableExampleCode = highlight(`
<cll-masked-value-field
  [value]="apiSecret"
  [copyable]="true"
  copyTooltip="Copy Secret Key"
/>
  `);

  customPlaceholderCode = highlight(`
<cll-masked-value-field
  [value]="null"
  emptyPlaceholder="No secret configured"
/>
  `);
}
