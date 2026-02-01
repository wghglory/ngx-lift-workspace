import {
  ChangeDetectionStrategy,
  Component,
  inject,
  Injector,
  runInInjectionContext,
  signal,
  untracked,
} from '@angular/core';
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

interface Todo {
  id: number;
  title: string;
  completed: boolean;
}

interface CacheUser {
  id: number;
  name: string;
  email: string;
}

interface Item {
  id: string;
  orgId: string;
  name: string;
  status: 'active' | 'inactive';
}

interface Organization {
  id: string;
  name: string;
  type: string;
  location: string;
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
  private injector = inject(Injector);

  // Basic resource - fetch single user (using results=1)
  pageNumber = signal(1);
  userRef: ResourceRef<User> = resourceAsync(() =>
    this.userService.getUsers({results: 1, page: this.pageNumber()}).pipe(map((res) => res.results[0])),
  );

  // Lazy resource - won't load until reload() is called
  lazyUsersRef: ResourceRef<PaginationResponse<User>> = resourceAsync(() => this.userService.getUsers({results: 9}), {
    lazy: true,
  });

  // Resource with error handling - simulate error with invalid API call
  userWithFallbackRef: ResourceRef<User> = resourceAsync(
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
  registrationRef: ResourceRef<RegistrationResponse> = resourceAsync(
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

  // ============================================================================
  // WritableResourceRef Examples (New!)
  // ============================================================================

  // Example 1: Optimistic Update - Todo Toggle
  todoId = signal(1);
  todoRef = resourceAsync(
    () =>
      of({
        id: this.todoId(),
        title: 'Learn WritableResourceRef',
        completed: false,
      }).pipe(delay(500)),
    {lazy: true},
  );

  toggleTodo() {
    // Optimistic update - UI updates immediately
    this.todoRef.update((todo) => ({...todo, completed: !todo.completed}));

    // Simulate API call
    of(null)
      .pipe(delay(1000))
      .subscribe({
        next: () => {
          console.log('Todo updated successfully');
          // Optionally reload to get server state
          // this.todoRef.reload();
        },
        error: () => {
          // Revert on error
          this.todoRef.update((todo) => ({...todo, completed: !todo.completed}));
          alert('Failed to update todo');
        },
      });
  }

  // Example 2: Cache-First Pattern
  cacheFirstUserId = signal(1);
  cacheFirstUserRef = resourceAsync(
    () =>
      of({
        id: this.cacheFirstUserId(),
        name: `Fresh User ${this.cacheFirstUserId()}`,
        email: `fresh${this.cacheFirstUserId()}@example.com`,
      }).pipe(delay(1500)), // Slow API
    {lazy: true},
  );

  loadCacheFirstUser() {
    // Simulate cached data
    const cachedUser = {
      id: this.cacheFirstUserId(),
      name: `Cached User ${this.cacheFirstUserId()}`,
      email: `cached${this.cacheFirstUserId()}@example.com`,
    };

    // Set cached data immediately
    this.cacheFirstUserRef.set(cachedUser);

    // Fetch fresh data in background
    this.cacheFirstUserRef.reload();
  }

  // Example 3: Form Draft - Counter
  counterRef = resourceAsync(
    () => of(0).pipe(delay(300)), // Initial value from server
    {lazy: true},
  );

  incrementCounter() {
    this.counterRef.update((count) => count + 1);
  }

  decrementCounter() {
    this.counterRef.update((count) => count - 1);
  }

  saveCounter() {
    // Simulate save
    of(null)
      .pipe(delay(500))
      .subscribe({
        next: () => {
          alert(`Counter saved: ${this.counterRef.value()}`);
          // After save, reload to get server state
          this.counterRef.reload();
        },
        error: () => {
          alert('Failed to save counter');
        },
      });
  }

  discardCounterChanges() {
    this.counterRef.reload();
  }

  // ============================================================================
  // Nested Resource Pattern Example
  // ============================================================================
  //
  // This demonstrates managing outer (list) + inner (detail) resources where
  // each item can fetch additional related data with independent loading/error states.

  // Outer resource: List of items
  itemsRef = resourceAsync(() =>
    of([
      {id: '1', orgId: 'org-1', name: 'Project Alpha', status: 'active'},
      {id: '2', orgId: 'org-2', name: 'Project Beta', status: 'active'},
      {id: '3', orgId: 'org-1', name: 'Project Gamma', status: 'inactive'},
    ] as Item[]).pipe(delay(800)),
  );

  // Mock organizations
  private mockOrgs: Record<string, Organization> = {
    'org-1': {id: 'org-1', name: 'Acme Corp', type: 'Enterprise', location: 'SF, CA'},
    'org-2': {id: 'org-2', name: 'TechStart Inc', type: 'Startup', location: 'Austin, TX'},
  };

  // Inner resources: Map of orgId -> ResourceRef<Organization>
  // This map caches created resources to avoid recreating them
  private orgRefsMap = new Map<string, ResourceRef<Organization>>();

  /**
   * Get or create a resource for the given orgId.
   * Called from template during change detection.
   *
   * IMPORTANT: This method requires two wrappers:
   *
   * 1. untracked() - Prevents NG0602 error (effect() in reactive context)
   *    - When called from template, we're in a reactive context (signal tracking)
   *    - resourceAsync() uses effect() internally, which can't be created during tracking
   *    - untracked() breaks out of the reactive context
   *
   * 2. runInInjectionContext() - Prevents NG0203 error (no injection context)
   *    - Template method calls happen outside the component's injection context
   *    - resourceAsync() uses inject() internally
   *    - runInInjectionContext() provides the needed injection context
   *
   * Pattern: Template-called lazy resource creation
   */
  getOrgRef(orgId: string): ResourceRef<Organization> {
    // Break out of reactive context to avoid NG0602 (effect in reactive context)
    return untracked(() => {
      let orgRef = this.orgRefsMap.get(orgId);
      if (!orgRef) {
        // Provide injection context to avoid NG0203 (inject outside context)
        orgRef = runInInjectionContext(this.injector, () =>
          resourceAsync(
            () =>
              of(this.mockOrgs[orgId] || {id: orgId, name: 'Unknown', type: 'Unknown', location: 'Unknown'}).pipe(
                delay(600),
                map((org) => {
                  // Simulate random errors (30% chance)
                  if (Math.random() < 0.3) {
                    throw new Error('Network timeout');
                  }
                  return org;
                }),
              ),
            {lazy: true}, // Don't fetch until explicitly triggered via reload()
          ),
        );
        this.orgRefsMap.set(orgId, orgRef);
      }
      return orgRef;
    });
  }

  loadOrg(orgId: string) {
    this.getOrgRef(orgId).reload();
  }

  loadAllOrgs() {
    const items = this.itemsRef.value() ?? [];
    const uniqueOrgIds = new Set(items.map((item) => item.orgId));
    uniqueOrgIds.forEach((orgId) => this.loadOrg(orgId));
  }

  onRegistrationSubmit() {
    if (this.registrationForm.valid) {
      this.registrationRef.execute(); // Use execute() for POST mutation
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
  userRef = resourceAsync(() =>
    this.http.get<User>(\`/api/users/\${this.userId()}\`)
  );
}
  `);

  basicHtmlCode = highlight(`
<!-- Loading state -->
@if (userRef.isLoading()) {
  <cll-spinner />
}

<!-- Error state -->
@if (userRef.error(); as error) {
  <cll-alert [error]="error" />
}

<!-- Success state -->
<!-- If you want to keep previous data while loading, you can use the following code: -->
@if (userRef.value(); as userData) {
  <app-user-card [user]="userData" />
}

<!-- if you want to hide previous data while refetching, you can use the following code: -->
@if (userRef.status() === 'resolved' && userRef.value(); as userData) {
  <app-user-card [user]="userData" />
}

<!-- Or check hasValue() for loading while data exists -->
@if (userRef.hasValue()) {
  <app-user-card [user]="userRef.value()!" />
  @if (userRef.isLoading()) {
    <span>Refreshing...</span>
  }
}

<!-- Reload -->
<button class="btn btn-sm" (click)="userRef.reload()">Reload</button>
    `);

  lazyCode = highlight(`
import {resourceAsync} from 'ngx-lift';
import {Component} from '@angular/core';

export class SearchComponent {
  searchResultsRef = resourceAsync(
    () => this.http.get(\`/api/search?q=\${this.query()}\`),
    {lazy: true} // Won't fetch until reload() is called
  );

  search() {
    this.searchResultsRef.reload(); // Trigger fetch
  }
}
  `);

  errorHandlingCode = highlight(`
import {resourceAsync} from 'ngx-lift';
import {Component} from '@angular/core';

export class UserDetailComponent {
  userRef = resourceAsync(
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
  searchResultsRef = resourceAsync(
    () => this.http.get(\`/api/search?q=\${this.searchTerm()}\`),
    {
      behavior: 'exhaust', // Ignore new searches while one is in progress
      lazy: true
    }
  );

  search() {
    // If a search is already in progress, this will be ignored
    this.searchResultsRef.reload();
  }
}
  `);

  statusCode = highlight(`
import {resourceAsync} from 'ngx-lift';
import {Component, computed} from '@angular/core';

export class UserDetailComponent {
  userRef = resourceAsync(() => this.http.get<User>('/api/user'));

  // Use computed() instead of getter for better performance
  statusMessage = computed(() => {
    switch (this.userRef.status()) {
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
  readonly value: Signal<T>;              // Always returns T (with initialValue fallback)
  readonly error: Signal<E | null>;
  readonly status: Signal<ResourceStatus>;
  readonly isLoading: Signal<boolean>;
  readonly isIdle: Signal<boolean>;        - ngx-lift extension
  hasValue(): this is ResourceRef<Exclude<T, undefined>, E>;  // Type predicate method
  reload(): boolean;                      // Returns true if initiated, for read operations (GET)
  execute(): boolean;                     // Alias for reload() - for mutations (POST/PUT/DELETE)
}

type ResourceStatus = 'idle' | 'loading' | 'reloading' | 'resolved' | 'error';
  `);

  behaviorCode = highlight(`
import {resourceAsync} from 'ngx-lift';
import {Component, signal} from '@angular/core';

export class UserDetailComponent {
  userId = signal(1);

  // Default 'switch' behavior - cancels previous request
  userRef = resourceAsync(
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
  userRef = resourceAsync(
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

  userRef = resourceAsync(
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
  registrationRef = resourceAsync(
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
      this.registrationRef.execute();  // Use execute() for mutations
    }
  }
}
  `);

  registrationHtmlCode = highlight(`
<form clrForm [formGroup]="registrationForm" (ngSubmit)="onRegistrationSubmit()">
  @if (registrationRef.hasValue()) {
    <cll-alert [content]="registrationRef.value().message" [alertType]="'success'" cds-layout="m-t:md" />
  }
  @if (registrationRef.error(); as error) {
    <cll-alert [content]="'Registration failed: ' + error" [alertType]="'danger'" cds-layout="m-t:md" />
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
      [disabled]="registrationRef.isLoading()"
      [clrLoading]="registrationRef.isLoading()"
    >
      Register
    </button>
  </div>
</form>
  `);

  // ============================================================================
  // WritableResourceRef Code Blocks
  // ============================================================================

  optimisticUpdateCode = highlight(`
import {resourceAsync} from 'ngx-lift';
import {Component, inject, signal} from '@angular/core';
import {HttpClient} from '@angular/common/http';

export class TodoComponent {
  private http = inject(HttpClient);
  todoId = signal(1);

  todoRef = resourceAsync(() => 
    this.http.get<Todo>(\`/api/todos/\${this.todoId()}\`)
  );

  toggleTodo() {
    // 1. Update UI immediately (optimistic)
    this.todoRef.update(todo => ({ ...todo, completed: !todo.completed }));

    // 2. Send to server
    this.http.put(\`/api/todos/\${this.todoId()}\`, this.todoRef.value())
      .subscribe({
        next: () => {
          console.log('Todo updated successfully');
        },
        error: () => {
          // Revert on error
          this.todoRef.update(todo => ({ ...todo, completed: !todo.completed }));
          alert('Failed to update todo');
        }
      });
  }
}
  `);

  cacheFirstCode = highlight(`
import {resourceAsync} from 'ngx-lift';
import {Component, inject, signal} from '@angular/core';
import {HttpClient} from '@angular/common/http';

export class UserProfileComponent {
  private http = inject(HttpClient);
  userId = signal(1);

  userRef = resourceAsync(
    () => this.http.get<User>(\`/api/users/\${this.userId()}\`),
    { lazy: true }
  );

  loadUser() {
    // 1. Set cached data immediately (from localStorage, router state, etc.)
    const cachedUser = localStorage.getItem('user');
    if (cachedUser) {
      this.userRef.set(JSON.parse(cachedUser)); // Status: local
    }

    // 2. Fetch fresh data in background
    this.userRef.reload(); // Status: reloading → resolved
  }
}

// Template shows cached data immediately, updates when fresh data arrives
  `);

  formDraftCode = highlight(`
import {resourceAsync} from 'ngx-lift';
import {Component, inject} from '@angular/core';
import {HttpClient} from '@angular/common/http';

export class CounterComponent {
  private http = inject(HttpClient);

  counterRef = resourceAsync(
    () => this.http.get<number>('/api/counter'),
    { lazy: true }
  );

  incrementCounter() {
    this.counterRef.update(count => count + 1); // Status: local
  }

  decrementCounter() {
    this.counterRef.update(count => count - 1); // Status: local
  }

  saveCounter() {
    this.http.put('/api/counter', { value: this.counterRef.value() })
      .subscribe({
        next: () => {
          alert('Counter saved!');
          this.counterRef.reload(); // Get server state
        },
        error: () => alert('Failed to save')
      });
  }

  discardChanges() {
    this.counterRef.reload(); // Revert to server state
  }
}

// Show "Unsaved changes" when status === 'local'
  `);

  nestedResourceCode = highlight(`
import {resourceAsync, ResourceRef} from 'ngx-lift';
import {Component, inject, Injector, runInInjectionContext, untracked} from '@angular/core';
import {HttpClient} from '@angular/common/http';

export class ProjectListComponent {
  private http = inject(HttpClient);
  private injector = inject(Injector);

  // Outer resource: List of projects
  projectsRef = resourceAsync(() => 
    this.http.get<Project[]>('/api/projects')
  );

  // Inner resources: Map of orgId -> ResourceRef<Organization>
  private orgRefsMap = new Map<string, ResourceRef<Organization>>();

  /**
   * Get or create a resource for the given orgId.
   * Called from template during change detection.
   * 
   * REQUIRES TWO WRAPPERS:
   * 1. untracked() - Prevents NG0602 (effect in reactive context)
   * 2. runInInjectionContext() - Prevents NG0203 (no injection context)
   */
  getOrgRef(orgId: string): ResourceRef<Organization> {
    return untracked(() => {  // Break out of reactive context
      let orgRef = this.orgRefsMap.get(orgId);
      if (!orgRef) {
        orgRef = runInInjectionContext(this.injector, () =>  // Provide injection context
          resourceAsync(
            () => this.http.get<Organization>(\`/api/orgs/\${orgId}\`),
            { lazy: true }
          )
        );
        this.orgRefsMap.set(orgId, orgRef);
      }
      return orgRef;
    });
  }

  loadOrg(orgId: string) {
    this.getOrgRef(orgId).reload();
  }
}
  `);

  nestedResourceHtmlCode = highlight(`
<table class="table">
  <tbody>
    @for (project of projectsRef.value(); track project.id) {
      <tr>
        <td>{{ project.name }}</td>
        <td>
          @if (getOrgRef(project.orgId); as orgRef) {
            <!-- Loading state for THIS row only -->
            @if (orgRef.isLoading()) {
              <cll-spinner size="xs" />
            }

            <!-- Error state for THIS row only -->
            @if (orgRef.error(); as error) {
              <cll-alert [content]="error" [compact]="true" />
              <button (click)="orgRef.reload()">Retry</button>
            }

            <!-- Success state -->
            @if (orgRef.hasValue()) {
              <strong>{{ orgRef.value().name }}</strong>
            }
          }
        </td>
        <td>
          <button (click)="loadOrg(project.orgId)">Load Org</button>
        </td>
      </tr>
    }
  </tbody>
</table>
  `);
}
