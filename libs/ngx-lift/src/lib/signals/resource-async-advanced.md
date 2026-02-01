# resourceAsync - Advanced Patterns: Nested Resources

This guide covers advanced patterns for managing nested data with `resourceAsync`, where you have an outer list and each
item can load additional related data.

---

## 📋 Table of Contents

1. [The Challenge](#the-challenge)
2. [Approach 1: Hybrid Pattern (Recommended)](#approach-1-hybrid-pattern-recommended)
3. [Approach 2: Full resourceAsync Pattern](#approach-2-full-resourceasync-pattern)
4. [Comparison](#comparison)
5. [When to Use Each](#when-to-use-each)
6. [Real-World Examples](#real-world-examples)

---

## The Challenge

You have a list of items, and each item needs to fetch additional related data on-demand:

```typescript
// Outer: List of projects
projects = [
  {id: '1', orgId: 'org-1', name: 'Project Alpha'},
  {id: '2', orgId: 'org-2', name: 'Project Beta'},
  {id: '3', orgId: 'org-1', name: 'Project Gamma'},
];

// Inner: Organization details (loaded per row, on-demand)
// Each row should have its own loading/error state
```

**Requirements:**

- ✅ Outer list uses `resourceAsync` (reactive, loading states)
- ✅ Each row can load inner data independently
- ✅ Individual loading spinners per row
- ✅ Individual error handling per row
- ✅ Caching (don't refetch same data)
- ✅ Lazy loading (only fetch when needed)

---

## Approach 1: Hybrid Pattern (Recommended)

**Use `resourceAsync` for outer list, manual HTTP + signals for inner items.**

### Why This Approach?

- ✅ **Simple**: No complex Angular concepts
- ✅ **Maintainable**: Easy for all skill levels
- ✅ **No Gotchas**: No injection/reactive context issues
- ✅ **Same Features**: Loading states, error handling, caching

### Implementation

```typescript
import {Component, inject, signal, Signal} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {resourceAsync} from 'ngx-lift';

interface AsyncState<T> {
  loading: boolean;
  error: Error | null;
  data: T | null;
}

export class ProjectListComponent {
  private http = inject(HttpClient);

  // Outer resource: List of projects (uses resourceAsync)
  projectsRef = resourceAsync(() => this.http.get<Project[]>('/api/projects'));

  // Inner data: Map of orgId -> AsyncState<Organization>
  private orgDataMap = new Map<string, WritableSignal<AsyncState<Organization>>>();

  /**
   * Get or create organization data signal.
   * Called from template - no special handling needed!
   */
  getOrgData(orgId: string): Signal<AsyncState<Organization>> {
    let orgSignal = this.orgDataMap.get(orgId);
    if (!orgSignal) {
      orgSignal = signal({
        loading: false,
        error: null,
        data: null,
      });
      this.orgDataMap.set(orgId, orgSignal);
    }
    return orgSignal;
  }

  /**
   * Load organization data.
   * Simple HTTP call with manual state management.
   */
  loadOrg(orgId: string) {
    const orgSignal = this.orgDataMap.get(orgId);
    if (!orgSignal) return;

    // Set loading state
    orgSignal.set({
      loading: true,
      error: null,
      data: orgSignal().data, // Keep existing data during reload
    });

    // Make HTTP call
    this.http.get<Organization>(`/api/orgs/${orgId}`).subscribe({
      next: (org) => {
        orgSignal.set({
          loading: false,
          error: null,
          data: org,
        });
      },
      error: (error) => {
        orgSignal.set({
          loading: false,
          error: error,
          data: null,
        });
      },
    });
  }

  loadAllOrgs() {
    const projects = this.projectsRef.value();
    if (!projects) return;

    const uniqueOrgIds = new Set(projects.map((p) => p.orgId));
    uniqueOrgIds.forEach((orgId) => this.loadOrg(orgId));
  }
}
```

### Template

```html
<table class="table">
  <tbody>
    @for (project of projectsRef.value(); track project.id) {
    <tr>
      <td>{{ project.name }}</td>

      <!-- Organization Cell -->
      <td>
        @if (getOrgData(project.orgId); as orgData) {
        <!-- Idle state -->
        @if (!orgData().loading && !orgData().data) {
        <span class="text-muted">Not loaded</span>
        }

        <!-- Loading state -->
        @if (orgData().loading) {
        <cll-spinner size="sm" />
        <span>Loading...</span>
        }

        <!-- Error state -->
        @if (orgData().error && !orgData().loading; as error) {
        <cll-alert [content]="error.message" type="danger" />
        }

        <!-- Success state -->
        @if (orgData().data; as org) {
        <strong>{{ org.name }}</strong>
        <div class="text-muted">{{ org.type }}</div>
        } }
      </td>

      <!-- Actions -->
      <td>
        @if (getOrgData(project.orgId); as orgData) { @if (!orgData().data) {
        <button class="btn btn-sm btn-primary" (click)="loadOrg(project.orgId)">Load Org</button>
        } @else {
        <button class="btn btn-sm btn-link" (click)="loadOrg(project.orgId)">Retry</button>
        } }
      </td>
    </tr>
    }
  </tbody>
</table>

<button class="btn btn-outline" (click)="loadAllOrgs()">Load All Organizations</button>
```

### Benefits

- ✅ **Simple**: Just signals + HTTP (basic Angular knowledge)
- ✅ **No Wrappers**: No `untracked()`, no `runInInjectionContext()`
- ✅ **Clean**: Easy to read and maintain
- ✅ **Flexible**: Easy to customize behavior
- ✅ **Performant**: Same lazy loading and caching

---

## Approach 2: Full resourceAsync Pattern

**Use `resourceAsync` for both outer and inner items.**

### When to Use This

Only when inner items **need reactive dependencies** that trigger automatic refetch:

```typescript
// Example: Organization changes when selectedOrgId changes
orgRef = resourceAsync(
  () => this.http.get(`/api/orgs/${this.selectedOrgId()}`), // Auto-refetch on signal change
);
```

### Implementation

```typescript
import {Component, inject, Injector, runInInjectionContext, signal, untracked} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {resourceAsync, ResourceRef} from 'ngx-lift';

export class ProjectListComponent {
  private http = inject(HttpClient);
  private injector = inject(Injector);

  // Outer resource
  projectsRef = resourceAsync(() => this.http.get<Project[]>('/api/projects'));

  // Inner resources: Map of orgId -> ResourceRef<Organization>
  private orgRefsMap = new Map<string, ResourceRef<Organization>>();

  /**
   * Get or create a resource for the given orgId.
   *
   * IMPORTANT: Requires two wrappers when called from template:
   * 1. untracked() - Prevents NG0602 (effect in reactive context)
   * 2. runInInjectionContext() - Prevents NG0203 (no injection context)
   */
  getOrgRef(orgId: string): ResourceRef<Organization> {
    return untracked(() => {
      let orgRef = this.orgRefsMap.get(orgId);
      if (!orgRef) {
        orgRef = runInInjectionContext(this.injector, () =>
          resourceAsync(() => this.http.get<Organization>(`/api/orgs/${orgId}`), {lazy: true}),
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
    const projects = this.projectsRef.value();
    if (!projects) return;

    const uniqueOrgIds = new Set(projects.map((p) => p.orgId));
    uniqueOrgIds.forEach((orgId) => this.loadOrg(orgId));
  }
}
```

### Template

```html
<table class="table">
  <tbody>
    @for (project of projectsRef.value(); track project.id) {
    <tr>
      <td>{{ project.name }}</td>
      <td>
        @if (getOrgRef(project.orgId); as orgRef) { @if (orgRef.isIdle()) {
        <span class="text-muted">Not loaded</span>
        } @if (orgRef.isLoading()) {
        <cll-spinner size="sm" />
        } @if (orgRef.error(); as error) {
        <cll-alert [content]="error.message" />
        } @if (orgRef.hasValue()) {
        <strong>{{ orgRef.value().name }}</strong>
        } }
      </td>
      <td>
        <button (click)="loadOrg(project.orgId)">Load Org</button>
      </td>
    </tr>
    }
  </tbody>
</table>
```

### Why the Wrappers?

**Problem 1: Reactive Context (NG0602)**

- `getOrgRef()` is called from template during change detection (reactive context)
- `resourceAsync()` uses `effect()` internally
- `effect()` cannot be created during reactive tracking
- **Solution:** `untracked()` breaks out of reactive tracking

**Problem 2: Injection Context (NG0203)**

- Template method calls happen outside injection context
- `resourceAsync()` uses `inject()` internally
- **Solution:** `runInInjectionContext()` provides injection context

---

## Comparison

| Aspect               | Approach 1: Hybrid | Approach 2: Full resourceAsync                |
| -------------------- | ------------------ | --------------------------------------------- |
| **Complexity**       | ✅ Low             | ❌ High                                       |
| **Code Lines**       | ~30 lines          | ~35 lines                                     |
| **Concepts**         | 2 basic            | 6 advanced                                    |
| **Wrappers Needed**  | ❌ None            | ✅ Two (`untracked`, `runInInjectionContext`) |
| **Junior Friendly**  | ✅ Yes             | ❌ No                                         |
| **Maintainable**     | ✅ Easy            | ⚠️ Harder                                     |
| **Reactive Refetch** | ❌ Manual only     | ✅ Automatic                                  |
| **Loading States**   | ✅ Manual          | ✅ Built-in                                   |
| **Error Handling**   | ✅ Manual          | ✅ Built-in                                   |
| **Caching**          | ✅ Same            | ✅ Same                                       |
| **Performance**      | ✅ Same            | ✅ Same                                       |

---

## When to Use Each

### Use Approach 1 (Hybrid) When:

- ✅ Inner items don't have reactive dependencies
- ✅ Inner items are loaded on-demand (button click)
- ✅ You want simpler, more maintainable code
- ✅ Team prefers straightforward patterns

**Example:**

```typescript
// Simple on-demand loading - no reactive dependencies
loadOrgDetails(orgId: string) {
  orgSignal.set({ loading: true, error: null, data: null });
  this.http.get(`/api/orgs/${orgId}`).subscribe(...);
}
```

### Use Approach 2 (Full resourceAsync) When:

- ✅ Inner items have reactive dependencies that trigger refetch
- ✅ You need automatic cancellation strategies
- ✅ Inner items have complex async logic
- ✅ Team is comfortable with advanced patterns

**Example:**

```typescript
// Reactive dependency - auto-refetch when selectedOrgId changes
orgRef = resourceAsync(() => this.http.get(`/api/orgs/${this.selectedOrgId()}`));
```

---

## Real-World Examples

### Example 1: E-commerce Product List

```typescript
export class ProductListComponent {
  private categoryId = signal(1);

  // Outer: Products (reactive - refetch when category changes)
  productsRef = resourceAsync(() => this.http.get<Product[]>(`/api/products?category=${this.categoryId()}`));

  // Inner: Reviews (simple - load on demand)
  private reviewsCache = new Map<string, Signal<AsyncState<Review[]>>>();

  getReviews(productId: string): Signal<AsyncState<Review[]>> {
    let reviewsSignal = this.reviewsCache.get(productId);
    if (!reviewsSignal) {
      reviewsSignal = signal({
        loading: false,
        error: null,
        data: null,
      });
      this.reviewsCache.set(productId, reviewsSignal);
    }
    return reviewsSignal;
  }

  loadReviews(productId: string) {
    const reviewsSignal = this.reviewsCache.get(productId);
    if (!reviewsSignal) return;

    reviewsSignal.set({loading: true, error: null, data: null});

    this.http.get<Review[]>(`/api/reviews/${productId}`).subscribe({
      next: (reviews) => reviewsSignal.set({loading: false, error: null, data: reviews}),
      error: (error) => reviewsSignal.set({loading: false, error, data: null}),
    });
  }
}
```

### Example 2: User Management Dashboard

```typescript
export class UserDashboardComponent {
  private deptId = signal(1);

  // Outer: Users (reactive - refetch when department changes)
  usersRef = resourceAsync(() => this.http.get<User[]>(`/api/users?dept=${this.deptId()}`));

  // Inner: Avatars (simple - load on expand)
  private avatarCache = new Map<string, Signal<AsyncState<Avatar>>>();

  getAvatar(userId: string): Signal<AsyncState<Avatar>> {
    let avatarSignal = this.avatarCache.get(userId);
    if (!avatarSignal) {
      avatarSignal = signal({
        loading: false,
        error: null,
        data: null,
      });
      this.avatarCache.set(userId, avatarSignal);
    }
    return avatarSignal;
  }

  loadAvatar(userId: string) {
    const avatarSignal = this.avatarCache.get(userId);
    if (!avatarSignal) return;

    avatarSignal.set({loading: true, error: null, data: null});

    this.http.get<Avatar>(`/api/avatars/${userId}`).subscribe({
      next: (avatar) => avatarSignal.set({loading: false, error: null, data: avatar}),
      error: (error) => avatarSignal.set({loading: false, error, data: null}),
    });
  }
}
```

---

## Decision Tree

```
Do inner items have reactive dependencies that trigger automatic refetch?
│
├─ NO (most cases) → Use Approach 1: Hybrid Pattern ✅
│  └─ Benefits: Simpler, maintainable, no wrappers needed
│
└─ YES (rare) → Use Approach 2: Full resourceAsync
   └─ Benefits: Automatic refetch, but requires wrappers
```

---

## Best Practices

### 1. Start Simple

```typescript
// ✅ Start with manual HTTP + signals
private dataCache = new Map<string, WritableSignal<AsyncState<Data>>>();

getData(id: string) {
  let dataSignal = this.dataCache.get(id);
  if (!dataSignal) {
    dataSignal = signal({ loading: false, error: null, data: null });
    this.dataCache.set(id, dataSignal);
  }
  return dataSignal;
}
```

### 2. Upgrade When Needed

```typescript
// ✅ Upgrade to resourceAsync only when you need reactive features
dataRef = resourceAsync(
  () => this.http.get(`/api/data/${this.reactiveSignal()}`), // Auto-refetch
);
```

### 3. Don't Force resourceAsync Everywhere

```typescript
// ❌ BAD: Using resourceAsync just for consistency
innerRef = resourceAsync(() => this.http.get(`/api/data/${staticId}`), {lazy: true});
// Requires untracked() + runInInjectionContext() for no benefit

// ✅ GOOD: Simple HTTP when no reactive deps needed
innerSignal = signal<AsyncState<Data>>({ ... });
loadData(id: string) { /* simple HTTP call */ }
```

---

## Key Takeaways

1. **Hybrid Pattern (Approach 1)** is recommended for **most** nested resource scenarios
2. **Full resourceAsync (Approach 2)** is only needed when inner items have **reactive dependencies**
3. **Don't force complexity** - use the simplest solution that meets your needs
4. **Manual HTTP + signals** provides the same practical features without the wrappers
5. **resourceAsync shines** when you need reactive refetch, not for simple on-demand loading

---

## Summary

For nested resources with outer list + inner details:

- **Outer List:** Always use `resourceAsync` (benefits from reactive features)
- **Inner Details:** Usually use manual HTTP + signals (simpler, no gotchas)
- **Exception:** Use `resourceAsync` for inner items only if they have reactive dependencies

**The best code is the simplest code that meets your needs!** 🎯
