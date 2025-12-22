import {animate, animateChild, group, keyframes, query, style, transition, trigger} from '@angular/animations';
import {Component, ElementRef, inject, input, NgZone, OnInit, output} from '@angular/core';
import {ClarityIcons, timesIcon} from '@cds/core/icon';
import {ClarityModule} from '@clr/angular';
import {timer} from 'rxjs';
import {take} from 'rxjs/operators';

import {TranslatePipe} from '../../pipes/translate.pipe';
import {TranslationService} from '../../services/translation.service';
import {
  CLOSE_ICON_CURVE,
  CLOSE_ICON_DELAY,
  CLOSE_ICON_DURATION,
  componentPrimaryEnterCurve,
  componentPrimaryEnterTiming,
  componentPrimaryLeaveCurve,
  componentPrimaryLeaveTiming,
  GRADIENT_DELAY,
  GRADIENT_DURATION,
  GRADIENT_LEAVE_CURVE,
  linePrimaryEnterCurve,
  linePrimaryEnterDelay,
  linePrimaryEnterTiming,
  lineSecondaryEnterCurve,
  lineSecondaryEnterDelay,
  lineSecondaryEnterTiming,
  multiply,
} from '../../shared/animation.const';
import {toastTranslations} from './toast.l10n';
import {ToastType} from './toast.type';

ClarityIcons.addIcons(timesIcon);

