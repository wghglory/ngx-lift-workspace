import {ComponentFixture, TestBed} from '@angular/core/testing';

import {CombineLatestEagerComponent} from './combine-latest-eager.component';

describe('CombineLatestEagerComponent', () => {
  let component: CombineLatestEagerComponent;
  let fixture: ComponentFixture<CombineLatestEagerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CombineLatestEagerComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CombineLatestEagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
