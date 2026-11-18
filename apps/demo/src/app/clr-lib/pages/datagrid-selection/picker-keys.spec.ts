import {ComponentFixture, TestBed} from '@angular/core/testing';
import {FormControl} from '@angular/forms';
import {provideNoopAnimations} from '@angular/platform-browser/animations';
import {TranslationService} from 'clr-lift';
import {of} from 'rxjs';
import {beforeEach, describe, expect, it, vi} from 'vitest';

import {enTranslations} from '../../../core/l10n/demo.l10n.en';
import {NamespacePickerComponent} from './namespace-picker.component';
import {type Namespace} from './namespace-example.data';
import {NamespaceService} from './namespace.service';
import {OrganizationPickerComponent} from './organization-picker.component';
import {type Organization} from './organization-example.data';
import {registerExampleMessages} from './organization-example.messages';
import {OrganizationService} from './organization.service';
import {ServerOrganizationPickerComponent} from './server-organization-picker.component';
import {ServerOrganizationService} from './server-organization.service';

const organizations: Organization[] = [{id: 'org-1', name: 'Organization 1', status: 'ready'}];
const namespaces: Namespace[] = [{id: 'ns-1', name: 'Production', status: 'ready'}];

/** Waits for the toObservable bridge and the keys effect to flush. */
async function expectKeys<T extends {keys: () => unknown}>(
  fixture: ComponentFixture<T>,
  expected: unknown,
): Promise<void> {
  await vi.waitFor(() => {
    fixture.detectChanges();
    expect(fixture.componentInstance.keys()).toEqual(expected);
  });
}

describe('Reusable picker keys bridge', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
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
        {
          provide: ServerOrganizationService,
          useValue: {
            listQuery: (query: object) => ({
              key: ['server-organizations', query],
              staleTime: 30_000,
              loader: () => of({items: [], total: 0}),
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

  it('organization picker follows selection, reset and control replacement', async () => {
    const fixture = TestBed.createComponent(OrganizationPickerComponent);
    const keysChanged = vi.fn();
    fixture.componentInstance.keys.subscribe(keysChanged);
    const first = new FormControl<string[] | null>(['org-1']);
    fixture.componentRef.setInput('control', first);
    fixture.detectChanges();
    await expectKeys(fixture, ['org-1']);

    first.setValue([]);
    await expectKeys(fixture, []);
    expect(keysChanged).toHaveBeenLastCalledWith([]);

    first.reset();
    await expectKeys(fixture, null);
    expect(keysChanged).toHaveBeenLastCalledWith(null);

    const replacement = new FormControl<string[] | null>(['org-2']);
    fixture.componentRef.setInput('control', replacement);
    await expectKeys(fixture, ['org-2']);

    replacement.setValue(['org-3']);
    await expectKeys(fixture, ['org-3']);

    first.setValue(['org-1']);
    await expectKeys(fixture, ['org-3']);
    expect(keysChanged).toHaveBeenLastCalledWith(['org-3']);

    keysChanged.mockClear();
    fixture.destroy();
    replacement.setValue(['org-4']);
    expect(keysChanged).not.toHaveBeenCalled();
  });

  it('namespace picker follows selection, reset and control replacement', async () => {
    const fixture = TestBed.createComponent(NamespacePickerComponent);
    const first = new FormControl<string | null>('ns-1');
    fixture.componentRef.setInput('control', first);
    fixture.detectChanges();
    await expectKeys(fixture, 'ns-1');

    first.setValue(null);
    await expectKeys(fixture, null);

    first.setValue('ns-2');
    await expectKeys(fixture, 'ns-2');

    const replacement = new FormControl<string | null>('ns-3');
    fixture.componentRef.setInput('control', replacement);
    await expectKeys(fixture, 'ns-3');

    first.setValue('ns-4');
    await expectKeys(fixture, 'ns-3');
  });

  it('server picker follows selection, reset and control replacement', async () => {
    const fixture = TestBed.createComponent(ServerOrganizationPickerComponent);
    const first = new FormControl<string[] | null>(['org-1']);
    fixture.componentRef.setInput('control', first);
    fixture.detectChanges();
    await expectKeys(fixture, ['org-1']);

    first.setValue([]);
    await expectKeys(fixture, []);

    first.reset();
    await expectKeys(fixture, null);

    const replacement = new FormControl<string[] | null>(['org-2']);
    fixture.componentRef.setInput('control', replacement);
    await expectKeys(fixture, ['org-2']);

    first.setValue(['org-5']);
    await expectKeys(fixture, ['org-2']);
  });
});
