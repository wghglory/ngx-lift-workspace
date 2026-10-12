import {DOCUMENT} from '@angular/common';
import {Component} from '@angular/core';
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {ClarityModule} from '@clr/angular';
import {afterEach, beforeEach, describe, expect, it} from 'vitest';

import {DatagridFilterLabelResetDirective} from './datagrid-filter-label-reset.directive';

@Component({
  template: `
    <div clrControl cllDatagridFilterLabelReset>
      <clr-datagrid></clr-datagrid>
    </div>
  `,
  imports: [DatagridFilterLabelResetDirective, ClarityModule],
})
class TestHostComponent {}

describe('DatagridFilterLabelResetDirective', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let document: Document;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent],
    }).compileComponents();

    document = TestBed.inject(DOCUMENT);
  });

  afterEach(() => {
    const styleElement = document.getElementById('cll-datagrid-filter-label-reset');
    if (styleElement) {
      styleElement.remove();
    }
  });

  it('should inject the style tag into the document head on init', () => {
    expect(document.getElementById('cll-datagrid-filter-label-reset')).toBeNull();

    fixture = TestBed.createComponent(TestHostComponent);
    fixture.detectChanges();

    const styleElement = document.getElementById('cll-datagrid-filter-label-reset');
    expect(styleElement).toBeTruthy();
    expect(styleElement?.tagName).toBe('STYLE');
    expect(styleElement?.textContent).toContain('.datagrid-filter[cdktrapfocus] .clr-control-container');
  });

  it('should purge any existing style tag with the same id before injecting a new one', () => {
    const existingStyle = document.createElement('style');
    existingStyle.id = 'cll-datagrid-filter-label-reset';
    document.head.appendChild(existingStyle);

    fixture = TestBed.createComponent(TestHostComponent);
    fixture.detectChanges();

    const styleElements = document.querySelectorAll('#cll-datagrid-filter-label-reset');
    expect(styleElements.length).toBe(1);
    expect(styleElements[0]).not.toBe(existingStyle);
  });

  it('should remove the style tag from the document head on destroy', () => {
    fixture = TestBed.createComponent(TestHostComponent);
    fixture.detectChanges();

    expect(document.getElementById('cll-datagrid-filter-label-reset')).toBeTruthy();

    fixture.destroy();

    expect(document.getElementById('cll-datagrid-filter-label-reset')).toBeNull();
  });

  it('should not inject multiple style tags if multiple directives are initialized', () => {
    fixture = TestBed.createComponent(TestHostComponent);
    fixture.detectChanges();

    const fixture2 = TestBed.createComponent(TestHostComponent);
    fixture2.detectChanges();

    let styleElements = document.querySelectorAll('#cll-datagrid-filter-label-reset');
    expect(styleElements.length).toBe(1);

    fixture.destroy();

    styleElements = document.querySelectorAll('#cll-datagrid-filter-label-reset');
    expect(styleElements.length).toBe(1);

    fixture2.destroy();

    styleElements = document.querySelectorAll('#cll-datagrid-filter-label-reset');
    expect(styleElements.length).toBe(0);
  });
});
