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
    service.setConfig({
      idleDurationInSeconds: 1,
      timeoutDurationInSeconds: 1,
    });
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
    expect(service['isCountingDown']).toBeFalsy();
  });

  it('should start countdown after idle end', async () => {
    service.startWatching();
    await new Promise<void>((resolve) => {
      setTimeout(
        () => {
          expect(service['isCountingDown']).toBeTruthy();
          resolve();
        },
        service['idleDuration'] * 1000 + 100,
      );
    });
  });

  it('should stop countdown on user activity during countdown', async () => {
    service.startWatching();
    await new Promise<void>((resolve, reject) => {
      // Wait for idle duration to pass (countdown starts) + a bit more to ensure we're in countdown phase
      setTimeout(
        () => {
          // Countdown should be active
          if (!service['isCountingDown']) {
            reject(new Error('Countdown should be active at this point'));
            return;
          }

          // User activity during countdown - dispatch multiple events to ensure one gets through throttling
          document.dispatchEvent(new MouseEvent('click', {bubbles: true}));
          // Also dispatch a mousemove to ensure an event gets through
          setTimeout(() => {
            document.dispatchEvent(new MouseEvent('mousemove', {bubbles: true}));
          }, 50);

          // Poll the state until countdown is stopped or timeout
          const startTime = Date.now();
          const checkInterval = setInterval(() => {
            if (!service['isCountingDown'] && service['countdown'] === service['timeoutDuration']) {
              clearInterval(checkInterval);
              try {
                expect(service['isCountingDown']).toBeFalsy();
                expect(service['countdown']).toBe(service['timeoutDuration']);
                resolve();
              } catch (error) {
                reject(error);
              }
            } else if (Date.now() - startTime > 3000) {
              clearInterval(checkInterval);
              reject(
                new Error(`Timeout: isCountingDown=${service['isCountingDown']}, countdown=${service['countdown']}`),
              );
            }
          }, 100);
        },
        service['idleDuration'] * 1000 + 200,
      );
    });
  }, 15000);

  it('should emit countdown value every second', async () => {
    service.setConfig({
      timeoutDurationInSeconds: 3,
      idleDurationInSeconds: 1,
    });
    service.startWatching();
    await new Promise<void>((resolve) => {
      setTimeout(() => {
        service.onCountDown().subscribe((countdown) => {
          expect(countdown).toBeLessThan(service['timeoutDuration']);
          resolve();
        });
      }, 4000);
    });
  });

  it('should emit countdown end event after timeout duration', async () => {
    service.startWatching();
    await new Promise<void>((resolve) => {
      setTimeout(() => {
        service.onTimeoutEnd().subscribe(() => {
          resolve();
        });
      }, 2000);
    });
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

  it('should set config with only idleDurationInSeconds', () => {
    const config: IdleDetectionConfig = {
      idleDurationInSeconds: 15,
    };
    service.setConfig(config);
    expect(service['idleDuration']).toBe(15);
    expect(service['timeoutDuration']).toBe(1); // Default value
  });

  it('should set config with only timeoutDurationInSeconds', () => {
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
    await new Promise<void>((resolve) => {
      setTimeout(
        () => {
          // After idle period, countdown should start
          expect(service['isCountingDown']).toBeTruthy();

          // Reset with countdown reset
          service.resetTimer(true);
          expect(service['isCountingDown']).toBeFalsy();
          expect(service['countdown']).toBe(service['timeoutDuration']);

          resolve();
        },
        service['idleDuration'] * 1000 + 100,
      );
    });
  });

  it('should reset timer without countdown reset during countdown', async () => {
    service.startWatching();
    await new Promise<void>((resolve) => {
      setTimeout(
        () => {
          // After idle period, countdown should start
          expect(service['isCountingDown']).toBeTruthy();

          // Reset without countdown reset
          service.resetTimer(false);
          expect(service['isCountingDown']).toBeTruthy(); // Countdown should continue

          resolve();
        },
        service['idleDuration'] * 1000 + 100,
      );
    });
  });

  it('should clear all timers', () => {
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
    await new Promise<void>((resolve, reject) => {
      let resolved = false;
      service.onIdleEnd().subscribe(() => {
        // startCountdown() is called synchronously after idleEndSubject.next()
        // Use setTimeout to ensure the countdown has started (next tick)
        setTimeout(() => {
          try {
            expect(service['isCountingDown']).toBeTruthy();
            if (!resolved) {
              resolved = true;
              resolve();
            }
          } catch (error) {
            if (!resolved) {
              resolved = true;
              reject(error);
            }
          }
        }, 0);
      });
      // Wait for idle duration to pass (the observable will emit when idle ends)
      // Add a buffer to ensure the event has been processed
      setTimeout(
        () => {
          if (!resolved) {
            resolved = true;
            reject(new Error('onIdleEnd event was not emitted within timeout'));
          }
        },
        service['idleDuration'] * 1000 + 500,
      );
    });
  }, 15000);

  it('should emit onTimeoutEnd event', async () => {
    service.setConfig({
      idleDurationInSeconds: 1,
      timeoutDurationInSeconds: 1,
    });
    service.startWatching();
    await new Promise<void>((resolve) => {
      service.onTimeoutEnd().subscribe(() => {
        expect(service['isCountingDown']).toBeFalsy();
        resolve();
      });
      // Wait for idle duration + timeout duration to pass (the observable will emit when timeout ends)
    });
  });

  it('should emit countdown values', async () => {
    service.setConfig({
      idleDurationInSeconds: 1,
      timeoutDurationInSeconds: 3,
    });
    service.startWatching();

    await new Promise<void>((resolve) => {
      const countdownValues: number[] = [];
      service.onCountDown().subscribe((countdown) => {
        countdownValues.push(countdown);
        if (countdownValues.length >= 2) {
          expect(countdownValues[0]).toBe(3);
          expect(countdownValues[1]).toBe(2);
          resolve();
        }
      });
    });
  });

  it('should handle multiple interruption events', () => {
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

    await new Promise<void>((resolve) => {
      setTimeout(() => {
        // Should be throttled, so resetTimer should not be called 10 times
        expect(timerResetCount).toBeLessThan(10);
        resolve();
      }, 2000);
    });
  });

  it('should stop countdown when user activity detected during countdown', async () => {
    service.startWatching();
    await new Promise<void>((resolve, reject) => {
      setTimeout(
        () => {
          // Countdown should be active
          if (!service['isCountingDown']) {
            reject(new Error('Countdown should be active at this point'));
            return;
          }

          // User activity during countdown - dispatch multiple events to ensure one gets through throttling
          document.dispatchEvent(new MouseEvent('click', {bubbles: true}));
          // Also dispatch a mousemove to ensure an event gets through
          setTimeout(() => {
            document.dispatchEvent(new MouseEvent('mousemove', {bubbles: true}));
          }, 50);

          // Poll the state until countdown is stopped or timeout
          const startTime = Date.now();
          const checkInterval = setInterval(() => {
            if (!service['isCountingDown'] && service['countdown'] === service['timeoutDuration']) {
              clearInterval(checkInterval);
              try {
                expect(service['isCountingDown']).toBeFalsy();
                expect(service['countdown']).toBe(service['timeoutDuration']);
                resolve();
              } catch (error) {
                reject(error);
              }
            } else if (Date.now() - startTime > 3000) {
              clearInterval(checkInterval);
              reject(
                new Error(`Timeout: isCountingDown=${service['isCountingDown']}, countdown=${service['countdown']}`),
              );
            }
          }, 100);
        },
        service['idleDuration'] * 1000 + 200,
      );
    });
  }, 15000);

  it('should handle all interruption event types', () => {
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

  it('should not start watching if already watching', () => {
    service.startWatching();
    const firstSubscription = service['interruptionSubscription'];

    service.startWatching();
    const secondSubscription = service['interruptionSubscription'];

    // Should be the same subscription
    expect(firstSubscription).toBe(secondSubscription);
  });

  it('should reset countdown to timeoutDuration when stopped', () => {
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
