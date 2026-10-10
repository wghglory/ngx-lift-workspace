import {ComponentFixture, TestBed} from '@angular/core/testing';

import {AutoSelectComponent} from './auto-select.component';

describe('AutoSelectComponent', () => {
  let component: AutoSelectComponent;
  let fixture: ComponentFixture<AutoSelectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AutoSelectComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AutoSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
