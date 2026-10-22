import {Component, signal} from '@angular/core';
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {By} from '@angular/platform-browser';
import {FormControl, FormGroup, FormsModule, NgForm, ReactiveFormsModule} from '@angular/forms';
import {toSignalForm} from 'ngx-lift';
import {Subject} from 'rxjs';
import {vi} from 'vitest';

import {TranslationService} from '../../services/translation.service';
import {KeyValueControlComponent} from './key-value-control.component';
import {KeyValueEntry} from './key-value-entry.type';

const initial: readonly KeyValueEntry[] = Object.freeze([Object.freeze({key: 'team', value: 'data'})]);

@Component({
  imports: [KeyValueControlComponent, ReactiveFormsModule],
  template: `<form [formGroup]="form" (ngSubmit)="save()">
    <cll-key-value-control
      formControlName="labels"
      [readonly]="readonly()"
      [minRows]="min()"
      [maxRows]="max()"
      [uniqueKeys]="unique()"
    />
    <input aria-label="Sibling" formControlName="sibling" /><button type="submit">Save</button>
  </form>`,
})
class ReactiveHost {
  readonly = signal(false);
  min = signal(0);
  max = signal<number | undefined>(undefined);
  unique = signal(true);
  form = new FormGroup({
    labels: new FormControl<readonly KeyValueEntry[]>(initial, {nonNullable: true}),
    sibling: new FormControl('enabled', {nonNullable: true}),
  });
  sf = toSignalForm(this.form, {includeDisabled: false});
  payload: unknown;
  save() {
    this.form.markAllAsTouched();
    if (this.form.valid) this.payload = this.sf.submitValue();
  }
}

@Component({
  imports: [KeyValueControlComponent, FormsModule],
  template: `<form #form="ngForm" (ngSubmit)="submitted = form.value">
    <cll-key-value-control name="labels" [(ngModel)]="labels" required [disabled]="disabled" />
    <button type="submit">Save</button>
  </form>`,
})
class ModelHost {
  labels: readonly KeyValueEntry[] | null = initial;
  disabled = false;
  submitted: unknown;
}

