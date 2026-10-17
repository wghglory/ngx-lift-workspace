import {ChangeDetectionStrategy, Component, signal} from '@angular/core';
import {TranslatePipe} from 'clr-lift';
import {queryResources} from 'ngx-lift';
import {map, timer} from 'rxjs';

export const COLLECTION_STARTER_TEMPLATE = `
      <div cds-layout="vertical gap:sm">
        <div class="query-actions">
          <button type="button" class="btn btn-sm btn-outline" (click)="selectedTenants.set(['a'])">
            {{ 'queryExamples.one' | translate }}
          </button>
          <button type="button" class="btn btn-sm btn-outline" (click)="selectedTenants.set(['a', 'b'])">
            {{ 'queryExamples.both' | translate }}
          </button>
          <button type="button" class="btn btn-sm btn-outline" (click)="selectedTenants.set(['b', 'a'])">
            {{ 'queryExamples.reverse' | translate }}
          </button>
          <button type="button" class="btn btn-sm btn-outline" (click)="selectedTenants.set([])">
            {{ 'queryExamples.empty' | translate }}
          </button>
        </div>
        @for (query of tenantQueries(); track query.key) {
          <div class="query-state" data-testid="query-demo-dynamic-row">
            <span>{{ query.value()?.nameKey ?? 'queryExamples.tenant' | translate }}</span>
            <span class="label" [class.label-success]="query.status() === 'resolved'">{{ query.status() }}</span>
          </div>
        } @empty {
          <p role="status">{{ 'queryGuide.empty' | translate }}</p>
        }
      </div>
`;

/** Independent local reads demonstrate collection identity without requiring an HTTP server. */
@Component({
  selector: 'app-collection-starter',
  imports: [TranslatePipe],
  template: COLLECTION_STARTER_TEMPLATE,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CollectionStarterComponent {
  readonly selectedTenants = signal(['a']);
  readonly tenantQueries = queryResources(this.selectedTenants, (id) => ({
    key: ['collection-demo', id, 'tenant'],
    staleTime: 30_000,
    gcTime: 0,
    cancelOnNoObservers: true,
    loader: () =>
      timer(300).pipe(map(() => ({nameKey: id === 'a' ? 'queryExamples.tenantA' : 'queryExamples.tenantB'}))),
  }));
}
