import {HttpClient} from '@angular/common/http';
import {inject, Injectable, InjectionToken} from '@angular/core';
import {Params} from '@angular/router';
import {BehaviorSubject, map, of} from 'rxjs';

import {PaginationResponse} from '../models/pagination.model';
import {User} from '../models/user.model';
import {demoUsers} from './demo-users';

/** Opt into the external API only when demonstrating real HTTP transport. */
export const DEMO_LIVE_USERS = new InjectionToken<boolean>('DEMO_LIVE_USERS', {
  providedIn: 'root',
  factory: () => false,
});

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private http = inject(HttpClient);
  private live = inject(DEMO_LIVE_USERS);

  private refreshBS = new BehaviorSubject<undefined | void>(undefined);
  refresh$ = this.refreshBS.asObservable();

  refreshList() {
    this.refreshBS.next();
  }

  getUsers(params?: Params) {
    if (!this.live) {
      let users = demoUsers();
      const firstName = String(params?.['filter'] ?? '').match(/firstName==\*([^*]*)\*/)?.[1];
      if (firstName) users = users.filter((user) => user.name.first.toLowerCase().includes(firstName.toLowerCase()));
      const size = Math.max(1, Math.min(100, Number(params?.['pageSize'] ?? params?.['results']) || 10));
      const page = Math.max(1, Number(params?.['page']) || 1);
      return of<PaginationResponse<User>>({
        results: users.slice((page - 1) * size, page * size),
        info: {page, results: size, seed: 'local', version: '1', total: users.length},
      });
    }
    return this.http
      .get<PaginationResponse<User>>(`https://randomuser.me/api`, {params})
      .pipe(map((res) => ({...res, info: {...res.info, total: 100}}) as PaginationResponse<User>)); // fake resultTotal 100
  }
}
