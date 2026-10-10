import {Component, ElementRef, ViewChild} from '@angular/core';
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {FormGroup, ReactiveFormsModule} from '@angular/forms';
import {provideNoopAnimations} from '@angular/platform-browser/animations';
import {ClarityModule, ClrStepper, ClrStepperPanel} from '@clr/angular';
import {Subject} from 'rxjs';
import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest';

import {ScrollToStepTopDirective} from './scroll-to-step-top.directive';

async function flushEffects(ms = 0): Promise<void> {
  if (ms > 0) {
    vi.advanceTimersByTime(ms);
  }
  await Promise.resolve();
}

@Component({
  template: `
    <form clrStepper cllScrollToStepTop [formGroup]="form">
      <clr-stepper-panel #panel1 formGroupName="step1">
        <clr-step-title>Step 1</clr-step-title>
        <clr-step-content *clrIfExpanded>
          Content 1
          <button clrStepButton="next">Next</button>
        </clr-step-content>
      </clr-stepper-panel>

      <clr-stepper-panel #panel2 formGroupName="step2">
        <clr-step-title>Step 2</clr-step-title>
        <clr-step-content *clrIfExpanded>
          Content 2
          <button clrStepButton="next">Next</button>
        </clr-step-content>
      </clr-stepper-panel>
    </form>
  `,
  imports: [ClarityModule, ReactiveFormsModule, ScrollToStepTopDirective],
})
class TestComponent {
  form = new FormGroup({
    step1: new FormGroup({}),
    step2: new FormGroup({}),
  });

  @ViewChild(ClrStepper) stepper!: ClrStepper;
  @ViewChild('panel1') panel1!: ClrStepperPanel;
  @ViewChild('panel2') panel2!: ClrStepperPanel;
}

