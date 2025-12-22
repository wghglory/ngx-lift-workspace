import {Component, numberAttribute} from '@angular/core';
import {TestBed} from '@angular/core/testing';
import {provideRouter} from '@angular/router';
import {RouterTestingHarness} from '@angular/router/testing';

import {injectQueryParams} from './inject-query-params';

@Component({
  standalone: true,
  template: ``,
})
export class SearchComponent {
  queryParams = injectQueryParams();
  idParam = injectQueryParams('id', {transform: numberAttribute});
  searchParam = injectQueryParams('query');
  paramKeysList = injectQueryParams((params) => Object.keys(params));
}

describe(injectQueryParams.name, () => {
  beforeEach(async () => {
    TestBed.configureTestingModule({
      providers: [provideRouter([{path: 'search', component: SearchComponent}])],
    });
  });

  it('returns a signal every time the query params change based on the param passed to the fn and transform fn', async () => {
    const harness = await RouterTestingHarness.create();

    const instance = await harness.navigateByUrl('/search?query=Hello', SearchComponent);

    expect(instance.queryParams()).toEqual({query: 'Hello'});
    expect(instance.searchParam()).toEqual('Hello');
    expect(instance.idParam()).toEqual(null);
    expect(instance.paramKeysList()).toEqual(['query']);

    await harness.navigateByUrl('/search?query=Hello&id=2');

    expect(instance.queryParams()).toEqual({query: 'Hello', id: '2'});
    expect(instance.idParam()).toEqual(2);
    expect(instance.searchParam()).toEqual('Hello');
    expect(instance.paramKeysList()).toEqual(['query', 'id']);
  });

  it('returns a signal every time the query params change with number', async () => {
    const harness = await RouterTestingHarness.create();

    const instance = await harness.navigateByUrl('/search?id=Hello', SearchComponent);

    expect(instance.queryParams()).toEqual({id: 'Hello'});
    expect(instance.idParam()).toEqual(NaN);
    expect(instance.paramKeysList()).toEqual(['id']);

    await harness.navigateByUrl('/search?&id=1.1');

    expect(instance.queryParams()).toEqual({id: '1.1'});
    expect(instance.idParam()).toEqual(1.1);
    expect(instance.paramKeysList()).toEqual(['id']);
  });

  it('returns a signal for a single query parameter', async () => {
    const harness = await RouterTestingHarness.create();
    const instance = await harness.navigateByUrl('/search?query=Hello', SearchComponent);

    expect(instance.queryParams()).toEqual({query: 'Hello'});
    expect(instance.searchParam()).toEqual('Hello');
    expect(instance.idParam()).toEqual(null);
    expect(instance.paramKeysList()).toEqual(['query']);
  });

  it('returns a signal for numeric query parameters', async () => {
    const harness = await RouterTestingHarness.create();
    const instance = await harness.navigateByUrl('/search?id=2', SearchComponent);

    expect(instance.queryParams()).toEqual({id: '2'});
    expect(instance.idParam()).toEqual(2);
    expect(instance.paramKeysList()).toEqual(['id']);
  });

  it('returns a signal for query parameters with special characters', async () => {
    const harness = await RouterTestingHarness.create();
    const instance = await harness.navigateByUrl('/search?query=Hello%20World', SearchComponent);

    expect(instance.queryParams()).toEqual({query: 'Hello World'});
    expect(instance.searchParam()).toEqual('Hello World');
    expect(instance.paramKeysList()).toEqual(['query']);
  });

  it('returns a signal for query parameters with no transform', async () => {
    const harness = await RouterTestingHarness.create();
    const instance = await harness.navigateByUrl('/search?query=Hello', SearchComponent);

    expect(instance.queryParams()).toEqual({query: 'Hello'});
    expect(instance.searchParam()).toEqual('Hello');
    expect(instance.paramKeysList()).toEqual(['query']);
  });

  it('returns a signal for query parameters with multi ids', async () => {
    const harness = await RouterTestingHarness.create();
    const instance = await harness.navigateByUrl('/search?id=[1,2]', SearchComponent);

    expect(instance.queryParams()).toEqual({id: '[1,2]'});
    expect(JSON.parse(instance.queryParams()['id'])).toEqual([1, 2]);
    expect(instance.searchParam()).toEqual(null);
    expect(instance.idParam()).toEqual(NaN);
    expect(instance.paramKeysList()).toEqual(['id']);
  });
});
