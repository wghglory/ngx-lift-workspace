import {flushEffects} from '../../../test-setup';
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {provideNoopAnimations} from '@angular/platform-browser/animations';
import {IdleDetectionService, IdleDetectionState} from 'ngx-lift';
import {BehaviorSubject, Subject} from 'rxjs';
import {vi, beforeEach, afterEach} from 'vitest';

import {TranslationService} from '../../services/translation.service';
import {MockTranslationService} from '../../services/translation.service.mock';
import {IdleDetectionComponent} from './idle-detection.component';

beforeEach(() => {
  vi.useFakeTimers();
});

afterEach(() => {
  vi.useRealTimers();
});

describe('IdleDetectionComponent', () => {
  let component: IdleDetectionComponent;
  let fixture: ComponentFixture<IdleDetectionComponent>;
  let idleDetectionService: IdleDetectionService;
  let idleEndSubject: Subject<void>;
  let timeoutEndSubject: Subject<void>;
  let countdownSubject: Subject<number>;
  let stateSubject: BehaviorSubject<IdleDetectionState>;

  beforeEach(async () => {
    idleEndSubject = new Subject<void>();
    timeoutEndSubject = new Subject<void>();
    countdownSubject = new Subject<number>();
    stateSubject = new BehaviorSubject<IdleDetectionState>({isCountingDown: false, countdown: null});
    idleEndSubject.subscribe(() => stateSubject.next({isCountingDown: true, countdown: stateSubject.value.countdown}));
    timeoutEndSubject.subscribe(() => stateSubject.next({isCountingDown: false, countdown: null}));
    countdownSubject.subscribe((countdown) => stateSubject.next({isCountingDown: true, countdown}));

    // Create a mock service instance
    const mockIdleDetectionService = {
      onIdleEnd: vi.fn(() => idleEndSubject.asObservable()),
      onTimeoutEnd: vi.fn(() => timeoutEndSubject.asObservable()),
      onCountDown: vi.fn(() => countdownSubject.asObservable()),
      observeState: vi.fn(() => stateSubject.asObservable()),
      startWatching: vi.fn(),
      watch: vi.fn(() => {
        mockIdleDetectionService.startWatching();
        return () => mockIdleDetectionService.clearTimers();
      }),
      setConfig: vi.fn(),
      resetTimer: vi.fn(),
      clearTimers: vi.fn(),
    } as unknown as IdleDetectionService;

    await TestBed.configureTestingModule({
      imports: [IdleDetectionComponent],
      providers: [
        {provide: IdleDetectionService, useValue: mockIdleDetectionService},
        {provide: TranslationService, useClass: MockTranslationService},
        provideNoopAnimations(),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(IdleDetectionComponent);
    component = fixture.componentInstance;
    idleDetectionService = TestBed.inject(IdleDetectionService);
    fixture.detectChanges();
  });

  afterEach(() => {
    idleEndSubject.complete();
    timeoutEndSubject.complete();
    countdownSubject.complete();
    stateSubject.complete();
  });

  it('should create', async () => {
    expect(component).toBeTruthy();
  });

  it('should start watching on init', async () => {
    component.ngOnInit();
    expect(idleDetectionService.startWatching).toHaveBeenCalled();
  });

  it('should set config when idleDurationInSeconds input changes', async () => {
    fixture.componentRef.setInput('idleDurationInSeconds', 10);
    fixture.detectChanges();
    await flushEffects();

    expect(idleDetectionService.setConfig).toHaveBeenCalledWith({idleDurationInSeconds: 10});
  });

  it('should set config when timeoutDurationInSeconds input changes', async () => {
    fixture.componentRef.setInput('timeoutDurationInSeconds', 5);
    fixture.detectChanges();
    await flushEffects();

    expect(idleDetectionService.setConfig).toHaveBeenCalledWith({timeoutDurationInSeconds: 5});
  });

  it('should set config when both inputs change', async () => {
    fixture.componentRef.setInput('idleDurationInSeconds', 10);
    fixture.componentRef.setInput('timeoutDurationInSeconds', 5);
    fixture.detectChanges();
    await flushEffects();

    expect(idleDetectionService.setConfig).toHaveBeenCalledWith({
      idleDurationInSeconds: 10,
      timeoutDurationInSeconds: 5,
    });
  });

  it('should not set config when inputs are undefined', async () => {
    fixture.componentRef.setInput('idleDurationInSeconds', undefined);
    fixture.componentRef.setInput('timeoutDurationInSeconds', undefined);
    fixture.detectChanges();
    await flushEffects();

    // Should not call setConfig with empty object
    const calls = (idleDetectionService.setConfig as ReturnType<typeof vi.fn>).mock.calls;
    const emptyConfigCalls = calls.filter((call) => {
      const config = call[0] as {idleDurationInSeconds?: number; timeoutDurationInSeconds?: number};
      return Object.keys(config).length === 0;
    });
    expect(emptyConfigCalls.length).toBe(0);
  });

  it('should emit timeout when timeoutEnd event occurs', async () => {
    const timeoutSpy = vi.spyOn(component.timeout, 'emit');

    timeoutEndSubject.next();
    await flushEffects(100);

    expect(timeoutSpy).toHaveBeenCalled();
  });

  it('should update open$ when idleEnd event occurs', async () => {
    let openValue: boolean | undefined;
    const subscription = component.open$.subscribe((value) => {
      openValue = value;
    });

    idleEndSubject.next();
    await flushEffects(100);

    expect(openValue).toBe(true);
    subscription.unsubscribe();
  });

  it('should update open$ when timeoutEnd event occurs', async () => {
    let openValue: boolean | undefined;
    const subscription = component.open$.subscribe((value) => {
      openValue = value;
    });

    timeoutEndSubject.next();
    await flushEffects(100);

    expect(openValue).toBe(false);
    subscription.unsubscribe();
  });

  it('should update open$ when closeSubject emits', async () => {
    let openValue: boolean | undefined;
    const subscription = component.open$.subscribe((value) => {
      openValue = value;
    });

    component['closeSubject'].next();
    await flushEffects(100);

    expect(openValue).toBe(false);
    subscription.unsubscribe();
  });

  it('should emit countdown values', async () => {
    let countdownValue: number | null | undefined;
    const subscription = component.countdown$.subscribe((value) => {
      countdownValue = value;
    });

    countdownSubject.next(10);
    await flushEffects(100);

    expect(countdownValue).toBe(10);
    subscription.unsubscribe();
  });

  it('should keep me signed in and reset timer', async () => {
    const closeSubjectSpy = vi.spyOn(component['closeSubject'], 'next');

    component.keepMeSignedIn();

    expect(closeSubjectSpy).toHaveBeenCalled();
    expect(idleDetectionService.resetTimer).toHaveBeenCalledWith(true);
  });

  it('should release shared service ownership on destroy', async () => {
    fixture.destroy();
    expect(idleDetectionService.clearTimers).toHaveBeenCalled();
  });

  it('should clear scoped timers on destroy when scoped is true', async () => {
    fixture.componentRef.setInput('scoped', true);
    fixture.detectChanges();
    const clearSpy = vi.spyOn(component['activeService'], 'clearTimers');
    fixture.destroy();
    expect(clearSpy).toHaveBeenCalled();
  });

  it('should handle multiple open$ emissions', async () => {
    const openValues: boolean[] = [];
    const subscription = component.open$.subscribe((value) => {
      openValues.push(value);
    });

    idleEndSubject.next();
    await flushEffects(100);
    component['closeSubject'].next();
    await flushEffects(100);
    timeoutEndSubject.next();
    await flushEffects(100);

    expect(openValues.length).toBeGreaterThan(0);
    subscription.unsubscribe();
  });

  it('should handle countdown sequence', async () => {
    const countdownValues: (number | null)[] = [];
    const subscription = component.countdown$.subscribe((value) => {
      countdownValues.push(value);
    });

    countdownSubject.next(5);
    await flushEffects(100);
    countdownSubject.next(4);
    await flushEffects(100);
    countdownSubject.next(3);
    await flushEffects(100);

    expect(countdownValues).toEqual([null, 5, 4, 3]);
    subscription.unsubscribe();
  });
});

describe('IdleDetectionComponent service ownership', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [IdleDetectionComponent],
      providers: [
        IdleDetectionService,
        {provide: TranslationService, useClass: MockTranslationService},
        provideNoopAnimations(),
      ],
    });
  });

  it('keeps shared timers until the last component leaves and then releases them', async () => {
    const service = TestBed.inject(IdleDetectionService);
    const idle = vi.fn();
    service.onIdleEnd().subscribe(idle);
    const first = TestBed.createComponent(IdleDetectionComponent);
    const second = TestBed.createComponent(IdleDetectionComponent);
    first.componentRef.setInput('idleDurationInSeconds', 2);
    second.componentRef.setInput('idleDurationInSeconds', 2);
    first.detectChanges();
    second.detectChanges();
    first.destroy();
    await vi.advanceTimersByTimeAsync(2000);
    expect(idle).toHaveBeenCalledTimes(1);
    second.destroy();
    document.dispatchEvent(new Event('mousemove'));
    await vi.advanceTimersByTimeAsync(5000);
    expect(idle).toHaveBeenCalledTimes(1);
  });

  it('applies scoped input configuration before starting and isolates timers', async () => {
    const first = TestBed.createComponent(IdleDetectionComponent);
    const second = TestBed.createComponent(IdleDetectionComponent);
    for (const fixture of [first, second]) fixture.componentRef.setInput('scoped', true);
    first.componentRef.setInput('idleDurationInSeconds', 1);
    second.componentRef.setInput('idleDurationInSeconds', 3);
    const firstIdle = vi.fn();
    const secondIdle = vi.fn();
    first.componentInstance['activeService'].onIdleEnd().subscribe(firstIdle);
    second.componentInstance['activeService'].onIdleEnd().subscribe(secondIdle);
    first.detectChanges();
    second.detectChanges();
    await vi.advanceTimersByTimeAsync(1000);
    expect(firstIdle).toHaveBeenCalledTimes(1);
    expect(secondIdle).not.toHaveBeenCalled();
    first.destroy();
    await vi.advanceTimersByTimeAsync(2000);
    expect(secondIdle).toHaveBeenCalledTimes(1);
    second.destroy();
  });
});
