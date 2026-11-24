---
globs: ['**/*.ts']
alwaysApply: false
---

# Async ownership

Choose promises, observables or signals to match the operation and its consumers. Use current public ngx-lift utilities
when their contracts fit; neither wrapping every request nor introducing an abstraction is a goal.

- Make replacement, concurrency, cancellation and retry semantics intentional. Unsubscribing, aborting a request and
  undoing a server-side operation are different outcomes.
- A promise bridge must settle when its owner cancels; unsubscribing alone may leave callers waiting forever. Handle
  late results and transfer resource ownership before yielding across a cancellation boundary.
- Scope subscriptions, effects, listeners and timers to the correct lifetime. Manual subscriptions are appropriate for
  transport/progress integration when cleanup and error handling are explicit.
- Read reactive dependencies where tracking is intended. Keep loaders and derived state free of accidental feedback
  loops, duplicate requests and hidden business writes.
