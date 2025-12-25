import {provideHttpClient} from '@angular/common/http';
import {provideHttpClientTesting} from '@angular/common/http/testing';
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {provideRouter} from '@angular/router';

import {DgStateComponent} from './dg-state.component';

describe('DgStateComponent', () => {
  let component: DgStateComponent;
  let fixture: ComponentFixture<DgStateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DgStateComponent],
      providers: [provideRouter([]), provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    fixture = TestBed.createComponent(DgStateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
