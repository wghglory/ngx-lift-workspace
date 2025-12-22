import {TestBed} from '@angular/core/testing';

import {IdleDetectionConfig} from './idle-detection.config';
import {IdleDetectionService} from './idle-detection.service';

describe('IdleDetectionService', () => {
  let service: IdleDetectionService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [IdleDetectionService],
    });
    service = TestBed.inject(IdleDetectionService);
    service.setConfig({idleDurationInSeconds: 1, timeoutDurationInSeconds: 1});
  });

  afterEach(() => {
    service.clearTimers();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should reset timer on user activity', () => {
    service.startWatching();
    const event = new MouseEvent('mousemove');
    document.dispatchEvent(event);
    expect(service['idleTimer']).toBeDefined();
    expect(service['isCountingDown']).toBeFalse();
  });

  it('should start countdown after idle end', (done) => {
    service.startWatching();
    setTimeout(
      () => {
        expect(service['isCountingDown']).toBeTrue();
        done();
      },
      service['idleDuration'] * 1000 + 100,
    );
  });

  it('should stop countdown on user activity during countdown', (done) => {
    service.startWatching();
    setTimeout(() => {
      const event = new MouseEvent('mousemove');
      document.dispatchEvent(event);
      expect(service['isCountingDown']).toBeFalse();
      done();
    }, 3000);
  });

  it('should emit countdown value every second', (done) => {
    service.setConfig({timeoutDurationInSeconds: 3, idleDurationInSeconds: 1});
    service.startWatching();
    setTimeout(() => {
      service.onCountDown().subscribe((countdown) => {
        expect(countdown).toBeLessThan(service['timeoutDuration']);
        done();
      });
    }, 4000);
  });

  it('should emit countdown end event after timeout duration', (done) => {
    service.startWatching();
    setTimeout(() => {
      service.onTimeoutEnd().subscribe(() => {
        done();
      });
    }, 2000);
  });

  it('should set config correctly', () => {
    const config: IdleDetectionConfig = {
      idleDurationInSeconds: 10,
      timeoutDurationInSeconds: 5,
    };
    service.setConfig(config);
    expect(service['idleDuration']).toBe(10);
    expect(service['timeoutDuration']).toBe(5);
    expect(service['countdown']).toBe(5);
  });
});
