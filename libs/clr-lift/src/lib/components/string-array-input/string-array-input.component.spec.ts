import {Component, signal} from '@angular/core';
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {beforeEach, describe, expect, it} from 'vitest';

import {TranslationService} from '../../services/translation.service';
import {StringArrayInputComponent} from './string-array-input.component';

@Component({
  imports: [ReactiveFormsModule, StringArrayInputComponent],
  template: `
    <form [formGroup]="form">
      <cll-string-array-input formControlName="tags" label="Tags" [delimiter]="delimiter()" [unique]="unique()" />
    </form>
  `,
})
class TestHostComponent {
  readonly delimiter = signal(',');
  readonly unique = signal(false);
  readonly form = new FormGroup({
    tags: new FormControl<string[]>(['angular', 'typescript'], Validators.required),
  });
}

describe('StringArrayInputComponent', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let hostComponent: TestHostComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, TestHostComponent],
      providers: [TranslationService],
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    hostComponent = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should initialize and serialize parent form value to input text', () => {
    const input = fixture.nativeElement.querySelector('input');
    expect(input.value).toBe('angular, typescript');
  });

  it('should parse user input into array on input event', () => {
    const input = fixture.nativeElement.querySelector('input');
    input.value = 'docker, kubernetes, helm';
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    expect(hostComponent.form.get('tags')?.value).toEqual(['docker', 'kubernetes', 'helm']);
  });

  it('should filter out empty strings and trim whitespace', () => {
    const input = fixture.nativeElement.querySelector('input');
    input.value = '  react ,  , vue ,   ';
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    expect(hostComponent.form.get('tags')?.value).toEqual(['react', 'vue']);
  });

  it('should return empty array when cleared', () => {
    const input = fixture.nativeElement.querySelector('input');
    input.value = '';
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    expect(hostComponent.form.get('tags')?.value).toEqual([]);
  });

  it('should support unique values when unique is true', () => {
    hostComponent.unique.set(true);
    fixture.detectChanges();

    const input = fixture.nativeElement.querySelector('input');
    input.value = 'apple, banana, apple, orange, banana';
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    expect(hostComponent.form.get('tags')?.value).toEqual(['apple', 'banana', 'orange']);
  });

  it('should disable internal input when form control is disabled', () => {
    hostComponent.form.get('tags')?.disable();
    fixture.detectChanges();

    const input = fixture.nativeElement.querySelector('input');
    expect(input.disabled).toBe(true);

    hostComponent.form.get('tags')?.enable();
    fixture.detectChanges();
    expect(input.disabled).toBe(false);
  });
});
