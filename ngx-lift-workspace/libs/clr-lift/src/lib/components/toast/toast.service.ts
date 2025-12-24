import {Injectable} from '@angular/core';
import {BehaviorSubject, map} from 'rxjs';

import {CreatedToast, Toast} from './toast.type';

/**
 * Service for managing toast notifications throughout the application.
 * Provides methods to create, display, and manage toast notifications with various types.
 *
 * Toasts are displayed in a toast container and can be automatically dismissed after a timeout
 * or manually closed by the user.
 */
@Injectable({
  providedIn: 'root',
})
export class ToastService {
  private toastsBS = new BehaviorSubject<CreatedToast[]>([]);

  /**
   * Observable stream of all active toast notifications.
   * Emits an array of CreatedToast objects whenever the toast list changes.
   */
  toasts$ = this.toastsBS.asObservable().pipe(
    map((toasts) => {
      return toasts.map((toast) => ({
        ...toast,
      }));
    }),
  );

  /**
   * Adds a new toast notification to the toast list.
   *
   * @param toast - The toast configuration to add.
   * @returns The created toast with all required properties and a unique ID.
   *
   * @example
   * ```typescript
   * toastService.addToast({
   *   title: 'Operation Complete',
   *   description: 'Your changes have been saved successfully.',
   *   toastType: 'success'
   * });
   * ```
   */
  addToast(toast: Toast) {
    const newToast = this.createToast(toast);

    this.toastsBS.next([newToast, ...this.toastsBS.value]);

    return newToast;
  }

  /**
   * Creates and displays a success toast notification.
   *
   * @param toast - The toast configuration (toastType will be set to 'success').
   * @returns The created toast notification.
   */
  success(toast: Toast) {
    const newToast = this.createToast({...toast, toastType: 'success'});

    this.toastsBS.next([newToast, ...this.toastsBS.value]);

    return newToast;
  }

  /**
   * Creates and displays a warning toast notification.
   *
   * @param toast - The toast configuration (toastType will be set to 'warning').
   * @returns The created toast notification.
   */
  warning(toast: Toast) {
    const newToast = this.createToast({...toast, toastType: 'warning'});

    this.toastsBS.next([newToast, ...this.toastsBS.value]);

    return newToast;
  }

  /**
   * Creates and displays an info toast notification.
   *
   * @param toast - The toast configuration (toastType will be set to 'info').
   * @returns The created toast notification.
   */
  info(toast: Toast) {
    const newToast = this.createToast({...toast, toastType: 'info'});

    this.toastsBS.next([newToast, ...this.toastsBS.value]);

    return newToast;
  }

  /**
   * Creates and displays an error toast notification.
   *
   * @param toast - The toast configuration (toastType will be set to 'error').
   * @returns The created toast notification.
   */
  error(toast: Toast) {
    const newToast = this.createToast({...toast, toastType: 'error'});

    this.toastsBS.next([newToast, ...this.toastsBS.value]);

    return newToast;
  }

  /**
   * Deletes a toast notification by its unique identifier.
   *
   * @param id - The unique symbol identifier of the toast to delete.
   */
  deleteToast(id: symbol) {
    const toast = this.toastsBS.value.find((toast) => toast.id === id);

    if (toast) {
      this.toastsBS.next(this.toastsBS.value.filter((toast) => toast.id !== id));
    }
  }

  /**
   * Clears all toast notifications.
   */
  clearToasts() {
    this.toastsBS.next([]);
  }

  /**
   * Creates a toast notification with all required properties.
   * Assigns a unique ID and sets default toastType if not provided.
   *
   * @param toast - The toast configuration.
   * @returns A CreatedToast with all required properties.
   */
  private createToast(toast: Toast): CreatedToast {
    return {
      ...toast,
      id: Symbol(),
      toastType: toast.toastType ?? 'info',
    };
  }
}
