import {DOCUMENT, NgTemplateOutlet} from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  effect,
  ElementRef,
  inject,
  input,
  output,
  TemplateRef,
  viewChild,
} from '@angular/core';
import {TranslatePipe} from 'clr-lift';

import {ObjectPathBreadcrumbItem, ObjectPathBreadcrumbLinkContext} from './breadcrumb-preview.contract';

let nextPanelId = 0;

/** Interaction experiment only; no production export or width-partitioning claim. */
@Component({
  selector: 'app-breadcrumb-preview-trail',
  imports: [NgTemplateOutlet, TranslatePipe],
  templateUrl: './breadcrumb-preview-trail.component.html',
  styleUrl: './breadcrumb-preview-trail.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BreadcrumbPreviewTrailComponent implements AfterViewInit {
  readonly panelId = `breadcrumb-preview-panel-${++nextPanelId}`;
  readonly fullPath = computed(() =>
    this.items()
      .map((item) => item.label)
      .join(' > '),
  );
  readonly items = input.required<readonly ObjectPathBreadcrumbItem[]>();
  readonly ariaLabel = input.required<string>();
  readonly maxVisible = input(4);
  readonly linkTemplate = input<TemplateRef<ObjectPathBreadcrumbLinkContext>>();
  readonly navigate = output<ObjectPathBreadcrumbItem>();
  readonly current = computed(() => this.items().at(-1));
  readonly ancestors = computed(() => this.items().slice(0, -1));
  readonly visibleCount = computed(() => {
    const value = this.maxVisible();
    return Number.isFinite(value) ? Math.max(2, Math.trunc(value)) : 4;
  });
  readonly hidden = computed(() => this.items().slice(1, Math.max(1, this.items().length - this.visibleCount() + 1)));
  readonly recent = computed(() => this.ancestors().slice(this.hidden().length + 1));
  readonly panel = viewChild<ElementRef<HTMLElement>>('panel');
  readonly trigger = viewChild<ElementRef<HTMLButtonElement>>('trigger');
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly document = inject(DOCUMENT);
  private readonly destroyRef = inject(DestroyRef);
  private isOpen = false;
  private openPanel: HTMLElement | null = null;
  private resizeObserver?: ResizeObserver;

  constructor() {
    effect(() => {
      this.items();
      this.maxVisible();
      this.close(false);
    });
  }

  ngAfterViewInit(): void {
    const view = this.document.defaultView;
    const reposition = () => this.position();
    const dismiss = (event: MouseEvent) => {
      const target = event.target;
      if (!(target instanceof Node) || !this.isOpen) return;
      if (this.panel()?.nativeElement.contains(target) || this.trigger()?.nativeElement.contains(target)) return;
      const focusWasInside = this.panel()?.nativeElement.contains(this.document.activeElement);
      const externalControl =
        target instanceof Element
          ? target.closest<HTMLElement>('a[href],button,input,select,textarea,[tabindex]')
          : null;
      this.close(!externalControl && (!!focusWasInside || this.document.activeElement === this.document.body));
      // WebKit does not pointer-focus every native control (notably range inputs).
      externalControl?.focus({preventScroll: true});
    };
    const focusOutside = (event: FocusEvent) => {
      if (
        this.isOpen &&
        event.target instanceof Node &&
        !this.panel()?.nativeElement.contains(event.target) &&
        !this.trigger()?.nativeElement.contains(event.target)
      ) {
        this.close(false);
      }
    };
    const escape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && this.isOpen) {
        event.preventDefault();
        this.close(true);
      }
    };
    const observer = new ResizeObserver(reposition);
    this.resizeObserver = observer;
    observer.observe(this.host.nativeElement);
    view?.addEventListener('resize', reposition);
    this.document.addEventListener('scroll', reposition, true);
    this.document.addEventListener('click', dismiss, true);
    this.document.addEventListener('keydown', escape);
    this.document.addEventListener('focusin', focusOutside);
    this.destroyRef.onDestroy(() => {
      observer.disconnect();
      view?.removeEventListener('resize', reposition);
      this.document.removeEventListener('scroll', reposition, true);
      this.document.removeEventListener('click', dismiss, true);
      this.document.removeEventListener('keydown', escape);
      this.document.removeEventListener('focusin', focusOutside);
    });
  }

  toggle(): void {
    if (this.isOpen) return this.close(true);
    const panel = this.panel()?.nativeElement;
    if (!panel) return;
    panel.showPopover();
    this.openPanel = panel;
    this.resizeObserver?.observe(panel);
    this.isOpen = true;
    this.trigger()?.nativeElement.setAttribute('aria-expanded', 'true');
    this.position();
    panel.querySelector<HTMLElement>('a,button')?.focus();
  }

  close(restore: boolean): void {
    if (!this.isOpen) return;
    this.isOpen = false;
    const panel = this.openPanel;
    this.openPanel = null;
    if (panel) {
      this.resizeObserver?.unobserve(panel);
      if (panel.matches(':popover-open')) panel.hidePopover();
    }
    this.trigger()?.nativeElement.setAttribute('aria-expanded', 'false');
    if (restore) this.trigger()?.nativeElement.focus();
  }

  panelKeydown(event: KeyboardEvent): void {
    if (event.key !== 'Tab') return;
    const controls = this.panel()?.nativeElement.querySelectorAll<HTMLElement>('a,button');
    if (!controls?.length) return;
    const active = this.document.activeElement;
    if (event.shiftKey && active === controls[0]) {
      event.preventDefault();
      this.close(true);
    } else if (!event.shiftKey && active === controls[controls.length - 1]) {
      // Explicit boundary handoff avoids WebKit's top-layer tab-order differences; no focus trap.
      const order = Array.from(
        this.document.querySelectorAll<HTMLElement>(
          'a[href],button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex="0"]',
        ),
      ).filter((element) => element.getClientRects().length > 0);
      const next = active instanceof HTMLElement ? order[order.indexOf(active) + 1] : undefined;
      if (next) {
        event.preventDefault();
        this.close(false);
        next.focus();
      }
    }
  }

  activate(item: ObjectPathBreadcrumbItem): void {
    this.close(false);
    this.navigate.emit(item);
  }

  context(item: ObjectPathBreadcrumbItem): string {
    return (
      item.context ??
      this.items()
        .slice(0, this.items().indexOf(item) + 1)
        .map((part) => part.label)
        .join(' > ')
    );
  }

  private position(): void {
    const panel = this.panel()?.nativeElement;
    const trigger = this.trigger()?.nativeElement;
    const view = this.document.defaultView;
    if (!this.isOpen || !panel || !trigger || !view) return;
    const anchor = trigger.getBoundingClientRect();
    const margin = 8;
    const viewportBottom = Math.max(margin, view.innerHeight - margin);
    const belowTop = Math.min(viewportBottom, Math.max(margin, anchor.bottom + margin));
    const aboveBottom = Math.min(viewportBottom, Math.max(margin, anchor.top - margin));
    const below = viewportBottom - belowTop;
    const above = aboveBottom - margin;
    const useBelow = below >= Math.min(320, panel.scrollHeight) || below >= above;
    panel.style.maxHeight = `${useBelow ? below : above}px`;
    const rect = panel.getBoundingClientRect();
    const rtl = view.getComputedStyle(this.host.nativeElement).direction === 'rtl';
    const desiredLeft = rtl ? anchor.right - rect.width : anchor.left;
    panel.style.left = `${Math.max(margin, Math.min(desiredLeft, view.innerWidth - rect.width - margin))}px`;
    panel.style.top = `${useBelow ? belowTop : Math.max(margin, aboveBottom - rect.height)}px`;
  }
}
