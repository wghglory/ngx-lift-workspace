import {ComponentFixture, TestBed} from '@angular/core/testing';

import {AlertComponent} from './alert.component';

describe('AlertComponent', () => {
  let component: AlertComponent;
  let fixture: ComponentFixture<AlertComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AlertComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AlertComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('shows the error message instead of content when both are supplied', () => {
    fixture.componentRef.setInput('error', new Error('API failed'));
    fixture.componentRef.setInput('content', 'Fallback content');
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('API failed');
    expect(fixture.nativeElement.textContent).not.toContain('Fallback content');
  });

  it('renders a close button by default (closable defaults to true)', () => {
    fixture.componentRef.setInput('content', 'Dismissible message');
    fixture.detectChanges();

    const closeButton = fixture.nativeElement.querySelector('button.close');
    expect(closeButton).toBeTruthy();
  });

  it('localizes the close button accessible name with the alert.close dictionary', () => {
    fixture.componentRef.setInput('content', 'Dismissible message');
    fixture.detectChanges();

    const closeButton = fixture.nativeElement.querySelector('button.close');
    expect(closeButton.getAttribute('aria-label')).toBe('Close');
  });

  it('hides the close button when closable is false', () => {
    fixture.componentRef.setInput('content', 'Persistent message');
    fixture.componentRef.setInput('closable', false);
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('button.close')).toBeNull();
  });

  it('removes the alert and emits closedChange(true) when the close button is clicked', () => {
    fixture.componentRef.setInput('content', 'Dismissible message');
    fixture.detectChanges();

    const closedChanges: boolean[] = [];
    const sub = component.closedChange.subscribe((value) => closedChanges.push(value));

    fixture.nativeElement.querySelector('button.close').click();
    fixture.detectChanges();

    expect(component.closed()).toBe(true);
    expect(closedChanges).toEqual([true]);
    expect(fixture.nativeElement.querySelector('button.close')).toBeNull();
    sub.unsubscribe();
  });

  it('reopens the alert when the controlled closed input is set back to false', () => {
    fixture.componentRef.setInput('content', 'Dismissible message');
    fixture.detectChanges();

    fixture.nativeElement.querySelector('button.close').click();
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('button.close')).toBeNull();

    fixture.componentRef.setInput('closed', false);
    fixture.detectChanges();

    expect(component.closed()).toBe(false);
    expect(fixture.nativeElement.querySelector('button.close')).toBeTruthy();
  });

  it('focuses the close button for keyboard dismissal', () => {
    fixture.componentRef.setInput('content', 'Dismissible message');
    fixture.detectChanges();

    const closeButton = fixture.nativeElement.querySelector('button.close') as HTMLButtonElement;
    closeButton.focus();
    expect(document.activeElement).toBe(closeButton);
  });
});
