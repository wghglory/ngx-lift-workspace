import {ComponentFixture, TestBed} from '@angular/core/testing';
import {describe, expect, it} from 'vitest';

import {ObjectPathComponent} from './object-path.component';

describe('ObjectPathComponent', () => {
  let component: ObjectPathComponent;
  let fixture: ComponentFixture<ObjectPathComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ObjectPathComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ObjectPathComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
