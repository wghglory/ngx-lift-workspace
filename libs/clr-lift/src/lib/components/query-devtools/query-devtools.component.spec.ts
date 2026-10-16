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

  beforeEach(() => {
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
  });

  function mount(): void {
    fixture = TestBed.createComponent(QueryDevtoolsComponent);
    TestBed.inject(TranslationService).setLanguage('en', false);
    fixture.detectChanges();
  }

  function click(label: string): void {
    const buttons = Array.from(fixture.nativeElement.querySelectorAll('button')) as HTMLButtonElement[];
    const button = buttons.find(
      (button) => button.textContent?.trim() === label || button.getAttribute('aria-label') === label,
    );
    if (!button) throw new Error(`Missing button: ${label}`);
    button.click();
    fixture.detectChanges();
  }

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
    click('Read snapshot');
    expect(snapshots).toHaveBeenCalledTimes(4);
    click('Close');
    vi.advanceTimersByTime(2000);
    expect(snapshots).toHaveBeenCalledTimes(4);
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
      click('Read snapshot');
      expect(otherSnapshots).toHaveBeenCalledTimes(2);
      expect(loader).toHaveBeenCalledTimes(1);
      expect(otherClient.getDiagnostics().totalObserverCount).toBe(0);
    } finally {
      fixture.destroy();
      otherClient.destroy();
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
    click('Read snapshot');
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
    click('Read snapshot');
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
    click('Inspect');
    const tree = fixture.nativeElement.querySelector('.value-tree') as HTMLElement;
    expect(tree.textContent).toContain('Object(2)');
    (tree.querySelector('button') as HTMLButtonElement).click();
    fixture.detectChanges();
    expect(tree.textContent).toContain('Alex');
    data.name = 'Jordan';
    click('Read snapshot');
    expect(tree.textContent).toContain('Jordan');
    expect(loader).toHaveBeenCalledTimes(1);
    expect(client.getDiagnostics().totalObserverCount).toBe(0);
    client.removeQueries();
    click('Read snapshot');
    expect(fixture.nativeElement.textContent).toContain('Query is no longer cached.');
    expect(fixture.nativeElement.querySelector('.value-tree')).toBeNull();
    click('Close');
    expect(fixture.nativeElement.querySelector('[role="region"]')).toBeNull();
  });

  it('refetches deliberately and shows failure while keeping cached data available', async () => {
    let fail = false;
    const loader = vi.fn(() => (fail ? Promise.reject(new Error('offline')) : Promise.resolve({name: 'Alex'})));
    await client.fetchQuery({key: ['profile'], loader, staleTime: Infinity});
    mount();
    click('Query devtools');
    click('Inspect');
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
    (fixture.nativeElement.querySelector('.tree-toggle') as HTMLButtonElement).click();
    fixture.detectChanges();
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
        click('Inspect');
        click('Refetch');
        if (context === 'close') {
          click('Close');
          click('Query devtools');
        } else if (context === 'client') {
          fixture.componentRef.setInput('client', otherClient);
          fixture.detectChanges();
        } else click('Inspect');
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
    click('Inspect');
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
      click('Copy key');
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
    click('Inspect');
    (fixture.nativeElement.querySelector('.tree-toggle') as HTMLButtonElement).click();
    fixture.detectChanges();
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
      click('Copy key');
      await vi.waitFor(() => expect(writeText).toHaveBeenCalledWith('["copy"]'));
      click('Inspect');
      click('Copy value');
      await vi.waitFor(() => expect(writeText).toHaveBeenCalledTimes(2));
      expect(JSON.parse(writeText.mock.calls[1][0])).toEqual({value: [1, 2]});
    } finally {
      if (previous) Object.defineProperty(navigator, 'clipboard', previous);
      else Reflect.deleteProperty(navigator, 'clipboard');
    }
  });
});
