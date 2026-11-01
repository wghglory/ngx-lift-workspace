import {signal} from '@angular/core';
import type {ClrDatagridFilterInterface} from '@clr/angular';
import {Subject} from 'rxjs';
import type {Organization, Status} from './organization-example.data';

/** Status choices exposed by the reusable picker filter. */
export type StatusChoice = 'all' | Status;
/** Native Clarity status filter used by the reusable organization picker. */
export class StatusFilter implements ClrDatagridFilterInterface<Organization> {
  readonly changes = new Subject<void>();
  readonly value = signal<StatusChoice>('all');
  isActive(): boolean {
    return this.value() !== 'all';
  }
  accepts(item: Organization): boolean {
    return this.value() === 'all' || item.status === this.value();
  }
  set(value: StatusChoice): void {
    if (value === this.value()) return;
    this.value.set(value);
    this.changes.next();
  }
  destroy(): void {
    this.changes.complete();
  }
}
