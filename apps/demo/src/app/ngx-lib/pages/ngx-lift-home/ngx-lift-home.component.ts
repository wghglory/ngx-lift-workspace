import {ChangeDetectionStrategy, Component} from '@angular/core';
import {RouterLink} from '@angular/router';
import {ClarityModule} from '@clr/angular';
import {TranslatePipe} from 'clr-lift';

import {CodeBlockComponent} from '../../../shared/components/code-block/code-block.component';
import {highlight} from '../../../shared/utils/highlight.util';
import {TileWithIconComponent} from '../../../shared/components/tile-with-icon/tile-with-icon.component';

@Component({
  selector: 'app-ngx-lift-home',
  imports: [RouterLink, ClarityModule, TileWithIconComponent, CodeBlockComponent, TranslatePipe],
  templateUrl: './ngx-lift-home.component.html',
  styleUrl: './ngx-lift-home.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NgxLiftHomeComponent {
  readonly setupCode = highlight(`// app.config.ts — only needed for examples that use HttpClient.
import {provideHttpClient} from '@angular/common/http';
import {ApplicationConfig} from '@angular/core';

export const appConfig: ApplicationConfig = {
  providers: [provideHttpClient()],
};
// queryResource uses the root QueryClient without a separate provider.
// Follow "Your first query" below for a local, runnable read with recovery.`);
}
