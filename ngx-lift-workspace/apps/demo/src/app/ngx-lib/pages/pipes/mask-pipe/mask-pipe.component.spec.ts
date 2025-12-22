import {ComponentFixture, TestBed} from '@angular/core/testing';

import {MaskPipeComponent} from './mask-pipe.component';

describe('MaskPipeComponent', () => {
  let component: MaskPipeComponent;
  let fixture: ComponentFixture<MaskPipeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MaskPipeComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MaskPipeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
