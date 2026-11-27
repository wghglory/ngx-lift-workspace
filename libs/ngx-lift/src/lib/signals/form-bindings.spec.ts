import {createEnvironmentInjector, effect, EnvironmentInjector, signal} from '@angular/core';
import {TestBed} from '@angular/core/testing';
import {AbstractControl, FormControl, FormGroup, ValidatorFn, Validators} from '@angular/forms';
import {Subject} from 'rxjs';
import {describe, expect, it, vi} from 'vitest';

import {
  bindControlDisabled,
  bindControlIf,
  bindControlValidators,
  revalidateOnChange,
  resolveValidators,
  watchControl,
} from './form-bindings';
import {toSignalForm} from './to-signal-form';

describe('form-bindings utilities', () => {
  it('preserves the public one-argument validator resolver', () => {
    const validators = [Validators.required];
    expect(resolveValidators(null)).toBeNull();
    expect(resolveValidators(validators)).toBe(validators);
    expect(resolveValidators(() => null)).toBeNull();
    expect(resolveValidators(() => Validators.required)).toBe(Validators.required);
    expect(resolveValidators(() => validators)).toBe(validators);
    const banned: ValidatorFn = () => ({banned: true});
    expect(resolveValidators(banned)).toBe(banned);
    const selected = signal<ValidatorFn | null>(Validators.required);
    const snapshot = resolveValidators(() => selected());
    selected.set(null);
    expect(snapshot).toBe(Validators.required);
    expect(resolveValidators(() => selected())).toBeNull();
  });

  it.each([false, true])('freezes a nullable getter policy after manual disposal (strict: %s)', (strictInitially) => {
    TestBed.runInInjectionContext(() => {
      const control = new FormControl('');
      const strict = signal(strictInitially);
      const getter = vi.fn(() => (strict() ? Validators.required : null));
      const binding = bindControlValidators(control, getter);
      TestBed.flushEffects();
      const installed = control.validator;
      binding.destroy();
      const reads = getter.mock.calls.length;
      strict.set(!strictInitially);
      control.setValue('');
      installed?.(control);
      TestBed.flushEffects();
      expect(control.hasError('required')).toBe(strictInitially);
      expect(getter).toHaveBeenCalledTimes(reads);
    });
  });

  it('stops reading a validator getter when its injector is destroyed', () => {
    const owner = createEnvironmentInjector([], TestBed.inject(EnvironmentInjector));
    const control = new FormControl('');
    const strict = signal(false);
    const getter = vi.fn(() => (strict() ? Validators.required : null));
    bindControlValidators(control, getter, {injector: owner});
    TestBed.flushEffects();
    owner.destroy();
    const reads = getter.mock.calls.length;
    strict.set(true);
    control.updateValueAndValidity();
    expect(control.valid).toBe(true);
    expect(getter).toHaveBeenCalledTimes(reads);
  });

  it('freezes named facade getter policies when a binding is destroyed', () => {
    TestBed.runInInjectionContext(() => {
      const form = new FormGroup({name: new FormControl('')});
      const facade = toSignalForm(form);
      const strict = signal(true);
      const getter = vi.fn(() => (strict() ? [Validators.required] : null));
      const binding = facade.bindValidators('name', getter);
      TestBed.flushEffects();
      binding.destroy();
      const reads = getter.mock.calls.length;
      strict.set(false);
      form.controls.name.updateValueAndValidity();
      expect(form.controls.name.hasError('required')).toBe(true);
      expect(getter).toHaveBeenCalledTimes(reads);
    });
  });

  it('does not overwrite a newer validator binding when the old one is destroyed', () => {
    TestBed.runInInjectionContext(() => {
      const control = new FormControl('');
      const old = bindControlValidators(control, () => null);
      TestBed.flushEffects();
      bindControlValidators(control, [Validators.required]);
      TestBed.flushEffects();
      old.destroy();
      control.updateValueAndValidity();
      expect(control.hasValidator(Validators.required)).toBe(true);
      expect(control.hasError('required')).toBe(true);
    });
  });

  it('retains ordinary validation after a callback has identified itself as a validator', () => {
    TestBed.runInInjectionContext(() => {
      const control = new FormControl('allowed');
      const validator: ValidatorFn = () => (control.value === 'blocked' ? {blocked: true} : null);
      const binding = bindControlValidators(control, validator);
      TestBed.flushEffects();
      control.setValue('blocked');
      expect(control.hasError('blocked')).toBe(true);
      binding.destroy();
      control.setValue('allowed');
      expect(control.valid).toBe(true);
      control.setValue('blocked');
      expect(control.hasError('blocked')).toBe(true);
    });
  });

  it('preserves unrelated validators added while the binding is active', () => {
    TestBed.runInInjectionContext(() => {
      const control = new FormControl('');
      const binding = bindControlValidators(control, () => null);
      TestBed.flushEffects();
      control.addValidators(Validators.required);
      binding.destroy();
      control.updateValueAndValidity();
      expect(control.hasValidator(Validators.required)).toBe(true);
      expect(control.hasError('required')).toBe(true);
    });
  });

  it.each(['standalone', 'facade'] as const)(
    'preserves shared-key error precedence when a %s binding is destroyed',
    (surface) => {
      TestBed.runInInjectionContext(() => {
        const control = new FormControl('a');
        const ownMinimum = Validators.minLength(4);
        const addedMinimum = Validators.minLength(8);
        const policy = signal<ValidatorFn | null>(ownMinimum);
        const getter = vi.fn(() => policy());
        const binding =
          surface === 'standalone'
            ? bindControlValidators(control, getter)
            : toSignalForm(new FormGroup({name: control})).bindValidators('name', getter);
        TestBed.flushEffects();
        control.addValidators(addedMinimum);
        control.updateValueAndValidity();
        expect(control.getError('minlength').requiredLength).toBe(8);
        const compiled = control.validator;
        binding.destroy();
        const reads = getter.mock.calls.length;
        policy.set(Validators.minLength(12));
        control.updateValueAndValidity();
        expect(control.getError('minlength').requiredLength).toBe(8);
        expect(control.validator).toBe(compiled);
        expect(compiled?.(control)?.['minlength'].requiredLength).toBe(8);
        control.removeValidators(addedMinimum);
        control.updateValueAndValidity();
        expect(control.getError('minlength').requiredLength).toBe(4);
        expect(getter).toHaveBeenCalledTimes(reads);
      });
    },
  );

  it('does not add policy getter dependencies to an effect that validates a control', () => {
    TestBed.runInInjectionContext(() => {
      const control = new FormControl('');
      const strict = signal(false);
      bindControlValidators(control, () => (strict() ? Validators.required : null));
      const applicationEffect = vi.fn();
      effect(() => {
        applicationEffect();
        control.setValue('value');
      });
      TestBed.flushEffects();
      expect(applicationEffect).toHaveBeenCalledTimes(1);
      strict.set(true);
      TestBed.flushEffects();
      expect(applicationEffect).toHaveBeenCalledTimes(1);
      control.setValue('');
      expect(control.hasError('required')).toBe(true);
    });
  });

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

  it('settles a source group with mixed nested and external targets', () => {
    TestBed.runInInjectionContext(() => {
      const street = new FormControl('');
      const zip = new FormControl('');
      const address = new FormGroup({street, zip});
      const deliveryNote = new FormControl('');
      const result = new Subject<null>();
      address.setAsyncValidators(() => result);
      const binding = revalidateOnChange([zip, deliveryNote], address);
      let zipRuns = 0;
      zip.setValidators(() => {
        if (++zipRuns === 6) binding.unsubscribe();
        return null;
      });

      street.setValue('First Street');
      result.next(null);
      result.next(null);
      expect(zipRuns).toBe(2);
      expect(address.status).toBe('VALID');
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

  it('should accept a direct ValidatorFn or array of ValidatorFn in bindControlValidators without crashing', () => {
    TestBed.runInInjectionContext(() => {
      const ctrl = new FormControl('');

      // Passing standard ValidatorFn directly (length === 1)
      bindControlValidators(ctrl, Validators.required);
      TestBed.flushEffects();

      expect(ctrl.valid).toBe(false);
      expect(ctrl.hasError('required')).toBe(true);

      ctrl.setValue('valid text');
      expect(ctrl.valid).toBe(true);

      // Passing array of ValidatorFn
      bindControlValidators(ctrl, [Validators.required, Validators.minLength(5)]);
      TestBed.flushEffects();

      ctrl.setValue('abc');
      expect(ctrl.valid).toBe(false);
      expect(ctrl.hasError('minlength')).toBe(true);

      // Clearing validators with null
      bindControlValidators(ctrl, null);
      TestBed.flushEffects();
      expect(ctrl.valid).toBe(true);
    });
  });

  it('should return an EffectRef from bindControlDisabled and bindControlIf allowing early manual teardown', () => {
    TestBed.runInInjectionContext(() => {
      const ctrl = new FormControl('test');
      const isDisabled = signal(false);
      const disableRef = bindControlDisabled(ctrl, isDisabled);
      TestBed.flushEffects();
      expect(ctrl.enabled).toBe(true);

      isDisabled.set(true);
      TestBed.flushEffects();
      expect(ctrl.disabled).toBe(true);

      // Early teardown
      disableRef.destroy();
      isDisabled.set(false);
      TestBed.flushEffects();
      // Should remain disabled because the effect was destroyed
      expect(ctrl.disabled).toBe(true);

      const form = new FormGroup<{dynamic?: FormControl<string | null>}>({});
      const isMounted = signal(true);
      const ifRef = bindControlIf(form, 'dynamic', isMounted, () => new FormControl('hello'));
      TestBed.flushEffects();
      expect(form.controls.dynamic).toBeDefined();

      ifRef.destroy();
      isMounted.set(false);
      TestBed.flushEffects();
      // Should remain mounted because effect was destroyed
      expect(form.controls.dynamic).toBeDefined();
    });
  });

  it('should preserve disabled child controls in nested FormGroup when preserveValue is true', () => {
    TestBed.runInInjectionContext(() => {
      const parent = new FormGroup<Record<string, AbstractControl>>({});
      const isVisible = signal(true);

      bindControlIf(
        parent,
        'credentials',
        isVisible,
        () => {
          const group = new FormGroup({
            username: new FormControl('admin'),
            apiKey: new FormControl('key-123'),
          });
          group.controls.apiKey.disable();
          return group;
        },
        {preserveValue: true},
      );

      TestBed.flushEffects();
      const mountedGroup = parent.get('credentials') as FormGroup;
      expect(mountedGroup).toBeDefined();
      expect(mountedGroup.getRawValue()).toEqual({username: 'admin', apiKey: 'key-123'});

      // Unmount
      isVisible.set(false);
      TestBed.flushEffects();
      expect(parent.contains('credentials')).toBe(false);

      // Remount
      isVisible.set(true);
      TestBed.flushEffects();
      const remountedGroup = parent.get('credentials') as FormGroup;
      expect(remountedGroup).toBeDefined();
      expect(remountedGroup.getRawValue()).toEqual({username: 'admin', apiKey: 'key-123'});
    });
  });

  it('should support custom equal comparator in watchControl', () => {
    TestBed.runInInjectionContext(() => {
      const sig = signal({id: 1, name: 'Alice'});
      const history: Array<{id: number; name: string}> = [];

      watchControl(
        sig,
        (val) => {
          history.push(val);
        },
        {
          equal: (prev, curr) => prev.id === curr.id && prev.name === curr.name,
        },
      );

      TestBed.flushEffects();
      expect(history).toEqual([]);

      // Set new object reference with identical content: equal returns true -> callback skipped
      sig.set({id: 1, name: 'Alice'});
      TestBed.flushEffects();
      expect(history).toEqual([]);

      // Set different content: equal returns false -> callback invoked
      sig.set({id: 2, name: 'Bob'});
      TestBed.flushEffects();
      expect(history).toEqual([{id: 2, name: 'Bob'}]);
    });
  });

  it('treats a zero-argument constant-error validator as a validator, not a getter', () => {
    TestBed.runInInjectionContext(() => {
      const control = new FormControl('');
      const banned: ValidatorFn = () => ({banned: true});
      bindControlValidators(control, banned);
      TestBed.flushEffects();
      expect(control.hasError('banned')).toBe(true);
      control.setValidators(null);
    });
  });

  it('retains an initially valid zero-argument validator passed in an array', () => {
    TestBed.runInInjectionContext(() => {
      const control = new FormControl('value');
      let blocked = false;
      const validator: ValidatorFn = () => (blocked ? {blocked: true} : null);
      bindControlValidators(control, [validator]);
      TestBed.flushEffects();
      expect(control.hasValidator(validator)).toBe(true);
      expect(control.valid).toBe(true);
      blocked = true;
      control.updateValueAndValidity();
      expect(control.hasError('blocked')).toBe(true);
      blocked = false;
      control.updateValueAndValidity();
      expect(control.valid).toBe(true);
    });
  });

  it('preserves null-clearing and reactive validator getter behavior', () => {
    TestBed.runInInjectionContext(() => {
      const control = new FormControl('value');
      const noop: ValidatorFn = () => null;
      bindControlValidators(control, noop);
      TestBed.flushEffects();
      expect(control.valid).toBe(true);

      const strict = signal(false);
      bindControlValidators(control, () => (strict() ? Validators.required : null));
      TestBed.flushEffects();
      expect(control.valid).toBe(true);
      control.setValue('');
      strict.set(true);
      TestBed.flushEffects();
      expect(control.hasError('required')).toBe(true);
    });
  });

  it('retains an initially-null bare validator across ordinary revalidation', () => {
    TestBed.runInInjectionContext(() => {
      const control = new FormControl('value');
      let blocked = false;
      const validator: ValidatorFn = () => (blocked ? {blocked: true} : null);
      bindControlValidators(control, validator);
      TestBed.flushEffects();
      expect(control.valid).toBe(true);
      blocked = true;
      control.updateValueAndValidity();
      expect(control.hasError('blocked')).toBe(true);
      blocked = false;
      control.updateValueAndValidity();
      expect(control.valid).toBe(true);
    });
  });

  it('evaluates the current nullable getter result during validation before its effect flushes', () => {
    TestBed.runInInjectionContext(() => {
      const control = new FormControl('', Validators.pattern(/^x/));
      const strict = signal(false);
      bindControlValidators(control, () => (strict() ? [Validators.required, Validators.minLength(3)] : null));
      TestBed.flushEffects();
      expect(control.valid).toBe(true);
      strict.set(true);
      control.updateValueAndValidity();
      expect(control.hasError('required')).toBe(true);
      control.setValue('ab');
      expect(control.hasError('minlength')).toBe(true);
      strict.set(false);
      control.updateValueAndValidity();
      expect(control.valid).toBe(true);
      TestBed.flushEffects();
      expect(control.valid).toBe(true);
    });
  });

  it('retains initially-null validators through named and enhanced facade bindings', () => {
    TestBed.runInInjectionContext(() => {
      const form = new FormGroup({name: new FormControl(''), code: new FormControl('')});
      const facade = toSignalForm(form);
      let blocked = false;
      const validator: ValidatorFn = () => (blocked ? {blocked: true} : null);
      facade.bindValidators('name', validator);
      facade.controls.code.bindValidators(validator);
      TestBed.flushEffects();
      expect(form.valid).toBe(true);
      blocked = true;
      form.controls.name.updateValueAndValidity();
      form.controls.code.updateValueAndValidity();
      expect(form.controls.name.hasError('blocked')).toBe(true);
      expect(form.controls.code.hasError('blocked')).toBe(true);
      blocked = false;
      form.controls.name.updateValueAndValidity();
      form.controls.code.updateValueAndValidity();
      expect(form.valid).toBe(true);
    });
  });

  it('supplies the real control to a validator with a default parameter', () => {
    TestBed.runInInjectionContext(() => {
      const control = new FormControl('allowed');
      const validator: ValidatorFn = (target = control) => (target.value === 'blocked' ? {blocked: true} : null);
      bindControlValidators(control, validator);
      TestBed.flushEffects();
      expect(control.valid).toBe(true);
      control.setValue('blocked');
      expect(control.hasError('blocked')).toBe(true);
    });
  });

  it('retains reactive dependencies of an initially-null bare validator', () => {
    TestBed.runInInjectionContext(() => {
      const control = new FormControl('');
      const blocked = signal(false);
      const validator: ValidatorFn = () => (blocked() ? {blocked: true} : null);
      bindControlValidators(control, validator);
      TestBed.flushEffects();
      expect(control.valid).toBe(true);
      blocked.set(true);
      TestBed.flushEffects();
      expect(control.hasError('blocked')).toBe(true);
      blocked.set(false);
      TestBed.flushEffects();
      expect(control.valid).toBe(true);
    });
  });
});
