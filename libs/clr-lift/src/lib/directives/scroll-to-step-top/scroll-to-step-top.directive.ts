import {
  afterNextRender,
  contentChildren,
  DestroyRef,
  Directive,
  HostListener,
  inject,
  Injector,
  OnInit,
} from '@angular/core';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {ClrStepper, ClrStepperPanel} from '@clr/angular';
import {delay, Observable, timer} from 'rxjs';

interface StepperWithService {
  stepperService: {
    activeStep: Observable<string>;
  };
}

/**
 * Directive to automatically scroll to the top of the newly active step in Clarity steppers.
 * Uses Clarity's internal StepperService for reliable step change detection.
 * It also intercepts "Next" button clicks and scrolls to the first validation error if the step form is invalid,
 * while preserving the existing logic for valid step transitions.
 *
 * Note: When scrolling to errors, the directive specifically targets `<clr-control-error>` elements.
 * It does not attempt to find or scroll to custom error messages or alerts that are not wrapped in standard
 * Clarity control error components. It also skips scrolling if the error is already visible within the viewport
 * to prevent unnecessary flickering.
 *
 * @example
 * ```html
 * <form clrStepper cllScrollToStepTop [formGroup]="form">
 *   <clr-stepper-panel formGroupName="step1">
 *     <clr-step-title>Step 1</clr-step-title>
 *     <clr-step-content *clrIfExpanded>
 *       ...
 *       <button clrStepButton="next">Next</button>
 *     </clr-step-content>
 *   </clr-stepper-panel>
 * </form>
 * ```
 */
@Directive({
  selector: '[clrStepper][cllScrollToStepTop]',
})
export class ScrollToStepTopDirective implements OnInit {
  private readonly clrStepper = inject(ClrStepper, {optional: true});
  private readonly panels = contentChildren(ClrStepperPanel, {descendants: true});
  private readonly destroyRef = inject(DestroyRef);
  private readonly injector = inject(Injector);

  ngOnInit(): void {
    const stepper = this.clrStepper as unknown as StepperWithService;

    if (!stepper) {
      console.warn('ScrollToStepTopDirective: ClrStepper not found.');
      return;
    }

    if (!stepper.stepperService?.activeStep) {
      console.warn('ScrollToStepTopDirective: StepperService or activeStep not found on ClrStepper.');
      return;
    }

    // Delayed scroll to header when step successfully changes
    stepper.stepperService.activeStep
      .pipe(
        // Wait for the DOM to expand and animations to finish (Clarity animations typically take 200-300ms)
        delay(300),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((activeStepId) => this.scrollToActiveStep(activeStepId));
  }

  @HostListener('click', ['$event'])
  onClick(event: Event): void {
    try {
      const target = event.target as HTMLElement;
      const isNextButton = target.closest('.clr-step-button:not(.btn-link):not(.btn-success)');

      if (!isNextButton) {
        return;
      }

      const panelElement = target.closest('clr-stepper-panel') as HTMLElement;
      if (!panelElement) {
        return;
      }

      const panelComponent = this.panels().find((p) => {
        const headerBtn = p.headerButton?.nativeElement;
        return headerBtn?.closest('clr-stepper-panel') === panelElement;
      });

      if (panelComponent) {
        // Access formGroup property which exists on ClrStepperPanel
        const panelWithForm = panelComponent as unknown as {formGroup?: {invalid: boolean}};
        const formGroup = panelWithForm.formGroup;

        if (formGroup?.invalid) {
          afterNextRender(
            () => {
              try {
                const errorElement = panelElement.querySelector('clr-control-error') as HTMLElement;

                if (errorElement) {
                  this.performScroll(errorElement, 120, true);

                  // Attempt to focus the input within the same container
                  const container = errorElement.closest('.clr-control-container');
                  if (container) {
                    const input = container.querySelector('input, select, textarea, button') as HTMLElement;
                    if (input) {
                      input.focus({preventScroll: true});
                    }
                  }
                }
              } catch (err) {
                console.warn('ScrollToStepTopDirective error scroll failed:', err);
              }
            },
            {injector: this.injector},
          );
        }
      }
    } catch (error) {
      console.warn('ScrollToStepTopDirective click handler encountered an error:', error);
    }
  }

  private performScroll(element: HTMLElement, offset = 120, onlyIfNotVisible = false): void {
    const scrollContainer = element.closest('.content-area') || document.documentElement;

    // Use RxJS timer to ensure the DOM has fully rendered and reflowed
    // before we calculate the exact bounding rectangles.
    timer(0)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        const elementRect = element.getBoundingClientRect();
        const containerRect = scrollContainer.getBoundingClientRect();

        if (onlyIfNotVisible) {
          // Calculate actual visibility, taking the header offset into account
          // so it scrolls if the element is hidden behind the header
          const isVisible = elementRect.top >= containerRect.top + offset && elementRect.bottom <= containerRect.bottom;

          if (isVisible) {
            return;
          }
        }

        const scrollTop = scrollContainer.scrollTop + (elementRect.top - containerRect.top) - offset;

        // Manually set the scroll position instead of relying on scrollIntoView
        scrollContainer.scrollTo({
          top: scrollTop,
          behavior: 'smooth',
        });
      });
  }

  private scrollToActiveStep(activeStepId: string): void {
    try {
      const activePanel = this.panels().find((p) => p.id === activeStepId);
      if (activePanel) {
        const headerBtn = activePanel.headerButton?.nativeElement;
        if (headerBtn) {
          const panelElement = headerBtn.closest('clr-stepper-panel') as HTMLElement;
          if (panelElement) {
            this.performScroll(panelElement, 120);
          }
          // Focus the header button for accessibility
          headerBtn.focus({preventScroll: true});
        }
      }
    } catch (error) {
      console.warn('ScrollToStepTopDirective encountered an error:', error);
    }
  }
}
