import {ComponentFixture, TestBed} from '@angular/core/testing';
import {beforeEach, describe, expect, it} from 'vitest';
import {StateInspectorComponent} from './state-inspector.component';

describe('StateInspectorComponent', () => {
  let component: StateInspectorComponent;
  let fixture: ComponentFixture<StateInspectorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StateInspectorComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(StateInspectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create successfully with default title', () => {
    expect(component).toBeTruthy();
    expect(component.title()).toBe('Live Signal State');
  });

  it('should parse data items with correct status styles', () => {
    fixture.componentRef.setInput('data', {
      isValid: true,
      hasError: false,
      status: 'loading',
      count: 42,
    });
    fixture.detectChanges();

    const items = component.items();
    expect(items.length).toBe(4);

    const validItem = items.find((i) => i.label === 'isValid');
    expect(validItem?.status).toBe('success');

    const errorItem = items.find((i) => i.label === 'hasError');
    expect(errorItem?.status).toBe('neutral');

    const statusItem = items.find((i) => i.label === 'status');
    expect(statusItem?.status).toBe('warning');

    const countItem = items.find((i) => i.label === 'count');
    expect(countItem?.status).toBe('info');
  });

  it('should toggle raw JSON panel', () => {
    fixture.componentRef.setInput('data', {user: 'Alice'});
    fixture.detectChanges();

    expect(component.isRawExpanded()).toBe(false);
    component.toggleRaw();
    expect(component.isRawExpanded()).toBe(true);
  });

  it('should format values correctly', () => {
    expect(component.formatValue(null)).toBe('null');
    expect(component.formatValue(undefined)).toBe('undefined');
    expect(component.formatValue({foo: 'bar'})).toBe('{"foo":"bar"}');
    expect(component.formatValue('hello')).toBe('hello');
  });
});
