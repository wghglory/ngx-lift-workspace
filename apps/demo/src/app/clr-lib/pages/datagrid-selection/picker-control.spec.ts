import {ComponentFixture, TestBed} from '@angular/core/testing';
import {FormControl, NgControl} from '@angular/forms';
import {By} from '@angular/platform-browser';
import {provideNoopAnimations} from '@angular/platform-browser/animations';
import {DatagridSelectionComponent, TranslationService} from 'clr-lift';
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

/** Verifies Angular binds the original owner directly and cleans up replaced/destroyed bindings. */
function expectDirectControl<T>(fixture: ComponentFixture<T>, first: FormControl, replacement: FormControl): void {
  fixture.componentRef.setInput('control', first);
  fixture.detectChanges();
  const field = fixture.debugElement.query(By.directive(DatagridSelectionComponent));
  const selection: DatagridSelectionComponent = field.componentInstance;
  const owner = field.injector.get(NgControl);
  expect(owner.control).toBe(first);
  const writeValue = vi.spyOn(selection, 'writeValue');

  first.setValue(replacement.value);
  expect(writeValue).toHaveBeenLastCalledWith(replacement.value);
  first.reset();
  expect(writeValue).toHaveBeenLastCalledWith(null);

  fixture.componentRef.setInput('control', replacement);
  fixture.detectChanges();
  expect(owner.control).toBe(replacement);
  expect(writeValue).toHaveBeenLastCalledWith(replacement.value);
  writeValue.mockClear();
  first.setValue(first.defaultValue);
  expect(writeValue).not.toHaveBeenCalled();

  replacement.reset();
  expect(writeValue).toHaveBeenLastCalledWith(null);
  writeValue.mockClear();
  fixture.destroy();
  replacement.setValue(replacement.defaultValue);
  expect(writeValue).not.toHaveBeenCalled();
}

describe('Reusable picker direct form binding', () => {
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

  it('organization picker binds the page control through edits, reset and replacement', () => {
    expectDirectControl(
      TestBed.createComponent(OrganizationPickerComponent),
      new FormControl<string[] | null>(['org-1']),
      new FormControl<string[] | null>(['org-2']),
    );
  });

  it('namespace picker binds the page control through edits, reset and replacement', () => {
    expectDirectControl(
      TestBed.createComponent(NamespacePickerComponent),
      new FormControl<string | null>('ns-1'),
      new FormControl<string | null>('ns-2'),
    );
  });

  it('server picker binds the page control through edits, reset and replacement', () => {
    expectDirectControl(
      TestBed.createComponent(ServerOrganizationPickerComponent),
      new FormControl<string[] | null>(['org-1']),
      new FormControl<string[] | null>(['org-2']),
    );
  });
});
