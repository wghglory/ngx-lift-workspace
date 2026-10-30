import {Component, signal} from '@angular/core';
import {TestBed} from '@angular/core/testing';
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
    const label = element.querySelector('cll-datagrid-selection label')!;
    const grid = element.querySelector<HTMLElement>('[role=grid]')!;
    expect(grid.getAttribute('aria-labelledby')).toBe(label.id);
    expect(label.id).not.toBe('');
    expect(grid.getAttribute('aria-describedby')).toBeTruthy();
    label.dispatchEvent(new MouseEvent('click', {bubbles: true}));
    expect(element.ownerDocument.activeElement === grid || grid.contains(element.ownerDocument.activeElement)).toBe(
      true,
    );
    const clear = [...element.querySelectorAll('button')].find((button) => button.textContent?.trim() === 'Clear')!;
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
});
