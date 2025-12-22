import {ComponentFixture, TestBed} from '@angular/core/testing';

import {DgStateComponent} from './dg-state.component';

describe('DgStateComponent', () => {
  let component: DgStateComponent;
  let fixture: ComponentFixture<DgStateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DgStateComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DgStateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
