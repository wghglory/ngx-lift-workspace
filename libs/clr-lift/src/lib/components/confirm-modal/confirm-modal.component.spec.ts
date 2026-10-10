import {InteractivityChecker} from '@angular/cdk/a11y';
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {provideNoopAnimations} from '@angular/platform-browser/animations';
import {of, throwError} from 'rxjs';
import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest';

import {flushEffects} from '../../../test-setup';
import {ToastService} from '../toast/toast.service';
import {ConfirmModalComponent} from './confirm-modal.component';

describe('ConfirmModalComponent', () => {
  let component: ConfirmModalComponent;
  let fixture: ComponentFixture<ConfirmModalComponent>;
  let toastService: ToastService;

  beforeEach(async () => {
    vi.useFakeTimers();

    await TestBed.configureTestingModule({
      imports: [ConfirmModalComponent],
      providers: [provideNoopAnimations()],
    })
      .overrideProvider(InteractivityChecker, {
        useValue: {
          isFocusable: () => true,
        },
      })
      .compileComponents();

    fixture = TestBed.createComponent(ConfirmModalComponent);
    component = fixture.componentInstance;
    toastService = TestBed.inject(ToastService);

    fixture.componentRef.setInput('title', 'Delete Cluster');
    fixture.componentRef.setInput('action$', of({success: true}));
    fixture.detectChanges();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should close modal, reset resource, and emit cancelled when cancel() is called', () => {
    const cancelSpy = vi.fn();
    component.cancelled.subscribe(cancelSpy);

    component.open.set(true);
    fixture.detectChanges();

    component.cancel();
    fixture.detectChanges();

    expect(component.open()).toBe(false);
    expect(cancelSpy).toHaveBeenCalledTimes(1);
  });

  it('should execute action$ when confirm() is called', () => {
    const actionMock$ = of({status: 'ok'});
    fixture.componentRef.setInput('action$', actionMock$);
    fixture.componentRef.setInput('open', true);
    fixture.detectChanges();

    const executeSpy = vi.spyOn(component.confirmRef, 'execute');
    component.confirm();

    expect(executeSpy).toHaveBeenCalled();
  });

  it('should show toast and emit completed on successful confirmation', async () => {
    const toastSpy = vi.spyOn(toastService, 'addToast');
    const completeSpy = vi.fn();
    component.completed.subscribe(completeSpy);

    fixture.componentRef.setInput('toastHeader', 'Operation Successful');
    fixture.componentRef.setInput('toastDescription', 'Resource was removed.');
    fixture.componentRef.setInput('action$', of({result: 'deleted'}));
    component.open.set(true);
    fixture.detectChanges();

    component.confirm();
    fixture.detectChanges();

    await flushEffects(50);

    expect(toastSpy).toHaveBeenCalledWith({
      title: 'Operation Successful',
      description: 'Resource was removed.',
      toastType: 'success',
    });
    expect(completeSpy).toHaveBeenCalledWith({result: 'deleted'});
    expect(component.open()).toBe(false);
  });

  it('should not show toast on successful confirmation if toastHeader is omitted', async () => {
    const toastSpy = vi.spyOn(toastService, 'addToast');
    const completeSpy = vi.fn();
    component.completed.subscribe(completeSpy);

    fixture.componentRef.setInput('action$', of({result: 'ok'}));
    component.open.set(true);
    fixture.detectChanges();

    component.confirm();
    fixture.detectChanges();

    await flushEffects(50);

    expect(toastSpy).not.toHaveBeenCalled();
    expect(completeSpy).toHaveBeenCalledWith({result: 'ok'});
    expect(component.open()).toBe(false);
  });

  it('should display error and keep modal open on failed confirmation', async () => {
    const error = new Error('Database deletion failed');
    fixture.componentRef.setInput(
      'action$',
      throwError(() => error),
    );
    component.open.set(true);
    fixture.detectChanges();

    component.confirm();
    fixture.detectChanges();

    await flushEffects(50);
    fixture.detectChanges();

    expect(component.open()).toBe(true);
    expect(component.error()).toBeTruthy();

    const alertEl = fixture.nativeElement.querySelector('cll-alert');
    expect(alertEl).toBeTruthy();
  });

  it('should resolve custom button texts when provided', () => {
    fixture.componentRef.setInput('confirmButtonText', 'Proceed to Delete');
    fixture.componentRef.setInput('cancelButtonText', 'Never mind');
    fixture.detectChanges();

    expect(component.resolvedConfirmText()).toBe('Proceed to Delete');
    expect(component.resolvedCancelText()).toBe('Never mind');
  });

  it('should fallback to localized default button texts when custom text is not provided', () => {
    expect(component.resolvedConfirmText()).toBe('Confirm');
    expect(component.resolvedCancelText()).toBe('Cancel');
  });
});
