import {ComponentFixture, TestBed} from '@angular/core/testing';

import {TestingUtilitiesComponent} from './testing-utilities.component';

describe('TestingUtilitiesComponent', () => {
  let component: TestingUtilitiesComponent;
  let fixture: ComponentFixture<TestingUtilitiesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestingUtilitiesComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TestingUtilitiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
