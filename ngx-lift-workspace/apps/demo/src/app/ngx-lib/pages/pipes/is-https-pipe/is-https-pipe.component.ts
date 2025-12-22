import {ChangeDetectionStrategy, Component} from '@angular/core';
import {RouterLink} from '@angular/router';
import {CalloutComponent, PageContainerComponent} from 'clr-lift';

import {CodeBlockComponent} from '../../../../shared/components/code-block/code-block.component';
import {highlight} from '../../../../shared/utils/highlight.util';

@Component({
  selector: 'app-is-https-pipe',
  standalone: true,
  imports: [CodeBlockComponent, PageContainerComponent, CalloutComponent, RouterLink],
  templateUrl: './is-https-pipe.component.html',
  styleUrl: './is-https-pipe.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IsHttpsPipeComponent {
  exampleCode = highlight(`
import {IsHttpsPipe} from 'ngx-lift';

@Component({
  standalone: true,
  imports: [IsHttpsPipe],
  template: \`
    <p>{{ 'https://www.example.com' | isHttps }}</p>
    <!-- Output: true -->

    <p>{{ 'http://www.example.com' | isHttps }}</p>
    <!-- Output: false -->

    @if(url | isHttps) {
      <child-component [url]="url" />
    }
  \`
})
export class IsHttpsPipeDemoComponent {
  url = 'https://url-to-be-passed-into-a-child-component-only-when-url-matches-https.com';
}
  `);
}
