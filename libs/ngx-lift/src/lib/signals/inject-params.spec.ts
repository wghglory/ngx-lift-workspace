import {Component} from '@angular/core';
import {TestBed} from '@angular/core/testing';
import {provideRouter} from '@angular/router';
import {RouterTestingHarness} from '@angular/router/testing';
import {numberAttribute} from '@angular/core';

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

  it('should return null when param is missing', async () => {
    TestBed.configureTestingModule({
      providers: [provideRouter([{path: 'users', component: MissingParamComponent}])],
    });

    const harness = await RouterTestingHarness.create();
    const instance = await harness.navigateByUrl('/users', MissingParamComponent);

    expect(instance.missingParam()).toBeNull();
  });

  it('should use initialValue when param is missing', async () => {
    TestBed.configureTestingModule({
      providers: [provideRouter([{path: 'users', component: InitialValueComponent}])],
    });

    const harness = await RouterTestingHarness.create();
    const instance = await harness.navigateByUrl('/users', InitialValueComponent);

    expect(instance.paramWithInitial()).toBe('default');
  });

  it('should transform string to number with transform and initialValue', async () => {
    TestBed.configureTestingModule({
      providers: [provideRouter([{path: 'users/:id', component: NumberTransformComponent}])],
    });

    const harness = await RouterTestingHarness.create();
    const instance = await harness.navigateByUrl('/users/123', NumberTransformComponent);

    expect(instance.userIdNumber()).toBe(123);
  });

  it('should transform string to number with transform but no initialValue', async () => {
    TestBed.configureTestingModule({
      providers: [provideRouter([{path: 'users/:id', component: NumberTransformOptionalComponent}])],
    });

    const harness = await RouterTestingHarness.create();
    const instance = await harness.navigateByUrl('/users/456', NumberTransformOptionalComponent);

    expect(instance.userIdNumber()).toBe(456);
  });

  it('should return null when param is missing with transform but no initialValue', async () => {
    TestBed.configureTestingModule({
      providers: [provideRouter([{path: 'users', component: NumberTransformOptionalComponent}])],
    });

    const harness = await RouterTestingHarness.create();
    const instance = await harness.navigateByUrl('/users', NumberTransformOptionalComponent);

    expect(instance.userIdNumber()).toBeNull();
  });

  it('should transform string to boolean with transform and initialValue', async () => {
    TestBed.configureTestingModule({
      providers: [provideRouter([{path: 'users/:active', component: BooleanTransformComponent}])],
    });

    const harness = await RouterTestingHarness.create();
    const instance = await harness.navigateByUrl('/users/true', BooleanTransformComponent);

    expect(instance.isActive()).toBe(true);
  });

  it('should use custom transform function', async () => {
    TestBed.configureTestingModule({
      providers: [provideRouter([{path: 'users/:id', component: CustomTransformComponent}])],
    });

    const harness = await RouterTestingHarness.create();
    const instance = await harness.navigateByUrl('/users/hello', CustomTransformComponent);

    expect(instance.transformedParam()).toBe('HELLO');
  });

  it('should work with params transform function', async () => {
    TestBed.configureTestingModule({
      providers: [provideRouter([{path: 'users/:id/:name', component: ParamsTransformComponent}])],
    });

    const harness = await RouterTestingHarness.create();
    const instance = await harness.navigateByUrl('/users/123/john', ParamsTransformComponent);

    expect(instance.fullPath()).toBe('123-john');
  });

  it('should return param value without transform when param exists', async () => {
    TestBed.configureTestingModule({
      providers: [provideRouter([{path: 'users/:id', component: StringParamComponent}])],
    });

    const harness = await RouterTestingHarness.create();
    const instance = await harness.navigateByUrl('/users/test123', StringParamComponent);

    expect(instance.userId()).toBe('test123');
  });

  it('should handle boolean transform without initialValue', async () => {
    TestBed.configureTestingModule({
      providers: [provideRouter([{path: 'users/:active', component: BooleanTransformOptionalComponent}])],
    });

    const harness = await RouterTestingHarness.create();
    const instance = await harness.navigateByUrl('/users/true', BooleanTransformOptionalComponent);

    expect(instance.isActive()).toBe(true);
  });

  it('should return null for boolean transform without initialValue when param is missing', async () => {
    TestBed.configureTestingModule({
      providers: [provideRouter([{path: 'users', component: BooleanTransformOptionalComponent}])],
    });

    const harness = await RouterTestingHarness.create();
    const instance = await harness.navigateByUrl('/users', BooleanTransformOptionalComponent);

    expect(instance.isActive()).toBeNull();
  });

  it('should handle string transform without initialValue', async () => {
    TestBed.configureTestingModule({
      providers: [provideRouter([{path: 'users/:id', component: StringTransformOptionalComponent}])],
    });

    const harness = await RouterTestingHarness.create();
    const instance = await harness.navigateByUrl('/users/hello', StringTransformOptionalComponent);

    expect(instance.transformedId()).toBe('HELLO');
  });

  it('should return null for string transform without initialValue when param is missing', async () => {
    TestBed.configureTestingModule({
      providers: [provideRouter([{path: 'users', component: StringTransformOptionalComponent}])],
    });

    const harness = await RouterTestingHarness.create();
    const instance = await harness.navigateByUrl('/users', StringTransformOptionalComponent);

    expect(instance.transformedId()).toBeNull();
  });
});

@Component({
  template: ``,
})
export class UserProfileComponent {
  params = injectParams();
  userId = injectParams('id');
  paramKeysList = injectParams((params) => Object.keys(params));
}

@Component({
  template: ``,
})
export class MissingParamComponent {
  missingParam = injectParams('nonexistent');
}

@Component({
  template: ``,
})
export class InitialValueComponent {
  paramWithInitial = injectParams('nonexistent', {initialValue: 'default'});
}

@Component({
  template: ``,
})
export class NumberTransformComponent {
  userIdNumber = injectParams('id', {transform: numberAttribute, initialValue: 0});
}

@Component({
  template: ``,
})
export class NumberTransformOptionalComponent {
  userIdNumber = injectParams('id', {transform: numberAttribute});
}

@Component({
  template: ``,
})
export class BooleanTransformComponent {
  isActive = injectParams('active', {
    transform: (v: string) => v === 'true',
    initialValue: false,
  });
}

@Component({
  template: ``,
})
export class CustomTransformComponent {
  transformedParam = injectParams('id', {
    transform: (v: string) => v.toUpperCase(),
    initialValue: '',
  });
}

@Component({
  template: ``,
})
export class ParamsTransformComponent {
  fullPath = injectParams((params) => `${params['id']}-${params['name']}`);
}

@Component({
  template: ``,
})
export class StringParamComponent {
  userId = injectParams('id');
}

@Component({
  template: ``,
})
export class BooleanTransformOptionalComponent {
  isActive = injectParams('active', {
    transform: (v: string) => v === 'true',
  });
}

@Component({
  template: ``,
})
export class StringTransformOptionalComponent {
  transformedId = injectParams('id', {
    transform: (v: string) => v.toUpperCase(),
  });
}
