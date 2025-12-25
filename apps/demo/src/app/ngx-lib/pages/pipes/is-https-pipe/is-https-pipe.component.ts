import {ChangeDetectionStrategy, Component} from '@angular/core';
import {PageContainerComponent} from 'clr-lift';

import {CodeBlockComponent} from '../../../../shared/components/code-block/code-block.component';
import {highlight} from '../../../../shared/utils/highlight.util';

@Component({
  selector: 'app-is-https-pipe',
  imports: [CodeBlockComponent, PageContainerComponent],
  templateUrl: './is-https-pipe.component.html',
  styleUrl: './is-https-pipe.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IsHttpsPipeComponent {
  basicExampleCode = highlight(`
import {IsHttpsPipe} from 'ngx-lift';

@Component({
  imports: [IsHttpsPipe],
  template: \`
    <p>{{ 'https://www.example.com' | isHttps }}</p>
    <!-- Output: true -->

    <p>{{ 'http://www.example.com' | isHttps }}</p>
    <!-- Output: false -->
  \`
})
export class IsHttpsExampleComponent {}
  `);

  conditionalRenderingCode = highlight(`
import {IsHttpsPipe} from 'ngx-lift';

@Component({
  imports: [IsHttpsPipe],
  template: \`
    @if(url | isHttps) {
      <secure-component [url]="url" />
    } @else {
      <p>Please use HTTPS</p>
    }
  \`
})
  `);

  securityValidationCode = highlight(`
import {IsHttpsPipe} from 'ngx-lift';

@Component({
  imports: [IsHttpsPipe],
  template: \`
    <div>
      <span>{{ url }}</span>
      @if(url | isHttps) {
        <cds-icon shape="shield" status="success" />
      }
    </div>
  \`
})
  `);

  signatureCode = highlight(`
transform(value: string): boolean
  `);
}
