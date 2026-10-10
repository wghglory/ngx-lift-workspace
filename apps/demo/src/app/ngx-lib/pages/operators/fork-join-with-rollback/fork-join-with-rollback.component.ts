import {ChangeDetectionStrategy, Component, signal} from '@angular/core';
import {ClarityModule} from '@clr/angular';
import {PageContainerComponent} from 'clr-lift';
import {forkJoinWithRollback, ResourceDeleteHandler, ResourceState} from 'ngx-lift';
import {delay, Observable, of, throwError} from 'rxjs';

import {CodeBlockComponent} from '../../../../shared/components/code-block/code-block.component';
import {highlight} from '../../../../shared/utils/highlight.util';

@Component({
  selector: 'app-fork-join-with-rollback',
  imports: [PageContainerComponent, ClarityModule, CodeBlockComponent],
  templateUrl: './fork-join-with-rollback.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ForkJoinWithRollbackComponent {
  logs = signal<string[]>([]);
  isRunning = signal(false);

  private deleteHandler: ResourceDeleteHandler = (res: ResourceState): Observable<unknown> => {
    this.addLog(`[Rollback] Deleting resource: ${res.name} (${res.type})`);
    return of(null).pipe(delay(200));
  };

  runSimulation(shouldFail: boolean): void {
    this.logs.set([]);
    this.isRunning.set(true);
    this.addLog('Starting parallel resource provisioning (Database Secret + ConfigMap)...');

    const secret$: Observable<ResourceState> = of({
      name: 'pg-credentials',
      type: 'secret',
      isNew: true,
    }).pipe(delay(300));

    const configMap$: Observable<ResourceState> = shouldFail
      ? throwError(() => new Error('Quota exceeded: Cannot create ConfigMap')).pipe(delay(500))
      : of({
          name: 'pg-config',
          type: 'configMap',
          isNew: true,
        }).pipe(delay(500));

    forkJoinWithRollback({secret: secret$, config: configMap$}, this.deleteHandler).subscribe({
      next: (results) => {
        this.addLog(`[Success] All resources provisioned: ${JSON.stringify(results)}`);
        this.isRunning.set(false);
      },
      error: (err: Error) => {
        this.addLog(`[Error] Execution aborted: ${err.message}`);
        this.addLog('[Automatic Rollback Complete] Orphaned resources cleaned up.');
        this.isRunning.set(false);
      },
    });
  }

  private addLog(msg: string): void {
    this.logs.update((prev) => [...prev, `${new Date().toLocaleTimeString()} - ${msg}`]);
  }

  exampleCode = highlight(`
import {forkJoinWithRollback, ResourceDeleteHandler, ResourceState} from 'ngx-lift';
import {of, throwError} from 'rxjs';

const deleteHandler: ResourceDeleteHandler = (resource: ResourceState) => {
  return deleteResourceApi(resource.name);
};

forkJoinWithRollback(
  {
    secret: createSecret$(),
    config: createConfigMap$(),
  },
  deleteHandler
).subscribe({
  next: (results) => console.log('Successfully created:', results),
  error: (err) => console.error('Failed! Succeeded resources were rolled back:', err),
});
  `);

  signatureCode = highlight(`
function forkJoinWithRollback<T>(
  sources: Record<string, Observable<unknown>> | Observable<unknown>[],
  deleteHandler: ResourceDeleteHandler,
): Observable<T>
  `);
}
