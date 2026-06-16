import {beforeEach, afterEach, vi} from 'vitest';
import {TestBed} from '@angular/core/testing';

import {IdleDetectionConfig} from './idle-detection.config';
import {IdleDetectionService} from './idle-detection.service';

beforeEach(() => {
  vi.useFakeTimers();
});

afterEach(() => {
  vi.useRealTimers();
});

describe('IdleDetectionService', () => {
  let service: IdleDetectionService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [IdleDetectionService],
    });
    service = TestBed.inject(IdleDetectionService);
    service.setConfig({
      idleDurationInSeconds: 1,
      timeoutDurationInSeconds: 1,
    });
  });

  afterEach(() => {
    service.clearTimers();
  });

  it('should be created', async () => {
    expect(service).toBeTruthy();
  });

  it('should reset timer on user activity', async () => {
    service.startWatching();
    const event = new MouseEvent('mousemove');
    document.dispatchEvent(event);
    expect(service['idleTimer']).toBeDefined();
    expect(service['isCountingDown']).toBeFalsy();
  });

  it('should start countdown after idle end', async () => {
    service.startWatching();
    TestBed.tick();
    await vi.advanceTimersByTimeAsync(service['idleDuration'] * 1000 + 100);
    TestBed.tick();
    expect(service['isCountingDown']).toBeTruthy();
  });

  it('should stop countdown on user activity during countdown', async () => {
    service.startWatching();
    // Wait for idle duration to pass (countdown starts) + a bit more to ensure we're in countdown phase
    TestBed.tick();
    await vi.advanceTimersByTimeAsync(service['idleDuration'] * 1000 + 200);
    TestBed.tick();

    // Countdown should be active
    expect(service['isCountingDown']).toBeTruthy();

    // User activity during countdown - dispatch multiple events to ensure one gets through throttling
    document.dispatchEvent(new MouseEvent('click', {bubbles: true}));
    // Also dispatch a mousemove to ensure an event gets through
    TestBed.tick();
    await vi.advanceTimersByTimeAsync(50);
    TestBed.tick();
    document.dispatchEvent(new MouseEvent('mousemove', {bubbles: true}));

    // Wait a bit for the events to be processed
    TestBed.tick();
    await vi.advanceTimersByTimeAsync(200);
    TestBed.tick();

    expect(service['isCountingDown']).toBeFalsy();
    expect(service['countdown']).toBe(service['timeoutDuration']);
  });

  it('should emit countdown value every second', async () => {
    service.setConfig({
      timeoutDurationInSeconds: 3,
      idleDurationInSeconds: 1,
    });
    service.startWatching();

    const countdownValues: number[] = [];
    service.onCountDown().subscribe((countdown) => {
      countdownValues.push(countdown);
    });

    // Wait for idle duration (1s) + countdown starts and emits initial value (3)
    TestBed.tick();
    await vi.advanceTimersByTimeAsync(1000);
    TestBed.tick();
    expect(countdownValues.length).toBeGreaterThan(0);
    // First emission is the initial countdown value (3), which equals timeoutDuration
    // Wait for next second to get a value less than timeoutDuration
    TestBed.tick();
    await vi.advanceTimersByTimeAsync(1000);
    TestBed.tick();
    expect(countdownValues.some((val) => val < service['timeoutDuration'])).toBeTruthy();
  });

  it('should emit countdown end event after timeout duration', async () => {
    service.startWatching();

    let timeoutEndReceived = false;
    service.onTimeoutEnd().subscribe(() => {
      timeoutEndReceived = true;
    });

    // Wait for idle duration (1s) + timeout duration (1s) = 2s
    TestBed.tick();
    await vi.advanceTimersByTimeAsync(2000);
    TestBed.tick();
    expect(timeoutEndReceived).toBeTruthy();
  });

  it('should set config correctly', async () => {
    const config: IdleDetectionConfig = {
      idleDurationInSeconds: 10,
      timeoutDurationInSeconds: 5,
    };
    service.setConfig(config);
    expect(service['idleDuration']).toBe(10);
    expect(service['timeoutDuration']).toBe(5);
    expect(service['countdown']).toBe(5);
  });

  it('should set config with only idleDurationInSeconds', async () => {
    const config: IdleDetectionConfig = {
      idleDurationInSeconds: 15,
    };
    service.setConfig(config);
    expect(service['idleDuration']).toBe(15);
    expect(service['timeoutDuration']).toBe(1); // Default value
  });

  it('should set config with only timeoutDurationInSeconds', async () => {
    const config: IdleDetectionConfig = {
      timeoutDurationInSeconds: 8,
    };
    service.setConfig(config);
    expect(service['idleDuration']).toBe(1); // Default value
    expect(service['timeoutDuration']).toBe(8);
    expect(service['countdown']).toBe(8);
  });

  it('should reset timer with countdown reset', async () => {
    service.startWatching();
    TestBed.tick();
    await vi.advanceTimersByTimeAsync(service['idleDuration'] * 1000 + 100);
    TestBed.tick();

    // After idle period, countdown should start
    expect(service['isCountingDown']).toBeTruthy();

    // Reset with countdown reset
    service.resetTimer(true);
    expect(service['isCountingDown']).toBeFalsy();
    expect(service['countdown']).toBe(service['timeoutDuration']);
  });

  it('should reset timer without countdown reset during countdown', async () => {
    service.startWatching();
    TestBed.tick();
    await vi.advanceTimersByTimeAsync(service['idleDuration'] * 1000 + 100);
    TestBed.tick();

    // After idle period, countdown should start
    expect(service['isCountingDown']).toBeTruthy();

    // Reset without countdown reset
    service.resetTimer(false);
    expect(service['isCountingDown']).toBeTruthy(); // Countdown should continue
  });

  it('should clear all timers', async () => {
    service.startWatching();
    const interruptionSubscription = service['interruptionSubscription'];

    service.clearTimers();

    expect(service['idleTimer']).toBeUndefined();
    expect(service['countdownTimer']).toBeUndefined();
    expect(service['interruptionSubscription']).toBeUndefined();
    expect(interruptionSubscription?.closed).toBe(true);
  });

  it('should emit onIdleEnd event', async () => {
    service.startWatching();

    let idleEndReceived = false;
    service.onIdleEnd().subscribe(() => {
      idleEndReceived = true;
    });

    // Wait for idle duration to pass (the observable will emit when idle ends)
    TestBed.tick();
    await vi.advanceTimersByTimeAsync(service['idleDuration'] * 1000);
    TestBed.tick();
    expect(idleEndReceived).toBeTruthy();
    // startCountdown() is called synchronously after idleEndSubject.next()
    // Check that countdown has started
    expect(service['isCountingDown']).toBeTruthy();
  });

  it('should emit onTimeoutEnd event', async () => {
    service.setConfig({
      idleDurationInSeconds: 1,
      timeoutDurationInSeconds: 1,
    });
    service.startWatching();

    let timeoutEndReceived = false;
    service.onTimeoutEnd().subscribe(() => {
      expect(service['isCountingDown']).toBeFalsy();
      timeoutEndReceived = true;
    });

    // Wait for idle duration (1s) + timeout duration (1s) = 2s
    TestBed.tick();
    await vi.advanceTimersByTimeAsync(2000);
    TestBed.tick();
    expect(timeoutEndReceived).toBeTruthy();
  });

  it('should emit countdown values', async () => {
    service.setConfig({
      idleDurationInSeconds: 1,
      timeoutDurationInSeconds: 3,
    });
    service.startWatching();

    const countdownValues: number[] = [];
    service.onCountDown().subscribe((countdown) => {
      countdownValues.push(countdown);
    });

    // Wait for idle duration (1s) + first countdown (1s) + second countdown (1s) = 3s
    TestBed.tick();
    await vi.advanceTimersByTimeAsync(3000);
    TestBed.tick();
    expect(countdownValues.length).toBeGreaterThanOrEqual(2);
    expect(countdownValues[0]).toBe(3);
    expect(countdownValues[1]).toBe(2);
  });

  it('should handle multiple interruption events', async () => {
    service.startWatching();

    // Simulate multiple events
    document.dispatchEvent(new MouseEvent('click'));
    document.dispatchEvent(new KeyboardEvent('keydown'));
    document.dispatchEvent(new MouseEvent('mousemove'));

    // Timer should be reset (events are throttled but timer is still defined)
    expect(service['idleTimer']).toBeDefined();
    expect(service['isCountingDown']).toBeFalsy();
  });

  it('should throttle interruption events', async () => {
    service.startWatching();
    let timerResetCount = 0;
    const originalResetTimer = service['resetTimer'];
    service['resetTimer'] = function () {
      timerResetCount++;
      return originalResetTimer.call(this);
    };

    // Dispatch multiple events rapidly
    for (let i = 0; i < 10; i++) {
      document.dispatchEvent(new MouseEvent('mousemove'));
    }

    TestBed.tick();
    await vi.advanceTimersByTimeAsync(2000);
    TestBed.tick();
    // Should be throttled, so resetTimer should not be called 10 times
    expect(timerResetCount).toBeLessThan(10);
  });

  it('should stop countdown when user activity detected during countdown', async () => {
    service.startWatching();
    TestBed.tick();
    await vi.advanceTimersByTimeAsync(service['idleDuration'] * 1000 + 200);
    TestBed.tick();

    // Countdown should be active
    expect(service['isCountingDown']).toBeTruthy();

    // User activity during countdown - dispatch multiple events to ensure one gets through throttling
    document.dispatchEvent(new MouseEvent('click', {bubbles: true}));
    // Also dispatch a mousemove to ensure an event gets through
    TestBed.tick();
    await vi.advanceTimersByTimeAsync(50);
    TestBed.tick();
    document.dispatchEvent(new MouseEvent('mousemove', {bubbles: true}));

    // Wait a bit for the events to be processed
    TestBed.tick();
    await vi.advanceTimersByTimeAsync(200);
    TestBed.tick();

    expect(service['isCountingDown']).toBeFalsy();
    expect(service['countdown']).toBe(service['timeoutDuration']);
  });

  it('should handle all interruption event types', async () => {
    service.startWatching();
    const events = [
      'click',
      'keydown',
      'keypress',
      'mousemove',
      'mousedown',
      'scroll',
      'wheel',
      'touchmove',
      'pointermove',
      'resize',
    ];

    events.forEach((eventType) => {
      if (eventType === 'resize') {
        window.dispatchEvent(new Event('resize'));
      } else {
        document.dispatchEvent(new Event(eventType));
      }
    });

    // Timer should be reset (events are throttled but timer is still defined)
    expect(service['idleTimer']).toBeDefined();
    expect(service['isCountingDown']).toBeFalsy();
  });

  it('should not start watching if already watching', async () => {
    service.startWatching();
    const firstSubscription = service['interruptionSubscription'];

    service.startWatching();
    const secondSubscription = service['interruptionSubscription'];

    // Should be the same subscription
    expect(firstSubscription).toBe(secondSubscription);
  });

  it('should reset countdown to timeoutDuration when stopped', async () => {
    service.setConfig({
      timeoutDurationInSeconds: 5,
    });
    service['isCountingDown'] = true;
    service['countdown'] = 2;

    service['stopCountdown']();

    expect(service['countdown']).toBe(5);
    expect(service['isCountingDown']).toBeFalsy();
  });
});
