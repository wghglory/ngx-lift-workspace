import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {ClarityModule} from '@clr/angular';
import {PageContainerComponent} from 'clr-lift';
import {distinctOnChange} from 'ngx-lift';
import {from} from 'rxjs';

import {CodeBlockComponent} from '../../../../shared/components/code-block/code-block.component';
import {UserCardListComponent} from '../../../../shared/components/user-card-list/user-card-list.component';
import {highlight} from '../../../../shared/utils/highlight.util';

@Component({
  selector: 'app-distinct-on-change',
  standalone: true,
  imports: [ClarityModule, PageContainerComponent, CodeBlockComponent, UserCardListComponent],
  templateUrl: './distinct-on-change.component.html',
  styleUrl: './distinct-on-change.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DistinctOnChangeComponent implements OnInit {
  data = [1, 1, 2, 2, 3, 4, 4, 5];

  ngOnInit() {
    from(this.data)
      .pipe(distinctOnChange((prev, curr) => console.log(`Value changes from ${prev} to: ${curr}`)))
      .subscribe();
  }

  tsCode = highlight(`
import {distinctOnChange} from 'ngx-lift';
// ... other imports

from([1, 1, 2, 2, 3, 4, 4, 5])
  .pipe(distinctOnChange((prev, curr) => console.log(\`Value changes from $\{prev} to: $\{curr}\`)))
  .subscribe();

// Output:

// Value changes from 1 to: 2
// Value changes from 2 to: 3
// Value changes from 3 to: 4
// Value changes from 4 to: 5
    `);
}
