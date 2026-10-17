import {ChangeDetectionStrategy, Component, signal} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {ClarityModule} from '@clr/angular';
import {AlertComponent, SpinnerComponent, TranslatePipe} from 'clr-lift';
import {queryResource} from 'ngx-lift';
import {map, timer} from 'rxjs';

interface Team {
  id: string;
  name: string;
  revision: number;
}

/** A complete read example; timer simulates the HTTP request so the preview runs locally. */
@Component({
  selector: 'app-query-starter',
  imports: [FormsModule, ClarityModule, AlertComponent, SpinnerComponent, TranslatePipe],
  templateUrl: './query-starter.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class QueryStarterComponent {
  readonly teamId = signal('a');
  readonly simulateFailure = signal(false);
  private revision = 0;

  readonly teamQuery = queryResource<Team>(() => {
    const id = this.teamId();
    return {
      key: ['query-starter', id],
      // This simulated transport belongs to this component instance.
      gcTime: 0,
      cancelOnNoObservers: true,
      loader: () => {
        const fail = this.simulateFailure();
        const revision = ++this.revision;
        return timer(350).pipe(
          map(() => {
            if (fail) throw new Error('Simulated read failure');
            return {id, name: id === 'a' ? 'Atlas' : 'Beacon', revision};
          }),
        );
      },
    };
  });
}
