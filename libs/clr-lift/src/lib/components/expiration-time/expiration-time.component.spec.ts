import {ComponentFixture, TestBed} from '@angular/core/testing';
import {beforeEach, describe, expect, it} from 'vitest';

import {TranslationService} from '../../services/translation.service';
import {ExpirationTimeComponent} from './expiration-time.component';

describe('ExpirationTimeComponent', () => {
  let component: ExpirationTimeComponent;
  let fixture: ComponentFixture<ExpirationTimeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExpirationTimeComponent],
      providers: [TranslationService],
    }).compileComponents();

    fixture = TestBed.createComponent(ExpirationTimeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render empty placeholder when expiresAt is null or undefined', () => {
    fixture.componentRef.setInput('expiresAt', null);
    fixture.detectChanges();

    const placeholder = fixture.nativeElement.querySelector('.empty-placeholder');
    expect(placeholder.textContent.trim()).toBe('-');
  });

  it('should render custom empty placeholder', () => {
    fixture.componentRef.setInput('expiresAt', undefined);
    fixture.componentRef.setInput('emptyPlaceholder', 'Never');
    fixture.detectChanges();

    const placeholder = fixture.nativeElement.querySelector('.empty-placeholder');
    expect(placeholder.textContent.trim()).toBe('Never');
  });

  it('should render expired indicator when date is in the past', () => {
    const pastDate = new Date(Date.now() - 3600 * 1000).toISOString();
    fixture.componentRef.setInput('expiresAt', pastDate);
    fixture.detectChanges();

    expect(component.isExpired()).toBe(true);
    const expiredSpan = fixture.nativeElement.querySelector('.text-error');
    expect(expiredSpan).toBeTruthy();
    expect(expiredSpan.textContent.trim()).toBe('Expired');
  });

  it('should render time remaining when date is in the future', () => {
    // 2 days and 3 hours in the future
    const futureDate = new Date(Date.now() + (2 * 24 + 3) * 3600 * 1000).toISOString();
    fixture.componentRef.setInput('expiresAt', futureDate);
    fixture.detectChanges();

    expect(component.isExpired()).toBe(false);
    const timeSpan = fixture.nativeElement.querySelector('.time-info');
    expect(timeSpan.textContent).toContain('2 days');
  });
});
