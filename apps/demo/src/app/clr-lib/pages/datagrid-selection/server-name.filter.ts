import {ClrDatagridFilterInterface} from '@clr/angular';
import {signal} from '@angular/core';
import {Subject} from 'rxjs';

import {type ServerOrganization} from './server-organization.data';

/** Native filter whose current query drives the server request; supplied rows are already filtered. */
export class ServerNameFilter implements ClrDatagridFilterInterface<ServerOrganization> {
  readonly changes = new Subject<void>();
  readonly query = signal('');
  isActive(): boolean {
    return !!this.query();
  }
  accepts(): boolean {
    return true;
  }
  /**
   * Applies the next non-empty name filter.
   * @param value Raw query input; surrounding white space is trimmed and empty input stays no-op.
   */
  set(value: string): void {
    const next = value.trim();
    if (next === this.query()) return;
    this.query.set(next);
    this.changes.next();
  }
  destroy(): void {
    this.changes.complete();
  }
}
