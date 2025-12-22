import {ComponentFixture, TestBed} from '@angular/core/testing';

import {CombineFromComponent} from './combine-from.component';

describe('CombineFromComponent', () => {
  let component: CombineFromComponent;
  let fixture: ComponentFixture<CombineFromComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CombineFromComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CombineFromComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
