import {isDevMode, PLATFORM_ID} from '@angular/core';
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {provideNoopAnimations} from '@angular/platform-browser/animations';
import {By} from '@angular/platform-browser';
import {ClrDatagridColumn, ClrDatagridPagination, ClrDatagridSortOrder} from '@clr/angular';
import {QUERY_CLIENT, QueryClient} from 'ngx-lift';
import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest';

import {TranslationService} from '../../services/translation.service';
import {QueryDevtoolsComponent} from './query-devtools.component';
import {queryDevtoolsTranslations} from './query-devtools.l10n';

describe('QueryDevtoolsComponent', () => {
  let fixture: ComponentFixture<QueryDevtoolsComponent>;
  let client: QueryClient;
  const scrollIntoView = Object.getOwnPropertyDescriptor(HTMLElement.prototype, 'scrollIntoView');

  beforeEach(() => {
    Object.defineProperty(HTMLElement.prototype, 'scrollIntoView', {value: () => undefined, configurable: true});
    client = new QueryClient();
    TestBed.configureTestingModule({
      imports: [QueryDevtoolsComponent],
      providers: [{provide: QUERY_CLIENT, useValue: client}, provideNoopAnimations()],
    });
  });

  afterEach(() => {
    if (fixture && !fixture.componentRef.hostView.destroyed) fixture.destroy();
    client.destroy();
    vi.useRealTimers();
    vi.restoreAllMocks();
    if (scrollIntoView) Object.defineProperty(HTMLElement.prototype, 'scrollIntoView', scrollIntoView);
    else Reflect.deleteProperty(HTMLElement.prototype, 'scrollIntoView');
  });

  function mount(): void {
    fixture = TestBed.createComponent(QueryDevtoolsComponent);
    TestBed.inject(TranslationService).setLanguage('en', false);
    fixture.detectChanges();
  }

  function click(label: string): void {
    const scope = label === 'Copy key' ? document : fixture.nativeElement;
    const buttons = Array.from(scope.querySelectorAll('button')) as HTMLButtonElement[];
    const button = buttons.find(
      (button) =>
        button.textContent?.trim().replace(/\s+/g, ' ') === label || button.getAttribute('aria-label') === label,
    );
    if (!button) throw new Error(`Missing button: ${label}`);
    button.click();
    fixture.detectChanges();
  }

  function inspectFirstQuery(): void {
    (fixture.nativeElement.querySelector('.key-button') as HTMLButtonElement).click();
    fixture.detectChanges();
  }

  function updateView(): void {
    if (fixture.nativeElement.querySelector('button[aria-label="Pause updates"]')) click('Pause updates');
    click('Update view');
  }

  function copyKey(): void {
    click('Actions');
    click('Copy key');
  }

  it('shows data immediately and keeps view reads separate from loader execution', async () => {
    const loader = vi.fn(() => Promise.resolve({name: 'Alex'}));
    await client.fetchQuery({key: ['profile'], loader});
    mount();
    click('Query devtools');
    expect(fixture.nativeElement.querySelector('button[title="Read cached state without fetching."]')).toBeNull();
    expect(fixture.nativeElement.querySelectorAll('clr-dg-column')).toHaveLength(4);
    inspectFirstQuery();
    expect(fixture.nativeElement.querySelector('.value-tree')?.textContent).toContain('Alex');
    expect(fixture.nativeElement.querySelector('.preview-note')).toBeNull();
    click('Collapse all');
    expect(fixture.nativeElement.querySelectorAll('.value-row')).toHaveLength(1);
    click('Expand first level');
    expect(fixture.nativeElement.querySelector('.value-tree')?.textContent).toContain('Alex');
    updateView();
    expect(fixture.nativeElement.querySelector('.view-feedback')?.textContent).toContain('View updated at');
    expect(loader).toHaveBeenCalledTimes(1);
    click('Resume updates');
    expect(fixture.nativeElement.querySelector('.view-feedback')).toBeNull();
    click('Pause updates');
    expect(fixture.nativeElement.querySelector('.view-feedback')).toBeNull();
  });

  it('combines key, tag and state filters without fetching and navigates from a shared tag', async () => {
    const loader = vi.fn(() => Promise.resolve(42));
    const first = {key: ['team', 'a'], tags: [{type: 'team'}], staleTime: Infinity, loader};
    await client.fetchQuery(first);
    await client.fetchQuery({key: ['team', 'b'], tags: [{type: 'team'}], loader});
    await client.fetchQuery({key: ['other'], tags: [{type: 'other'}], staleTime: Infinity, loader});
    const unsubscribe = client.observeQuery(first, () => undefined);
    try {
      mount();
      click('Query devtools');
      click('inactive 2');
      expect(fixture.nativeElement.querySelectorAll('clr-dg-row')).toHaveLength(2);
      const select = fixture.nativeElement.querySelector('select') as HTMLSelectElement;
      select.value = client.getDiagnostics().entries.find((entry) => entry.key[1] === 'a')?.tagMemberships[0] ?? '';
      select.dispatchEvent(new Event('change'));
      fixture.detectChanges();
      expect(fixture.nativeElement.querySelectorAll('clr-dg-row')).toHaveLength(1);
      click('fresh 1');
      expect(fixture.nativeElement.querySelector('clr-dg-row')?.textContent).toContain('"a"');
      const search = fixture.nativeElement.querySelector('input[type="search"]') as HTMLInputElement;
      search.value = '"a"';
      search.dispatchEvent(new Event('input'));
      fixture.detectChanges();
      inspectFirstQuery();
      click('Details');
      (fixture.nativeElement.querySelector('.tag-button') as HTMLButtonElement).click();
      fixture.detectChanges();
      expect(fixture.nativeElement.querySelector('.query-inspector')).toBeNull();
      expect(search.value).toBe('');
      expect(fixture.nativeElement.querySelectorAll('clr-dg-row')).toHaveLength(2);
      expect(loader).toHaveBeenCalledTimes(3);
      expect(client.getDiagnostics().totalObserverCount).toBe(1);
      const tag = select.value;
      client.removeQueries((key) => key[0] === 'team');
      updateView();
      expect(select.value).toBe(tag);
      expect(fixture.nativeElement.querySelectorAll('clr-dg-row')).toHaveLength(0);
    } finally {
      unsubscribe();
    }
  });

  it('shows preview limits only when the displayed data is paged or truncated', async () => {
    await client.fetchQuery({key: ['limited'], loader: () => Promise.resolve({text: 'x'.repeat(2001)})});
    mount();
    click('Query devtools');
    inspectFirstQuery();
    expect(fixture.nativeElement.querySelector('.preview-note')).not.toBeNull();
  });

  it('uses the development-mode default and does not read diagnostics while closed', () => {
    const snapshots = vi.spyOn(client, 'getDiagnostics');
    mount();
    expect(fixture.componentInstance.enabled()).toBe(isDevMode());
    expect(snapshots).not.toHaveBeenCalled();
    fixture.componentRef.setInput('enabled', false);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('button')).toBeNull();
  });

  it('refreshes only while open and stops on closing, disabling and destruction', () => {
    vi.useFakeTimers();
    const snapshots = vi.spyOn(client, 'getDiagnostics');
    mount();
    vi.advanceTimersByTime(2000);
    expect(snapshots).not.toHaveBeenCalled();
    click('Query devtools');
    expect(snapshots).toHaveBeenCalledTimes(1);
    vi.advanceTimersByTime(2000);
    expect(snapshots).toHaveBeenCalledTimes(3);
    updateView();
    expect(snapshots).toHaveBeenCalledTimes(5);
    click('Close');
    vi.advanceTimersByTime(2000);
    expect(snapshots).toHaveBeenCalledTimes(5);
    click('Query devtools');
    fixture.componentRef.setInput('enabled', false);
    fixture.detectChanges();
    const disabledCount = snapshots.mock.calls.length;
    vi.advanceTimersByTime(2000);
    expect(snapshots).toHaveBeenCalledTimes(disabledCount);
    fixture.componentRef.setInput('enabled', true);
    fixture.detectChanges();
    vi.advanceTimersByTime(1000);
    expect(snapshots).toHaveBeenCalledTimes(disabledCount);
    click('Query devtools');
    fixture.destroy();
    const destroyedCount = snapshots.mock.calls.length;
    vi.advanceTimersByTime(2000);
    expect(snapshots).toHaveBeenCalledTimes(destroyedCount);
  });

  it('switches an open dialog to a caller-owned client without refetching data', async () => {
    const otherClient = new QueryClient();
    const loader = vi.fn(() => Promise.resolve('cached value'));
    await otherClient.fetchQuery({key: ['scoped'], loader});
    const otherSnapshots = vi.spyOn(otherClient, 'getDiagnostics');
    try {
      mount();
      click('Query devtools');
      fixture.componentRef.setInput('client', otherClient);
      fixture.detectChanges();
      expect(otherSnapshots).toHaveBeenCalledTimes(1);
      expect(fixture.nativeElement.textContent).toContain('scoped');
      updateView();
      expect(otherSnapshots).toHaveBeenCalledTimes(3);
      expect(loader).toHaveBeenCalledTimes(1);
      expect(otherClient.getDiagnostics().totalObserverCount).toBe(0);
    } finally {
      fixture.destroy();
      otherClient.destroy();
    }
  });

  it('replaces a paused snapshot when the caller switches clients', async () => {
    await client.fetchQuery({key: ['first-client'], loader: () => Promise.resolve('first')});
    const otherClient = new QueryClient();
    await otherClient.fetchQuery({key: ['second-client'], loader: () => Promise.resolve('second')});
    try {
      mount();
      click('Query devtools');
      click('Pause updates');
      fixture.componentRef.setInput('client', otherClient);
      fixture.detectChanges();
      expect(fixture.nativeElement.querySelector('clr-datagrid')?.textContent).toContain('second-client');
      expect(fixture.nativeElement.querySelector('clr-datagrid')?.textContent).not.toContain('first-client');
      inspectFirstQuery();
      expect(fixture.nativeElement.querySelector('.value-tree')?.textContent).toContain('second');
      expect(otherClient.getDiagnostics().totalObserverCount).toBe(0);
    } finally {
      fixture.destroy();
      otherClient.destroy();
    }
  });

  it('takes an initial snapshot when reopening a paused panel', async () => {
    mount();
    click('Query devtools');
    click('Pause updates');
    click('Close');
    await client.fetchQuery({key: ['while-closed'], loader: () => Promise.resolve(1)});
    click('Query devtools');
    expect(fixture.nativeElement.querySelector('clr-datagrid')?.textContent).toContain('while-closed');
  });

  it.each(['resolve', 'reject'])(
    'settles an explicit refetch after switching tabs while paused (%s)',
    async (outcome) => {
      await client.fetchQuery({key: ['profile'], loader: () => Promise.resolve('cached'), staleTime: Infinity});
      let resolveRequest: (value: string) => void = () => undefined;
      let rejectRequest: (error: Error) => void = () => undefined;
      const pending = new Promise<string>((resolve, reject) => {
        resolveRequest = resolve;
        rejectRequest = reject;
      });
      // Register a future loader without replacing the currently fresh value.
      await client.fetchQuery({key: ['profile'], loader: () => pending, staleTime: Infinity});
      mount();
      click('Query devtools');
      click('Pause updates');
      inspectFirstQuery();
      click('Refetch');
      expect(fixture.nativeElement.querySelector('.state-badge')?.textContent).toBe('refreshing');
      click('Details');
      if (outcome === 'resolve') resolveRequest('updated');
      else rejectRequest(new Error('offline'));
      await vi.waitFor(() => {
        fixture.detectChanges();
        expect(fixture.nativeElement.querySelector('.state-badge')?.textContent).toBe(
          outcome === 'resolve' ? 'fresh' : 'error',
        );
        expect(fixture.nativeElement.querySelector('button[aria-label="Refetch"]')?.disabled).toBe(false);
      });
    },
  );

  it('does not let an earlier refetch completion refresh a reopened paused panel', async () => {
    await client.fetchQuery({key: ['profile'], loader: () => Promise.resolve('cached'), staleTime: Infinity});
    let resolveRequest: (value: string) => void = () => undefined;
    const pending = new Promise<string>((resolve) => {
      resolveRequest = resolve;
    });
    await client.fetchQuery({key: ['profile'], loader: () => pending, staleTime: Infinity});
    const snapshots = vi.spyOn(client, 'getDiagnostics');
    mount();
    click('Query devtools');
    click('Pause updates');
    inspectFirstQuery();
    click('Refetch');
    click('Close');
    click('Query devtools');
    const count = snapshots.mock.calls.length;
    resolveRequest('updated');
    await pending;
    await fixture.whenStable();
    fixture.detectChanges();
    expect(snapshots).toHaveBeenCalledTimes(count);
    updateView();
    expect(fixture.nativeElement.querySelector('.state-badge')?.textContent).toBe('fresh');
  });

  it('updates separator bounds and full-height values when the viewport changes', () => {
    const original = Object.getOwnPropertyDescriptor(window, 'innerHeight');
    Object.defineProperty(window, 'innerHeight', {value: 800, configurable: true});
    try {
      mount();
      click('Query devtools');
      const handle = fixture.nativeElement.querySelector('[role="separator"]') as HTMLElement;
      expect(handle.getAttribute('aria-valuemax')).toBe('776');
      click('Full height');
      expect(handle.getAttribute('aria-valuenow')).toBe('776');
      Object.defineProperty(window, 'innerHeight', {value: 180, configurable: true});
      window.dispatchEvent(new Event('resize'));
      fixture.detectChanges();
      expect(handle.getAttribute('aria-valuemax')).toBe('156');
      expect(handle.getAttribute('aria-valuemin')).toBe('156');
      expect(handle.getAttribute('aria-valuenow')).toBe('156');
    } finally {
      if (original) Object.defineProperty(window, 'innerHeight', original);
    }
  });

  it('renders an empty state and updates open-dialog labels when language changes', () => {
    mount();
    click('Query devtools');
    expect(fixture.nativeElement.textContent).toContain(queryDevtoolsTranslations.en.empty);
    TestBed.inject(TranslationService).setLanguage('zh-CN', false);
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('查询开发工具');
    expect(fixture.nativeElement.textContent).toContain(queryDevtoolsTranslations['zh-CN'].empty);
  });

  it('limits rendered query rows to one page', async () => {
    await Promise.all(
      Array.from({length: 25}, (_, id) => client.fetchQuery({key: ['entry', id], loader: () => Promise.resolve(id)})),
    );
    mount();
    click('Query devtools');
    expect(fixture.nativeElement.querySelectorAll('clr-dg-row')).toHaveLength(20);
    expect(client.getDiagnostics().entryCount).toBe(25);
  });

  it.each([200, 2000])('bounds the grid at %i entries', async (count) => {
    client.destroy();
    client = new QueryClient({maxEntries: count});
    TestBed.overrideProvider(QUERY_CLIENT, {useValue: client});
    await Promise.all(
      Array.from({length: count}, (_, id) =>
        client.fetchQuery({key: ['scale', id], loader: () => Promise.resolve(id)}),
      ),
    );
    mount();
    const start = performance.now();
    click('Query devtools');
    const elapsed = performance.now() - start;
    expect(fixture.nativeElement.querySelectorAll('clr-dg-row')).toHaveLength(20);
    expect(client.getDiagnostics().entryCount).toBe(count);
    console.info(
      `Devtools ${count} entries: initial snapshot/grid ${elapsed.toFixed(1)} ms; 20 rendered rows (JSDOM).`,
    );
  });

  it('preserves ordering and pagination when snapshots refresh', async () => {
    await Promise.all(
      Array.from({length: 25}, (_, id) => client.fetchQuery({key: ['entry', id], loader: () => Promise.resolve(id)})),
    );
    mount();
    click('Query devtools');
    await fixture.whenStable();
    fixture.detectChanges();
    const columns = fixture.debugElement
      .queryAll(By.directive(ClrDatagridColumn))
      .map((element) => element.componentInstance as ClrDatagridColumn);
    const keyColumn = columns.find((column) => column.field === 'serializedKey');
    const pagination = fixture.debugElement.query(By.directive(ClrDatagridPagination))
      .componentInstance as ClrDatagridPagination;
    if (!keyColumn) throw new Error('Missing key column');
    keyColumn.sortOrder = ClrDatagridSortOrder.DESC;
    fixture.detectChanges();
    await fixture.whenStable();
    (fixture.nativeElement.querySelector('button.pagination-next') as HTMLButtonElement).click();
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
    await vi.waitFor(() => {
      fixture.detectChanges();
      expect(fixture.nativeElement.querySelectorAll('clr-dg-row')).toHaveLength(5);
    });
    const firstKey = fixture.nativeElement.querySelector('clr-dg-cell code').textContent;
    updateView();
    expect(pagination.currentPage).toBe(2);
    expect(fixture.nativeElement.querySelector('clr-dg-cell code').textContent).toBe(firstKey);
    expect(keyColumn.sortOrder).toBe(ClrDatagridSortOrder.DESC);
  });

  it('does not start diagnostic work on the server', () => {
    TestBed.overrideProvider(PLATFORM_ID, {useValue: 'server'});
    const snapshots = vi.spyOn(client, 'getDiagnostics');
    mount();
    click('Query devtools');
    expect(snapshots).not.toHaveBeenCalled();
  });

  it('provides the same nonempty labels for every supported locale', () => {
    const keys = Object.keys(queryDevtoolsTranslations.en).sort();
    for (const labels of Object.values(queryDevtoolsTranslations)) {
      expect(Object.keys(labels).sort()).toEqual(keys);
      expect(Object.values(labels).every((value) => value.trim().length > 0)).toBe(true);
    }
  });

  it('pauses metadata updates while leaving the application query alone', () => {
    vi.useFakeTimers();
    const snapshots = vi.spyOn(client, 'getDiagnostics');
    mount();
    click('Query devtools');
    click('Pause updates');
    const count = snapshots.mock.calls.length;
    vi.advanceTimersByTime(5000);
    expect(snapshots).toHaveBeenCalledTimes(count);
    updateView();
    expect(snapshots).toHaveBeenCalledTimes(count + 1);
    click('Resume updates');
    expect(snapshots).toHaveBeenCalledTimes(count + 2);
  });

  it('inspects cached data without observing or fetching and releases it on eviction and close', async () => {
    const data = {name: 'Alex', nested: [1, 2]};
    const loader = vi.fn(() => Promise.resolve(data));
    await client.fetchQuery({key: ['profile'], loader});
    mount();
    click('Query devtools');
    inspectFirstQuery();
    const tree = fixture.nativeElement.querySelector('.value-tree') as HTMLElement;
    expect(tree.textContent).toContain('Object(2)');
    expect(tree.textContent).toContain('Alex');
    data.name = 'Jordan';
    updateView();
    expect(tree.textContent).toContain('Jordan');
    expect(loader).toHaveBeenCalledTimes(1);
    expect(client.getDiagnostics().totalObserverCount).toBe(0);
    client.removeQueries();
    updateView();
    expect(fixture.nativeElement.textContent).toContain('Query is no longer cached.');
    expect(fixture.nativeElement.querySelector('.value-tree')).toBeNull();
    click('Close');
    expect(fixture.nativeElement.querySelector('[role="region"]')).toBeNull();
  });

  it('preserves focused tree nodes when an earlier expanded collection grows', async () => {
    const data = {before: [1], after: {id: 2}};
    await client.fetchQuery({key: ['tree'], loader: () => Promise.resolve(data)});
    mount();
    click('Query devtools');
    inspectFirstQuery();
    const tree = fixture.nativeElement.querySelector('.value-tree') as HTMLElement;
    const toggles = Array.from(tree.querySelectorAll<HTMLButtonElement>('.tree-toggle'));
    const before = toggles.find((button) => button.textContent?.includes('before:'));
    const after = toggles.find((button) => button.textContent?.includes('after:'));
    if (!before || !after) throw new Error('Missing tree branches');
    before.click();
    fixture.detectChanges();
    after.focus();
    data.before.push(3);
    updateView();
    expect(Array.from(tree.querySelectorAll('.tree-toggle'))).toContain(after);
    expect(document.activeElement).toBe(after);
  });

  it('refetches deliberately and shows failure while keeping cached data available', async () => {
    let fail = false;
    const loader = vi.fn(() => (fail ? Promise.reject(new Error('offline')) : Promise.resolve({name: 'Alex'})));
    await client.fetchQuery({key: ['profile'], loader, staleTime: Infinity});
    mount();
    click('Query devtools');
    inspectFirstQuery();
    fail = true;
    click('Refetch');
    await vi.waitFor(() => {
      fixture.detectChanges();
      expect(fixture.nativeElement.querySelector('cll-alert')?.textContent).toContain('Refetch failed.');
    });
    expect(client.getSnapshot(['profile'])?.value).toEqual({name: 'Alex'});
    expect(client.getDiagnostics().totalObserverCount).toBe(0);
    expect(loader).toHaveBeenCalledTimes(2);
    click('Error');
    expect(fixture.nativeElement.querySelector('.value-tree')?.textContent).toContain('offline');
  });

  it.each(['close', 'client', 'selection'])(
    'ignores a late refetch failure after %s changes the inspector context',
    async (context) => {
      await client.fetchQuery({key: ['profile'], loader: () => Promise.resolve('cached')});
      let rejectRequest: (reason: Error) => void = () => undefined;
      const request = new Promise<unknown>((_resolve, reject) => {
        rejectRequest = reject;
      });
      vi.spyOn(client, 'refetchQuery').mockReturnValue(request);
      const otherClient = new QueryClient();
      try {
        mount();
        click('Query devtools');
        inspectFirstQuery();
        click('Refetch');
        if (context === 'close') {
          click('Close');
          click('Query devtools');
        } else if (context === 'client') {
          fixture.componentRef.setInput('client', otherClient);
          fixture.detectChanges();
        } else inspectFirstQuery();
        rejectRequest(new Error('late failure'));
        await request.catch(() => undefined);
        await fixture.whenStable();
        fixture.detectChanges();
        expect(fixture.nativeElement.querySelector('cll-alert')).toBeNull();
      } finally {
        fixture.destroy();
        otherClient.destroy();
      }
    },
  );

  it('keeps inspection available with an older supported client that cannot refetch by key', async () => {
    Object.defineProperty(client, 'refetchQuery', {value: undefined, configurable: true});
    await client.fetchQuery({key: ['legacy'], loader: () => Promise.resolve({name: 'Alex'})});
    mount();
    click('Query devtools');
    inspectFirstQuery();
    expect(fixture.nativeElement.querySelector('.value-tree')).not.toBeNull();
    expect(fixture.nativeElement.querySelector('button[aria-label="Refetch"]')).toBeNull();
    expect(fixture.nativeElement.querySelector('.inspector-actions')?.textContent).not.toContain('Refetch');
  });

  it('ignores clipboard completion after the panel is reopened', async () => {
    const navigator = document.defaultView?.navigator;
    if (!navigator) throw new Error('Missing browser navigator');
    const previous = Object.getOwnPropertyDescriptor(navigator, 'clipboard');
    let finishCopy: () => void = () => undefined;
    const request = new Promise<void>((resolve) => {
      finishCopy = resolve;
    });
    Object.defineProperty(navigator, 'clipboard', {configurable: true, value: {writeText: () => request}});
    try {
      await client.fetchQuery({key: ['copy'], loader: () => Promise.resolve(1)});
      mount();
      click('Query devtools');
      inspectFirstQuery();
      copyKey();
      click('Close');
      click('Query devtools');
      finishCopy();
      await request;
      await fixture.whenStable();
      fixture.detectChanges();
      expect(fixture.nativeElement.textContent).not.toContain('Copied');
    } finally {
      if (previous) Object.defineProperty(navigator, 'clipboard', previous);
      else Reflect.deleteProperty(navigator, 'clipboard');
    }
  });

  it('pages a cached large response without fetching more data', async () => {
    const loader = vi.fn(() => Promise.resolve(Array.from({length: 100_000}, (_, id) => id)));
    await client.fetchQuery({key: ['large'], loader});
    mount();
    click('Query devtools');
    inspectFirstQuery();
    expect(fixture.nativeElement.querySelectorAll('.value-row')).toHaveLength(102);
    const buttons = fixture.nativeElement.querySelectorAll('.tree-toggle') as NodeListOf<HTMLButtonElement>;
    buttons[buttons.length - 1].click();
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelectorAll('.value-row')[1].textContent).toContain('100: 100');
    expect(loader).toHaveBeenCalledTimes(1);
  });

  it('copies the canonical key and complete cached JSON only on explicit actions', async () => {
    const navigator = document.defaultView?.navigator;
    if (!navigator) throw new Error('Missing browser navigator');
    const previous = Object.getOwnPropertyDescriptor(navigator, 'clipboard');
    const writeText = vi.fn<(text: string) => Promise<void>>(() => Promise.resolve());
    Object.defineProperty(navigator, 'clipboard', {configurable: true, value: {writeText}});
    try {
      await client.fetchQuery({key: ['copy'], loader: () => Promise.resolve({value: [1, 2]})});
      mount();
      click('Query devtools');
      expect(writeText).not.toHaveBeenCalled();
      inspectFirstQuery();
      copyKey();
      await vi.waitFor(() => expect(writeText).toHaveBeenCalledWith('["copy"]'));
      click('Copy JSON');
      await vi.waitFor(() => expect(writeText).toHaveBeenCalledTimes(2));
      expect(JSON.parse(writeText.mock.calls[1][0])).toEqual({value: [1, 2]});
    } finally {
      if (previous) Object.defineProperty(navigator, 'clipboard', previous);
      else Reflect.deleteProperty(navigator, 'clipboard');
    }
  });

  it('automatically dismisses copy notice after a delay', async () => {
    vi.useFakeTimers();
    const navigator = document.defaultView?.navigator;
    if (!navigator) throw new Error('Missing browser navigator');
    const previous = Object.getOwnPropertyDescriptor(navigator, 'clipboard');
    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: {writeText: () => Promise.resolve()},
    });
    try {
      await client.fetchQuery({key: ['copy-notice'], loader: () => Promise.resolve(1)});
      mount();
      click('Query devtools');
      inspectFirstQuery();
      copyKey();
      await vi.advanceTimersByTimeAsync(0);
      fixture.detectChanges();
      expect(fixture.nativeElement.textContent).toContain('Copied');
      await vi.advanceTimersByTimeAsync(2100);
      fixture.detectChanges();
      expect(fixture.nativeElement.textContent).not.toContain('Copied');
    } finally {
      if (previous) Object.defineProperty(navigator, 'clipboard', previous);
      else Reflect.deleteProperty(navigator, 'clipboard');
      vi.useRealTimers();
    }
  });
});
