import {ChangeDetectionStrategy, Component} from '@angular/core';
import {ClarityModule} from '@clr/angular';
import {PageContainerComponent} from 'clr-lift';

import {CodeBlockComponent} from '../../../../shared/components/code-block/code-block.component';
import {RockStarComponent} from '../../../../shared/components/rock-star/rock-star.component';
import {highlight} from '../../../../shared/utils/highlight.util';

@Component({
  selector: 'app-combine-latest-eager',
  standalone: true,
  imports: [ClarityModule, PageContainerComponent, CodeBlockComponent, RockStarComponent],
  templateUrl: './combine-latest-eager.component.html',
  styleUrl: './combine-latest-eager.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CombineLatestEagerComponent {
  htmlCode = highlight(
    `
@if (vm$ | async; as vm) {
  <p>
    Today is <time> {{ vm.today | date }} </time>. Who is our today's rock star?
    <button (click)="showRockStar()" class="btn btn-outline">Unveil</button>
  </p>

  @if (vm.rockStarState?.error; as error) {
    <cll-alert [error]="error" />
  }
  @if (vm.rockStarState?.loading) {
    <cll-spinner />
  }
  @if (vm.rockStarState?.data; as rockStar) {
    <p class="!text-xl">{{ rockStar.name }}</p>
  }
}
    `,
  );

  tsCode = highlight(
    `
import {AlertComponent, SpinnerComponent} from 'clr-lift';
import {combineLatestEager, switchMapWithAsyncState} from 'ngx-lift';
import {of, Subject} from 'rxjs';

export class RockStarComponent {
  today$ = of(new Date());

  private showStarAction = new Subject<void>();
  private http = inject(HttpClient);

  rockStarState$ = this.showStarAction.pipe(
    switchMapWithAsyncState(() => this.http.get<{name: string}>('https://jsonplaceholder.typicode.com/users/1')),
  );

  // using RxJS combineLatest won't work because showStarAction won't emit initial value until button click
  vm$ = combineLatestEager({today: this.today$, rockStarState: this.rockStarState$});

  showRockStar() {
    this.showStarAction.next();
  }
}
    `,
  );
}
