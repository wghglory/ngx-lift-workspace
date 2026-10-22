import {Component, signal} from '@angular/core';
import {TestBed} from '@angular/core/testing';
import {By} from '@angular/platform-browser';
import {ClrCombobox} from '@clr/angular';
import {FormControl, ReactiveFormsModule, Validators} from '@angular/forms';

import {KeyValueControlComponent} from './key-value-control.component';
import {KeyValueEntry, KeyValueKeyConfig, KeyValueValue, KeyValueValueConfig} from './key-value-entry.type';
import {keyValueErrors} from './key-value-validation';

@Component({
  imports: [KeyValueControlComponent, ReactiveFormsModule],
  template: `<cll-key-value-control
    [formControl]="control"
    [keyConfig]="keyConfig()"
    [valueConfig]="valueConfig()"
    [uniqueKeys]="false"
    [uniquePairs]="true"
    [resetValueOnKeyChange]="reset()"
    [excludeSelectedKeys]="exclude()"
    [readonly]="readonly()"
  />`,
})
class Host {
  control = new FormControl<KeyValueEntry<KeyValueValue>[]>([{key: 'team', value: 'data'}], {nonNullable: true});
  keyConfig = signal<KeyValueKeyConfig>({});
  valueConfig = signal<KeyValueValueConfig>({});
  reset = signal(false);
  exclude = signal(false);
  readonly = signal(false);
}

