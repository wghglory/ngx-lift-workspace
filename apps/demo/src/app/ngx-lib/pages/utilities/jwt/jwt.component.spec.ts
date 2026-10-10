import {ComponentFixture, TestBed} from '@angular/core/testing';
import {describe, expect, it} from 'vitest';

import {JwtDemoComponent} from './jwt.component';

describe('JwtDemoComponent', () => {
  let component: JwtDemoComponent;
  let fixture: ComponentFixture<JwtDemoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JwtDemoComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(JwtDemoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
