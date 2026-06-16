import {flushEffects} from '../../../test-setup';
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {provideNoopAnimations} from '@angular/platform-browser/animations';
import {IdleDetectionService} from 'ngx-lift';
import {Subject} from 'rxjs';
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

  beforeEach(async () => {
    idleEndSubject = new Subject<void>();
    timeoutEndSubject = new Subject<void>();
    countdownSubject = new Subject<number>();

    // Create a mock service instance
    const mockIdleDetectionService = {
      onIdleEnd: vi.fn(() => idleEndSubject.asObservable()),
      onTimeoutEnd: vi.fn(() => timeoutEndSubject.asObservable()),
      onCountDown: vi.fn(() => countdownSubject.asObservable()),
      startWatching: vi.fn(),
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
    let countdownValue: number | undefined;
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

  it('should clear timers on destroy', async () => {
    // Trigger destroy
    fixture.destroy();

    expect(idleDetectionService.clearTimers).toHaveBeenCalled();
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
    const countdownValues: number[] = [];
    const subscription = component.countdown$.subscribe((value) => {
      countdownValues.push(value);
    });

    countdownSubject.next(5);
    await flushEffects(100);
    countdownSubject.next(4);
    await flushEffects(100);
    countdownSubject.next(3);
    await flushEffects(100);

    expect(countdownValues).toEqual([5, 4, 3]);
    subscription.unsubscribe();
  });
});
