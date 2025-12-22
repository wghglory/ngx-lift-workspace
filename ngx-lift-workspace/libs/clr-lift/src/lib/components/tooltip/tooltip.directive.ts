/* eslint-disable @typescript-eslint/no-explicit-any */
import {DOCUMENT} from '@angular/common';
import {
  ApplicationRef,
  ComponentRef,
  computed,
  createComponent,
  Directive,
  ElementRef,
  HostListener,
  inject,
  input,
  TemplateRef,
  Type,
} from '@angular/core';

import {TooltipComponent} from './tooltip.component';
import {TooltipPosition} from './tooltip.model';
import {collisionDetection, getTooltipCoords} from './tooltip.util';

@Directive({
  selector: '[cllTooltip]',
})
export class TooltipDirective {
  private elementRef = inject(ElementRef);
  private appRef = inject(ApplicationRef);
  private document = inject(DOCUMENT);

  cllTooltip = input('');
  cllTooltipContent = input<string | TemplateRef<any> | ComponentRef<any> | Type<any>>('');
  cllTooltipContentContext = input<Record<string, any>>(); // when cllTooltipContent is TemplateRef, context may be needed
  cllTooltipHideDelay = input(0);
  cllTooltipWidth = input(240);
  cllTooltipPosition = input<TooltipPosition>();

  tooltipContent = computed(() => {
    return this.cllTooltipContent() || this.cllTooltip();
  });

  private tooltipComponent?: ComponentRef<TooltipComponent>;

  get triggerElement() {
    return this.elementRef.nativeElement as HTMLElement;
  }
  get hostElement() {
    return this.tooltipComponent?.location.nativeElement; // <cll-tooltip>
  }
  get tooltipAnchorElement() {
    const host = this.hostElement;
    if (!host || typeof host.querySelector !== 'function') {
      return undefined;
    }
    return host.querySelector('a') as HTMLAnchorElement; // <a class="tooltip">
  }
  get tooltipContentElement() {
    const host = this.hostElement;
    if (!host || typeof host.querySelector !== 'function') {
      return undefined;
    }
    return host.querySelector('.tooltip-content') as HTMLSpanElement; // span.tooltip-content
  }

  @HostListener('mouseenter')
  @HostListener('focus')
  onMouseEnter() {
    if (this.tooltipComponent) {
      // if tooltip hasn't been removed due to delay, update triggerElementHovering as true, meaning mouse moved from tooltip to trigger element
      this.tooltipComponent.setInput('triggerElementHovering', true);
    } else {
      this.showTooltip();
    }
  }

  @HostListener('mouseleave')
  @HostListener('blur')
  onMouseLeave() {
    this.tooltipComponent?.setInput('triggerElementHovering', false);
    this.removeTooltip();
  }

  /**
   * Show tooltip and position it on the screen.
   */
  showTooltip() {
    if (!this.tooltipContent()) {
      console.warn('Tooltip content not defined, cannot show tooltip');
      return;
    }

    const environmentInjector = this.appRef.injector;
    this.tooltipComponent = createComponent(TooltipComponent, {
      environmentInjector,
    });

    const tooltipContent = this.tooltipContentElement;
    if (tooltipContent) {
      tooltipContent.style.visibility = 'hidden'; // fix flicker issue because we want to delay the tooltip a while due to auto positioning
    }
    const hostElement = this.hostElement;
    if (hostElement) {
      this.document.body.appendChild(hostElement);
    }

    // calculatedPosition is the 1st render expected tooltip class.
    const calculatedPosition = this.calculateTooltipPosition(this.cllTooltipPosition());
    this.setTooltipProps(calculatedPosition);

    this.tooltipComponent.hostView.detectChanges(); // OR this.tooltipComponent.changeDetectorRef.detectChanges();

    // After 1st render, try to position tooltip smartly. compare the latest tooltip class with previous tooltip class (calculatedPosition)
    this.positionTooltip(calculatedPosition);
  }

  /**
   * Removes the tooltip if force is true or if the tooltip is not being hovered over.
   *
   * @param {boolean} force - indicates whether to force the removal of the tooltip
   * @return {void}
   */
  removeTooltip(force = false) {
    setTimeout(
      () => {
        if (!this.tooltipComponent) {
          return;
        }
        // if mouse moves from trigger to tooltip, keep the tooltip.
        // tooltipHovering means not moving onto the tooltip, remove the tooltip
        if (force || this.tooltipComponent.instance.tooltipHovering === false) {
          // No need unsubscribe here, since angular will auto unsubscribe when the component is destroyed

          this.appRef.detachView(this.tooltipComponent.hostView);
          // this.tooltipComponent.destroy();  // avoid doing this because dynamic component inside tooltip will also be destroyed. 2nd hover will raise error
          this.tooltipComponent = undefined;
        }
      },
      force ? 0 : this.cllTooltipHideDelay(),
    );
  }