@Component({
  selector: 'cll-toast',
  templateUrl: './toast.component.html',
  styleUrls: ['./toast.component.scss'],
  imports: [ClarityModule, TranslatePipe],
  standalone: true,
  animations: [
    trigger('launchToast', [
      transition(':enter', [
        // toast parent element animation
        group([
          style({
            transform: 'translateX(48px) scale(0, 1)',
          }),
          animate(
            `${multiply(componentPrimaryEnterTiming)}ms ${componentPrimaryEnterCurve}`,
            style({
              transform: 'translateX(0) scale(1, 1)',
            }),
          ),

          // use optional: true for if/else elements
          query('#check-mark', animateChild(), {optional: true}),
          query('#info-icon-dot', animateChild(), {optional: true}),
          query('#info-icon-line', animateChild(), {optional: true}),
          query('#warn-icon-dot', animateChild(), {optional: true}),
          query('#warn-icon-line', animateChild(), {optional: true}),
          query('#error-icon-dot', animateChild(), {optional: true}),
          query('#error-icon-line', animateChild(), {optional: true}),
          query('.gradient', animateChild()),
          query('.close-button', animateChild(), {optional: true}),
        ]),
      ]),

      // ':leave' is a default state for ngIf and ngFor. No need to be predefined
      transition(
        ':leave',
        [
          group([
            style({
              transform: 'translateX(0px) scale(1, 1)',
              marginTop: '*',
            }),

            // use query self to be able to group the animation on the current element
            query(':self', [
              animate(
                `${multiply(componentPrimaryLeaveTiming)}ms ${componentPrimaryLeaveCurve}`,
                style({
                  transform: 'translateX(18px) scale(0, 1)',
                }),
              ),

              animate(
                `${multiply(componentPrimaryLeaveTiming)}ms ${componentPrimaryLeaveCurve}`,
                style({
                  marginTop: '-{{height}}px',
                }),
              ),
            ]),

            query('.toast-description, .toast-title, .icon-container, .button-container, .close-button, .toast-date', [
              animate(
                `${multiply(10)}ms`,
                style({
                  opacity: '0',
                }),
              ),
            ]),
          ]),
        ],
        {
          params: {
            height: 0,
          },
        },
      ),
    ]),

    // info icon animation
    trigger('infoLine', [
      transition('* => *', [
        animate(
          `${multiply(linePrimaryEnterTiming)}ms ${multiply(linePrimaryEnterDelay)}ms ${linePrimaryEnterCurve}`,
          keyframes([style({strokeDashoffset: '16', offset: 0}), style({strokeDashoffset: '0', offset: 1.0})]),
        ),
      ]),
    ]),
    trigger('infoDot', [
      transition('* => *', [
        style({
          transform: 'scale(0)',
        }),
        animate(
          `${multiply(lineSecondaryEnterTiming)}ms ${multiply(lineSecondaryEnterDelay)}ms ${lineSecondaryEnterCurve}`,
          style({
            transform: 'scale(1)',
          }),
        ),
      ]),
    ]),

    // error icon animation
    trigger('errorLine', [
      transition('* => *', [
        animate(
          `${multiply(linePrimaryEnterTiming)}ms ${multiply(linePrimaryEnterDelay)}ms ${linePrimaryEnterCurve}`,
          keyframes([
            style({strokeDashoffset: '7.919999599456787', offset: 0}),
            style({strokeDashoffset: '0', offset: 1.0}),
          ]),
        ),
      ]),
    ]),
    trigger('errorDot', [
      transition('* => *', [
        style({
          transform: 'scale(0)',
        }),
        animate(
          `${multiply(lineSecondaryEnterTiming)}ms ${multiply(lineSecondaryEnterDelay)}ms ${lineSecondaryEnterCurve}`,
          style({
            transform: 'scale(1)',
          }),
        ),
      ]),
    ]),

    //warning icon animation
    trigger('warnLine', [
      transition('* => *', [
        animate(
          `${multiply(linePrimaryEnterTiming)}ms ${multiply(linePrimaryEnterDelay)}ms ${linePrimaryEnterCurve}`,
          keyframes([
            style({strokeDashoffset: '7.919999599456787', offset: 0}),
            style({strokeDashoffset: '0', offset: 1.0}),
          ]),
        ),
      ]),
    ]),
    trigger('warnDot', [
      transition('* => *', [
        style({
          transform: 'scale(0)',
        }),
        animate(
          `${multiply(lineSecondaryEnterTiming)}ms ${multiply(lineSecondaryEnterDelay)}ms ${lineSecondaryEnterCurve}`,
          style({
            transform: 'scale(1)',
          }),
        ),
      ]),
    ]),

    // success icon animation
    trigger('checkMarkLine', [
      transition('* => *', [
        // css keyframe animation
        animate(
          `${multiply(linePrimaryEnterTiming)}ms ${multiply(linePrimaryEnterDelay)}ms ${linePrimaryEnterCurve}`,
          keyframes([
            style({strokeDashoffset: '31.386688232421875', offset: 0}),
            style({strokeDashoffset: '0', offset: 1.0}),
          ]),
        ),
      ]),
    ]),

    // moving the gradient off view
    trigger('gradientMove', [
      transition('* => *', [
        style({
          transform: 'scale(1, 1)',
        }),
        animate(
          `${multiply(GRADIENT_DURATION)}ms ${multiply(GRADIENT_DELAY)}ms ${GRADIENT_LEAVE_CURVE}`,
          style({
            transform: 'scale(0, 1)',
          }),
        ),
      ]),
    ]),

    // fade in the close icon
    trigger('closeIconVisible', [
      transition('* => *', [
        style({
          opacity: '0',
        }),
        animate(
          `${multiply(CLOSE_ICON_DURATION)}ms ${multiply(CLOSE_ICON_DELAY)}ms ${CLOSE_ICON_CURVE}`,
          style({
            opacity: '1',
          }),
        ),
      ]),
    ]),
  ],
})
export class ToastComponent implements OnInit {
  private element = inject(ElementRef);
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
  animate = true;

  constructor() {
    this.translationService.loadTranslationsForComponent('toast', toastTranslations);
  }

  get loaded() {
    return {
      value: this.animate,
      params: {
        height: this.element.nativeElement.clientHeight,
      },
    };
  }

  ngOnInit() {
    this.setUpTimer();
  }

  // If the user moves their mouse over the snack, disable auto-close
  mouseOver(over: boolean) {
    this.disableAutoClose = over;
  }

  focus(focused: boolean) {
    this.disableAutoClose = focused;
  }

  close(userClosed = false) {
    this.animate = false;

    // before we tell the app to remove the toast, give the leave animation some time to run
    setTimeout(() => {
      this.closed.emit(userClosed);
    }, componentPrimaryLeaveTiming + 200);
  }

  private setUpTimer() {
    if (this.timeoutSeconds() > 0) {
      this.ngZone.runOutsideAngular(() => {
        timer(this.timeoutSeconds() * multiply(1000))
          .pipe(take(1))
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
