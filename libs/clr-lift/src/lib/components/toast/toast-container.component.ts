import {CommonModule} from '@angular/common';
import {ChangeDetectionStrategy, Component, HostBinding, inject, input} from '@angular/core';

import {ToastComponent} from './toast.component';
import {ToastService} from './toast.service';
import {Toast} from './toast.type';

@Component({
  selector: 'cll-toast-container',
  templateUrl: './toast-container.component.html',
  styleUrls: ['./toast-container.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ToastComponent, CommonModule],
})
export class ToastContainerComponent {
  private toastService = inject(ToastService);

  timeoutSeconds = input(6); // If container doesn't provide timeoutSeconds, default to TIMEOUT_SECONDS
  manualClosable = input(true); // close icon shows if true, use can click it. Otherwise auto close, no manual close
  topOffset = input(0);

  toasts$ = this.toastService.toasts$;

  @HostBinding('style.top')
  get top() {
    return 60 + this.topOffset() + 'px'; // 60 is Clarity header navigation height
  }

  // Important! Otherwise, all existing toasts will be re-rendered
  trackById(index: number, item: Toast) {
    return item.id;
  }

  deleteToast(id: symbol) {
    this.toastService.deleteToast(id);
  }
}
