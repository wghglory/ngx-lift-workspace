import {ComponentFixture, TestBed} from '@angular/core/testing';
import {describe, expect, it} from 'vitest';

import {FlattenObjectComponent} from './flatten-object.component';

describe('FlattenObjectComponent', () => {
  let component: FlattenObjectComponent;
  let fixture: ComponentFixture<FlattenObjectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FlattenObjectComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FlattenObjectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
