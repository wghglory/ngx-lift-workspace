import {beforeEach, afterEach, vi} from 'vitest';
import {ComponentFixture, TestBed} from '@angular/core/testing';

import {SpinnerComponent} from './spinner.component';

beforeEach(() => {
  vi.useFakeTimers();
});

afterEach(() => {
  vi.useRealTimers();
});

describe('SpinnerComponent', () => {
  let component: SpinnerComponent;
  let fixture: ComponentFixture<SpinnerComponent>;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      imports: [SpinnerComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SpinnerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', async () => {
    expect(component).toBeTruthy();
  });
});

describe('Spinner accessible status', () => {
  it('exposes a localized status label only in meaningful mode', () => {
    const fixture = TestBed.createComponent(SpinnerComponent);
    fixture.detectChanges();
    const spinner = fixture.nativeElement.querySelector('.spinner');
    expect(spinner.getAttribute('aria-hidden')).toBe('true');
    fixture.componentRef.setInput('decorative', false);
    fixture.detectChanges();
    expect(spinner.getAttribute('aria-label')).toBe('Loading');
    fixture.componentRef.setInput('label', '加载中');
    fixture.detectChanges();
    expect(spinner.getAttribute('role')).toBe('status');
    expect(spinner.getAttribute('aria-label')).toBe('加载中');
    expect(spinner.hasAttribute('aria-hidden')).toBe(false);
  });
});

describe('Spinner layout classes', () => {
  it('forwards consumer classes while retaining size and layout styling', () => {
    const fixture = TestBed.createComponent(SpinnerComponent);
    fixture.componentRef.setInput('class', 'consumer-spinner');
    fixture.componentRef.setInput('size', 'sm');
    fixture.componentRef.setInput('inline', true);
    fixture.componentRef.setInput('center', false);
    fixture.detectChanges();
    const element = fixture.nativeElement.querySelector('.spinner');
    expect(element.classList.contains('consumer-spinner')).toBe(true);
    expect(element.classList.contains('spinner-sm')).toBe(true);
    expect(element.classList.contains('spinner-inline')).toBe(true);
    expect(element.classList.contains('mx-auto')).toBe(false);
  });
});
