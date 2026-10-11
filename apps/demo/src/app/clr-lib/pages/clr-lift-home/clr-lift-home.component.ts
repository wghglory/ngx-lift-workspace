import {ChangeDetectionStrategy, Component} from '@angular/core';
import {ClarityModule} from '@clr/angular';
import {CalloutComponent, TranslatePipe} from 'clr-lift';

import {CodeBlockComponent} from '../../../shared/components/code-block/code-block.component';
import {TileWithIconComponent} from '../../../shared/components/tile-with-icon/tile-with-icon.component';

@Component({
  selector: 'app-clr-lift-home',
  imports: [ClarityModule, CalloutComponent, TileWithIconComponent, CodeBlockComponent, TranslatePipe],
  templateUrl: './clr-lift-home.component.html',
  styleUrl: './clr-lift-home.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ClrLiftHomeComponent {}
