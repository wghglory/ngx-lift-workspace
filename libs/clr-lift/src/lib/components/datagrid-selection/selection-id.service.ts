import {APP_ID, inject, Injectable} from '@angular/core';

/** Application-scoped sequence: requests do not share module-global ID state during SSR. */
@Injectable({providedIn: 'root'})
export class SelectionIdService {
  private next = 0;
  private readonly appId = inject(APP_ID);
  allocate(): string {
    return `${this.appId}-datagrid-selection-${this.next++}`;
  }
}
