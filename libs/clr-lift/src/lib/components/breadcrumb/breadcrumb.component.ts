import {DOCUMENT, isPlatformBrowser, NgTemplateOutlet} from '@angular/common';
import {
  afterNextRender,
  APP_ID,
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  effect,
  ElementRef,
  inject,
  InjectionToken,
  input,
  output,
  PLATFORM_ID,
  signal,
  TemplateRef,
  untracked,
  viewChild,
} from '@angular/core';

import {TranslationService} from '../../services/translation.service';
import {breadcrumbTranslations} from './breadcrumb.l10n';
import {BreadcrumbItem, BreadcrumbLinkContext} from './breadcrumb.model';

// Per-application allocation also gives repeated server renders a deterministic initial sequence.
const breadcrumbIds = new InjectionToken<{next: number}>('Breadcrumb IDs', {
  providedIn: 'root',
  factory: () => ({next: 0}),
});

/**
 * Caller-owned breadcrumb navigation. The final item is noninteractive current text.
 * Supply a real-anchor linkTemplate for SPA routing; addressless ancestors emit navigate.
 * Set --cll-breadcrumb-font-size on this host or an ancestor to customize typography.
 * Root/current remain visible; an anchored panel exposes complete supplied ancestry.
 */
@Component({
  selector: 'cll-breadcrumb',
  imports: [NgTemplateOutlet],
  templateUrl: './breadcrumb.component.html',
  styleUrl: './breadcrumb.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BreadcrumbComponent {
  protected readonly panelId = `cll-breadcrumb-${inject(APP_ID)}-${inject(breadcrumbIds).next++}`;
  private readonly translation = inject(TranslationService);
  readonly items = input.required<readonly BreadcrumbItem[]>();
  readonly ariaLabel = input<string>();
  readonly linkTemplate = input<TemplateRef<BreadcrumbLinkContext>>();
  readonly navigate = output<BreadcrumbItem>();
  /** Actual path items, including root/current, excluding disclosure. Minimum two; default four. */
  readonly maxVisible = input(4);
  private readonly measuredCount = signal<number | null>(null);
  private readonly truncated = signal(false);
  protected readonly ceiling = computed(() =>
    Number.isFinite(this.maxVisible()) ? Math.max(2, Math.trunc(this.maxVisible())) : 4,
  );
  protected readonly visible = computed(() => {
    const all = this.locations();
    const count = Math.min(this.ceiling(), this.measuredCount() ?? this.ceiling());
    return all.length <= count ? all : [all[0], ...all.slice(-(count - 1))];
  });
  protected readonly needsDetails = computed(() => this.visible().length < this.locations().length || this.truncated());
  protected readonly panel = viewChild<ElementRef<HTMLElement>>('panel');
  protected readonly trigger = viewChild<ElementRef<HTMLButtonElement>>('trigger');
  private readonly probe = viewChild<ElementRef<HTMLElement>>('probe');
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly document = inject(DOCUMENT);
  private readonly destroyRef = inject(DestroyRef);
  private readonly platform = inject(PLATFORM_ID);
  private resizeObserver?: ResizeObserver;
  private isOpen = false;
  private pointerWithinDisclosure = false;
  private openPanel: HTMLElement | null = null;
  private frame: number | undefined;
  private focusFrame: number | undefined;
  protected message(key: string): string {
    return this.translation.translate('breadcrumb.' + key);
  }

  protected readonly navigationName = computed(() => {
    const name = this.ariaLabel() ?? this.translation.translate('breadcrumb.navigation');
    if (!name.trim()) throw new Error('Breadcrumb: ariaLabel must be nonblank');
    return name;
  });
  protected readonly locations = computed(() => {
    const items = this.items();
    const ids = new Set<string>();
    return items.map((item, index) => {
      if (ids.has(item.id)) throw new Error(`Breadcrumb: duplicate id ${JSON.stringify(item.id)}`);
      ids.add(item.id);
      if (!item.label.trim()) throw new Error(`Breadcrumb: blank label at index ${index}`);
      if (item.href !== undefined) {
        // Match browser protocol parsing before Angular sanitization. Never build URLs from display labels.
        // eslint-disable-next-line no-control-regex -- Browsers ignore embedded ASCII controls in URL schemes.
        const href = item.href.replace(/[\u0000-\u0020\u007f]/g, '');
        const scheme = /^([a-z][a-z\d+.-]*):/i.exec(href)?.[1];
        if (!href || (scheme && !/^(https?|mailto|tel|ftp)$/i.test(scheme))) {
          throw new Error(`Breadcrumb: invalid href at index ${index}`);
        }
        try {
          // Validate syntax without resolving or changing the caller's rendered destination.
          void new URL(item.href, 'https://breadcrumb.invalid/');
        } catch {
          throw new Error(`Breadcrumb: invalid href at index ${index}`);
        }
      }
      const trail = items
        .slice(0, index + 1)
        .map((part) => part.label)
        .join(' > ');
      const depth = new Intl.NumberFormat(this.translation.locale()).format(index + 1);
      return {
        item,
        description: `${item.context ?? trail} · ${this.translation.translate('breadcrumb.depth', depth)}`,
      };
    });
  });

  constructor() {
    this.translation.loadTranslationsForComponent('breadcrumb', breadcrumbTranslations);
    effect(() => {
      this.items();
      this.ceiling();
      untracked(() => {
        this.close(false);
        this.measuredCount.set(null);
        this.truncated.set(false);
        this.schedule();
      });
    });
    afterNextRender(() => this.observe());
  }
  private schedule(): void {
    const view = this.document.defaultView;
    if (!isPlatformBrowser(this.platform) || !view?.requestAnimationFrame || this.frame !== undefined) return;
    this.frame = view.requestAnimationFrame(() => {
      this.frame = undefined;
      this.measure();
      this.position();
    });
  }

  private measure(): void {
    const host = this.host.nativeElement;
    const probe = this.probe()?.nativeElement;
    const view = this.document.defaultView;
    if (!probe || !view || host.clientWidth <= 0) return;
    const widths = Array.from(probe.children, (child) => child.getBoundingClientRect().width);
    if (!widths.length || widths.some((width) => width <= 0)) return;
    const font = parseFloat(view.getComputedStyle(host).fontSize);
    const trail = host.querySelector<HTMLElement>('.trail');
    if (!trail) return;
    const separator = trail.querySelector<HTMLElement>('.separator');
    const gap =
      parseFloat(view.getComputedStyle(trail).columnGap) +
      (separator
        ? parseFloat(view.getComputedStyle(separator.parentElement!).columnGap) +
          separator.getBoundingClientRect().width
        : 0);
    const available = trail.clientWidth;
    let count = Math.min(widths.length, this.ceiling());
    const budget = (n: number) => {
      const selected = widths.length <= n ? widths : [widths[0], ...widths.slice(-(n - 1))];
      return (
        selected.reduce((sum, width) => sum + width, 0) +
        gap * (selected.length - 1) +
        (n < widths.length ? Math.max(24, font) + gap : 0)
      );
    };
    while (count > 2 && budget(count) > available) count--;
    const details = budget(count) > available;
    const active = this.document.activeElement;
    // Only rescue focus when this instance removes the focused trail control.
    const focusedTrail = active instanceof Element && host.querySelector('.trail')?.contains(active);
    const focusedId =
      active instanceof Element ? active.closest<HTMLElement>('[data-location-id]')?.dataset['locationId'] : undefined;
    this.measuredCount.set(count);
    this.truncated.set(details);
    if (!this.needsDetails()) this.close(false);
    if (focusedTrail) {
      if (this.focusFrame !== undefined) this.document.defaultView?.cancelAnimationFrame(this.focusFrame);
      this.focusFrame = this.document.defaultView?.requestAnimationFrame(() => {
        this.focusFrame = undefined;
        if (
          active &&
          !active.isConnected &&
          (this.document.activeElement === this.document.body || this.document.activeElement === active)
        ) {
          const location = Array.from(host.querySelectorAll<HTMLElement>('.trail > li[data-location-id]')).find(
            (li) => li.dataset['locationId'] === focusedId,
          );
          const target =
            location?.querySelector<HTMLElement>('a,button') ??
            this.trigger()?.nativeElement ??
            host.querySelector<HTMLElement>('nav');
          target?.focus({preventScroll: true});
        }
      });
    }
  }

  private observe(): void {
    const view = this.document.defaultView;
    if (!view) return;
    const reposition = () => this.schedule();
    const pointerStart = (event: PointerEvent) => {
      const target = event.target;
      this.pointerWithinDisclosure =
        target instanceof Node &&
        !!(this.panel()?.nativeElement.contains(target) || this.trigger()?.nativeElement.contains(target));
    };
    const pointerCancel = () => {
      this.pointerWithinDisclosure = false;
    };
    const dismiss = (event: Event) => {
      // WebKit can focus the containing nav on pointer-down inside a native popover.
      // Keep it open until the pending inside click reaches its anchor/button.
      if (event.type === 'focusin' && this.pointerWithinDisclosure) return;
      if (event.type === 'click') this.pointerWithinDisclosure = false;
      const target = event.target;
      if (!(target instanceof Node) || !this.isOpen) return;
      if (this.panel()?.nativeElement.contains(target) || this.trigger()?.nativeElement.contains(target)) return;
      const inside = this.panel()?.nativeElement.contains(this.document.activeElement);
      const control =
        target instanceof Element
          ? target.closest<HTMLElement>('a[href],button,input,select,textarea,[tabindex]')
          : null;
      this.close(event.type === 'click' && !control && !!inside);
      if (event.type === 'click') control?.focus({preventScroll: true});
    };
    const escape = (event: KeyboardEvent) => {
      this.pointerWithinDisclosure = false;
      if (event.key === 'Escape' && this.isOpen) {
        event.preventDefault();
        this.close(true);
      }
    };
    if (typeof ResizeObserver !== 'undefined') {
      this.resizeObserver = new ResizeObserver(reposition);
      this.resizeObserver.observe(this.host.nativeElement);
      // Intrinsic probe dimensions react to fonts, locale, density and inherited CSS even at fixed host width.
      const probe = this.probe()?.nativeElement;
      if (probe) this.resizeObserver.observe(probe);
    }
    view.addEventListener('resize', reposition);
    view.visualViewport?.addEventListener('resize', reposition);
    this.document.fonts?.addEventListener('loadingdone', reposition);
    this.document.addEventListener('scroll', reposition, true);
    this.document.addEventListener('pointerdown', pointerStart, true);
    this.document.addEventListener('pointercancel', pointerCancel, true);
    this.document.addEventListener('click', dismiss, true);
    this.document.addEventListener('focusin', dismiss);
    this.document.addEventListener('keydown', escape);
    this.schedule();
    this.destroyRef.onDestroy(() => {
      this.close(false);
      this.resizeObserver?.disconnect();
      if (this.frame !== undefined) view.cancelAnimationFrame(this.frame);
      if (this.focusFrame !== undefined) view.cancelAnimationFrame(this.focusFrame);
      view.removeEventListener('resize', reposition);
      view.visualViewport?.removeEventListener('resize', reposition);
      this.document.fonts?.removeEventListener('loadingdone', reposition);
      this.document.removeEventListener('scroll', reposition, true);
      this.document.removeEventListener('pointerdown', pointerStart, true);
      this.document.removeEventListener('pointercancel', pointerCancel, true);
      this.document.removeEventListener('click', dismiss, true);
      this.document.removeEventListener('focusin', dismiss);
      this.document.removeEventListener('keydown', escape);
    });
  }
  toggle(): void {
    if (this.isOpen) return this.close(true);
    const panel = this.panel()?.nativeElement;
    if (!panel) return;
    if (!panel.showPopover) return;
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
    }
    // Forward Tab keeps native sequential navigation (including inert, disabled and tabindex rules).
    // The document focusin listener closes the panel after focus moves outside it.
  }

  activate(item: BreadcrumbItem): void {
    this.close(false);
    this.navigate.emit(item);
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
