import {ChangeDetectionStrategy, Component, signal} from '@angular/core';
import {TranslatePipe} from 'clr-lift';
import {queryResources} from 'ngx-lift';
import {map, timer} from 'rxjs';

/** Independent local reads demonstrate collection identity without requiring an HTTP server. */
@Component({
  selector: 'app-collection-starter',
  imports: [TranslatePipe],
  templateUrl: './collection-starter.component.html',
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
