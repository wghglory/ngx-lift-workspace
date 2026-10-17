import {DOCUMENT, DatePipe, isPlatformBrowser} from '@angular/common';
import {
  afterNextRender,
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  effect,
  ElementRef,
  inject,
  Injector,
  input,
  isDevMode,
  PLATFORM_ID,
  signal,
  untracked,
  viewChild,
} from '@angular/core';
import {ClarityModule} from '@clr/angular';
import {QUERY_CLIENT, QueryClient, QueryClientDiagnostics, QueryEntryDiagnostics, QuerySnapshot} from 'ngx-lift';

import {TranslatePipe} from '../../pipes/translate.pipe';
import {TranslationService} from '../../services/translation.service';
import {AlertComponent} from '../alert/alert.component';
import {queryDevtoolsTranslations} from './query-devtools.l10n';
import {copyableJson, expandValueRows, valueRows, ValueRow} from './query-value-preview';

let nextPanelId = 0;

/**
 * Development query inspector. Reads metadata only while open; Refetch explicitly invokes the selected loader.
 * @example
 * ```html
 * <cll-query-devtools [client]="featureQueryClient" />
 * ```
 */
@Component({
  selector: 'cll-query-devtools',
  imports: [ClarityModule, DatePipe, TranslatePipe, AlertComponent],
  templateUrl: './query-devtools.component.html',
  styleUrl: './query-devtools.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class QueryDevtoolsComponent {
  private readonly translationService = inject(TranslationService);
  private readonly defaultClient = inject(QUERY_CLIENT);
  private readonly document = inject(DOCUMENT);
  private readonly injector = inject(Injector);
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  private readonly panel = viewChild<ElementRef<HTMLElement>>('panel');
  private readonly searchInput = viewChild<ElementRef<HTMLInputElement>>('searchInput');
  private trigger?: HTMLButtonElement;
  private actionRevision = 0;
  private panelRevision = 0;
  private stopResize?: () => void;
  private readonly viewportHeight = signal(this.document.defaultView?.innerHeight ?? 800);
  private copyNoticeTimer?: ReturnType<typeof setTimeout>;

  /** Runtime gate. For build-time exclusion use provideQueryDevtools from clr-lift/devtools. */
  readonly enabled = input(isDevMode());
  /** Caller retains ownership; defaults to this injector's QUERY_CLIENT. */
  readonly client = input<QueryClient>();
  /** Inline documentation trigger or floating application launcher. */
  readonly launcher = input<'inline' | 'floating'>('inline');

  protected readonly canRefetch = computed(
    () => typeof (this.client() ?? this.defaultClient).refetchQuery === 'function',
  );

  protected readonly maxPanelHeight = computed(() => Math.max(0, this.viewportHeight() - 24));
  protected readonly minPanelHeight = computed(() => Math.min(200, this.maxPanelHeight()));
  protected readonly renderedPanelHeight = computed(() =>
    this.fullHeight() ? this.maxPanelHeight() : this.clampHeight(this.panelHeight()),
  );

  protected readonly panelId = `cll-query-devtools-${nextPanelId++}`;
  protected readonly isOpen = signal(false);
  protected readonly paused = signal(false);
  protected readonly fullHeight = signal(false);
  protected readonly panelHeight = signal(380);
  protected readonly snapshot = signal<QueryClientDiagnostics | null>(null);
  protected readonly selectedKey = signal<string | null>(null);
  protected readonly selectedSnapshot = signal<QuerySnapshot<unknown> | undefined>(undefined);
  protected readonly tabs = ['data', 'error', 'details'] as const;
  protected readonly tab = signal<(typeof this.tabs)[number]>('data');
  protected readonly search = signal('');
  protected readonly emptyExpansion: ReadonlyMap<string, number> = new Map();
  protected readonly expanded = signal<ReadonlyMap<string, number>>(new Map([['$', 0]]));
  private readonly previewRevision = signal(0);
  protected readonly actionError = signal('');
  protected readonly copyNotice = signal<'key' | 'data' | null>(null);
  protected readonly viewUpdatedAt = signal<number | null>(null);
  protected readonly stateFilter = signal('all');
  protected readonly tagFilter = signal('');
  protected readonly tags = computed(() => {
    const tags = new Set(this.snapshot()?.entries.flatMap((entry) => entry.tagMemberships) ?? []);
    // Preserve the selected filter's visible label after its last matching entry is evicted.
    if (this.tagFilter()) tags.add(this.tagFilter());
    return [...tags].sort();
  });
  protected readonly selectedEntry = computed(() =>
    this.allEntries().find((entry) => entry.serializedKey === this.selectedKey()),
  );
  protected readonly inspectedValue = computed(() => {
    const state = this.selectedSnapshot();
    return this.tab() === 'error' ? (state?.error ?? state?.failureReason) : state?.value;
  });
  protected readonly tree = computed(() => {
    this.previewRevision();
    return valueRows(this.inspectedValue(), this.expanded());
  });
  protected readonly previewLimited = computed(
    () => this.tree().length >= 500 || this.tree().some((row) => row.truncated || row.nextOffset !== undefined),
  );
  protected readonly allEntries = computed(() => {
    return (this.snapshot()?.entries ?? []).map((entry) => {
      const state = entry.isPending
        ? entry.nextRetryAt !== null
          ? 'retrying'
          : entry.hasValue
            ? 'refreshing'
            : 'loading'
        : entry.status === 'error'
          ? 'error'
          : entry.hasValue
            ? entry.isStale
              ? 'stale'
              : 'fresh'
            : 'idle';
      const age = entry.updatedAt === null ? '—' : `${Math.max(0, Math.floor((Date.now() - entry.updatedAt) / 1000))}s`;
      return {
        ...entry,
        age,
        state,
        tagLabels: entry.tagMemberships.join(' '),
        stateLabel: this.translationService.translate(`queryDevtools.${state}`),
      };
    });
  });
  private readonly matchingEntries = computed(() => {
    const search = this.search().toLowerCase();
    const tag = this.tagFilter();
    return this.allEntries().filter(
      (entry) => entry.serializedKey.toLowerCase().includes(search) && (!tag || entry.tagMemberships.includes(tag)),
    );
  });
  protected readonly stateFilters = computed(() => {
    const entries = this.matchingEntries();
    return ['all', 'fresh', 'stale', 'loading', 'refreshing', 'retrying', 'error', 'idle', 'inactive'].map((state) => ({
      state,
      count: entries.filter((entry) =>
        state === 'all' ? true : state === 'inactive' ? entry.observerCount === 0 : entry.state === state,
      ).length,
    }));
  });
  protected readonly entries = computed(() => {
    const state = this.stateFilter();
    return this.matchingEntries().filter((entry) =>
      state === 'all' ? true : state === 'inactive' ? entry.observerCount === 0 : entry.state === state,
    );
  });

  constructor() {
    inject(DestroyRef).onDestroy(() => {
      this.isOpen.set(false);
      this.select(null);
      this.snapshot.set(null);
      this.stopResize?.();
    });
    this.translationService.loadTranslationsForComponent('queryDevtools', queryDevtoolsTranslations);
    effect(() => {
      if (!this.enabled() && untracked(() => this.isOpen())) {
        untracked(() => this.closePanel());
      }
    });
    effect(() => {
      this.client();
      untracked(() => {
        this.panelRevision++;
        this.select(null);
        this.snapshot.set(null);
        this.tagFilter.set('');
        this.viewUpdatedAt.set(null);
      });
    });
    effect((onCleanup) => {
      if (!this.enabled() || !this.isOpen() || !this.isBrowser) return;
      const client = this.client() ?? this.defaultClient;
      const paused = this.paused();
      untracked(() => this.readSnapshot(client));
      if (paused) return;
      const timer = setInterval(() => this.readSnapshot(client), 1000);
      onCleanup(() => clearInterval(timer));
    });
    effect((onCleanup) => {
      if (!this.enabled() || !this.isOpen() || !this.isBrowser) return;
      const viewport = this.document.defaultView;
      if (!viewport) return;
      const updateHeight = () => this.viewportHeight.set(viewport.innerHeight);
      untracked(updateHeight);
      viewport.addEventListener('resize', updateHeight);
      onCleanup(() => viewport.removeEventListener('resize', updateHeight));
    });
  }

  protected openPanel(trigger: HTMLButtonElement): void {
    this.trigger = trigger;
    this.panelRevision++;
    this.viewportHeight.set(this.document.defaultView?.innerHeight ?? 800);
    this.actionError.set('');
    this.isOpen.set(true);
    try {
      const height = Number(this.document.defaultView?.sessionStorage.getItem('cll-query-devtools-height'));
      if (height > 0) this.panelHeight.set(this.clampHeight(height));
    } catch {
      /* Storage may be unavailable in a sandbox. */
    }
    afterNextRender(
      () => {
        this.panel()?.nativeElement.showPopover?.();
        this.searchInput()?.nativeElement.focus();
      },
      {injector: this.injector},
    );
  }

  protected closePanel(): void {
    this.panelRevision++;
    this.actionRevision++;
    this.stopResize?.();
    this.isOpen.set(false);
    this.viewUpdatedAt.set(null);
    this.select(null);
    this.snapshot.set(null);
    this.trigger?.focus();
  }

  protected handleEscape(event: Event): void {
    if (event.defaultPrevented || (event.target instanceof Element && event.target.closest('.datagrid-filter'))) return;
    event.stopPropagation();
    if (this.selectedKey()) this.backToList();
    else this.closePanel();
  }

  protected refresh(): void {
    if (this.enabled() && this.isOpen() && this.isBrowser) {
      this.readSnapshot(this.client() ?? this.defaultClient);
      this.previewRevision.update((value) => value + 1);
    }
  }

  protected togglePause(): void {
    this.viewUpdatedAt.set(null);
    this.paused.set(!this.paused());
  }

  protected updateView(): void {
    this.refresh();
    this.viewUpdatedAt.set(Date.now());
  }

  protected filterByTag(tag: string): void {
    this.tagFilter.set(tag);
    this.search.set('');
    this.stateFilter.set('all');
    this.select(null);
    afterNextRender(() => this.searchInput()?.nativeElement.focus(), {injector: this.injector});
  }

  protected expandFirstLevel(): void {
    this.expanded.set(new Map([['$', 0]]));
  }

  protected expandLevels(mode: 'next' | 'all'): void {
    this.expanded.set(expandValueRows(this.inspectedValue(), this.expanded(), mode));
  }

  private readSnapshot(client: QueryClient): void {
    this.snapshot.set(client.getDiagnostics());
    const entry = this.selectedEntry();
    this.selectedSnapshot.set(entry ? client.getSnapshot(entry.key) : undefined);
    if (!entry) this.flushPreview();
  }

  protected select(entry: QueryEntryDiagnostics | null): void {
    this.actionRevision++;
    this.selectedKey.set(entry?.serializedKey ?? null);
    this.selectedSnapshot.set(entry ? (this.client() ?? this.defaultClient).getSnapshot(entry.key) : undefined);
    this.expandFirstLevel();
    this.tab.set('data');
    this.actionError.set('');
    this.clearCopyNotice();
    // Computed values are lazy: flush their cached payload/preview references when inspection ends.
    if (!entry) this.flushPreview();
    else if (this.isBrowser)
      afterNextRender(
        () => {
          this.panel()
            ?.nativeElement.querySelector<HTMLButtonElement>('.query-inspector [aria-selected="true"]')
            ?.focus();
        },
        {injector: this.injector},
      );
  }

  protected backToList(): void {
    const target = this.panel()?.nativeElement.querySelector<HTMLButtonElement>('.selected-row .key-button');
    this.select(null);
    afterNextRender(() => target?.focus(), {injector: this.injector});
  }

  protected nextTab(step: number, event: Event): void {
    event.preventDefault();
    const tab = this.tabs[(this.tabs.indexOf(this.tab()) + step + this.tabs.length) % this.tabs.length];
    this.switchTab(tab);
    this.document.getElementById(`${this.panelId}-${tab}`)?.focus();
  }

  protected switchTab(tab: 'data' | 'error' | 'details'): void {
    this.actionRevision++;
    this.tab.set(tab);
    this.expandFirstLevel();
    this.clearCopyNotice();
  }

  protected expand(row: ValueRow): void {
    this.expanded.update((current) => {
      const next = new Map(current);
      if (row.nextOffset !== undefined) next.set(row.path, row.nextOffset);
      else if (next.has(row.path)) next.delete(row.path);
      else next.set(row.path, 0);
      return next;
    });
  }

  protected async copyKey(entry: QueryEntryDiagnostics): Promise<void> {
    await this.copy(entry.serializedKey, 'key');
  }

  protected async copyData(): Promise<void> {
    const text = copyableJson(this.inspectedValue());
    if (text === undefined) {
      this.actionError.set(this.translationService.translate('queryDevtools.copyLimit'));
      return;
    }
    await this.copy(text, 'data');
  }

  private async copy(text: string, target: 'key' | 'data'): Promise<void> {
    const revision = ++this.actionRevision;
    try {
      const clipboard = this.document.defaultView?.navigator.clipboard;
      if (!clipboard) throw new Error('Clipboard unavailable');
      await clipboard.writeText(text);
      if (!this.isCurrentAction(revision)) return;
      this.clearCopyNotice();
      this.copyNotice.set(target);
      this.actionError.set('');
      this.copyNoticeTimer = setTimeout(() => {
        this.copyNoticeTimer = undefined;
        this.copyNotice.set(null);
      }, 2000);
    } catch {
      if (this.isCurrentAction(revision))
        this.actionError.set(this.translationService.translate('queryDevtools.copyFailed'));
    }
  }

  protected async refetch(entry: QueryEntryDiagnostics): Promise<void> {
    if (!this.canRefetch()) return;
    const revision = ++this.actionRevision;
    const panelRevision = this.panelRevision;
    const client = this.client() ?? this.defaultClient;
    this.actionError.set('');
    try {
      const request = client.refetchQuery(entry.key);
      if (!request) {
        this.actionError.set(this.translationService.translate('queryDevtools.evicted'));
        return;
      }
      this.readSnapshot(client);
      await request;
    } catch {
      if (this.isCurrentAction(revision))
        this.actionError.set(this.translationService.translate('queryDevtools.refetchFailed'));
    } finally {
      if (panelRevision === this.panelRevision && client === (this.client() ?? this.defaultClient)) this.refresh();
    }
  }

  protected async refetchFromList(entry: QueryEntryDiagnostics): Promise<void> {
    this.select(entry);
    await this.refetch(entry);
  }

  private clearCopyNotice(): void {
    if (this.copyNoticeTimer !== undefined) clearTimeout(this.copyNoticeTimer);
    this.copyNoticeTimer = undefined;
    this.copyNotice.set(null);
  }

  private flushPreview(): void {
    untracked(() => {
      this.inspectedValue();
      this.tree();
    });
  }

  private isCurrentAction(revision: number): boolean {
    return revision === this.actionRevision && this.enabled() && this.isOpen();
  }

  protected resizeBy(event: KeyboardEvent): void {
    if (event.key !== 'ArrowUp' && event.key !== 'ArrowDown') return;
    event.preventDefault();
    this.setHeight(this.renderedPanelHeight() + (event.key === 'ArrowUp' ? 20 : -20));
  }

  protected startResize(event: PointerEvent): void {
    this.stopResize?.();
    const handle = event.currentTarget as HTMLElement;
    handle.setPointerCapture(event.pointerId);
    const startY = event.clientY;
    const startHeight = this.renderedPanelHeight();
    handle.onpointermove = (move) => {
      this.fullHeight.set(false);
      this.panelHeight.set(this.clampHeight(startHeight + startY - move.clientY));
    };
    const finishResize = () => {
      handle.onpointermove = null;
      handle.onpointerup = null;
      handle.onpointercancel = null;
      handle.onlostpointercapture = null;
      this.stopResize = undefined;
      this.persistHeight();
    };
    this.stopResize = finishResize;
    handle.onpointercancel = finishResize;
    handle.onlostpointercapture = finishResize;
    handle.onpointerup = (upEvent) => {
      finishResize();
      try {
        handle.releasePointerCapture(upEvent.pointerId);
      } catch {
        /* Pointer capture may have already been released */
      }
    };
  }

  private clampHeight(height: number): number {
    return Math.max(this.minPanelHeight(), Math.min(height, this.maxPanelHeight()));
  }

  private setHeight(height: number): void {
    this.fullHeight.set(false);
    this.panelHeight.set(this.clampHeight(height));
    this.persistHeight();
  }

  private persistHeight(): void {
    try {
      this.document.defaultView?.sessionStorage.setItem('cll-query-devtools-height', String(this.panelHeight()));
    } catch {
      /* Resizing still works without storage. */
    }
  }

  protected trackEntry(_index: number, entry: QueryEntryDiagnostics): string {
    return entry.serializedKey;
  }

  protected trackTreeRow(_index: number, row: ValueRow): string {
    return row.path + (row.nextOffset !== undefined ? ':more' : '');
  }
}
