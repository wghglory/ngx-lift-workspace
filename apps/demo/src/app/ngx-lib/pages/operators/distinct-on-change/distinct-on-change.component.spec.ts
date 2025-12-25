import {ComponentFixture, TestBed} from '@angular/core/testing';

import {DistinctOnChangeComponent} from './distinct-on-change.component';

describe('DistinctOnChangeComponent', () => {
  let component: DistinctOnChangeComponent;
  let fixture: ComponentFixture<DistinctOnChangeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DistinctOnChangeComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DistinctOnChangeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
