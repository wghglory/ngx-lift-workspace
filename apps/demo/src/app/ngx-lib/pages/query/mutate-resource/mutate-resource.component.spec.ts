import {provideHttpClient} from '@angular/common/http';
import {provideHttpClientTesting} from '@angular/common/http/testing';
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {provideNoopAnimations} from '@angular/platform-browser/animations';
import {provideRouter} from '@angular/router';
import {TranslationService} from 'clr-lift';
import {beforeEach, describe, expect, it} from 'vitest';

import {demoTranslations} from '../../../../core/l10n/demo.l10n';
import {MutateResourceDemoComponent} from './mutate-resource.component';

describe('MutateResourceDemoComponent', () => {
  let component: MutateResourceDemoComponent;
  let fixture: ComponentFixture<MutateResourceDemoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MutateResourceDemoComponent],
      providers: [provideHttpClient(), provideHttpClientTesting(), provideRouter([]), provideNoopAnimations()],
    }).compileComponents();

    const translationService = TestBed.inject(TranslationService);
    translationService.loadTranslationsForComponent('', demoTranslations);

    fixture = TestBed.createComponent(MutateResourceDemoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('handles member mutation and form reset', async () => {
    component.newMemberName.set('Diana Prince');
    component.newMemberRole.set('Platform Engineer');
    component.submitNewMember();
    expect(component.newMemberName()).toBe('');
  });

  it('handles concurrency triggering and log clearing', () => {
    expect(component.clickCount()).toBe(0);
    component.triggerConcurrencyTest();
    expect(component.clickCount()).toBe(1);
    component.clearLogs();
    expect(component.clickCount()).toBe(0);
    expect(component.concurrencyLogs()).toEqual([]);
  });

  it('handles error simulation toggle and settings save', async () => {
    component.simulateError.set(false);
    await component.onSaveSettings();
    expect(component.saveSuccessMessage()).toBe(true);

    component.simulateError.set(true);
    await component.onSaveSettings();
    expect(component.saveSuccessMessage()).toBe(false);
  });
});
