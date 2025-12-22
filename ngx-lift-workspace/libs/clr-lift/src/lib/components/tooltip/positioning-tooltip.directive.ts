/* eslint-disable @angular-eslint/directive-selector */
// This directive is used to position the tooltip automatically. Now it's not being used.
import {AfterViewInit, Directive, ElementRef, inject} from '@angular/core';

import {collisionDetection} from './tooltip.util';

@Directive({
  selector: '[cllPositioningTooltip]',
  standalone: true,
})
export class PositioningTooltipDirective implements AfterViewInit {
  private tooltipContainerElement = inject(ElementRef);

  ngAfterViewInit() {
    setTimeout(() => this.updateTooltipClass(), 0);
  }

  private updateTooltipClass() {
    const tooltipElement = this.tooltipContainerElement.nativeElement as HTMLElement; // <a> element
    const tooltipContentElement = tooltipElement.querySelector<HTMLElement>('.tooltip-content'); //  <span class="tooltip-content"> element

    if (!tooltipContentElement) {
      return;
    }

    // Tooltip class based on the 1st render
    let tooltipClass = tooltipElement.classList.value;

    // Update the tooltip class based on collision detection. The 2nd render will be based on the new class (auto positioning)
    const {left, right, top, bottom} = collisionDetection(tooltipContentElement);

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

    // Update the tooltip element's classList
    tooltipElement.setAttribute('class', tooltipClass);
  }
}
