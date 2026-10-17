import {IsHttpsPipe} from 'ngx-lift';
import {ChangeDetectionStrategy, Component, computed, inject} from '@angular/core';
import {PageContainerComponent, TranslatePipe, TranslationService} from 'clr-lift';

import {ApiProperty, ApiTableComponent} from '../../../../shared/components/api-table';
import {CodeBlockComponent} from '../../../../shared/components/code-block/code-block.component';
import {highlight} from '../../../../shared/utils/highlight.util';

@Component({
  selector: 'app-is-https-pipe',
  imports: [IsHttpsPipe, CodeBlockComponent, PageContainerComponent, TranslatePipe, ApiTableComponent],
  templateUrl: './is-https-pipe.component.html',
  styleUrl: './is-https-pipe.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IsHttpsPipeComponent {
  readonly firstTaskCode = highlight(`import {ChangeDetectionStrategy, Component} from '@angular/core';
import {IsHttpsPipe} from 'ngx-lift';

@Component({
  selector: 'app-pipe-example',
  imports: [IsHttpsPipe],
  template: \`<p>{{ 'https://example.com' | isHttps }}</p>\`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PipeExampleComponent {}
// Output: true
// Checks URL syntax and protocol; it does not test TLS certificates or endpoint trust.`);
  private translationService = inject(TranslationService);

  parameters = computed<ApiProperty[]>(() => {
    this.translationService.currentLanguage();
    return [
      {
        name: 'value',
        type: 'string',
        description: this.translationService.translate('isHttpsPipe.paramValue'),
      },
    ];
  });
  basicExampleCode = highlight(
    "import {ChangeDetectionStrategy, Component} from '@angular/core';\n\nimport {IsHttpsPipe} from 'ngx-lift';\n\n@Component({\n  changeDetection: ChangeDetectionStrategy.OnPush,\n  imports: [IsHttpsPipe],\n  template: `\n    <p>{{ 'https://www.example.com' | isHttps }}</p>\n    <!-- Output: true -->\n\n    <p>{{ 'http://www.example.com' | isHttps }}</p>\n    <!-- Output: false -->\n  `,\n})\nexport class IsHttpsExampleComponent {}",
  );

  conditionalRenderingCode = highlight(`import {ChangeDetectionStrategy, Component} from '@angular/core';

import {IsHttpsPipe} from 'ngx-lift';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [IsHttpsPipe],
  template: \`
    @if (url | isHttps) {
      <p>HTTPS</p>
    } @else {
      <p>Please use HTTPS</p>
    }
  \`,
})
export class UrlExampleComponent {
  readonly url = 'https://example.com';
}
// A protocol label does not verify certificate validity or endpoint trust.`);

  securityValidationCode = highlight(`import {ChangeDetectionStrategy, Component} from '@angular/core';

import {IsHttpsPipe} from 'ngx-lift';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [IsHttpsPipe],
  template: \`
    <div>
      <span>{{ url }}</span>
      @if (url | isHttps) {
        <span>HTTPS</span>
      }
    </div>
  \`,
})
export class UrlExampleComponent {
  readonly url = 'https://example.com';
}
// A protocol label does not verify certificate validity or endpoint trust.`);

  signatureCode = highlight(`transform(value: string): boolean;`);
}
