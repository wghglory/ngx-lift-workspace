import {ChangeDetectionStrategy, Component, computed, effect, inject, Injector, signal, untracked} from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {HttpClient} from '@angular/common/http';
import {ClarityModule} from '@clr/angular';
import {ClarityIcons, minusIcon, plusIcon} from '@clr/angular/icon';
import {
  AlertComponent,
  CalloutComponent,
  PageContainerComponent,
  SpinnerComponent,
  TranslatePipe,
  TranslationService,
} from 'clr-lift';
import {resourceAsync, ResourceRef} from 'ngx-lift';
import {delay, map, of} from 'rxjs';

import {ApiProperty, ApiTableComponent} from '../../../../shared/components/api-table';
import {CodeBlockComponent} from '../../../../shared/components/code-block/code-block.component';
import {DemoPlaygroundComponent} from '../../../../shared/components/demo-playground/demo-playground.component';
import {StateInspectorComponent} from '../../../../shared/components/state-inspector/state-inspector.component';
import {UserCardComponent} from '../../../../shared/components/user-card/user-card.component';
import {User} from '../../../../shared/models/user.model';
import {UserService} from '../../../../shared/services/user.service';
import {highlight} from '../../../../shared/utils/highlight.util';

ClarityIcons.addIcons(minusIcon, plusIcon);

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

interface SearchItem {
  id: number;
  title: string;
  category: string;
  updatedAt: string;
}

interface RequestLog {
  id: number;
  keyword: string;
  status: 'in-flight' | 'aborted' | 'resolved';
  timestamp: string;
}

