import {CommonModule} from '@angular/common';
import {Component, DebugElement, signal} from '@angular/core';
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {By} from '@angular/platform-browser';
import {ClarityModule} from '@clr/angular';
import {vi} from 'vitest';

import {TranslationService} from '../../services/translation.service';
import {MockTranslationService} from '../../services/translation.service.mock';
import {AlertService} from './alert.service';
import {AlertContainerComponent} from './alert-container.component';

describe('AlertContainerComponent', () => {
  let component: AlertContainerComponent;
  let fixture: ComponentFixture<AlertContainerComponent>;
  let alertService: AlertService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [CommonModule, ClarityModule, AlertContainerComponent],
      providers: [
        {
          provide: AlertService,
          useValue: {
            alerts: signal([{content: 'alert 1'}, {content: 'alert 2'}]),
            deleteAlert: () => {
              // Mock implementation
            },
          },
        },
        {provide: TranslationService, useClass: MockTranslationService},
      ],
    });

    fixture = TestBed.createComponent(AlertContainerComponent);
    component = fixture.componentInstance;
    alertService = TestBed.inject(AlertService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should close alert when onCloseAlert is called', () => {
    const alertId = Symbol('testId');
    const deleteAlertSpy = vi.spyOn(alertService, 'deleteAlert');

    component.onCloseAlert(alertId);

    expect(deleteAlertSpy).toHaveBeenCalledWith(alertId);
  });
});

@Component({
  template: ` <cll-alert-container /> `,
  imports: [AlertContainerComponent],
})
class TestAlertsHostComponent {}

describe('TestAlertsHostComponent', () => {
  let fixture: ComponentFixture<TestAlertsHostComponent>;
  let alertService: AlertService;
  let element: DebugElement;

  const mockAlerts = [
    {
      content: 'Test Alert 1',
      options: {alertType: 'info', isAppLevel: true},
    },
    {
      content: 'Test Alert 2',
      options: {alertType: 'warning', isAppLevel: false},
    },
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [CommonModule, ClarityModule, AlertContainerComponent, TestAlertsHostComponent],
      providers: [
        {
          provide: AlertService,
          useValue: {
            alerts: signal(mockAlerts),
            deleteAlert: () => {
              // Mock implementation
            },
          },
        },
        {provide: TranslationService, useClass: MockTranslationService},
      ],
    });

    fixture = TestBed.createComponent(TestAlertsHostComponent);
    alertService = TestBed.inject(AlertService);

    element = fixture.debugElement.query(By.directive(AlertContainerComponent));
  });

  it('should display alerts', () => {
    fixture.detectChanges();

    const alertElements = element.queryAll(By.css('.alert'));
    expect(alertElements.length).toBe(2);

    mockAlerts.forEach((alert, index) => {
      const alertElement = alertElements[index];
      expect(alertElement.nativeElement.textContent).toContain(alert.content);
    });
  });

  it('should call onCloseAlert when alert is closed', () => {
    const mockAlert = {
      id: Symbol(),
      content: 'Test Alert',
      alertType: 'info' as const,
      isAppLevel: true,
    };
    alertService.alerts = signal([mockAlert]);
    const deleteAlertSpy = vi.spyOn(alertService, 'deleteAlert');

    fixture.detectChanges();

    const closeButton = element.query(By.css('button.close'));
    closeButton.nativeElement.click();

    expect(deleteAlertSpy).toHaveBeenCalled();
  });
});

