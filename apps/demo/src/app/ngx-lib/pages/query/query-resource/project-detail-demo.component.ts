import {ChangeDetectionStrategy, Component, inject, input} from '@angular/core';
import {AlertComponent, SpinnerComponent, TranslatePipe} from 'clr-lift';
import {queryResource} from 'ngx-lift';

import {QueryStatusDirective} from '../query-status.directive';
import {ProjectService} from './project.service';

export const PROJECT_DETAIL_TEMPLATE = `
  @if (projectQuery.isInitialLoading()) {
    <cll-spinner inline size="sm" />
  } @else if (projectQuery.value(); as project) {
    <div cds-layout="vertical gap:sm">
      <h3>{{ project.name }}</h3>
      <p data-testid="project-revision">{{ 'queryResource.projectRevision' | translate }}: {{ project.revision }}</p>
      <span [appQueryStatus]="projectQuery.status()">{{ projectQuery.status() }}</span>
      @if (projectQuery.isRefreshing()) {
        <cll-spinner inline size="sm" />
      }
      <button type="button" class="btn btn-sm btn-outline" (click)="projectQuery.reload()">
        {{ 'common.refresh' | translate }}
      </button>
    </div>
  }
  @if (projectQuery.error(); as error) {
    <cll-alert [content]="error.message" [alertType]="'danger'" />
  }
`;

@Component({
  selector: 'app-project-detail-demo',
  imports: [AlertComponent, SpinnerComponent, TranslatePipe, QueryStatusDirective],
  template: PROJECT_DETAIL_TEMPLATE,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectDetailDemoComponent {
  private readonly projectService = inject(ProjectService);

  readonly projectId = input.required<string>();
  readonly projectQuery = queryResource(() => {
    const id = this.projectId();
    return {
      key: ['projects', id],
      loader: () => this.projectService.getProject(id),
      staleTime: 30_000,
    };
  });
}
