import {DestroyRef, inject, Injectable, Provider} from '@angular/core';
import {BehaviorSubject, filter, fromEvent, merge, Subject, Subscription, throttleTime} from 'rxjs';

import {IdleDetectionConfig} from './idle-detection.config';

/** Current idle warning state, replayed to newly mounted or switched consumers. */
export interface IdleDetectionState {
  readonly isCountingDown: boolean;
  readonly countdown: number | null;
}

/**
 * Provides an isolated IdleDetectionService instance with optional initial configuration.
 * Useful for component- or route-level scoping to avoid modifying the root singleton timers.
 *
 * @param config Optional initial idle and timeout duration configuration.
 * @returns Array of Angular providers for component or environment injection.
 *
 * @example
 * ```typescript
 * @Component({
 *   selector: 'app-user-portal',
 *   providers: [provideIdleDetectionService({ idleDurationInSeconds: 300 })],
 * })
 * export class UserPortalComponent {}
 * ```
 */
export function provideIdleDetectionService(config?: IdleDetectionConfig): Provider[] {
  return [...(config ? [{provide: IdleDetectionConfig, useValue: config}] : []), IdleDetectionService];
}

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
  private watcherCount = 0;
  private manuallyWatching = false;
  private destroyed = false;

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
  private readonly stateSubject = new BehaviorSubject<IdleDetectionState>({isCountingDown: false, countdown: null});

  /**
   * Constructs the IdleDetectionService.
   * @param config - Optional configuration for idle and timeout durations.
   */
  constructor() {
    inject(DestroyRef).onDestroy(() => {
      this.destroyed = true;
      this.clearTimers();
      this.stateSubject.complete();
    });
    const config = inject(IdleDetectionConfig, {optional: true});
    if (config) {
      this.setConfig(config);
    }
  }

  /**
   * Starts to watch for user inactivity.
   */
  startWatching() {
    if (this.destroyed) return;
    this.manuallyWatching = true;
    this.ensureWatching();
  }

  /**
   * Acquires shared idle detection and returns an idempotent release callback.
   * The last owner releases timers unless a caller explicitly used startWatching().
   * @returns Callback releasing this owner's subscription to idle detection.
   */
  watch(): () => void {
    if (this.destroyed) return () => undefined;
    this.watcherCount++;
    if (this.watcherCount === 1 && !this.interruptionSubscription) this.ensureWatching();
    let released = false;
    return () => {
      if (released) return;
      released = true;
      this.watcherCount--;
      if (this.watcherCount === 0 && !this.manuallyWatching) this.clearTimers();
    };
  }

  private ensureWatching(): void {
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
    if (this.destroyed) return;
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
      this.interruptionSubscription = merge(...throttledInterruptionEvents).subscribe(() => this.resetTimer(true));
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
      const timer = this.idleTimer;
      this.idleEndSubject.next();
      if (this.idleTimer === timer) this.startCountdown();
    }, this.idleDuration * 1000);
  }

  /**
   * Starts the countdown.
   */
  private startCountdown() {
    this.stopCountdown(false);
    this.isCountingDown = true;
    const timer = window.setInterval(() => {
      if (this.countdownTimer !== timer || !this.isCountingDown) return;
      const remaining = --this.countdown;
      this.publishState();
      if (this.countdownTimer !== timer || !this.isCountingDown) return;
      this.countdownSubject.next(remaining);
      if (this.countdownTimer !== timer || !this.isCountingDown) return;
      if (remaining <= 0) {
        this.stopCountdown();
        this.countdownEndSubject.next();
      }
    }, 1000);
    // Install ownership before synchronous callbacks can reset or release it.
    this.countdownTimer = timer;
    this.publishState();
    if (this.countdownTimer === timer && this.isCountingDown) this.countdownSubject.next(this.countdown);
  }

  /**
   * Stops the countdown.
   */
  private stopCountdown(publish = true) {
    clearInterval(this.countdownTimer);
    this.countdownTimer = undefined;
    this.isCountingDown = false;

    // reset countdown
    this.countdown = this.timeoutDuration;
    if (publish) this.publishState();
  }

  private publishState(): void {
    const state = {isCountingDown: this.isCountingDown, countdown: this.isCountingDown ? this.countdown : null};
    const previous = this.stateSubject.value;
    if (previous.isCountingDown !== state.isCountingDown || previous.countdown !== state.countdown) {
      this.stateSubject.next(state);
    }
  }

  /** Observe current warning/countdown state, including activity resets and service switching. */
  observeState() {
    // A synchronous observer may reset state before later peers receive this batch.
    return this.stateSubject.asObservable().pipe(filter((state) => state === this.stateSubject.value));
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
    this.manuallyWatching = false;
    clearTimeout(this.idleTimer);
    this.idleTimer = undefined;
    this.interruptionSubscription?.unsubscribe();
    this.interruptionSubscription = undefined;
    this.stopCountdown();
  }

  /**
   * Sets the idle and timeout durations based on the provided configuration.
   * @param config - Configuration object with idle and timeout durations.
   */
  setConfig(config: IdleDetectionConfig) {
    if (this.destroyed) return;
    if (config.idleDurationInSeconds && config.idleDurationInSeconds !== this.idleDuration) {
      this.idleDuration = config.idleDurationInSeconds;
      if (this.idleTimer !== undefined && !this.isCountingDown) this.startIdleTimer();
    }

    if (config.timeoutDurationInSeconds) {
      this.countdown = this.timeoutDuration = config.timeoutDurationInSeconds;
      this.publishState();
    }
  }
}
