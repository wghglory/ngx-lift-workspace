import {afterNextRender, Directive, effect, ElementRef, inject, input} from '@angular/core';

/**
 * Directive that automatically scrolls the host element into view when initialized or when
 * the active condition turns true.
 *
 * Useful for scenarios such as error alert banners, newly revealed wizard steps, or forms
 * where an element may render outside the current viewport.
 *
 * @example
 * ```html
 * <!-- Scroll error banner into view on appearance -->
 * <div [ngxScrollIntoView]="hasError()">
 *   <cll-alert [error]="error()" />
 * </div>
 *
 * <!-- Unconditional scroll into view on render -->
 * <section ngxScrollIntoView [scrollOptions]="{ behavior: 'smooth', block: 'start' }">
 *   <h3>Target Section</h3>
 * </section>
 * ```
 */
@Directive({
  selector: '[ngxScrollIntoView]',
})
export class ScrollIntoViewDirective {
  /**
   * Whether to scroll the element into view. Defaults to true when applied without a value.
   */
  ngxScrollIntoView = input<boolean | ''>(true);

  /**
   * Custom scroll configuration options passed to `Element.scrollIntoView`.
   */
  scrollOptions = input<ScrollIntoViewOptions>({
    behavior: 'smooth',
    block: 'nearest',
    inline: 'nearest',
  });

  private elementRef = inject<ElementRef<HTMLElement>>(ElementRef);
  private hasScrolled = false;

  constructor() {
    afterNextRender(() => {
      if (this.isEnabled() && !this.hasScrolled) {
        this.scroll();
      }
    });

    effect(() => {
      const enabled = this.isEnabled();
      if (enabled && !this.hasScrolled) {
        this.scroll();
      } else if (!enabled) {
        this.hasScrolled = false;
      }
    });
  }

  private isEnabled(): boolean {
    const value = this.ngxScrollIntoView();
    return value === true || value === '';
  }

  private scroll(): void {
    const el = this.elementRef.nativeElement;
    if (el && typeof el.scrollIntoView === 'function') {
      el.scrollIntoView(this.scrollOptions());
      this.hasScrolled = true;
    }
  }
}
