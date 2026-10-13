# ngx-lift Core Async & Query Primitives — Design Specifications

This directory contains the authoritative design specifications, code-versus-spec gap analyses, operational lifecycle
contracts, quality audits, and evolutionary roadmaps for the core asynchronous state and query primitives in `ngx-lift`.

All scattered markdown specifications from the library implementation directories (`query.md`, `query.zh-CN.md`,
`resource-async.md`, `resource-async.zh-CN.md`, `resource-async-advanced.md`, `resource-async-advanced.zh-CN.md`,
`computed-async.md`, `computed-async.zh-CN.md`) have been consolidated here.

---

## Specification Index

| Primitive            | Primary Responsibility                                                                               | Scope                | Design Spec                                                      | Status              |
| :------------------- | :--------------------------------------------------------------------------------------------------- | :------------------- | :--------------------------------------------------------------- | :------------------ |
| **`resourceAsync`**  | Local asynchronous resource lifecycle, concurrency, local overrides & nested rows                    | Component / Service  | [resource-async-design-spec.md](resource-async-design-spec.md)   | ✅ Production-ready |
| **`queryResource`**  | Multi-observer shared cache, deterministic keys, tags invalidation & coordinated polling             | Application / Global | [query-resource-design-spec.md](query-resource-design-spec.md)   | ✅ Production-ready |
| **`mutateResource`** | Explicit write operations, concurrency policies (`exhaust`, `concat`, `parallel`) & tag invalidation | User interactions    | [mutate-resource-design-spec.md](mutate-resource-design-spec.md) | ✅ Production-ready |
| **`computedAsync`**  | Derived signal computation from async sources (`requireSync`, `createWatch`)                         | Pure derivation      | [computed-async-design-spec.md](computed-async-design-spec.md)   | ✅ Production-ready |

---

## Architectural Taxonomy: When to Use Which Primitive

For proposed API enhancements and practical request composition, see
[Query API developer experience](query-api-dx-proposal.md) and its [Chinese companion](query-api-dx-proposal.zh-CN.md).
This is a proposal, not an implemented API contract.

```
                             Is the operation a write (POST/PUT/DELETE)?
                                          /          \
                                       YES            NO
                                      /                \
                         use `mutateResource`    Is it shared across multiple components
                                                 or does it need tags / coordinated polling?
                                                           /                 \
                                                        YES                   NO
                                                       /                       \
                                             use `queryResource`       Is it a pure derived Signal
                                                                       or does it need lifecycle signals
                                                                       (isLoading, error, reload, set)?
                                                                                 /              \
                                                                        Lifecycle Signals     Pure Signal
                                                                               /                    \
                                                                     use `resourceAsync`    use `computedAsync`
```

---

## Summary of Core Architectural Principles

1. **Explicit Separation of Reads and Writes**:
   - `queryResource` and `resourceAsync` are reactive readers: they fetch automatically as tracked Signal dependencies
     change.
   - `mutateResource` is strictly an imperative writer: it only executes on demand when `.mutate(args)` is called.
2. **Pure Dependency Capture**:
   - `params()` runs inside an Angular computed Signal and must remain pure.
   - `loader()` executes untracked side-effects without polluting dependency sets.
3. **Multi-Observer Efficiency**:
   - Shared queries managed by `QueryClient` coordinate background poll intervals across observers, automatically pause
     when the browser tab is hidden, and cleanly isolate invalidation generations.
4. **Strict Type Safety**:
   - Function overloads guarantee `Signal<T>` when `defaultValue` or `initialValue` is provided, and
     `Signal<T | undefined>` when omitted.

---

## Overall Quality & Verification Summary

- **Total Test Suite**: 44 test files, 674 unit tests passing (100%).
- **Demo Verification**: 71 demo test files, 151 tests passing (100%).
- **Code Coverage**: Exceeds 90% branch and statement coverage across all async and query primitives.
- **Strict Typing**: Zero `any` types; full TypeScript strict mode compliance.
- **Enterprise Verification**: Validated in real-world production applications.
