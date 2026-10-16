import {ChangeDetectionStrategy, Component, inject} from '@angular/core';
import {TranslatePipe} from 'clr-lift';
import {queryResource} from 'ngx-lift';

import {TeamService} from './team.service';
import {teamMembersQuery} from './team.queries';

@Component({
  selector: 'app-team-summary',
  imports: [TranslatePipe],
  template: `
    <p data-testid="team-summary-count">
      {{ 'queryOwnership.summary' | translate }}: {{ membersQuery.value()?.length ?? 0 }}
    </p>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TeamSummaryComponent {
  private readonly teamService = inject(TeamService);

  readonly membersQuery = queryResource(() => teamMembersQuery(this.teamService, 'team-a'));
}
