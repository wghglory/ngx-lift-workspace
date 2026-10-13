import {CommonModule} from '@angular/common';
import {ChangeDetectionStrategy, Component, computed, inject} from '@angular/core';
import {AlertComponent, SpinnerComponent, TranslatePipe, TranslationService} from 'clr-lift';
import {combineLatestEager, switchMapWithAsyncState} from 'ngx-lift';
import {map, of, Subject} from 'rxjs';
import {UserService} from '../../services/user.service';

@Component({
  selector: 'app-rock-star',
  imports: [CommonModule, AlertComponent, SpinnerComponent, TranslatePipe],
  templateUrl: './rock-star.component.html',
  styleUrl: './rock-star.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RockStarComponent {
  today$ = of(new Date());
  private readonly translations = inject(TranslationService);

  readonly formattedToday = computed(() =>
    new Intl.DateTimeFormat(this.translations.locale(), {dateStyle: 'medium'}).format(new Date()),
  );

  formatDate(value: Date | null): string {
    if (!value) return '';
    return new Intl.DateTimeFormat(this.translations.locale(), {dateStyle: 'medium'}).format(value);
  }

  private showStarAction = new Subject<void>();
  private users = inject(UserService);

  rockStarState$ = this.showStarAction.pipe(
    switchMapWithAsyncState(() =>
      this.users.getUsers({results: 1}).pipe(map((response) => ({name: response.results[0].name.first}))),
    ),
  );

  vm$ = combineLatestEager({
    today: this.today$,
    rockStarState: this.rockStarState$,
  });

  showRockStar() {
    this.showStarAction.next();
  }
}
