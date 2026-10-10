import {ComponentFixture, TestBed} from '@angular/core/testing';

import {WithCleanupComponent} from './with-cleanup.component';

describe('WithCleanupComponent', () => {
  let component: WithCleanupComponent;
  let fixture: ComponentFixture<WithCleanupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WithCleanupComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(WithCleanupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
