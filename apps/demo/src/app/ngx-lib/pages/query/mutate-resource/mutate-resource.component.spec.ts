import {provideHttpClient} from '@angular/common/http';
import {provideHttpClientTesting} from '@angular/common/http/testing';
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {provideNoopAnimations} from '@angular/platform-browser/animations';
import {provideRouter} from '@angular/router';
import {TranslationService} from 'clr-lift';
import {beforeEach, describe, expect, it, vi} from 'vitest';

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

  it('runs per-call outcome callbacks for successful and failed writes', async () => {
    component.submitCallbackWrite(false);
    await vi.waitFor(() => expect(component.callbackOutcome()).toBe('success'), {timeout: 3000});
    expect(component.callbackBusy()).toBe(false);

    component.submitCallbackWrite(true);
    await vi.waitFor(() => expect(component.callbackOutcome()).toBe('error'), {timeout: 3000});
    expect(component.callbackBusy()).toBe(false);
  });

  it('issues one call per row and settles every row, including a partial failure', async () => {
    const pending = component.submitBatch(true);
    expect(component.isBatchRunning()).toBe(true);
    await pending;
    expect(component.isBatchRunning()).toBe(false);
    expect(component.batchOutcomes()['item-1']).toBe('success');
    expect(component.batchOutcomes()['item-2']).toBe('failed');
    expect(component.batchOutcomes()['item-3']).toBe('success');

    await component.submitBatch(false);
    expect(Object.values(component.batchOutcomes())).toEqual(['success', 'success', 'success']);
  });

  it('renders idle, saving and settled batch states in order', async () => {
    const statuses = () =>
      Array.from(fixture.nativeElement.querySelectorAll('[data-test-id="batch-status"]')).map(
        (cell: Element) => cell.textContent?.trim() ?? '',
      );

    fixture.detectChanges();
    expect(Object.values(component.batchOutcomes())).toEqual(['idle', 'idle', 'idle']);
    expect(statuses()).toEqual(['', '', '']);

    const pending = component.submitBatch(true);
    fixture.detectChanges();
    expect(statuses()).toEqual(['Saving...', 'Saving...', 'Saving...']);

    await pending;
    fixture.detectChanges();
    expect(statuses()).toEqual(['Saved', 'Failed', 'Saved']);
  });
});
