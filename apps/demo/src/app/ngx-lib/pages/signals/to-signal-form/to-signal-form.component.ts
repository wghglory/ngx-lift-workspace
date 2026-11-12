import {JsonPipe} from '@angular/common';
import {ChangeDetectionStrategy, Component, computed, inject, signal} from '@angular/core';
import {toSignal} from '@angular/core/rxjs-interop';
import {AbstractControl, FormArray, FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {ClarityModule} from '@clr/angular';
import {
  AlertComponent,
  CalloutComponent,
  PageContainerComponent,
  SpinnerComponent,
  TranslatePipe,
  TranslationService,
} from 'clr-lift';
import {computedAsync, resourceAsync, toSignalForm, toSubmitValue} from 'ngx-lift';
import {delay, merge, of} from 'rxjs';

import {ApiProperty, ApiTableComponent} from '../../../../shared/components/api-table';
import {CodeBlockComponent} from '../../../../shared/components/code-block/code-block.component';
import {DemoPlaygroundComponent} from '../../../../shared/components/demo-playground/demo-playground.component';
import {StateInspectorComponent} from '../../../../shared/components/state-inspector/state-inspector.component';
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
    DemoPlaygroundComponent,
    StateInspectorComponent,
    TranslatePipe,
    ApiTableComponent,
  ],
  templateUrl: './to-signal-form.component.html',
  styleUrl: './to-signal-form.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ToSignalFormComponent {
  private readonly translationService = inject(TranslationService);

  readonly toSignalFormProperties = computed<ApiProperty[]>(() => {
    this.translationService.currentLanguage();
    return [
      {
        name: 'form (parameter)',
        type: 'FormGroup<TControls>',
        required: true,
        description: this.translationService.translate('toSignalForm.apiPropForm'),
      },
      {
        name: 'options.omit',
        type: '(keyof T | (string & {}))[]',
        description: this.translationService.translate('toSignalForm.apiPropOmit'),
      },
      {
        name: 'options.includeDisabled',
        type: 'boolean',
        defaultValue: 'true',
        description: this.translationService.translate('toSignalForm.apiPropIncludeDisabled'),
      },
      {
        name: 'options.omitEmptyStrings',
        type: 'boolean',
        defaultValue: 'false',
        description: this.translationService.translate('toSignalForm.apiPropOmitEmptyStrings'),
      },
      {
        name: 'options.omitNull',
        type: 'boolean',
        defaultValue: 'false',
        description: this.translationService.translate('toSignalForm.apiPropOmitNull'),
      },
      {
        name: 'options.omitIf',
        type: '(value: unknown, key: string, raw: Record<string, unknown>) => boolean',
        description: this.translationService.translate('toSignalForm.apiPropOmitIf'),
      },
      {
        name: 'options.deep',
        type: 'boolean',
        defaultValue: 'false',
        description: this.translationService.translate('toSignalForm.apiPropDeep'),
      },
      {
        name: 'sf.value',
        type: 'Signal<TValue>',
        description: this.translationService.translate('toSignalForm.apiPropValue'),
      },
      {
        name: 'sf.status',
        type: 'Signal<FormControlStatus>',
        description: this.translationService.translate('toSignalForm.apiPropStatus'),
      },
      {
        name: 'sf.valid',
        type: 'Signal<boolean>',
        description: this.translationService.translate('toSignalForm.apiPropValid'),
      },
      {
        name: 'sf.invalid',
        type: 'Signal<boolean>',
        description: this.translationService.translate('toSignalForm.apiPropInvalid'),
      },
      {
        name: 'sf.submitValue',
        type: 'Signal<TSubmitValue>',
        description: this.translationService.translate('toSignalForm.apiPropSubmitValue'),
      },
    ];
  });

  readonly bindIfProperties = computed<ApiProperty[]>(() => {
    this.translationService.currentLanguage();
    return [
      {
        name: 'controlName',
        type: 'string',
        required: true,
        description: this.translationService.translate('toSignalForm.apiBindIfControl'),
      },
      {
        name: 'condition',
        type: 'Signal<boolean> | (() => boolean)',
        required: true,
        description: this.translationService.translate('toSignalForm.apiBindIfCondition'),
      },
      {
        name: 'options.preserveValue',
        type: 'boolean',
        defaultValue: 'false',
        description: this.translationService.translate('toSignalForm.apiBindIfPreserveValue'),
      },
    ];
  });

  readonly bindDisabledProperties = computed<ApiProperty[]>(() => {
    this.translationService.currentLanguage();
    return [
      {
        name: 'control',
        type: 'string | AbstractControl',
        required: true,
        description: this.translationService.translate('toSignalForm.apiBindDisabledControl'),
      },
      {
        name: 'condition',
        type: 'Signal<boolean> | (() => boolean)',
        required: true,
        description: this.translationService.translate('toSignalForm.apiBindDisabledCondition'),
      },
      {
        name: 'options.resetOnDisable',
        type: 'boolean',
        defaultValue: 'false',
        description: this.translationService.translate('toSignalForm.apiBindDisabledResetOnDisable'),
      },
      {
        name: 'options.resetValue',
        type: 'any',
        description: this.translationService.translate('toSignalForm.apiBindDisabledResetValue'),
      },
      {
        name: 'options.emitEvent',
        type: 'boolean',
        defaultValue: 'true',
        description: this.translationService.translate('toSignalForm.apiBindDisabledEmitEvent'),
      },
    ];
  });

  readonly revalidateProperties = computed<ApiProperty[]>(() => {
    this.translationService.currentLanguage();
    return [
      {
        name: 'target',
        type: 'string | AbstractControl',
        required: true,
        description: this.translationService.translate('toSignalForm.apiRevalidateTarget'),
      },
      {
        name: 'source',
        type: 'string | AbstractControl | Signal<unknown> | (() => unknown)',
        required: true,
        description: this.translationService.translate('toSignalForm.apiRevalidateSources'),
      },
    ];
  });

  readonly bindValidatorsProperties = computed<ApiProperty[]>(() => {
    this.translationService.currentLanguage();
    return [
      {
        name: 'control',
        type: 'string | AbstractControl',
        required: true,
        description: this.translationService.translate('toSignalForm.apiBindValidatorsControl'),
      },
      {
        name: 'validators',
        type: 'ValidatorFn | ValidatorFn[] | null | Signal<ValidatorFn | ValidatorFn[] | null> | (() => ValidatorFn | ValidatorFn[] | null)',
        required: true,
        description: this.translationService.translate('toSignalForm.apiBindValidatorsValidators'),
      },
      {
        name: 'options.emitEvent',
        type: 'boolean',
        defaultValue: 'true',
        description: this.translationService.translate('toSignalForm.apiBindValidatorsEmitEvent'),
      },
      {
        name: 'options.updateValueAndValidity',
        type: 'boolean',
        defaultValue: 'true',
        description: this.translationService.translate('toSignalForm.apiBindValidatorsUpdateValueAndValidity'),
      },
    ];
  });

  // Quickstart minimal form (Beginner friendly)
  readonly quickForm = new FormGroup({
    username: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(3)],
    }),
    email: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.email],
    }),
    notifications: new FormControl(true, {nonNullable: true}),
  });

  readonly quickSf = toSignalForm(this.quickForm);
  readonly quickSubmitted = signal<Partial<{username: string; email: string; notifications: boolean}> | null>(null);

  saveQuickProfile(): void {
    if (this.quickSf.invalid()) {
      this.quickSf.markAllAsTouched();
      return;
    }
    this.quickSubmitted.set({...this.quickSf.submitValue()});
  }

  resetQuickProfile(): void {
    this.quickSf.reset();
    this.quickSubmitted.set(null);
  }

  readonly quickFormState = computed(() => ({
    valid: this.quickSf.valid(),
    invalid: this.quickSf.invalid(),
    dirty: this.quickSf.dirty(),
    username: this.quickSf.fields.username.value(),
    email: this.quickSf.fields.email.value(),
    notifications: this.quickSf.fields.notifications.value(),
  }));

  // Validator binding lab: a policy control drives the active validator set.
  readonly policyForm = new FormGroup({
    projectCode: new FormControl('', {nonNullable: true}),
    strict: new FormControl(false, {nonNullable: true}),
  });
  readonly policySf = toSignalForm(this.policyForm);

  readonly policyState = computed(() => ({
    strict: this.policySf.fields.strict.value(),
    value: this.policySf.fields.projectCode.value(),
    valid: this.policySf.fields.projectCode.valid(),
    errors: this.policySf.fields.projectCode.errors(),
  }));

  resetPolicyDemo(): void {
    this.policySf.reset();
  }

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
    haTopology?: FormControl<'cross-az' | 'dedicated-host' | ''>;
    replicaCount?: FormControl<number>;
    tlsCertificate?: FormControl<string>;
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
  // MUST use { lazy: true, reactive: false, behavior: 'exhaust' } for form submissions:
  // - lazy: true: prevents execution on initialization
  // - reactive: false: prevents resubmitting when form fields change
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
    {lazy: true, reactive: false, behavior: 'exhaust'},
  );

  // Dynamic Control Presence signals (uses strongly typed dot notation on sf.fields)
  readonly isHaTopologyMounted = computed(() => Boolean(this.sf.fields.haTopology));
  readonly isTlsCertificateMounted = computed(() => Boolean(this.sf.fields.tlsCertificate));
  readonly isPasswordMounted = computed(() => Boolean(this.sf.fields.password));
  readonly isConfirmPasswordMounted = computed(() => Boolean(this.sf.fields.confirmPassword));

  // Action disabled state encapsulated in a computed signal
  readonly isSubmitDisabled = computed(() => {
    const isInvalid = this.sf.invalid();
    const probe = this.nameAvailabilityRef.value();
    const isNameUnavailable = Boolean(probe && !probe.available);
    const isLoading = this.createClusterRef.isLoading();
    return isInvalid || isNameUnavailable || isLoading;
  });

  // Enterprise form status summary for state inspector
  readonly enterpriseFormState = computed(() => ({
    valid: this.sf.valid(),
    invalid: this.sf.invalid(),
    dirty: this.sf.dirty(),
    region: this.sf.fields.region.value() || '(none)',
    engine: this.sf.fields.engine.value() || '(none)',
    storageGb: this.sf.fields.storageGb.value() || 0,
    storageDisabled: this.sf.fields.storageGb.disabled(),
    authMode: this.sf.fields.authMode.value() || '(none)',
    status: this.createClusterRef.status(),
  }));

  constructor() {
    // Reactive validator binding: the policy control's value signal replaces the
    // whole validator set. Switching the policy never clears the typed value.
    this.policySf.bindValidators('projectCode', () =>
      this.policySf.fields.strict.value()
        ? [Validators.required, Validators.minLength(6), Validators.pattern(/^[a-z0-9-]+$/)]
        : null,
    );

    // Cascading Version Selection when Engine changes (Modern Signal-Based Approach):
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
              ctrl.value === this.form.controls.password?.value ? null : {passwordMismatch: true},
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
        haTopology: new FormControl<'cross-az' | 'dedicated-host' | ''>('', {
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

  /**
   * Stable sample form for the submission options lab. Empty strings, null values,
   * a disabled control, a UI-only field, an internal field, a nested group and an
   * array each exercise one `toSubmitValue` option.
   */
  readonly optionsForm = new FormGroup({
    displayName: new FormControl('Ada Lovelace', {nonNullable: true}),
    nickname: new FormControl('', {nonNullable: true}),
    deletedAt: new FormControl<string | null>(null),
    internalCode: new FormControl('INT-42', {nonNullable: true}),
    confirmEmail: new FormControl('ada@example.com', {nonNullable: true}),
    region: new FormControl({value: 'eu-central-1', disabled: true}),
    profile: new FormGroup({
      city: new FormControl('', {nonNullable: true}),
      backupEmail: new FormControl<string | null>(null),
    }),
    tags: new FormArray([new FormControl('primary', {nonNullable: true}), new FormControl('', {nonNullable: true})]),
  });

  /** Toggle controls bound with formControlName, like the other playgrounds on this page. */
  readonly optionsControls = new FormGroup({
    includeDisabled: new FormControl(true, {nonNullable: true}),
    omitEmptyStrings: new FormControl(false, {nonNullable: true}),
    omitNull: new FormControl(false, {nonNullable: true}),
    omitIf: new FormControl(false, {nonNullable: true}),
    omit: new FormControl(false, {nonNullable: true}),
    deep: new FormControl(false, {nonNullable: true}),
  });

  /** Initial sample values and switches, captured once so reset never repeats the defaults. */
  private readonly initialOptionsFormValue = this.optionsForm.getRawValue();
  private readonly initialOptionsFlags = this.optionsControls.getRawValue();

  /** Recomputes the three payloads after a value, status or option change. */
  private readonly optionsChanges = toSignal(
    merge(this.optionsForm.valueChanges, this.optionsForm.statusChanges, this.optionsControls.valueChanges),
  );

  /** Raw value, Angular value and sanitized submit value for the currently selected options. */
  readonly optionsComparison = computed(() => {
    this.optionsChanges();
    const flags = this.optionsControls.getRawValue();
    return {
      rawValue: this.optionsForm.getRawValue(),
      formValue: this.optionsForm.value,
      submitValue: toSubmitValue(this.optionsForm, {
        includeDisabled: flags.includeDisabled,
        omitEmptyStrings: flags.omitEmptyStrings,
        omitNull: flags.omitNull,
        omitIf: flags.omitIf ? (_value: unknown, key: string) => key.startsWith('internal') : undefined,
        omit: flags.omit ? ['confirmEmail'] : [],
        deep: flags.deep,
      }),
    };
  });

  /** Keys surviving each stage, shown by the state inspector. */
  readonly optionsInspectorState = computed<Record<string, unknown>>(() => {
    const comparison = this.optionsComparison();
    return {
      rawKeys: Object.keys(comparison.rawValue),
      formValueKeys: Object.keys(comparison.formValue),
      submitKeys: Object.keys(comparison.submitValue),
    };
  });

  /** Restores the sample values and the default option switches. */
  resetOptions(): void {
    this.optionsForm.reset(this.initialOptionsFormValue);
    this.optionsControls.reset(this.initialOptionsFlags);
  }

  // Code snippets for documentation tabs
  readonly quickStartTs = highlight(`import {signal} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {toSignalForm} from 'ngx-lift';

// Component fields and handlers used by the live preview.
readonly quickForm = new FormGroup({
  username: new FormControl('', {
    nonNullable: true,
    validators: [Validators.required, Validators.minLength(3)],
  }),
  email: new FormControl('', {
    nonNullable: true,
    validators: [Validators.required, Validators.email],
  }),
  notifications: new FormControl(true, {nonNullable: true}),
});

readonly quickSf = toSignalForm(this.quickForm);

readonly quickSubmitted = signal<Partial<{username: string; email: string; notifications: boolean}> | null>(null);

saveQuickProfile(): void {
  if (this.quickSf.invalid()) {
    this.quickSf.markAllAsTouched();
    return;
  }
  this.quickSubmitted.set({...this.quickSf.submitValue()});
}

resetQuickProfile(): void {
  this.quickSf.reset();
  this.quickSubmitted.set(null);
}`);

  readonly quickStartHtml = highlight(
    `<form clrForm [formGroup]="quickForm" class="max-w-xl" (ngSubmit)="saveQuickProfile()">
  <clr-input-container>
    <label for="quick-username">{{ 'toSignalForm.username' | translate }}</label>
    <input
      id="quick-username"
      clrInput
      [formControl]="quickSf.controls.username"
      [placeholder]="'toSignalForm.usernamePlaceholder' | translate"
    />
    <clr-control-error *clrIfError="'required'">{{ 'toSignalForm.usernameRequired' | translate }}</clr-control-error>
    <clr-control-error *clrIfError="'minlength'">{{ 'toSignalForm.usernameMinLength' | translate }}</clr-control-error>
  </clr-input-container>

  <clr-input-container>
    <label for="quick-email">{{ 'toSignalForm.email' | translate }}</label>
    <input
      id="quick-email"
      clrInput
      type="email"
      [formControl]="quickSf.controls.email"
      [placeholder]="'toSignalForm.emailPlaceholder' | translate"
    />
    <clr-control-error *clrIfError="'required'">{{ 'toSignalForm.emailRequired' | translate }}</clr-control-error>
    <clr-control-error *clrIfError="'email'">{{ 'toSignalForm.emailInvalid' | translate }}</clr-control-error>
  </clr-input-container>

  <clr-toggle-container>
    <label for="quick-notifications">{{ 'toSignalForm.receiveUpdates' | translate }}</label>
    <clr-toggle-wrapper>
      <input type="checkbox" id="quick-notifications" clrToggle [formControl]="quickSf.controls.notifications" />
    </clr-toggle-wrapper>
  </clr-toggle-container>

  <div cds-layout="horizontal gap:xs align:center m-t:sm">
    <button type="submit" class="btn btn-primary" [disabled]="quickSf.invalid()">
      {{ 'toSignalForm.saveProfile' | translate }}
    </button>
    <button type="button" class="btn btn-outline" (click)="resetQuickProfile()">
      {{ 'toSignalForm.reset' | translate }}
    </button>
  </div>
</form>
@if (quickSubmitted()) {
  <p>{{ 'toSignalForm.savedProfile' | translate }}</p>
  <pre data-testid="quick-saved-profile">{{ quickSubmitted() | json }}</pre>
}`,
    'html',
  );

  readonly toSignalFormSnippet = highlight(`// 1. Single entry-point for the entire form:
readonly sf = toSignalForm(this.form, {
  omit: ['confirmPassword'],
});

// 2. Read field signals (Angular 22 style):
engine = this.sf.fields.engine.value; // Signal<string> -> this.engine()
clusterNameDebounced = this.sf.controlValue('clusterName', {debounceTime: 400});

// 3. Field status & validation signals:
readFieldState() {
  return {
    valid: this.sf.fields.clusterName.valid(),
    invalid: this.sf.fields.clusterName.invalid(),
    touched: this.sf.fields.clusterName.touched(),
    errors: this.sf.fields.clusterName.errors(),
  };
}

// 4. Form-level status signals:
readFormState() {
  return {
    valid: this.sf.valid(),
    invalid: this.sf.invalid(),
    rawValue: this.sf.rawValue(),
    submitValue: this.sf.submitValue(),
  };
}`);

  readonly bindIfSnippet =
    highlight(`// Mount/unmount a group of related controls (SQL credentials) together with memory retention.
// Condition accepts any reactive getter function () => boolean or Signal<boolean>:
this.sf.bindIf(
  () => this.authMode() === 'sql',
  () => ({
    password: new FormControl('', [Validators.required, Validators.minLength(8)]),
    confirmPassword: new FormControl('', [
      Validators.required,
      (ctrl) => (ctrl.value === this.form.controls.password?.value ? null : {passwordMismatch: true}),
    ]),
  }),
  {preserveValue: true},
);

// Re-validate confirmPassword whenever password changes:
this.sf.revalidate('confirmPassword', 'password');`);

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

  readonly validatorsTs = highlight(`import {computed} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {toSignalForm} from 'ngx-lift';

// The policy toggle and the value share one caller-owned FormGroup.
readonly policyForm = new FormGroup({
  projectCode: new FormControl('', {nonNullable: true}),
  strict: new FormControl(false, {nonNullable: true}),
});
readonly policySf = toSignalForm(this.policyForm);

readonly policyState = computed(() => ({
  strict: this.policySf.fields.strict.value(),
  value: this.policySf.fields.projectCode.value(),
  valid: this.policySf.fields.projectCode.valid(),
  errors: this.policySf.fields.projectCode.errors(),
}));

constructor() {
  // The getter is reactive: each policy change replaces the entire validator set.
  this.policySf.bindValidators('projectCode', () =>
    this.policySf.fields.strict.value()
      ? [Validators.required, Validators.minLength(6), Validators.pattern(/^[a-z0-9-]+$/)]
      : null,
  );

  // Equivalent public surfaces:
  // this.policySf.controls.projectCode.bindValidators(() => ...);
  // bindControlValidators(this.policyForm.controls.projectCode, () => ...);
}

resetPolicyDemo(): void {
  this.policySf.reset();
}`);

  readonly validatorsHtml = highlight(
    `<form clrForm [formGroup]="policyForm">
  <clr-toggle-container>
    <label for="validator-strict-toggle">{{ 'toSignalForm.validatorsStrictLabel' | translate }}</label>
    <clr-toggle-wrapper>
      <input id="validator-strict-toggle" type="checkbox" clrToggle [formControl]="policySf.controls.strict" />
    </clr-toggle-wrapper>
    <clr-control-helper>{{ 'toSignalForm.validatorsStrictHelper' | translate }}</clr-control-helper>
  </clr-toggle-container>

  <clr-input-container>
    <label for="validator-project-code">{{ 'toSignalForm.validatorsCodeLabel' | translate }}</label>
    <input id="validator-project-code" clrInput [formControl]="policySf.controls.projectCode" />
    <clr-control-error *clrIfError="'required'">{{ 'toSignalForm.validatorsRequired' | translate }}</clr-control-error>
    <clr-control-error *clrIfError="'minlength'">{{
      'toSignalForm.validatorsMinLength' | translate
    }}</clr-control-error>
    <clr-control-error *clrIfError="'pattern'">{{ 'toSignalForm.validatorsPattern' | translate }}</clr-control-error>
  </clr-input-container>

  <p role="status">
    @if (policySf.fields.strict.value()) {
      {{ 'toSignalForm.validatorsRuleStrict' | translate }}
    } @else {
      {{ 'toSignalForm.validatorsRuleRelaxed' | translate }}
    }
  </p>

  <button type="button" class="btn btn-outline" (click)="resetPolicyDemo()">
    {{ 'toSignalForm.reset' | translate }}
  </button>
</form>`,
    'html',
  );

  readonly submitValueSnippet = highlight(`// 1. Facade initialization (omits confirmPassword from submitValue):
readonly sf = toSignalForm(this.form, {
  omit: ['confirmPassword'],
});

// 2. Asynchronous submission via resourceAsync with { lazy: true, reactive: false, behavior: 'exhaust' }:
// - lazy: true prevents premature execution on component load or typing
// - behavior: 'exhaust' drops duplicate clicks during in-flight submission
// - sf.submitValue() provides the sanitized, backend-ready object directly to the API
readonly createClusterRef = resourceAsync(() => this.api.createCluster(this.sf.submitValue()), {
  lazy: true,
  reactive: false,
  behavior: 'exhaust',
});

// 3. Trigger simulated submission on button click:
onSubmit(): void {
  if (this.sf.invalid()) {
    this.sf.markAllAsTouched();
    return;
  }
  this.createClusterRef.execute(); // Fires API call and transitions to loading state
}`);

  readonly featureGatingSnippet = highlight(`// 1. Asynchronously resolve regional capability via computedAsync:
// (Asynchronous feature flag or capability lookup)
readonly isMultiZoneSupported = computedAsync(
  () => this.featureGate.isSupported('supervisorInfraPolicy.multiZone', this.sf.fields.region.value(), this.engine()),
  {initialValue: false},
);

// 2. Register the conditional controls in the injection context.
constructor() {
  this.sf.bindIf(
    () => this.isMultiZoneSupported(),
    () => ({
      haTopology: new FormControl('', [Validators.required]),
      replicaCount: new FormControl(2, [Validators.required, Validators.min(2)]),
    }),
    {preserveValue: true},
  );
}

// 3. Submitted values include the currently active controls.
submit() {
  return this.sf.submitValue();
}`);

  readonly cascadingSnippet = highlight(`// Approach 1 (Traditional Reactive Forms): valueChanges + takeUntilDestroyed
this.form.controls.engine.valueChanges.pipe(takeUntilDestroyed()).subscribe((engine) => {
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
});`);

  readonly optionsLabTs = highlight(`import {computed} from '@angular/core';
import {toSignal} from '@angular/core/rxjs-interop';
import {FormArray, FormControl, FormGroup} from '@angular/forms';
import {toSubmitValue} from 'ngx-lift';
import {merge} from 'rxjs';

// A facade created by toSignalForm owns its form and exposes one reactive
// submitValue signal for a single option set. This lab needs several payloads
// from one form, so it uses the pure toSubmitValue helper instead of rebuilding
// the facade or wrapping its methods. Everything below is the live component code.
readonly optionsForm = new FormGroup({
  displayName: new FormControl('Ada Lovelace', {nonNullable: true}),
  nickname: new FormControl('', {nonNullable: true}),
  deletedAt: new FormControl<string | null>(null),
  internalCode: new FormControl('INT-42', {nonNullable: true}),
  confirmEmail: new FormControl('ada@example.com', {nonNullable: true}),
  region: new FormControl({value: 'eu-central-1', disabled: true}),
  profile: new FormGroup({
    city: new FormControl('', {nonNullable: true}),
    backupEmail: new FormControl<string | null>(null),
  }),
  tags: new FormArray([new FormControl('primary', {nonNullable: true}), new FormControl('', {nonNullable: true})]),
});

readonly optionsControls = new FormGroup({
  includeDisabled: new FormControl(true, {nonNullable: true}),
  omitEmptyStrings: new FormControl(false, {nonNullable: true}),
  omitNull: new FormControl(false, {nonNullable: true}),
  omitIf: new FormControl(false, {nonNullable: true}),
  omit: new FormControl(false, {nonNullable: true}),
  deep: new FormControl(false, {nonNullable: true}),
});

private readonly initialOptionsFormValue = this.optionsForm.getRawValue();
private readonly initialOptionsFlags = this.optionsControls.getRawValue();

private readonly optionsChanges = toSignal(
  merge(this.optionsForm.valueChanges, this.optionsForm.statusChanges, this.optionsControls.valueChanges),
);

readonly optionsComparison = computed(() => {
  this.optionsChanges();
  const flags = this.optionsControls.getRawValue();
  return {
    rawValue: this.optionsForm.getRawValue(),
    formValue: this.optionsForm.value,
    submitValue: toSubmitValue(this.optionsForm, {
      includeDisabled: flags.includeDisabled,
      omitEmptyStrings: flags.omitEmptyStrings,
      omitNull: flags.omitNull,
      omitIf: flags.omitIf ? (_value: unknown, key: string) => key.startsWith('internal') : undefined,
      omit: flags.omit ? ['confirmEmail'] : [],
      deep: flags.deep,
    }),
  };
});

readonly optionsInspectorState = computed<Record<string, unknown>>(() => {
  const comparison = this.optionsComparison();
  return {
    rawKeys: Object.keys(comparison.rawValue),
    formValueKeys: Object.keys(comparison.formValue),
    submitKeys: Object.keys(comparison.submitValue),
  };
});

resetOptions(): void {
  this.optionsForm.reset(this.initialOptionsFormValue);
  this.optionsControls.reset(this.initialOptionsFlags);
}`);

  readonly optionsLabHtml = highlight(`<!-- Localized headings and hint text are omitted; see the page template. -->
<form clrForm [formGroup]="optionsControls">
  <clr-toggle-container>
    <label for="options-lab-include-disabled"><code>includeDisabled</code></label>
    <clr-toggle-wrapper>
      <input id="options-lab-include-disabled" type="checkbox" clrToggle formControlName="includeDisabled" />
    </clr-toggle-wrapper>
  </clr-toggle-container>
  <clr-toggle-container>
    <label for="options-lab-omit-empty-strings"><code>omitEmptyStrings</code></label>
    <clr-toggle-wrapper>
      <input id="options-lab-omit-empty-strings" type="checkbox" clrToggle formControlName="omitEmptyStrings" />
    </clr-toggle-wrapper>
  </clr-toggle-container>
  <clr-toggle-container>
    <label for="options-lab-omit-null"><code>omitNull</code></label>
    <clr-toggle-wrapper>
      <input id="options-lab-omit-null" type="checkbox" clrToggle formControlName="omitNull" />
    </clr-toggle-wrapper>
  </clr-toggle-container>
  <clr-toggle-container>
    <label for="options-lab-omit-if"><code>omitIf</code></label>
    <clr-toggle-wrapper>
      <input id="options-lab-omit-if" type="checkbox" clrToggle formControlName="omitIf" />
    </clr-toggle-wrapper>
  </clr-toggle-container>
  <clr-toggle-container>
    <label for="options-lab-omit"><code>omit</code></label>
    <clr-toggle-wrapper>
      <input id="options-lab-omit" type="checkbox" clrToggle formControlName="omit" />
    </clr-toggle-wrapper>
  </clr-toggle-container>
  <clr-toggle-container>
    <label for="options-lab-deep"><code>deep</code></label>
    <clr-toggle-wrapper>
      <input id="options-lab-deep" type="checkbox" clrToggle formControlName="deep" />
    </clr-toggle-wrapper>
  </clr-toggle-container>
  <button type="button" class="btn btn-outline" (click)="resetOptions()">Reset</button>
</form>

<div class="options-lab-columns">
  <div>
    <code>getRawValue()</code>
    <pre data-testid="options-lab-raw">{{ optionsComparison().rawValue | json }}</pre>
  </div>
  <div>
    <code>form.value</code>
    <pre data-testid="options-lab-form-value">{{ optionsComparison().formValue | json }}</pre>
  </div>
  <div>
    <code>toSubmitValue(form, options)</code>
    <pre data-testid="options-lab-submit-value">{{ optionsComparison().submitValue | json }}</pre>
  </div>
</div>

<app-state-inspector [data]="optionsInspectorState()" />`);
}
