import {HttpErrorResponse} from '@angular/common/http';
import {ChangeDetectionStrategy, Component, computed, inject, input, model, output} from '@angular/core';
import {ClarityModule} from '@clr/angular';
import {resourceAsync} from 'ngx-lift';
import {Observable} from 'rxjs';

import {TranslationService} from '../../services/translation.service';
import {AlertComponent} from '../alert/alert.component';
import {ToastService} from '../toast/toast.service';
import {ToastType} from '../toast/toast.type';
import {confirmModalTranslations} from './confirm-modal.l10n';

/**
 * A reusable modal dialog that wraps asynchronous confirmation workflows with built-in
 * loading indicators, inline error display, customizable styling, and optional success toast notifications.
 *
 * @example
 * ```html
 * <!-- Destructive deletion confirmation -->
 * <cll-confirm-modal
 *   [(open)]="isDeleteModalOpen"
 *   title="Delete Database Cluster"
 *   toastHeader="Database Deleted"
 *   toastDescription="The database cluster has been permanently removed."
 *   [action$]="deleteCluster$"
 *   confirmButtonText="Delete"
 *   confirmButtonClass="btn-danger"
 *   (completed)="onDeleted($event)"
 * >
 *   <p>Are you sure you want to delete this database? This operation cannot be reversed.</p>
 * </cll-confirm-modal>
 * ```
 */
@Component({
  selector: 'cll-confirm-modal',
  imports: [AlertComponent, ClarityModule],
  templateUrl: './confirm-modal.component.html',
  styleUrls: ['./confirm-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConfirmModalComponent {
  private toastService = inject(ToastService);
  private translationService = inject(TranslationService, {optional: true});

  /** Modal title displayed in the header. */
  readonly title = input.required<string>();

  /** Optional toast notification title displayed upon successful confirmation. */
  readonly toastHeader = input<string>();

  /** Optional toast notification description displayed upon successful confirmation. */
  readonly toastDescription = input<string>();

  /** Toast notification type. Defaults to `'success'`. */
  readonly toastType = input<ToastType>('success');

  /** Custom text for the confirmation action button. Defaults to localized 'Confirm'. */
  readonly confirmButtonText = input<string>();

  /** CSS class applied to the confirmation button (e.g. `'btn-danger'` or `'btn-primary'`). Defaults to `'btn-primary'`. */
  readonly confirmButtonClass = input<string>('btn-primary');

  /** Custom text for the cancel button. Defaults to localized 'Cancel'. */
  readonly cancelButtonText = input<string>();

  /** Observable emitting the async operation result. Executed upon user confirmation. */
  readonly action$ = input.required<Observable<unknown>>();

  /** Whether the modal can be closed via the close button (X) or backdrop. Defaults to `true`. */
  readonly closable = input<boolean>(true);

  /** Size of the modal ('sm', 'lg', 'xl', or empty string for default). Defaults to `''`. */
  readonly size = input<string>('');

  /** Two-way bindable open/close state of the modal. */
  readonly open = model<boolean>(false);

  /** Emitted with the result of the async action upon successful completion. */
  readonly completed = output<unknown>();

  /** Emitted when the modal is cancelled or closed without confirmation. */
  readonly cancelled = output<void>();

  constructor() {
    this.translationService?.loadTranslationsForComponent('ConfirmModal', confirmModalTranslations);
  }

  /** Async resource managing execution, loading state, and error handling. */
  readonly confirmRef = resourceAsync<unknown, HttpErrorResponse>(() => this.action$(), {
    lazy: true,
    behavior: 'exhaust',
    onSuccess: (data) => this.handleConfirmSuccess(data),
  });

  /** Loading state derived from async operation. */
  readonly isLoading = computed(() => this.confirmRef.isLoading());

  /** Inline error from async operation, if any occurred. */
  readonly error = computed(() => this.confirmRef.error() ?? null);

  /** Resolved text for the confirm button. */
  readonly resolvedConfirmText = computed(() => {
    const custom = this.confirmButtonText();
    if (custom) {
      return custom;
    }
    const translated = this.translationService?.translate('ConfirmModal.confirm');
    return translated && !translated.startsWith('!!') ? translated : 'Confirm';
  });

  /** Resolved text for the cancel button. */
  readonly resolvedCancelText = computed(() => {
    const custom = this.cancelButtonText();
    if (custom) {
      return custom;
    }
    const translated = this.translationService?.translate('ConfirmModal.cancel');
    return translated && !translated.startsWith('!!') ? translated : 'Cancel';
  });

  /** Closes the modal, resets any pending error, and emits `cancelled`. */
  cancel(): void {
    this.open.set(false);
    this.confirmRef.reset();
    this.cancelled.emit();
  }

  /** Executes the async confirmation action. */
  confirm(): void {
    this.confirmRef.execute();
  }

  private handleConfirmSuccess(data?: unknown): void {
    this.open.set(false);

    const header = this.toastHeader();
    if (header) {
      this.toastService.addToast({
        title: header,
        description: this.toastDescription() ?? '',
        toastType: this.toastType(),
      });
    }

    this.completed.emit(data);
  }
}
