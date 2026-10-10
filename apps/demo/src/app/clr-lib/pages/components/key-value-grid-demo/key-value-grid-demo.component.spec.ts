import {ComponentFixture, TestBed} from '@angular/core/testing';
import {describe, expect, it} from 'vitest';

import {KeyValueGridDemoComponent} from './key-value-grid-demo.component';

describe('KeyValueGridDemoComponent', () => {
  let component: KeyValueGridDemoComponent;
  let fixture: ComponentFixture<KeyValueGridDemoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [KeyValueGridDemoComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(KeyValueGridDemoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