@Component({
  selector: 'app-resource-async',
  imports: [
    ClarityModule,
    ReactiveFormsModule,
    PageContainerComponent,
    CalloutComponent,
    CodeBlockComponent,
    SpinnerComponent,
    AlertComponent,
    UserCardComponent,
    DemoPlaygroundComponent,
    StateInspectorComponent,
    TranslatePipe,
    ApiTableComponent,
  ],
  templateUrl: './resource-async.component.html',
  styleUrl: './resource-async.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ResourceAsyncComponent {
  private userService = inject(UserService);
  private http = inject(HttpClient);
  private injector = inject(Injector);
  private translationService = inject(TranslationService);

  parameters = computed<ApiProperty[]>(() => {
    this.translationService.currentLanguage();
    return [
      {
        name: 'source',
        type: '((context: ResourceAsyncContext) => Observable<T> | Promise<T> | T) | ResourceAsyncDefinition<P, T>',
        required: true,
        description: this.translationService.translate('resourceAsync.paramSourceFn'),
      },
      {
        name: 'options',
        type: 'ResourceRefOptions<T, E>',
        description: this.translationService.translate('resourceAsync.paramOptions'),
      },
    ];
  });

  definitionProperties = computed<ApiProperty[]>(() => [
    {
      name: 'params',
      type: '() => P',
      required: true,
      description: this.translationService.translate('demoApi.resource-async.definitionProperties.params'),
    },
    {
      name: 'loader',
      type: '(params: P, context: ResourceAsyncContext) => Observable<T> | PromiseLike<T> | T',
      required: true,
      description: this.translationService.translate('demoApi.resource-async.definitionProperties.loader'),
    },
  ]);

  optionsProperties = computed<ApiProperty[]>(() => {
    this.translationService.currentLanguage();
    return [
      {
        name: 'initialValue',
        type: 'T',
        description: this.translationService.translate('resourceAsync.propInitialValue'),
      },
      {
        name: 'defaultValue',
        type: 'T',
        description: this.translationService.translate('demoApi.resource-async.optionsProperties.defaultValue'),
      },
      {
        name: 'lazy',
        type: 'boolean',
        defaultValue: 'false',
        description: this.translationService.translate('resourceAsync.propLazy'),
      },
      {
        name: 'behavior',
        type: "'switch' | 'exhaust'",
        defaultValue: "'switch'",
        description: this.translationService.translate('resourceAsync.propBehavior'),
      },
      {
        name: 'onError',
        type: '(error: E) => T | undefined',
        description: this.translationService.translate('resourceAsync.propOnError'),
      },
      {
        name: 'throwOnError',
        type: 'boolean',
        defaultValue: 'false',
        description: this.translationService.translate('resourceAsync.propThrowOnError'),
      },
      {
        name: 'preserveValueOnError',
        type: 'boolean',
        defaultValue: 'false',
        description: this.translationService.translate('demoApi.resource-async.optionsProperties.preserveValueOnError'),
      },
      {
        name: 'reactive',
        type: 'boolean',
        defaultValue: 'true',
        description: this.translationService.translate('demoApi.resource-async.optionsProperties.reactive'),
      },
      {
        name: 'onSuccess',
        type: '(value: T) => void',
        description: this.translationService.translate('resourceAsync.propOnSuccess'),
      },
      {
        name: 'onLoading',
        type: '() => void',
        description: this.translationService.translate('resourceAsync.propOnLoading'),
      },
      {
        name: 'injector',
        type: 'Injector',
        description: this.translationService.translate('demoApi.resource-async.optionsProperties.injector'),
      },
      {
        name: 'equal',
        type: '(a: T, b: T) => boolean',
        description: this.translationService.translate('demoApi.resource-async.optionsProperties.equal'),
      },
    ];
  });

  returnsProperties = computed<ApiProperty[]>(() => {
    return [
      {
        name: 'value',
        type: 'Signal<T | undefined>',
        description: this.translationService.translate('demoApi.resource-async.returnsProperties.value'),
      },
      {
        name: 'error',
        type: 'Signal<E | null>',
        description: this.translationService.translate('demoApi.resource-async.returnsProperties.error'),
      },
      {
        name: 'status',
        type: 'Signal<ResourceStatus>',
        description: this.translationService.translate('demoApi.resource-async.returnsProperties.status'),
      },
      {
        name: 'isLoading',
        type: 'Signal<boolean>',
        description: this.translationService.translate('demoApi.resource-async.returnsProperties.isLoading'),
      },
      {
        name: 'isIdle',
        type: 'Signal<boolean>',
        description: this.translationService.translate('demoApi.resource-async.returnsProperties.isIdle'),
      },
      {
        name: 'hasValue()',
        type: '() => boolean',
        description: this.translationService.translate('demoApi.resource-async.returnsProperties.hasValue()'),
      },
      {
        name: 'reload()',
        type: '() => boolean',
        description: this.translationService.translate('demoApi.resource-async.returnsProperties.reload()'),
      },
      {
        name: 'execute()',
        type: '() => Promise<T>',
        description: this.translationService.translate('demoApi.resource-async.returnsProperties.execute()'),
      },
      {
        name: 'set()',
        type: '(value: T) => void',
        description: this.translationService.translate('demoApi.resource-async.returnsProperties.set()'),
      },
      {
        name: 'update()',
        type: '(updater: (value: T) => T) => void',
        description: this.translationService.translate('demoApi.resource-async.returnsProperties.update()'),
      },
      {
        name: 'reset()',
        type: '() => void',
        description: this.translationService.translate('demoApi.resource-async.returnsProperties.reset()'),
      },
      {
        name: 'destroy()',
        type: '() => void',
        description: this.translationService.translate('demoApi.resource-async.returnsProperties.destroy()'),
      },
    ];
  });

  // Basic resource - fetch single user (using results=1)
  pageNumber = signal(1);
  userRef = resourceAsync(() =>
    this.userService.getUsers({results: 1, page: this.pageNumber()}).pipe(map((res) => res.results[0])),
  );

  // Lazy resource - won't load until reload() is called
  lazyUsersRef = resourceAsync(() => this.userService.getUsers({results: 9}), {
    lazy: true,
  });

  // Resource with error handling - simulate error with invalid API call
  userWithFallbackRef = resourceAsync(() => this.http.get<User>('https://randomuser.me/api/invalid-endpoint'), {
    lazy: true,
    onError: (error) => {
      console.error('Failed to load user:', error);
      // Return fallback value
      return {
        gender: 'male',
        name: {first: 'Fallback', last: 'User', title: 'Mr'},
        email: 'fallback@example.com',
        picture: {large: '/user-fallback.svg', medium: '/user-fallback.svg', thumbnail: '/user-fallback.svg'},
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
  });

  // Registration form
  registrationForm = new FormGroup({
    username: new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(20)]),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(8)]),
  });

  // Registration resource with exhaust + lazy
  registrationRef = resourceAsync(
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
    {
      lazy: true,
      defaultValue: {
        id: 1,
        title: 'Learn WritableResourceRef',
        completed: false,
      },
    },
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
    {lazy: true, defaultValue: 0},
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

  constructor() {
    effect(() => {
      console.log('[resourceAsync] userRef:', {
        value: this.userRef.value(),
        status: this.userRef.status(),
        isLoading: this.userRef.isLoading(),
      });
      console.log('[resourceAsync] lazyUsersRef:', {
        value: this.lazyUsersRef.value(),
        status: this.lazyUsersRef.status(),
        isLoading: this.lazyUsersRef.isLoading(),
      });
      console.log('[resourceAsync] registrationRef:', {
        value: this.registrationRef.value(),
        status: this.registrationRef.status(),
      });
      console.log('[resourceAsync] itemsRef:', {
        value: this.itemsRef.value(),
        status: this.itemsRef.status(),
      });
      console.log('[resourceAsync] todoRef:', {
        value: this.todoRef.value(),
        status: this.todoRef.status(),
      });
      console.log('[resourceAsync] counterRef:', {
        value: this.counterRef.value(),
        status: this.counterRef.status(),
      });
    });
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

  // Inner resources: Map of orgId -> ResourceRef<Organization | undefined>
  // This map caches created resources to avoid recreating them
  private orgRefsMap = new Map<string, ResourceRef<Organization | undefined>>();

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
  getOrgRef(orgId: string): ResourceRef<Organization | undefined> {
    // Break out of reactive context to avoid NG0602 (effect in reactive context)
    return untracked(() => {
      let orgRef = this.orgRefsMap.get(orgId);
      if (!orgRef) {
        // Pass injector directly in options to run outside ambient injection context
        orgRef = resourceAsync(
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
          {lazy: true, injector: this.injector}, // Decoupled injector + lazy
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

  async onRegistrationSubmit(): Promise<void> {
    if (this.registrationForm.valid) {
      try {
        // execute() returns an awaitable Promise<T> resolving to the exact value in registrationRef.value()
        const response = await this.registrationRef.execute();
        console.log('Registration succeeded via await:', response);
      } catch (error) {
        console.error('Registration failed caught by caller:', error);
      }
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

  // Example 8: Declarative definition & AbortSignal concurrency cancellation
  searchKeyword = signal('Angular');
  searchLogs = signal<RequestLog[]>([]);
  private searchSeq = 0;

  searchDefinitionRef = resourceAsync<SearchItem[], string>(
    {
      params: () => this.searchKeyword(),
      loader: (keyword, {abortSignal}) => {
        const currentSeq = ++this.searchSeq;
        const entry: RequestLog = {
          id: currentSeq,
          keyword,
          status: 'in-flight',
          timestamp: new Date().toLocaleTimeString(),
        };
        this.searchLogs.update((logs) => [entry, ...logs.slice(0, 5)]);

        return new Promise<SearchItem[]>((resolve, reject) => {
          const timer = setTimeout(() => {
            this.searchLogs.update((logs) =>
              logs.map((item) => (item.id === currentSeq ? {...item, status: 'resolved'} : item)),
            );
            resolve([
              {id: 1, title: `${keyword} - Reactive Signals Deep Dive`, category: 'Guides', updatedAt: 'Just now'},
              {
                id: 2,
                title: `${keyword} - Resource Concurrency & Cancellation`,
                category: 'Architecture',
                updatedAt: 'Just now',
              },
              {
                id: 3,
                title: `${keyword} - High Performance UI Patterns`,
                category: 'Design',
                updatedAt: 'Just now',
              },
            ]);
          }, 850);

          abortSignal.addEventListener('abort', () => {
            clearTimeout(timer);
            this.searchLogs.update((logs) =>
              logs.map((item) => (item.id === currentSeq ? {...item, status: 'aborted'} : item)),
            );
            reject(new DOMException('Operation aborted by ResourceAsync', 'AbortError'));
          });
        });
      },
    },
    {
      defaultValue: [],
    },
  );

  rapidSwitchQuery() {
    this.searchKeyword.set('Signals');
    setTimeout(() => {
      this.searchKeyword.set('Clarity');
    }, 150);
  }

  async runAwaitableSearch(): Promise<void> {
    try {
      const items = await this.searchDefinitionRef.execute();
      console.log('Search resolved via execute():', items);
    } catch (err) {
      console.warn('Execution cancelled or error:', err);
    }
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

  declarativeCode = highlight(`
import {resourceAsync, ResourceAsyncDefinition} from 'ngx-lift';
import {Component, signal} from '@angular/core';

export class CatalogSearchComponent {
  query = signal('Angular');

  // Declarative ResourceAsyncDefinition with params + loader receiving context.abortSignal
  searchRef = resourceAsync<SearchResult[], string>(
    {
      params: () => this.query(),
      loader: (searchQuery, {abortSignal}) => {
        // Pass abortSignal to fetch or HTTP clients for true network/operation cancellation
        return fetch(\`/api/search?q=\${encodeURIComponent(searchQuery)}\`, {
          signal: abortSignal,
        }).then((res) => res.json());
      },
    },
    {
      defaultValue: [],
    }
  );
}
  `);

  signatureCode = highlight(`
// 1. Declarative definition (ResourceAsyncDefinition<P, T>)
function resourceAsync<T, P, E = Error>(
  definition: ResourceAsyncDefinition<P, T>,
  options?: ResourceRefOptions<T, E>
): WritableResourceRef<T, E>;

// 2. Functional loader with AbortSignal context
function resourceAsync<T, E = Error>(
  sourceFn: (context: ResourceAsyncContext) => Observable<T> | Promise<T> | T,
  options?: ResourceRefOptions<T, E>
): WritableResourceRef<T, E>;

interface ResourceAsyncDefinition<P, T> {
  params: () => P;
  loader: (params: P, context: ResourceAsyncContext) => Observable<T> | PromiseLike<T> | T;
}

interface ResourceAsyncContext {
  readonly abortSignal: AbortSignal;
}

interface ResourceRefOptions<T, E = Error> {
  initialValue?: T;                       // Initial value before first fetch
  defaultValue?: T;                       // Alias matching Angular's resource() API
  behavior?: 'switch' | 'exhaust';
  onError?: (error: E) => T | undefined;
  throwOnError?: boolean;
  onSuccess?: (value: T) => void;
  onLoading?: () => void;
  lazy?: boolean;
  injector?: Injector;
}

interface ResourceRef<T, E = Error> {
  readonly value: Signal<T>;              // T when initial/default provided, else T | undefined
  readonly error: Signal<E | null>;
  readonly status: Signal<ResourceStatus>;
  readonly isLoading: Signal<boolean>;
  readonly isIdle: Signal<boolean>;
  hasValue(): this is ResourceRef<Exclude<T, undefined>, E>;  // Type guard narrows T | undefined -> T
  reload(): boolean;                      // Returns true if initiated, for read operations (GET)
  execute(): Promise<T>;                  // Awaitable mutation trigger - returns Promise<T>
  reset(): void;                          // Resets resource to idle state, cancels in-flight
}

type ResourceStatus = 'idle' | 'loading' | 'reloading' | 'resolved' | 'error' | 'local';
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

  async onSubmit() {
    if (this.form.valid) {
      // execute() returns an awaitable Promise<T> resolving to the exact value in registrationRef.value()
      const response = await this.registrationRef.execute();
      console.log('Registration successful:', response);
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
   * 2. { injector: this.injector } - Directly decouples the injector without runInInjectionContext()!
   */
  getOrgRef(orgId: string): ResourceRef<Organization> {
    return untracked(() => {  // Break out of reactive context
      let orgRef = this.orgRefsMap.get(orgId);
      if (!orgRef) {
        orgRef = resourceAsync(
          () => this.http.get<Organization>(\`/api/orgs/\${orgId}\`),
          { lazy: true, injector: this.injector }
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
