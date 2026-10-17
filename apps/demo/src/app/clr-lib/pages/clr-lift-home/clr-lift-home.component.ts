import {ChangeDetectionStrategy, Component} from '@angular/core';
import {RouterLink} from '@angular/router';
import {ClarityModule} from '@clr/angular';
import {CalloutComponent, TranslatePipe} from 'clr-lift';

import {CodeBlockComponent} from '../../../shared/components/code-block/code-block.component';
import {highlight} from '../../../shared/utils/highlight.util';
import {TileWithIconComponent} from '../../../shared/components/tile-with-icon/tile-with-icon.component';

@Component({
  selector: 'app-clr-lift-home',
  imports: [RouterLink, ClarityModule, CalloutComponent, TileWithIconComponent, CodeBlockComponent, TranslatePipe],
  templateUrl: './clr-lift-home.component.html',
  styleUrl: './clr-lift-home.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ClrLiftHomeComponent {
  readonly setupCode = highlight(`// angular.json (or your build target): add this global stylesheet:
// "styles": ["node_modules/@clr/ui/clr-ui.min.css", "src/styles.scss"]

// app.component.ts — a standalone component needs no clr-lift module.
import {ChangeDetectionStrategy, Component} from '@angular/core';
import {AlertComponent} from 'clr-lift';

@Component({
  selector: 'app-root',
  imports: [AlertComponent],
  template: \`<cll-alert alertType="info" content="Ready to build with clr-lift." />\`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {}
// Add provideAnimations() in app.config.ts when using animated Clarity controls.
// Toasts, translations and other services document their own setup on their pages.`);
}
