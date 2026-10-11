import {TestBed} from '@angular/core/testing';
import {afterEach, vi} from 'vitest';

import {AlertService} from './alert.service';
import {Alert} from './alert.type';

describe('AlertService', () => {
  let service: AlertService;

  beforeEach(() => {
    vi.useFakeTimers();
    service = TestBed.inject(AlertService);
  });

  afterEach(() => {
    service.clearAlerts();
    document.body.replaceChildren();
    vi.useRealTimers();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should add and trust alert content', () => {
    const mockAlert: Alert = {content: '<strong>Test Alert</strong>'};

    service.addAlert(mockAlert);

    const alerts = service.alerts();

    expect(alerts.length).toBe(1);

    const addedAlert = alerts[0];
    expect(
      (addedAlert.content as {changingThisBreaksApplicationSecurity?: string}).changingThisBreaksApplicationSecurity ??
        addedAlert.content,
    ).toEqual(mockAlert.content);
  });

  it('should delete an alert and its legacy callback configuration', () => {
    const mockAlert: Alert = {
      content: 'Test Alert <button id="testId">Click</button>',
      targetSelector: '#testId',
      onTargetClick: vi.fn(),
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
      onTargetClick: vi.fn(),
    };

    service.addAlert(mockAlert);
    service.addAlert(mockAlert);
    service.addAlert(mockAlert);
    service.clearAlerts();
    expect(service.alerts().length).toBe(0);
  });
  it('bypasses security trust for HTML content so buttons and elements are preserved', () => {
    const mockAlert: Alert = {content: 'Test with <button id="my-btn">Click</button>'};
    service.addAlert(mockAlert);

    const alerts = service.alerts();
    expect(alerts.length).toBe(1);
    expect(alerts[0].content).toBeDefined();
  });

  it('does not bind a legacy selector to an element outside an alert container', () => {
    const button = document.createElement('button');
    button.className = 'alert-action';
    document.body.appendChild(button);
    const onTargetClick = vi.fn();
    service.addAlert({content: '', targetSelector: '.alert-action', onTargetClick});
    vi.advanceTimersByTime(2000);
    button.click();
    expect(onTargetClick).not.toHaveBeenCalled();
  });

  it('does not bind external elements after an alert is deleted', () => {
    const button = document.createElement('button');
    button.id = 'deleted-alert-action';
    document.body.appendChild(button);
    const onTargetClick = vi.fn();
    const alert = service.addAlert({content: '', targetSelector: '#deleted-alert-action', onTargetClick});
    service.deleteAlert(alert.id);
    vi.advanceTimersByTime(2000);
    button.click();

    expect(onTargetClick).not.toHaveBeenCalled();
  });
});
