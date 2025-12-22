import {Component, DebugElement} from '@angular/core';
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {By} from '@angular/platform-browser';

import {CalloutComponent} from './callout.component';

describe('CalloutComponent', () => {
  let component: CalloutComponent;
  let fixture: ComponentFixture<CalloutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CalloutComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CalloutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

@Component({
  template: `
    <cll-callout>
      <div id="content">Test Content</div>
    </cll-callout>
  `,
  standalone: true,
  imports: [CalloutComponent],
})
class TestHostComponent {}

describe('TestCalloutHostComponent', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let calloutComponent: DebugElement;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TestHostComponent],
    });

    fixture = TestBed.createComponent(TestHostComponent);
    calloutComponent = fixture.debugElement.query(By.directive(CalloutComponent));

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(calloutComponent).toBeTruthy();
  });

  it('should project content into the component', () => {
    const contentElement = calloutComponent.query(By.css('#content'));
    expect(contentElement.nativeElement.textContent).toContain('Test Content');
  });
});
