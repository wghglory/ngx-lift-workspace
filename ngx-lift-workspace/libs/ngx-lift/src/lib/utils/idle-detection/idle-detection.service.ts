import {Injectable, Optional} from '@angular/core';
import {fromEvent, merge, Subject, Subscription, throttleTime} from 'rxjs';

import {IdleDetectionConfig} from './idle-detection.config';

/**
 * Service for detecting user idle time and implementing a countdown.
 */
@Injectable({
  providedIn: 'root',
})
export class IdleDetectionService {
  /**
   * The list of interruption events that will end the idle detection.
   */
  private interruptionEvents = [
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
  private interruptionSubscription?: Subscription;

  /**
   * The default idle duration in seconds (19 minutes).
   */
  private idleDuration = 19 * 60;

  /**
   * The default timeout duration in seconds (1 minute).
   */
  private timeoutDuration = 60;

  /**
   * Timer for idle detection.
   */
  private idleTimer?: number;

  /**
   * Timer for countdown.
   */
  private countdownTimer?: number;

  /**
   * Flag to indicate if countdown is in progress.
   */
  private isCountingDown = false;

  /**
   * The current countdown value.
   */
  private countdown = this.timeoutDuration;

  /**
   * Subject to emit when idle period ends.
   */
  private idleEndSubject = new Subject<void>();

  /**
   * Subject to emit the countdown value.
   */
  private countdownSubject = new Subject<number>();

  /**
   * Subject to emit when countdown ends.
   */
  private countdownEndSubject = new Subject<void>();

  /**
   * Constructs the IdleDetectionService.
   * @param config - Optional configuration for idle and timeout durations.
   */
  constructor(@Optional() config: IdleDetectionConfig) {
    if (config) {
      this.setConfig(config);
    }
  }

  /**
   * Starts to watch for user inactivity.
   */
  startWatching() {
    this.setupInterruptionEvents();
    this.startIdleTimer();
  }

  /**
   * Resets the idle timer when user activity is detected.
   * @param withCountdownReset - Flag to indicate if countdown should be reset.
   * By default, it only reset the idle-detection timer. If you enter the countdown phase, it won't stop the countdown.
   * Pass true when you want to reset the countdown as well. This is useful when you click "Keep Me Signed In" button in cll-idle-detection component
   */
  resetTimer(withCountdownReset = false) {
    this.startIdleTimer();

    if (withCountdownReset && this.isCountingDown) {
      this.stopCountdown();
    }
  }

  /**
   * Sets up the interruption events that will end the idle detection.
   * Listens to a set of events on the document (e.g. click, keydown, mousemove, etc.).
   * When any of these events is triggered, the idle timer is reset.
   * Uses `throttleTime` operator to only trigger the reset when the events are spaced
   * out by at least 1000ms (1 second).
   * @private
   */
  private setupInterruptionEvents() {
    if (!this.interruptionSubscription) {
      const throttledInterruptionEvents = this.interruptionEvents.map((eventName) =>
        fromEvent(document, eventName).pipe(throttleTime(1000)),
      );
      this.interruptionSubscription = merge(...throttledInterruptionEvents).subscribe(() => this.resetTimer());
    }
  }

  /**
   * Starts the idle timer.
   * When the timer expires, it emits an event through onIdleEnd() and starts the countdown.
   */
  private startIdleTimer() {
    clearTimeout(this.idleTimer);

    this.idleTimer = window.setTimeout(() => {
      // after idle period, user inactivity detected
      this.idleEndSubject.next();
      this.startCountdown();
    }, this.idleDuration * 1000);
  }

  /**
   * Starts the countdown.
   */
  private startCountdown() {
    this.isCountingDown = true;
    this.countdownSubject.next(this.countdown);

    this.countdownTimer = window.setInterval(() => {
      this.countdown--;
      this.countdownSubject.next(this.countdown);

      if (this.countdown <= 0) {
        this.stopCountdown();
        this.countdownEndSubject.next();
      }
    }, 1000);
  }

  /**
   * Stops the countdown.
   */
  private stopCountdown() {
    clearInterval(this.countdownTimer);
    this.isCountingDown = false;

    // reset countdown
    this.countdown = this.timeoutDuration;
  }

  /**
   * Returns an observable that emits when the user has been idle for a long period.
   * Developers can use this to perform actions like opening a dialog.
   *
   * user has been inactive for a long period (idleDuration), at this moment, idle detection phase ends, onIdleEnd event is emitted, and then enter countdown/timeout phase.
   * During the countdown phase:
   *  - if user has any activity, countdown phase immediately ends and restart the idle detection phase.
   *  - else, countdownEnd event will be emitted when timeoutDuration is over.
   * @returns {Observable<void>} - Observable for idle end event.
   */
  onIdleEnd() {
    return this.idleEndSubject.asObservable();
  }

  /**
   * Returns an observable that emits when the countdown ends.
   * Usually means the user has been inactive for a very long time and should be logged out.
   * @returns {Observable<void>} - Observable for countdown end event.
   */
  onTimeoutEnd() {
    return this.countdownEndSubject.asObservable();
  }

  /**
   * Returns an observable that emits the countdown value every second.
   * @returns {Observable<number>} - Observable for countdown value.
   */
  onCountDown() {
    return this.countdownSubject.asObservable();
  }

  /**
   * Clears all timers when the component is destroyed.
   */
  clearTimers() {
    clearTimeout(this.idleTimer);
    clearInterval(this.countdownTimer);

    this.interruptionSubscription?.unsubscribe();
    this.interruptionSubscription = undefined;
  }

  /**
   * Sets the idle and timeout durations based on the provided configuration.
   * @param config - Configuration object with idle and timeout durations.
   */
  setConfig(config: IdleDetectionConfig) {
    if (config.idleDurationInSeconds) {
      this.idleDuration = config.idleDurationInSeconds;
    }

    if (config.timeoutDurationInSeconds) {
      this.countdown = this.timeoutDuration = config.timeoutDurationInSeconds;
    }
  }
}
