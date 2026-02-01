import {ChangeDetectionStrategy, Component, inject, signal} from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {HttpClient} from '@angular/common/http';
import {RouterLink} from '@angular/router';
import {ClarityModule} from '@clr/angular';
import {AlertComponent, CalloutComponent, PageContainerComponent, SpinnerComponent} from 'clr-lift';
import {resourceAsync, ResourceRef} from 'ngx-lift';
import {delay, map, of} from 'rxjs';

import {CodeBlockComponent} from '../../../../shared/components/code-block/code-block.component';
import {UserCardComponent} from '../../../../shared/components/user-card/user-card.component';
import {PaginationResponse} from '../../../../shared/models/pagination.model';
import {User} from '../../../../shared/models/user.model';
import {UserService} from '../../../../shared/services/user.service';
import {highlight} from '../../../../shared/utils/highlight.util';

interface RegistrationPayload {
  username: string;
  password: string;
  email: string;
}

interface RegistrationResponse {
  id: number;
  username: string;
  email: string;
  message: string;
}

@Component({
  selector: 'app-resource-async',
  imports: [
    ClarityModule,
    ReactiveFormsModule,
    RouterLink,
    PageContainerComponent,
    CalloutComponent,
    CodeBlockComponent,
    SpinnerComponent,
    AlertComponent,
    UserCardComponent,
  ],
  templateUrl: './resource-async.component.html',
  styleUrl: './resource-async.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ResourceAsyncComponent {
  private userService = inject(UserService);
  private http = inject(HttpClient);

  // Basic resource - fetch single user (using results=1)
  pageNumber = signal(1);
  user: ResourceRef<User> = resourceAsync(() =>
    this.userService.getUsers({results: 1, page: this.pageNumber()}).pipe(map((res) => res.results[0])),
  );

  // Lazy resource - won't load until reload() is called
  lazyUsers: ResourceRef<PaginationResponse<User>> = resourceAsync(() => this.userService.getUsers({results: 9}), {
    lazy: true,
  });

  // Resource with error handling - simulate error with invalid API call
  userWithFallback: ResourceRef<User> = resourceAsync(
    () => this.http.get<User>('https://randomuser.me/api/invalid-endpoint'),
    {
      lazy: true,
      onError: (error) => {
        console.error('Failed to load user:', error);
        // Return fallback value
        return {
          gender: 'male',
          name: {first: 'Fallback', last: 'User', title: 'Mr'},
          email: 'fallback@example.com',
          picture: {large: 'https://via.placeholder.com/150', medium: '', thumbnail: ''},
          id: {name: '', value: '0'},
          phone: '',
          cell: '',
        } as User;
      },
      onSuccess: (user) => {
        console.log('User loaded:', user);
      },
      onLoading: () => {
        console.log('Loading user...');
      },
    },
  );

  // Registration form
  registrationForm = new FormGroup({
    username: new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(20)]),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(8)]),
  });

  // Registration resource with exhaust + lazy
  registration: ResourceRef<RegistrationResponse> = resourceAsync(
    () => {
      const formValue = this.registrationForm.value;
      const payload: RegistrationPayload = {
        username: formValue.username ?? '',
        email: formValue.email ?? '',
        password: formValue.password ?? '',
      };

      // Simulate API call (replace with real API endpoint)
      // Randomly succeed or fail for demo purposes
      const shouldSucceed = Math.random() > 0.3; // 70% success rate

      return of(null).pipe(
        delay(1500), // Simulate network delay
        map(() => {
          if (!shouldSucceed) {
            throw new Error('Username already exists');
          }
          return {
            id: Math.floor(Math.random() * 1000),
            username: payload.username,
            email: payload.email,
            message: 'Registration successful! Welcome aboard.',
          } as RegistrationResponse;
        }),
      );
    },
    {
      lazy: true, // Don't execute until form submit
      behavior: 'exhaust', // Prevent duplicate submissions
      onSuccess: (response) => {
        console.log('Registration successful:', response);
        // Clear form on success
        setTimeout(() => {
          this.registrationForm.reset();
        }, 2000); // Reset after showing success message
      },
      onError: (error) => {
        console.error('Registration failed:', error);
        return undefined; // Don't provide fallback value - show error
      },
    },
  );

  onRegistrationSubmit() {
    if (this.registrationForm.valid) {
      this.registration.execute(); // Use execute() for POST mutation
    } else {
      // Mark all fields as touched to show validation errors
      Object.keys(this.registrationForm.controls).forEach((key) => {
        this.registrationForm.get(key)?.markAsTouched();
      });
    }
  }

  changeUserId(pageNum: number) {
    this.pageNumber.set(pageNum);
  }

  basicCode = highlight(`
import {resourceAsync} from 'ngx-lift';
import {Component, signal} from '@angular/core';

export class UserDetailComponent {
  userId = signal(1);

  // Automatically fetches when userId changes
  user = resourceAsync(() =>
    this.http.get<User>(\`/api/users/\${this.userId()}\`)
  );
}
  `);

  basicHtmlCode = highlight(`
<!-- Loading state -->
@if (user.isLoading()) {
  <cll-spinner />
}

<!-- Error state -->
@if (user.error(); as error) {
  <cll-alert [error]="error" />
}

<!-- Success state -->
<!-- If you want to keep previous data while loading, you can use the following code: -->
@if (user.value(); as userData) {
  <app-user-card [user]="userData" />
}

<!-- if you want to hide previous data while refetching, you can use the following code: -->
@if (user.status() === 'resolved' && user.value(); as userData) {
  <app-user-card [user]="userData" />
}

<!-- Or check hasValue() for loading while data exists -->
@if (user.hasValue()) {
  <app-user-card [user]="user.value()!" />
  @if (user.isLoading()) {
    <span>Refreshing...</span>
  }
}

<!-- Reload -->
<button class="btn btn-sm" (click)="user.reload()">Reload</button>
    `);

  lazyCode = highlight(`
import {resourceAsync} from 'ngx-lift';
import {Component} from '@angular/core';

export class SearchComponent {
  searchResults = resourceAsync(
    () => this.http.get(\`/api/search?q=\${this.query()}\`),
    {lazy: true} // Won't fetch until reload() is called
  );

  search() {
    this.searchResults.reload(); // Trigger fetch
  }
}
  `);

  errorHandlingCode = highlight(`
import {resourceAsync} from 'ngx-lift';
import {Component} from '@angular/core';

export class UserDetailComponent {
  user = resourceAsync(
    () => this.http.get<User>('/api/user'),
    {
      onError: (error) => {
        console.error('Failed:', error);
        // Return fallback value
        return {name: 'Guest User'};
      },
      onSuccess: (user) => {
        console.log('Loaded:', user);
      },
      onLoading: () => {
        console.log('Loading started');
      }
    }
  );
}
  `);

  exhaustCode = highlight(`
import {resourceAsync} from 'ngx-lift';
import {Component, signal} from '@angular/core';

export class SearchComponent {
  searchTerm = signal('');

  // Exhaust prevents multiple concurrent searches
  searchResults = resourceAsync(
    () => this.http.get(\`/api/search?q=\${this.searchTerm()}\`),
    {
      behavior: 'exhaust', // Ignore new searches while one is in progress
      lazy: true
    }
  );

  search() {
    // If a search is already in progress, this will be ignored
    this.searchResults.reload();
  }
}
  `);

  statusCode = highlight(`
import {resourceAsync} from 'ngx-lift';
import {Component, computed} from '@angular/core';

export class UserDetailComponent {
  user = resourceAsync(() => this.http.get<User>('/api/user'));

  // Use computed() instead of getter for better performance
  statusMessage = computed(() => {
    switch (this.user.status()) {
      case 'idle': return 'Not loaded yet';
      case 'loading': return 'Loading...';
      case 'reloading': return 'Reloading...';
      case 'resolved': return 'Data loaded!';
      case 'error': return 'Failed to load';
    }
  });
}
  `);

  signatureCode = highlight(`
resourceAsync<T, E = Error>(
  sourceFn: () => Observable<T> | Promise<T> | T,
  options?: ResourceRefOptions<T, E>
): ResourceRef<T, E>

interface ResourceRefOptions<T, E = Error> {
  initialValue?: T;
  behavior?: 'switch' | 'exhaust';
  onError?: (error: E) => T | undefined;
  throwOnError?: boolean;
  onSuccess?: (value: T) => void;
  onLoading?: () => void;
  lazy?: boolean;
}

interface ResourceRef<T, E = Error> {
  readonly value: Signal<T | undefined>;
  readonly error: Signal<E | null>;
  readonly status: Signal<ResourceStatus>;
  readonly isLoading: Signal<boolean>;
  readonly hasValue: Signal<boolean>;
  readonly isIdle: Signal<boolean>;
  reload: () => void;        // For read operations (GET)
  execute: () => void;       // For mutations (POST/PUT/DELETE)
}

type ResourceStatus = 'idle' | 'loading' | 'reloading' | 'resolved' | 'error';
  `);

  behaviorCode = highlight(`
import {resourceAsync} from 'ngx-lift';
import {Component, signal} from '@angular/core';

export class UserDetailComponent {
  userId = signal(1);

  // Default 'switch' behavior - cancels previous request
  user = resourceAsync(
    () => this.http.get<User>(\`/api/users/\${this.userId()}\`),
    {behavior: 'switch'} // default
  );
}
  `);

  initialValueCode = highlight(`
import {resourceAsync} from 'ngx-lift';
import {Component, inject} from '@angular/core';
import {HttpClient} from '@angular/common/http';

export class UserDetailComponent {
  private http = inject(HttpClient);

  // Provide initial value from route state or cached data
  user = resourceAsync(
    () => this.http.get<User>('/api/user'),
    {
      initialValue: this.getInitialUser(), // Display immediately
    }
  );

  private getInitialUser(): User | undefined {
    // Could come from router state, local storage, etc.
    return history.state?.user;
  }
}
  `);

  throwOnErrorCode = highlight(`
import {resourceAsync} from 'ngx-lift';
import {Component, inject, input} from '@angular/core';
import {HttpClient} from '@angular/common/http';

export class UserDetailComponent {
  private http = inject(HttpClient);
  userId = input.required<number>();

  user = resourceAsync(
    () => this.http.get<User>(\`/api/users/\${this.userId()}\`),
    {
      throwOnError: true,  // Errors will propagate up
      onError: (error) => {
        console.error('API Error:', error);
        // Can still log but error will still throw
        return undefined;
      }
    }
  );
}
  `);

  registrationCode = highlight(`
import {resourceAsync} from 'ngx-lift';
import {Component, inject, signal} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {HttpClient} from '@angular/common/http';

interface RegistrationPayload {
  username: string;
  password: string;
  email: string;
}

interface RegistrationResponse {
  id: number;
  username: string;
  message: string;
}

export class RegistrationComponent {
  private http = inject(HttpClient);

  // Form controls
  form = new FormGroup({
    username: new FormControl('', [Validators.required, Validators.minLength(3)]),
    password: new FormControl('', [Validators.required, Validators.minLength(8)]),
    email: new FormControl('', [Validators.required, Validators.email])
  });

  // Registration resource with exhaust + lazy
  registration = resourceAsync(
    () => {
      const payload: RegistrationPayload = {
        username: this.form.value.username!,
        password: this.form.value.password!,
        email: this.form.value.email!
      };
      return this.http.post<RegistrationResponse>('/api/register', payload);
    },
    {
      lazy: true,  // Don't execute until explicitly called
      behavior: 'exhaust',  // Prevent duplicate submissions
      onSuccess: (response) => {
        console.log('Registration successful:', response);
        this.form.reset();  // Clear form on success
      },
      onError: (error) => {
        console.error('Registration failed:', error);
        // Could set form errors here
      }
    }
  );

  onSubmit() {
    if (this.form.valid) {
      this.registration.execute();  // Use execute() for mutations
    }
  }
}
  `);

  registrationHtmlCode = highlight(`
<form clrForm [formGroup]="registrationForm" (ngSubmit)="onRegistrationSubmit()">
  @if (registration.status() === 'resolved' && registration.value(); as response) {
    <cll-alert [content]="response.message" [alertType]="'success'" cds-layout="m-t:md" />
  }
  @if (registration.status() === 'error' && registration.error(); as error) {
    <cll-alert [content]="'Registration failed: ' + error.message" [alertType]="'danger'" cds-layout="m-t:md" />
  }

  <clr-input-container>
    <label for="username" class="clr-required-mark">Username</label>
    <input id="username" clrInput formControlName="username" placeholder="Enter username (3-20 chars)" />
    <clr-control-error>Username must be 3-20 characters</clr-control-error>
  </clr-input-container>

  <clr-input-container>
    <label for="email" class="clr-required-mark">Email</label>
    <input id="email" clrInput type="email" formControlName="email" placeholder="Enter your email" />
    <clr-control-error>Please enter a valid email</clr-control-error>
  </clr-input-container>

  <clr-password-container>
    <label for="password" class="clr-required-mark">Password</label>
    <input id="password" clrPassword formControlName="password" placeholder="Enter password (min 8 chars)" />
    <clr-control-error>Password must be at least 8 characters</clr-control-error>
  </clr-password-container>

  <div cds-layout="m-t:md">
    <button
      class="btn btn-primary"
      type="submit"
      [disabled]="registration.isLoading()"
      [clrLoading]="registration.isLoading()"
    >
      Register
    </button>
  </div>
</form>
  `);
}
