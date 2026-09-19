import {signal} from '@angular/core';
import {TestBed} from '@angular/core/testing';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {describe, expect, it, vi} from 'vitest';

import {toSignalForm} from './to-signal-form';

describe('toSignalForm', () => {
  it('should wrap FormGroup and expose reactive controls, fields, and form-level signals', () => {
    TestBed.runInInjectionContext(() => {
      const form = new FormGroup({
        name: new FormControl('Initial', [Validators.required]),
        email: new FormControl('', [Validators.required, Validators.email]),
      });

      const sf = toSignalForm(form);

      expect(sf.valid()).toBe(false);
      expect(sf.invalid()).toBe(true);
      expect(sf.fields.name.value()).toBe('Initial');
      expect(sf.fields.name.valid()).toBe(true);

      // Verify authentic control operations and state
      expect(sf.controls.name.value).toBe(form.controls.name.value);
      expect(sf.controls.name.state.value()).toBe('Initial');

      sf.controls.email.setValue('test@example.com');
      expect(sf.fields.email.value()).toBe('test@example.com');
      expect(sf.fields.email.valid()).toBe(true);
      expect(sf.valid()).toBe(true);
    });
  });

  it('should continuously compute submitValue and respect omit option', () => {
    TestBed.runInInjectionContext(() => {
      const form = new FormGroup({
        username: new FormControl('alice'),
        password: new FormControl('secret123'),
        confirmPassword: new FormControl('secret123'),
      });

      const sf = toSignalForm(form, {
        omit: ['confirmPassword'],
      });

      expect(sf.submitValue()).toEqual({
        username: 'alice',
        password: 'secret123',
      });

      form.controls.username.setValue('bob');
      expect(sf.submitValue()).toEqual({
        username: 'bob',
        password: 'secret123',
      });
    });
  });

  it('should support dynamic controls with bindIf and revalidate on the facade', () => {
    TestBed.runInInjectionContext(() => {
      const form = new FormGroup<{
        authMode: FormControl<string | null>;
        password?: FormControl<string | null>;
        confirmPassword?: FormControl<string | null>;
      }>({
        authMode: new FormControl('windows'),
      });

      const sf = toSignalForm(form);
      const isSql = signal(false);

      sf.bindIf(
        isSql,
        () => ({
          password: new FormControl('', [Validators.required]),
          confirmPassword: new FormControl('', [
            Validators.required,
            (c) => (c.value === form.get('password')?.value ? null : {mismatch: true}),
          ]),
        }),
        {preserveValue: true},
      );

      sf.revalidate('confirmPassword', 'password');

      TestBed.flushEffects();

      expect(sf.hasControl('password')).toBe(false);
      expect(sf.hasControl('confirmPassword')).toBe(false);

      isSql.set(true);
      TestBed.flushEffects();

      expect(sf.hasControl('password')).toBe(true);
      expect(sf.hasControl('confirmPassword')).toBe(true);

      sf.controls.password?.setValue('pass1');
      sf.controls.confirmPassword?.setValue('pass2');
      expect(sf.controls.confirmPassword?.hasError('mismatch')).toBe(true);

      sf.controls.password?.setValue('pass2');
      expect(sf.controls.confirmPassword?.hasError('mismatch')).toBe(false);
    });
  });

  it('should reset form and mark controls pristine/untouched correctly', () => {
    TestBed.runInInjectionContext(() => {
      const form = new FormGroup({
        name: new FormControl('Initial'),
      });

      const sf = toSignalForm(form);

      sf.controls.name.setValue('Dirty');
      sf.controls.name.markAsDirty();
      sf.controls.name.markAsTouched();

      expect(sf.dirty()).toBe(true);
      expect(sf.touched()).toBe(true);

      sf.reset({name: 'ResetName'});

      expect(sf.fields.name.value()).toBe('ResetName');
      expect(sf.pristine()).toBe(true);
      expect(sf.untouched()).toBe(true);
    });
  });

  it('should support passing AbstractControl directly to revalidate', () => {
    TestBed.runInInjectionContext(() => {
      const password = new FormControl('pass1');
      const confirmPassword = new FormControl('', [(c) => (c.value === password.value ? null : {mismatch: true})]);
      const form = new FormGroup({password, confirmPassword});

      const sf = toSignalForm(form);
      sf.revalidate(confirmPassword, password);

      confirmPassword.setValue('pass2');
      expect(confirmPassword.hasError('mismatch')).toBe(true);

      password.setValue('pass2');
      expect(confirmPassword.hasError('mismatch')).toBe(false);
    });
  });

  it('should support in operator, Object.keys, and Symbol inspection safely on controls and fields proxies', () => {
    TestBed.runInInjectionContext(() => {
      const form = new FormGroup({
        title: new FormControl(''),
        count: new FormControl(0),
      });

      const sf = toSignalForm(form);

      expect('title' in sf.controls).toBe(true);
      expect('unknownField' in sf.controls).toBe(false);
      expect(Object.keys(sf.controls)).toEqual(['title', 'count']);

      // Enhanced control proxy reflection traps
      expect('state' in sf.controls.title).toBe(true);
      expect('bindDisabled' in sf.controls.title).toBe(true);
      expect('bindValidators' in sf.controls.title).toBe(true);
      expect('revalidateOn' in sf.controls.title).toBe(true);
      expect(Object.keys(sf.controls.title)).toContain('state');
      expect(Object.getOwnPropertyDescriptor(sf.controls.title, 'state')?.configurable).toBe(true);

      // Symbol property accesses must not throw
      const testSymbol = Symbol('custom');
      expect((sf.controls as Record<string | symbol, unknown>)[testSymbol]).toBeUndefined();
      expect((sf.fields as Record<string | symbol, unknown>)[testSymbol]).toBeUndefined();
    });
  });

  it('should support bindDisabled with string key, AbstractControl, and on enhanced control directly', () => {
    TestBed.runInInjectionContext(() => {
      const isAutoScaling = signal(false);
      const isReplicaLocked = signal(false);
      const isTierLocked = signal(false);

      const form = new FormGroup({
        storageGb: new FormControl(100),
        replicaCount: new FormControl(2),
        tier: new FormControl('standard'),
      });

      const sf = toSignalForm(form);

      // 1. Pass string key with resetOnDisable & resetValue
      sf.bindDisabled('storageGb', isAutoScaling, {
        resetOnDisable: true,
        resetValue: 250,
      });

      // 2. Pass AbstractControl directly
      sf.bindDisabled(sf.controls.replicaCount, isReplicaLocked, {
        resetOnDisable: true,
        resetValue: 5,
      });

      // 3. Call bindDisabled directly on enhanced control
      sf.controls.tier.bindDisabled(isTierLocked, {
        resetOnDisable: true,
        resetValue: 'premium',
      });

      // Compile-time type safety assertions:
      sf.bindDisabled('storageGb', isAutoScaling, {
        resetOnDisable: true,
        // @ts-expect-error - resetValue must be number, not string
        resetValue: 'not-a-number',
      });

      sf.controls.storageGb.bindDisabled(isAutoScaling, {
        resetOnDisable: true,
        // @ts-expect-error - resetValue on enhanced control must be number, not boolean
        resetValue: true,
      });

      TestBed.flushEffects();
      expect(sf.controls.storageGb.enabled).toBe(true);
      expect(sf.controls.storageGb.value).toBe(100);
      expect(sf.controls.replicaCount.enabled).toBe(true);
      expect(sf.controls.replicaCount.value).toBe(2);
      expect(sf.controls.tier.enabled).toBe(true);
      expect(sf.controls.tier.value).toBe('standard');

      // Trigger auto-scaling: storageGb should disable and reset to 250
      isAutoScaling.set(true);
      TestBed.flushEffects();
      expect(sf.controls.storageGb.disabled).toBe(true);
      expect(sf.controls.storageGb.value).toBe(250);

      // Trigger replica locked: replicaCount should disable and reset to 5
      isReplicaLocked.set(true);
      TestBed.flushEffects();
      expect(sf.controls.replicaCount.disabled).toBe(true);
      expect(sf.controls.replicaCount.value).toBe(5);

      // Trigger tier locked: tier should disable and reset to premium
      isTierLocked.set(true);
      TestBed.flushEffects();
      expect(sf.controls.tier.disabled).toBe(true);
      expect(sf.controls.tier.value).toBe('premium');

      // Re-enable
      isAutoScaling.set(false);
      isReplicaLocked.set(false);
      isTierLocked.set(false);
      TestBed.flushEffects();
      expect(sf.controls.storageGb.enabled).toBe(true);
      expect(sf.controls.replicaCount.enabled).toBe(true);
      expect(sf.controls.tier.enabled).toBe(true);
    });
  });

  it('should support bindValidators with string key and AbstractControl instance', () => {
    TestBed.runInInjectionContext(() => {
      const isStrict = signal(false);
      const form = new FormGroup({
        name: new FormControl(''),
        code: new FormControl(''),
      });

      const sf = toSignalForm(form);

      // 1. String key
      sf.bindValidators('name', () => (isStrict() ? [Validators.required, Validators.minLength(5)] : null));

      // 2. AbstractControl instance
      sf.bindValidators(sf.controls.code, () => (isStrict() ? [Validators.required] : null));

      TestBed.flushEffects();
      expect(sf.fields.name.valid()).toBe(true);
      expect(sf.fields.code.valid()).toBe(true);

      isStrict.set(true);
      TestBed.flushEffects();
      expect(sf.fields.name.invalid()).toBe(true);
      expect(sf.fields.code.invalid()).toBe(true);

      sf.controls.name.setValue('validName');
      sf.controls.code.setValue('123');
      expect(sf.fields.name.valid()).toBe(true);
      expect(sf.fields.code.valid()).toBe(true);
    });
  });

  it('should support getter function () => boolean as condition for bindDisabled and bindIf', () => {
    TestBed.runInInjectionContext(() => {
      const isFeatureEnabled = signal(false);
      const isLocked = signal(false);

      const form = new FormGroup<{
        name: FormControl<string | null>;
        settings: FormControl<string | null>;
        extraParam?: FormControl<string | null>;
      }>({
        name: new FormControl(''),
        settings: new FormControl('default'),
      });

      const sf = toSignalForm(form);

      // bindDisabled with getter function
      sf.bindDisabled('settings', () => isLocked(), {
        resetOnDisable: true,
        resetValue: 'locked-default',
      });

      // bindIf with getter function
      sf.bindIf(
        () => isFeatureEnabled(),
        () => ({
          extraParam: new FormControl('extraVal'),
        }),
      );

      TestBed.flushEffects();
      expect(sf.controls.settings.enabled).toBe(true);
      expect(sf.hasControl('extraParam')).toBe(false);

      // Toggle getter conditions
      isLocked.set(true);
      isFeatureEnabled.set(true);
      TestBed.flushEffects();

      expect(sf.controls.settings.disabled).toBe(true);
      expect(sf.controls.settings.value).toBe('locked-default');
      expect(sf.hasControl('extraParam')).toBe(true);
      expect(sf.controls.extraParam?.value).toBe('extraVal');
    });
  });

  it('should update form-level and field-level signals on markAllAsTouched, markAsPristine, and markAsUntouched', () => {
    TestBed.runInInjectionContext(() => {
      const form = new FormGroup({
        name: new FormControl('initial'),
        age: new FormControl(25),
      });

      const sf = toSignalForm(form);

      expect(sf.touched()).toBe(false);
      expect(sf.untouched()).toBe(true);

      sf.markAllAsTouched();
      expect(sf.touched()).toBe(true);
      expect(sf.untouched()).toBe(false);
      expect(sf.fields.name.touched()).toBe(true);
      expect(sf.fields.age.touched()).toBe(true);

      sf.controls.name.markAsDirty();
      expect(sf.dirty()).toBe(true);
      expect(sf.pristine()).toBe(false);

      sf.markAsPristine();
      expect(sf.dirty()).toBe(false);
      expect(sf.pristine()).toBe(true);

      sf.markAsUntouched();
      expect(sf.touched()).toBe(false);
      expect(sf.untouched()).toBe(true);
    });
  });

  it('should bindDisabled on dynamically mounted controls without throwing before control is added', () => {
    TestBed.runInInjectionContext(() => {
      const isSql = signal(false);
      const isPasswordLocked = signal(true);
      const form = new FormGroup<{
        password?: FormControl<string | null>;
      }>({});

      const sf = toSignalForm(form);

      // Register binding BEFORE control is mounted: should not throw!
      expect(() => {
        sf.bindDisabled('password', isPasswordLocked);
      }).not.toThrow();

      sf.bindIf(
        isSql,
        () => ({
          password: new FormControl('initialPass'),
        }),
        {preserveValue: true},
      );

      TestBed.flushEffects();
      expect(sf.hasControl('password')).toBe(false);

      // Mount control: password should immediately be disabled because isPasswordLocked is true
      isSql.set(true);
      TestBed.flushEffects();

      expect(sf.hasControl('password')).toBe(true);
      expect(sf.controls.password?.disabled).toBe(true);

      // Unlock password
      isPasswordLocked.set(false);
      TestBed.flushEffects();
      expect(sf.controls.password?.enabled).toBe(true);
    });
  });

  it('should not trigger target revalidation on unrelated control changes when source control is not mounted', () => {
    TestBed.runInInjectionContext(() => {
      const form = new FormGroup<{
        name: FormControl<string>;
        target?: FormControl<string>;
      }>({
        name: new FormControl('John', {nonNullable: true}),
      });

      const sf = toSignalForm(form);
      const validatorSpy = vi.fn((ctrl: FormControl) => (ctrl.value === 'bad' ? {bad: true} : null));

      (form as FormGroup).addControl('target', new FormControl('good', [validatorSpy as never]));

      // Revalidate target on dynamic source 'secret' which does NOT exist in form yet
      sf.revalidate('target', 'secret');

      validatorSpy.mockClear();

      // Changing unrelated control 'name' should NOT trigger target revalidation
      sf.controls.name.setValue('Jane');
      expect(validatorSpy).not.toHaveBeenCalled();
    });
  });

  it('should reactively watch control value changes via sf.watch and safely update another control', () => {
    TestBed.runInInjectionContext(() => {
      const form = new FormGroup({
        engine: new FormControl(''),
        version: new FormControl(''),
      });

      const sf = toSignalForm(form);
      const engineHistory: string[] = [];

      sf.watch('engine', (newVal) => {
        engineHistory.push(newVal as string);
        // Safe cascading write outside tracking context
        sf.controls.version.setValue(`v-${newVal}`);
      });

      TestBed.flushEffects();
      // Should not trigger on initial run with default immediate: false
      expect(engineHistory).toEqual([]);
      expect(sf.controls.version.value).toBe('');

      // Change engine
      sf.controls.engine.setValue('postgres');
      TestBed.flushEffects();

      expect(engineHistory).toEqual(['postgres']);
      expect(sf.controls.version.value).toBe('v-postgres');

      // Change engine again
      sf.controls.engine.setValue('mysql');
      TestBed.flushEffects();

      expect(engineHistory).toEqual(['postgres', 'mysql']);
      expect(sf.controls.version.value).toBe('v-mysql');
    });
  });

  it('should support sf.watch with immediate: true and enhanced control .watch()', () => {
    TestBed.runInInjectionContext(() => {
      const form = new FormGroup({
        tier: new FormControl('standard'),
      });

      const sf = toSignalForm(form);
      const immediateHistory: unknown[] = [];
      const controlProxyHistory: unknown[] = [];

      sf.watch(
        'tier',
        (val) => {
          immediateHistory.push(val);
        },
        {immediate: true},
      );

      sf.controls.tier.watch((val) => {
        controlProxyHistory.push(val);
      });

      TestBed.flushEffects();
      // immediate: true triggers on initial run
      expect(immediateHistory).toEqual(['standard']);
      expect(controlProxyHistory).toEqual([]);

      // Update value
      sf.controls.tier.setValue('enterprise');
      TestBed.flushEffects();

      expect(immediateHistory).toEqual(['standard', 'enterprise']);
      expect(controlProxyHistory).toEqual(['enterprise']);
    });
  });
});
