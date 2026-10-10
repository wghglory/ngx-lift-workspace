import {ComponentFixture, TestBed} from '@angular/core/testing';
import {Router} from '@angular/router';
import {beforeEach, describe, expect, it, vi} from 'vitest';

import {InfoButtonComponent} from './info-button.component';

describe('InfoButtonComponent', () => {
  let component: InfoButtonComponent;
  let fixture: ComponentFixture<InfoButtonComponent>;
  let mockRouter: {navigate: ReturnType<typeof vi.fn>};

  beforeEach(async () => {
    mockRouter = {
      navigate: vi.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [InfoButtonComponent],
      providers: [{provide: Router, useValue: mockRouter}],
    }).compileComponents();

    fixture = TestBed.createComponent(InfoButtonComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('text', 'Test Action');
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display the provided button text', () => {
    const span = fixture.nativeElement.querySelector('span');
    expect(span.textContent.trim()).toBe('Test Action');
  });

  it('should emit clicked event when button is clicked without a link', () => {
    const emitSpy = vi.fn();
    component.clicked.subscribe(emitSpy);

    const button = fixture.nativeElement.querySelector('button');
    button.click();

    expect(emitSpy).toHaveBeenCalled();
    expect(mockRouter.navigate).not.toHaveBeenCalled();
  });

  it('should navigate via Router when link is provided', () => {
    fixture.componentRef.setInput('link', '/clusters/detail');
    fixture.componentRef.setInput('queryParams', {tab: 'metrics'});
    fixture.componentRef.setInput('state', {fromDashboard: true});
    fixture.detectChanges();

    const button = fixture.nativeElement.querySelector('button');
    button.click();

    expect(mockRouter.navigate).toHaveBeenCalledWith(['/clusters/detail'], {
      queryParams: {tab: 'metrics'},
      state: {fromDashboard: true},
    });
  });

  it('should support array link segments', () => {
    fixture.componentRef.setInput('link', ['/clusters', '123', 'nodes']);
    fixture.detectChanges();

    const button = fixture.nativeElement.querySelector('button');
    button.click();

    expect(mockRouter.navigate).toHaveBeenCalledWith(['/clusters', '123', 'nodes'], {
      queryParams: undefined,
      state: undefined,
    });
  });

  it('should not emit clicked or navigate when disabled', () => {
    const emitSpy = vi.fn();
    component.clicked.subscribe(emitSpy);

    fixture.componentRef.setInput('disabled', true);
    fixture.componentRef.setInput('link', '/some-path');
    fixture.detectChanges();

    const button = fixture.nativeElement.querySelector('button');
    button.click();

    expect(emitSpy).not.toHaveBeenCalled();
    expect(mockRouter.navigate).not.toHaveBeenCalled();
  });

  it('should show info-circle icon only when disabled and tooltipText is provided', () => {
    // Neither disabled nor tooltip
    expect(fixture.nativeElement.querySelector('clr-icon')).toBeFalsy();

    // Disabled without tooltip
    fixture.componentRef.setInput('disabled', true);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('clr-icon')).toBeFalsy();

    // Disabled with tooltip
    fixture.componentRef.setInput('tooltipText', 'Permission required');
    fixture.detectChanges();
    const icon = fixture.nativeElement.querySelector('clr-icon');
    expect(icon).toBeTruthy();
    expect(icon.getAttribute('shape')).toBe('info-circle');

    // Re-enabled
    fixture.componentRef.setInput('disabled', false);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('clr-icon')).toBeFalsy();
  });

  it('should apply custom class name to button', () => {
    fixture.componentRef.setInput('className', 'compact custom-style');
    fixture.detectChanges();

    const button = fixture.nativeElement.querySelector('button');
    expect(button.classList.contains('compact')).toBe(true);
    expect(button.classList.contains('custom-style')).toBe(true);
  });
});
