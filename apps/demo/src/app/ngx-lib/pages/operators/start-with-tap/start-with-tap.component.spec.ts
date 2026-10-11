import {ComponentFixture, TestBed} from '@angular/core/testing';

import {StartWithTapComponent} from './start-with-tap.component';

describe('StartWithTapComponent', () => {
  let component: StartWithTapComponent;
  let fixture: ComponentFixture<StartWithTapComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StartWithTapComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(StartWithTapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initiate fetch and set loading indicator immediately via startWithTap', () => {
    component.executeFetch();
    expect(component.isLoading()).toBe(true);
    expect(component.logs().some((l) => l.includes('startWithTap executed'))).toBe(true);
  });

  it('should clear logs and reset fetched data', () => {
    component.logs.set(['test log']);
    component.clearLogs();
    expect(component.logs().length).toBe(0);
    expect(component.fetchedData()).toBeNull();
  });
});
