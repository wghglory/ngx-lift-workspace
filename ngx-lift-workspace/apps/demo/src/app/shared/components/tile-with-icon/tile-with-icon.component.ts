import {ChangeDetectionStrategy, Component, input} from '@angular/core';

import {TileComponent} from '../tile/tile.component';

@Component({
  selector: 'app-tile-with-icon',
  standalone: true,
  imports: [TileComponent],
  templateUrl: './tile-with-icon.component.html',
  styleUrl: './tile-with-icon.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TileWithIconComponent {
  icon = input.required<string>();
  title = input.required<string>();
  description = input.required<string>();
}
