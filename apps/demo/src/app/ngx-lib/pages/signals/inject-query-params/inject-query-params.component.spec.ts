import {provideHttpClient} from '@angular/common/http';
import {provideHttpClientTesting} from '@angular/common/http/testing';
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {provideRouter} from '@angular/router';

import {InjectQueryParamsComponent} from './inject-query-params.component';

describe('InjectQueryParamsComponent', () => {
  let component: InjectQueryParamsComponent;
  let fixture: ComponentFixture<InjectQueryParamsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InjectQueryParamsComponent],
      providers: [provideHttpClient(), provideHttpClientTesting(), provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(InjectQueryParamsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
