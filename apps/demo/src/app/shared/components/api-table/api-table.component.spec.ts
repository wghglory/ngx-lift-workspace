import {ComponentFixture, TestBed} from '@angular/core/testing';
import {TranslationService} from 'clr-lift';
import {describe, expect, it} from 'vitest';

import {demoTranslations} from '../../../core/l10n/demo.l10n';
import {ApiTableComponent} from './api-table.component';
import {ApiProperty} from './api-table.model';

describe('ApiTableComponent', () => {
  let component: ApiTableComponent;
  let fixture: ComponentFixture<ApiTableComponent>;

  const mockProperties: ApiProperty[] = [
    {
      name: 'inputProp',
      type: 'string',
      defaultValue: "'test'",
      required: true,
      description: 'A test input property.',
    },
    {
      name: 'optionalProp',
      type: 'boolean',
      defaultValue: 'false',
      description: 'An optional boolean property.',
    },
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ApiTableComponent],
      providers: [TranslationService],
    }).compileComponents();

    const translationService = TestBed.inject(TranslationService);
    translationService.loadTranslationsForComponent('', demoTranslations);
    translationService.setLanguage('en');

    fixture = TestBed.createComponent(ApiTableComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('properties', mockProperties);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render all property rows', () => {
    const rows = fixture.nativeElement.querySelectorAll('tbody tr');
    expect(rows.length).toBe(2);
  });

  it('should display required badge when property is required', () => {
    const requiredBadge = fixture.nativeElement.querySelector('.prop-required');
    expect(requiredBadge).toBeTruthy();
  });

  it('should show Default column when at least one property has default value', () => {
    expect(component.hasDefault()).toBe(true);
    const ths = fixture.nativeElement.querySelectorAll('th');
    const headerTexts = Array.from(ths).map((th) => (th as HTMLTableCellElement).textContent?.trim());
    expect(headerTexts).toContain('Default');
  });

  it('should hide Default column when no properties have default values', () => {
    const noDefaultProps: ApiProperty[] = [
      {
        name: 'outputEvent',
        type: 'EventEmitter<void>',
        description: 'Emitted when event happens.',
      },
    ];
    fixture.componentRef.setInput('properties', noDefaultProps);
    fixture.detectChanges();

    expect(component.hasDefault()).toBe(false);
    const ths = fixture.nativeElement.querySelectorAll('th');
    const headerTexts = Array.from(ths).map((th) => (th as HTMLTableCellElement).textContent?.trim());
    expect(headerTexts).not.toContain('Default');
  });

  it('should hide Type column when no properties have types', () => {
    const noTypeProps: ApiProperty[] = [
      {
        name: 'methodName()',
        description: 'Does something without type.',
      },
    ];
    fixture.componentRef.setInput('properties', noTypeProps);
    fixture.detectChanges();

    expect(component.hasType()).toBe(false);
    const ths = fixture.nativeElement.querySelectorAll('th');
    const headerTexts = Array.from(ths).map((th) => (th as HTMLTableCellElement).textContent?.trim());
    expect(headerTexts).not.toContain('Type');
  });
});
