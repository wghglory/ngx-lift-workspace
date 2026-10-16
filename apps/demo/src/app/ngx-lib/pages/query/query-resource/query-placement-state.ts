import {inject, Injectable, signal} from '@angular/core';
import {mutateResource, queryResource} from 'ngx-lift';

import {DatabaseService} from './database.service';
import {UserProfile, UserProfileService} from './user-profile.service';

@Injectable({providedIn: 'root'})
export class AuthStateService {
  private readonly userProfileService = inject(UserProfileService);

  readonly currentUserQuery = queryResource(() => ({
    key: ['current-user'],
    tags: [{type: 'current-user'}],
    loader: () => this.userProfileService.getProfile(),
    staleTime: 60_000,
  }));
  readonly updateProfileMutation = mutateResource(
    (changes: Partial<UserProfile>) => this.userProfileService.updateProfile(changes),
    {
      invalidateTags: [{type: 'current-user'}],
      concurrency: 'exhaust',
    },
  );

  updateName(): void {
    const names = ['Alex Rivera', 'Jordan Lee', 'Taylor Morgan', 'Sam Chen'];
    const current = this.currentUserQuery.value();
    if (!current || this.currentUserQuery.isRefreshing()) return;
    const name = names[(names.indexOf(current.name) + 1) % names.length];
    void this.updateProfileMutation.mutate({name});
  }
}

/** Provided by the demo page, so separate page instances have independent selection. */
@Injectable()
export class DatabaseStateService {
  private readonly databaseService = inject(DatabaseService);

  readonly activeDatabaseId = signal('db-pg-01');
  readonly databases = [
    {id: 'db-pg-01', name: 'Production PostgreSQL'},
    {id: 'db-ch-02', name: 'Analytics ClickHouse'},
    {id: 'db-rd-03', name: 'Session Cache Redis'},
  ];
  readonly databaseDetailsQuery = queryResource(() => {
    const id = this.activeDatabaseId();
    return {
      key: ['databases', id],
      loader: () => this.databaseService.getDatabase(id),
      staleTime: 10_000,
    };
  });

  selectDatabase(id: string): void {
    this.activeDatabaseId.set(id);
  }
}
