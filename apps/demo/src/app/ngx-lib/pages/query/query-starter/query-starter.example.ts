/** TypeScript and HTML tabs mirror the compiled starter files. */
export const QUERY_STARTER_SOURCE = `import {ChangeDetectionStrategy, Component, signal} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {ClarityModule} from '@clr/angular';
import {AlertComponent, SpinnerComponent, TranslatePipe} from 'clr-lift';
import {queryResource} from 'ngx-lift';
import {map, timer} from 'rxjs';

interface Team {
  id: string;
  name: string;
  revision: number;
}

/** A complete read example; timer simulates the HTTP request so the preview runs locally. */
@Component({
  selector: 'app-query-starter',
  imports: [FormsModule, ClarityModule, AlertComponent, SpinnerComponent, TranslatePipe],
  templateUrl: './query-starter.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class QueryStarterComponent {
  readonly teamId = signal('a');
  readonly simulateFailure = signal(false);
  private revision = 0;

  readonly teamQuery = queryResource<Team>(() => {
    const id = this.teamId();
    return {
      key: ['query-starter', id],
      // This simulated transport belongs to this component instance.
      gcTime: 0,
      cancelOnNoObservers: true,
      loader: () => {
        const fail = this.simulateFailure();
        const revision = ++this.revision;
        return timer(350).pipe(
          map(() => {
            if (fail) throw new Error('Simulated read failure');
            return {id, name: id === 'a' ? 'Atlas' : 'Beacon', revision};
          }),
        );
      },
    };
  });
}`;

export const QUERY_STARTER_TEMPLATE = `<div cds-layout="vertical gap:sm">
  <div class="btn-group">
    <button type="button" class="btn btn-sm" (click)="teamId.set('a')">{{ 'queryLearn.teamA' | translate }}</button>
    <button type="button" class="btn btn-sm" (click)="teamId.set('b')">{{ 'queryLearn.teamB' | translate }}</button>
  </div>
  <clr-checkbox-container>
    <clr-checkbox-wrapper>
      <input type="checkbox" clrCheckbox [ngModel]="simulateFailure()" (ngModelChange)="simulateFailure.set($event)" />
      <label>{{ 'queryLearn.simulateFailure' | translate }}</label>
    </clr-checkbox-wrapper>
  </clr-checkbox-container>
  @if (teamQuery.isInitialLoading()) {
    <p role="status"><cll-spinner inline size="sm" /> {{ 'queryResource.loading' | translate }}</p>
  }
  @if (teamQuery.value(); as team) {
    <p data-testid="starter-team">
      {{ team.name }} · {{ 'queryResource.projectRevision' | translate }}: {{ team.revision }}
    </p>
  }
  @if (teamQuery.isRefreshing()) {
    <p role="status"><cll-spinner inline size="sm" /> {{ 'queryResource.revalidatingAlert' | translate }}</p>
  }
  @if (teamQuery.error()) {
    <cll-alert
      [content]="'queryLearn.readError' | translate"
      [alertType]="teamQuery.isRefreshError() ? 'warning' : 'danger'"
    />
  }
  <button type="button" class="btn btn-sm btn-outline" [disabled]="teamQuery.isLoading()" (click)="teamQuery.reload()">
    {{ 'common.refresh' | translate }}
  </button>
</div>`;
