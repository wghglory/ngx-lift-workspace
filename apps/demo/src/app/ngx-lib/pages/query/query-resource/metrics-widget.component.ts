import {ChangeDetectionStrategy, Component, inject, input} from '@angular/core';
import {SpinnerComponent, TranslatePipe} from 'clr-lift';
import {queryResource} from 'ngx-lift';

import {QueryStatusDirective} from '../query-status.directive';
import {MetricsService} from './metrics.service';

@Component({
  selector: 'app-metrics-widget',
  imports: [SpinnerComponent, TranslatePipe, QueryStatusDirective],
  templateUrl: './metrics-widget.component.html',
  styleUrl: './metrics-widget.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MetricsWidgetComponent {
  private readonly metricsService = inject(MetricsService);

  readonly variant = input.required<'topbar' | 'dashboard'>();
  readonly metricsQuery = queryResource(() => ({
    key: ['metrics', 'cluster-overview'],
    loader: () => this.metricsService.getMetrics(),
    staleTime: 4000,
    gcTime: 0,
  }));
}
