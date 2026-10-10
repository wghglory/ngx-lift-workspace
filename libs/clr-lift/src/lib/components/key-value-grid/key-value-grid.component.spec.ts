import {ComponentFixture, TestBed} from '@angular/core/testing';
import {describe, expect, it} from 'vitest';

import {KeyValueGridComponent} from './key-value-grid.component';

describe('KeyValueGridComponent', () => {
  let component: KeyValueGridComponent;
  let fixture: ComponentFixture<KeyValueGridComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [KeyValueGridComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(KeyValueGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should apply default gap', () => {
    const grid = fixture.nativeElement.querySelector('.key-value-grid');
    expect(grid.style.gap).toBe('1.5rem');
  });

  it('should apply custom gap', () => {
    fixture.componentRef.setInput('gap', '2.5rem');
    fixture.detectChanges();

    const grid = fixture.nativeElement.querySelector('.key-value-grid');
    expect(grid.style.gap).toBe('2.5rem');
  });

  it('should have grid-auto class by default', () => {
    const grid = fixture.nativeElement.querySelector('.key-value-grid');
    expect(grid.classList.contains('grid-auto')).toBe(true);
  });

  it('should apply fixed column count when columns input is a number', () => {
    fixture.componentRef.setInput('columns', 3);
    fixture.detectChanges();

    const grid = fixture.nativeElement.querySelector('.key-value-grid');
    expect(grid.classList.contains('grid-auto')).toBe(false);
    expect(grid.style.gridTemplateColumns).toBe('repeat(3, 1fr)');
  });
});
