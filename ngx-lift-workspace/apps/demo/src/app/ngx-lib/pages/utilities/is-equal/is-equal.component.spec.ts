import {ComponentFixture, TestBed} from '@angular/core/testing';

import {IsEqualComponent} from './is-equal.component';

describe('IsEqualComponent', () => {
  let component: IsEqualComponent;
  let fixture: ComponentFixture<IsEqualComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IsEqualComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(IsEqualComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