describe('KeyValueControlComponent with Angular form owners', () => {
  let fixture: ComponentFixture<ReactiveHost>;
  let host: ReactiveHost;
  const inputs = () => [...fixture.nativeElement.querySelectorAll('cll-key-value-control input')] as HTMLInputElement[];
  const editor = () => fixture.nativeElement.querySelector('cll-key-value-control') as HTMLElement;
  const buttons = () => Array.from(editor().querySelectorAll('button'));
  const addButton = () => editor().querySelector<HTMLButtonElement>('[data-add]') as HTMLButtonElement;
  const fieldset = () => editor().querySelector('fieldset') as HTMLFieldSetElement;
  async function settle() {
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
  }
  async function edit(index: number, value: string) {
    inputs()[index].value = value;
    inputs()[index].dispatchEvent(new Event('input', {bubbles: true}));
    await settle();
  }
  async function leave(to: Element | null = fixture.nativeElement.querySelector('[aria-label="Sibling"]')) {
    inputs()[0]?.dispatchEvent(new FocusEvent('focusout', {bubbles: true, relatedTarget: to}));
    await settle();
  }

  beforeEach(async () => {
    TestBed.configureTestingModule({imports: [ReactiveHost, ModelHost]});
    fixture = TestBed.createComponent(ReactiveHost);
    host = fixture.componentInstance;
    await settle();
  });

  it('renders owner writes without echo, copies frozen arrays and keeps input identity during edits', async () => {
    const changes = vi.fn();
    host.form.controls.labels.valueChanges.subscribe(changes);
    const key = inputs()[0];
    await edit(0, 'owner');
    expect(changes).toHaveBeenCalledTimes(1);
    expect(host.form.controls.labels.value).toEqual([{key: 'owner', value: 'data'}]);
    expect(host.form.controls.labels.value).not.toBe(initial);
    expect(initial).toEqual([{key: 'team', value: 'data'}]);
    expect(inputs()[0]).toBe(key);
    expect(host.form.controls.labels.dirty).toBe(true);
    host.form.controls.labels.setValue([{key: 'external', value: 'write'}], {emitEvent: false});
    await settle();
    expect(inputs()[0].value).toBe('external');
    expect(changes).toHaveBeenCalledTimes(1);
    host.form.patchValue({labels: initial}, {emitEvent: false});
    await settle();
    expect(inputs()[0].value).toBe('team');
    expect(changes).toHaveBeenCalledTimes(1);
  });

  it('does not touch within the composite and reports each departure after reset', async () => {
    await leave(inputs()[1]);
    expect(host.form.controls.labels.touched).toBe(false);
    await leave();
    expect(host.sf.fields.labels.touched()).toBe(true);
    host.form.reset();
    await settle();
    expect(host.form.controls.labels.touched).toBe(false);
    expect(host.form.controls.labels.pristine).toBe(true);
    await leave();
    expect(host.form.controls.labels.touched).toBe(true);
  });

  it('leaves nullable resets empty and restores non-null defaults without user changes', async () => {
    await edit(1, 'changed');
    host.form.reset();
    await settle();
    expect(inputs()[1].value).toBe('data');
    expect(host.sf.value().labels).toEqual(initial);
    const nullable = new FormControl<readonly KeyValueEntry[] | null>(initial);
    host.form.setControl('labels', nullable as FormControl<readonly KeyValueEntry[]>);
    await settle();
    nullable.reset();
    await settle();
    expect(nullable.value).toBeNull();
    expect(inputs()).toHaveLength(0);
    expect(nullable.pristine).toBe(true);
    addButton().click();
    await settle();
    expect(nullable.value).toEqual([{key: '', value: ''}]);
  });

  it('composes indexed required/duplicate errors with caller validation and recalculates configuration', async () => {
    const labels = host.form.controls.labels;
    labels.addValidators(() => ({business: true}));
    labels.setValue([
      {key: 'team', value: ''},
      {key: 'team', value: 'x'},
    ]);
    await settle();
    expect(labels.errors).toEqual({
      business: true,
      keyValue: {
        rows: [
          {index: 0, key: {unique: true}, value: {required: true}},
          {index: 1, key: {unique: true}},
        ],
      },
    });
    expect(inputs()[0].getAttribute('aria-invalid')).toBe('false');
    labels.markAllAsTouched();
    await settle();
    expect(inputs()[0].getAttribute('aria-invalid')).toBe('true');
    await edit(2, 'TEAM');
    expect(labels.errors?.['keyValue'].rows).toEqual([{index: 0, value: {required: true}}]);
    await edit(1, 'fixed');
    expect(labels.errors).toEqual({business: true});
    host.unique.set(false);
    await edit(2, 'team');
    await settle();
    expect(labels.errors).toEqual({business: true});
    host.unique.set(true);
    await settle();
    expect(labels.errors?.['keyValue'].rows).toHaveLength(2);
  });

  it('validates limits without synthesizing or truncating data; add/delete respect bounds', async () => {
    host.min.set(1);
    host.max.set(2);
    host.form.controls.labels.setValue([]);
    await settle();
    expect(inputs()).toHaveLength(0);
    expect(host.form.controls.labels.errors?.['keyValue'].minRows).toEqual({required: 1, actual: 0});
    addButton().click();
    await settle();
    expect(buttons()[0].disabled).toBe(true);
    addButton().click();
    await settle();
    expect(inputs()).toHaveLength(4);
    expect(addButton().disabled).toBe(true);
    host.form.controls.labels.setValue([
      {key: 'a', value: '1'},
      {key: 'b', value: '2'},
      {key: 'c', value: '3'},
    ]);
    await settle();
    expect(inputs()).toHaveLength(6);
    expect(host.form.controls.labels.errors?.['keyValue'].maxRows).toEqual({required: 2, actual: 3});
  });

  it('commits blur-mode changes only on composite exit and reset discards pending edits', async () => {
    host.form.setControl('labels', new FormControl(initial, {nonNullable: true, updateOn: 'blur'}));
    await settle();
    await edit(0, '');
    expect(host.form.controls.labels.value).toEqual(initial);
    expect(host.form.controls.labels.valid).toBe(true);
    await leave(inputs()[1]);
    expect(host.form.controls.labels.pristine).toBe(true);
    await leave();
    expect(host.form.controls.labels.value).toEqual([{key: '', value: 'data'}]);
    expect(host.form.controls.labels.invalid).toBe(true);
    await edit(0, 'discard');
    host.form.reset();
    await settle();
    await leave();
    expect(host.form.controls.labels.value).toEqual(initial);
  });

  it('synchronizes submit-mode edits before ngSubmit reads the facade payload', async () => {
    host.form.setControl('labels', new FormControl(initial, {nonNullable: true, updateOn: 'submit'}));
    await settle();
    await edit(1, 'submitted');
    await leave();
    expect(host.form.controls.labels.value).toEqual(initial);
    fixture.nativeElement.querySelector('form').dispatchEvent(new Event('submit', {bubbles: true, cancelable: true}));
    await settle();
    expect(host.payload).toEqual({labels: [{key: 'team', value: 'submitted'}], sibling: 'enabled'});
    expect(host.form.controls.labels.touched).toBe(true);
  });

  it('blocks disabled and readonly mutations and explicitly filters disabled facade payloads', async () => {
    const labels = host.form.controls.labels;
    labels.disable();
    await settle();
    const before = labels.value;
    await edit(0, 'blocked');
    await leave();
    expect(labels.value).toBe(before);
    expect(labels.touched).toBe(false);
    expect(fieldset().disabled).toBe(true);
    expect(host.form.value).toEqual({sibling: 'enabled'});
    expect(host.form.getRawValue().labels).toEqual(initial);
    expect(host.sf.submitValue()).toEqual({sibling: 'enabled'});
    host.form.disable();
    expect(host.form.value.labels).toEqual(initial); // Angular's wholly-disabled-group exception.
    host.form.enable();
    host.readonly.set(true);
    await settle();
    await edit(0, 'blocked-again');
    expect(labels.value).toBe(before);
    expect(inputs()[0].readOnly).toBe(true);
    expect(buttons().every((button) => button.disabled)).toBe(true);
    await leave();
    expect(labels.touched).toBe(true);
    expect(host.sf.submitValue().labels).toEqual(initial);
  });

  it('starts disabled from owner state without touching or changing the value', async () => {
    fixture.destroy();
    fixture = TestBed.createComponent(ReactiveHost);
    host = fixture.componentInstance;
    host.form.controls.labels.disable();
    await settle();
    expect(fieldset().disabled).toBe(true);
    expect(host.form.controls.labels.touched).toBe(false);
    host.form.controls.labels.enable();
    await settle();
    expect(fieldset().disabled).toBe(false);
    expect(inputs()[0].value).toBe('team');
  });

  it('keeps async pending visible to the owner and facade, cancels obsolete validation on reset', async () => {
    const results: Subject<null>[] = [];
    host.form.controls.labels.setAsyncValidators(() => {
      const result = new Subject<null>();
      results.push(result);
      return result;
    });
    await edit(1, 'pending');
    expect(host.form.pending).toBe(true);
    expect(host.sf.status()).toBe('PENDING');
    host.save();
    expect(host.payload).toBeUndefined();
    host.form.reset();
    await settle();
    results[0].next(null);
    results[0].complete();
    expect(host.form.pending).toBe(true);
    results[results.length - 1].next(null);
    results[results.length - 1].complete();
    await settle();
    expect(host.sf.status()).toBe('VALID');
    expect(host.sf.value().labels).toEqual(initial);
  });

  it('cancels queued focus and departure on owner writes, disabling and destruction', async () => {
    vi.useFakeTimers();
    try {
      const focus = vi.spyOn(HTMLElement.prototype, 'focus');
      addButton().click();
      host.form.reset();
      fixture.detectChanges();
      vi.runAllTimers();
      expect(focus).not.toHaveBeenCalled();
      addButton().click();
      host.form.controls.labels.disable();
      fixture.detectChanges();
      vi.runAllTimers();
      expect(focus).not.toHaveBeenCalled();
      host.form.controls.labels.enable();
      fixture.detectChanges();
      addButton().click();
      fixture.destroy();
      vi.runAllTimers();
      expect(focus).not.toHaveBeenCalled();
      focus.mockRestore();
    } finally {
      vi.useRealTimers();
    }
  });

  it('ignores composing input and emits once after composition completes', async () => {
    const changes = vi.fn();
    host.form.controls.labels.valueChanges.subscribe(changes);
    const input = inputs()[0];
    input.value = '名字';
    input.dispatchEvent(new InputEvent('input', {bubbles: true, isComposing: true}));
    expect(changes).not.toHaveBeenCalled();
    input.dispatchEvent(new Event('compositionend', {bubbles: true}));
    input.dispatchEvent(new InputEvent('input', {bubbles: true}));
    await settle();
    expect(changes).toHaveBeenCalledTimes(1);
  });

  it('adds and deletes immutable rows, restores neighboring focus and clears duplicate errors', async () => {
    vi.useFakeTimers();
    try {
      const originalInput = inputs()[0];
      addButton().click();
      fixture.detectChanges();
      vi.runAllTimers();
      expect(document.activeElement).toBe(inputs()[2]);
      expect(host.form.controls.labels.value).toEqual([
        {key: 'team', value: 'data'},
        {key: '', value: ''},
      ]);
      inputs()[2].value = 'team';
      inputs()[2].dispatchEvent(new Event('input', {bubbles: true}));
      fixture.detectChanges();
      expect(host.form.controls.labels.errors?.['keyValue'].rows[0].key).toEqual({unique: true});
      buttons()[1].click();
      fixture.detectChanges();
      vi.runAllTimers();
      expect(inputs()[0]).toBe(originalInput);
      expect(document.activeElement).toBe(originalInput);
      expect(host.form.controls.labels.valid).toBe(true);
      expect(host.form.controls.labels.touched).toBe(false);
      buttons()[0].click();
      fixture.detectChanges();
      vi.runAllTimers();
      expect(host.form.controls.labels.value).toEqual([]);
      expect(document.activeElement).toBe(addButton());
    } finally {
      vi.useRealTimers();
    }
  });

  it('resolves null focus destinations and cancels obsolete departure work on disable', async () => {
    inputs()[0].focus();
    inputs()[0].dispatchEvent(new FocusEvent('focusout', {bubbles: true}));
    await settle();
    expect(host.form.controls.labels.touched).toBe(false);
    inputs()[0].dispatchEvent(new FocusEvent('focusout', {bubbles: true}));
    host.form.controls.labels.disable();
    await settle();
    expect(host.form.controls.labels.touched).toBe(false);
    host.form.controls.labels.enable();
    await settle();
    inputs()[0].focus();
    inputs()[0].blur();
    await settle();
    expect(host.form.controls.labels.touched).toBe(true);
  });

  it('switches accessible labels and errors at runtime without losing values or identity', async () => {
    const input = inputs()[0];
    TestBed.inject(TranslationService).setLanguage('zh-CN');
    await settle();
    expect(editor().textContent).toContain('标签');
    expect(buttons()[0].getAttribute('aria-label')).toBe('删除 1');
    expect(inputs()[0]).toBe(input);
    expect(host.form.controls.labels.value).toBe(initial);
  });

  it('supports ngModel required validation, owner reset, disabled state and actual form submission', async () => {
    const modelFixture = TestBed.createComponent(ModelHost);
    const model = modelFixture.componentInstance;
    modelFixture.detectChanges();
    await modelFixture.whenStable();
    modelFixture.detectChanges();
    const input = modelFixture.nativeElement.querySelector('input') as HTMLInputElement;
    input.value = 'model';
    input.dispatchEvent(new Event('input', {bubbles: true}));
    modelFixture.detectChanges();
    await modelFixture.whenStable();
    expect(model.labels).toEqual([{key: 'model', value: 'data'}]);
    const form = modelFixture.debugElement.query(By.directive(NgForm)).injector.get(NgForm);
    form.resetForm({labels: []});
    modelFixture.detectChanges();
    await modelFixture.whenStable();
    modelFixture.detectChanges();
    expect(form.controls['labels'].hasError('required')).toBe(true);
    expect(form.pristine).toBe(true);
    expect(form.untouched).toBe(true);
    form.resetForm({labels: initial});
    modelFixture.detectChanges();
    await modelFixture.whenStable();
    modelFixture.detectChanges();
    modelFixture.nativeElement
      .querySelector('form')
      .dispatchEvent(new Event('submit', {bubbles: true, cancelable: true}));
    expect(model.submitted).toEqual({labels: initial});
    model.disabled = true;
    modelFixture.detectChanges();
    await modelFixture.whenStable();
    modelFixture.detectChanges();
    expect(modelFixture.nativeElement.querySelector('fieldset').disabled).toBe(true);
  });
});
