import {Clipboard} from '@angular/cdk/clipboard';
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {provideNoopAnimations} from '@angular/platform-browser/animations';
import {beforeEach, describe, expect, it, vi} from 'vitest';

import {TranslationService} from '../../services/translation.service';
import {MaskedValueFieldComponent} from './masked-value-field.component';

describe('MaskedValueFieldComponent', () => {
  let component: MaskedValueFieldComponent;
  let fixture: ComponentFixture<MaskedValueFieldComponent>;
  let mockClipboard: {copy: ReturnType<typeof vi.fn>};

  beforeEach(async () => {
    mockClipboard = {
      copy: vi.fn().mockReturnValue(true),
    };

    await TestBed.configureTestingModule({
      imports: [MaskedValueFieldComponent],
      providers: [provideNoopAnimations(), {provide: Clipboard, useValue: mockClipboard}, TranslationService],
    }).compileComponents();

    fixture = TestBed.createComponent(MaskedValueFieldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render empty placeholder when value is null or empty', () => {
    fixture.componentRef.setInput('value', null);
    fixture.detectChanges();

    const empty = fixture.nativeElement.querySelector('.empty-placeholder');
    expect(empty).toBeTruthy();
    expect(empty.textContent.trim()).toBe('-');
  });

  it('should render custom empty placeholder', () => {
    fixture.componentRef.setInput('value', '');
    fixture.componentRef.setInput('emptyPlaceholder', 'N/A');
    fixture.detectChanges();

    const empty = fixture.nativeElement.querySelector('.empty-placeholder');
    expect(empty.textContent.trim()).toBe('N/A');
  });

  it('should render masked dots by default when value is present', () => {
    fixture.componentRef.setInput('value', 'SuperSecretPass123!');
    fixture.detectChanges();

    const textSpan = fixture.nativeElement.querySelector('.value-text');
    expect(textSpan.textContent.trim()).toBe('●●●●●●●●●●');

    const icon = fixture.nativeElement.querySelector('.toggle-btn clr-icon');
    expect(icon.getAttribute('shape')).toBe('eye');
  });

  it('should reveal value when toggle button is clicked', () => {
    fixture.componentRef.setInput('value', 'SuperSecretPass123!');
    fixture.detectChanges();

    const button = fixture.nativeElement.querySelector('.toggle-btn');
    button.click();
    fixture.detectChanges();

    const textSpan = fixture.nativeElement.querySelector('.value-text');
    expect(textSpan.textContent.trim()).toBe('SuperSecretPass123!');

    const icon = fixture.nativeElement.querySelector('.toggle-btn clr-icon');
    expect(icon.getAttribute('shape')).toBe('eye-hide');

    // Click again to hide
    button.click();
    fixture.detectChanges();
    expect(textSpan.textContent.trim()).toBe('●●●●●●●●●●');
    expect(icon.getAttribute('shape')).toBe('eye');
  });

  it('should support custom mask placeholder', () => {
    fixture.componentRef.setInput('value', 'secret');
    fixture.componentRef.setInput('placeholder', '********');
    fixture.detectChanges();

    const textSpan = fixture.nativeElement.querySelector('.value-text');
    expect(textSpan.textContent.trim()).toBe('********');
  });

  it('should render copy-to-clipboard component when copyable is true', () => {
    fixture.componentRef.setInput('value', 'token-abc-123');
    fixture.componentRef.setInput('copyable', true);
    fixture.detectChanges();

    const copyBtn = fixture.nativeElement.querySelector('cll-copy-to-clipboard');
    expect(copyBtn).toBeTruthy();
  });

  it('should not render copy-to-clipboard by default', () => {
    fixture.componentRef.setInput('value', 'token-abc-123');
    fixture.detectChanges();

    const copyBtn = fixture.nativeElement.querySelector('cll-copy-to-clipboard');
    expect(copyBtn).toBeFalsy();
  });
});
