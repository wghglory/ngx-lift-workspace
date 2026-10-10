import {Component} from '@angular/core';
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {describe, expect, it} from 'vitest';

import {KeyValueItemComponent} from './key-value-item.component';

@Component({
  imports: [KeyValueItemComponent],
  template: `
    <cll-key-value-item>
      <span key id="custom-key">Region</span>
      <span value id="custom-val">us-west-2</span>
    </cll-key-value-item>
  `,
})
class TestHostComponent {}

describe('KeyValueItemComponent', () => {
  let component: KeyValueItemComponent;
  let fixture: ComponentFixture<KeyValueItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [KeyValueItemComponent, TestHostComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(KeyValueItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render key and value from inputs', () => {
    fixture.componentRef.setInput('key', 'Environment');
    fixture.componentRef.setInput('value', 'Production');
    fixture.detectChanges();

    const keyLabel = fixture.nativeElement.querySelector('.key-label');
    const valText = fixture.nativeElement.querySelector('.value-text');

    expect(keyLabel.textContent.trim()).toBe('Environment');
    expect(valText.textContent.trim()).toBe('Production');
  });

  it('should support content projection for key and value', () => {
    const hostFixture = TestBed.createComponent(TestHostComponent);
    hostFixture.detectChanges();

    const customKey = hostFixture.nativeElement.querySelector('#custom-key');
    const customVal = hostFixture.nativeElement.querySelector('#custom-val');

    expect(customKey).toBeTruthy();
    expect(customKey.textContent.trim()).toBe('Region');
    expect(customVal).toBeTruthy();
    expect(customVal.textContent.trim()).toBe('us-west-2');
  });
});
