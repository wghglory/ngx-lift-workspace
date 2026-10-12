import {DOCUMENT} from '@angular/common';
import {afterNextRender, Directive, inject, OnDestroy, Renderer2} from '@angular/core';

/**
 * Resolves layout misalignment and squeezing issues within Clarity Datagrid filter popovers.
 *
 * ### The Problem
 * Clarity form controls default to a responsive grid layout using `clr-row` and `clr-col-*` classes.
 * When these inputs are dynamically projected into a Datagrid filter overlay, those inherited grid
 * classes break the layout, causing inputs to be heavily compressed or misaligned.
 *
 * ### The Solution
 * This directive dynamically injects a localized stylesheet into the document head when the filter
 * opens to override layout constraints, ensuring proper sizing. To maintain a pristine DOM state,
 * the stylesheet is automatically detached via `Renderer2` when the filter context is destroyed.
 *
 * @example
 * ```html
 * <div clrControl cllDatagridFilterLabelReset>
 *   <input clrInput [(ngModel)]="filterValue" />
 * </div>
 * ```
 */
@Directive({
  selector: '[clrControl][cllDatagridFilterLabelReset]',
})
export class DatagridFilterLabelResetDirective implements OnDestroy {
  private readonly document = inject(DOCUMENT);
  private readonly renderer = inject(Renderer2);

  private readonly styleId = 'cll-datagrid-filter-label-reset';
  private styleElement?: HTMLStyleElement;

  constructor() {
    afterNextRender(() => {
      // Defensive check: Purge any stale style element if it managed to persist in the DOM
      const existingStyle = this.document.getElementById(this.styleId);
      if (existingStyle) {
        this.renderer.removeChild(this.document.head, existingStyle);
      }

      // Safely construct the style element using Renderer2
      this.styleElement = this.renderer.createElement('style') as HTMLStyleElement;
      this.renderer.setAttribute(this.styleElement, 'id', this.styleId);
      this.renderer.setProperty(
        this.styleElement,
        'textContent',
        `
          .datagrid-filter[cdktrapfocus] .clr-control-container,
          .datagrid-filter[cdktrapfocus] label {
            max-width: 100%;
          }
        `,
      );

      this.renderer.appendChild(this.document.head, this.styleElement);
    });
  }

  /**
   * Cleans up the injected style element from the document `<head>`
   * to eliminate any global style leaks or footprint.
   */
  ngOnDestroy(): void {
    if (this.styleElement) {
      this.renderer.removeChild(this.document.head, this.styleElement);
      this.styleElement = undefined;
    }
  }
}
