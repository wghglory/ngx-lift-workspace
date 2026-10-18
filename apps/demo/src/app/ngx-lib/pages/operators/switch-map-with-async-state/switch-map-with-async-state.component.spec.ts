import {TranslationService} from 'clr-lift';
import {enTranslations} from '../../../../core/l10n/demo.l10n.en';
import {afterEach, vi} from 'vitest';
import {provideHttpClient} from '@angular/common/http';
import {provideHttpClientTesting} from '@angular/common/http/testing';
import {provideNoopAnimations} from '@angular/platform-browser/animations';
import {ComponentFixture, TestBed} from '@angular/core/testing';

import {SwitchMapWithAsyncStateComponent} from './switch-map-with-async-state.component';

describe('SwitchMapWithAsyncStateComponent', () => {
  let component: SwitchMapWithAsyncStateComponent;
  let fixture: ComponentFixture<SwitchMapWithAsyncStateComponent>;

  beforeEach(async () => {
    vi.useFakeTimers();
    await TestBed.configureTestingModule({
      imports: [SwitchMapWithAsyncStateComponent],
      providers: [provideHttpClient(), provideHttpClientTesting(), provideNoopAnimations()],
    }).compileComponents();

    const translations = TestBed.inject(TranslationService);
    translations.loadTranslationsForComponent('', {en: enTranslations});
    translations.setLanguage('en');
    fixture = TestBed.createComponent(SwitchMapWithAsyncStateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  afterEach(() => {
    fixture.destroy();
    vi.useRealTimers();
  });

  it('shows loading, failure, recovery, and only the latest replacement read', async () => {
    const starter = () => fixture.nativeElement.querySelector('app-demo-playground');
    await vi.advanceTimersByTimeAsync(350);
    fixture.detectChanges();
    expect(starter().querySelector('output').textContent).toContain('resolved');
    component.failure.set(true);
    component.request$.next(2);
    fixture.detectChanges();
    expect(starter().querySelector('output').textContent).toContain('loading');
    await vi.advanceTimersByTimeAsync(350);
    fixture.detectChanges();
    expect(starter().querySelector('cll-alert').textContent).toContain('Simulated read failure');
    component.failure.set(false);
    component.request$.next(3);
    await vi.advanceTimersByTimeAsync(100);
    component.request$.next(4);
    await vi.advanceTimersByTimeAsync(350);
    fixture.detectChanges();
    expect(starter().querySelector('output').textContent).toContain('resolved · 4');
    expect(starter().querySelector('cll-alert')).toBeNull();
  });
});
