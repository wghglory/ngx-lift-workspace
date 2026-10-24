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

  it('diagnoses an empty explicit landmark name', () => {
    const fixture = TestBed.createComponent(BreadcrumbComponent);
    fixture.componentRef.setInput('items', initial);
    fixture.componentRef.setInput('ariaLabel', ' ');
    expect(() => fixture.detectChanges()).toThrow('ariaLabel must be nonblank');
  });
});
