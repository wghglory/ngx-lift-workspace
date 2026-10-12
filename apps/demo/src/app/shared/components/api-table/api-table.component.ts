import {ChangeDetectionStrategy, Component, computed, input} from '@angular/core';
import {TranslatePipe} from 'clr-lift';

import {ApiProperty} from './api-table.model';

/** Renders documented API properties in a responsive table. */
@Component({
  selector: 'app-api-table',
  templateUrl: './api-table.component.html',
  styleUrl: './api-table.component.scss',
  imports: [TranslatePipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ApiTableComponent {
  properties = input.required<ApiProperty[]>();

  hasType = computed(() => this.properties().some((p) => !!p.type));
  hasDefault = computed(() => this.properties().some((p) => p.defaultValue !== undefined && p.defaultValue !== ''));
}
