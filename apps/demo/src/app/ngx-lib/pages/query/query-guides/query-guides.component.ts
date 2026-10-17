import {ChangeDetectionStrategy, Component, inject} from '@angular/core';
import {ActivatedRoute, RouterLink} from '@angular/router';
import {CalloutComponent, PageContainerComponent, TranslatePipe} from 'clr-lift';

/** Focused explanations and lookup pages, linked from the three API tutorials. */
@Component({
  selector: 'app-query-guides',
  imports: [RouterLink, CalloutComponent, PageContainerComponent, TranslatePipe],
  templateUrl: './query-guides.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class QueryGuidesComponent {
  readonly guide: string = inject(ActivatedRoute).snapshot.data['guide'];
  readonly title = `queryDocs.${this.guide}`;
}
