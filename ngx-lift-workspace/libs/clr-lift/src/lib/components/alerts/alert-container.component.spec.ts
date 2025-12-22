/* eslint-disable @typescript-eslint/no-unused-vars */
import {CommonModule} from '@angular/common';
import {Component, DebugElement, signal} from '@angular/core';
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {By} from '@angular/platform-browser';
import {ClarityModule} from '@clr/angular';

import {TranslationService} from '../../services/translation.service';
import {MockTranslationService} from '../../services/translation.service.mock';
import {AlertService} from './alert.service';
import {AlertContainerComponent} from './alert-container.component';

describe('AlertContainerComponent', () => {
  let component: AlertContainerComponent;
  let fixture: ComponentFixture<AlertContainerComponent>;
  let alertService: AlertService;
  let translationService: MockTranslationService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [CommonModule, ClarityModule, AlertContainerComponent],
      providers: [
        {
          provide: AlertService,
          useValue: {alerts: signal([{content: 'alert 1'}, {content: 'alert 2'}]), deleteAlert: (id: symbol) => {}},
        },
        {provide: TranslationService, useClass: MockTranslationService},
      ],
    });

    fixture = TestBed.createComponent(AlertContainerComponent);
    component = fixture.componentInstance;
    alertService = TestBed.inject(AlertService);
    translationService = TestBed.inject(TranslationService) as MockTranslationService;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should close alert when onCloseAlert is called', () => {
    const alertId = Symbol('testId');
    const deleteAlertSpy = spyOn(alertService, 'deleteAlert');

    component.onCloseAlert(alertId);

    expect(deleteAlertSpy).toHaveBeenCalledWith(alertId);
  });
});

@Component({
  template: ` <cll-alert-container></cll-alert-container> `,
  standalone: true,
  imports: [AlertContainerComponent],
})
class TestAlertsHostComponent {}

describe('TestAlertsHostComponent', () => {
  let fixture: ComponentFixture<TestAlertsHostComponent>;
  let alertService: AlertService;
  let element: DebugElement;

  const mockAlerts = [
    {content: 'Test Alert 1', options: {alertType: 'info', isAppLevel: true}},
    {content: 'Test Alert 2', options: {alertType: 'warning', isAppLevel: false}},
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [CommonModule, ClarityModule, AlertContainerComponent, TestAlertsHostComponent],
      providers: [
        {
          provide: AlertService,
          useValue: {alerts: signal(mockAlerts), deleteAlert: (id: symbol) => {}},
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
    const mockAlert = {id: Symbol(), content: 'Test Alert', alertType: 'info' as const, isAppLevel: true};
    alertService.alerts = signal([mockAlert]);
    const deleteAlertSpy = spyOn(alertService, 'deleteAlert');

    fixture.detectChanges();

    const closeButton = element.query(By.css('button.close'));
    closeButton.nativeElement.click();

    expect(deleteAlertSpy).toHaveBeenCalled();
  });
});
