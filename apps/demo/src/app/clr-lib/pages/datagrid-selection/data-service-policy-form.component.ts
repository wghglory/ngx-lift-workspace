import {JsonPipe} from '@angular/common';
import {
  afterRenderEffect,
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  output,
  signal,
  untracked,
  viewChild,
} from '@angular/core';
import {AbstractControl, FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {ClarityModule} from '@clr/angular';
import {TranslatePipe, TranslationService} from 'clr-lift';
import {mutateResource, queryResource, toSignalForm} from 'ngx-lift';

import {OrganizationPickerComponent} from './organization-picker.component';
import {NamespacePickerComponent} from './namespace-picker.component';
import {STATUS_KEYS, type Organization} from './organization-example.data';
import {type Namespace} from './namespace-example.data';
import {OrganizationService} from './organization.service';
import {NamespaceService} from './namespace.service';

interface PolicyDetail {
  policyName: string;
  namespaceId: string | null;
  organizationIds: string[];
}

type PolicySaveDto =
  | {mode: 'id-only'; policyName: string; namespaceId: string | null; organizationIds: string[]}
  | {mode: 'reference'; policyName: string; namespace: {id: string | null}; organizations: {id: string}[]}
  | {mode: 'full-entity'; policyName: string; namespace: Namespace | null; organizations: Organization[]};

type DtoMode = 'id-only' | 'reference' | 'full-entity';

/**
 * Data service policy create/edit form. It hosts reusable organization and namespace pickers
 * (each owning its inventory query) and owns the detail read, the validators, the accepted
 * baseline and the save. Reset restores the accepted baseline with no backend call; save
 * converts the selected keys into ID-only, reference or full-entity DTOs and never silently
 * drops an unresolved key.
 */
@Component({
  selector: 'app-data-service-policy-form',
  imports: [
    ClarityModule,
    JsonPipe,
    ReactiveFormsModule,
    TranslatePipe,
    OrganizationPickerComponent,
    NamespacePickerComponent,
  ],
  templateUrl: './data-service-policy-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DataServicePolicyFormComponent {
  private readonly translationService = inject(TranslationService);
  private readonly organizationService = inject(OrganizationService);
  private readonly namespaceService = inject(NamespaceService);
  private readonly organizationPickerRef = viewChild(OrganizationPickerComponent);
  private readonly namespacePickerRef = viewChild(NamespacePickerComponent);

  readonly maximumOrganizations = 3;
  readonly policyId = signal('policy-1');
  readonly editMode = signal(true);
  readonly dtoMode = signal<DtoMode>('id-only');
  readonly readonly = signal(false);
  readonly layout = signal<'horizontal' | 'vertical'>('vertical');
  readonly saved = signal(false);
  readonly saving = signal(false);
  readonly saveError = signal('');
  readonly submitted = signal<PolicySaveDto | null>(null);
  private readonly hydrated = signal(false);
  private readonly baseline = signal<PolicyDetail>({
    policyName: '',
    namespaceId: null,
    organizationIds: [],
  });

  // Independent detail read (stand-in for a policy service). Returns the accepted detail on
  // edit; for create it resolves to null so the form opens empty and enabled.
  readonly policyDetailQuery = queryResource(() =>
    this.editMode()
      ? {
          key: ['policy', 'detail', this.policyId()],
          loader: async (): Promise<PolicyDetail> => {
            await new Promise((resolve) => setTimeout(resolve, 300));
            return {
              policyName: 'Data service policy',
              namespaceId: 'ns-1',
              organizationIds: ['org-1', 'org-2'],
            };
          },
        }
      : {
          key: ['policy', 'detail', 'none'],
          loader: async (): Promise<PolicyDetail | null> => null,
        },
  );

  readonly form = new FormGroup({
    policyName: new FormControl('', {nonNullable: true, validators: [Validators.required]}),
    namespaceId: new FormControl<string | null>(null, {validators: [Validators.required]}),
    organizationIds: new FormControl<string[]>([], {
      nonNullable: true,
      validators: [
        Validators.required,
        Validators.maxLength(this.maximumOrganizations),
        this.orgUnavailableValidator(),
      ],
    }),
  });
  readonly sf = toSignalForm(this.form, {
    includeDisabled: false,
    omitIf: (_value, key) => this.form.get(key)?.disabled ?? false,
  });

  private readonly orgQuery = computed(() => this.organizationPickerRef()?.organizationsQuery);
  private readonly nsQuery = computed(() => this.namespacePickerRef()?.namespacesQuery);
  readonly verifiedOrgs = computed<Organization[] | undefined>(() => this.orgQuery()?.value());
  readonly verifiedNamespaces = computed<Namespace[] | undefined>(() => this.nsQuery()?.value());
  readonly loading = computed(
    () => this.orgQuery()?.isLoading() || this.nsQuery()?.isLoading() || this.policyDetailQuery.isLoading() || false,
  );

  readonly selectedOrganizations = computed(() => {
    const inventory = new Map((this.verifiedOrgs() ?? []).map((item) => [item.id, item]));
    const selected = this.sf.fields.organizationIds.value();
    return selected.map((id) => ({
      id,
      name: inventory.get(id)?.name,
      unavailable: !inventory.has(id),
    }));
  });
  readonly hasUnavailableSelection = computed(() => this.selectedOrganizations().some((item) => item.unavailable));
  readonly unavailableNamespaceId = computed(() => {
    const id = this.sf.fields.namespaceId.value();
    if (!id) return null;
    return this.verifiedNamespaces()?.some((item) => item.id === id) ? null : id;
  });
  // Warning-only status, distinct from the eligibility error: near the selection limit.
  readonly warning = computed(
    () =>
      this.form.controls.organizationIds.value.length === this.maximumOrganizations &&
      this.form.controls.organizationIds.valid,
  );

  readonly orgSelectionError = computed(() => this.selectionErrorFor('organizationIds'));
  readonly namespaceSelectionError = computed(() => this.selectionErrorFor('namespaceId'));

  readonly statusKeys = STATUS_KEYS;
  readonly organizationKey = (item: Organization) => item.id;
  readonly namespaceKey = (item: Namespace) => item.id;
  readonly save = output<PolicySaveDto>();

  readonly saveMutation = mutateResource(
    async (dto: PolicySaveDto): Promise<PolicySaveDto> => {
      const organizationIds = dto.mode === 'id-only' ? dto.organizationIds : dto.organizations.map((item) => item.id);
      const namespaceId = dto.mode === 'id-only' ? dto.namespaceId : (dto.namespace?.id ?? null);
      const unresolved = this.unresolvedKeys(organizationIds, namespaceId);
      if (unresolved.length) {
        throw new Error(this.translationService.translate('policyExample.unresolvedKeyError'));
      }
      await new Promise((resolve) => setTimeout(resolve, 400));
      return dto;
    },
    {concurrency: 'exhaust'},
  );

  constructor() {
    // The form opens disabled so an inventory-first arrival cannot present a blank editable
    // form as the accepted policy; the detail hydration enables it once.
    this.form.disable();
    // Re-run the membership validator as the verified inventories settle.
    this.sf.revalidate(this.form.controls.organizationIds, this.verifiedOrgs);
    this.sf.revalidate(this.form.controls.namespaceId, this.verifiedNamespaces);
    // Hydrate from the accepted detail once, then enable editing. Until then the form stays
    // disabled so an inventory-first arrival cannot present a blank editable form as saved.
    effect(() => {
      if (this.hydrated()) return;
      const detail = this.policyDetailQuery.value();
      if (detail === undefined) return;
      untracked(() => this.hydrateFromDetail(detail));
    });
    afterRenderEffect(() => {
      const picker = this.organizationPickerRef();
      this.translationService.locale();
      untracked(() => picker?.refreshGridItems());
    });
  }

  private hydrateFromDetail(detail: PolicyDetail | null): void {
    if (detail) {
      this.form.setValue(
        {policyName: detail.policyName, namespaceId: detail.namespaceId, organizationIds: [...detail.organizationIds]},
        {emitEvent: false},
      );
      this.baseline.set({
        policyName: detail.policyName,
        namespaceId: detail.namespaceId,
        organizationIds: [...detail.organizationIds],
      });
    } else {
      this.form.reset({policyName: '', namespaceId: null, organizationIds: []}, {emitEvent: false});
      this.baseline.set({policyName: '', namespaceId: null, organizationIds: []});
    }
    this.form.markAsPristine();
    this.form.markAsUntouched();
    this.form.enable();
    this.hydrated.set(true);
  }

  private orgUnavailableValidator() {
    return (control: AbstractControl): {unavailableOrganizations: string[]} | null => {
      const value = (control.value as string[] | null) ?? [];
      if (!value.length) return null;
      const inventory = this.verifiedOrgs();
      if (!inventory) return null;
      const available = new Set(inventory.map((item) => item.id));
      const missing = value.filter((key) => !available.has(key));
      return missing.length ? {unavailableOrganizations: missing} : null;
    };
  }

  private selectionErrorFor(controlName: 'organizationIds' | 'namespaceId'): string {
    const errors = this.sf.fields[controlName].errors();
    if (!errors) return '';
    if (errors['required']) return this.translationService.translate('organizationExample.required');
    if (errors['maxlength']) return this.translationService.translate('organizationExample.maxOrganizations');
    if (errors['unavailableOrganizations'] || errors['unavailableNamespace']) {
      return this.translationService.translate('selectionDemo.unavailableError');
    }
    return this.translationService.translate('organizationExample.invalidSelection');
  }

  private unresolvedKeys(organizationIds: string[], namespaceId: string | null): string[] {
    const organizations = this.verifiedOrgs();
    const namespaces = this.verifiedNamespaces();
    const missing: string[] = [];
    if (namespaceId && !namespaces?.some((item) => item.id === namespaceId)) missing.push(namespaceId);
    if (organizations) {
      for (const id of organizationIds) {
        if (!organizations.some((item) => item.id === id)) missing.push(id);
      }
    }
    return missing;
  }

  private buildDto(mode: DtoMode): PolicySaveDto {
    const policyName = this.form.controls.policyName.value;
    const namespaceId = this.form.controls.namespaceId.value;
    const organizationIds = [...this.form.controls.organizationIds.value];
    if (mode === 'id-only') {
      return {mode, policyName, namespaceId, organizationIds};
    }
    if (mode === 'reference') {
      return {
        mode,
        policyName,
        namespace: {id: namespaceId},
        organizations: organizationIds.map((id) => ({id})),
      };
    }
    const namespace = this.verifiedNamespaces()?.find((item) => item.id === namespaceId) ?? null;
    const organizations = organizationIds
      .map((id) => this.verifiedOrgs()?.find((item) => item.id === id))
      .filter((item): item is Organization => item !== undefined);
    return {mode, policyName, namespace, organizations};
  }

  private acceptBaseline(dto: PolicySaveDto): void {
    const namespaceId = dto.mode === 'id-only' ? dto.namespaceId : (dto.namespace?.id ?? null);
    this.baseline.set({
      policyName: dto.policyName,
      namespaceId,
      organizationIds: dto.mode === 'id-only' ? [...dto.organizationIds] : dto.organizations.map((item) => item.id),
    });
    this.form.markAsPristine();
    this.form.markAsUntouched();
  }

  selectionLocked(): boolean {
    return this.readonly() || this.form.disabled || this.loading();
  }

  toggleDisabled(): void {
    if (this.form.disabled) this.form.enable();
    else this.form.disable();
  }

  removeSelection(id: string): void {
    if (this.selectionLocked()) return;
    const control = this.form.controls.organizationIds;
    control.setValue(control.value.filter((key) => key !== id));
    control.markAsDirty();
    control.markAsTouched();
    this.organizationPickerRef()?.focusGrid();
  }

  retryVerification(): void {
    this.organizationPickerRef()?.focusGrid();
    this.organizationPickerRef()?.organizationsQuery.reload();
    this.namespacePickerRef()?.namespacesQuery.reload();
  }

  /** Re-read the accepted detail and discard pending edits. */
  reloadDetail(): void {
    this.hydrated.set(false);
    this.policyDetailQuery.reload();
  }

  reset(): void {
    const baseline = this.baseline();
    this.form.reset(
      {
        policyName: baseline.policyName,
        namespaceId: baseline.namespaceId,
        organizationIds: [...baseline.organizationIds],
      },
      {emitEvent: false},
    );
    this.form.markAsPristine();
    this.form.markAsUntouched();
    this.saved.set(false);
    this.saveError.set('');
    this.submitted.set(null);
  }

  async submit(): Promise<void> {
    if (this.form.disabled || this.selectionLocked()) return;
    if (this.sf.invalid() || this.sf.pending()) {
      this.form.markAllAsTouched();
      return;
    }
    if (!this.verifiedOrgs() || !this.verifiedNamespaces()) return;
    const organizationIds = this.form.controls.organizationIds.value;
    const namespaceId = this.form.controls.namespaceId.value;
    if (this.unresolvedKeys(organizationIds, namespaceId).length) {
      this.saved.set(false);
      this.saveError.set(this.translationService.translate('policyExample.unresolvedKeyError'));
      return;
    }
    const dto = this.buildDto(this.dtoMode());
    this.saving.set(true);
    this.saveError.set('');
    try {
      const saved = await this.saveMutation.mutate(dto);
      this.acceptBaseline(dto);
      this.saved.set(true);
      this.submitted.set(saved);
      this.save.emit(saved);
    } catch (error) {
      this.saved.set(false);
      this.saveError.set(
        error instanceof Error ? error.message : this.translationService.translate('policyExample.saveError'),
      );
    } finally {
      this.saving.set(false);
    }
  }
}
