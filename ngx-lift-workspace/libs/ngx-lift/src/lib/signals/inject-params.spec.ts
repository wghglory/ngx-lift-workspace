import {Component} from '@angular/core';
import {TestBed} from '@angular/core/testing';
import {provideRouter} from '@angular/router';
import {RouterTestingHarness} from '@angular/router/testing';

import {injectParams} from './inject-params';

describe(injectParams.name, () => {
  it('returns a signal every time the route params change based on the param passed to the function', async () => {
    TestBed.configureTestingModule({
      providers: [provideRouter([{path: 'users/:id', component: UserProfileComponent}])],
    });

    const harness = await RouterTestingHarness.create();

    // Navigate to '/users/derek' and get the component instance
    const instance = await harness.navigateByUrl('/users/derek', UserProfileComponent);

    // Validate the initial params and signals
    expect(instance.params()).toEqual({id: 'derek'});
    expect(instance.userId()).toEqual('derek');
    expect(instance.paramKeysList()).toEqual(['id']);

    // Navigate to '/users/test' and validate the updated params and signals
    await harness.navigateByUrl('/users/test', UserProfileComponent);

    expect(instance.params()).toEqual({id: 'test'});
    expect(instance.userId()).toEqual('test');
    expect(instance.paramKeysList()).toEqual(['id']);
  });
});

@Component({
  standalone: true,
  template: ``,
})
export class UserProfileComponent {
  // Inject route params
  params = injectParams();
  // Inject specific param 'id'
  userId = injectParams('id');
  // Inject transformed params to get the list of keys
  paramKeysList = injectParams((params) => Object.keys(params));
}
