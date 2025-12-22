import {animateChild, query, stagger, transition, trigger} from '@angular/animations';
import {CommonModule} from '@angular/common';
import {Component, HostBinding, inject, input} from '@angular/core';

import {multiply} from '../../shared/animation.const';
import {ToastComponent} from './toast.component';
import {ToastService} from './toast.service';
import {Toast} from './toast.type';

@Component({
  selector: 'cll-toast-container',
  templateUrl: './toast-container.component.html',
  styleUrls: ['./toast-container.component.scss'],
  animations: [
    trigger('toastContainer', [
      transition(':enter', [query('@launchToast', [stagger(`${multiply(200)}ms`, animateChild())], {optional: true})]),
      transition(':leave', [query('@launchToast', [animateChild()], {optional: true})]),
    ]),
  ],
  standalone: true,
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
