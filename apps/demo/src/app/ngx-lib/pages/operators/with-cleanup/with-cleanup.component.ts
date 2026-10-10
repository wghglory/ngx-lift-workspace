import {ChangeDetectionStrategy, Component, signal} from '@angular/core';
import {ClarityModule} from '@clr/angular';
import {PageContainerComponent} from 'clr-lift';
import {ResourceDeleteHandler, ResourceState, withCleanup} from 'ngx-lift';
import {delay, Observable, of, throwError} from 'rxjs';

import {CodeBlockComponent} from '../../../../shared/components/code-block/code-block.component';
import {highlight} from '../../../../shared/utils/highlight.util';

@Component({
  selector: 'app-with-cleanup',
  imports: [PageContainerComponent, ClarityModule, CodeBlockComponent],
  templateUrl: './with-cleanup.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WithCleanupComponent {
  logs = signal<string[]>([]);
  isRunning = signal(false);

  private deleteHandler: ResourceDeleteHandler = (res: ResourceState): Observable<unknown> => {
    this.addLog(`[Delete Handler] Deleting resource: ${res.name} (${res.type})`);
    return of(null).pipe(delay(200));
  };

  runSimulation(shouldFailMainOp: boolean): void {
    this.logs.set([]);
    this.isRunning.set(true);

    const resourceState: ResourceState = {
      name: 'new-tls-secret',
      type: 'secret',
      isNew: true,
      replacedOldName: 'old-tls-secret',
    };

    this.addLog('Step 1: Prepared new TLS secret and scheduled old TLS secret for deletion.');

    of(resourceState)
      .pipe(
        withCleanup(
          () =>
            shouldFailMainOp
              ? throwError(() => new Error('Service update failed: Pod rejected certificate')).pipe(delay(500))
              : of({status: 'Cluster Updated'}).pipe(delay(500)),
          this.deleteHandler,
        ),
      )
      .subscribe({
        next: (res) => {
          this.addLog(`[Success] Main operation completed: ${JSON.stringify(res)}`);
          this.addLog('[Cleanup] Successfully purged superseded resource (old-tls-secret).');
          this.isRunning.set(false);
        },
        error: (err: Error) => {
          this.addLog(`[Error] Main operation failed: ${err.message}`);
          this.addLog('[Rollback] Successfully deleted newly created resource (new-tls-secret).');
          this.isRunning.set(false);
        },
      });
  }

  private addLog(msg: string): void {
    this.logs.update((prev) => [...prev, `${new Date().toLocaleTimeString()} - ${msg}`]);
  }

  exampleCode = highlight(`
import {withCleanup, ResourceState, ResourceDeleteHandler} from 'ngx-lift';
import {of} from 'rxjs';

const deleteHandler: ResourceDeleteHandler = (resource: ResourceState) => {
  return deleteResource(resource.name);
};

const resource: ResourceState = {
  name: 'new-tls-secret',
  type: 'secret',
  isNew: true,
  replacedOldName: 'old-tls-secret',
};

of(resource).pipe(
  withCleanup(
    (res) => updateServiceWithSecret(res.name),
    deleteHandler
  )
).subscribe({
  next: () => console.log('Update succeeded; old-tls-secret was purged.'),
  error: (err) => console.error('Update failed; new-tls-secret was rolled back.'),
});
  `);

  signatureCode = highlight(`
function withCleanup<T, R>(
  project: (value: T) => Observable<R>,
  deleteHandler: ResourceDeleteHandler,
): (source$: Observable<T>) => Observable<R>
  `);
}
