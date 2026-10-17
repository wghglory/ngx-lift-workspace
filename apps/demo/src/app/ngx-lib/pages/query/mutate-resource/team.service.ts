import {Injectable, signal} from '@angular/core';

export interface TeamMember {
  id: number;
  name: string;
  role: string;
}

export interface CreateTeamMemberArgs {
  scope: string;
  name: string;
  role: string;
}

/** Page-provided mock transport shared by the table and summary. */
@Injectable()
export class TeamService {
  readonly reads = signal<Record<string, number | undefined>>({});
  private nextId = 3;
  private readonly members = new Map<string, TeamMember[]>([
    [
      'team-a',
      [
        {id: 1, name: 'Alice Smith', role: 'Platform Engineer'},
        {id: 2, name: 'Bob Jones', role: 'Site Reliability Engineer'},
      ],
    ],
    ['team-b', [{id: 1, name: 'Carol Lee', role: 'Product Designer'}]],
  ]);

  async getMembers(scope: string): Promise<TeamMember[]> {
    this.reads.update((reads) => ({...reads, [scope]: (reads[scope] ?? 0) + 1}));
    await new Promise((resolve) => setTimeout(resolve, 350));
    return [...(this.members.get(scope) ?? [])];
  }

  async createMember(args: CreateTeamMemberArgs): Promise<TeamMember> {
    await new Promise((resolve) => setTimeout(resolve, 600));
    const created = {id: this.nextId++, name: args.name, role: args.role};
    this.members.set(args.scope, [...(this.members.get(args.scope) ?? []), created]);
    return created;
  }
}
