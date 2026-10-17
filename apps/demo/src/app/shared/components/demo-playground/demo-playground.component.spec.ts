import {ComponentFixture, TestBed} from '@angular/core/testing';
import {beforeEach, describe, expect, it, vi} from 'vitest';
import {DemoPlaygroundComponent} from './demo-playground.component';
import {highlight} from '../../utils/highlight.util';

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

  it('keeps the caret, expanded state, and visible code in sync across clicks', () => {
    fixture.componentRef.setInput('tsCode', 'const x = 1;');
    fixture.detectChanges();
    const button: HTMLButtonElement = fixture.nativeElement.querySelector('.toggle-btn');
    const icon = button.querySelector('clr-icon')!;

    for (const expanded of [true, false, true]) {
      expect(button.getAttribute('aria-expanded')).toBe(String(expanded));
      expect(icon.getAttribute('dir')).toBe(expanded ? 'up' : 'down');
      expect(!!fixture.nativeElement.querySelector('.playground-code-body')).toBe(expanded);
      button.click();
      fixture.detectChanges();
    }
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
  it.each(['<span title="&amp;">example</span>', 'const value: Box<string> = a < b && b > c;'])(
    'copies the original source from prepared markup: %s',
    (source) => {
      fixture.componentRef.setInput('tsCode', highlight(source));
      const writeText = vi.fn().mockResolvedValue(undefined);
      Object.assign(navigator, {clipboard: {writeText}});
      component.copyCurrentCode();
      expect(writeText).toHaveBeenCalledWith(source);
    },
  );
  it('handles clipboard rejection and absence without reporting false success', async () => {
    fixture.componentRef.setInput('tsCode', 'const x = 1;');
    Object.assign(navigator, {clipboard: {writeText: vi.fn().mockRejectedValue(new Error('Permission denied'))}});
    component.copyCurrentCode();
    await Promise.resolve();
    await Promise.resolve();
    expect(component.copyFailed()).toBe(true);
    expect(component.copied()).toBe(false);
    Object.assign(navigator, {clipboard: undefined});
    component.copyCurrentCode();
    expect(component.copyFailed()).toBe(true);
  });

  it('clears feedback timers and ignores late clipboard completion after disposal', async () => {
    vi.useFakeTimers();
    try {
      fixture.componentRef.setInput('tsCode', 'const x = 1;');
      let resolveCopy!: () => void;
      Object.assign(navigator, {
        clipboard: {
          writeText: () =>
            new Promise<void>((resolve) => {
              resolveCopy = resolve;
            }),
        },
      });
      component.copyCurrentCode();
      fixture.destroy();
      resolveCopy();
      await Promise.resolve();
      expect(component.copied()).toBe(false);
    } finally {
      vi.useRealTimers();
    }
  });

  it.each([
    ['typescript', 'const x = 1;', '', '', 'typescript', 'const x = 1;'],
    ['html', '', '<div>hello</div>', '', 'html', '<div>hello</div>'],
    ['scss', '', '', 'body {color: red;}', 'scss', 'body {color: red;}'],
    ['html', 'const x = 1;', '', '', 'typescript', 'const x = 1;'],
    ['typescript', '', '<p>fallback</p>', '', 'html', '<p>fallback</p>'],
    ['html', '', '', 'p {color: blue;}', 'scss', 'p {color: blue;}'],
  ] as const)(
    'copies available source when selected tab is %s',
    async (selected, tsCode, htmlCode, scssCode, expectedTab, expectedCode) => {
      fixture.componentRef.setInput('tsCode', tsCode);
      fixture.componentRef.setInput('htmlCode', htmlCode);
      fixture.componentRef.setInput('scssCode', scssCode);
      component.setTab(selected);
      const writeText = vi.fn().mockResolvedValue(undefined);
      Object.assign(navigator, {clipboard: {writeText}});
      component.copyCurrentCode();
      await Promise.resolve();
      expect(component.effectiveActiveTab()).toBe(expectedTab);
      expect(writeText).toHaveBeenCalledWith(expectedCode);
      expect(component.hasAnyCode()).toBe(true);
    },
  );

  it('resets successful copy feedback and allows empty examples without crashing', async () => {
    vi.useFakeTimers();
    try {
      expect(component.hasAnyCode()).toBe(false);
      component.setTab('scss');
      expect(component.effectiveActiveTab()).toBe('typescript');
      component.copyCurrentCode();
      fixture.componentRef.setInput('tsCode', 'source');
      Object.assign(navigator, {clipboard: {writeText: vi.fn().mockResolvedValue(undefined)}});
      component.copyCurrentCode();
      await Promise.resolve();
      expect(component.copied()).toBe(true);
      await vi.advanceTimersByTimeAsync(2000);
      expect(component.copied()).toBe(false);
    } finally {
      vi.useRealTimers();
    }
  });
});
