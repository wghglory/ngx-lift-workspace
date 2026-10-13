import {provideHttpClient} from '@angular/common/http';
import {provideNoopAnimations} from '@angular/platform-browser/animations';
import {provideHttpClientTesting} from '@angular/common/http/testing';
import {afterEach, vi} from 'vitest';
import {ComponentFixture, TestBed} from '@angular/core/testing';

import {PollComponent} from './poll.component';

describe('PollComponent', () => {
  let component: PollComponent;
  let fixture: ComponentFixture<PollComponent>;

  beforeEach(async () => {
    vi.useFakeTimers();
    await TestBed.configureTestingModule({
      imports: [PollComponent],
      providers: [provideHttpClient(), provideHttpClientTesting(), provideNoopAnimations()],
    }).compileComponents();

    fixture = TestBed.createComponent(PollComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    fixture.destroy();
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('updates signal filter and handles rapid refreshes', () => {
    component.setSignalFilter('active');
    expect(component.signalFilter()).toBe('active');

    component.triggerRapidRefreshes();
    expect(component.signalFilter()).toBe('active');
  });
  it('updates an existing first-name filter without removing other filters', async () => {
    const getUsers = vi.spyOn(component.userService, 'getUsers');
    await vi.advanceTimersByTimeAsync(0);
    component.refresh({filters: [{property: 'lastName', value: 'Developer'}]});
    component.searchByFirstName('Alex');
    await vi.advanceTimersByTimeAsync(500);
    expect(getUsers.mock.calls.at(-1)?.[0]?.['filter']).toContain('firstName==*Alex*');
    component.searchByFirstName('Jamie');
    await vi.advanceTimersByTimeAsync(500);
    const filter = getUsers.mock.calls.at(-1)?.[0]?.['filter'];
    expect(filter).toContain('lastName==*Developer*');
    expect(filter).toContain('firstName==*Jamie*');
    expect(filter).not.toContain('Alex');
  });
  it('cancels manual demonstration polling when the page is destroyed', async () => {
    const random = vi.spyOn(Math, 'random').mockReturnValue(0.5);
    component.start();
    await vi.advanceTimersByTimeAsync(300);
    expect(random.mock.calls.length).toBeGreaterThan(0);
    fixture.destroy();
    const before = random.mock.calls.length;
    await vi.advanceTimersByTimeAsync(2500);
    expect(random.mock.calls.length).toBe(before);
  });
  it('runs signal polling with latest parameters and settles visible logs', async () => {
    const states: {data: {totalItems: number} | null}[] = [];
    const subscription = component.signalPollState$.subscribe((state) => states.push(state));
    fixture.detectChanges();
    await vi.advanceTimersByTimeAsync(1000);
    component.setSignalFilter('inactive');
    fixture.detectChanges();
    await vi.advanceTimersByTimeAsync(1000);
    expect(states.some((state) => state.data?.totalItems === 15)).toBe(true);
    expect(component.signalPollLogs().some((log) => log.status === 'settled')).toBe(true);
    subscription.unsubscribe();
  });
  it('restarts rapid refresh timers and cancels them with the page', async () => {
    component.triggerRapidRefreshes();
    await vi.advanceTimersByTimeAsync(80);
    expect(component.signalFilter()).toBe('inactive');
    component.triggerRapidRefreshes();
    await vi.advanceTimersByTimeAsync(200);
    expect(component.signalFilter()).toBe('all');
    component.triggerRapidRefreshes();
    fixture.destroy();
    await vi.advanceTimersByTimeAsync(200);
    expect(component.signalFilter()).toBe('active');
  });
  it('scrolls to the selected example', () => {
    const element = {scrollIntoView: vi.fn()} as unknown as HTMLElement;
    component.scrollToElement(element);
    expect(element.scrollIntoView).toHaveBeenCalledWith({behavior: 'smooth', block: 'start', inline: 'nearest'});
  });
});
