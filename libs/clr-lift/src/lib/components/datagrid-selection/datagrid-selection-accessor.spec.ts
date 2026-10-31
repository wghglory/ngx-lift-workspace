import {Component} from '@angular/core';
import {TestBed} from '@angular/core/testing';
import {FormControl, FormGroup, NG_VALUE_ACCESSOR, ReactiveFormsModule, Validators} from '@angular/forms';
import {provideNoopAnimations} from '@angular/platform-browser/animations';
import {ClarityModule} from '@clr/angular';
import {vi} from 'vitest';
import {Subject} from 'rxjs';

import {
  DatagridSelectionAccessorDirective,
  DatagridSelectionBindingDirective,
} from './datagrid-selection-accessor.directive';
import {DatagridSelectionComponent} from './datagrid-selection.component';

@Component({
  selector: 'cll-test-picker',
  imports: [ClarityModule, DatagridSelectionComponent, DatagridSelectionBindingDirective],
  hostDirectives: [DatagridSelectionAccessorDirective],
  template: `<cll-datagrid-selection cllDatagridSelectionBinding required error="Selection rule failed">
    <label>Organizations</label>
    <clr-datagrid clrDgSelectionType="multi" [clrDgItemsIdentityFn]="key">
      <clr-dg-column>Name</clr-dg-column>
      <clr-dg-row *clrDgItems="let item of items" [clrDgItem]="item"
        ><clr-dg-cell>{{ item.name }}</clr-dg-cell></clr-dg-row
      >
    </clr-datagrid>
  </cll-datagrid-selection>`,
})
class Picker {
  items = [
    {id: 'org-1', name: 'North'},
    {id: 'org-2', name: 'South'},
  ];
  key = (item: {id: string}) => item.id;
}
@Component({
  imports: [Picker, ReactiveFormsModule],
  template: `<form [formGroup]="form">
      <cll-test-picker formControlName="ids" /><button type="submit">Submit</button><button type="reset">Reset</button>
    </form>
    <button type="button">Outside</button>`,
})
class Host {
  form = new FormGroup({
    ids: new FormControl<string[]>([], {nonNullable: true, updateOn: 'blur', validators: Validators.required}),
  });
}

@Component({
  selector: 'cll-missing-picker',
  hostDirectives: [DatagridSelectionAccessorDirective],
  template: '<span>No inner binding</span>',
})
class MissingPicker {}
@Component({
  selector: 'cll-duplicate-picker',
  hostDirectives: [DatagridSelectionAccessorDirective],
  imports: [DatagridSelectionComponent, DatagridSelectionBindingDirective],
  template:
    '<cll-datagrid-selection cllDatagridSelectionBinding/><cll-datagrid-selection cllDatagridSelectionBinding/>',
})
class DuplicatePicker {}

@Component({
  selector: 'cll-conflicting-picker',
  hostDirectives: [DatagridSelectionAccessorDirective],
  imports: [DatagridSelectionComponent, DatagridSelectionBindingDirective, ReactiveFormsModule],
  template: '<cll-datagrid-selection cllDatagridSelectionBinding [formControl]="inner"/>',
})
class ConflictingPicker {
  inner = new FormControl<string[]>([]);
}
@Component({
  imports: [DatagridSelectionComponent, DatagridSelectionBindingDirective],
  template: '<cll-datagrid-selection cllDatagridSelectionBinding/>',
})
class MissingAccessor {}
@Component({
  selector: 'cll-conflicting-accessor',
  hostDirectives: [DatagridSelectionAccessorDirective],
  providers: [{provide: NG_VALUE_ACCESSOR, useValue: {}, multi: true}],
  imports: [DatagridSelectionComponent, DatagridSelectionBindingDirective],
  template: '<cll-datagrid-selection cllDatagridSelectionBinding/>',
})
class ConflictingAccessor {}

