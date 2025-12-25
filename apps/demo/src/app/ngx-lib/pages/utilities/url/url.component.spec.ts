import {ComponentFixture, TestBed} from '@angular/core/testing';
import {provideRouter} from '@angular/router';

import {UrlComponent} from './url.component';

describe('UrlComponent', () => {
  let component: UrlComponent;
  let fixture: ComponentFixture<UrlComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UrlComponent],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(UrlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
