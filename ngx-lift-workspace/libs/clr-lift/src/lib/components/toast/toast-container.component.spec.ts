import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { of } from 'rxjs';
import { vi } from 'vitest';

import { ToastService } from './toast.service';
import { CreatedToast } from './toast.type';
import { ToastContainerComponent } from './toast-container.component';

describe('ToastContainerComponent', () => {
  let component: ToastContainerComponent;
  let fixture: ComponentFixture<ToastContainerComponent>;
  let toastService: ToastService;
  let deleteToastSpy: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    deleteToastSpy = vi.fn();
    const spy = {
      deleteToast: deleteToastSpy,
    };

    TestBed.configureTestingModule({
      imports: [ToastContainerComponent, NoopAnimationsModule],
      providers: [{ provide: ToastService, useValue: spy }],
    });

    fixture = TestBed.createComponent(ToastContainerComponent);
    component = fixture.componentInstance;
    toastService = TestBed.inject(ToastService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set top offset in the style', () => {
    fixture.componentRef.setInput('topOffset', 10);
    fixture.detectChanges();

    const element =
      fixture.debugElement.nativeElement.querySelector('.toast-container');
    const elementHost = element.parentNode;
    expect(elementHost.style.top).toBe('70px'); // 60px (default) + 10px
  });

  it('should delete toast when closed', () => {
    const toast: CreatedToast = {
      title: 'Test Title',
      description: 'Test Description',
      toastType: 'info',
      id: Symbol(),
    };

    component.toasts$ = of([toast]);

    fixture.detectChanges();

    const deleteSpy = vi.spyOn(component, 'deleteToast');

    const toastComponent = fixture.debugElement.query(By.css('cll-toast'));
    toastComponent.triggerEventHandler('closed', null);

    expect(deleteSpy).toHaveBeenCalledWith(toast.id);
  });

  it('should call deleteToast on toast service when deleteToast is called', () => {
    const toastId = Symbol();

    component.deleteToast(toastId);

    expect(deleteToastSpy).toHaveBeenCalledWith(toastId);
  });
});
