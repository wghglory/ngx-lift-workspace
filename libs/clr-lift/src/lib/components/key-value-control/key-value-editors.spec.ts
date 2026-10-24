import {Component, signal} from '@angular/core';
import {TestBed} from '@angular/core/testing';
import {By} from '@angular/platform-browser';
import {ClrCombobox} from '@clr/angular';
import {FormControl, ReactiveFormsModule, Validators} from '@angular/forms';

import {KeyValueControlComponent} from './key-value-control.component';
import {
  KeyValueEntry,
  KeyValueFieldConfig,
  KeyValueKeyConfig,
  KeyValueValue,
  KeyValueValueConfig,
} from './key-value-entry.type';
import {keyValueErrors} from './key-value-validation';
import {TranslationService} from '../../services/translation.service';

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

function query<T extends Element = HTMLInputElement>(root: ParentNode, selector: string): T {
  const element = root.querySelector<T>(selector);
  if (!element) throw new Error(`Missing test element: ${selector}`);
  return element;
}

describe('key/value editor configuration', () => {
  async function setup(initialize?: (host: Host) => void) {
    const fixture = TestBed.createComponent(Host);
    initialize?.(fixture.componentInstance);
    const settle = async () => {
      fixture.detectChanges();
      await fixture.whenStable();
      fixture.detectChanges();
    };
    await settle();
    const element = fixture.nativeElement as HTMLElement;
    const edit = async (selector: string, value: string, event = 'input') => {
      const field = query<HTMLInputElement>(element, selector);
      field.value = value;
      field.dispatchEvent(new Event(event, {bubbles: true}));
      await settle();
    };
    return {fixture, host: fixture.componentInstance, element, settle, edit};
  }

  it('defers each new field error until blur and clears feedback on reset', async () => {
    const {host, element, settle} = await setup();
    query<HTMLButtonElement>(element, '[data-add]').click();
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
    query<HTMLButtonElement>(element, '[data-add]').click();
    await settle();
    expect(element.querySelectorAll('input')[4].getAttribute('aria-invalid')).toBe('false');
    host.control.reset([{key: '', value: ''}]);
    await settle();
    expect(query(element, 'input').getAttribute('aria-invalid')).toBe('false');
    host.keyConfig.set({placeholder: 'Choose category'});
    await settle();
    expect(query(element, 'input').placeholder).toBe('Choose category');
  });

  it('keeps required select placeholders out of selectable data and lets optional selects clear', async () => {
    const {host, element, settle, edit} = await setup();
    host.keyConfig.set({type: 'select', options: [{value: 'team', label: 'Team'}]});
    await settle();
    const placeholder = query<HTMLOptionElement>(element, 'option');
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
    expect(query(element, 'input').getAttribute('aria-invalid')).toBe('false');
    host.control.markAllAsTouched();
    await settle();
    expect(query(element, 'input').getAttribute('aria-invalid')).toBe('true');
    host.control.markAsUntouched();
    await settle();
    expect(query(element, 'input').getAttribute('aria-invalid')).toBe('false');
  });

  it('reveals errors for initially attached and replacement pre-touched owners', async () => {
    const {host, fixture, element, settle} = await setup((host) => {
      host.control.setValue([{key: '', value: ''}]);
      host.control.markAsTouched();
    });
    expect(query(element, 'input').getAttribute('aria-invalid')).toBe('true');
    host.control = new FormControl<KeyValueEntry<KeyValueValue>[]>([{key: '', value: ''}], {nonNullable: true});
    host.control.markAsTouched();
    fixture.changeDetectorRef.markForCheck();
    await settle();
    expect(query(element, 'input').getAttribute('aria-invalid')).toBe('true');
    host.control.reset();
    await settle();
    expect(query(element, 'input').getAttribute('aria-invalid')).toBe('false');
  });

  it.each(
    [
      {},
      '',
      [null],
      [undefined],
      new Array(1),
      [{}],
      [{key: 4, value: ''}],
      [{key: 'missing'}],
      [{key: 'object', value: {nested: 'unsupported'}}],
      [{key: 'array', value: [1]}],
      [{key: 'array', value: new Array(1)}],
    ].map((value) => ({value})),
  )('rejects malformed owner data without throwing, rewriting or allowing edits: $value', async ({value}) => {
    const {host, element, settle} = await setup();
    const changed = vi.fn();
    host.control.valueChanges.subscribe(changed);
    host.control.setValue(value as unknown as KeyValueEntry<KeyValueValue>[]);
    await settle();
    expect(host.control.value).toBe(value);
    expect(host.control.errors).toEqual({keyValue: {rows: [], structure: true}});
    expect(element.querySelectorAll('input')).toHaveLength(0);
    expect(query<HTMLButtonElement>(element, '[data-add]').disabled).toBe(true);
    expect(element.textContent).toContain('Value has the wrong type');
    query<HTMLButtonElement>(element, '[data-add]').click();
    await settle();
    expect(changed).toHaveBeenCalledTimes(1);
    host.control.setValue([{key: 'environment', value: 'production'}]);
    await settle();
    expect(host.control.valid).toBe(true);
    expect(query(element, 'input').value).toBe('environment');
    expect(query<HTMLButtonElement>(element, '[data-add]').disabled).toBe(false);
  });

  it('keeps Add available for default free-text keys with exhausted options', async () => {
    const {host, element, settle} = await setup();
    host.keyConfig.set({options: [{value: 'team', label: 'Team'}]});
    host.exclude.set(true);
    await settle();
    const add = query<HTMLButtonElement>(element, '[data-add]');
    expect(query(element, 'input').value).toBe('team');
    expect(add.disabled).toBe(false);
    add.click();
    await settle();
    expect(host.control.value).toHaveLength(2);
    expect(add.disabled).toBe(false);
  });

  it('does not resolve row configurations again for unrelated change detection', async () => {
    const {host, settle} = await setup();
    const resolver = vi.fn(() => ({}));
    host.valueConfig.set(resolver);
    host.exclude.set(true);
    await settle();
    resolver.mockClear();
    host.readonly.set(true);
    await settle();
    await settle();
    expect(resolver).not.toHaveBeenCalled();
  });

  it('recovers removal focus through enabled value, Add and the named group', async () => {
    const {host, element, settle} = await setup();
    host.control.setValue([
      {key: 'team', value: 'data'},
      {key: 'region', value: 'east'},
    ]);
    host.keyConfig.set({disabled: true});
    await settle();
    query<HTMLButtonElement>(element, 'button').click();
    await settle();
    await vi.waitFor(() => expect(document.activeElement).toBe(query(element, 'input:enabled')));
    host.control.setValue([
      {key: 'team', value: 'data'},
      {key: 'region', value: 'east'},
    ]);
    host.valueConfig.set({disabled: true});
    await settle();
    query<HTMLButtonElement>(element, 'button').click();
    await settle();
    await vi.waitFor(() => expect(document.activeElement).toBe(query(element, '[data-add]')));
    host.keyConfig.set({type: 'select', disabled: true, options: [{value: 'team', label: 'Team'}]});
    host.exclude.set(true);
    host.control.setValue([
      {key: 'team', value: 'data'},
      {key: 'region', value: 'east'},
    ]);
    await settle();
    element.querySelectorAll<HTMLButtonElement>('button')[1].click();
    await settle();
    await vi.waitFor(() => expect(document.activeElement).toBe(query(element, 'fieldset')));
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
    query<HTMLInputElement>(element, 'input[type="checkbox"]').click();
    await settle();
    expect(host.control.value[0].value).toBe(true);
    host.readonly.set(true);
    await settle();
    query<HTMLInputElement>(element, 'input[type="checkbox"]').click();
    await settle();
    expect(host.control.value[0].value).toBe(true);
    const checkbox = query(element, 'clr-checkbox-wrapper input');
    expect(checkbox.disabled).toBe(false);
    expect(checkbox.checked).toBe(true);
    expect(checkbox.getAttribute('aria-readonly')).toBe('true');
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
    query(element, 'input').dispatchEvent(new FocusEvent('focusout', {bubbles: true, relatedTarget: document.body}));
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
    expect(query(element, 'select').value).toBe('data');
    expect(host.control.errors?.['keyValue'].rows[0].value.selection).toBe(true);
    expect(host.control.value[0].value).toBe('data');
  });

  it('keeps incompatible typed values inspectable after key changes and in readonly mode', async () => {
    const {host, element, settle, edit} = await setup((host) => {
      host.control.setValue([{key: 'count', value: 3}]);
      host.valueConfig.set((key) => (key === 'count' ? {type: 'number'} : {type: 'boolean'}));
    });
    await edit('input', 'enabled');
    expect(host.control.value).toEqual([{key: 'enabled', value: 3}]);
    expect(query(element, 'output code').textContent).toBe('3');
    const preview = query(element, 'output');
    expect(query(element, 'input[type=checkbox]').getAttribute('aria-describedby')).toContain(preview.id);
    expect(host.control.errors?.['keyValue'].rows[0].value.type).toBe(true);
    host.readonly.set(true);
    await settle();
    expect(query(element, 'output code').textContent).toBe('3');
    expect(query(element, 'input[type=checkbox]').getAttribute('aria-readonly')).toBe('true');

    host.control.setValue([{key: 'count', value: false}]);
    await settle();
    expect(query(element, 'input[type=number]').value).toBe('');
    expect(query(element, 'output code').textContent).toBe('false');
    host.readonly.set(false);
    await settle();
    await edit('input[type=number]', '7');
    expect(host.control.value[0].value).toBe(7);
    expect(host.control.valid).toBe(true);
    expect(element.querySelector('output')).toBeNull();
  });

  it.each([{value: ['']}, {value: ['one\ntwo']}, {value: ['one\rtwo']}])(
    'preserves unrepresentable arrays until an explicit correction: $value',
    async ({value: original}) => {
      const {host, element, settle, edit} = await setup((host) => {
        host.valueConfig.set({type: 'array'});
        host.control.setValue([{key: 'hosts', value: original}]);
      });
      const changes = vi.fn();
      host.control.valueChanges.subscribe(changes);
      expect(host.control.value[0].value).toBe(original);
      expect(host.control.errors?.['keyValue'].rows[0].value.arrayFormat).toBe(true);
      expect(query(element, 'output code').textContent).toBe(JSON.stringify(original));
      expect(query(element, 'textarea').getAttribute('aria-describedby')).toContain(query(element, 'output').id);
      host.control.markAllAsTouched();
      await settle();
      expect(element.textContent).toContain('A single empty item');
      expect(changes).not.toHaveBeenCalled();
      await edit('textarea', 'first\nsecond');
      expect(host.control.value[0].value).toEqual(['first', 'second']);
      expect(changes).toHaveBeenCalledTimes(1);
      expect(element.querySelector('output')).toBeNull();
      expect(host.control.valid).toBe(true);
    },
  );

  it('allows an array-format message override and retains disabled incompatible values visibly', async () => {
    const {host, element, settle} = await setup((host) => {
      host.valueConfig.set({type: 'array', messages: {arrayFormat: 'Replace these items'}});
      host.control.setValue([{key: 'hosts', value: ['']}]);
    });
    host.control.markAllAsTouched();
    await settle();
    expect(element.textContent).toContain('Replace these items');
    host.valueConfig.set({type: 'number', disabled: true});
    await settle();
    expect(host.control.valid).toBe(true);
    expect(query(element, 'output code').textContent).toBe('[""]');
    expect(query(element, 'input[type=number]').disabled).toBe(true);
  });

  it('switches retained-value guidance and array errors at runtime without changing owner data', async () => {
    const {host, element, settle} = await setup((host) => {
      host.valueConfig.set({type: 'array'});
      host.control.setValue([{key: 'hosts', value: ['']}]);
    });
    const saved = host.control.value;
    host.control.markAllAsTouched();
    TestBed.inject(TranslationService).setLanguage('zh-CN', false);
    await settle();
    expect(query(element, 'output').textContent).toContain('已保存的值：');
    expect(element.textContent).toContain('无法表示仅含一个空字符串的数组');
    expect(host.control.value).toBe(saved);
    TestBed.inject(TranslationService).setLanguage('en', false);
    await settle();
    expect(query(element, 'output').textContent).toContain('Stored value:');
    expect(element.textContent).toContain('A single empty item');
    expect(host.control.value).toBe(saved);
  });

  it.each<{type: KeyValueFieldConfig['type']; invalid: KeyValueValue; empty: KeyValueValue}>([
    {type: 'input', invalid: [], empty: ''},
    {type: 'select', invalid: null, empty: ''},
    {type: 'combobox', invalid: [], empty: ''},
    {type: 'number', invalid: [], empty: null},
    {type: 'boolean', invalid: '', empty: false},
    {type: 'array', invalid: '', empty: []},
  ])('validates optional $type fields without accepting another editor’s empty type', ({type, invalid, empty}) => {
    const options = {valueConfig: {type, required: false}};
    expect(keyValueErrors([{key: 'k', value: invalid}], options)?.keyValue.rows[0].value?.['type']).toBe(true);
    expect(keyValueErrors([{key: 'k', value: empty}], options)).toBeNull();
  });

  it('preserves representable blank array items and applies list uniqueness to disabled fields', () => {
    expect(keyValueErrors([{key: 'k', value: ['', '']}], {valueConfig: {type: 'array'}})).toBeNull();
    const entries = [
      {key: 'k', value: 'v'},
      {key: 'k', value: 'v'},
    ];
    expect(keyValueErrors(entries, {keyConfig: {disabled: true}})?.keyValue.rows[0].key?.['unique']).toBe(true);
    expect(
      keyValueErrors(entries, {
        uniqueKeys: false,
        uniquePairs: true,
        keyConfig: {disabled: true},
        valueConfig: {disabled: true},
      })?.keyValue.rows[0].value?.['duplicate'],
    ).toBe(true);
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
    expect(query<HTMLButtonElement>(element, '[data-add]').disabled).toBe(true);
    query<HTMLButtonElement>(element, 'button').click();
    await settle();
    expect(query<HTMLButtonElement>(element, '[data-add]').disabled).toBe(false);
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
    expect(keyValueErrors([{key: 'k', value: false}], {valueConfig: {type: 'boolean'}})).toBeNull();
    expect(keyValueErrors([{key: 'k', value: []}], {valueConfig: {type: 'array', required: false}})).toBeNull();
    expect(
      keyValueErrors([{key: 'k', value: '3'}], {valueConfig: {type: 'number'}})?.keyValue.rows[0].value?.['type'],
    ).toBe(true);
    expect(
      keyValueErrors([{key: 'k', value: 11}], {valueConfig: {type: 'number', max: 10}})?.keyValue.rows[0].value?.[
        'max'
      ],
    ).toEqual({max: 10, actual: 11});
    expect(
      keyValueErrors([{key: 'k', value: 'old'}], {
        valueConfig: {type: 'select', options: [{value: 'old', label: 'Old', disabled: true}]},
      })?.keyValue.rows[0].value?.['selection'],
    ).toBe(true);
  });
});
