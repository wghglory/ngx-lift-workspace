import {ChangeDetectionStrategy, Component, computed, inject} from '@angular/core';
import {PageContainerComponent, TranslatePipe, TranslationService} from 'clr-lift';

import {ApiProperty, ApiTableComponent} from '../../../../shared/components/api-table';
import {CodeBlockComponent} from '../../../../shared/components/code-block/code-block.component';
import {highlight} from '../../../../shared/utils/highlight.util';

@Component({
  selector: 'app-pick-by',
  imports: [PageContainerComponent, CodeBlockComponent, TranslatePipe, ApiTableComponent],
  templateUrl: './pick-by.component.html',
  styleUrl: './pick-by.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PickByComponent {
  private translationService = inject(TranslationService);

  pickByParameters = computed<ApiProperty[]>(() => {
    this.translationService.currentLanguage();
    return [
      {
        name: 'object',
        type: 'Record<string, T>',
        description: this.translationService.translate('pickBy.paramObject'),
      },
      {
        name: 'predicate',
        type: '(value: T, key: string) => boolean',
        description: this.translationService.translate('pickBy.paramPredicate'),
      },
    ];
  });

  omitByParameters = computed<ApiProperty[]>(() => {
    this.translationService.currentLanguage();
    return [
      {
        name: 'object',
        type: 'Record<string, T>',
        description: this.translationService.translate('omitBy.paramObject'),
      },
      {
        name: 'predicate',
        type: '(value: T, key: string) => boolean',
        description: this.translationService.translate('omitBy.paramPredicate'),
      },
    ];
  });
  pickByCode = highlight(`
import {pickBy} from 'ngx-lift';

const inputObject = {
  name: 'John',
  age: 25,
  city: 'New York',
  isActive: true,
};

const predicate = (value: unknown, key: string) => typeof value === 'string' || key === 'isActive';

const result = pickBy(inputObject, predicate);

// Output:
// {
//   name: 'John',
//   city: 'New York',
//   isActive: true,
// }
  `);

  omitByCode = highlight(`
import {omitBy} from 'ngx-lift';

const inputObject = {
  name: 'John',
  age: 25,
  city: 'New York',
  isActive: true,
};

const predicate = (value: unknown, key: string) => typeof value === 'string' || key === 'isActive';

const result = omitBy(inputObject, predicate);

// Output:
// {
//   age: 25,
// }
  `);

  pickBySignatureCode = highlight(`
pickBy<T>(object: Record<string, T>, predicate: (value: T, key: string) => boolean): Record<string, T>
  `);

  omitBySignatureCode = highlight(`
omitBy<T>(object: Record<string, T>, predicate: (value: T, key: string) => boolean): Record<string, T>
  `);
}
