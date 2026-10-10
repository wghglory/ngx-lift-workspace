import {ComponentFixture, TestBed} from '@angular/core/testing';
import {describe, expect, it} from 'vitest';

import {StringArrayInputDemoComponent} from './string-array-input-demo.component';

describe('StringArrayInputDemoComponent', () => {
  let component: StringArrayInputDemoComponent;
  let fixture: ComponentFixture<StringArrayInputDemoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StringArrayInputDemoComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(StringArrayInputDemoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form controls', () => {
    expect(component.demoForm.get('tags')?.value).toEqual(['angular', 'signals', 'clarity']);
  });
});
