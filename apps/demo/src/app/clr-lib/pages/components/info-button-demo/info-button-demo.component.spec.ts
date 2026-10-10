import {ComponentFixture, TestBed} from '@angular/core/testing';
import {provideRouter} from '@angular/router';
import {beforeEach, describe, expect, it} from 'vitest';

import {InfoButtonDemoComponent} from './info-button-demo.component';

describe('InfoButtonDemoComponent', () => {
  let component: InfoButtonDemoComponent;
  let fixture: ComponentFixture<InfoButtonDemoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InfoButtonDemoComponent],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(InfoButtonDemoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should increment actionCount when onTriggerAction is called', () => {
    expect(component.actionCount()).toBe(0);
    component.onTriggerAction();
    expect(component.actionCount()).toBe(1);
  });
});
