import {ComponentFixture, TestBed} from '@angular/core/testing';
import {beforeEach, describe, expect, it, vi} from 'vitest';

import {TranslationService} from '../../services/translation.service';
import {AutocompleteComponent} from './autocomplete.component';

describe('AutocompleteComponent', () => {
  let component: AutocompleteComponent;
  let fixture: ComponentFixture<AutocompleteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AutocompleteComponent],
      providers: [TranslationService],
    }).compileComponents();

    fixture = TestBed.createComponent(AutocompleteComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('options', ['PostgreSQL', 'MySQL', 'MongoDB', 'Redis']);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should filter suggestions based on input value', () => {
    component.onInputChange('sql');
    fixture.detectChanges();

    expect(component.suggestions()).toEqual(['PostgreSQL', 'MySQL']);
  });

  it('should return all options when query is empty', () => {
    component.onInputChange('');
    fixture.detectChanges();

    expect(component.suggestions().length).toBe(4);
  });

  it('should select an option and emit selected', () => {
    const selectedSpy = vi.fn();
    component.selected.subscribe(selectedSpy);

    component.onSelect('Redis');
    fixture.detectChanges();

    expect(component.inputValue()).toBe('Redis');
    expect(selectedSpy).toHaveBeenCalledWith('Redis');
    expect(component.isOpen()).toBe(false);
  });

  it('should navigate suggestions via arrow keys', () => {
    component.onInputChange('sql');
    const mockEvent = {preventDefault: vi.fn()} as unknown as Event;

    // Arrow down moves to index 0
    component.onArrowDown(mockEvent);
    expect(component.activeItemIndex()).toBe(0);

    // Arrow down moves to index 1
    component.onArrowDown(mockEvent);
    expect(component.activeItemIndex()).toBe(1);

    // Arrow down cycles back to 0
    component.onArrowDown(mockEvent);
    expect(component.activeItemIndex()).toBe(0);

    // Arrow up moves backward to 1
    component.onArrowUp(mockEvent);
    expect(component.activeItemIndex()).toBe(1);
  });

  it('should select active item on Enter', () => {
    const selectedSpy = vi.fn();
    component.selected.subscribe(selectedSpy);

    component.onInputChange('sql');
    const mockEvent = {preventDefault: vi.fn()} as unknown as Event;
    component.onArrowDown(mockEvent); // selects index 0 -> PostgreSQL

    component.onEnter();
    expect(selectedSpy).toHaveBeenCalledWith('PostgreSQL');
  });

  it('should update value via writeValue', () => {
    component.writeValue('MongoDB');
    expect(component.inputValue()).toBe('MongoDB');
  });

  it('should support disabled state', () => {
    component.setDisabledState(true);
    fixture.detectChanges();

    expect(component.disabled()).toBe(true);
    const input = fixture.nativeElement.querySelector('input');
    expect(input.disabled).toBe(true);
  });
});
