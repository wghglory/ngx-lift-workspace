import {ComponentFixture, TestBed} from '@angular/core/testing';

import {IsHttpsPipeComponent} from './is-https-pipe.component';

describe('IsHttpsPipeComponent', () => {
  let component: IsHttpsPipeComponent;
  let fixture: ComponentFixture<IsHttpsPipeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IsHttpsPipeComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(IsHttpsPipeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
