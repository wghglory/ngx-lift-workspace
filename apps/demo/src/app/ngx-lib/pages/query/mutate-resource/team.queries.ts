import {QueryDefinition} from 'ngx-lift';

import {TeamService, TeamMember} from './team.service';

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
    staleTime: 60_000,
    // The simulated server belongs to this page instance; retain data only while it is observed.
    gcTime: 0,
    loader: () => teamService.getMembers(scope),
  };
}