  /**
   * A function to position the tooltip based on the previous position.
   *
   * @param {string} previousTooltipPosition - the previous position of the tooltip
   * @return {void}
   */
  private positionTooltip(previousTooltipPosition: string) {
    setTimeout(() => {
      if (!this.tooltipComponent) {
        return;
      }

      const latestTooltipClass = this.calculateTooltipClassByCollisionDetection();
      const tooltipAnchor = this.tooltipAnchorElement;
      const tooltipContent = this.tooltipContentElement;

      if (!tooltipAnchor || !tooltipContent) {
        return;
      }

      // Update the tooltip element's classList
      tooltipAnchor.setAttribute('class', latestTooltipClass);
      tooltipContent.style.visibility = 'visible'; // fix flicker

      // latest class not includes previous class, position changed! Re-render the tooltip
      if (!latestTooltipClass.includes(previousTooltipPosition)) {
        this.reRenderTooltip();
      }
    });
  }

  /**
   * Set tooltip properties based on the calculated position.
   *
   * @param {TooltipPosition} calculatedPosition - the calculated position for the tooltip
   */
  private setTooltipProps(calculatedPosition: TooltipPosition) {
    if (!this.tooltipComponent) {
      return;
    }
    const coords = getTooltipCoords(this.triggerElement, calculatedPosition);

    this.tooltipComponent.setInput('triggerElementHovering', true);
    this.tooltipComponent.setInput('content', this.tooltipContent());
    const contentContext = this.cllTooltipContentContext();
    if (contentContext) {
      this.tooltipComponent.setInput('contentContext', contentContext);
    }
    this.tooltipComponent.setInput('width', this.cllTooltipWidth());
    this.tooltipComponent.setInput('position', calculatedPosition);
    this.tooltipComponent.setInput('left', coords.x);
    this.tooltipComponent.setInput('top', coords.y);

    this.tooltipComponent.instance.closePopover.subscribe((force) => {
      this.removeTooltip(force);
    });
  }

  /**
   * Calculates the tooltip position based on the trigger element's position and the viewport width.
   *
   * @param {TooltipPosition} positionOverride - (optional) The position to override the calculated position
   * @return {string} The calculated tooltip position
   */
  private calculateTooltipPosition(positionOverride?: TooltipPosition) {
    const triggerRect = this.triggerElement.getBoundingClientRect();
    const viewportWidth = window.innerWidth || document.documentElement.clientWidth;

    // switch tooltip position based on where it is situated (left or right of the middle of the screen)
    // if trigger element is in the left side of the screen, show tooltip in top right
    return positionOverride || (triggerRect.x < viewportWidth / 2 ? 'tooltip-top-right' : 'tooltip-top-left');
  }

  /**
   * Re-renders the tooltip based on the latest positioning and updates its coordinates.
   */
  private reRenderTooltip() {
    if (!this.tooltipComponent) {
      return;
    }

    const firstElement = this.tooltipComponent.location.nativeElement.firstElementChild as HTMLElement;
    if (!firstElement) {
      return;
    }

    // latest tooltip class after positioning.
    const tooltipClass = firstElement.classList.value;

    const coords = getTooltipCoords(this.triggerElement, tooltipClass);
    this.tooltipComponent.setInput('left', coords.x);
    this.tooltipComponent.setInput('top', coords.y);
    this.tooltipComponent.hostView.detectChanges();
  }

  /**
   * Calculate tooltip class based on collision detection.
   *
   * @return {string} The updated tooltip class based on collision detection.
   */
  private calculateTooltipClassByCollisionDetection() {
    const tooltipAnchor = this.tooltipAnchorElement;
    const tooltipContent = this.tooltipContentElement;

    if (!tooltipAnchor || !tooltipContent) {
      return 'tooltip-top-left'; // Default fallback
    }

    // Tooltip class based on the 1st render
    let tooltipClass = tooltipAnchor.classList.value;

    // Update the tooltip class based on collision detection. The 2nd render will be based on the new class (auto positioning)
    const {left, right, top, bottom} = collisionDetection(tooltipContent);

    if (left) {
      tooltipClass = tooltipClass.replace(/left/g, 'right');
    }
    if (right) {
      tooltipClass = tooltipClass.replace(/right/g, 'left');
    }
    if (top) {
      tooltipClass = tooltipClass.replace(/top/g, 'bottom');
    }
    if (bottom) {
      tooltipClass = tooltipClass.replace(/bottom/g, 'top');
    }

    return tooltipClass;
  }
}
