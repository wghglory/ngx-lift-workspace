import {TestBed} from '@angular/core/testing';
import {DomSanitizer} from '@angular/platform-browser';

import {AlertService} from './alert.service';
import {Alert} from './alert.type';

describe('AlertService', () => {
  let service: AlertService;
  let sanitizer: DomSanitizer;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [{provide: DomSanitizer, useValue: {bypassSecurityTrustHtml: (html: string) => html}}],
    });
    service = TestBed.inject(AlertService);
    sanitizer = TestBed.inject(DomSanitizer);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should add and sanitize alert', () => {
    const mockAlert: Alert = {content: '<strong>Test Alert</strong>'};

    service.addAlert(mockAlert);

    const alerts = service.alerts();

    expect(alerts.length).toBe(1);

    const addedAlert = alerts[0];
    expect(addedAlert.content).toEqual(sanitizer.bypassSecurityTrustHtml(mockAlert.content));
  });

  it('should delete alert and unregister event', () => {
    const mockAlert: Alert = {
      content: 'Test Alert <button id="testId">Click</button>',
      targetSelector: '#testId',
      onTargetClick: jasmine.createSpy(),
    };

    const addedAlert = service.addAlert(mockAlert);
    expect(service.alerts().length).toBe(1);

    service.deleteAlert(addedAlert.id);
    expect(service.alerts().length).toBe(0);
  });

  it('should clear alerts', () => {
    const mockAlert: Alert = {
      content: 'Test Alert <button class="test">Click</button>',
      targetSelector: '.test',
      onTargetClick: jasmine.createSpy(),
    };

    service.addAlert(mockAlert);
    service.addAlert(mockAlert);
    service.addAlert(mockAlert);
    service.clearAlerts();
    expect(service.alerts().length).toBe(0);
  });
});
