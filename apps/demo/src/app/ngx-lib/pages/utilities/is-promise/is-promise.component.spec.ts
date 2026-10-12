import {ComponentFixture, TestBed} from '@angular/core/testing';

import {IsPromiseComponent} from './is-promise.component';

describe('IsPromiseComponent', () => {
  let component: IsPromiseComponent;
  let fixture: ComponentFixture<IsPromiseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IsPromiseComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(IsPromiseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should correctly evaluate promise and non-promise values', () => {
    expect(component.testIsPromise(Promise.resolve(1))).toBe(true);
    expect(component.testIsPromise({then: () => undefined})).toBe(true);
    expect(component.testIsPromise(null)).toBe(false);
    expect(component.testIsPromise('string')).toBe(false);
    expect(component.testIsPromise(123)).toBe(false);
    expect(component.testIsPromise({})).toBe(false);
  });
});
