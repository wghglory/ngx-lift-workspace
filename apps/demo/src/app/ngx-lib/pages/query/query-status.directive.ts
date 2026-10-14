import {Directive, input} from '@angular/core';
import {QueryStatus} from 'ngx-lift';

/** Use the same Clarity labels for query and mutation state throughout the guide. */
@Directive({
  selector: '[appQueryStatus]',
  host: {
    class: 'label',
    '[class.label-success]': 'appQueryStatus() === "resolved"',
    '[class.label-info]': 'appQueryStatus() === "loading" || appQueryStatus() === "reloading"',
    '[class.label-danger]': 'appQueryStatus() === "error"',
  },
})
export class QueryStatusDirective {
  readonly appQueryStatus = input.required<QueryStatus>();
}
