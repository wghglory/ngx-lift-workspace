import {ChangeDetectionStrategy, Component, computed, inject} from '@angular/core';
import {CalloutComponent, PageContainerComponent, TranslatePipe, TranslationService} from 'clr-lift';
import {RangePipe} from 'ngx-lift';

import {ApiProperty, ApiTableComponent} from '../../../../shared/components/api-table';
import {CodeBlockComponent} from '../../../../shared/components/code-block/code-block.component';
import {highlight} from '../../../../shared/utils/highlight.util';

@Component({
  selector: 'app-range-pipe',
  imports: [CodeBlockComponent, PageContainerComponent, CalloutComponent, RangePipe, TranslatePipe, ApiTableComponent],
  templateUrl: './range-pipe.component.html',
  styleUrl: './range-pipe.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RangePipeComponent {
  private translationService = inject(TranslationService);

  parameters = computed<ApiProperty[]>(() => {
    this.translationService.currentLanguage();
    return [
      {
        name: 'value',
        type: '[number] | [number, number] | [number, number, number] | [number, number, number, boolean]',
        description: this.translationService.translate('rangePipe.paramValue'),
      },
    ];
  });
  basicExampleCode = highlight(`import {Component} from '@angular/core';

import {RangePipe} from 'ngx-lift';

@Component({
  imports: [RangePipe],
  template: \`
    <p>{{ [1, 5] | range }}</p>
    <!-- Output: [1,2,3,4] -->

    <p>{{ [10, 5] | range }}</p>
    <!-- Output: [10,9,8,7,6] (start is bigger than end) -->
  \`,
})
export class RangeExampleComponent {}`);

  stepExampleCode = highlight(`import {Component} from '@angular/core';

import {RangePipe} from 'ngx-lift';

@Component({
  imports: [RangePipe],
  template: \`
    <p>{{ [1, 5, 2] | range }}</p>
    <!-- Output: [1,3] (step by 2) -->
  \`,
})
export class RangeStepExampleComponent {}`);

  reverseExampleCode = highlight(`import {Component} from '@angular/core';

import {RangePipe} from 'ngx-lift';

@Component({
  imports: [RangePipe],
  template: \`
    <p>{{ [1, 5, 1, true] | range }}</p>
    <!-- Output: [4,3,2,1] (reverse the array) -->
  \`,
})
export class RangeReverseExampleComponent {}`);

  signatureCode = highlight(`transform(value: [number]): number[];
transform(value: [number, number]): number[];
transform(value: [number, number, number]): number[];
transform(value: [number, number, number, boolean]): number[];`);

  cpuCode = highlight(`import {Component} from '@angular/core';

import {RangePipe} from 'ngx-lift';

@Component({
  imports: [RangePipe],
  template: \`
    <div class="space-x-6">
      <label for="cpu-count">Choose CPU count</label>
      <select id="cpu-count">
        @for (count of [1, 5] | range; track $index) {
          <option [value]="count">{{ count }} CPU(s)</option>
        }
      </select>
    </div>
  \`,
})`);
}
