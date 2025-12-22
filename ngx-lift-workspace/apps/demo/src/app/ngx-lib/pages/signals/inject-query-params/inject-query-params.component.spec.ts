import {ComponentFixture, TestBed} from '@angular/core/testing';

import {InjectQueryParamsComponent} from './inject-query-params.component';

describe('InjectQueryParamsComponent', () => {
  let component: InjectQueryParamsComponent;
  let fixture: ComponentFixture<InjectQueryParamsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InjectQueryParamsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(InjectQueryParamsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
