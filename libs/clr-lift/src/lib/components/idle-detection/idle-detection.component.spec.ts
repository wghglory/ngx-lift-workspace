import {ComponentFixture, fakeAsync, TestBed, tick} from '@angular/core/testing';
import {IdleDetectionService} from 'ngx-lift';
import {Subject} from 'rxjs';
import {vi} from 'vitest';

import {TranslationService} from '../../services/translation.service';
import {MockTranslationService} from '../../services/translation.service.mock';
import {IdleDetectionComponent} from './idle-detection.component';

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

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should start watching on init', () => {
    component.ngOnInit();
    expect(idleDetectionService.startWatching).toHaveBeenCalled();
  });

  it('should set config when idleDurationInSeconds input changes', fakeAsync(() => {
    fixture.componentRef.setInput('idleDurationInSeconds', 10);
    fixture.detectChanges();
    tick();

    expect(idleDetectionService.setConfig).toHaveBeenCalledWith({idleDurationInSeconds: 10});
  }));

  it('should set config when timeoutDurationInSeconds input changes', fakeAsync(() => {
    fixture.componentRef.setInput('timeoutDurationInSeconds', 5);
    fixture.detectChanges();
    tick();

    expect(idleDetectionService.setConfig).toHaveBeenCalledWith({timeoutDurationInSeconds: 5});
  }));

  it('should set config when both inputs change', fakeAsync(() => {
    fixture.componentRef.setInput('idleDurationInSeconds', 10);
    fixture.componentRef.setInput('timeoutDurationInSeconds', 5);
    fixture.detectChanges();
    tick();

    expect(idleDetectionService.setConfig).toHaveBeenCalledWith({
      idleDurationInSeconds: 10,
      timeoutDurationInSeconds: 5,
    });
  }));

  it('should not set config when inputs are undefined', fakeAsync(() => {
    fixture.componentRef.setInput('idleDurationInSeconds', undefined);
    fixture.componentRef.setInput('timeoutDurationInSeconds', undefined);
    fixture.detectChanges();
    tick();

    // Should not call setConfig with empty object
    const calls = (idleDetectionService.setConfig as ReturnType<typeof vi.fn>).mock.calls;
    const emptyConfigCalls = calls.filter((call) => {
      const config = call[0] as {idleDurationInSeconds?: number; timeoutDurationInSeconds?: number};
      return Object.keys(config).length === 0;
    });
    expect(emptyConfigCalls.length).toBe(0);
  }));

  it('should emit timeout when timeoutEnd event occurs', fakeAsync(() => {
    const timeoutSpy = vi.spyOn(component.timeout, 'emit');

    timeoutEndSubject.next();
    tick(100);

    expect(timeoutSpy).toHaveBeenCalled();
  }));

  it('should update open$ when idleEnd event occurs', fakeAsync(() => {
    let openValue: boolean | undefined;
    const subscription = component.open$.subscribe((value) => {
      openValue = value;
    });

    idleEndSubject.next();
    tick(100);

    expect(openValue).toBe(true);
    subscription.unsubscribe();
  }));

  it('should update open$ when timeoutEnd event occurs', fakeAsync(() => {
    let openValue: boolean | undefined;
    const subscription = component.open$.subscribe((value) => {
      openValue = value;
    });

    timeoutEndSubject.next();
    tick(100);

    expect(openValue).toBe(false);
    subscription.unsubscribe();
  }));

  it('should update open$ when closeSubject emits', fakeAsync(() => {
    let openValue: boolean | undefined;
    const subscription = component.open$.subscribe((value) => {
      openValue = value;
    });

    component['closeSubject'].next();
    tick(100);

    expect(openValue).toBe(false);
    subscription.unsubscribe();
  }));

  it('should emit countdown values', fakeAsync(() => {
    let countdownValue: number | undefined;
    const subscription = component.countdown$.subscribe((value) => {
      countdownValue = value;
    });

    countdownSubject.next(10);
    tick(100);

    expect(countdownValue).toBe(10);
    subscription.unsubscribe();
  }));

  it('should keep me signed in and reset timer', () => {
    const closeSubjectSpy = vi.spyOn(component['closeSubject'], 'next');

    component.keepMeSignedIn();

    expect(closeSubjectSpy).toHaveBeenCalled();
    expect(idleDetectionService.resetTimer).toHaveBeenCalledWith(true);
  });

  it('should clear timers on destroy', () => {
    // Trigger destroy
    fixture.destroy();

    expect(idleDetectionService.clearTimers).toHaveBeenCalled();
  });

  it('should handle multiple open$ emissions', fakeAsync(() => {
    const openValues: boolean[] = [];
    const subscription = component.open$.subscribe((value) => {
      openValues.push(value);
    });

    idleEndSubject.next();
    tick(100);
    component['closeSubject'].next();
    tick(100);
    timeoutEndSubject.next();
    tick(100);

    expect(openValues.length).toBeGreaterThan(0);
    subscription.unsubscribe();
  }));

  it('should handle countdown sequence', fakeAsync(() => {
    const countdownValues: number[] = [];
    const subscription = component.countdown$.subscribe((value) => {
      countdownValues.push(value);
    });

    countdownSubject.next(5);
    tick(100);
    countdownSubject.next(4);
    tick(100);
    countdownSubject.next(3);
    tick(100);

    expect(countdownValues).toEqual([5, 4, 3]);
    subscription.unsubscribe();
  }));
});
