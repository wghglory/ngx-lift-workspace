import {provideRouter} from '@angular/router';
import {ComponentFixture, TestBed} from '@angular/core/testing';

import {PageContainerDemoComponent} from './page-container-demo.component';

describe('PageContainerDemoComponent', () => {
  let component: PageContainerDemoComponent;
  let fixture: ComponentFixture<PageContainerDemoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [provideRouter([])],
      imports: [PageContainerDemoComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PageContainerDemoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
