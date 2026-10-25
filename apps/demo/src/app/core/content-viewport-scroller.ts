import {DOCUMENT, ViewportScroller} from '@angular/common';
import {inject, Injectable} from '@angular/core';
import {Router} from '@angular/router';

/** Opt-in for in-page demo navigation; transient info never changes native link destinations. */
export const PRESERVE_CONTENT_SCROLL = Symbol('preserve-content-scroll');

/** Routes scroll inside Clarity's content area rather than the fixed browser viewport. */
@Injectable()
export class ContentViewportScroller extends ViewportScroller {
  private readonly document = inject(DOCUMENT);
  private readonly router = inject(Router);
  private preservedNavigationId: number | undefined;
  private offset: [number, number] | (() => [number, number]) = [0, 0];

  private get content(): HTMLElement | null {
    return this.document.querySelector('main.content-area');
  }

  override setOffset(offset: [number, number] | (() => [number, number])): void {
    this.offset = offset;
  }

  override getScrollPosition(): [number, number] {
    return [this.content?.scrollLeft ?? 0, this.content?.scrollTop ?? 0];
  }

  override scrollToPosition([left, top]: [number, number], options?: ScrollOptions): void {
    const navigation = this.router.lastSuccessfulNavigation();
    if (
      left === 0 &&
      top === 0 &&
      navigation?.trigger === 'imperative' &&
      navigation.extras.info === PRESERVE_CONTENT_SCROLL &&
      this.preservedNavigationId !== navigation.id
    ) {
      this.preservedNavigationId = navigation.id;
      return;
    }
    this.content?.scrollTo({left, top, ...options});
  }

  override scrollToAnchor(anchor: string, options?: ScrollOptions): void {
    const element = this.document.getElementById(anchor);
    const content = this.content;
    if (!element || !content) return;
    const offset = typeof this.offset === 'function' ? this.offset() : this.offset;
    const target = element.getBoundingClientRect();
    const container = content.getBoundingClientRect();
    content.scrollTo({
      left: content.scrollLeft + target.left - container.left - offset[0],
      top: content.scrollTop + target.top - container.top - offset[1],
      ...options,
    });
    element.focus({preventScroll: true});
  }

  override setHistoryScrollRestoration(scrollRestoration: 'auto' | 'manual'): void {
    const history = this.document.defaultView?.history;
    if (history) history.scrollRestoration = scrollRestoration;
  }
}
