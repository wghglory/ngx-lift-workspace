import {Injectable} from '@angular/core';
import {BehaviorSubject, map} from 'rxjs';

import {CreatedToast, Toast} from './toast.type';

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  private toastsBS = new BehaviorSubject<CreatedToast[]>([]);
  toasts$ = this.toastsBS.asObservable().pipe(
    map((toasts) => {
      return toasts.map((toast) => ({
        ...toast,
      }));
    }),
  );

  addToast(toast: Toast) {
    const newToast = this.createToast(toast);

    this.toastsBS.next([newToast, ...this.toastsBS.value]);

    return newToast;
  }

  success(toast: Toast) {
    const newToast = this.createToast({...toast, toastType: 'success'});

    this.toastsBS.next([newToast, ...this.toastsBS.value]);

    return newToast;
  }
  warning(toast: Toast) {
    const newToast = this.createToast({...toast, toastType: 'warning'});

    this.toastsBS.next([newToast, ...this.toastsBS.value]);

    return newToast;
  }
  info(toast: Toast) {
    const newToast = this.createToast({...toast, toastType: 'info'});

    this.toastsBS.next([newToast, ...this.toastsBS.value]);

    return newToast;
  }
  error(toast: Toast) {
    const newToast = this.createToast({...toast, toastType: 'error'});

    this.toastsBS.next([newToast, ...this.toastsBS.value]);

    return newToast;
  }

  deleteToast(id: symbol) {
    const toast = this.toastsBS.value.find((toast) => toast.id === id);

    if (toast) {
      this.toastsBS.next(this.toastsBS.value.filter((toast) => toast.id !== id));
    }
  }

  clearToasts() {
    this.toastsBS.next([]);
  }

  private createToast(toast: Toast): CreatedToast {
    return {
      ...toast,
      id: Symbol(),
      toastType: toast.toastType ?? 'info',
    };
  }
}
