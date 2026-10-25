import {Component, signal} from '@angular/core';
import {TestBed} from '@angular/core/testing';

import {TranslationService} from '../../services/translation.service';
import {BreadcrumbComponent} from './breadcrumb.component';
import {BreadcrumbItem} from './breadcrumb.model';

const root = Object.freeze({id: '', label: 'Database'});
const initial = Object.freeze([root, Object.freeze({id: 'server', label: 'Server', href: '/current'})]);

@Component({
  imports: [BreadcrumbComponent],
  template: `
    <form (submit)="submissions = submissions + 1">
      <cll-breadcrumb [items]="items()" (navigate)="selected = $event" />
      <cll-breadcrumb [items]="items()" ariaLabel="Secondary" />
    </form>
  `,
})
class Host {
  readonly items = signal<readonly BreadcrumbItem[]>(initial);
  selected?: BreadcrumbItem;
  submissions = 0;
}

describe('Breadcrumb public host', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({imports: [Host]});
    TestBed.inject(TranslationService).setLanguage('en', false);
  });

  it('renders current text, emits the exact frozen ancestor and never submits a native form', () => {
    const fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
    const element: HTMLElement = fixture.nativeElement;
    const nav = element.querySelector('nav');
    if (!nav) throw new Error('Expected navigation');
    expect(nav.getAttribute('aria-label')).toBe('Breadcrumb');
    expect(nav.querySelectorAll('ol > li')).toHaveLength(2);
    expect(nav.querySelector('[aria-current="page"]')?.textContent).toBe('Server');
    expect(nav.querySelector('a')).toBeNull();
    const button = nav.querySelector('button');
    if (!button) throw new Error('Expected action');
    expect(button.type).toBe('button');
    button.click();
    expect(fixture.componentInstance.selected).toBe(root);
    expect(fixture.componentInstance.submissions).toBe(0);
    expect(button.getAttribute('aria-description')).toBe('Database · Level 1');
    expect(element.querySelectorAll('nav')).toHaveLength(2);
  });

  it('replaces immutable trails, accepts repeated labels, supplied context, singleton and empty lists', () => {
    const fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
    fixture.componentInstance.items.set([
      {id: 'a', label: 'Same', href: '/exact?key=%2F', context: 'Exact context'},
      {id: 'b', label: 'Same'},
    ]);
    fixture.detectChanges();
    const element: HTMLElement = fixture.nativeElement;
    expect(element.querySelector('a')?.getAttribute('href')).toBe('/exact?key=%2F');
    expect(element.querySelector('a')?.getAttribute('aria-description')).toBe('Exact context · Level 1');
    expect(element.querySelector('li:last-child')?.getAttribute('aria-description')).toBe('Same > Same · Level 2');
    element.querySelector('a')?.dispatchEvent(new MouseEvent('click', {ctrlKey: true, cancelable: true}));
    expect(fixture.componentInstance.selected).toBeUndefined();
    fixture.componentInstance.items.set([root]);
    fixture.detectChanges();
    expect(element.querySelectorAll('button,a')).toHaveLength(0);
    expect(element.querySelectorAll('[aria-current]')).toHaveLength(2);
    fixture.componentInstance.items.set([]);
    fixture.detectChanges();
    expect(element.querySelector('nav')).toBeNull();
  });

  it('updates mounted default landmark names and depth for all dictionary aliases', () => {
    const fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
    const translation = TestBed.inject(TranslationService);
    for (const [locale, name] of [
      ['zh', '面包屑导航'],
      ['zh-Hant', '麵包屑導覽'],
      ['pt', 'Navegação estrutural'],
      ['it', 'Percorso di navigazione'],
      ['en-US', 'Breadcrumb'],
    ]) {
      translation.setLanguage(locale, false);
      fixture.detectChanges();
      expect(fixture.nativeElement.querySelector('nav').getAttribute('aria-label')).toBe(name);
      expect(fixture.nativeElement.querySelectorAll('nav')[1].getAttribute('aria-label')).toBe('Secondary');
    }
  });

  it.each([
    [
      [
        {id: 'a', label: 'A'},
        {id: 'a', label: 'B'},
      ],
      'duplicate id',
    ],
    [[{id: 'a', label: '  '}], 'blank label'],
    [[{id: 'a', label: 'A', href: '  '}], 'invalid href'],
    [[{id: 'a', label: 'A', href: 'java\nscript:alert(1)'}], 'invalid href'],
    [[{id: 'a', label: 'A', href: 'data:text/html,test'}], 'invalid href'],
  ] as const)('rejects invalid owner data: %j', (items, message) => {
    const fixture = TestBed.createComponent(Host);
    fixture.componentInstance.items.set(items);
    expect(() => fixture.detectChanges()).toThrow(message);
  });

  it.each([
    '/database?key=%2F#server',
    '../servers',
    '?level=1',
    '#server',
    '//example.com/servers',
    'http://example.com/servers',
    'https://example.com/servers',
    'mailto:admin@example.com',
    'tel:+123456789',
    'ftp://example.com/servers',
  ])('preserves supported destinations unchanged: %s', (href) => {
    const fixture = TestBed.createComponent(Host);
    fixture.componentInstance.items.set([{id: 'ancestor', label: 'Ancestor', href}, root]);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('a').getAttribute('href')).toBe(href);
  });

  it.each(['https://', 'https://[invalid]', '//['])('rejects malformed destination syntax: %s', (href) => {
    const fixture = TestBed.createComponent(Host);
    fixture.componentInstance.items.set([{id: 'ancestor', label: 'Ancestor', href}, root]);
    expect(() => fixture.detectChanges()).toThrow('invalid href at index 0');
  });

  it('keeps root/current and a contiguous recent suffix before browser measurement', () => {
    const fixture = TestBed.createComponent(BreadcrumbComponent);
    const items = Object.freeze(
      Array.from({length: 30}, (_, index) =>
        Object.freeze({
          id: String(index),
          label: 'Same',
          context: `exact/${index}`,
          href: `/go?key=${index}%2F%25`,
        }),
      ),
    );
    fixture.componentRef.setInput('items', items);
    fixture.detectChanges();
    const element: HTMLElement = fixture.nativeElement;
    const row = element.querySelector('.trail');
    expect(
      Array.from(row?.querySelectorAll(':scope > li:not(.overflow)') ?? [], (li) =>
        li.getAttribute('aria-description'),
      ),
    ).toEqual(['exact/0 · Level 1', 'exact/27 · Level 28', 'exact/28 · Level 29', 'exact/29 · Level 30']);
    expect(element.querySelectorAll('.panel-list li')).toHaveLength(30);
    expect(element.querySelector('.panel-list a')?.getAttribute('href')).toBe('/go?key=0%2F%25');
    for (const button of element.querySelectorAll('button')) expect(button.type).toBe('button');
    fixture.componentRef.setInput('maxVisible', 2);
    fixture.detectChanges();
    expect(row?.querySelectorAll(':scope > li:not(.overflow)')).toHaveLength(2);
    fixture.componentRef.setInput('maxVisible', Number.NaN);
    fixture.detectChanges();
    expect(row?.querySelectorAll(':scope > li:not(.overflow)')).toHaveLength(4);
    fixture.destroy();
  });

  it('filters supplied ancestors locally, preserves current context and restores original destinations', () => {
    const fixture = TestBed.createComponent(BreadcrumbComponent);
    const items = Object.freeze(
      Array.from({length: 25}, (_, index) =>
        Object.freeze({
          id: String(index),
          label: index === 7 ? 'ÉTAGE' : 'Repeated',
          context: `exact/${index}`,
          href: `/go?key=${index}%2F%25`,
        }),
      ),
    );
    fixture.componentRef.setInput('items', items);
    fixture.detectChanges();
    const element: HTMLElement = fixture.nativeElement;
    const filter = element.querySelector<HTMLInputElement>('input[type="search"]');
    expect(filter).not.toBeNull();
    if (!filter) throw new Error('Expected labeled ancestor filter');
    expect(element.querySelector(`label[for="${filter.id}"]`)?.textContent).toContain('Filter ancestors');
    filter.value = '  étage  ';
    filter.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    expect(element.querySelectorAll('.panel-list a')).toHaveLength(1);
    expect(element.querySelector('.panel-list a')?.getAttribute('href')).toBe('/go?key=7%2F%25');
    expect(element.querySelector('.panel-list .current')?.textContent).toBe('Repeated');
    expect(element.querySelector('.full-path')?.textContent).toContain('exact/24');
    expect(element.querySelector('[role="status"]')?.textContent?.trim()).toBe('');
    filter.value = 'absent';
    filter.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    expect(element.textContent).toContain('No matching ancestors');
    element.querySelector<HTMLButtonElement>('.filter-clear')?.click();
    fixture.detectChanges();
    expect(filter.value).toBe('');
    expect(element.querySelectorAll('.panel-list a')).toHaveLength(24);
    expect(items[7].label).toBe('ÉTAGE');
    const enter = new KeyboardEvent('keydown', {key: 'Enter', bubbles: true, cancelable: true});
    filter.dispatchEvent(enter);
    expect(enter.defaultPrevented).toBe(true);
    fixture.componentRef.setInput('items', items.slice(0, 24));
    fixture.detectChanges();
    expect(element.querySelector('input[type="search"]')).toBeNull();
  });

  it('matches locale case and canonical Unicode, keeps the query through locale changes and clears replacement state', () => {
    const fixture = TestBed.createComponent(BreadcrumbComponent);
    const items = Array.from({length: 25}, (_, index) => ({
      id: String(index),
      label: index === 7 ? 'İSTANBUL' : 'Other',
      context: index === 8 ? 'Café' : `exact/${index}`,
      href: `/go/${index}`,
    }));
    fixture.componentRef.setInput('items', items);
    fixture.detectChanges();
    const element: HTMLElement = fixture.nativeElement;
    const filter = element.querySelector<HTMLInputElement>('input')!;
    const translation = TestBed.inject(TranslationService);
    translation.setLanguage('tr', false);
    fixture.detectChanges();
    filter.value = 'istanbul';
    filter.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    expect(element.querySelector('.panel-list a')?.getAttribute('href')).toBe('/go/7');
    expect(element.querySelectorAll('.panel-list a')).toHaveLength(1);
    filter.value = 'Cafe\u0301';
    filter.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    expect(element.querySelector('.panel-list a')?.getAttribute('href')).toBe('/go/8');
    translation.setLanguage('zh-CN', false);
    fixture.detectChanges();
    expect(element.querySelector('input')).toBe(filter);
    expect(filter.value).toBe('Cafe\u0301');
    expect(element.textContent).toContain('匹配的祖先：1');
    // IME composition does not apply or announce a partial query.
    filter.value = 'partial';
    filter.dispatchEvent(new InputEvent('input', {isComposing: true}));
    fixture.detectChanges();
    expect(element.querySelector('.panel-list a')?.getAttribute('href')).toBe('/go/8');
    filter.dispatchEvent(new Event('compositionend'));
    fixture.detectChanges();
    expect(element.querySelectorAll('.panel-list a')).toHaveLength(0);
    fixture.componentRef.setInput('items', [...items]);
    fixture.detectChanges();
    expect(filter.value).toBe('');
    expect(element.querySelectorAll('.panel-list a')).toHaveLength(24);
    fixture.destroy();
  });

  it('announces settled query changes once and safely closes if locale matching removes the focused result', async () => {
    vi.useFakeTimers({toFake: ['setTimeout', 'clearTimeout']});
    const fixture = TestBed.createComponent(BreadcrumbComponent);
    try {
      fixture.componentRef.setInput(
        'items',
        Array.from({length: 25}, (_, index) => ({
          id: String(index),
          label: index === 7 ? 'İSTANBUL' : 'Other',
          href: `/go/${index}`,
        })),
      );
      const translation = TestBed.inject(TranslationService);
      translation.setLanguage('tr', false);
      fixture.detectChanges();
      const element: HTMLElement = fixture.nativeElement;
      const panel = element.querySelector<HTMLElement>('[popover]')!;
      // JSDOM has no native popover API; emulate only that browser boundary.
      let open = false;
      panel.showPopover = () => {
        open = true;
      };
      panel.hidePopover = () => {
        open = false;
      };
      const matches = panel.matches.bind(panel);
      panel.matches = (selector) => (selector === ':popover-open' ? open : matches(selector));
      const trigger = element.querySelector<HTMLButtonElement>('.overflow > button')!;
      trigger.click();
      fixture.detectChanges();
      const filter = element.querySelector<HTMLInputElement>('input')!;
      expect(document.activeElement).toBe(filter);
      filter.value = 'istanbul';
      filter.dispatchEvent(new Event('input'));
      fixture.detectChanges();
      expect(element.querySelector('[role="status"]')?.textContent?.trim()).toBe('');
      await vi.advanceTimersByTimeAsync(250);
      fixture.detectChanges();
      expect(element.querySelector('[role="status"]')?.textContent).toContain('Matching ancestors: 1');
      filter.value = ' ISTANBUL ';
      filter.dispatchEvent(new Event('input'));
      fixture.detectChanges();
      // Turkish capital I is distinct from dotted I: this is a meaningful query change.
      expect(element.querySelectorAll('.panel-list a')).toHaveLength(0);
      filter.value = 'istanbul';
      filter.dispatchEvent(new Event('input'));
      await vi.advanceTimersByTimeAsync(250);
      fixture.detectChanges();
      filter.value = ' istanbul ';
      filter.dispatchEvent(new Event('input'));
      fixture.detectChanges();
      expect(element.querySelector('[role="status"]')?.textContent).toContain('Matching ancestors: 1');
      element.querySelector<HTMLAnchorElement>('.panel-list a')?.focus();
      translation.setLanguage('en', false);
      fixture.detectChanges();
      expect(element.querySelector('[role="status"]')?.textContent?.trim()).toBe('');
      expect(trigger.getAttribute('aria-expanded')).toBe('false');
      expect(document.activeElement).toBe(trigger);
      expect(filter.value).toBe('');
    } finally {
      fixture.destroy();
      vi.useRealTimers();
    }
  });

  it('disconnects browser measurement when the public host is destroyed', async () => {
    const disconnect = vi.fn();
    const observe = vi.fn();
    vi.stubGlobal(
      'ResizeObserver',
      class {
        observe = observe;
        unobserve = vi.fn();
        disconnect = disconnect;
      },
    );
    try {
      const fixture = TestBed.createComponent(Host);
      fixture.detectChanges();
      await fixture.whenStable();
      expect(observe).toHaveBeenCalled();
      fixture.destroy();
      expect(disconnect).toHaveBeenCalledTimes(2);
    } finally {
      vi.unstubAllGlobals();
    }
  });

  it('diagnoses an empty explicit landmark name', () => {
    const fixture = TestBed.createComponent(BreadcrumbComponent);
    fixture.componentRef.setInput('items', initial);
    fixture.componentRef.setInput('ariaLabel', ' ');
    expect(() => fixture.detectChanges()).toThrow('ariaLabel must be nonblank');
  });
});
