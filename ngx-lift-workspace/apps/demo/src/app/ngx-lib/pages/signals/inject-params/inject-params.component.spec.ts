import {ComponentFixture, TestBed} from '@angular/core/testing';
import {ActivatedRoute, provideRouter, Router} from '@angular/router';
import {BehaviorSubject} from 'rxjs';

import {InjectParamsComponent} from './inject-params.component';

describe('InjectParamsComponent', () => {
  let component: InjectParamsComponent;
  let fixture: ComponentFixture<InjectParamsComponent>;
  const paramsSubject = new BehaviorSubject({});

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InjectParamsComponent],
      providers: [
        provideRouter([]),
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {params: {}},
            params: paramsSubject.asObservable(),
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(InjectParamsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
