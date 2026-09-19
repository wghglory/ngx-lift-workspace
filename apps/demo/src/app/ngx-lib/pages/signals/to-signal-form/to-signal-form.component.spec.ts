import {provideNoopAnimations} from '@angular/platform-browser/animations';
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {provideRouter} from '@angular/router';
import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest';

import {ToSignalFormComponent} from './to-signal-form.component';

describe('ToSignalFormComponent', () => {
  let component: ToSignalFormComponent;
  let fixture: ComponentFixture<ToSignalFormComponent>;

  beforeEach(async () => {
    vi.useFakeTimers();
    await TestBed.configureTestingModule({
      imports: [ToSignalFormComponent],
      providers: [provideRouter([]), provideNoopAnimations()],
    }).compileComponents();

    fixture = TestBed.createComponent(ToSignalFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should filter versions reactively when engine changes', () => {
    expect(component.engine()).toBe('');
    expect(component.availableVersions()).toEqual([]);
    expect(component.form.controls.version.value).toBe('');

    component.form.controls.engine.setValue('mysql');
    fixture.detectChanges();

    expect(component.engine()).toBe('mysql');
    expect(component.availableVersions()).toEqual(['MySQL 8.4.0 LTS', 'MySQL 8.0.36']);
    expect(component.form.controls.version.value).toBe('MySQL 8.4.0 LTS');
  });

  it('should disable storage and reset to 250 GB when autoScaling is enabled', () => {
    expect(component.form.controls.storageGb.enabled).toBe(true);
    expect(component.form.controls.storageGb.value).toBe('');

    component.form.controls.autoScaling.setValue(true);
    fixture.detectChanges();

    expect(component.form.controls.storageGb.disabled).toBe(true);
    expect(component.form.controls.storageGb.value).toBe(250);

    // Disable autoScaling -> storageGb is re-enabled
    component.form.controls.autoScaling.setValue(false);
    fixture.detectChanges();

    expect(component.form.controls.storageGb.enabled).toBe(true);
  });

  it('should dynamically mount tlsCertificate and preserve value across toggles', () => {
    expect(component.sf.controls.tlsCertificate).toBeUndefined();

    component.form.controls.certType.setValue('custom');
    fixture.detectChanges();

    expect(component.sf.controls.tlsCertificate).toBeDefined();

    component.form.controls.tlsCertificate?.setValue('-----BEGIN MY CERTIFICATE-----');

    component.form.controls.certType.setValue('managed');
    fixture.detectChanges();

    expect(component.sf.controls.tlsCertificate).toBeUndefined();

    component.form.controls.certType.setValue('custom');
    fixture.detectChanges();

    expect(component.sf.controls.tlsCertificate).toBeDefined();
    expect(component.form.controls.tlsCertificate?.value).toBe('-----BEGIN MY CERTIFICATE-----');
  });

  it('should preserve disabled storageGb in rawValue', () => {
    component.form.controls.autoScaling.setValue(true);
    fixture.detectChanges();

    const raw = component.sf.rawValue() as {storageGb: number; autoScaling: boolean};
    expect(raw.autoScaling).toBe(true);
    expect(raw.storageGb).toBe(250);
  });

  it('should validate cross-control password match and revalidate automatically on password change', () => {
    component.form.controls.authMode.setValue('sql');
    fixture.detectChanges();

    // Controls mounted dynamically via bindIf
    expect(component.sf.hasControl('password')).toBe(true);
    expect(component.sf.hasControl('confirmPassword')).toBe(true);

    // Mismatched password and confirmPassword:
    component.sf.controls.password?.setValue('fdsafsaf');
    component.sf.controls.confirmPassword?.setValue('fdf');
    fixture.detectChanges();

    expect(component.sf.controls.confirmPassword?.valid).toBe(false);
    expect(component.sf.controls.confirmPassword?.errors).toEqual({passwordMismatch: true});
    expect(component.sf.invalid()).toBe(true);

    // Matching confirmPassword:
    component.sf.controls.confirmPassword?.setValue('fdsafsaf');
    fixture.detectChanges();

    expect(component.sf.controls.confirmPassword?.valid).toBe(true);
    expect(component.sf.controls.confirmPassword?.errors).toBeNull();

    // Password changed afterwards -> confirmPassword revalidates automatically via sf.revalidate
    component.sf.controls.password?.setValue('changedPassword123');
    fixture.detectChanges();

    expect(component.sf.controls.confirmPassword?.valid).toBe(false);
    expect(component.sf.controls.confirmPassword?.errors).toEqual({passwordMismatch: true});
    expect(component.sf.invalid()).toBe(true);
  });

  it('should detach password and confirmPassword when switched to Windows authentication', () => {
    component.form.controls.authMode.setValue('sql');
    fixture.detectChanges();

    expect(component.sf.hasControl('password')).toBe(true);

    // Switch to windows: controls are unmounted, form is valid
    component.form.controls.authMode.setValue('windows');
    fixture.detectChanges();

    expect(component.sf.hasControl('password')).toBe(false);
    expect(component.sf.hasControl('confirmPassword')).toBe(false);
  });

  it('should dynamically mount and unmount Multi-Zone HA controls based on computedAsync regional capability', async () => {
    // Initially no region -> isMultiZoneSupported is false -> haTopology not mounted
    expect(component.sf.controls.haTopology).toBeUndefined();

    // Select us-west-1: supports Multi-AZ
    component.form.controls.region.setValue('us-west-1');
    fixture.detectChanges();
    await vi.advanceTimersByTimeAsync(300);
    fixture.detectChanges();

    expect(component.isMultiZoneSupported()).toBe(true);
    expect(component.sf.controls.haTopology).toBeDefined();
    expect(component.sf.controls.replicaCount).toBeDefined();

    // Verify initially unselected ('') and invalid until user selects
    expect(component.form.controls.haTopology?.value).toBe('');
    expect(component.form.controls.haTopology?.valid).toBe(false);

    // Set HA values via strongly typed dot notation
    component.form.controls.haTopology?.setValue('dedicated-host');
    component.form.controls.replicaCount?.setValue(4);
    fixture.detectChanges();

    expect(component.form.controls.haTopology?.valid).toBe(true);

    // Switch to eu-central-1: Single-Zone only
    component.form.controls.region.setValue('eu-central-1');
    fixture.detectChanges();
    await vi.advanceTimersByTimeAsync(300);
    fixture.detectChanges();

    expect(component.isMultiZoneSupported()).toBe(false);
    expect(component.sf.controls.haTopology).toBeUndefined();
    expect(component.sf.controls.replicaCount).toBeUndefined();

    // Switch back to us-west-1: controls remounted with preserved values!
    component.form.controls.region.setValue('us-west-1');
    fixture.detectChanges();
    await vi.advanceTimersByTimeAsync(300);
    fixture.detectChanges();

    expect(component.isMultiZoneSupported()).toBe(true);
    expect(component.sf.controls.haTopology).toBeDefined();
    expect(component.sf.controls.replicaCount).toBeDefined();
    expect(component.form.controls.haTopology?.value).toBe('dedicated-host');
    expect(component.form.controls.replicaCount?.value).toBe(4);
  });

  it('should omit password and confirmPassword from submitted payload when authMode is windows', async () => {
    component.form.controls.region.setValue('us-west-1');
    component.form.controls.engine.setValue('postgres');
    component.form.controls.version.setValue('PostgreSQL 16.2');
    component.form.controls.certType.setValue('managed');
    component.form.controls.storageGb.setValue(100);
    component.form.controls.clusterName.setValue('prod-cluster');
    component.form.controls.authMode.setValue('windows');
    component.form.controls.autoScaling.setValue(true);
    fixture.detectChanges();

    // Trigger submission via lazy resourceAsync:
    component.onSubmit();
    expect(component.createClusterRef.isLoading()).toBe(true);

    // Fast-forward 1-second simulated network delay:
    await vi.advanceTimersByTimeAsync(1000);
    fixture.detectChanges();

    expect(component.createClusterRef.isLoading()).toBe(false);
    const result = component.createClusterRef.value();
    expect(result).toBeDefined();
    expect(result?.status).toBe('PROVISIONING');

    const submitted = result?.payload as Record<string, unknown>;
    expect(submitted).toBeDefined();
    // confirmPassword is an internal UI helper and should be excluded
    expect('confirmPassword' in submitted).toBe(false);
    // password should be omitted when authMode is windows because it's detached
    expect('password' in submitted).toBe(false);
    // disabled storageGb (250) should be preserved
    expect(submitted['storageGb']).toBe(250);
    expect(submitted['autoScaling']).toBe(true);
    expect(submitted['clusterName']).toBe('prod-cluster');
    expect(submitted['authMode']).toBe('windows');
    expect(submitted['region']).toBe('us-west-1');
  });

  it('should include password but exclude confirmPassword when authMode is sql', async () => {
    component.form.controls.region.setValue('us-west-1');
    component.form.controls.engine.setValue('postgres');
    component.form.controls.version.setValue('PostgreSQL 16.2');
    component.form.controls.certType.setValue('managed');
    component.form.controls.storageGb.setValue(100);
    component.form.controls.clusterName.setValue('sql-cluster');
    component.form.controls.authMode.setValue('sql');
    fixture.detectChanges();

    component.sf.controls.password?.setValue('ValidPass123!');
    component.sf.controls.confirmPassword?.setValue('ValidPass123!');
    fixture.detectChanges();

    component.onSubmit();
    expect(component.createClusterRef.isLoading()).toBe(true);

    await vi.advanceTimersByTimeAsync(1000);
    fixture.detectChanges();

    expect(component.createClusterRef.isLoading()).toBe(false);
    const result = component.createClusterRef.value();
    expect(result).toBeDefined();
    const submitted = result?.payload as Record<string, unknown>;
    expect(submitted).toBeDefined();
    expect(submitted['password']).toBe('ValidPass123!');
    expect('confirmPassword' in submitted).toBe(false);
  });

  it('should reset form and mutation resource back to idle state on resetForm()', async () => {
    component.form.controls.region.setValue('us-west-1');
    component.form.controls.engine.setValue('postgres');
    component.form.controls.version.setValue('PostgreSQL 16.2');
    component.form.controls.certType.setValue('managed');
    component.form.controls.storageGb.setValue(100);
    component.form.controls.clusterName.setValue('first-cluster');
    component.form.controls.authMode.setValue('windows');
    fixture.detectChanges();

    component.onSubmit();
    await vi.advanceTimersByTimeAsync(1000);
    fixture.detectChanges();

    expect(component.createClusterRef.value()).toBeDefined();

    // Reset Form
    component.resetForm();
    fixture.detectChanges();

    expect(component.form.controls.clusterName.value).toBe('');
    expect(component.createClusterRef.status()).toBe('idle');
    expect(component.createClusterRef.value()).toBeUndefined();
    expect(component.nameAvailabilityRef.status()).toBe('idle');

    // Fill again and submit: verify clean retriggering
    component.form.controls.region.setValue('us-west-1');
    component.form.controls.engine.setValue('postgres');
    component.form.controls.version.setValue('PostgreSQL 16.2');
    component.form.controls.certType.setValue('managed');
    component.form.controls.storageGb.setValue(100);
    component.form.controls.clusterName.setValue('second-cluster');
    component.form.controls.authMode.setValue('windows');
    fixture.detectChanges();

    component.onSubmit();
    expect(component.createClusterRef.isLoading()).toBe(true);

    await vi.advanceTimersByTimeAsync(1000);
    fixture.detectChanges();

    expect(component.createClusterRef.status()).toBe('resolved');
    const newResult = component.createClusterRef.value();
    expect(newResult).toBeDefined();
    const payload = newResult?.payload as Record<string, unknown>;
    expect(payload['clusterName']).toBe('second-cluster');
  });

  it('should reactively reflect dynamic control presence and submit disabled state via computed signals', () => {
    expect(component.isSubmitDisabled()).toBe(true);
    expect(component.isHaTopologyMounted()).toBe(false);
    expect(component.isTlsCertificateMounted()).toBe(false);
    expect(component.isPasswordMounted()).toBe(false);

    component.form.controls.authMode.setValue('sql');
    fixture.detectChanges();

    expect(component.isPasswordMounted()).toBe(true);
    expect(component.isConfirmPasswordMounted()).toBe(true);

    component.form.controls.certType.setValue('custom');
    fixture.detectChanges();

    expect(component.isTlsCertificateMounted()).toBe(true);
  });
});
