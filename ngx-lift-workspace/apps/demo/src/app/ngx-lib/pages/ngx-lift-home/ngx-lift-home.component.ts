import {ChangeDetectionStrategy, Component} from '@angular/core';
import {ClarityModule} from '@clr/angular';
import {SvgIconComponent} from 'angular-svg-icon';

import {CodeBlockComponent} from '../../../shared/components/code-block/code-block.component';
import {TileWithIconComponent} from '../../../shared/components/tile-with-icon/tile-with-icon.component';

@Component({
  selector: 'app-ngx-lift-home',
  standalone: true,
  imports: [
    ClarityModule,
    SvgIconComponent,
    TileWithIconComponent,
    CodeBlockComponent,
  ],
  templateUrl: './ngx-lift-home.component.html',
  styleUrl: './ngx-lift-home.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NgxLiftHomeComponent {
  // options: AnimationOptions = {
  //   path: '/assets/lottie.json',
  // };
}
