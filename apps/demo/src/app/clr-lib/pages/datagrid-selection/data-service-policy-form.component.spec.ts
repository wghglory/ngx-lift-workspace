import {TestBed} from '@angular/core/testing';
import {provideNoopAnimations} from '@angular/platform-browser/animations';
import {TranslationService} from 'clr-lift';
import {of} from 'rxjs';
import {afterEach, beforeEach, describe, expect, it} from 'vitest';

import {enTranslations} from '../../../core/l10n/demo.l10n.en';
import {DataServicePolicyFormComponent} from './data-service-policy-form.component';
import {Organization, type Status} from './organization-example.data';
import {type Namespace} from './namespace-example.data';
import {registerExampleMessages} from './organization-example.messages';
import {OrganizationService} from './organization.service';
import {NamespaceService} from './namespace.service';

type Org = Organization;
type Ns = Namespace;

const organizations: Org[] = [
  {id: 'org-1', name: 'Organization 1', status: 'ready' as Status},
  {id: 'org-2', name: 'Organization 2', status: 'ready' as Status},
  {id: 'org-4', name: 'Organization 4', status: 'ready' as Status},
];
const namespaces: Ns[] = [
  {id: 'ns-1', name: 'Production', status: 'ready' as Status},
  {id: 'ns-3', name: 'Sandbox', status: 'maintenance' as Status},
];

describe('DataServicePolicyFormComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [DataServicePolicyFormComponent],
      providers: [
        provideNoopAnimations(),
        {
          provide: OrganizationService,
          useValue: {
            listQuery: () => ({
              key: ['organizations', 'list', 'scope-1'],
              staleTime: 60_000,
              loader: () => of(organizations),
            }),
          },
        },
        {
          provide: NamespaceService,
          useValue: {
            listQuery: () => ({
              key: ['namespaces', 'list', 'scope-1'],
              staleTime: 60_000,
              loader: () => of(namespaces),
            }),
          },
        },
      ],
    });
    const translations = TestBed.inject(TranslationService);
    translations.loadTranslationsForComponent('', {en: enTranslations});
    registerExampleMessages(translations);
    translations.setLanguage('en', false);
  });

  afterEach(() => TestBed.resetTestingModule());

  async function createForm() {
    const fixture = TestBed.createComponent(DataServicePolicyFormComponent);
    fixture.detectChanges();
    // Detail resolves after a short delay and hydrates + enables the form.
    await vi.waitFor(() => expect(fixture.componentInstance.form.enabled).toBe(true));
    // Inventories must also be verified before a save can proceed.
    await vi.waitFor(() => expect(fixture.componentInstance.verifiedOrgs()).toBeDefined());
    await vi.waitFor(() => expect(fixture.componentInstance.verifiedNamespaces()).toBeDefined());
    fixture.detectChanges();
    return fixture;
  }

  it('hydrates from the accepted detail and enables editing without dirty/touched echoes', async () => {
    const fixture = await createForm();
    const component = fixture.componentInstance;
    expect(component.form.controls.policyName.value).toBe('Data service policy');
    expect(component.form.controls.namespaceId.value).toBe('ns-1');
    expect(component.form.controls.organizationIds.value).toEqual(['org-1', 'org-2']);
    expect(component.form.pristine).toBe(true);
    expect(component.form.untouched).toBe(true);
  });

  it('reset restores the accepted baseline with no backend call and clears dirty/touched', async () => {
    const fixture = await createForm();
    const component = fixture.componentInstance;
    component.form.controls.policyName.setValue('Changed');
    component.form.controls.organizationIds.setValue(['org-1', 'org-4']);
    component.form.markAsDirty();
    component.form.markAsTouched();
    expect(component.form.dirty).toBe(true);

    component.reset();
    expect(component.form.controls.policyName.value).toBe('Data service policy');
    expect(component.form.controls.organizationIds.value).toEqual(['org-1', 'org-2']);
    expect(component.form.pristine).toBe(true);
    expect(component.form.untouched).toBe(true);
    expect(component.saved()).toBe(false);
  });

  it('save converts the selection into an ID-only DTO and accepts a new baseline', async () => {
    const fixture = await createForm();
    const component = fixture.componentInstance;
    const save = vi.spyOn(component.save, 'emit');
    component.dtoMode.set('id-only');
    await component.submit();
    await vi.waitFor(() => expect(component.submitted()).not.toBeNull());
    expect(component.submitted()).toMatchObject({
      mode: 'id-only',
      policyName: 'Data service policy',
      namespaceId: 'ns-1',
      organizationIds: ['org-1', 'org-2'],
    });
    expect(component.saved()).toBe(true);
    expect(component.form.pristine).toBe(true);
    expect(save).toHaveBeenCalledOnce();
  });

  it('save resolves a full-entity DTO with every selected key', async () => {
    const fixture = await createForm();
    const component = fixture.componentInstance;
    component.dtoMode.set('full-entity');
    await component.submit();
    await vi.waitFor(() => expect(component.submitted()).not.toBeNull());
    const dto = component.submitted() as {mode: string; organizations: Org[]};
    expect(dto.mode).toBe('full-entity');
    expect(dto.organizations.map((o) => o.id)).toEqual(['org-1', 'org-2']);
  });

  it('blocks a save with an unresolved key (availability validator) without losing edits', async () => {
    const fixture = await createForm();
    const component = fixture.componentInstance;
    component.form.controls.organizationIds.setValue(['org-1', 'unresolved']);
    component.form.controls.organizationIds.markAsDirty();
    await component.submit();
    // The availability validator marks the key unavailable, so submit is blocked and edits persist.
    expect(component.form.controls.organizationIds.errors).toMatchObject({unavailableOrganizations: ['unresolved']});
    expect(component.submitted()).toBeNull();
    expect(component.form.controls.organizationIds.value).toEqual(['org-1', 'unresolved']);
    expect(component.form.dirty).toBe(true);
  });
});