describe('Reusable picker with the original form owner', () => {
  it('rejects conflicting inner form bindings, missing host accessors and duplicate host accessors', () => {
    const inner = TestBed.createComponent(ConflictingPicker);
    expect(() => inner.detectChanges()).toThrow(/another form binding/);
    const missing = TestBed.createComponent(MissingAccessor);
    expect(() => missing.detectChanges()).toThrow(/missing picker host accessor/);
    const duplicate = TestBed.createComponent(ConflictingAccessor);
    expect(() => duplicate.detectChanges()).toThrow(/conflicting value accessors/);
  });
  it('presents count and async errors from the original owner without changing or echoing its payload', async () => {
    TestBed.configureTestingModule({providers: [provideNoopAnimations()]});
    const fixture = TestBed.createComponent(Host);
    const host = fixture.componentInstance;
    host.form = new FormGroup({
      ids: new FormControl<string[]>([], {
        nonNullable: true,
        validators: [Validators.required, Validators.maxLength(1)],
      }),
    });
    const result = new Subject<{serverRule: boolean} | null>();
    host.form.controls.ids.setAsyncValidators(() => result);
    const changes = vi.fn();
    host.form.controls.ids.valueChanges.subscribe(changes);
    const settle = async () => {
      fixture.detectChanges();
      await fixture.whenStable();
      await new Promise<void>((resolve) => setTimeout(resolve));
      fixture.detectChanges();
    };
    await settle();
    const element = fixture.nativeElement as HTMLElement;
    const inputs = () => Array.from(element.querySelectorAll<HTMLInputElement>('clr-dg-row input'));
    inputs()[0].focus();
    inputs()[0].click();
    await settle();
    expect(host.form.controls.ids.pending).toBe(true);
    (element.lastElementChild as HTMLButtonElement).focus();
    result.next({serverRule: true});
    result.complete();
    await settle();
    expect(host.form.controls.ids.hasError('serverRule')).toBe(true);
    expect(element.querySelector('.field-feedback.error')?.textContent).toContain('Selection rule failed');
    expect(changes).toHaveBeenCalledTimes(1);
    inputs()[1].click();
    await settle();
    expect(host.form.controls.ids.hasError('maxlength')).toBe(true);
    expect(host.form.controls.ids.value).toEqual(['org-1', 'org-2']);
    host.form.reset();
    await settle();
    expect(element.querySelector('.field-feedback.error')).toBeNull();
  });
  it('rejects a missing inner binding', () => {
    const fixture = TestBed.createComponent(MissingPicker);
    expect(() => fixture.detectChanges()).toThrow(/exactly one inner/);
  });
  it('rejects multiple inner bindings before either can become another value owner', () => {
    const fixture = TestBed.createComponent(DuplicatePicker);
    expect(() => fixture.detectChanges()).toThrow(/multiple inner/);
  });
  it.each(['change', 'blur', 'submit'] as const)(
    'preserves %s buffering, validators, disabled and reset without another control',
    async (updateOn) => {
      TestBed.configureTestingModule({providers: [provideNoopAnimations()]});
      const fixture = TestBed.createComponent(Host);
      const host = fixture.componentInstance;
      host.form = new FormGroup({
        ids: new FormControl<string[]>([], {nonNullable: true, updateOn, validators: Validators.required}),
      });
      const settle = async () => {
        fixture.detectChanges();
        await fixture.whenStable();
        await new Promise<void>((resolve) => setTimeout(resolve));
        await fixture.whenStable();
        fixture.detectChanges();
      };
      await settle();
      const element = fixture.nativeElement as HTMLElement;
      const checkbox = () => element.querySelector<HTMLInputElement>('clr-dg-row input')!;
      checkbox().focus();
      checkbox().click();
      await settle();
      expect(host.form.controls.ids.value).toEqual(updateOn === 'change' ? ['org-1'] : []);
      expect(host.form.controls.ids.untouched).toBe(true);
      element.querySelector<HTMLButtonElement>('button:last-child')!.focus();
      await vi.waitFor(() => expect(host.form.controls.ids.touched || updateOn === 'submit').toBe(true));
      await settle();
      if (updateOn === 'submit') element.querySelector<HTMLButtonElement>('[type=submit]')!.click();
      await settle();
      expect(host.form.controls.ids.value).toEqual(['org-1']);
      expect(host.form.valid).toBe(true);
      host.form.controls.ids.disable();
      await settle();
      expect(checkbox().disabled).toBe(true);
      expect(host.form.value).toEqual({ids: ['org-1']}); // Entirely disabled groups serialize all children in Angular.
      host.form.controls.ids.enable();
      element.querySelector<HTMLButtonElement>('[type=reset]')!.click();
      await settle();
      expect(host.form.controls.ids.value).toEqual([]);
      expect(host.form.controls.ids.pristine).toBe(true);
      expect(host.form.controls.ids.untouched).toBe(true);
      expect(host.form.controls.ids.hasError('required')).toBe(true);
    },
  );
});
