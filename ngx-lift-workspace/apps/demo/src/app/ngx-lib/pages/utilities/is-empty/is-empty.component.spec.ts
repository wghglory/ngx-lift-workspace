import {ComponentFixture, TestBed} from '@angular/core/testing';

import {IsEmptyComponent} from './is-empty.component';

describe('IsEmptyComponent', () => {
  let component: IsEmptyComponent;
  let fixture: ComponentFixture<IsEmptyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IsEmptyComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(IsEmptyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
