import {ChangeDetectionStrategy, Component} from '@angular/core';
import {CalloutComponent, PageContainerComponent} from 'clr-lift';

import {CodeBlockComponent} from '../../../../shared/components/code-block/code-block.component';
import {highlight} from '../../../../shared/utils/highlight.util';

@Component({
  selector: 'app-pick-by',
  standalone: true,
  imports: [PageContainerComponent, CalloutComponent, CodeBlockComponent],
  templateUrl: './pick-by.component.html',
  styleUrl: './pick-by.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PickByComponent {
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
}
