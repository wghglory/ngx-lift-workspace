import {ComponentFixture, TestBed} from '@angular/core/testing';
import {TranslationService} from 'clr-lift';
import {vi} from 'vitest';

import {enTranslations} from '../../../core/l10n/demo.l10n.en';

import {MultiAlertsDemoComponent} from './multi-alerts-demo.component';

describe('MultiAlertsDemoComponent', () => {
  let component: MultiAlertsDemoComponent;
  let fixture: ComponentFixture<MultiAlertsDemoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MultiAlertsDemoComponent],
    }).compileComponents();

    const translations = TestBed.inject(TranslationService);
    translations.loadTranslationsForComponent('', {en: enTranslations});
    translations.setLanguage('en');
    fixture = TestBed.createComponent(MultiAlertsDemoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('shows an inline Click Me button that invokes the interactive demo callback', () => {
    const dialog = vi.spyOn(window, 'alert').mockImplementation(() => undefined);
    try {
      const button = fixture.nativeElement.querySelector('#click-target');
      expect(button).toBeInstanceOf(HTMLButtonElement);
      expect(button.textContent.trim()).toBe('Click Me');
      button.click();
      expect(dialog).toHaveBeenCalledExactlyOnceWith('You did it correctly!');
    } finally {
      dialog.mockRestore();
    }
  });

  it('shows action buttons on initial load that invoke callbacks', () => {
    const dialog = vi.spyOn(window, 'alert').mockImplementation(() => undefined);
    try {
      const actionButtons: HTMLButtonElement[] = Array.from(
        fixture.nativeElement.querySelectorAll('button.alert-action'),
      );
      const detailsBtn = actionButtons.find((btn) => btn.textContent?.includes('Details'));
      expect(detailsBtn).toBeDefined();
      detailsBtn?.click();
      expect(dialog).toHaveBeenCalledWith('Details action clicked!');
    } finally {
      dialog.mockRestore();
    }
  });

  it('can dynamically add an alert with an inline button', () => {
    component.addAlertWithInlineButton();
    fixture.detectChanges();

    const inlineBtn = fixture.nativeElement.querySelector('#inline-click-target');
    expect(inlineBtn).toBeInstanceOf(HTMLButtonElement);
  });

  it('can dynamically add an alert with trailing action buttons', () => {
    component.addAlertWithAction();
    fixture.detectChanges();

    const buttons: HTMLButtonElement[] = Array.from(fixture.nativeElement.querySelectorAll('button.alert-action'));
    const ackBtn = buttons.find((btn) => btn.textContent?.includes('Acknowledge'));
    expect(ackBtn).toBeDefined();
  });

  it('clears all alerts when clearAlerts is called', () => {
    component.clearAlerts();
    fixture.detectChanges();

    const alerts = fixture.nativeElement.querySelectorAll('clr-alert');
    expect(alerts.length).toBe(0);
  });
});
