import {signal} from '@angular/core';
import {TestBed} from '@angular/core/testing';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {describe, expect, it, vi} from 'vitest';

import {bindControlDisabled, bindControlIf, bindControlValidators, revalidateOnChange} from './form-bindings';

describe('form-bindings utilities', () => {
  it('should dynamically disable and enable control with bindControlDisabled', () => {
    TestBed.runInInjectionContext(() => {
      const ctrl = new FormControl('test');
      const isDisabled = signal(false);

      bindControlDisabled(ctrl, isDisabled);
      TestBed.flushEffects();

      expect(ctrl.enabled).toBe(true);

      isDisabled.set(true);
      TestBed.flushEffects();
      expect(ctrl.disabled).toBe(true);

      isDisabled.set(false);
      TestBed.flushEffects();
      expect(ctrl.enabled).toBe(true);
    });
  });

  it('should reset control value on disable when resetOnDisable is true', () => {
    TestBed.runInInjectionContext(() => {
      const ctrl = new FormControl('initial');
      const isDisabled = signal(false);

      bindControlDisabled(ctrl, isDisabled, {resetOnDisable: true, resetValue: 'fallback'});
      TestBed.flushEffects();

      expect(ctrl.value).toBe('initial');

      isDisabled.set(true);
      TestBed.flushEffects();

      expect(ctrl.disabled).toBe(true);
      expect(ctrl.value).toBe('fallback');
    });
  });

  it('should dynamically update validators with bindControlValidators', () => {
    TestBed.runInInjectionContext(() => {
      const ctrl = new FormControl('');
      const isRequired = signal(false);

      bindControlValidators(ctrl, () => (isRequired() ? [Validators.required] : null));
      TestBed.flushEffects();

      expect(ctrl.valid).toBe(true);

      isRequired.set(true);
      TestBed.flushEffects();

      expect(ctrl.valid).toBe(false);

      ctrl.setValue('filled');
      expect(ctrl.valid).toBe(true);
    });
  });

  it('should mount and unmount controls with bindControlIf in dictionary mode and respect preserveValue', () => {
    TestBed.runInInjectionContext(() => {
      const form = new FormGroup({});
      const isSql = signal(true);
      const factorySpy = vi.fn(() => ({
        password: new FormControl('secret123'),
        confirm: new FormControl('secret123'),
      }));

      bindControlIf(form, isSql, factorySpy, {preserveValue: true});
      TestBed.flushEffects();

      expect(factorySpy).toHaveBeenCalledTimes(1);
      expect(form.contains('password')).toBe(true);
      expect(form.contains('confirm')).toBe(true);
      expect(form.get('password')?.value).toBe('secret123');

      // Update password value before unmounting
      form.get('password')?.setValue('newPassword');

      // Toggle off
      isSql.set(false);
      TestBed.flushEffects();

      expect(form.contains('password')).toBe(false);
      expect(form.contains('confirm')).toBe(false);

      // Toggle on: value should be restored due to preserveValue: true
      isSql.set(true);
      TestBed.flushEffects();

      expect(form.contains('password')).toBe(true);
      expect(form.get('password')?.value).toBe('newPassword');
    });
  });

  it('should mount and unmount single control with bindControlIf in single control mode', () => {
    TestBed.runInInjectionContext(() => {
      const form = new FormGroup({});
      const showSecret = signal(false);

      bindControlIf(form, 'secretField', showSecret, () => new FormControl('mySecret'), {preserveValue: true});
      TestBed.flushEffects();

      expect(form.contains('secretField')).toBe(false);

      showSecret.set(true);
      TestBed.flushEffects();

      expect(form.contains('secretField')).toBe(true);
      expect(form.get('secretField')?.value).toBe('mySecret');

      form.get('secretField')?.setValue('modifiedSecret');

      showSecret.set(false);
      TestBed.flushEffects();
      expect(form.contains('secretField')).toBe(false);

      showSecret.set(true);
      TestBed.flushEffects();
      expect(form.contains('secretField')).toBe(true);
      expect(form.get('secretField')?.value).toBe('modifiedSecret');
    });
  });

  it('should trigger revalidation when source control changes with revalidateOnChange', () => {
    TestBed.runInInjectionContext(() => {
      const password = new FormControl('pass1');
      const confirm = new FormControl('', {
        validators: [(c) => (c.value === password.value ? null : {mismatch: true})],
      });

      const sub = revalidateOnChange(confirm, password);

      confirm.setValue('pass2');
      expect(confirm.errors).toEqual({mismatch: true});

      // Update source: password
      password.setValue('pass2');
      expect(confirm.errors).toBeNull();

      sub.unsubscribe();
    });
  });
});
