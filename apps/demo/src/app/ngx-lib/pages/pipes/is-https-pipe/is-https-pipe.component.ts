import {ChangeDetectionStrategy, Component, computed, inject} from '@angular/core';
import {PageContainerComponent, TranslatePipe, TranslationService} from 'clr-lift';

import {ApiProperty, ApiTableComponent} from '../../../../shared/components/api-table';
import {CodeBlockComponent} from '../../../../shared/components/code-block/code-block.component';
import {highlight} from '../../../../shared/utils/highlight.util';

@Component({
  selector: 'app-is-https-pipe',
  imports: [CodeBlockComponent, PageContainerComponent, TranslatePipe, ApiTableComponent],
  templateUrl: './is-https-pipe.component.html',
  styleUrl: './is-https-pipe.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IsHttpsPipeComponent {
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
  basicExampleCode = highlight(`import {Component} from '@angular/core';

import {IsHttpsPipe} from 'ngx-lift';

@Component({
  imports: [IsHttpsPipe],
  template: \`
    <p>{{ 'https://www.example.com' | isHttps }}</p>
    <!-- Output: true -->

    <p>{{ 'http://www.example.com' | isHttps }}</p>
    <!-- Output: false -->
  \`,
})
export class IsHttpsExampleComponent {}`);

  conditionalRenderingCode = highlight(`import {Component} from '@angular/core';

import {IsHttpsPipe} from 'ngx-lift';

@Component({
  imports: [IsHttpsPipe],
  template: \`
    @if (url | isHttps) {
      <secure-component [url]="url" />
    } @else {
      <p>Please use HTTPS</p>
    }
  \`,
})`);

  securityValidationCode = highlight(`import {Component} from '@angular/core';

import {IsHttpsPipe} from 'ngx-lift';

@Component({
  imports: [IsHttpsPipe],
  template: \`
    <div>
      <span>{{ url }}</span>
      @if (url | isHttps) {
        <clr-icon shape="shield" status="success" />
      }
    </div>
  \`,
})`);

  signatureCode = highlight(`transform(value: string): boolean;`);
}
