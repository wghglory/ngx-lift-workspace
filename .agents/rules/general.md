---
alwaysApply: true
---

# Engineering judgment and library boundaries

Use the simplest design that satisfies the current contract. Existing code is context, not a requirement to repeat an
obsolete pattern. Prefer supported modern APIs; justify a different approach when it improves correctness or clarity.

- Keep reusable library behavior separate from demo/application protocols. Preserve public import paths, value types,
  error semantics and consumer compatibility unless a contract change is explicitly authorized.
- Keep ngx-lift independent of Clarity. Browser-dependent helpers need appropriate server guards and cleanup; a library
  import should not start requests, timers or browser-only work.
- Handle ownership, cancellation and late async results explicitly. Report failures truthfully rather than hiding them
  with fallback success, broad catches or retry loops without a termination policy.
- Treat review comments as hypotheses: reproduce the issue or verify the contract before changing code. Prefer a direct
  fix over extra abstraction or machinery added only to satisfy a review suggestion.
- Use the repository's compiler, lint, build and test configuration as the source of truth. Keep validation evidence
  specific to the changed scope and revision; CI, human acceptance and publication are separate outcomes.
