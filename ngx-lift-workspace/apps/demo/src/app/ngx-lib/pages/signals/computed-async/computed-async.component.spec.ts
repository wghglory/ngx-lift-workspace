import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { ComputedAsyncComponent } from './computed-async.component';

describe('ComputedAsyncComponent', () => {
  let component: ComputedAsyncComponent;
  let fixture: ComponentFixture<ComputedAsyncComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ComputedAsyncComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([]),
        provideNoopAnimations(),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ComputedAsyncComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
