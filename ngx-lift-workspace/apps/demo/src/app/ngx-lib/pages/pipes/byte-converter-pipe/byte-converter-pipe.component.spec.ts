import {ComponentFixture, TestBed} from '@angular/core/testing';

import {ByteConverterPipeComponent} from './byte-converter-pipe.component';

describe('ByteConverterPipeComponent', () => {
  let component: ByteConverterPipeComponent;
  let fixture: ComponentFixture<ByteConverterPipeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ByteConverterPipeComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ByteConverterPipeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
