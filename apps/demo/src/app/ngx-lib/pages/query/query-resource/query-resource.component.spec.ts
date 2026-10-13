import {provideHttpClient} from '@angular/common/http';
import {provideHttpClientTesting} from '@angular/common/http/testing';
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {provideNoopAnimations} from '@angular/platform-browser/animations';
import {provideRouter} from '@angular/router';
import {TranslationService} from 'clr-lift';
import {describe, expect, it, beforeEach} from 'vitest';

import {demoTranslations} from '../../../../core/l10n/demo.l10n';
import {QueryResourceDemoComponent} from './query-resource.component';

describe('QueryResourceDemoComponent', () => {
  let component: QueryResourceDemoComponent;
  let fixture: ComponentFixture<QueryResourceDemoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QueryResourceDemoComponent],
      providers: [provideHttpClient(), provideHttpClientTesting(), provideRouter([]), provideNoopAnimations()],
    }).compileComponents();

    const translationService = TestBed.inject(TranslationService);
    translationService.loadTranslationsForComponent('', demoTranslations);

    fixture = TestBed.createComponent(QueryResourceDemoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('handles metric refresh and widget toggle', () => {
    expect(component.metricsQueryA).toBeDefined();
    expect(component.metricsQueryB).toBeDefined();
    component.refreshMetrics();
    expect(component.widgetAShown()).toBe(true);
    component.widgetAShown.set(false);
    expect(component.widgetAShown()).toBe(false);
  });

  it('handles polling toggle', () => {
    expect(component.pollingEnabled()).toBe(false);
    component.togglePolling();
    expect(component.pollingEnabled()).toBe(true);
    component.togglePolling();
    expect(component.pollingEnabled()).toBe(false);
  });

  it('handles user mutation', async () => {
    component.newUserName.set('Test User');
    component.newUserRole.set('Developer');
    component.submitNewUser();
    expect(component.newUserName()).toBe('');
  });

  it('updates live diagnostics snapshot', () => {
    expect(component.diagnostics()).toBeDefined();
    expect(component.diagnostics().entryCount).toBeGreaterThanOrEqual(0);
    component.refreshDiagnostics();
    expect(component.diagnostics().isVisible).toBe(true);
  });
});
