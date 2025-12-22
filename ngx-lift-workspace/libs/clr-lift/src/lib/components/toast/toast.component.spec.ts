import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { vi } from 'vitest';

import { TranslationService } from '../../services/translation.service';
import { MockTranslationService } from '../../services/translation.service.mock';
import { ToastComponent } from './toast.component';

describe('ToastComponent', () => {
  let component: ToastComponent;
  let fixture: ComponentFixture<ToastComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ToastComponent, NoopAnimationsModule],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        { provide: TranslationService, useClass: MockTranslationService },
      ],
    });

    fixture = TestBed.createComponent(ToastComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set animation as false when close method is called', () => {
    fixture.componentRef.setInput('manualClosable', true);
    // const closedSpy = vi.spyOn(component.closed, 'emit');

    component.close();

    // expect(closedSpy).toHaveBeenCalledWith(false);  // due to setTimeout
    expect(component.animate).toBeFalsy();
  });

  it('should emit primaryButtonClick when primary button is clicked', () => {
    fixture.componentRef.setInput('primaryButtonText', 'Primary Button');
    const primaryButtonClickSpy = vi.spyOn(
      component.primaryButtonClick,
      'emit',
    );

    fixture.detectChanges();

    const primaryButton = fixture.debugElement.query(By.css('.toast-button'));
    primaryButton.triggerEventHandler('click', null);
    expect(primaryButtonClickSpy).toHaveBeenCalled();
  });

  it('should emit secondaryButtonClick when secondary button is clicked', () => {
    fixture.componentRef.setInput('secondaryButtonText', 'Secondary Button');
    const secondaryButtonClickSpy = vi.spyOn(
      component.secondaryButtonClick,
      'emit',
    );

    fixture.detectChanges();

    const secondaryButton = fixture.debugElement.query(
      By.css('.toast-button.secondary'),
    );
    secondaryButton.triggerEventHandler('click', null);
    expect(secondaryButtonClickSpy).toHaveBeenCalled();
  });
});
