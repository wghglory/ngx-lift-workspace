import {provideHttpClient} from '@angular/common/http';
import {provideHttpClientTesting} from '@angular/common/http/testing';
import {provideNoopAnimations} from '@angular/platform-browser/animations';
import {ComponentFixture, TestBed} from '@angular/core/testing';

import {CreateAsyncStateComponent} from './create-async-state.component';

describe('CreateAsyncStateComponent', () => {
  let component: CreateAsyncStateComponent;
  let fixture: ComponentFixture<CreateAsyncStateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateAsyncStateComponent],
      providers: [provideHttpClient(), provideHttpClientTesting(), provideNoopAnimations()],
    }).compileComponents();

    fixture = TestBed.createComponent(CreateAsyncStateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
