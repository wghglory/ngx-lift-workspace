import {ComponentFixture, TestBed} from '@angular/core/testing';

import {ComputedAsyncComponent} from './computed-async.component';

describe('ComputedAsyncComponent', () => {
  let component: ComputedAsyncComponent;
  let fixture: ComponentFixture<ComputedAsyncComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ComputedAsyncComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ComputedAsyncComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