describe('key/value editor configuration', () => {
  async function setup() {
    const fixture = TestBed.createComponent(Host);
    const settle = async () => {
      fixture.detectChanges();
      await fixture.whenStable();
      fixture.detectChanges();
    };
    await settle();
    const element = fixture.nativeElement as HTMLElement;
    const edit = async (selector: string, value: string, event = 'input') => {
      const field = element.querySelector<HTMLInputElement>(selector)!;
      field.value = value;
      field.dispatchEvent(new Event(event, {bubbles: true}));
      await settle();
    };
    return {fixture, host: fixture.componentInstance, element, settle, edit};
  }

  it('defers each new field error until blur and clears feedback on reset', async () => {
    const {host, element, settle} = await setup();
    element.querySelector<HTMLButtonElement>('[data-add]')!.click();
    await settle();
    const fields = element.querySelectorAll('input');
    expect(host.control.invalid).toBe(true);
    expect(fields[2].placeholder).toBe('Key');
    expect(fields[3].placeholder).toBe('Value');
    expect(fields[2].getAttribute('aria-invalid')).toBe('false');
    fields[2].dispatchEvent(new FocusEvent('focusout', {bubbles: true, relatedTarget: fields[3]}));
    await settle();
    expect(fields[2].getAttribute('aria-invalid')).toBe('true');
    expect(fields[3].getAttribute('aria-invalid')).toBe('false');
    host.control.markAllAsTouched();
    await settle();
    expect(fields[3].getAttribute('aria-invalid')).toBe('true');
    element.querySelector<HTMLButtonElement>('[data-add]')!.click();
    await settle();
    expect(element.querySelectorAll('input')[4].getAttribute('aria-invalid')).toBe('false');
    host.control.reset([{key: '', value: ''}]);
    await settle();
    expect(element.querySelector('input')!.getAttribute('aria-invalid')).toBe('false');
    host.keyConfig.set({placeholder: 'Choose category'});
    await settle();
    expect(element.querySelector('input')!.placeholder).toBe('Choose category');
  });

  it('keeps required select placeholders out of selectable data and lets optional selects clear', async () => {
    const {host, element, settle, edit} = await setup();
    host.keyConfig.set({type: 'select', options: [{value: 'team', label: 'Team'}]});
    await settle();
    const placeholder = element.querySelector('option')!;
    expect(placeholder.textContent?.trim()).toBe('Key');
    expect(placeholder.value).toBe('');
    expect(placeholder.disabled).toBe(true);
    expect(placeholder.hidden).toBe(true);
    host.keyConfig.set({type: 'select', required: false, options: [{value: 'team', label: 'Team'}]});
    await settle();
    expect(placeholder.disabled).toBe(false);
    expect(placeholder.hidden).toBe(false);
    await edit('select', '', 'change');
    expect(host.control.value[0].key).toBe('');
    expect(host.control.valid).toBe(true);
  });

  it('follows touch events when the owning FormControl is replaced', async () => {
    const {host, fixture, element, settle} = await setup();
    const original = host.control;
    host.control = new FormControl<KeyValueEntry<KeyValueValue>[]>([{key: '', value: ''}], {nonNullable: true});
    fixture.changeDetectorRef.markForCheck();
    await settle();
    original.markAllAsTouched();
    await settle();
    expect(element.querySelector('input')!.getAttribute('aria-invalid')).toBe('false');
    host.control.markAllAsTouched();
    await settle();
    expect(element.querySelector('input')!.getAttribute('aria-invalid')).toBe('true');
    host.control.markAsUntouched();
    await settle();
    expect(element.querySelector('input')!.getAttribute('aria-invalid')).toBe('false');
  });

  it('resets dependent values once on user key changes but preserves owner writes', async () => {
    const {host, element, edit, settle} = await setup();
    host.keyConfig.set({
      type: 'select',
      options: [
        {value: 'team', label: 'Team'},
        {value: 'region', label: 'Region'},
      ],
    });
    host.valueConfig.set((key) => ({
      type: 'select',
      options: [{value: key === 'team' ? 'data' : 'east', label: 'Choice'}],
    }));
    host.reset.set(true);
    await settle();
    await edit('select', 'region', 'change');
    expect(host.control.value).toEqual([{key: 'region', value: ''}]);
    expect(host.control.invalid).toBe(true);
    const selects = element.querySelectorAll('select');
    selects[1].value = 'east';
    selects[1].dispatchEvent(new Event('change', {bubbles: true}));
    await settle();
    expect(host.control.valid).toBe(true);
    host.control.setValue([{key: 'team', value: 'data'}]);
    await settle();
    expect(host.control.value).toEqual([{key: 'team', value: 'data'}]);
    expect(selects[1].value).toBe('data');
  });

  it('preserves numeric and boolean types and accepts false', async () => {
    const {host, edit, element, settle} = await setup();
    host.valueConfig.set({type: 'number', min: 1, max: 10});
    host.control.setValue([{key: 'count', value: 3}]);
    await settle();
    await edit('input[type="number"]', '7');
    expect(host.control.value[0].value).toBe(7);
    await edit('input[type="number"]', '0');
    expect(host.control.errors?.['keyValue'].rows[0].value.min).toEqual({min: 1, actual: 0});
    host.valueConfig.set({type: 'boolean'});
    host.control.setValue([{key: 'enabled', value: false}]);
    await settle();
    expect(host.control.valid).toBe(true);
    element.querySelector<HTMLInputElement>('input[type="checkbox"]')!.click();
    await settle();
    expect(host.control.value[0].value).toBe(true);
    host.readonly.set(true);
    await settle();
    element.querySelector<HTMLInputElement>('input[type="checkbox"]')!.click();
    await settle();
    expect(host.control.value[0].value).toBe(true);
  });

  it('copies nested arrays on writes and emissions, and resets without changing the owner default', async () => {
    const {host, edit, settle} = await setup();
    const original = ['one', 'two'];
    host.valueConfig.set({type: 'array'});
    host.control.setValue([{key: 'hosts', value: original}]);
    await settle();
    await edit('input', 'servers');
    const emitted = host.control.value[0].value as string[];
    expect(emitted).toEqual(original);
    expect(emitted).not.toBe(original);
    emitted.push('external');
    await edit('input', 'nodes');
    expect(host.control.value[0].value).toEqual(['one', 'two']);
    await edit('textarea', 'first\nsecond');
    expect(host.control.value[0].value).toEqual(['first', 'second']);
    expect(original).toEqual(['one', 'two']);
  });

  it('allows repeated categories, detects duplicate pairs and revalidates after configuration changes', async () => {
    const {host, settle, element} = await setup();
    host.control.setValue([
      {key: 'category', value: 'alpha'},
      {key: 'category', value: 'beta'},
    ]);
    await settle();
    expect(host.control.valid).toBe(true);
    host.control.setValue([
      {key: 'category', value: 'alpha'},
      {key: 'category', value: 'alpha'},
    ]);
    await settle();
    expect(host.control.errors?.['keyValue'].rows).toHaveLength(2);
    host.control.markAllAsTouched();
    host.keyConfig.set({messages: {duplicate: 'Repeated tag'}});
    await settle();
    expect(element.textContent).toContain('Repeated tag');
    host.control.setValue([{key: ' category', value: 'alpha'}]);
    host.keyConfig.set({
      validators: [{validator: Validators.pattern(/^\S+$/), errorKey: 'pattern', message: 'No whitespace'}],
    });
    await settle();
    expect(host.control.errors?.['keyValue'].rows[0].key.pattern).toBeTruthy();
    element
      .querySelector('input')!
      .dispatchEvent(new FocusEvent('focusout', {bubbles: true, relatedTarget: document.body}));
    await settle();
    expect(element.textContent).toContain('No whitespace');
    host.keyConfig.set({});
    await settle();
    expect(host.control.valid).toBe(true);
  });

  it('retains invalid selections visibly and does not silently coerce owner data', async () => {
    const {host, settle, element} = await setup();
    host.valueConfig.set({type: 'select', options: [{value: 'allowed', label: 'Allowed'}]});
    await settle();
    expect(element.querySelector('select')!.value).toBe('data');
    expect(host.control.errors?.['keyValue'].rows[0].value.selection).toBe(true);
    expect(host.control.value[0].value).toBe('data');
  });

  it('excludes selected keys and stops adding when all options are used', async () => {
    const {host, settle, element} = await setup();
    host.keyConfig.set({
      type: 'select',
      options: [
        {value: 'team', label: 'Team'},
        {value: 'region', label: 'Region'},
      ],
    });
    host.exclude.set(true);
    host.control.setValue([
      {key: 'team', value: 'data'},
      {key: 'region', value: 'east'},
    ]);
    await settle();
    expect(element.querySelectorAll('select')[0].options.length).toBe(2);
    expect(element.querySelector<HTMLButtonElement>('[data-add]')!.disabled).toBe(true);
    element.querySelector<HTMLButtonElement>('button')!.click();
    await settle();
    expect(element.querySelector<HTMLButtonElement>('[data-add]')!.disabled).toBe(false);
  });

  it('blocks disabled fields without dropping their submitted values', async () => {
    const {host, settle, edit} = await setup();
    host.valueConfig.set({disabled: true});
    await settle();
    await edit('cll-key-value-field:nth-of-type(2) input', 'tampered');
    expect(host.control.value[0].value).toBe('data');
    host.control.disable();
    await settle();
    await edit('input', 'tampered');
    expect(host.control.value[0].key).toBe('team');
  });

  it('bridges Clarity selection and preserves accessible readonly inspection', async () => {
    const {fixture, host, element, settle} = await setup();
    const options = [
      {value: 'team', label: 'Team'},
      {value: 'region', label: 'Region'},
      {value: 'old', label: 'Old', disabled: true},
    ];
    host.keyConfig.set({type: 'combobox', options});
    await settle();
    const combo = fixture.debugElement.query(By.directive(ClrCombobox)).componentInstance as ClrCombobox<
      (typeof options)[number]
    >;
    const input = combo.textbox.nativeElement;
    expect(input.getAttribute('aria-label')).toBe('Key 1');
    expect(input.getAttribute('aria-invalid')).toBe('false');
    combo.optionSelectionService.select(options[1]);
    await settle();
    expect(host.control.value[0].key).toBe('region');
    host.control.setValue([{key: 'missing', value: 'data'}]);
    await settle();
    expect(input.getAttribute('aria-invalid')).toBe('false');
    input.dispatchEvent(new FocusEvent('focusout', {bubbles: true, relatedTarget: document.body}));
    await settle();
    expect(input.getAttribute('aria-invalid')).toBe('true');
    host.readonly.set(true);
    await settle();
    const readonly = element.querySelector('input') as HTMLInputElement;
    expect(readonly.readOnly).toBe(true);
    expect(readonly.value).toBe('missing');
    host.control.setValue([{key: 'region', value: 'data'}]);
    await settle();
    expect(readonly.value).toBe('Region');
  });

  it('keeps an owned popup inside the blur boundary', async () => {
    const {fixture, host, element, edit, settle} = await setup();
    host.control = new FormControl<KeyValueEntry<KeyValueValue>[]>([{key: 'team', value: 'data'}], {
      nonNullable: true,
      updateOn: 'blur',
    });
    fixture.changeDetectorRef.markForCheck();
    await settle();
    await edit('input', 'draft');
    const field = element.querySelector('input') as HTMLInputElement;
    const popup = document.createElement('div');
    popup.id = 'owned-key-value-popup';
    document.body.appendChild(popup);
    field.setAttribute('aria-owns', popup.id);
    try {
      field.dispatchEvent(new FocusEvent('focusout', {bubbles: true, relatedTarget: popup}));
      await settle();
      expect(host.control.touched).toBe(false);
      expect(host.control.value[0].key).toBe('team');
      field.dispatchEvent(new FocusEvent('focusout', {bubbles: true, relatedTarget: document.body}));
      await settle();
      expect(host.control.value[0].key).toBe('draft');
    } finally {
      popup.remove();
    }
  });

  it('validates empty, typed, bounded and unavailable values with indexed errors', () => {
    expect(keyValueErrors([{key: 'k', value: false}], 0, undefined, true, {}, {type: 'boolean'})).toBeNull();
    expect(
      keyValueErrors([{key: 'k', value: []}], 0, undefined, true, {}, {type: 'array', required: false}),
    ).toBeNull();
    expect(
      keyValueErrors([{key: 'k', value: '3'}], 0, undefined, true, {}, {type: 'number'})?.keyValue.rows[0].value?.[
        'type'
      ],
    ).toBe(true);
    expect(
      keyValueErrors([{key: 'k', value: 11}], 0, undefined, true, {}, {type: 'number', max: 10})?.keyValue.rows[0]
        .value?.['max'],
    ).toEqual({max: 10, actual: 11});
    expect(
      keyValueErrors(
        [{key: 'k', value: 'old'}],
        0,
        undefined,
        true,
        {},
        {type: 'select', options: [{value: 'old', label: 'Old', disabled: true}]},
      )?.keyValue.rows[0].value?.['selection'],
    ).toBe(true);
  });
});
