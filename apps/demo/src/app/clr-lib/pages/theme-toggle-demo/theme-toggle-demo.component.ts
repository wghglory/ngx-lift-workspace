import {ChangeDetectionStrategy, Component, computed, inject, signal} from '@angular/core';
import {ClarityModule} from '@clr/angular';
import {
  CalloutComponent,
  ClarityTheme,
  PageContainerComponent,
  ThemeService,
  ThemeToggleComponent,
  TranslatePipe,
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
    CalloutComponent,
    CodeBlockComponent,
    DemoPlaygroundComponent,
    StateInspectorComponent,
    ThemeToggleComponent,
    ClarityModule,
    TranslatePipe,
  ],
  templateUrl: './theme-toggle-demo.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ThemeToggleDemoComponent {
  readonly componentInputs: ApiProperty[] = [
    {
      name: 'lang',
      type: 'string',
      description: 'Explicit language code for localized tooltips.',
    },
  ];

  readonly componentOutputs: ApiProperty[] = [
    {
      name: 'changeTheme',
      type: 'EventEmitter<ClarityTheme>',
      description: "Emits <code>ClarityTheme</code> ('light' | 'dark') whenever the theme is toggled.",
    },
  ];

  readonly serviceProperties: ApiProperty[] = [
    {
      name: 'theme',
      type: 'WritableSignal<ClarityTheme>',
      description: "Current active theme ('light' | 'dark').",
    },
  ];

  readonly serviceMethods: ApiProperty[] = [
    {
      name: 'setTheme(newTheme: ClarityTheme)',
      type: 'void',
      description: 'Sets the theme, persists to storage, and updates the DOM.',
    },
  ];

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

  basicComponentCode = highlight(`
import {ThemeToggleComponent, ClarityTheme} from 'clr-lift';

@Component({
  imports: [ThemeToggleComponent],
  template: \`
    <cll-theme-toggle (changeTheme)="onThemeChange($event)" />
  \`
})
export class HeaderComponent {
  onThemeChange(theme: ClarityTheme) {
    console.log('Active theme changed to:', theme);
  }
}
  `);

  programmaticServiceCode = highlight(`
import {ThemeService, ClarityTheme} from 'clr-lift';
import {Component, inject} from '@angular/core';

@Component({
  template: \`
    <p>Current theme: {{ themeService.theme() }}</p>
    <button class="btn btn-sm btn-outline" (click)="themeService.setTheme('light')">Force Light</button>
    <button class="btn btn-sm btn-outline" (click)="themeService.setTheme('dark')">Force Dark</button>
  \`
})
export class SettingsComponent {
  readonly themeService = inject(ThemeService);
}
  `);

  themingStylesCode = highlight(`
/* Styling custom components to react to Clarity dark theme */
:host-context([cds-theme='dark']) .custom-card {
  background-color: #1a2228;
  border-color: #314351;
  color: #ffffff;
}
  `);
}
