import {Component, signal} from '@angular/core';
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {provideNoopAnimations} from '@angular/platform-browser/animations';
import {FormControl, ReactiveFormsModule, Validators} from '@angular/forms';
import {ClarityModule} from '@clr/angular';
import {Subject} from 'rxjs';
import {vi} from 'vitest';

import {DatagridSelectionComponent} from './datagrid-selection.component';

interface Organization {
  id: string;
  name: string;
}
class NameFilter {
  changes = new Subject<void>();
  query = signal('');
  isActive() {
    return !!this.query();
  }
  accepts(item: Organization) {
    return item.name.includes(this.query());
  }
  set(query: string) {
    this.query.set(query);
    this.changes.next();
  }
}
@Component({
  imports: [ClarityModule, ReactiveFormsModule, DatagridSelectionComponent],
  template: `<cll-datagrid-selection
      [formControl]="control"
      [readonly]="readonly()"
      [itemAvailability]="availability"
      required
      helper="Choose organizations"
      error="Choose at least one"
    >
      <label>Organizations</label>
      <clr-datagrid
        [clrDgSelectionType]="mode"
        [clrDgItemsIdentityFn]="identify"
        [clrDgLoading]="loading()"
        [clrDgRowSelection]="rowMode"
      >
        <clr-dg-column>Name<clr-dg-filter [clrDgFilter]="filter" /></clr-dg-column>
        <clr-dg-row
          *clrDgItems="let item of items()"
          [clrDgItem]="item"
          [clrDgSelectable]="canSelect()"
          [clrDgRowSelectionLabel]="item.name"
        >
          <clr-dg-cell
            >{{ item.name }}<button type="button" (click)="actions = actions + 1">Inspect</button></clr-dg-cell
          >
        </clr-dg-row>
      </clr-datagrid>
    </cll-datagrid-selection>
    <p id="nonfocusable">Outside content</p>
    <button type="button">Outside</button>`,
})
class Host {
  control = new FormControl<unknown>(Object.freeze(['org-2', 'missing']), {nonNullable: true});
  mode = 'multi';
  rowMode = false;
  actions = 0;
  items = signal<Organization[]>([]);
  identify = (item: Organization) => item.id;
  readonly = signal(false);
  loading = signal(false);
  unavailable = signal(false);
  canSelect = signal(true);
  filter = new NameFilter();
  page = signal(1);
  availability = (item: Organization) => ({
    disabled: this.unavailable() && item.id === 'org-1',
    disabledReason: 'Unavailable',
  });
}

@Component({
  imports: [ClarityModule, ReactiveFormsModule, DatagridSelectionComponent],
  template: `<cll-datagrid-selection [formControl]="control" [itemAvailability]="availability">
    <label>Organizations</label>
    <clr-datagrid clrDgSelectionType="multi" [clrDgItemsIdentityFn]="identify">
      <clr-dg-column>Name</clr-dg-column>
      <clr-dg-row *clrDgItems="let item of items()" [clrDgItem]="item"
        ><clr-dg-cell>{{ item.name }}</clr-dg-cell></clr-dg-row
      >
      <clr-dg-footer
        ><clr-dg-pagination [clrDgPageSize]="1" [clrDgPage]="page()" (clrDgPageChange)="page.set($event)"
      /></clr-dg-footer>
    </clr-datagrid>
  </cll-datagrid-selection>`,
})
class PagedHost extends Host {}

@Component({
  imports: [ClarityModule, ReactiveFormsModule, DatagridSelectionComponent],
  template: `<cll-datagrid-selection [formControl]="control" [readonly]="readonly()" [itemAvailability]="availability">
    <label>Organizations</label>
    <clr-datagrid clrDgSelectionType="multi" [clrDgItemsIdentityFn]="identify" [clrDgLoading]="loading()">
      <clr-dg-column>Name</clr-dg-column>
      @for (item of items(); track item.id) {
        <clr-dg-row [clrDgItem]="item"
          ><clr-dg-cell>{{ item.name }}</clr-dg-cell></clr-dg-row
        >
      }
    </clr-datagrid>
  </cll-datagrid-selection>`,
})
class ServerPagedHost extends Host {}

