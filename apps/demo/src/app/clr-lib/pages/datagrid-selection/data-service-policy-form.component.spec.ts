import {TestBed} from '@angular/core/testing';
import {provideNoopAnimations} from '@angular/platform-browser/animations';
import {TranslationService} from 'clr-lift';
import {Subject} from 'rxjs';
import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest';

import {enTranslations} from '../../../core/l10n/demo.l10n.en';
import {DataServicePolicyFormComponent} from './data-service-policy-form.component';
import {Organization} from './organization-example.data';
import {registerExampleMessages} from './organization-example.messages';
import {OrganizationService} from './organization.service';

const inventory: Organization[] = [
  {id: 'org-1', name: 'North', status: 'ready'},
  {id: 'org-2', name: 'South', status: 'ready'},
  {id: 'org-4', name: 'West', status: 'ready'},
];

describe('organization selection recovery', () => {
  let requests: Subject<Organization[]>[];

  beforeEach(() => {
    requests = [];
    TestBed.configureTestingModule({
      imports: [DataServicePolicyFormComponent],
      providers: [
        provideNoopAnimations(),
        {
          provide: OrganizationService,
          useValue: {
            list: () => {
              const request = new Subject<Organization[]>();
              requests.push(request);
              return request;
            },
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
    await vi.waitFor(() => expect(requests).toHaveLength(1));
    requests[0].next(inventory);
    requests[0].complete();
    await vi.waitFor(() => {
      fixture.detectChanges();
      expect(fixture.componentInstance.organizationsQuery.status()).toBe('resolved');
    });
    return fixture;
  }

  it('counts every key, rejects unavailable submission, and removes it as an explicit edit', async () => {
    const fixture = await createForm();
    const component = fixture.componentInstance;
    const control = component.form.controls.organizationIds;
    const save = vi.spyOn(component.save, 'emit');

    component.loadSaved();
    expect(control.errors).toEqual({unavailableOrganizations: ['unresolved']});
    component.submit();
    expect(save).not.toHaveBeenCalled();
    expect(control.pristine).toBe(true);
    expect(control.untouched).toBe(true);

    control.setValue(['org-2', 'unresolved', 'org-1', 'org-4']);
    expect(control.errors).toEqual({
      maxlength: {requiredLength: 3, actualLength: 4},
      unavailableOrganizations: ['unresolved'],
    });
    component.readonly.set(true);
    component.removeSelection('unresolved');
    expect(control.value).toContain('unresolved');
    component.readonly.set(false);
    control.disable();
    component.removeSelection('unresolved');
    expect(control.value).toContain('unresolved');
    control.enable();

    component.removeSelection('unresolved');
    expect(control.value).toEqual(['org-2', 'org-1', 'org-4']);
    expect(control.errors).toBeNull();
    expect(control.dirty).toBe(true);
    expect(control.touched).toBe(true);
    component.submit();
    expect(save).toHaveBeenCalledExactlyOnceWith({organizationIds: ['org-2', 'org-1', 'org-4']});
    component.form.reset();
    expect(control.value).toEqual(['org-2']);
    expect(control.pristine).toBe(true);
  });

  it('blocks unverified submission and revalidates Retry without editing saved keys', async () => {
    const fixture = await createForm();
    const component = fixture.componentInstance;
    const control = component.form.controls.organizationIds;
    const save = vi.spyOn(component.save, 'emit');
    component.loadSaved();

    component.organizationsQuery.reload();
    await vi.waitFor(() => {
      fixture.detectChanges();
      expect(requests).toHaveLength(2);
    });
    expect(control.errors).toBeNull();
    component.submit();
    component.removeSelection('unresolved');
    expect(save).not.toHaveBeenCalled();
    expect(control.value).toEqual(['org-2', 'unresolved']);
    requests[1].error(new Error('Offline'));
    await vi.waitFor(() => {
      fixture.detectChanges();
      expect(component.organizationsQuery.status()).toBe('error');
    });
    expect(component.hasUnavailableSelection()).toBe(false);
    component.submit();
    expect(save).not.toHaveBeenCalled();

    component.organizationsQuery.reload();
    await vi.waitFor(() => expect(requests).toHaveLength(3));
    requests[2].next([...inventory, {id: 'unresolved', name: 'Recovered', status: 'ready'}]);
    requests[2].complete();
    await vi.waitFor(() => {
      fixture.detectChanges();
      expect(component.organizationsQuery.status()).toBe('resolved');
    });
    expect(control.value).toEqual(['org-2', 'unresolved']);
    expect(control.errors).toBeNull();
    expect(control.pristine).toBe(true);
    expect(control.untouched).toBe(true);
    component.submit();
    expect(save).toHaveBeenCalledExactlyOnceWith({organizationIds: ['org-2', 'unresolved']});
  });
});
