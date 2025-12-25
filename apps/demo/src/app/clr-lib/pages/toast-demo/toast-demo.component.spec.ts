import {ComponentFixture, TestBed} from '@angular/core/testing';
import {Toast, ToastService} from 'clr-lift';
import {MockInstance, vi} from 'vitest';

import {ToastDemoComponent} from './toast-demo.component';

describe('ToastDemoComponent', () => {
  let component: ToastDemoComponent;
  let fixture: ComponentFixture<ToastDemoComponent>;
  let toastService: ToastService;
  let addToastSpy: MockInstance<(toast: Toast) => unknown>;
  let successSpy: MockInstance<(toast: Toast) => unknown>;
  let warningSpy: MockInstance<(toast: Toast) => unknown>;
  let errorSpy: MockInstance<(toast: Toast) => unknown>;
  let infoSpy: MockInstance<(toast: Toast) => unknown>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ToastDemoComponent],
      providers: [ToastService],
    }).compileComponents();

    fixture = TestBed.createComponent(ToastDemoComponent);
    component = fixture.componentInstance;
    toastService = TestBed.inject(ToastService);

    // Create spies for toast service methods
    addToastSpy = vi.spyOn(toastService, 'addToast');
    successSpy = vi.spyOn(toastService, 'success');
    warningSpy = vi.spyOn(toastService, 'warning');
    errorSpy = vi.spyOn(toastService, 'error');
    infoSpy = vi.spyOn(toastService, 'info');

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize code blocks', () => {
    expect(component.containerCode).toBeTruthy();
    expect(component.addToastCode).toBeTruthy();
    expect(component.shortHandCode).toBeTruthy();
  });

  it('should have containerCode with ToastContainerComponent', () => {
    expect(component.containerCode).toContain('ToastContainerComponent');
    expect(component.containerCode).toContain('cll-toast-container');
  });

  it('should have addToastCode with toastService.addToast', () => {
    // Code is HTML-encoded by highlight.js, so check for method name and properties
    expect(component.addToastCode).toContain('addToast');
    expect(component.addToastCode).toContain('title');
    expect(component.addToastCode).toContain('description');
  });

  it('should have shortHandCode with success, warning, error, info methods', () => {
    // Code is HTML-encoded by highlight.js, so check for method names
    expect(component.shortHandCode).toContain('success');
    expect(component.shortHandCode).toContain('warning');
    expect(component.shortHandCode).toContain('error');
    expect(component.shortHandCode).toContain('info');
  });

  describe('showAddToast', () => {
    it('should call toastService.addToast with correct parameters', () => {
      component.showAddToast();

      expect(addToastSpy).toHaveBeenCalledTimes(1);
      const callArgs = addToastSpy.mock.calls[0][0] as Toast;
      expect(callArgs.title).toBe('Great Toast');
      expect(callArgs.description).toBe('I am a successful message!');
      expect(callArgs.toastType).toBe('success');
      expect(callArgs.date).toBe('1hr ago');
      expect(callArgs.manualClosable).toBe(true);
      expect(callArgs.primaryButtonText).toBe('Primary Button');
      expect(callArgs.secondaryButtonText).toBe('Secondary Button');
      expect(typeof callArgs.closed).toBe('function');
      expect(typeof callArgs.primaryButtonClick).toBe('function');
      expect(typeof callArgs.secondaryButtonClick).toBe('function');
    });

    it('should not include timeoutSeconds in addToast call', () => {
      component.showAddToast();

      const callArgs = addToastSpy.mock.calls[0][0] as Toast;
      expect(callArgs.timeoutSeconds).toBeUndefined();
    });
  });

  describe('showSuccessToast', () => {
    it('should call toastService.success with correct parameters', () => {
      component.showSuccessToast();

      expect(successSpy).toHaveBeenCalledTimes(1);
      const callArgs = successSpy.mock.calls[0][0] as Toast;
      expect(callArgs.title).toBe('Great Toast');
      expect(callArgs.description).toBe('I am a successful message!');
    });
  });

  describe('showWarningToast', () => {
    it('should call toastService.warning with correct parameters', () => {
      component.showWarningToast();

      expect(warningSpy).toHaveBeenCalledTimes(1);
      const callArgs = warningSpy.mock.calls[0][0] as Toast;
      expect(callArgs.title).toBe('Warning Toast');
      expect(callArgs.description).toBe('I am a warning message!');
    });
  });

  describe('showErrorToast', () => {
    it('should call toastService.error with correct parameters', () => {
      component.showErrorToast();

      expect(errorSpy).toHaveBeenCalledTimes(1);
      const callArgs = errorSpy.mock.calls[0][0] as Toast;
      expect(callArgs.title).toBe('Error Toast');
      expect(callArgs.description).toBe('I am a Error message! I will be closed in 10s automatically.');
      expect(callArgs.date).toBe('1hr ago');
      expect(callArgs.timeoutSeconds).toBe(10);
      expect(callArgs.primaryButtonText).toBe('More Info');
      expect(typeof callArgs.primaryButtonClick).toBe('function');
    });
  });

  describe('showInfoToast', () => {
    it('should call toastService.info with correct parameters', () => {
      component.showInfoToast();

      expect(infoSpy).toHaveBeenCalledTimes(1);
      const callArgs = infoSpy.mock.calls[0][0] as Toast;
      expect(callArgs.title).toBe('Info Toast');
      expect(callArgs.description).toBe('I am the default toast type.');
    });
  });

  describe('toast callbacks', () => {
    it('should execute closed callback when showAddToast is called', () => {
      const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {
        // Mock implementation
      });

      component.showAddToast();

      const callArgs = addToastSpy.mock.calls[0][0] as Toast;
      callArgs.closed?.();

      expect(consoleSpy).toHaveBeenCalledWith('closed');
      consoleSpy.mockRestore();
    });

    it('should execute primaryButtonClick callback when showAddToast is called', () => {
      const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {
        // Mock implementation
      });

      component.showAddToast();

      const callArgs = addToastSpy.mock.calls[0][0] as Toast;
      callArgs.primaryButtonClick?.();

      expect(alertSpy).toHaveBeenCalledWith('primary button clicked');
      alertSpy.mockRestore();
    });

    it('should execute secondaryButtonClick callback when showAddToast is called', () => {
      const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {
        // Mock implementation
      });

      component.showAddToast();

      const callArgs = addToastSpy.mock.calls[0][0] as Toast;
      callArgs.secondaryButtonClick?.();

      expect(alertSpy).toHaveBeenCalledWith('secondary button clicked');
      alertSpy.mockRestore();
    });

    it('should execute primaryButtonClick callback when showErrorToast is called', () => {
      const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {
        // Mock implementation
      });

      component.showErrorToast();

      const callArgs = errorSpy.mock.calls[0][0] as Toast;
      callArgs.primaryButtonClick?.();

      expect(alertSpy).toHaveBeenCalledWith('Assume opening a new tab');
      alertSpy.mockRestore();
    });
  });
});
