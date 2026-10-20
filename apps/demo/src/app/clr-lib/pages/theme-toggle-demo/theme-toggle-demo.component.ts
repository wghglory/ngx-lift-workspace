import {ChangeDetectionStrategy, Component, computed, inject, signal} from '@angular/core';
import {ClarityModule} from '@clr/angular';
import {
  ClarityTheme,
  PageContainerComponent,
  ThemeService,
  ThemeToggleComponent,
  TranslatePipe,
  TranslationService,
} from 'clr-lift';

import {ApiProperty, ApiTableComponent} from '../../../shared/components/api-table';
import {CodeBlockComponent} from '../../../shared/components/code-block/code-block.component';
import {DemoPlaygroundComponent} from '../../../shared/components/demo-playground/demo-playground.component';
import {StateInspectorComponent} from '../../../shared/components/state-inspector/state-inspector.component';
import {highlight} from '../../../shared/utils/highlight.util';

@Component({
  selector: 'app-theme-toggle-demo',
  imports: [
    ApiTableComponent,
    PageContainerComponent,
    CodeBlockComponent,
    DemoPlaygroundComponent,
    StateInspectorComponent,
    ThemeToggleComponent,
    ClarityModule,
    TranslatePipe,
  ],
  templateUrl: './theme-toggle-demo.component.html',
  styleUrl: './theme-toggle-demo.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ThemeToggleDemoComponent {
  private readonly translationService = inject(TranslationService);

  readonly componentInputs = computed<ApiProperty[]>(() => [
    {
      name: 'lang',
      type: 'string',
      description: this.translationService.translate('demoApi.theme-toggle-demo.componentInputs.lang'),
    },
  ]);

  readonly componentOutputs = computed<ApiProperty[]>(() => [
    {
      name: 'changeTheme',
      type: 'EventEmitter<ClarityTheme>',
      description: this.translationService.translate('demoApi.theme-toggle-demo.componentOutputs.changeTheme'),
    },
  ]);

  readonly serviceProperties = computed<ApiProperty[]>(() => [
    {
      name: 'theme',
      type: 'WritableSignal<ClarityTheme>',
      description: this.translationService.translate('demoApi.theme-toggle-demo.serviceProperties.theme'),
    },
  ]);

  readonly serviceMethods = computed<ApiProperty[]>(() => [
    {
      name: 'setTheme(newTheme: ClarityTheme)',
      type: 'void',
      description: this.translationService.translate(
        'demoApi.theme-toggle-demo.serviceMethods.setTheme(newTheme: ClarityTheme)',
      ),
    },
  ]);

  readonly themeService = inject(ThemeService);

  readonly currentTheme = this.themeService.theme;
  readonly lastChangedEvent = signal<string>('none');

  readonly toggleInspectorData = computed(() => ({
    currentTheme: this.currentTheme(),
    isDarkMode: this.currentTheme() === 'dark',
    lastEvent: this.lastChangedEvent(),
  }));

  onThemeChange(theme: ClarityTheme) {
    this.lastChangedEvent.set(`Emitted "${theme}" at ${new Date().toLocaleTimeString()}`);
  }

  setTheme(theme: ClarityTheme) {
    this.themeService.setTheme(theme);
    this.lastChangedEvent.set(`Programmatically set "${theme}" at ${new Date().toLocaleTimeString()}`);
  }

  basicComponentCode = highlight(
    "import {ChangeDetectionStrategy, Component} from '@angular/core';\n\nimport {ThemeToggleComponent, ClarityTheme} from 'clr-lift';\n\n@Component({\n  changeDetection: ChangeDetectionStrategy.OnPush,\n  imports: [ThemeToggleComponent],\n  templateUrl: './example.html',\n})\nexport class HeaderComponent {\n  onThemeChange(theme: ClarityTheme) {\n    console.log('Active theme changed to:', theme);\n  }\n}",
  );
  basicComponentCodeHtml = highlight('<cll-theme-toggle (changeTheme)="onThemeChange($event)" />');

  programmaticServiceCode = highlight(
    "import {ThemeService, ClarityTheme} from 'clr-lift';\nimport {ChangeDetectionStrategy, Component, inject} from '@angular/core';\n\n@Component({\n  changeDetection: ChangeDetectionStrategy.OnPush,\n  templateUrl: './example.html',\n})\nexport class SettingsComponent {\n  readonly themeService = inject(ThemeService);\n}",
  );
  programmaticServiceCodeHtml = highlight(
    `<p>Current theme: {{ themeService.theme() }}</p>
<button class="btn btn-sm btn-outline" (click)="themeService.setTheme('light')">Force Light</button>
<button class="btn btn-sm btn-outline" (click)="themeService.setTheme('dark')">Force Dark</button>`,
  );

  themingStylesCode = highlight(`
/* Styling custom components to react to Clarity dark theme */
:host-context([cds-theme='dark']) .custom-card {
  background-color: #1a2228;
  border-color: #314351;
  color: #ffffff;
}
  `);
}
