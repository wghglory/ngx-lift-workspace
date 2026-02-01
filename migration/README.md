# AsyncState Migration Guide (v1.x → v19.x)

## Quick Start

```bash
# 1. Install latest version
npm install ngx-lift@latest

# 2. Run migration (one-liner)
curl -sSL https://raw.githubusercontent.com/wghglory/ngx-lift-workspace/main/migration/download-and-migrate.sh | bash -s -- src

# 3. Review changes
git diff

# 4. Test
npm test

# 5. Commit
git commit -am "chore: migrate to ngx-lift v19 AsyncState"
```

## What Changed

The `AsyncState` interface has been updated:

| Before (v1.x)       | After (v19.x)          |
| ------------------- | ---------------------- |
| `state.loading`     | `state.isLoading`      |
| _(no status field)_ | `state.status` _(new)_ |

### New Interface

```typescript
// Before (v1.x)
interface AsyncState<T, E = HttpErrorResponse> {
  loading: boolean;
  error: E | null;
  data: T | null;
}

// After (v19.x)
interface AsyncState<T, E = HttpErrorResponse> {
  status: ResourceStatus; // NEW: 'idle' | 'loading' | 'reloading' | 'resolved' | 'error'
  isLoading: boolean; // RENAMED from 'loading'
  error: E | null;
  data: T | null;
}
```

## Migration Options

### Option 1: Automated Migration (Recommended)

**Quick one-liner:**

```bash
curl -sSL https://raw.githubusercontent.com/wghglory/ngx-lift-workspace/main/migration/download-and-migrate.sh | bash -s -- src
```

**Or download and run manually:**

```bash
# Download migration script
curl -o migrate-async-state.js https://raw.githubusercontent.com/wghglory/ngx-lift-workspace/main/migration/migrate-async-state.js

# Preview changes (dry run)
node migrate-async-state.js src --dry-run

# Run migration
node migrate-async-state.js src
```

### Option 2: Manual Migration

**Find and Replace:**

1. Replace all `state.loading` with `state.isLoading`
2. Replace all `{ loading }` with `{ isLoading }`
3. Replace all `loading: boolean` with `isLoading: boolean`
4. Add `status` property to AsyncState type definitions

**Example:**

```typescript
// Before
if (state.loading) {
  console.log('Loading...');
}
const {loading, data, error} = state;

// After
if (state.isLoading) {
  console.log('Loading...');
}
const {isLoading, data, error, status} = state;
```

## Common Patterns

### TypeScript

```typescript
// ❌ Before
if (state.loading) {
}
const {loading} = state;
loading: boolean;

// ✅ After
if (state.isLoading) {
}
const {isLoading} = state;
isLoading: boolean;
```

### Templates

```html
<!-- ❌ Before -->
<div *ngIf="state.loading">Loading...</div>
<button [disabled]="state.loading">Submit</button>
@if (state.loading) { <spinner /> }

<!-- ✅ After -->
<div *ngIf="state.isLoading">Loading...</div>
<button [disabled]="state.isLoading">Submit</button>
@if (state.isLoading) { <spinner /> }
```

### Object Literals

```typescript
// ❌ Before
const state: AsyncState<User> = {
  loading: false,
  error: null,
  data: null,
};

// ✅ After
const state: AsyncState<User> = {
  status: 'idle', // NEW: Add this
  isLoading: false, // RENAMED
  error: null,
  data: null,
};
```

## New Status Property Benefits

The new `status` property provides granular state tracking:

```typescript
type ResourceStatus = 'idle' | 'loading' | 'reloading' | 'resolved' | 'error';

// Use for better UX
@if (state.status === 'loading') {
  <skeleton-loader />
} @else if (state.status === 'reloading') {
  <spinner inline />
  <user-list [users]="state.data" />
}

// Switch statement for comprehensive handling
switch (state.status) {
  case 'idle':
    return 'Not started';
  case 'loading':
    return 'Loading for the first time...';
  case 'reloading':
    return 'Refreshing data...';
  case 'resolved':
    return `Loaded ${state.data?.length} items`;
  case 'error':
    return `Failed: ${state.error?.message}`;
}
```

## Affected APIs

The following ngx-lift operators return `AsyncState` and are affected:

- ✅ `createAsyncState`
- ✅ `switchMapWithAsyncState`
- ✅ `poll`

## Testing Updates

Update your test mocks:

```typescript
// ❌ Before
const mockState: AsyncState<User> = {
  loading: true,
  error: null,
  data: null,
};

// ✅ After
const mockState: AsyncState<User> = {
  status: 'loading', // Add this
  isLoading: true, // Rename this
  error: null,
  data: null,
};
```

## Troubleshooting

### TypeScript Error: Property 'loading' does not exist

**Solution:** Run the migration script or manually replace all occurrences of `.loading` with `.isLoading`.

### Template Error: Property 'loading' does not exist

**Solution:** Update templates to use `isLoading` instead of `loading`:

```html
<!-- Before -->
@if (state.loading) { ... }

<!-- After -->
@if (state.isLoading) { ... }
```

### Tests Failing After Migration

Make sure to update both the property name AND add the `status` property in test mocks:

```typescript
const mockState: AsyncState<User> = {
  status: 'loading', // Add this
  isLoading: true, // Rename from 'loading'
  error: null,
  data: null,
};
```

## Why This Change?

1. **Alignment with Angular:** The new interface matches Angular's `httpResource` API pattern
2. **Better UX:** Distinguish between initial load and reload states for better user feedback
3. **Type Safety:** More explicit property names reduce confusion

## Need Help?

- 📖 [ngx-lift Documentation](https://github.com/wghglory/ngx-lift-workspace)
- 🐛 [Report Issue](https://github.com/wghglory/ngx-lift-workspace/issues)
- 💬 [GitHub Discussions](https://github.com/wghglory/ngx-lift-workspace/discussions)

## Version Information

- **Breaking Change Version:** v19.0.0
- **Migration Support:** ngx-lift v19.0.0+
- **Estimated Migration Time:** 5-10 minutes
