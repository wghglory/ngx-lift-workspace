import {signal} from '@angular/core';
import {TestBed} from '@angular/core/testing';
import {AbstractControl, FormControl, FormGroup, Validators} from '@angular/forms';
import {describe, expect, it, vi} from 'vitest';

import {
  bindControlDisabled,
  bindControlIf,
  bindControlValidators,
  revalidateOnChange,
  watchControl,
} from './form-bindings';

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
      const form = new FormGroup<Record<string, AbstractControl>>({});
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
      const form = new FormGroup<Record<string, AbstractControl>>({});
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

  it('should preserve control instances and existing bindings across unmount/remount cycles when preserveValue is true', () => {
    TestBed.runInInjectionContext(() => {
      const form = new FormGroup<Record<string, AbstractControl>>({});
      const isVisible = signal(true);
      const isLocked = signal(false);

      const passwordCtrl = new FormControl('mySecret');
      bindControlIf(form, 'password', isVisible, () => passwordCtrl, {preserveValue: true});
      bindControlDisabled(passwordCtrl, isLocked);

      TestBed.flushEffects();
      expect(form.contains('password')).toBe(true);
      expect(form.get('password')).toBe(passwordCtrl);
      expect(passwordCtrl.enabled).toBe(true);

      // Unmount
      isVisible.set(false);
      TestBed.flushEffects();
      expect(form.contains('password')).toBe(false);

      // Lock while unmounted
      isLocked.set(true);

      // Remount
      isVisible.set(true);
      TestBed.flushEffects();

      expect(form.get('password')).toBe(passwordCtrl);
      expect('password' in form.controls).toBe(true);
      expect(passwordCtrl.disabled).toBe(true);
    });
  });

  it('should reactively watch control value with watchControl', () => {
    TestBed.runInInjectionContext(() => {
      const ctrl = new FormControl('first');
      const history: Array<{val: string | null; prev: string | null | undefined}> = [];

      const effectRef = watchControl(ctrl, (val, prev) => {
        history.push({val, prev});
      });

      TestBed.flushEffects();
      expect(history).toEqual([]);

      ctrl.setValue('second');
      TestBed.flushEffects();

      expect(history).toEqual([{val: 'second', prev: 'first'}]);

      ctrl.setValue('third');
      TestBed.flushEffects();

      expect(history).toEqual([
        {val: 'second', prev: 'first'},
        {val: 'third', prev: 'second'},
      ]);

      effectRef.destroy();
      ctrl.setValue('fourth');
      TestBed.flushEffects();

      expect(history.length).toBe(2);
    });
  });

  it('should support immediate: true when watching a Signal with watchControl', () => {
    TestBed.runInInjectionContext(() => {
      const sig = signal(10);
      const history: number[] = [];

      watchControl(
        sig,
        (val) => {
          history.push(val);
        },
        {immediate: true},
      );

      TestBed.flushEffects();
      expect(history).toEqual([10]);

      sig.set(20);
      TestBed.flushEffects();
      expect(history).toEqual([10, 20]);
    });
  });
});
