import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  inject,
  input,
  NgZone,
  OnInit,
  output,
} from '@angular/core';
import {ClarityIcons, timesIcon} from '@clr/angular/icon';
import {ClarityModule} from '@clr/angular';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {timer} from 'rxjs';
import {take} from 'rxjs/operators';

import {TranslatePipe} from '../../pipes/translate.pipe';
import {TranslationService} from '../../services/translation.service';
import {multiply} from '../../shared/animation.const';
import {toastTranslations} from './toast.l10n';
import {ToastType} from './toast.type';

ClarityIcons.addIcons(timesIcon);

@Component({
  selector: 'cll-toast',
  templateUrl: './toast.component.html',
  styleUrls: ['./toast.component.scss'],
  imports: [ClarityModule, TranslatePipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '(focusin)': 'focus(true)',
    '(focusout)': 'onFocusOut($event)',
    '(mouseover)': 'mouseOver(true)',
    '(mouseleave)': 'mouseOver(false)',
    '[animate.enter]': '"toast-enter"',
    '[animate.leave]': '"toast-leave"',
    '(animate.leave)': '$event.animationComplete()',
  },
})
export class ToastComponent implements OnInit, AfterViewInit {
  private element = inject<ElementRef<HTMLElement>>(ElementRef);
  private destroyRef = inject(DestroyRef);
  private ngZone = inject(NgZone);
  private translationService = inject(TranslationService);

  toastType = input<ToastType>('info');
  primaryButtonText = input('');
  secondaryButtonText = input('');
  manualClosable = input(true);
  timeoutSeconds = input(6); // auto close in 6s

  /**
   * Emit when toast is closed, either by an explicit action of clicking on the X
   * or after the auto close timeout. If the user clicked the X, the emission will be
   * a boolean true, otherwise false.
   */
  closed = output<boolean>();
  primaryButtonClick = output<void>();
  secondaryButtonClick = output<void>();

  disableAutoClose = false;
  private isHovering = false;
  private hasFocusWithin = false;

  constructor() {
    this.translationService.loadTranslationsForComponent('toast', toastTranslations);
  }

  ngOnInit() {
    this.setUpTimer();
  }

  ngAfterViewInit() {
    this.element.nativeElement.style.setProperty('--toast-height', `${this.element.nativeElement.offsetHeight}px`);
  }

  // If the user moves their mouse over the snack, disable auto-close
  mouseOver(over: boolean) {
    this.isHovering = over;
    this.disableAutoClose = this.isHovering || this.hasFocusWithin;
  }

  focus(focused: boolean) {
    this.hasFocusWithin = focused;
    this.disableAutoClose = this.isHovering || this.hasFocusWithin;
  }

  onFocusOut(event: FocusEvent) {
    const next = event.relatedTarget;
    this.focus(next instanceof Node && this.element.nativeElement.contains(next));
  }

  close(userClosed = false) {
    this.closed.emit(userClosed);
  }

  private setUpTimer() {
    if (this.timeoutSeconds() > 0) {
      this.ngZone.runOutsideAngular(() => {
        timer(this.timeoutSeconds() * multiply(1000))
          .pipe(take(1), takeUntilDestroyed(this.destroyRef))
          .subscribe(() => {
            this.ngZone.run(() => {
              if (this.disableAutoClose) {
                this.setUpTimer();
                return;
              }
              this.close();
            });
          });
      });
    }
  }
}
