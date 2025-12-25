import {provideHttpClient} from '@angular/common/http';
import {provideHttpClientTesting} from '@angular/common/http/testing';
import {provideNoopAnimations} from '@angular/platform-browser/animations';
import {ComponentFixture, TestBed} from '@angular/core/testing';

import {SwitchMapWithAsyncStateComponent} from './switch-map-with-async-state.component';

describe('SwitchMapWithAsyncStateComponent', () => {
  let component: SwitchMapWithAsyncStateComponent;
  let fixture: ComponentFixture<SwitchMapWithAsyncStateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SwitchMapWithAsyncStateComponent],
      providers: [provideHttpClient(), provideHttpClientTesting(), provideNoopAnimations()],
    }).compileComponents();

    fixture = TestBed.createComponent(SwitchMapWithAsyncStateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
