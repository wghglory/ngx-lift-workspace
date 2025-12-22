import {ChangeDetectionStrategy, Component} from '@angular/core';
import {ClarityModule} from '@clr/angular';
import {CalloutComponent, PageContainerComponent} from 'clr-lift';

import {CodeBlockComponent} from '../../../shared/components/code-block/code-block.component';
import {highlight} from '../../../shared/utils/highlight.util';

@Component({
  selector: 'app-clr-datagrid-util',
  standalone: true,
  imports: [ClarityModule, PageContainerComponent, CalloutComponent, CodeBlockComponent],
  templateUrl: './clr-datagrid-util.component.html',
  styleUrl: './clr-datagrid-util.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ClrDatagridUtilComponent {
  pageQueryModelCode = highlight(`
export interface PageQuery {
  /**
   * The page number for pagination. Starts from 1.
   */
  page: number;

  /**
   * The number of items per page in the result set.
   */
  pageSize: number;

  /**
   * Optional: The field to sort in ascending order.
   */
  sortAsc?: string;

  /**
   * Optional: The field to sort in descending order.
   */
  sortDesc?: string;

  /**
   * Optional: The filter criteria in FIQL (Feed Item Query Language) format.
   * Example: name==*term*;enabled==false
   */
  filter?: string;
}
`);

  stateCode = highlight(`
// Clarity Datagrid state example
{
  "page": {"from": 0, "to": 9, "size": 10, "current": 1},
  "sort": {"by": "date", "reverse": false},
  "filters": [
    {"property": "name", "value": "mike"},
    {"property": "job", "value": "programming"}
  ]
}
  `);

  outputCode = highlight(`
// output data returned by convertToHttpParams
{
  "page": 1,
  "pageSize": 10,
  "filter": "name==*mike*;job==*programming*",
  "sortAsc": "date"
}
    `);
}