describe('ScrollToStepTopDirective', () => {
  let fixture: ComponentFixture<TestComponent>;
  let component: TestComponent;

  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestComponent],
      providers: [provideNoopAnimations()],
    }).compileComponents();

    fixture = TestBed.createComponent(TestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create an instance', () => {
    expect(component).toBeTruthy();
  });

  it('should scroll to the top of the panel when it becomes active', async () => {
    const mockHeaderBtn = document.createElement('button');
    const mockPanelElement = document.createElement('clr-stepper-panel');
    mockPanelElement.appendChild(mockHeaderBtn);

    const mockScrollContainer = document.createElement('div');
    mockScrollContainer.className = 'content-area';
    mockScrollContainer.appendChild(mockPanelElement);

    vi.spyOn(mockPanelElement, 'getBoundingClientRect').mockReturnValue({
      top: 500,
      bottom: 600,
      left: 0,
      right: 100,
      width: 100,
      height: 100,
      x: 0,
      y: 500,
      toJSON: () => ({}),
    });

    vi.spyOn(mockScrollContainer, 'getBoundingClientRect').mockReturnValue({
      top: 100,
      bottom: 900,
      left: 0,
      right: 100,
      width: 100,
      height: 800,
      x: 0,
      y: 100,
      toJSON: () => ({}),
    });

    Object.defineProperty(mockScrollContainer, 'scrollTop', {
      get: () => 200,
    });

    mockScrollContainer.scrollTo = vi.fn();
    const scrollToSpy = vi.spyOn(mockScrollContainer, 'scrollTo');
    const focusSpy = vi.spyOn(mockHeaderBtn, 'focus').mockImplementation(() => undefined);

    Object.defineProperty(component.panel2, 'headerButton', {
      get: () => new ElementRef(mockHeaderBtn),
    });

    const stepperWithService = component.stepper as unknown as {
      stepperService: {_activeStepChanges: Subject<string>};
    };

    stepperWithService.stepperService._activeStepChanges.next(component.panel2.id);

    await flushEffects(300);
    await flushEffects(100);

    // Expected scrollTop: 200 + (500 - 100) - 120 = 480
    expect(scrollToSpy).toHaveBeenCalledWith({top: 480, behavior: 'smooth'});
    expect(focusSpy).toHaveBeenCalledWith({preventScroll: true});
  });

  it('should not scroll if the active step ID does not match any panel', async () => {
    const mockHeaderBtn = document.createElement('button');
    const mockPanelElement = document.createElement('clr-stepper-panel');
    mockPanelElement.appendChild(mockHeaderBtn);

    const mockScrollContainer = document.createElement('div');
    mockScrollContainer.className = 'content-area';
    mockScrollContainer.appendChild(mockPanelElement);

    mockScrollContainer.scrollTo = vi.fn();
    const scrollToSpy = vi.spyOn(mockScrollContainer, 'scrollTo');

    Object.defineProperty(component.panel2, 'headerButton', {
      get: () => new ElementRef(mockHeaderBtn),
    });

    const stepperWithService = component.stepper as unknown as {
      stepperService: {_activeStepChanges: Subject<string>};
    };
    stepperWithService.stepperService._activeStepChanges.next('unknown-step-id');

    await flushEffects(300);
    await flushEffects(100);

    expect(scrollToSpy).not.toHaveBeenCalled();
  });

  it('should scroll to the first error when Next button is clicked and form is invalid', async () => {
    const mockNextBtn = document.createElement('button');
    mockNextBtn.className = 'clr-step-button';

    const mockInput = document.createElement('input');
    const mockContainer = document.createElement('div');
    mockContainer.className = 'clr-control-container';
    mockContainer.appendChild(mockInput);

    const mockErrorElement = document.createElement('clr-control-error');
    mockContainer.appendChild(mockErrorElement);

    const mockHeaderBtn = document.createElement('button');
    const mockPanelElement = document.createElement('clr-stepper-panel');
    mockPanelElement.appendChild(mockHeaderBtn);
    mockPanelElement.appendChild(mockContainer);
    mockPanelElement.appendChild(mockNextBtn);

    const mockScrollContainer = document.createElement('div');
    mockScrollContainer.className = 'content-area';
    mockScrollContainer.appendChild(mockPanelElement);

    vi.spyOn(mockErrorElement, 'getBoundingClientRect').mockReturnValue({
      top: 1000,
      bottom: 1050,
      left: 0,
      right: 100,
      width: 100,
      height: 50,
      x: 0,
      y: 1000,
      toJSON: () => ({}),
    });
    vi.spyOn(mockScrollContainer, 'getBoundingClientRect').mockReturnValue({
      top: 100,
      bottom: 900,
      left: 0,
      right: 100,
      width: 100,
      height: 800,
      x: 0,
      y: 100,
      toJSON: () => ({}),
    });

    Object.defineProperty(mockScrollContainer, 'scrollTop', {get: () => 200});

    mockScrollContainer.scrollTo = vi.fn();
    const scrollToSpy = vi.spyOn(mockScrollContainer, 'scrollTo');
    const inputFocusSpy = vi.spyOn(mockInput, 'focus').mockImplementation(() => undefined);

    Object.defineProperty(component.panel1, 'headerButton', {get: () => new ElementRef(mockHeaderBtn)});
    Object.defineProperty(component.panel1, 'formGroup', {get: () => ({invalid: true})});

    const stepperWithService = component.stepper as unknown as {
      stepperService: {_activeStepChanges: Subject<string>};
    };
    stepperWithService.stepperService._activeStepChanges.next(component.panel1.id);

    const clickEvent = new Event('click', {bubbles: true});
    Object.defineProperty(clickEvent, 'target', {value: mockNextBtn});

    const directiveEl = fixture.debugElement.query((de) => de.injector.get(ScrollToStepTopDirective, null) !== null);
    const directive = directiveEl.injector.get(ScrollToStepTopDirective);

    directive.onClick(clickEvent);

    fixture.detectChanges();
    await flushEffects(200);

    expect(scrollToSpy).toHaveBeenCalledWith({top: 980, behavior: 'smooth'});
    expect(inputFocusSpy).toHaveBeenCalledWith({preventScroll: true});
  });

  it('should not scroll to the first error when Next button is clicked if it is already visible', async () => {
    const mockNextBtn = document.createElement('button');
    mockNextBtn.className = 'clr-step-button';

    const mockInput = document.createElement('input');
    const mockContainer = document.createElement('div');
    mockContainer.className = 'clr-control-container';
    mockContainer.appendChild(mockInput);

    const mockErrorElement = document.createElement('clr-control-error');
    mockContainer.appendChild(mockErrorElement);

    const mockHeaderBtn = document.createElement('button');
    const mockPanelElement = document.createElement('clr-stepper-panel');
    mockPanelElement.appendChild(mockHeaderBtn);
    mockPanelElement.appendChild(mockContainer);
    mockPanelElement.appendChild(mockNextBtn);

    const mockScrollContainer = document.createElement('div');
    mockScrollContainer.className = 'content-area';
    mockScrollContainer.appendChild(mockPanelElement);

    vi.spyOn(mockErrorElement, 'getBoundingClientRect').mockReturnValue({
      top: 300,
      bottom: 350,
      left: 0,
      right: 100,
      width: 100,
      height: 50,
      x: 0,
      y: 300,
      toJSON: () => ({}),
    });
    vi.spyOn(mockScrollContainer, 'getBoundingClientRect').mockReturnValue({
      top: 100,
      bottom: 900,
      left: 0,
      right: 100,
      width: 100,
      height: 800,
      x: 0,
      y: 100,
      toJSON: () => ({}),
    });

    Object.defineProperty(mockScrollContainer, 'scrollTop', {get: () => 200});

    mockScrollContainer.scrollTo = vi.fn();
    const scrollToSpy = vi.spyOn(mockScrollContainer, 'scrollTo');
    const inputFocusSpy = vi.spyOn(mockInput, 'focus').mockImplementation(() => undefined);

    Object.defineProperty(component.panel1, 'headerButton', {get: () => new ElementRef(mockHeaderBtn)});
    Object.defineProperty(component.panel1, 'formGroup', {get: () => ({invalid: true})});

    const stepperWithService = component.stepper as unknown as {
      stepperService: {_activeStepChanges: Subject<string>};
    };
    stepperWithService.stepperService._activeStepChanges.next(component.panel1.id);

    const clickEvent = new Event('click', {bubbles: true});
    Object.defineProperty(clickEvent, 'target', {value: mockNextBtn});

    const directiveEl = fixture.debugElement.query((de) => de.injector.get(ScrollToStepTopDirective, null) !== null);
    const directive = directiveEl.injector.get(ScrollToStepTopDirective);

    directive.onClick(clickEvent);

    fixture.detectChanges();
    await flushEffects(100);

    expect(scrollToSpy).not.toHaveBeenCalled();
    expect(inputFocusSpy).toHaveBeenCalledWith({preventScroll: true});
  });

  it('should ignore clicks on Next buttons when the form is valid', async () => {
    const mockNextBtn = document.createElement('button');
    mockNextBtn.className = 'clr-step-button';

    const mockHeaderBtn = document.createElement('button');
    const mockPanelElement = document.createElement('clr-stepper-panel');
    mockPanelElement.appendChild(mockHeaderBtn);
    mockPanelElement.appendChild(mockNextBtn);

    const mockScrollContainer = document.createElement('div');
    mockScrollContainer.className = 'content-area';
    mockScrollContainer.appendChild(mockPanelElement);

    mockScrollContainer.scrollTo = vi.fn();
    const scrollToSpy = vi.spyOn(mockScrollContainer, 'scrollTo');

    Object.defineProperty(component.panel1, 'headerButton', {get: () => new ElementRef(mockHeaderBtn)});
    Object.defineProperty(component.panel1, 'formGroup', {get: () => ({invalid: false})});

    const stepperWithService = component.stepper as unknown as {
      stepperService: {_activeStepChanges: Subject<string>};
    };
    stepperWithService.stepperService._activeStepChanges.next(component.panel1.id);

    const clickEvent = new Event('click', {bubbles: true});
    Object.defineProperty(clickEvent, 'target', {value: mockNextBtn});

    const directiveEl = fixture.debugElement.query((de) => de.injector.get(ScrollToStepTopDirective, null) !== null);
    const directive = directiveEl.injector.get(ScrollToStepTopDirective);

    directive.onClick(clickEvent);

    fixture.detectChanges();
    await flushEffects(100);

    expect(scrollToSpy).not.toHaveBeenCalled();
  });
});
