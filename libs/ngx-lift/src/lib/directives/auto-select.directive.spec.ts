import {Component, forwardRef, signal} from '@angular/core';
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {ControlValueAccessor, FormControl, NG_VALUE_ACCESSOR, ReactiveFormsModule} from '@angular/forms';
import {describe, expect, it, vi} from 'vitest';

import {AutoSelectDirective} from './auto-select.directive';

@Component({
  template: `<input [formControl]="control" [ngxAutoSelect]="items()" [compareWith]="comparator" />`,
  imports: [AutoSelectDirective, ReactiveFormsModule],
})
class WithNgControlComponent {
  items = signal<unknown[]>([]);
  control = new FormControl<unknown>(null);
  comparator?: (a: unknown, b: unknown) => boolean;
}

@Component({
  template: `<div [ngxAutoSelect]="items()"></div>`,
  imports: [AutoSelectDirective],
  providers: [{provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => WithCvaComponent), multi: true}],
})
class WithCvaComponent implements ControlValueAccessor {
  items = signal<string[]>([]);
  value: string | null = null;
  onChange: (v: string) => void = () => undefined;
  writeValue = (v: string) => (this.value = v);
  registerOnChange = (fn: (v: string) => void) => (this.onChange = fn);
  registerOnTouched = () => undefined;
}

describe('AutoSelectDirective', () => {
  describe('with NgControl', () => {
    let fixture: ComponentFixture<WithNgControlComponent>;

    beforeEach(() => {
      fixture = TestBed.createComponent(WithNgControlComponent);
    });

    it('should auto-select when single option is available', () => {
      fixture.componentInstance.items.set(['only']);
      fixture.detectChanges();
      expect(fixture.componentInstance.control.value).toBe('only');
    });

    it('should not auto-select when empty or multiple options are available', () => {
      fixture.componentInstance.items.set([]);
      fixture.detectChanges();
      expect(fixture.componentInstance.control.value).toBeNull();

      fixture.componentInstance.items.set(['first', 'second']);
      fixture.detectChanges();
      expect(fixture.componentInstance.control.value).toBeNull();
    });

    it('should respect custom comparator for object options', () => {
      interface Option {
        id: number;
        name: string;
      }

      fixture.componentInstance.comparator = (a: unknown, b: unknown) => (a as Option)?.id === (b as Option)?.id;

      fixture.componentInstance.control.setValue({id: 1, name: 'Initial'});
      const setValueSpy = vi.spyOn(fixture.componentInstance.control, 'setValue');

      fixture.componentInstance.items.set([{id: 1, name: 'Same ID'}]);
      fixture.detectChanges();

      expect(setValueSpy).not.toHaveBeenCalled();
    });
  });

  describe('with ControlValueAccessor', () => {
    let fixture: ComponentFixture<WithCvaComponent>;

    beforeEach(() => {
      fixture = TestBed.createComponent(WithCvaComponent);
    });

    it('should auto-select and call onChange on CVA', () => {
      const spy = vi.fn();
      fixture.componentInstance.registerOnChange(spy);

      fixture.componentInstance.items.set(['only']);
      fixture.detectChanges();

      expect(fixture.componentInstance.value).toBe('only');
      expect(spy).toHaveBeenCalledWith('only');
    });
  });
});
