import {provideNoopAnimations} from '@angular/platform-browser/animations';
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {provideRouter} from '@angular/router';

import {ngxLiftNavConfig} from './vertical-nav.const';
import {VerticalNavComponent} from './vertical-nav.component';

describe('VerticalNavComponent', () => {
  let component: VerticalNavComponent;
  let fixture: ComponentFixture<VerticalNavComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VerticalNavComponent],
      providers: [provideNoopAnimations(), provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(VerticalNavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('lists both object-path exports in the utilities sidebar label', () => {
    const utilities = ngxLiftNavConfig.find((group) => group.path === '/ngx-lift/utilities');
    const objectPath = utilities?.children?.find((child) => child.path === '/object-path');
    expect(objectPath?.value).toBe('getValueByPath & deleteValueByPath');
  });
});
