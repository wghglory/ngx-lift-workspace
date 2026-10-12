# Technology Stack Architecture

An overview of the architectural decisions, build systems, framework versions, and testing infrastructure in
`ngx-lift-workspace`.

---

## 🏛️ Core Technologies & Versions

| Layer            | Technology        | Version       | Purpose                                                      |
| :--------------- | :---------------- | :------------ | :----------------------------------------------------------- |
| **Framework**    | Angular           | `21.2.x`      | Modern reactive frontend framework (Zoneless, Signals)       |
| **Language**     | TypeScript        | `5.9.x`       | Strict type safety and compilation                           |
| **Monorepo**     | Nx                | `22.7.x`      | Monorepo task orchestration, caching, and dependency graph   |
| **App Bundler**  | Rspack            | `1.5.x`       | High-speed Rust-based bundler for demo application           |
| **Unit Testing** | Vitest            | `4.1.x`       | Fast native ESM unit testing with `@analogjs/vitest-angular` |
| **E2E Testing**  | Playwright        | `1.50.x`      | End-to-end browser testing                                   |
| **UI System**    | VMware Clarity    | `18.0.x`      | Clarity Design System for `clr-lift`                         |
| **Code Quality** | ESLint & Prettier | `9.x` / `3.x` | Strict linting rules and code formatting                     |

---

## ⚡ Architectural Principles

### 1. Fully Zoneless Angular

- **No `zone.js` runtime**: Change detection is driven purely by Angular Signals and native scheduler notifications via
  `provideZonelessChangeDetection()`.
- **Zero monkey patching**: Eliminates browser API wrapping overhead, drastically improving runtime performance and
  reducing bundle sizes.

### 2. Signal-First State Management

- Component state is modeled using Angular Signals (`signal()`, `computed()`, `input()`, `output()`).
- Asynchronous data lifecycles are modeled via `resourceAsync`, `queryResource`, `mutateResource`, and `computedAsync`.
- Direct manual `.subscribe()` in templates and components is strictly avoided.

### 3. Native ESM Testing with Vitest

- Replaces legacy Karma/Jasmine and `fakeAsync`.
- Test suites use Vitest Fake Timers (`vi.useFakeTimers()`, `vi.advanceTimersByTimeAsync()`) and `TestBed.tick()` to
  synchronize reactive Signal effects cleanly.

### 4. High-Performance Tooling: Rspack & Nx

- Production and development builds of the demo app leverage **Rspack** via `@nx/angular-rspack`, delivering sub-second
  compilation and incremental build times.
- Nx handles computational caching and dependency tracking across the monorepo.