describe('AlertContainerComponent with the real AlertService', () => {
  let fixture: ComponentFixture<AlertContainerComponent>;
  let service: AlertService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AlertContainerComponent],
      providers: [{provide: TranslationService, useClass: MockTranslationService}],
    });
    service = TestBed.inject(AlertService);
    fixture = TestBed.createComponent(AlertContainerComponent);
  });

  it('renders an action as a native button and invokes its callback immediately', () => {
    const onClick = vi.fn();
    const alert = {content: 'Alert with a button.', actions: [{label: 'Click Me', onClick}]};
    service.addAlert(alert);
    fixture.detectChanges();

    const button = fixture.nativeElement.querySelector('button.alert-action');
    expect(button).toBeInstanceOf(HTMLButtonElement);
    expect(button.getAttribute('type')).toBe('button');
    expect(button.textContent.trim()).toBe('Click Me');
    button.click();
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('keeps identically labeled actions scoped to their alerts', () => {
    const firstClick = vi.fn();
    const secondClick = vi.fn();
    service.addAlert({content: 'First', actions: [{label: 'Open', onClick: firstClick}]});
    service.addAlert({content: 'Second', actions: [{label: 'Open', onClick: secondClick}]});
    fixture.detectChanges();

    const buttons: HTMLButtonElement[] = Array.from(fixture.nativeElement.querySelectorAll('button.alert-action'));
    expect(buttons).toHaveLength(2);
    buttons[0].click();
    expect(secondClick).toHaveBeenCalledTimes(1);
    expect(firstClick).not.toHaveBeenCalled();
    buttons[1].click();
    expect(firstClick).toHaveBeenCalledTimes(1);
  });

  it('renders an inline button inside content and triggers onTargetClick when clicked', () => {
    const onTargetClick = vi.fn();
    service.addAlert({
      content:
        'Alert with an inline button. <button type="button" class="btn btn-sm btn-outline" id="click-target">Click Me</button>',
      targetSelector: '#click-target',
      onTargetClick,
    });
    fixture.detectChanges();

    const button: HTMLButtonElement = fixture.nativeElement.querySelector('#click-target');
    expect(button).toBeInstanceOf(HTMLButtonElement);
    expect(button.textContent.trim()).toBe('Click Me');
    button.click();
    expect(onTargetClick).toHaveBeenCalledTimes(1);
  });

  it('treats action labels as text and renders buttons in alert-actions', () => {
    const alert = {
      content: '<strong>Safe Message</strong>',
      actions: [{label: '<img src=x onerror=alert(3)>', onClick: vi.fn()}],
    };
    service.addAlert(alert);
    fixture.detectChanges();

    const message: HTMLElement = fixture.nativeElement.querySelector('.alert-text');
    expect(message.querySelector('strong')?.textContent).toBe('Safe Message');
    const button: HTMLButtonElement = fixture.nativeElement.querySelector('button.alert-action');
    expect(button).toBeInstanceOf(HTMLButtonElement);
    expect(button.textContent).toContain('<img src=x onerror=alert(3)>');
    expect(button.querySelector('img')).toBeNull();
  });

  it('handles a nested legacy link immediately without binding an unrelated element', () => {
    const onTargetClick = vi.fn();
    const unrelated = document.createElement('a');
    unrelated.className = 'legacy-alert-link';
    document.body.appendChild(unrelated);
    try {
      service.addAlert({
        content: '<a class="legacy-alert-link" href="/details"><strong>Open</strong></a>',
        targetSelector: '.legacy-alert-link',
        onTargetClick,
      });
      fixture.detectChanges();
      const nested: HTMLElement = fixture.nativeElement.querySelector('.alert-text a strong');
      const event = new MouseEvent('click', {bubbles: true, cancelable: true});
      nested.dispatchEvent(event);
      expect(onTargetClick).toHaveBeenCalledTimes(1);
      expect(event.defaultPrevented).toBe(true);
      unrelated.click();
      expect(onTargetClick).toHaveBeenCalledTimes(1);
    } finally {
      unrelated.remove();
    }
  });

  it('removes action listeners when an alert is deleted', () => {
    const onClick = vi.fn();
    const alert = service.addAlert({content: 'Temporary', actions: [{label: 'Open', onClick}]});
    fixture.detectChanges();
    const button: HTMLButtonElement = fixture.nativeElement.querySelector('button.alert-action');
    button.click();
    expect(onClick).toHaveBeenCalledTimes(1);

    service.deleteAlert(alert.id);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('button.alert-action')).toBeNull();
    button.click();
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('ignores invalid legacy selectors and does not intercept an action button', () => {
    const onClick = vi.fn();
    const onTargetClick = vi.fn();
    service.addAlert({
      content: '<a href="/details">Open</a>',
      targetSelector: '[invalid',
      onTargetClick,
      actions: [{label: 'Click Me', onClick}],
    });
    fixture.detectChanges();
    const link: HTMLAnchorElement = fixture.nativeElement.querySelector('.alert-text a');
    expect(() => link.dispatchEvent(new MouseEvent('click', {bubbles: true}))).not.toThrow();
    expect(onTargetClick).not.toHaveBeenCalled();
    const button: HTMLButtonElement = fixture.nativeElement.querySelector('button.alert-action');
    button.click();
    expect(onClick).toHaveBeenCalledTimes(1);
    expect(onTargetClick).not.toHaveBeenCalled();
  });
});
