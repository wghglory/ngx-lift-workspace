/** TypeScript and HTML tabs mirror the compiled starter files. */
export const MUTATION_STARTER_SOURCE = `import {ChangeDetectionStrategy, Component, computed, signal} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {ClarityModule} from '@clr/angular';
import {AlertComponent, SpinnerComponent, TranslatePipe} from 'clr-lift';
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
  readonly name = signal('');
  readonly simulateFailure = signal(false);
  readonly saveTeamMutation = mutateResource((name: string) => {
    const fail = this.simulateFailure();
    return timer(350).pipe(
      map(() => {
        if (fail) throw new Error('Simulated save failure');
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
}`;

export const MUTATION_STARTER_TEMPLATE = `<form clrForm cds-layout="vertical gap:sm" (ngSubmit)="save()">
  <clr-input-container>
    <label>{{ 'common.name' | translate }}</label>
    <input clrInput name="teamName" [ngModel]="name()" (ngModelChange)="name.set($event)" />
  </clr-input-container>
  <clr-checkbox-container>
    <clr-checkbox-wrapper>
      <input
        type="checkbox"
        clrCheckbox
        name="simulateFailure"
        [ngModel]="simulateFailure()"
        (ngModelChange)="simulateFailure.set($event)"
      />
      <label>{{ 'queryLearn.simulateFailure' | translate }}</label>
    </clr-checkbox-wrapper>
  </clr-checkbox-container>
  <button type="submit" class="btn btn-sm btn-primary" [disabled]="saveDisabled()">
    @if (saveTeamMutation.isLoading()) {
      <cll-spinner inline size="sm" />
    }
    {{ 'common.save' | translate }}
  </button>
  @if (saveTeamMutation.error()) {
    <cll-alert [content]="'queryLearn.writeError' | translate" />
  }
  @if (saveTeamMutation.status() === 'resolved') {
    <p role="status" data-testid="starter-saved">
      {{ 'queryLearn.saved' | translate }}: {{ saveTeamMutation.value()?.name }}
    </p>
  }
</form>`;
