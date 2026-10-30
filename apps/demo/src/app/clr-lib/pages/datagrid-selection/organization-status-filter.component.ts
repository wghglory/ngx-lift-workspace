import {ChangeDetectionStrategy, Component, effect, input} from '@angular/core';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {FormControl, ReactiveFormsModule} from '@angular/forms';
import {ClarityModule} from '@clr/angular';
import {TranslatePipe} from 'clr-lift';
import {STATUS_KEYS} from './organization-example.data';
import {StatusFilter, type StatusChoice} from './status.filter';
let nextFilterId = 0;

@Component({
  selector: 'app-organization-status-filter',
  imports: [ClarityModule, ReactiveFormsModule, TranslatePipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div clrForm clrLayout="vertical">
      <clr-select-container>
        <label [for]="filterId">{{ 'organizationExample.status' | translate }}</label>
        <select clrSelect [id]="filterId" [formControl]="choice">
          <option value="all">{{ 'organizationExample.allStatuses' | translate }}</option>
          <option value="ready">{{ statusKeys.ready | translate }}</option>
          <option value="maintenance">{{ statusKeys.maintenance | translate }}</option>
        </select>
      </clr-select-container>
    </div>
  `,
})
export class OrganizationStatusFilterComponent {
  readonly filter = input.required<StatusFilter>();
  readonly choice = new FormControl<StatusChoice>('all', {nonNullable: true});
  readonly filterId = `organization-status-filter-${nextFilterId++}`;
  readonly statusKeys = STATUS_KEYS;
  constructor() {
    // Reset/model changes update the select without echoing another filter-change event.
    effect(() => this.choice.setValue(this.filter().value(), {emitEvent: false}));
    this.choice.valueChanges.pipe(takeUntilDestroyed()).subscribe((value) => this.filter().set(value));
  }
}
