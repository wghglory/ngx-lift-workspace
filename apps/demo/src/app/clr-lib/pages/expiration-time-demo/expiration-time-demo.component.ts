import {ChangeDetectionStrategy, Component} from '@angular/core';
import {ExpirationTimeComponent, PageContainerComponent} from 'clr-lift';

import {CodeBlockComponent} from '../../../shared/components/code-block/code-block.component';
import {highlight} from '../../../shared/utils/highlight.util';

@Component({
  selector: 'app-expiration-time-demo',
  imports: [CodeBlockComponent, ExpirationTimeComponent, PageContainerComponent],
  templateUrl: './expiration-time-demo.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExpirationTimeDemoComponent {
  // Dates for demos
  futureDateInDays = new Date(Date.now() + 1000 * 60 * 60 * 24 * 3 + 1000 * 60 * 60 * 4).toISOString();
  futureDateInHours = new Date(Date.now() + 1000 * 60 * 60 * 2 + 1000 * 60 * 15).toISOString();
  futureDateInSeconds = new Date(Date.now() + 1000 * 60 * 5 + 1000 * 30).toISOString();
  expiredDate = new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString();

  basicExampleCode = highlight(`
import {ExpirationTimeComponent} from 'clr-lift';
import {Component} from '@angular/core';

@Component({
  imports: [ExpirationTimeComponent],
  template: \`
    <!-- Future expiration date -->
    <cll-expiration-time [expiresAt]="futureDate" />

    <!-- Expired date with standard indicator -->
    <cll-expiration-time [expiresAt]="pastDate" />

    <!-- Missing / null date fallback -->
    <cll-expiration-time [expiresAt]="null" emptyPlaceholder="Never" />
  \`
})
export class ExpirationTimeExampleComponent {
  futureDate = new Date(Date.now() + 86400000 * 3).toISOString();
  pastDate = new Date(Date.now() - 86400000).toISOString();
}
  `);

  customExampleCode = highlight(`
<!-- Custom expired style and hiding seconds -->
<cll-expiration-time
  [expiresAt]="expiredDate"
  expiredClass="label label-danger"
/>

<!-- With seconds display when under 10 minutes -->
<cll-expiration-time
  [expiresAt]="futureDateInSeconds"
  [showSeconds]="true"
/>
  `);
}
