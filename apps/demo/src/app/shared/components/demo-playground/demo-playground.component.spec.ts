import {ComponentFixture, TestBed} from '@angular/core/testing';
import {beforeEach, describe, expect, it, vi} from 'vitest';
import {DemoPlaygroundComponent} from './demo-playground.component';

describe('DemoPlaygroundComponent', () => {
  let component: DemoPlaygroundComponent;
  let fixture: ComponentFixture<DemoPlaygroundComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DemoPlaygroundComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DemoPlaygroundComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('title', 'Test Demo');
    fixture.detectChanges();
  });

  it('should create successfully with title', () => {
    expect(component).toBeTruthy();
    expect(component.title()).toBe('Test Demo');
  });

  it('should manage tab selection and code visibility', () => {
    fixture.componentRef.setInput('tsCode', 'const x = 1;');
    fixture.componentRef.setInput('htmlCode', '<div>hello</div>');
    fixture.detectChanges();

    expect(component.hasTabs()).toBe(true);
    expect(component.activeTab()).toBe('typescript');

    component.setTab('html');
    expect(component.activeTab()).toBe('html');

    expect(component.isCodeExpanded()).toBe(true);
    component.toggleCode();
    expect(component.isCodeExpanded()).toBe(false);
  });

  it('should copy active tab code to clipboard', async () => {
    fixture.componentRef.setInput('tsCode', 'const x = 1;');
    fixture.detectChanges();

    const writeTextSpy = vi.fn().mockResolvedValue(undefined);
    Object.assign(navigator, {
      clipboard: {
        writeText: writeTextSpy,
      },
    });

    component.copyCurrentCode();
    expect(writeTextSpy).toHaveBeenCalledWith('const x = 1;');
  });

  it('should strip syntax highlighting html and decode entities when copying to clipboard', async () => {
    fixture.componentRef.setInput(
      'tsCode',
      '<span class="hljs-keyword">import</span> {<span class="hljs-title class_">Component</span>} <span class="hljs-keyword">from</span> <span class="hljs-string">&#x27;@angular/core&#x27;</span>;',
    );
    fixture.detectChanges();

    const writeTextSpy = vi.fn().mockResolvedValue(undefined);
    Object.assign(navigator, {
      clipboard: {
        writeText: writeTextSpy,
      },
    });

    component.copyCurrentCode();
    expect(writeTextSpy).toHaveBeenCalledWith("import {Component} from '@angular/core';");
  });

  it('should toggle layout between stacked and split', () => {
    expect(component.currentLayout()).toBe('stacked');

    component.setLayout('split');
    expect(component.currentLayout()).toBe('split');

    component.toggleLayout();
    expect(component.currentLayout()).toBe('stacked');
  });
});
