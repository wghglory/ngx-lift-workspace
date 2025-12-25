import {ComponentFixture, TestBed} from '@angular/core/testing';
import {SvgIconRegistryService} from 'angular-svg-icon';

import {ClrLiftHomeComponent} from './clr-lift-home.component';

describe('ClrLiftHomeComponent', () => {
  let component: ClrLiftHomeComponent;
  let fixture: ComponentFixture<ClrLiftHomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClrLiftHomeComponent],
      providers: [
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

    fixture = TestBed.createComponent(ClrLiftHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
