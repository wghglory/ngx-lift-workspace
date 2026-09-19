import {TestBed} from '@angular/core/testing';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {describe, expect, it} from 'vitest';

import {controlState, controlStatus, controlValue, formState} from './form-signals';

describe('form-signals utilities', () => {
  it('should return reactive controlValue signal', () => {
    TestBed.runInInjectionContext(() => {
      const ctrl = new FormControl('initial');
      const valSig = controlValue(ctrl);

      expect(valSig()).toBe('initial');

      ctrl.setValue('updated');
      expect(valSig()).toBe('updated');
    });
  });

  it('should return reactive controlStatus signal', () => {
    TestBed.runInInjectionContext(() => {
      const ctrl = new FormControl('', [Validators.required]);
      const statusSig = controlStatus(ctrl);

      expect(statusSig()).toBe('INVALID');

      ctrl.setValue('valid-val');
      expect(statusSig()).toBe('VALID');
    });
  });

  it('should return complete controlState bundle', () => {
    TestBed.runInInjectionContext(() => {
      const ctrl = new FormControl('', [Validators.required]);
      const state = controlState(ctrl);

      expect(state.value()).toBe('');
      expect(state.valid()).toBe(false);
      expect(state.invalid()).toBe(true);
      expect(state.pristine()).toBe(true);
      expect(state.dirty()).toBe(false);
      expect(state.untouched()).toBe(true);
      expect(state.touched()).toBe(false);
      expect(state.enabled()).toBe(true);
      expect(state.disabled()).toBe(false);
      expect(state.errors()).toEqual({required: true});

      ctrl.setValue('hello');
      ctrl.markAsDirty();
      ctrl.markAsTouched();

      expect(state.value()).toBe('hello');
      expect(state.valid()).toBe(true);
      expect(state.invalid()).toBe(false);
      expect(state.dirty()).toBe(true);
      expect(state.pristine()).toBe(false);
      expect(state.touched()).toBe(true);
      expect(state.untouched()).toBe(false);
      expect(state.errors()).toBeNull();
    });
  });

  it('should return formState bundle including rawValue that preserves disabled controls', () => {
    TestBed.runInInjectionContext(() => {
      const form = new FormGroup({
        active: new FormControl('activeVal'),
        disabledCtrl: new FormControl('secretVal'),
      });

      form.controls.disabledCtrl.disable();

      const fState = formState(form);

      // form.value omits disabled controls
      expect(fState.value()).toEqual({active: 'activeVal'});
      // form.rawValue preserves disabled controls
      expect(fState.rawValue()).toEqual({active: 'activeVal', disabledCtrl: 'secretVal'});

      form.controls.active.setValue('newActive');
      expect(fState.value()).toEqual({active: 'newActive'});
      expect(fState.rawValue()).toEqual({active: 'newActive', disabledCtrl: 'secretVal'});
    });
  });

  it('should not drop legitimate asynchronous emissions that match initialValue', () => {
    TestBed.runInInjectionContext(() => {
      const ctrl = new FormControl('init');
      const valSig = controlValue(ctrl);

      expect(valSig()).toBe('init');

      // Silently update value without emitting events:
      ctrl.setValue('silent', {emitEvent: false});
      expect(ctrl.value).toBe('silent');
      expect(valSig()).toBe('init');

      // First asynchronous emission restores value back to 'init':
      ctrl.setValue('init', {emitEvent: true});
      expect(valSig()).toBe('init');

      // Update to 'next' should be processed cleanly:
      ctrl.setValue('next', {emitEvent: true});
      expect(valSig()).toBe('next');
    });
  });
});
