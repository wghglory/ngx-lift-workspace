import {signal} from '@angular/core';
import type {ClrDatagridFilterInterface} from '@clr/angular';
import {Subject} from 'rxjs';
import type {Organization, Status} from './organization-example.data';

export type StatusChoice = 'all' | Status;
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
