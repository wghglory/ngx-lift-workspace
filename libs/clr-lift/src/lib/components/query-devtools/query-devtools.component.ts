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
import {copyableJson, valueRows, ValueRow} from './query-value-preview';

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

  /** Runtime gate. For build-time exclusion use provideQueryDevtools from clr-lift/devtools. */
  readonly enabled = input(isDevMode());
  /** Caller retains ownership; defaults to this injector's QUERY_CLIENT. */
  readonly client = input<QueryClient>();
  /** Inline documentation trigger or floating application launcher. */
  readonly launcher = input<'inline' | 'floating'>('inline');

  protected readonly canRefetch = computed(
    () => typeof (this.client() ?? this.defaultClient).refetchQuery === 'function',
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
  protected readonly expanded = signal<ReadonlyMap<string, number>>(new Map());
  private readonly previewRevision = signal(0);
  protected readonly actionError = signal('');
  protected readonly copyNotice = signal(false);
  protected readonly selectedEntry = computed(() =>
    this.snapshot()?.entries.find((entry) => entry.serializedKey === this.selectedKey()),
  );
  protected readonly inspectedValue = computed(() => {
    const state = this.selectedSnapshot();
    return this.tab() === 'error' ? (state?.error ?? state?.failureReason) : state?.value;
  });
  protected readonly tree = computed(() => {
    this.previewRevision();
    return valueRows(this.inspectedValue(), this.expanded());
  });
  protected readonly entries = computed(() => {
    const search = this.search().toLowerCase();
    return (this.snapshot()?.entries ?? [])
      .filter((entry) => entry.serializedKey.toLowerCase().includes(search))
      .map((entry) => {
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
        const age =
          entry.updatedAt === null ? '—' : `${Math.max(0, Math.floor((Date.now() - entry.updatedAt) / 1000))}s`;
        return {...entry, age, state, stateLabel: this.translationService.translate(`queryDevtools.${state}`)};
      });
  });

  constructor() {
    inject(DestroyRef).onDestroy(() => {
      this.isOpen.set(false);
      this.select(null);
      this.snapshot.set(null);
    });
    this.translationService.loadTranslationsForComponent('queryDevtools', queryDevtoolsTranslations);
    effect(() => {
      this.client();
      this.select(null);
    });
    effect((onCleanup) => {
      if (!this.enabled()) this.isOpen.set(false);
      if (!this.isOpen()) {
        this.snapshot.set(null);
        this.select(null);
        return;
      }
      const client = this.client() ?? this.defaultClient;
      if (!this.isBrowser || this.paused()) return;
      untracked(() => this.readSnapshot(client));
      const timer = setInterval(() => this.readSnapshot(client), 1000);
      onCleanup(() => clearInterval(timer));
    });
  }

  protected openPanel(trigger: HTMLButtonElement): void {
    this.trigger = trigger;
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
    this.actionRevision++;
    this.isOpen.set(false);
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
    this.expanded.set(new Map());
    this.tab.set('data');
    this.actionError.set('');
    this.copyNotice.set(false);
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
    this.expanded.set(new Map());
    this.copyNotice.set(false);
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
    await this.copy(entry.serializedKey);
  }

  protected async copyData(): Promise<void> {
    const text = copyableJson(this.inspectedValue());
    if (text === undefined) {
      this.actionError.set(this.translationService.translate('queryDevtools.copyLimit'));
      return;
    }
    await this.copy(text);
  }

  private async copy(text: string): Promise<void> {
    const revision = ++this.actionRevision;
    try {
      const clipboard = this.document.defaultView?.navigator.clipboard;
      if (!clipboard) throw new Error('Clipboard unavailable');
      await clipboard.writeText(text);
      if (!this.isCurrentAction(revision)) return;
      this.copyNotice.set(true);
      this.actionError.set('');
    } catch {
      if (this.isCurrentAction(revision))
        this.actionError.set(this.translationService.translate('queryDevtools.copyFailed'));
    }
  }

  protected async refetch(entry: QueryEntryDiagnostics): Promise<void> {
    if (!this.canRefetch()) return;
    const revision = ++this.actionRevision;
    this.actionError.set('');
    try {
      const client = this.client() ?? this.defaultClient;
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
      if (this.isCurrentAction(revision)) this.refresh();
    }
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
    this.setHeight(this.panelHeight() + (event.key === 'ArrowUp' ? 20 : -20));
  }

  protected startResize(event: PointerEvent): void {
    const handle = event.currentTarget as HTMLElement;
    handle.setPointerCapture(event.pointerId);
    const startY = event.clientY;
    const startHeight = this.panelHeight();
    handle.onpointermove = (move) => this.setHeight(startHeight + startY - move.clientY);
    handle.onlostpointercapture = () => {
      handle.onpointermove = null;
      handle.onpointerup = null;
      handle.onlostpointercapture = null;
    };
    handle.onpointerup = () => handle.releasePointerCapture(event.pointerId);
  }

  private clampHeight(height: number): number {
    return Math.max(200, Math.min(height, (this.document.defaultView?.innerHeight ?? 800) - 24));
  }

  private setHeight(height: number): void {
    this.fullHeight.set(false);
    this.panelHeight.set(this.clampHeight(height));
    try {
      this.document.defaultView?.sessionStorage.setItem('cll-query-devtools-height', String(this.panelHeight()));
    } catch {
      /* Resizing still works without storage. */
    }
  }

  protected trackEntry(_index: number, entry: QueryEntryDiagnostics): string {
    return entry.serializedKey;
  }
}
