import {ChangeDetectionStrategy, Component, inject} from '@angular/core';
import {ActivatedRoute, RouterLink} from '@angular/router';
import {CalloutComponent, PageContainerComponent, QueryDevtoolsComponent, TranslatePipe} from 'clr-lift';

import {CodeBlockComponent} from '../../../../shared/components/code-block/code-block.component';
import {highlight} from '../../../../shared/utils/highlight.util';
import {QueryStarterComponent} from '../query-starter/query-starter.component';

/** Focused explanations and lookup pages, linked from the three API tutorials. */
@Component({
  selector: 'app-query-guides',
  imports: [
    RouterLink,
    CalloutComponent,
    PageContainerComponent,
    QueryDevtoolsComponent,
    TranslatePipe,
    CodeBlockComponent,
    QueryStarterComponent,
  ],
  templateUrl: './query-guides.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class QueryGuidesComponent {
  readonly guide: string = inject(ActivatedRoute).snapshot.data['guide'];
  readonly title = `queryDocs.${this.guide}`;
  readonly setupCode = highlight(`import {ApplicationConfig} from '@angular/core';
import {provideQueryDevtools} from 'clr-lift/devtools';

export const appConfig: ApplicationConfig = {
  providers: [provideQueryDevtools()],
};`);
  readonly panelCode = highlight(`import {ChangeDetectionStrategy, Component} from '@angular/core';
import {QueryDevtoolsComponent} from 'clr-lift';

@Component({
  selector: 'app-query-diagnostics',
  imports: [QueryDevtoolsComponent],
  template: '<cll-query-devtools [enabled]="true" />',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class QueryDiagnosticsComponent {}`);
  readonly organizationCode = highlight(`import {QueryDefinition} from 'ngx-lift';
import {TeamService, TeamMember} from './team.service';

// team.queries.ts owns identity, tags, transport selection and policy.
export const teamKeys = {
  members: (scope: string) => ['teams', scope, 'members'] as const,
};
export const teamTags = {
  members: (scope: string) => ({type: 'teams/members', scope}),
  member: (scope: string, id: number) => ({type: 'teams/member', scope, id}),
};
export function teamMembersQuery(teamService: TeamService, scope: string): QueryDefinition<TeamMember[]> {
  return {
    key: teamKeys.members(scope),
    tags: [teamTags.members(scope)],
    loader: () => teamService.getMembers(scope),
    staleTime: 60_000,
  };
}`);
  readonly observerCode = highlight(`import {inject} from '@angular/core';
import {mutateResource, queryResource} from 'ngx-lift';
import {TeamService, CreateTeamMemberArgs} from './team.service';
import {teamMembersQuery, teamTags} from './team.queries';

// Component fields: each caller owns its observer, even when the data is shared.
readonly teamService = inject(TeamService);

readonly membersQuery = queryResource(() => teamMembersQuery(this.teamService, 'team-a'));

readonly createMemberMutation = mutateResource((args: CreateTeamMemberArgs) => this.teamService.createMember(args), {
  invalidateTags: (result, args) => [teamTags.members(args.scope), teamTags.member(args.scope, result.id)],
  concurrency: 'exhaust',
});`);
}
