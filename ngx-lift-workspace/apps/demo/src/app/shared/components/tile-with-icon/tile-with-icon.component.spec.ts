import {ComponentFixture, TestBed} from '@angular/core/testing';

import {TileWithIconComponent} from './tile-with-icon.component';

describe('TileWithIconComponent', () => {
  let component: TileWithIconComponent;
  let fixture: ComponentFixture<TileWithIconComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TileWithIconComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TileWithIconComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
