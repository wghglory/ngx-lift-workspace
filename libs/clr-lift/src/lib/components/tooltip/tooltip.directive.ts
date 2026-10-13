import {DOCUMENT} from '@angular/common';
import {
  ApplicationRef,
  ComponentRef,
  computed,
  createComponent,
  Directive,
  DestroyRef,
  effect,
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

let nextTooltipId = 0;

@Directive({
  selector: '[cllTooltip]',
})
export class TooltipDirective {
  private elementRef = inject(ElementRef);
  private appRef = inject(ApplicationRef);
  private document = inject(DOCUMENT);

  cllTooltip = input('');
  cllTooltipContent = input<string | TemplateRef<unknown> | ComponentRef<unknown> | Type<unknown>>('');
  cllTooltipContentContext = input<Record<string, unknown>>(); // when cllTooltipContent is TemplateRef, context may be needed
  /** Accessible name used when content is an interactive template/component. */
  cllTooltipLabel = input('');
  cllTooltipHideDelay = input(0);
  cllTooltipWidth = input(240);
  cllTooltipPosition = input<TooltipPosition>();

  tooltipContent = computed(() => {
    return this.cllTooltipContent() || this.cllTooltip();
  });

  private tooltipComponent?: ComponentRef<TooltipComponent>;
  private hideTimer?: ReturnType<typeof setTimeout>;
  private positionTimer?: ReturnType<typeof setTimeout>;
  private readonly tooltipId = `cll-tooltip-${nextTooltipId++}`;
  private previousPopup: string | null = null;
  private previousExpanded: string | null = null;
  private ownsPopup = false;
  private suppressRestoredFocus = false;
  private readonly onScroll = () => {
    if (this.tooltipComponent && this.hasFocus()) {
      const position = this.calculateTooltipPosition(this.cllTooltipPosition());
      this.setTooltipProps(position);
      this.positionTooltip(position);
    } else this.removeTooltip(true);
  };

  private hasFocus(): boolean {
    const active = this.document.activeElement;
    return !!active && (this.triggerElement.contains(active) || !!this.hostElement?.contains(active));
  }

  @HostListener('window:resize')
  onResize() {
    this.removeTooltip(true);
  }

  private removeDescription() {
    for (const attribute of ['aria-describedby', 'aria-controls']) {
      const values = this.triggerElement
        .getAttribute(attribute)
        ?.split(/\s+/)
        .filter((id) => id && id !== this.tooltipId);
      if (values?.length) this.triggerElement.setAttribute(attribute, values.join(' '));
      else this.triggerElement.removeAttribute(attribute);
    }
    if (this.ownsPopup) {
      for (const [attribute, previous] of [
        ['aria-haspopup', this.previousPopup],
        ['aria-expanded', this.previousExpanded],
      ]) {
        if (previous === null) this.triggerElement.removeAttribute(attribute as string);
        else this.triggerElement.setAttribute(attribute as string, previous as string);
      }
      this.ownsPopup = false;
    }
  }

  private updateRelationship() {
    this.removeDescription();
    const interactive = typeof this.tooltipContent() !== 'string';
    const attribute = interactive ? 'aria-controls' : 'aria-describedby';
    const values = this.triggerElement.getAttribute(attribute)?.split(/\s+/).filter(Boolean) ?? [];
    this.triggerElement.setAttribute(attribute, [...new Set([...values, this.tooltipId])].join(' '));
    if (interactive) {
      this.previousPopup = this.triggerElement.getAttribute('aria-haspopup');
      this.previousExpanded = this.triggerElement.getAttribute('aria-expanded');
      this.ownsPopup = true;
      this.triggerElement.setAttribute('aria-haspopup', 'dialog');
      this.triggerElement.setAttribute('aria-expanded', 'true');
    }
  }

  constructor() {
    inject(DestroyRef).onDestroy(() => this.destroyTooltip());
    effect(() => {
      const content = this.tooltipContent();
      // Capture dependencies even while closed; creation remains controlled by interaction.
      this.cllTooltipContentContext();
      this.cllTooltipLabel();
      this.cllTooltipWidth();
      const position = this.cllTooltipPosition();
      if (!this.tooltipComponent) {
        return;
      }
      if (!content) {
        this.destroyTooltip();
        return;
      }
      const calculatedPosition = this.calculateTooltipPosition(position);
      this.setTooltipProps(calculatedPosition);
      this.positionTooltip(calculatedPosition);
    });
  }

  private clearTimers() {
    clearTimeout(this.hideTimer);
    clearTimeout(this.positionTimer);
    this.hideTimer = undefined;
    this.positionTimer = undefined;
  }

  private destroyTooltip() {
    this.clearTimers();
    this.document.removeEventListener('scroll', this.onScroll, true);
    this.removeDescription();
    const ref = this.tooltipComponent;
    this.tooltipComponent = undefined;
    if (ref) {
      // Restore caller-owned content before destroying the tooltip.
      ref.instance.releaseContent();
      this.appRef.detachView(ref.hostView);
      ref.location.nativeElement.remove();
      this.suppressRestoredFocus = true;
      try {
        ref.destroy();
      } finally {
        queueMicrotask(() => {
          this.suppressRestoredFocus = false;
        });
      }
    }
  }

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

  @HostListener('focus')
  onFocus() {
    if (!this.suppressRestoredFocus) this.onMouseEnter();
  }

  @HostListener('mouseenter')
  onMouseEnter() {
    clearTimeout(this.hideTimer);
    this.hideTimer = undefined;
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
    if (this.tooltipComponent) {
      return;
    }
    if (!this.tooltipContent()) {
      console.warn('Tooltip content not defined, cannot show tooltip');
      return;
    }

    const environmentInjector = this.appRef.injector;
    this.tooltipComponent = createComponent(TooltipComponent, {
      environmentInjector,
    });

    this.appRef.attachView(this.tooltipComponent.hostView);
    this.tooltipComponent.instance.closePopover.subscribe((force) => this.removeTooltip(force));

    const tooltipContent = this.tooltipContentElement;
    if (tooltipContent) {
      tooltipContent.style.visibility = 'hidden'; // fix flicker issue because we want to delay the tooltip a while due to auto positioning
    }
    const hostElement = this.hostElement;
    if (hostElement) {
      hostElement.id = this.tooltipId;
      this.document.body.appendChild(hostElement);
      const descriptions = this.triggerElement.getAttribute('aria-describedby')?.split(/\s+/).filter(Boolean) ?? [];
      this.triggerElement.setAttribute('aria-describedby', [...new Set([...descriptions, this.tooltipId])].join(' '));
      this.document.addEventListener('scroll', this.onScroll, true);
    }

    this.tooltipComponent.setInput('triggerElementHovering', true);

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
    clearTimeout(this.hideTimer);
    if (force) {
      this.destroyTooltip();
      return;
    }
    const ref = this.tooltipComponent;
    this.hideTimer = setTimeout(() => {
      this.hideTimer = undefined;
      if (
        ref &&
        this.tooltipComponent === ref &&
        !ref.instance.tooltipHovering &&
        !ref.instance.triggerElementHovering() &&
        !this.hasFocus()
      ) {
        this.destroyTooltip();
      }
    }, this.cllTooltipHideDelay());
  }

  /**
   * A function to position the tooltip based on the previous position.
   *
   * @param {string} previousTooltipPosition - the previous position of the tooltip
   * @return {void}
   */
  private positionTooltip(previousTooltipPosition: string) {
    clearTimeout(this.positionTimer);
    this.positionTimer = setTimeout(() => {
      this.positionTimer = undefined;
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
    this.updateRelationship();
    const coords = getTooltipCoords(this.triggerElement, calculatedPosition);

    this.tooltipComponent.setInput('content', this.tooltipContent());
    this.tooltipComponent.setInput('contentContext', this.cllTooltipContentContext());
    this.tooltipComponent.setInput('accessibleLabel', this.cllTooltipLabel());
    this.tooltipComponent.setInput('width', this.cllTooltipWidth());
    this.tooltipComponent.setInput('position', calculatedPosition);
    this.tooltipComponent.setInput('left', coords.x);
    this.tooltipComponent.setInput('top', coords.y);
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
