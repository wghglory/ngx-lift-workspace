import {ComponentFixture, TestBed} from '@angular/core/testing';

import {ForkJoinWithRollbackComponent} from './fork-join-with-rollback.component';

describe('ForkJoinWithRollbackComponent', () => {
  let component: ForkJoinWithRollbackComponent;
  let fixture: ComponentFixture<ForkJoinWithRollbackComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ForkJoinWithRollbackComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ForkJoinWithRollbackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
