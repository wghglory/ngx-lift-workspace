import {ComponentFixture, TestBed} from '@angular/core/testing';

import {SwitchMapWithAsyncStateComponent} from './switch-map-with-async-state.component';

describe('SwitchMapWithAsyncStateComponent', () => {
  let component: SwitchMapWithAsyncStateComponent;
  let fixture: ComponentFixture<SwitchMapWithAsyncStateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SwitchMapWithAsyncStateComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SwitchMapWithAsyncStateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