@Component({
  imports: [ClarityModule, ReactiveFormsModule, DatagridSelectionComponent],
  template: `@if (mounted()) {
    <cll-datagrid-selection [formControl]="control" [readonly]="readonly()" [itemAvailability]="availability">
      <label>Organizations</label>
      <clr-datagrid clrDgSelectionType="multi" [clrDgItemsIdentityFn]="identify">
        <clr-dg-column>Name</clr-dg-column>
        @for (item of items(); track item.id) {
          <clr-dg-row [clrDgItem]="item"
            ><clr-dg-cell>{{ item.name }}</clr-dg-cell></clr-dg-row
          >
        }
      </clr-datagrid>
    </cll-datagrid-selection>
  }`,
})
class RemountHost extends Host {
  mounted = signal(true);
}

/**
 * Stabilizes the fixture between steps: change detection, pending timers and signal effects settle
 * before the next selectors, control value or DOM state is read.
 * @param fixture Active component fixture.
 */
async function settle<T>(fixture: ComponentFixture<T>): Promise<void> {
  fixture.detectChanges();
  await fixture.whenStable();
  await new Promise<void>((resolve) => setTimeout(resolve));
  await fixture.whenStable();
  fixture.detectChanges();
}

describe('Datagrid selection through its real form host', () => {
  it('updates the single Clear lock while a saved key has no loaded items', async () => {
    TestBed.configureTestingModule({providers: [provideNoopAnimations()]});
    const fixture = TestBed.createComponent(Host);
    const host = fixture.componentInstance;
    host.mode = 'single';
    host.control.setValue('unresolved');
    const settle = async () => {
      fixture.detectChanges();
      await fixture.whenStable();
      fixture.detectChanges();
    };
    await settle();
    const clear = () => fixture.nativeElement.querySelector('.field-body > button') as HTMLButtonElement;
    expect(clear().disabled).toBe(false);
    host.loading.set(true);
    await settle();
    expect(clear().disabled).toBe(true);
    host.loading.set(false);
    await settle();
    expect(clear().disabled).toBe(false);
    expect(host.control.value).toBe('unresolved');
  });
  it('keeps the previous single key when a native cell action attempts to select an unavailable item', async () => {
    TestBed.configureTestingModule({providers: [provideNoopAnimations()]});
    const fixture = TestBed.createComponent(Host);
    const host = fixture.componentInstance;
    host.mode = 'single';
    host.rowMode = true;
    host.unavailable.set(true);
    host.control.setValue('org-2');
    host.items.set([
      {id: 'org-1', name: 'North'},
      {id: 'org-2', name: 'South'},
    ]);
    fixture.detectChanges();
    await fixture.whenStable();
    (fixture.nativeElement.querySelector('clr-dg-cell button') as HTMLButtonElement).click();
    fixture.detectChanges();
    await fixture.whenStable();
    expect(host.actions).toBe(1);
    expect(host.control.value).toBe('org-2');
  });
  it('retains caller permission changes made while loading and does not restore focus after departure', async () => {
    TestBed.configureTestingModule({providers: [provideNoopAnimations()]});
    const fixture = TestBed.createComponent(Host);
    const host = fixture.componentInstance;
    host.items.set([{id: 'org-1', name: 'North'}]);
    const settle = async () => {
      fixture.detectChanges();
      await fixture.whenStable();
      await new Promise<void>((resolve) => setTimeout(resolve));
      await fixture.whenStable();
      fixture.detectChanges();
    };
    await settle();
    const input = () => fixture.nativeElement.querySelector('clr-dg-row input') as HTMLInputElement;
    host.loading.set(true);
    await settle();
    host.canSelect.set(false);
    await settle();
    host.loading.set(false);
    await settle();
    expect(input().disabled).toBe(true);
    host.canSelect.set(true);
    await settle();
    input().focus();
    fixture.nativeElement.querySelector('#nonfocusable').dispatchEvent(new Event('pointerdown', {bubbles: true}));
    input().blur();
    await settle();
    host.items.update((items) => items.map((item) => ({...item})));
    await settle();
    expect(fixture.nativeElement.ownerDocument.activeElement).toBe(fixture.nativeElement.ownerDocument.body);
  });
  it('diagnoses wrong incoming shapes, invalid keys and duplicates at the Angular owner boundary', async () => {
    TestBed.configureTestingModule({providers: [provideNoopAnimations()]});
    const fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
    await fixture.whenStable();
    const control = fixture.componentInstance.control;
    for (const value of ['org-1', {}, [NaN], [Infinity], [undefined], Array(1), ['org-1', 'org-1']]) {
      expect(() => control.setValue(value)).toThrow(/cll-datagrid-selection/);
    }
    control.reset();
    fixture.detectChanges();
    await fixture.whenStable();
    expect(control.pristine).toBe(true);
  });
  it('uses the filtered logical page for select-all and clear while preserving unrelated keys and order', async () => {
    TestBed.configureTestingModule({providers: [provideNoopAnimations()]});
    const fixture = TestBed.createComponent(Host);
    const host = fixture.componentInstance;
    host.items.set([
      {id: 'org-1', name: 'North'},
      {id: 'org-2', name: 'South'},
      {id: 'org-3', name: 'North coast'},
    ]);
    const settle = async () => {
      fixture.detectChanges();
      await fixture.whenStable();
      await new Promise<void>((resolve) => setTimeout(resolve));
      await fixture.whenStable();
      fixture.detectChanges();
    };
    const header = () => fixture.nativeElement.querySelector('.datagrid-header input') as HTMLInputElement;
    await settle();
    host.filter.set('North');
    TestBed.tick();
    await settle();
    header().click();
    await settle();
    expect(host.control.value).toEqual(['org-2', 'missing', 'org-1', 'org-3']);
    expect(header().checked).toBe(true);
    header().click();
    await settle();
    expect(host.control.value).toEqual(['org-2', 'missing']);
  });

  it('uses only the native current page and keeps selected unavailable items removable', async () => {
    TestBed.configureTestingModule({providers: [provideNoopAnimations()]});
    const fixture = TestBed.createComponent(PagedHost);
    const host = fixture.componentInstance;
    const settle = async () => {
      fixture.detectChanges();
      await fixture.whenStable();
      await new Promise<void>((resolve) => setTimeout(resolve));
      await fixture.whenStable();
      fixture.detectChanges();
    };
    const header = () => fixture.nativeElement.querySelector('.datagrid-header input') as HTMLInputElement;
    await settle();
    host.items.set([
      {id: 'org-1', name: 'North'},
      {id: 'org-2', name: 'South'},
      {id: 'org-3', name: 'North coast'},
    ]);
    await settle();
    header().click();
    await settle();
    expect(host.control.value).toEqual(['org-2', 'missing', 'org-1']);
    host.page.set(2);
    await settle();
    header().click();
    await settle();
    expect(host.control.value).toEqual(['missing', 'org-1']);
    host.unavailable.set(true);
    host.page.set(1);
    await settle();
    header().click();
    await settle();
    expect(host.control.value).toEqual(['missing']);
    expect(header().disabled).toBe(true);
  });

  it('retains saved keys across replacement of a complete server page without changing the owner', async () => {
    TestBed.configureTestingModule({providers: [provideNoopAnimations()]});
    const fixture = TestBed.createComponent(ServerPagedHost);
    const host = fixture.componentInstance;
    const changes = vi.fn();
    host.control.valueChanges.subscribe(changes);
    const checkboxes = () =>
      [...fixture.nativeElement.querySelectorAll('clr-dg-row input[type=checkbox]')] as HTMLInputElement[];
    host.items.set([
      {id: 'org-1', name: 'North'},
      {id: 'org-2', name: 'South'},
    ]);
    await settle(fixture);
    expect(checkboxes().map((input) => input.checked)).toEqual([false, true]);
    host.items.set([
      {id: 'org-3', name: 'East'},
      {id: 'org-4', name: 'West'},
    ]);
    await settle(fixture);
    expect(checkboxes().map((input) => input.checked)).toEqual([false, false]);
    expect(host.control.value).toEqual(['org-2', 'missing']);
    expect(changes).not.toHaveBeenCalled();
    host.control.setValue(['org-3', 'org-2', 'missing']);
    await settle(fixture);
    expect(checkboxes().map((input) => input.checked)).toEqual([true, false]);
    expect(host.control.value).toEqual(['org-3', 'org-2', 'missing']);
  });

  it('selects and clears only the supplied server page while preserving saved keys and their order', async () => {
    TestBed.configureTestingModule({providers: [provideNoopAnimations()]});
    const fixture = TestBed.createComponent(ServerPagedHost);
    const host = fixture.componentInstance;
    host.control.setValue(['org-9']);
    host.items.set([
      {id: 'org-1', name: 'North'},
      {id: 'org-2', name: 'South'},
    ]);
    const header = () => fixture.nativeElement.querySelector('.datagrid-header input') as HTMLInputElement;
    await settle(fixture);
    header().click();
    await settle(fixture);
    expect(host.control.value).toEqual(['org-9', 'org-1', 'org-2']);
    host.items.set([
      {id: 'org-3', name: 'East'},
      {id: 'org-4', name: 'West'},
    ]);
    await settle(fixture);
    header().click();
    await settle(fixture);
    expect(host.control.value).toEqual(['org-9', 'org-1', 'org-2', 'org-3', 'org-4']);
    header().click();
    await settle(fixture);
    expect(host.control.value).toEqual(['org-9', 'org-1', 'org-2']);
    host.items.set([]);
    await settle(fixture);
    expect(host.control.value).toEqual(['org-9', 'org-1', 'org-2']);
    expect(header().disabled).toBe(true);
  });

  it('locks every server-page selection path while loading, readonly or disabled but accepts owner writes', async () => {
    TestBed.configureTestingModule({providers: [provideNoopAnimations()]});
    const fixture = TestBed.createComponent(ServerPagedHost);
    const host = fixture.componentInstance;
    host.control.setValue(['org-1']);
    host.items.set([
      {id: 'org-1', name: 'North'},
      {id: 'org-2', name: 'South'},
    ]);
    const inputs = () =>
      [...fixture.nativeElement.querySelectorAll('clr-dg-row input[type=checkbox]')] as HTMLInputElement[];
    const header = () => fixture.nativeElement.querySelector('.datagrid-header input') as HTMLInputElement;
    await settle(fixture);
    host.loading.set(true);
    await settle(fixture);
    expect(inputs().every((input) => input.disabled)).toBe(true);
    expect(header().disabled).toBe(true);
    inputs()[1].click();
    await settle(fixture);
    expect(host.control.value).toEqual(['org-1']);
    host.control.reset(['org-2']);
    await settle(fixture);
    expect(host.control.value).toEqual(['org-2']);
    host.loading.set(false);
    await settle(fixture);
    expect(inputs().map((input) => input.checked)).toEqual([false, true]);
    host.readonly.set(true);
    await settle(fixture);
    expect(inputs().every((input) => input.disabled)).toBe(true);
    host.readonly.set(false);
    host.control.disable();
    await settle(fixture);
    expect(inputs().every((input) => input.disabled)).toBe(true);
    expect(host.control.enabled).toBe(false);
    expect(host.control.value).toEqual(['org-2']);
  });

  it('keeps a selected unavailable server row checked, readable and removable', async () => {
    TestBed.configureTestingModule({providers: [provideNoopAnimations()]});
    const fixture = TestBed.createComponent(ServerPagedHost);
    const host = fixture.componentInstance;
    host.control.setValue(['org-1']);
    host.unavailable.set(true);
    host.items.set([
      {id: 'org-1', name: 'North'},
      {id: 'org-2', name: 'South'},
    ]);
    await settle(fixture);
    const input = () => fixture.nativeElement.querySelector('clr-dg-row input[type=checkbox]') as HTMLInputElement;
    expect(input().checked).toBe(true);
    expect(input().disabled).toBe(false);
    expect(input().getAttribute('aria-describedby')).toBeTruthy();
    expect(fixture.nativeElement.querySelector('.selection-availability-reason')?.textContent).toBe('Unavailable');
    input().click();
    await settle(fixture);
    expect(host.control.value).toEqual([]);
  });

  it('restores a saved server-page selection after the field is destroyed and remounted', async () => {
    TestBed.configureTestingModule({providers: [provideNoopAnimations()]});
    const fixture = TestBed.createComponent(RemountHost);
    const host = fixture.componentInstance;
    const changes = vi.fn();
    host.control.valueChanges.subscribe(changes);
    host.items.set([
      {id: 'org-1', name: 'North'},
      {id: 'org-2', name: 'South'},
    ]);
    await settle(fixture);
    const checkbox = () =>
      fixture.nativeElement.querySelectorAll('clr-dg-row input[type=checkbox]')[1] as HTMLInputElement;
    expect(checkbox().checked).toBe(true);
    host.mounted.set(false);
    await settle(fixture);
    expect(fixture.nativeElement.querySelector('clr-datagrid')).toBeNull();
    host.mounted.set(true);
    await settle(fixture);
    expect(checkbox().checked).toBe(true);
    expect(host.control.value).toEqual(['org-2', 'missing']);
    expect(changes).not.toHaveBeenCalled();
  });

  it('re-measures a complete inventory so a smaller replacement shrinks the retained viewport', async () => {
    TestBed.configureTestingModule({providers: [provideNoopAnimations()]});
    // JSDOM reports a zero rect for every element; derive the viewport height from its rendered rows.
    const rect = (height: number) =>
      ({x: 0, y: 0, width: 0, height, top: 0, right: 0, bottom: height, left: 0}) as DOMRect;
    const bounds = vi.spyOn(Element.prototype, 'getBoundingClientRect').mockImplementation(function (this: Element) {
      if (!this.classList.contains('datagrid')) return rect(0);
      return rect(this.querySelectorAll('clr-dg-row').length * 20 + 40);
    });
    try {
      const fixture = TestBed.createComponent(Host);
      const host = fixture.componentInstance;
      host.items.set([
        {id: 'org-1', name: 'North'},
        {id: 'org-2', name: 'South'},
        {id: 'org-3', name: 'East'},
        {id: 'org-4', name: 'West'},
        {id: 'org-5', name: 'River'},
      ]);
      await settle(fixture);
      const viewport = (fixture.nativeElement as HTMLElement).querySelector<HTMLElement>('.datagrid');
      if (!viewport) throw new Error('cll-datagrid-selection: viewport not found');
      // Five complete rows retain their own height while the inventory is complete.
      expect(viewport.style.minBlockSize).toBe('8.75rem');
      host.items.set([
        {id: 'org-1', name: 'North'},
        {id: 'org-2', name: 'South'},
      ]);
      await settle(fixture);
      expect(viewport.style.minBlockSize).toBe('5rem');
      // An empty page is a transient loading/failure state, not a smaller inventory.
      host.items.set([]);
      await settle(fixture);
      expect(viewport.style.minBlockSize).toBe('5rem');
      host.items.set([
        {id: 'org-1', name: 'North'},
        {id: 'org-2', name: 'South'},
        {id: 'org-3', name: 'East'},
        {id: 'org-4', name: 'West'},
        {id: 'org-5', name: 'River'},
      ]);
      await settle(fixture);
      expect(viewport.style.minBlockSize).toBe('8.75rem');
    } finally {
      bounds.mockRestore();
    }
  });

  it.each([false, true])(
    'accepts native single edits with row mode %s and keeps keys independent of object replacement',
    async (rowMode) => {
      TestBed.configureTestingModule({providers: [provideNoopAnimations()]});
      const fixture = TestBed.createComponent(Host);
      const host = fixture.componentInstance;
      host.mode = 'single';
      host.rowMode = rowMode;
      host.control.setValue(null);
      host.items.set([
        {id: 'org-1', name: 'North'},
        {id: 'org-2', name: 'South'},
      ]);
      const settle = async () => {
        fixture.detectChanges();
        await fixture.whenStable();
        await new Promise<void>((resolve) => setTimeout(resolve));
        await fixture.whenStable();
        fixture.detectChanges();
      };
      await settle();
      fixture.nativeElement
        .querySelector('.datagrid-header .datagrid-select')
        .dispatchEvent(new KeyboardEvent('keydown', {key: ' ', bubbles: true, cancelable: true}));
      await settle();
      expect(host.control.value).toBe(null);
      const inputs = () =>
        Array.from(fixture.nativeElement.querySelectorAll('input[type=radio]')) as HTMLInputElement[];
      if (rowMode) (fixture.nativeElement.querySelectorAll('clr-dg-cell')[1] as HTMLElement).click();
      else inputs()[1].click();
      await settle();
      expect(host.control.value).toBe('org-2');
      host.items.update((items) => items.map((item) => ({...item})));
      await settle();
      expect(inputs().map((input) => input.checked)).toEqual([false, true]);
    },
  );
  it('names the actual grid, describes it, focuses it from the label, and clears a required single value to null', async () => {
    TestBed.configureTestingModule({providers: [provideNoopAnimations()]});
    const fixture = TestBed.createComponent(Host);
    const host = fixture.componentInstance;
    host.mode = 'single';
    host.control.setValue('org-1');
    host.control.addValidators(Validators.required);
    host.items.set([{id: 'org-1', name: 'North'}]);
    const settle = async () => {
      fixture.detectChanges();
      await fixture.whenStable();
      await new Promise<void>((resolve) => setTimeout(resolve));
      await fixture.whenStable();
      fixture.detectChanges();
    };
    await settle();
    const element = fixture.nativeElement as HTMLElement;
    const label = element.querySelector('cll-datagrid-selection label');
    if (!label) throw new Error('cll-datagrid-selection: label not found');
    const grid = element.querySelector<HTMLElement>('[role=grid]');
    if (!grid) throw new Error('cll-datagrid-selection: grid not found');
    expect(grid.getAttribute('aria-labelledby')).toBe(label.id);
    expect(label.id).not.toBe('');
    expect(grid.getAttribute('aria-describedby')).toBeTruthy();
    label.dispatchEvent(new MouseEvent('click', {bubbles: true}));
    expect(element.ownerDocument.activeElement === grid || grid.contains(element.ownerDocument.activeElement)).toBe(
      true,
    );
    const clear = [...element.querySelectorAll('button')].find((button) => button.textContent?.trim() === 'Clear');
    if (!clear) throw new Error('cll-datagrid-selection: Clear button not found');
    clear.click();
    await settle();
    expect(host.control.value).toBe(null);
    expect(host.control.invalid).toBe(true);
    expect(element.textContent).not.toContain('Choose at least one');
    (element.lastElementChild as HTMLButtonElement).focus();
    await vi.waitFor(() => expect(host.control.touched).toBe(true));
    await settle();
    expect(host.control.touched).toBe(true);
    expect(element.textContent).toContain('Choose at least one');
    expect(grid.getAttribute('aria-invalid')).toBe('true');
  });
  it('blocks loading, readonly and disabled edits without changing owner validity or serialization; selected unavailable keys remain removable', async () => {
    TestBed.configureTestingModule({providers: [provideNoopAnimations()]});
    const fixture = TestBed.createComponent(Host);
    const host = fixture.componentInstance;
    host.items.set([
      {id: 'org-1', name: 'North'},
      {id: 'org-2', name: 'South'},
    ]);
    const settle = async () => {
      fixture.detectChanges();
      await fixture.whenStable();
      await new Promise<void>((resolve) => setTimeout(resolve));
      await fixture.whenStable();
      fixture.detectChanges();
    };
    const inputs = () =>
      [...fixture.nativeElement.querySelectorAll('clr-dg-row input[type=checkbox]')] as HTMLInputElement[];
    await settle();
    for (const lock of [host.loading, host.readonly]) {
      lock.set(true);
      await settle();
      inputs()[0].click();
      await settle();
      expect(host.control.value).toEqual(['org-2', 'missing']);
      expect(host.control.enabled).toBe(true);
      expect(host.control.valid).toBe(true);
      expect(inputs().every((input) => input.disabled)).toBe(true);
      lock.set(false);
      await settle();
    }
    host.control.disable();
    await settle();
    expect(inputs().every((input) => input.disabled)).toBe(true);
    host.control.enable();
    await settle();
    inputs()[0].click();
    await settle();
    host.unavailable.set(true);
    await settle();
    expect(inputs()[0].disabled).toBe(false);
    inputs()[0].click();
    await settle();
    expect(host.control.value).toEqual(['org-2', 'missing']);
    expect(inputs()[0].disabled).toBe(true);
  });
  it('reconciles keys before items and fresh objects without echo; accepts edits without dropping unresolved keys', async () => {
    TestBed.configureTestingModule({providers: [provideNoopAnimations()]});
    const fixture = TestBed.createComponent(Host);
    const host = fixture.componentInstance;
    const changes = vi.fn();
    host.control.valueChanges.subscribe(changes);
    const settle = async () => {
      fixture.detectChanges();
      await fixture.whenStable();
      await new Promise<void>((resolve) => setTimeout(resolve));
      await fixture.whenStable();
      fixture.detectChanges();
    };
    await settle();
    host.items.set([
      {id: 'org-1', name: 'North'},
      {id: 'org-2', name: 'South'},
    ]);
    await settle();
    const checkboxes = () =>
      [...fixture.nativeElement.querySelectorAll('clr-dg-row input[type=checkbox]')] as HTMLInputElement[];
    expect(checkboxes().map((input) => input.checked)).toEqual([false, true]);
    expect(changes).not.toHaveBeenCalled();
    expect(host.control.pristine).toBe(true);
    checkboxes()[0].click();
    await settle();
    expect(host.control.value).toEqual(['org-2', 'missing', 'org-1']);
    expect(changes).toHaveBeenCalledTimes(1);
    host.items.update((items) => items.map((item) => ({...item, name: `${item.name} refreshed`})));
    await settle();
    expect(checkboxes().map((input) => input.checked)).toEqual([true, true]);
    expect(changes).toHaveBeenCalledTimes(1);
    host.control.reset();
    await settle();
    expect(host.control.value).toEqual(['org-2', 'missing']);
    expect(checkboxes().map((input) => input.checked)).toEqual([false, true]);
    expect(host.control.pristine).toBe(true);
    expect(host.control.untouched).toBe(true);
  });
  it('removes document listeners and pending timers when its host is destroyed', async () => {
    TestBed.configureTestingModule({providers: [provideNoopAnimations()]});
    const fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
    await fixture.whenStable();
    const remove = vi.spyOn(document, 'removeEventListener');
    const clear = vi.spyOn(globalThis, 'clearTimeout');
    fixture.destroy();
    expect(remove).toHaveBeenCalledWith('focusin', expect.any(Function));
    expect(remove).toHaveBeenCalledWith('focusout', expect.any(Function));
    expect(remove).toHaveBeenCalledWith('pointerdown', expect.any(Function), true);
    expect(clear).toHaveBeenCalled();
    remove.mockRestore();
    clear.mockRestore();
  });
});
