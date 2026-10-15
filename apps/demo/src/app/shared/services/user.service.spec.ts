import {provideHttpClient} from '@angular/common/http';
import {HttpTestingController, provideHttpClientTesting} from '@angular/common/http/testing';
import {TestBed} from '@angular/core/testing';
import {firstValueFrom} from 'rxjs';
import {UserService} from './user.service';

describe('UserService HTTP demos', () => {
  beforeEach(() => TestBed.configureTestingModule({providers: [provideHttpClient(), provideHttpClientTesting()]}));
  afterEach(() => TestBed.inject(HttpTestingController).verify());

  it('requests users with the supplied parameters and preserves API portraits', async () => {
    const result = firstValueFrom(TestBed.inject(UserService).getUsers({results: 9, page: 2, seed: 'demo'}));
    const request = TestBed.inject(HttpTestingController).expectOne((req) => req.url === 'https://randomuser.me/api');
    expect(request.request.params.get('results')).toBe('9');
    expect(request.request.params.get('page')).toBe('2');
    expect(request.request.params.get('seed')).toBe('demo');
    const users = [{picture: {thumbnail: 'https://randomuser.me/api/portraits/thumb/women/1.jpg'}}];
    request.flush({results: users, info: {page: 2, results: 9, seed: 'demo', version: '1'}});
    const response = await result;
    expect(response.results).toEqual(users);
    expect(response.info.total).toBe(100);
  });

  it('propagates HTTP errors instead of silently substituting local users', async () => {
    const result = firstValueFrom(TestBed.inject(UserService).getUsers());
    const rejection = expect(result).rejects.toMatchObject({status: 503});
    TestBed.inject(HttpTestingController).expectOne('https://randomuser.me/api').flush('Unavailable', {
      status: 503,
      statusText: 'Service Unavailable',
    });
    await rejection;
  });
});
