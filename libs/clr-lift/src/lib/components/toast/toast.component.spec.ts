import {NO_ERRORS_SCHEMA} from '@angular/core';
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {By} from '@angular/platform-browser';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';
import {vi} from 'vitest';

import {TranslationService} from '../../services/translation.service';
import {MockTranslationService} from '../../services/translation.service.mock';
import {ToastComponent} from './toast.component';

describe('ToastComponent', () => {
  let component: ToastComponent;
  let fixture: ComponentFixture<ToastComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ToastComponent, NoopAnimationsModule],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [{provide: TranslationService, useClass: MockTranslationService}],
    });

    fixture = TestBed.createComponent(ToastComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit closed event when close method is called', () => {
    fixture.componentRef.setInput('manualClosable', true);
    const closedSpy = vi.spyOn(component.closed, 'emit');

    component.close(true);

    expect(closedSpy).toHaveBeenCalledWith(true);
  });

  it('should emit primaryButtonClick when primary button is clicked', () => {
    fixture.componentRef.setInput('primaryButtonText', 'Primary Button');
    const primaryButtonClickSpy = vi.spyOn(component.primaryButtonClick, 'emit');

    fixture.detectChanges();

    const primaryButton = fixture.debugElement.query(By.css('.toast-button'));
    primaryButton.triggerEventHandler('click', null);
    expect(primaryButtonClickSpy).toHaveBeenCalled();
  });

  it('should emit secondaryButtonClick when secondary button is clicked', () => {
    fixture.componentRef.setInput('secondaryButtonText', 'Secondary Button');
    const secondaryButtonClickSpy = vi.spyOn(component.secondaryButtonClick, 'emit');

    fixture.detectChanges();

    const secondaryButton = fixture.debugElement.query(By.css('.toast-button.secondary'));
    secondaryButton.triggerEventHandler('click', null);
    expect(secondaryButtonClickSpy).toHaveBeenCalled();
  });
  it('cancels auto-close timers when destroyed', () => {
    vi.useFakeTimers();
    try {
      fixture.componentRef.setInput('timeoutSeconds', 1);
      fixture.detectChanges();
      expect(vi.getTimerCount()).toBeGreaterThan(0);

      fixture.destroy();
      expect(vi.getTimerCount()).toBe(0);
    } finally {
      vi.useRealTimers();
    }
  });
});

describe('ToastComponent accessible translations', () => {
  it('uses the available success icon label', () => {
    TestBed.configureTestingModule({imports: [ToastComponent, NoopAnimationsModule]});
    const fixture = TestBed.createComponent(ToastComponent);
    fixture.componentRef.setInput('toastType', 'success');
    fixture.componentRef.setInput('timeoutSeconds', 0);
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('svg').getAttribute('aria-label')).toBe('Success Icon');
  });
});
