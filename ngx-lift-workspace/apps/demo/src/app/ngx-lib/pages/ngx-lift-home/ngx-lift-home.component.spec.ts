import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SvgIconRegistryService, SvgLoader } from 'angular-svg-icon';

import { NgxLiftHomeComponent } from './ngx-lift-home.component';

describe('NgxLiftHomeComponent', () => {
  let component: NgxLiftHomeComponent;
  let fixture: ComponentFixture<NgxLiftHomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NgxLiftHomeComponent],
      providers: [
        {
          provide: SvgLoader,
          useValue: {
            getSvg: () => Promise.resolve(''),
          },
        },
        {
          provide: SvgIconRegistryService,
          useValue: {
            loadSvg: () => {
              // Mock implementation
            },
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(NgxLiftHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
