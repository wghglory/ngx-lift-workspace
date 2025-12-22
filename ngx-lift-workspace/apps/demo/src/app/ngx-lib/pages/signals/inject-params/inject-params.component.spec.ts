import {ComponentFixture, TestBed} from '@angular/core/testing';

import {InjectParamsComponent} from './inject-params.component';

describe('InjectParamsComponent', () => {
  let component: InjectParamsComponent;
  let fixture: ComponentFixture<InjectParamsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InjectParamsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(InjectParamsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
