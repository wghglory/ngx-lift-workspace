import {ChangeDetectionStrategy, Component} from '@angular/core';
import {ClarityModule} from '@clr/angular';

import {CodeBlockComponent} from '../../../shared/components/code-block/code-block.component';
import {TileWithIconComponent} from '../../../shared/components/tile-with-icon/tile-with-icon.component';

@Component({
  selector: 'app-ngx-lift-home',
  imports: [ClarityModule, TileWithIconComponent, CodeBlockComponent],
  templateUrl: './ngx-lift-home.component.html',
  styleUrl: './ngx-lift-home.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NgxLiftHomeComponent {}
