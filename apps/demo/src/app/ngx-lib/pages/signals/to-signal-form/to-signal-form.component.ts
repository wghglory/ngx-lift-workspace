import {JsonPipe} from '@angular/common';
import {ChangeDetectionStrategy, Component, computed} from '@angular/core';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {AbstractControl, FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {ClarityModule} from '@clr/angular';
import {AlertComponent, CalloutComponent, PageContainerComponent, SpinnerComponent} from 'clr-lift';
import {computedAsync, resourceAsync, toSignalForm} from 'ngx-lift';
import {delay, of} from 'rxjs';

import {CodeBlockComponent} from '../../../../shared/components/code-block/code-block.component';
import {highlight} from '../../../../shared/utils/highlight.util';

export interface ClusterNameCheckResult {
  name: string;
  available: boolean;
  message?: string;
}

@Component({
  selector: 'app-to-signal-form',
  imports: [
    ClarityModule,
    ReactiveFormsModule,
    JsonPipe,
    PageContainerComponent,
    CalloutComponent,
    CodeBlockComponent,
    SpinnerComponent,
    AlertComponent,
  ],
  templateUrl: './to-signal-form.component.html',
  styleUrl: './to-signal-form.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ToSignalFormComponent {
  // Available versions per database engine
  readonly engineVersionMap: Record<string, string[]> = {
    postgres: ['PostgreSQL 16.2', 'PostgreSQL 15.6', 'PostgreSQL 14.11'],
    mysql: ['MySQL 8.4.0 LTS', 'MySQL 8.0.36'],
    sqlserver: ['SQL Server 2022 CU12', 'SQL Server 2019 CU25'],
  };

  // Main enterprise form simulating cloud database creation
  readonly form = new FormGroup<{
    region: FormControl<'us-west-1' | 'eu-central-1' | 'ap-east-1' | ''>;
    engine: FormControl<'postgres' | 'mysql' | 'sqlserver' | ''>;
    version: FormControl<string>;
    clusterName: FormControl<string>;
    autoScaling: FormControl<boolean>;
    storageGb: FormControl<number | ''>;
    authMode: FormControl<'sql' | 'windows' | ''>;
    certType: FormControl<'managed' | 'custom' | ''>;
    password?: FormControl<string>;
    confirmPassword?: FormControl<string>;
  }>({
    region: new FormControl<'us-west-1' | 'eu-central-1' | 'ap-east-1' | ''>('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    engine: new FormControl<'postgres' | 'mysql' | 'sqlserver' | ''>('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    version: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    clusterName: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(4)],
    }),
    autoScaling: new FormControl(false, {nonNullable: true}),
    storageGb: new FormControl<number | ''>('', {
      nonNullable: true,
      validators: [Validators.required, Validators.min(20)],
    }),
    authMode: new FormControl<'sql' | 'windows' | ''>('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    certType: new FormControl<'managed' | 'custom' | ''>('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
  });

  // Single entry-point facade: exposes all signals, bindings, controls, and clean submitValue
  // Omits UI-only controls (e.g. 'confirmPassword') from submitValue
  readonly sf = toSignalForm(this.form, {
    omit: ['confirmPassword'],
  });

  // 1. Reactive Control Value Signals (Angular 22 style via sf.fields.<name>.value)
  readonly region = this.sf.fields.region.value;
  readonly engine = this.sf.fields.engine.value;
  readonly autoScaling = this.sf.fields.autoScaling.value;
  readonly authMode = this.sf.fields.authMode.value;
  readonly certType = this.sf.fields.certType.value;

  // 2. Filtered Options based on 1st Control Value
  readonly availableVersions = computed(() => {
    return this.engineVersionMap[this.engine()] ?? [];
  });

  // 3. Debounced Control Value for Async Probes
  readonly clusterNameDebounced = this.sf.controlValue('clusterName', {
    debounceTime: 400,
  });

  // 4. Async API Probe using resourceAsync driven by Debounced Signal
  readonly nameAvailabilityRef = resourceAsync<ClusterNameCheckResult | null>(() => {
    const name = this.clusterNameDebounced().trim();
    if (!name || name.length < 4) {
      return of(null);
    }
    const takenNames = ['prod-db', 'test-cluster', 'postgres-main', 'admin-db'];
    const isTaken = takenNames.includes(name.toLowerCase());

    return of({
      name,
      available: !isTaken,
      message: isTaken
        ? `Cluster name "${name}" is already reserved. Please choose another.`
        : `Cluster name "${name}" is available!`,
    }).pipe(delay(600));
  });

  // 5. Asynchronous Feature Gating with computedAsync
  // Queries regional cloud capability asynchronously (simulated 300ms network lookup).
  readonly isMultiZoneSupported = computedAsync(
    () => {
      const reg = this.region();
      const eng = this.engine();

      if (!reg) {
        return of(false);
      }

      // Regional Capability Rules:
      // - us-west-1: Supports Multi-Zone HA for all engines
      // - ap-east-1: Supports Multi-Zone HA for PostgreSQL and MySQL
      // - eu-central-1: Single-Zone only
      const supported = reg === 'us-west-1' || (reg === 'ap-east-1' && (eng === 'postgres' || eng === 'mysql'));

      return of(supported).pipe(delay(300));
    },
    {initialValue: false},
  );

  // 6. Asynchronous Submission using resourceAsync:
  // MUST use { lazy: true, behavior: 'exhaust' } for form submissions:
  // - lazy: true: prevents firing on component init or on every keystroke
  // - behavior: 'exhaust': ignores accidental double-clicks during in-flight network requests
  // - Reads this.sf.submitValue() directly inside the fetch function
  readonly createClusterRef = resourceAsync<{id: string; status: string; payload: unknown} | null>(
    () => {
      const payload = this.sf.submitValue();
      return of({
        id: `cluster-${Math.floor(1000 + Math.random() * 9000)}`,
        status: 'PROVISIONING',
        payload,
      }).pipe(delay(1000));
    },
    {lazy: true, behavior: 'exhaust'},
  );

  constructor() {
    // A. Cascading Version Selection when Engine changes:
    //
    // Approach 1 (Regular Production Approach): Standard RxJS valueChanges with takeUntilDestroyed
    // Retained in demo code as the standard reactive forms pattern.
    this.form.controls.engine.valueChanges.pipe(takeUntilDestroyed()).subscribe((engine) => {
      this.syncVersionForEngine(engine);
    });

    // Approach 2 (Modern Signal-Based Approach - Angular 22 Style):
    // Uses sf.controls.engine.watch (or sf.watch), which runs inside an Angular effect under the hood.
    // It automatically runs the callback in an untracked context, allowing safe control updates
    // without NG0600 signal write restrictions and without needing manual DestroyRef cleanup:
    this.sf.controls.engine.watch((engine) => {
      this.syncVersionForEngine(engine);
    });

    // B. Declarative Enable/Disable with Auto-Reset (bindDisabled)
    // When Auto-scaling is ON, manual storageGb input is disabled and reset to 250 GB
    this.sf.bindDisabled('storageGb', () => this.autoScaling(), {
      resetOnDisable: true,
      resetValue: 250,
    });

    // C. Dynamic Credentials Presence (bindIf)
    // When authMode is 'sql', mount password and confirmPassword with cross-validation.
    // When authMode is 'windows', both are detached from form (and auto-excluded from submitValue!)
    this.sf.bindIf(
      () => this.authMode() === 'sql',
      () => ({
        password: new FormControl('', {
          nonNullable: true,
          validators: [Validators.required, Validators.minLength(8)],
        }),
        confirmPassword: new FormControl('', {
          nonNullable: true,
          validators: [
            Validators.required,
            (ctrl: AbstractControl) =>
              ctrl.value === this.form.get('password')?.value ? null : {passwordMismatch: true},
          ],
        }),
      }),
      {preserveValue: true},
    );

    // Cross-control revalidation: re-evaluates confirmPassword whenever password changes
    this.sf.revalidate('confirmPassword', 'password');

    // D. Dynamic Control Presence with Memory Retention (bindIf)
    // When certType is 'custom', dynamically mount 'tlsCertificate'.
    // Preserves previously typed certificate text across switches!
    this.sf.bindIf(
      () => this.certType() === 'custom',
      () => ({
        tlsCertificate: new FormControl('', {
          nonNullable: true,
          validators: [Validators.required, Validators.minLength(20)],
        }),
      }),
      {preserveValue: true},
    );

    // E. Asynchronous Feature Gating (bindIf + computedAsync)
    // When regional capability resolves to true: dynamically mounts 'haTopology' and 'replicaCount'.
    // When false (or resolving): controls are detached and excluded from sf.submitValue().
    this.sf.bindIf(
      () => this.isMultiZoneSupported(),
      () => ({
        haTopology: new FormControl<'cross-az' | 'dedicated-host'>('cross-az', {
          nonNullable: true,
          validators: [Validators.required],
        }),
        replicaCount: new FormControl<number>(3, {
          nonNullable: true,
          validators: [Validators.required, Validators.min(2), Validators.max(5)],
        }),
      }),
      {preserveValue: true},
    );
  }

  onSubmit(): void {
    if (this.sf.invalid()) {
      this.sf.markAllAsTouched();
      return;
    }
    // Triggers simulated 1-second backend provisioning with current sanitized submission value
    this.createClusterRef.execute();
  }

  private syncVersionForEngine(engine: string): void {
    const versions = this.engineVersionMap[engine] ?? [];
    const currentVersion = this.form.controls.version.value;
    if (versions.length > 0 && !versions.includes(currentVersion)) {
      this.form.controls.version.setValue(versions[0] ?? '');
    } else if (versions.length === 0 && currentVersion !== '') {
      this.form.controls.version.setValue('');
    }
  }

  resetForm(): void {
    this.sf.reset({
      region: '',
      engine: '',
      version: '',
      clusterName: '',
      autoScaling: false,
      storageGb: '',
      authMode: '',
      certType: '',
    });
    this.createClusterRef.reset();
    this.nameAvailabilityRef.reset();
  }

  // Code snippets for documentation tabs
  readonly toSignalFormSnippet = highlight(`
// 1. Single entry-point for the entire form:
readonly sf = toSignalForm(this.form, {
  omit: ['confirmPassword'],
});

// 2. Read field signals (Angular 22 style):
engine = this.sf.fields.engine.value; // Signal<string> -> this.engine()
clusterNameDebounced = this.sf.controlValue('clusterName', { debounceTime: 400 });

// 3. Field status & validation signals:
this.sf.fields.clusterName.valid()    // Signal<boolean>
this.sf.fields.clusterName.invalid()  // Signal<boolean>
this.sf.fields.clusterName.touched()  // Signal<boolean>
this.sf.fields.clusterName.errors()   // Signal<ValidationErrors | null>

// 4. Form-level status signals:
this.sf.valid()       // Signal<boolean>
this.sf.invalid()     // Signal<boolean>
this.sf.rawValue()    // Signal<T> (preserves disabled controls)
this.sf.submitValue() // Signal<TSubmitValue> (sanitized submission value)
`);

  readonly bindIfSnippet = highlight(`
// Mount/unmount a group of related controls (SQL credentials) together with memory retention.
// Condition accepts any reactive getter function () => boolean or Signal<boolean>:
this.sf.bindIf(
  () => this.authMode() === 'sql',
  () => ({
    password: new FormControl('', [Validators.required, Validators.minLength(8)]),
    confirmPassword: new FormControl('', [
      Validators.required,
      (ctrl) => (ctrl.value === this.form.get('password')?.value ? null : { passwordMismatch: true }),
    ]),
  }),
  { preserveValue: true }
);

// Re-validate confirmPassword whenever password changes:
this.sf.revalidate('confirmPassword', 'password');
`);

  readonly bindDisabledSnippet = highlight(`
// Pattern 1: Strongly-typed control name + reactive getter function + auto-reset
this.sf.bindDisabled('storageGb', () => this.autoScaling(), {
  resetOnDisable: true,
  resetValue: 250, // Strongly typed to number!
});

// Pattern 2: Directly on the enhanced control instance (sf.controls.<name>)
this.sf.controls.storageGb.bindDisabled(this.autoScaling, {
  resetOnDisable: true,
  resetValue: 250,
});

// Pattern 3: Passing AbstractControl instance directly
this.sf.bindDisabled(this.sf.controls.storageGb, () => this.autoScaling(), {
  resetOnDisable: true,
  resetValue: 250,
});

// Reactive status is immediately available anywhere via signals:
// const isLocked = this.sf.fields.storageGb.disabled();
`);

  readonly submitValueSnippet = highlight(`
// 1. Facade initialization (omits confirmPassword from submitValue):
readonly sf = toSignalForm(this.form, {
  omit: ['confirmPassword'],
});

// 2. Asynchronous submission via resourceAsync with { lazy: true, behavior: 'exhaust' }:
// - lazy: true prevents premature execution on component load or typing
// - behavior: 'exhaust' drops duplicate clicks during in-flight submission
// - sf.submitValue() provides the sanitized, backend-ready object directly to the API
readonly createClusterRef = resourceAsync(
  () => this.api.createCluster(this.sf.submitValue()),
  { lazy: true, behavior: 'exhaust' }
);

// 3. Trigger simulated submission on button click:
onSubmit(): void {
  if (this.sf.invalid()) {
    this.sf.markAllAsTouched();
    return;
  }
  this.createClusterRef.execute(); // Fires API call and transitions to loading state
}
`);

  readonly featureGatingSnippet = highlight(`
// 1. Asynchronously resolve regional capability via computedAsync:
// (Asynchronous feature flag or capability lookup)
readonly isMultiZoneSupported = computedAsync(
  () => this.featureGate.isSupported('supervisorInfraPolicy.multiZone', this.sf.fields.region.value(), this.engine()),
  { initialValue: false }
);

// 2. Pass reactive getter function directly into sf.bindIf:
this.sf.bindIf(
  () => this.isMultiZoneSupported(),
  () => ({
    haTopology: new FormControl('cross-az', [Validators.required]),
    replicaCount: new FormControl(2, [Validators.required, Validators.min(2)]),
  }),
  { preserveValue: true }
);

// 3. SubmitValue automatically includes or omits controls when capability changes:
const submitData = this.sf.submitValue();
`);

  readonly cascadingSnippet = highlight(`
// Approach 1 (Traditional Reactive Forms): valueChanges + takeUntilDestroyed
this.form.controls.engine.valueChanges
  .pipe(takeUntilDestroyed())
  .subscribe((engine) => {
    this.syncVersionForEngine(engine);
  });

// Approach 2 (Modern Signal-Based - Angular 22 Style): sf.controls.engine.watch / sf.watch
// Uses Angular effect() internally with untracked isolation, allowing safe cascading writes
// without NG0600 signal write restrictions and without manual DestroyRef cleanup:
this.sf.controls.engine.watch((engine) => {
  this.syncVersionForEngine(engine);
});

// Or using sf.watch directly:
this.sf.watch('engine', (engine) => {
  this.syncVersionForEngine(engine);
});
`);
}
