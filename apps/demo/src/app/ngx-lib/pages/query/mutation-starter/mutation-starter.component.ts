import {ChangeDetectionStrategy, Component, computed, signal, inject} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {ClarityModule} from '@clr/angular';
import {AlertComponent, SpinnerComponent, TranslatePipe, TranslationService} from 'clr-lift';
import {mutateResource} from 'ngx-lift';
import {map, timer} from 'rxjs';

/** A complete save example; timer simulates a server write without requiring a backend. */
@Component({
  selector: 'app-mutation-starter',
  imports: [FormsModule, ClarityModule, AlertComponent, SpinnerComponent, TranslatePipe],
  templateUrl: './mutation-starter.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MutationStarterComponent {
  private readonly translationService = inject(TranslationService);

  readonly name = signal('');
  readonly simulateFailure = signal(false);
  readonly saveTeamMutation = mutateResource((name: string) => {
    const fail = this.simulateFailure();
    return timer(350).pipe(
      map(() => {
        if (fail) throw new Error(this.translationService.translate('runtime.saveFailure'));
        return {name};
      }),
    );
  });
  readonly saveDisabled = computed(() => !this.name().trim() || this.saveTeamMutation.isLoading());

  async save(): Promise<void> {
    if (this.saveDisabled()) return;
    try {
      await this.saveTeamMutation.mutate(this.name().trim());
    } catch {
      // The error signal keeps the failed write visible until the next attempt.
    }
  }
}
