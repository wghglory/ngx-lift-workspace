import {ChangeDetectionStrategy, Component, signal} from '@angular/core';
import {ConfirmModalComponent, PageContainerComponent} from 'clr-lift';
import {delay, Observable, of, throwError} from 'rxjs';

import {CodeBlockComponent} from '../../../shared/components/code-block/code-block.component';
import {highlight} from '../../../shared/utils/highlight.util';

@Component({
  selector: 'app-confirm-modal-demo',
  imports: [CodeBlockComponent, ConfirmModalComponent, PageContainerComponent],
  templateUrl: './confirm-modal-demo.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConfirmModalDemoComponent {
  // Modal open states
  isDeleteModalOpen = signal(false);
  isPrimaryModalOpen = signal(false);
  isErrorModalOpen = signal(false);

  // Status message
  lastActionMessage = signal<string>('No action completed yet.');

  // Async actions
  deleteAction$: Observable<unknown> = of({deleted: true, id: 'db-production-01'}).pipe(delay(800));

  promoteAction$: Observable<unknown> = of({promoted: true, version: 'v2.4.0'}).pipe(delay(600));

  failingAction$: Observable<unknown> = of(null).pipe(delay(600), () =>
    throwError(() => new Error('Service Unavailable: Unable to lock remote database instance.')),
  );

  onDeleteCompleted(result: unknown): void {
    this.lastActionMessage.set(`Delete successful: ${JSON.stringify(result)}`);
  }

  onPromoteCompleted(result: unknown): void {
    this.lastActionMessage.set(`Promotion successful: ${JSON.stringify(result)}`);
  }

  openDeleteModal(): void {
    this.isDeleteModalOpen.set(true);
  }

  openPrimaryModal(): void {
    this.isPrimaryModalOpen.set(true);
  }

  openErrorModal(): void {
    this.isErrorModalOpen.set(true);
  }

  basicExampleCode = highlight(`
import {ConfirmModalComponent} from 'clr-lift';
import {Component, signal} from '@angular/core';
import {of, delay} from 'rxjs';

@Component({
  imports: [ConfirmModalComponent],
  template: \`
    <button class="btn btn-danger" (click)="openModal.set(true)">
      Delete Database
    </button>

    <cll-confirm-modal
      [(open)]="openModal"
      title="Delete Database"
      toastHeader="Database Deleted"
      toastDescription="The database cluster was successfully terminated."
      [action$]="deleteAction$"
      confirmButtonText="Delete"
      confirmButtonClass="btn-danger"
      (completed)="onDeleted($event)"
    >
      <p>Are you sure you want to permanently delete this database cluster?</p>
    </cll-confirm-modal>
  \`
})
export class ConfirmModalExampleComponent {
  openModal = signal(false);
  deleteAction$ = of({status: 'ok'}).pipe(delay(800));

  onDeleted(result: unknown) {
    console.log('Action complete:', result);
  }
}
  `);

  errorExampleCode = highlight(`
<!-- When action$ errors, the error is displayed inline and modal remains open -->
<cll-confirm-modal
  [(open)]="openErrorModal"
  title="Risky Migration"
  [action$]="failingAction$"
  confirmButtonText="Execute Migration"
>
  <p>Run schema migration against primary database node.</p>
</cll-confirm-modal>
  `);
}
