import {ComponentFixture, TestBed} from '@angular/core/testing';
import {provideNoopAnimations} from '@angular/platform-browser/animations';
import {KubernetesObjectCondition} from 'ngx-lift';
import {beforeEach, describe, expect, it, vi} from 'vitest';

import {StatusConditionsGridComponent} from './status-conditions-grid.component';

describe('StatusConditionsGridComponent', () => {
  let component: StatusConditionsGridComponent;
  let fixture: ComponentFixture<StatusConditionsGridComponent>;

  const mockConditions: KubernetesObjectCondition[] = [
    {
      type: 'Ready',
      status: 'True',
      reason: 'PodReady',
      message: 'All containers are ready',
      lastTransitionTime: '2026-10-10T08:00:00Z',
      observedGeneration: 3,
    },
    {
      type: 'ContainersReady',
      status: 'True',
      reason: 'ContainersReady',
      message: 'Containers are ready',
      lastTransitionTime: '2026-10-10T07:59:00Z',
      observedGeneration: 3,
    },
    {
      type: 'Initialized',
      status: 'True',
      reason: 'PodInitialized',
      message: 'Pod was initialized',
      lastTransitionTime: '',
      observedGeneration: 1,
    },
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StatusConditionsGridComponent],
      providers: [provideNoopAnimations()],
    }).compileComponents();

    fixture = TestBed.createComponent(StatusConditionsGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should render conditions when provided', () => {
    fixture.componentRef.setInput('conditions', mockConditions);
    fixture.detectChanges();

    const cells = fixture.nativeElement.querySelectorAll('clr-dg-cell');
    expect(cells.length).toBeGreaterThan(0);
  });

  it('should compare conditions by lastTransitionTime with timeComparator', () => {
    const comparator = component.timeComparator;

    const cond1 = mockConditions[0]; // 08:00:00
    const cond2 = mockConditions[1]; // 07:59:00
    const cond3 = mockConditions[2]; // empty time (Infinity)

    // cond1 > cond2 => positive
    expect(comparator.compare(cond1, cond2)).toBeGreaterThan(0);
    // cond2 < cond1 => negative
    expect(comparator.compare(cond2, cond1)).toBeLessThan(0);
    // identical time
    expect(comparator.compare(cond1, cond1)).toBe(0);
    // Infinity comparison
    expect(comparator.compare(cond1, cond3)).toBeLessThan(0);
  });

  it('should export JSON when exportJson() is called', () => {
    fixture.componentRef.setInput('conditions', mockConditions);
    fixture.componentRef.setInput('exportFileName', 'test-pod');
    fixture.detectChanges();

    const createObjectURLSpy = vi.spyOn(URL, 'createObjectURL').mockReturnValue('blob:mock-url');
    const revokeObjectURLSpy = vi.spyOn(URL, 'revokeObjectURL').mockImplementation(() => {
      // Mock revoke
    });

    const clickSpy = vi.fn();
    const originalCreateElement = document.createElement.bind(document);
    vi.spyOn(document, 'createElement').mockImplementation((tagName: string) => {
      const el = originalCreateElement(tagName);
      if (tagName === 'a') {
        el.click = clickSpy;
      }
      return el;
    });

    component.exportJson();

    expect(createObjectURLSpy).toHaveBeenCalled();
    expect(clickSpy).toHaveBeenCalled();

    createObjectURLSpy.mockRestore();
    revokeObjectURLSpy.mockRestore();
  });
});
