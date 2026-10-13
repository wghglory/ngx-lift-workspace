import {provideHttpClient} from '@angular/common/http';
import {HttpTestingController, provideHttpClientTesting} from '@angular/common/http/testing';
import {TestBed} from '@angular/core/testing';
import {firstValueFrom} from 'rxjs';
import {DEMO_LIVE_USERS, UserService} from './user.service';

describe('Deterministic user demos', () => {
  beforeEach(() => TestBed.configureTestingModule({providers: [provideHttpClient(), provideHttpClientTesting()]}));
  it('paginates and filters local fixtures without any network request', async () => {
    const service = TestBed.inject(UserService);
    const first = await firstValueFrom(service.getUsers({results: 2}));
    const second = await firstValueFrom(service.getUsers({pageSize: 2, page: 2}));
    expect(first.results[0].id.value).not.toBe(second.results[0].id.value);
    const filtered = await firstValueFrom(service.getUsers({filter: 'firstName==*Alex*'}));
    expect(filtered.info.total).toBe(25);
    expect(filtered.results.every((user) => user.name.first === 'Alex')).toBe(true);
    TestBed.inject(HttpTestingController).expectNone('https://randomuser.me/api');
  });
  it('supports an explicit live HTTP example', async () => {
    TestBed.overrideProvider(DEMO_LIVE_USERS, {useValue: true});
    const result = firstValueFrom(TestBed.inject(UserService).getUsers({results: 1}));
    TestBed.inject(HttpTestingController)
      .expectOne((request) => request.url === 'https://randomuser.me/api')
      .flush({results: [], info: {page: 1, results: 1, seed: 'live', version: '1'}});
    expect((await result).info.total).toBe(100);
  });
});
