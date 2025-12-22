import {TestBed} from '@angular/core/testing';

import {ToastService} from './toast.service';
import {Toast} from './toast.type';

describe('ToastService', () => {
  let toastService: ToastService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ToastService],
    });

    toastService = TestBed.inject(ToastService);
  });

  it('should be created', () => {
    expect(toastService).toBeTruthy();
  });

  it('should add a toast', () => {
    const toast: Toast = {
      title: 'Test Title',
      description: 'Test Description',
    };

    const result = toastService.addToast(toast);

    expect(result).toBeTruthy();
    expect(result.title).toBe('Test Title');
    expect(result.description).toBe('Test Description');
  });

  it('should add a success toast', () => {
    const toast: Toast = {
      title: 'Test Title',
      description: 'Test Description',
    };

    const result = toastService.success(toast);

    expect(result).toBeTruthy();
    expect(result.toastType).toBe('success');
  });

  it('should add a warning toast', () => {
    const toast: Toast = {
      title: 'Test Title',
      description: 'Test Description',
    };

    const result = toastService.warning(toast);

    expect(result).toBeTruthy();
    expect(result.toastType).toBe('warning');
  });

  it('should add an info toast', () => {
    const toast: Toast = {
      title: 'Test Title',
      description: 'Test Description',
    };

    const result = toastService.info(toast);

    expect(result).toBeTruthy();
    expect(result.toastType).toBe('info');
  });

  it('should add an error toast', () => {
    const toast: Toast = {
      title: 'Test Title',
      description: 'Test Description',
    };

    const result = toastService.error(toast);

    expect(result).toBeTruthy();
    expect(result.toastType).toBe('error');
  });

  it('should delete a toast', () => {
    const toast: Toast = {
      title: 'Test Title',
      description: 'Test Description',
    };

    const addedToast = toastService.addToast(toast);

    toastService.deleteToast(addedToast.id);

    const toasts = toastService['toastsBS'].value;
    expect(toasts.length).toBe(0);
  });

  it('should clear toasts', () => {
    const toast: Toast = {
      title: 'Test Title',
      description: 'Test Description',
    };

    toastService.addToast(toast);

    toastService.clearToasts();

    const toasts = toastService['toastsBS'].value;
    expect(toasts.length).toBe(0);
  });
});
