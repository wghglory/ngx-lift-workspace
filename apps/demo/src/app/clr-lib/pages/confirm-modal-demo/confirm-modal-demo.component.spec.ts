import {InteractivityChecker} from '@angular/cdk/a11y';
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {provideNoopAnimations} from '@angular/platform-browser/animations';

import {ConfirmModalDemoComponent} from './confirm-modal-demo.component';

describe('ConfirmModalDemoComponent', () => {
  let component: ConfirmModalDemoComponent;
  let fixture: ComponentFixture<ConfirmModalDemoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConfirmModalDemoComponent],
      providers: [provideNoopAnimations()],
    })
      .overrideProvider(InteractivityChecker, {
        useValue: {
          isFocusable: () => true,
        },
      })
      .compileComponents();

    fixture = TestBed.createComponent(ConfirmModalDemoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should open modals when trigger methods are called', () => {
    component.openDeleteModal();
    expect(component.isDeleteModalOpen()).toBe(true);

    component.openPrimaryModal();
    expect(component.isPrimaryModalOpen()).toBe(true);

    component.openErrorModal();
    expect(component.isErrorModalOpen()).toBe(true);
  });

  it('should update status on delete completion', () => {
    component.onDeleteCompleted({deleted: true});
    expect(component.lastActionMessage()).toContain('Delete successful');
  });

  it('should update status on promote completion', () => {
    component.onPromoteCompleted({promoted: true});
    expect(component.lastActionMessage()).toContain('Promotion successful');
  });
});
