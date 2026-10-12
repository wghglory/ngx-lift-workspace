import {ChangeDetectionStrategy, Component, computed, input, OnInit, signal} from '@angular/core';
import {angleIcon, checkIcon, ClarityIcons, copyIcon, viewColumnsIcon, viewListIcon} from '@clr/angular/icon';
import {ClarityModule} from '@clr/angular';
import {TranslatePipe} from 'clr-lift';

ClarityIcons.addIcons(viewColumnsIcon, viewListIcon, copyIcon, checkIcon, angleIcon);

/** Supported source-code tabs in the demo playground. */
export type CodeTab = 'typescript' | 'html' | 'scss';
/** Difficulty label for a documented example. */
export type SkillLevel = 'beginner' | 'intermediate' | 'advanced';
/** Arrangement of the live preview and source code. */
export type PlaygroundLayout = 'stacked' | 'split';

/** Presents a live example alongside expandable source-code tabs. */
@Component({
  selector: 'app-demo-playground',
  imports: [ClarityModule, TranslatePipe],
  templateUrl: './demo-playground.component.html',
  styleUrl: './demo-playground.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DemoPlaygroundComponent implements OnInit {
  title = input.required<string>();
  description = input<string>('');
  level = input<SkillLevel | undefined>();
  badgeText = input<string>('');
  layout = input<PlaygroundLayout>('stacked');

  tsCode = input<string>('');
  htmlCode = input<string>('');
  scssCode = input<string>('');

  defaultExpanded = input<boolean>(true);
  defaultTab = input<CodeTab>('typescript');

  readonly activeTab = signal<CodeTab>('typescript');
  readonly isCodeExpanded = signal<boolean>(true);
  readonly currentLayout = signal<PlaygroundLayout>('stacked');
  readonly copied = signal<boolean>(false);

  readonly effectiveActiveTab = computed<CodeTab>(() => {
    const current = this.activeTab();
    if (current === 'typescript' && this.tsCode()) {
      return 'typescript';
    }
    if (current === 'html' && this.htmlCode()) {
      return 'html';
    }
    if (current === 'scss' && this.scssCode()) {
      return 'scss';
    }
    if (this.tsCode()) {
      return 'typescript';
    }
    if (this.htmlCode()) {
      return 'html';
    }
    if (this.scssCode()) {
      return 'scss';
    }
    return 'typescript';
  });

  readonly hasTabs = computed(() => {
    let count = 0;
    if (this.tsCode()) {
      count++;
    }
    if (this.htmlCode()) {
      count++;
    }
    if (this.scssCode()) {
      count++;
    }
    return count > 1;
  });

  readonly hasAnyCode = computed(() => !!this.tsCode() || !!this.htmlCode() || !!this.scssCode());

  ngOnInit(): void {
    this.isCodeExpanded.set(this.defaultExpanded());
    this.activeTab.set(this.defaultTab());
    this.currentLayout.set(this.layout());
  }

  setLayout(layout: PlaygroundLayout): void {
    this.currentLayout.set(layout);
  }

  toggleLayout(): void {
    this.currentLayout.update((current) => (current === 'split' ? 'stacked' : 'split'));
  }

  setTab(tab: CodeTab): void {
    this.activeTab.set(tab);
  }

  toggleCode(): void {
    this.isCodeExpanded.update((v) => !v);
  }

  copyCurrentCode(): void {
    let target = '';
    const current = this.effectiveActiveTab();

    if (current === 'typescript') {
      target = this.tsCode();
    } else if (current === 'html') {
      target = this.htmlCode();
    } else if (current === 'scss') {
      target = this.scssCode();
    }

    if (!target) {
      target = this.tsCode() || this.htmlCode() || this.scssCode();
    }

    const cleanCode = this.extractCleanCode(target);

    if (navigator?.clipboard) {
      navigator.clipboard.writeText(cleanCode).then(() => {
        this.copied.set(true);
        setTimeout(() => this.copied.set(false), 2000);
      });
    }
  }

  private extractCleanCode(code: string): string {
    if (!code) {
      return '';
    }
    if (code.includes('<span') || code.includes('hljs-')) {
      if (typeof document !== 'undefined') {
        const temp = document.createElement('div');
        temp.innerHTML = code;
        return temp.textContent || temp.innerText || '';
      }
    }
    return code;
  }
}
