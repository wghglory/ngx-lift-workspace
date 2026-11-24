---
globs: ['**/*.spec.ts', '**/*.test.ts']
alwaysApply: false
---

# Tests that establish behavior

Use the configured Vitest and Playwright targets. Read coverage thresholds and browser scope from their configuration;
keep numeric copies and framework tutorials out of agent guidance.

- Cover observable contracts and meaningful failure/recovery paths. A regression test should fail for the defect, not
  merely repeat the implementation. Reuse existing fixtures when they model the behavior faithfully.
- Test Angular form controls through real form bindings when validating CVA, validators, updateOn, disabled or reset
  behavior. Callback-only mocks cannot establish framework integration.
- Exercise cancellation before, during and after async ownership changes; verify pending callers settle and stale
  callbacks cannot change the new state. Include concurrency/retry ordering where it matters.
- Use deterministic promises, scheduler control or the framework's supported stability APIs as appropriate. Wait for an
  observable state or accessible control before interaction/scanning, rather than adding fixed sleeps.
- Prefer semantic selectors for user actions and stable test IDs when needed. Internal selectors are reasonable for
  focused structural assertions; avoid tests tied to incidental layout or CSS details.
- Test keyboard focus and meaningful error states alongside accessibility scans. Use genuine focusability for focus
  tests; a scoped mock may isolate an unrelated unit, but must not stand in for the behavior being verified.
- Use the real translation service when localization is under test. Small mocks are appropriate elsewhere if they
  preserve the consumed contract. Keep automated results separate from human acceptance.
- Verify the documented server/browser and installed-package behavior when affected; source aliases and a passing jsdom
  test alone do not prove those contracts.
