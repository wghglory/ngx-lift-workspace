import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TileWithIconComponent } from './tile-with-icon.component';

describe('TileWithIconComponent', () => {
  let component: TileWithIconComponent;
  let fixture: ComponentFixture<TileWithIconComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TileWithIconComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TileWithIconComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('icon', 'test-icon');
    fixture.componentRef.setInput('title', 'Test Title');
    fixture.componentRef.setInput('description', 'Test Description');
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
