import {InteractivityChecker} from '@angular/cdk/a11y';
import {TestBed} from '@angular/core/testing';
import {provideNoopAnimations} from '@angular/platform-browser/animations';
import {IdleDetectionService} from 'ngx-lift';
import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest';

import {TranslationService} from '../../services/translation.service';
import {MockTranslationService} from '../../services/translation.service.mock';
import {IdleDetectionComponent} from './idle-detection.component';

describe('IdleDetectionComponent state across scopes', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    TestBed.configureTestingModule({
      imports: [IdleDetectionComponent],
      providers: [
        IdleDetectionService,
        provideNoopAnimations(),
        {provide: TranslationService, useClass: MockTranslationService},
        {provide: InteractivityChecker, useValue: {isFocusable: () => true}},
      ],
    });
  });
  afterEach(() => {
    TestBed.resetTestingModule();
    vi.clearAllTimers();
    vi.useRealTimers();
  });

  it('clears a previous modal and countdown when switching to a fresh scoped service', async () => {
    const fixture = TestBed.createComponent(IdleDetectionComponent);
    fixture.componentRef.setInput('idleDurationInSeconds', 1);
    fixture.componentRef.setInput('timeoutDurationInSeconds', 5);
    let open: boolean | undefined;
    let countdown: number | null | undefined;
    const subscriptions = [
      fixture.componentInstance.open$.subscribe((value) => (open = value)),
      fixture.componentInstance.countdown$.subscribe((value) => (countdown = value)),
    ];
    fixture.detectChanges();
    await vi.advanceTimersByTimeAsync(1000);
    fixture.detectChanges();
    expect(open).toBe(true);
    expect(countdown).toBe(5);
    expect(fixture.nativeElement.querySelector('[role="dialog"]')).not.toBeNull();
    fixture.componentRef.setInput('scoped', true);
    fixture.detectChanges();
    TestBed.tick();
    expect(open).toBe(false);
    expect(countdown).toBeNull();
    expect(fixture.nativeElement.querySelector('[role="dialog"]')).toBeNull();
    subscriptions.forEach((subscription) => subscription.unsubscribe());
    fixture.destroy();
  });

  it('shows the current countdown when joining an already active shared service', async () => {
    const service = TestBed.inject(IdleDetectionService);
    service.setConfig({idleDurationInSeconds: 1, timeoutDurationInSeconds: 5});
    service.startWatching();
    await vi.advanceTimersByTimeAsync(2000);
    const fixture = TestBed.createComponent(IdleDetectionComponent);
    let open: boolean | undefined;
    let countdown: number | null | undefined;
    const subscriptions = [
      fixture.componentInstance.open$.subscribe((value) => (open = value)),
      fixture.componentInstance.countdown$.subscribe((value) => (countdown = value)),
    ];
    fixture.detectChanges();
    expect(open).toBe(true);
    expect(countdown).toBe(4);
    expect(fixture.nativeElement.querySelector('[role="dialog"]')).not.toBeNull();
    subscriptions.forEach((subscription) => subscription.unsubscribe());
    fixture.destroy();
  });

  it('closes all shared modals when one consumer keeps the session active', async () => {
    const first = TestBed.createComponent(IdleDetectionComponent);
    const second = TestBed.createComponent(IdleDetectionComponent);
    for (const fixture of [first, second]) {
      fixture.componentRef.setInput('idleDurationInSeconds', 1);
      fixture.componentRef.setInput('timeoutDurationInSeconds', 5);
      fixture.detectChanges();
    }
    await vi.advanceTimersByTimeAsync(1000);
    for (const fixture of [first, second]) {
      fixture.detectChanges();
      expect(fixture.nativeElement.querySelector('[role="dialog"]')).not.toBeNull();
    }
    first.componentInstance.keepMeSignedIn();
    for (const fixture of [first, second]) {
      fixture.detectChanges();
      expect(fixture.nativeElement.querySelector('[role="dialog"]')).toBeNull();
      fixture.destroy();
    }
  });
});
