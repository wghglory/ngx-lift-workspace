import {ComponentFixture, TestBed} from '@angular/core/testing';
import {provideNoopAnimations} from '@angular/platform-browser/animations';
import {KubernetesObjectCondition} from 'ngx-lift';
import {beforeEach, describe, expect, it} from 'vitest';

import {DEFAULT_STATUS_REASON, K8S_STATUS_REASON} from './k8s-status.constants';
import {K8sObjectStatusSignpostComponent} from './k8s-object-status-signpost.component';

describe('K8sObjectStatusSignpostComponent', () => {
  let component: K8sObjectStatusSignpostComponent;
  let fixture: ComponentFixture<K8sObjectStatusSignpostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [K8sObjectStatusSignpostComponent],
      providers: [provideNoopAnimations()],
    }).compileComponents();

    fixture = TestBed.createComponent(K8sObjectStatusSignpostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should default to Queued status reason when conditions are empty', () => {
    expect(component.statusReason()).toBe(DEFAULT_STATUS_REASON);
    expect(component.shouldShowSignpost()).toBe(false);
  });

  it('should extract Ready condition reason when present', () => {
    const conditions: KubernetesObjectCondition[] = [
      {
        type: 'Initialized',
        status: 'True',
        reason: 'PodInitialized',
        message: 'Init complete',
        lastTransitionTime: '2026-10-10T00:00:00Z',
      },
      {
        type: 'Ready',
        status: 'True',
        reason: K8S_STATUS_REASON.READY,
        message: 'Pod is ready',
        lastTransitionTime: '2026-10-10T00:01:00Z',
      },
    ];

    fixture.componentRef.setInput('conditions', conditions);
    fixture.detectChanges();

    expect(component.statusReason()).toBe(K8S_STATUS_REASON.READY);
    expect(component.statusClasses()['text-success']).toBe(true);
    expect(component.shouldShowSignpost()).toBe(true);
  });

  it('should fallback to first condition reason when Ready is not present', () => {
    const conditions: KubernetesObjectCondition[] = [
      {
        type: 'StorageProvisioned',
        status: 'True',
        reason: 'StorageCreated',
        message: 'Volume ready',
        lastTransitionTime: '2026-10-10T00:00:00Z',
      },
    ];

    fixture.componentRef.setInput('conditions', conditions);
    fixture.detectChanges();

    expect(component.statusReason()).toBe('StorageCreated');
  });

  it('should apply correct color classes based on semantic reasons', () => {
    // Error
    fixture.componentRef.setInput('conditions', [
      {
        type: 'Ready',
        status: 'False',
        reason: K8S_STATUS_REASON.FAILED,
        message: '',
        lastTransitionTime: '',
      },
    ]);
    fixture.detectChanges();
    expect(component.statusClasses()['text-error']).toBe(true);

    // Warning
    fixture.componentRef.setInput('conditions', [
      {
        type: 'Ready',
        status: 'False',
        reason: K8S_STATUS_REASON.DEGRADED,
        message: '',
        lastTransitionTime: '',
      },
    ]);
    fixture.detectChanges();
    expect(component.statusClasses()['text-warning']).toBe(true);

    // Info
    fixture.componentRef.setInput('conditions', [
      {
        type: 'Ready',
        status: 'False',
        reason: K8S_STATUS_REASON.INPROGRESS,
        message: '',
        lastTransitionTime: '',
      },
    ]);
    fixture.detectChanges();
    expect(component.statusClasses()['text-info']).toBe(true);
  });

  it('should apply custom statusClass when provided', () => {
    fixture.componentRef.setInput('statusClass', 'custom-badge-color');
    fixture.detectChanges();

    expect(component.statusClasses()['custom-badge-color']).toBe(true);
  });

  it('should suppress signpost when showSignpost is false', () => {
    fixture.componentRef.setInput('conditions', [
      {
        type: 'Ready',
        status: 'True',
        reason: 'Ready',
        message: '',
        lastTransitionTime: '',
      },
    ]);
    fixture.componentRef.setInput('showSignpost', false);
    fixture.detectChanges();

    expect(component.shouldShowSignpost()).toBe(false);
  });
});
