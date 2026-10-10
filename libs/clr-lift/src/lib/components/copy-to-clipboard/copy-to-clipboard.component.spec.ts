import {Clipboard} from '@angular/cdk/clipboard';
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {provideNoopAnimations} from '@angular/platform-browser/animations';
import {ClrLoadingState} from '@clr/angular';
import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest';

import {TranslationService} from '../../services/translation.service';
import {CopyToClipboardComponent} from './copy-to-clipboard.component';

describe('CopyToClipboardComponent', () => {
  let component: CopyToClipboardComponent;
  let fixture: ComponentFixture<CopyToClipboardComponent>;
  let mockClipboard: {copy: ReturnType<typeof vi.fn>};

  beforeEach(async () => {
    mockClipboard = {
      copy: vi.fn().mockReturnValue(true),
    };

    await TestBed.configureTestingModule({
      imports: [CopyToClipboardComponent],
      providers: [provideNoopAnimations(), {provide: Clipboard, useValue: mockClipboard}, TranslationService],
    }).compileComponents();

    fixture = TestBed.createComponent(CopyToClipboardComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('value', 'initial-test');
    fixture.detectChanges();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display copy icon with shape copy-to-clipboard by default', () => {
    const icon = fixture.nativeElement.querySelector('clr-icon');
    expect(icon).toBeTruthy();
    expect(icon.getAttribute('shape')).toBe('copy-to-clipboard');
    expect(icon.getAttribute('status')).toBe('info');
  });

  it('should display info icon when disabled', () => {
    fixture.componentRef.setInput('disabled', true);
    fixture.detectChanges();

    const icon = fixture.nativeElement.querySelector('clr-icon');
    expect(icon.getAttribute('shape')).toBe('info-standard');
  });

  it('should copy string value to clipboard and emit copied', () => {
    const emitSpy = vi.fn();
    component.copied.subscribe(emitSpy);

    fixture.componentRef.setInput('value', 'postgres://localhost:5432/db');
    fixture.detectChanges();

    const button = fixture.nativeElement.querySelector('button');
    button.click();

    expect(mockClipboard.copy).toHaveBeenCalledWith('postgres://localhost:5432/db');
    expect(emitSpy).toHaveBeenCalledWith('postgres://localhost:5432/db');
    expect(component.copyBtnState()).toBe(ClrLoadingState.SUCCESS);
  });

  it('should copy numeric values converted to string', () => {
    const emitSpy = vi.fn();
    component.copied.subscribe(emitSpy);

    fixture.componentRef.setInput('value', 8080);
    fixture.detectChanges();

    const button = fixture.nativeElement.querySelector('button');
    button.click();

    expect(mockClipboard.copy).toHaveBeenCalledWith('8080');
    expect(emitSpy).toHaveBeenCalledWith('8080');
  });

  it('should not copy when disabled', () => {
    const emitSpy = vi.fn();
    component.copied.subscribe(emitSpy);

    fixture.componentRef.setInput('disabled', true);
    fixture.detectChanges();

    const button = fixture.nativeElement.querySelector('button');
    button.click();

    expect(mockClipboard.copy).not.toHaveBeenCalled();
    expect(emitSpy).not.toHaveBeenCalled();
  });

  it('should reset copyBtnState to DEFAULT after timeout', () => {
    vi.useFakeTimers();
    fixture.componentRef.setInput('value', 'sample');
    fixture.detectChanges();

    component.copy();
    expect(component.copyBtnState()).toBe(ClrLoadingState.SUCCESS);

    vi.advanceTimersByTime(2100);
    expect(component.copyBtnState()).toBe(ClrLoadingState.DEFAULT);
  });

  it('should display text label when provided', () => {
    fixture.componentRef.setInput('text', 'Copy Key');
    fixture.detectChanges();

    const span = fixture.nativeElement.querySelector('button > span');
    expect(span.textContent.trim()).toBe('Copy Key');
  });

  it('should use custom tooltip when provided', () => {
    fixture.componentRef.setInput('tooltip', 'Custom copy hint');
    fixture.detectChanges();

    expect(component.effectiveTooltip()).toBe('Custom copy hint');
  });
});
