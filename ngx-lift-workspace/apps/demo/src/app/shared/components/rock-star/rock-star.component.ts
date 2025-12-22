import {CommonModule} from '@angular/common';
import {HttpClient} from '@angular/common/http';
import {ChangeDetectionStrategy, Component, inject} from '@angular/core';
import {AlertComponent, SpinnerComponent} from 'clr-lift';
import {combineLatestEager, switchMapWithAsyncState} from 'ngx-lift';
import {of, Subject} from 'rxjs';

@Component({
  selector: 'app-rock-star',
  standalone: true,
  imports: [CommonModule, AlertComponent, SpinnerComponent],
  templateUrl: './rock-star.component.html',
  styleUrl: './rock-star.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RockStarComponent {
  today$ = of(new Date());

  private showStarAction = new Subject<void>();
  private http = inject(HttpClient);

  rockStarState$ = this.showStarAction.pipe(
    switchMapWithAsyncState(() => this.http.get<{name: string}>(`https://jsonplaceholder.typicode.com/users/1`)),
  );

  vm$ = combineLatestEager({today: this.today$, rockStarState: this.rockStarState$});

  showRockStar() {
    this.showStarAction.next();
  }
}
