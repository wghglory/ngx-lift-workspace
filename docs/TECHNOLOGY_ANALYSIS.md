# Technology architecture

Dependency versions are defined in [package.json](../package.json) and the lockfile. Library manifests define their
consumer peer ranges; a permitted peer range is not proof of a complete compatibility matrix.

| Area          | Implementation                                                                     |
| ------------- | ---------------------------------------------------------------------------------- |
| Framework     | Standalone Angular components, signals, OnPush and modern template control flow    |
| Demo runtime  | Zoneless change detection; installed-consumer fixtures also exercise ZoneJS        |
| Demo build    | Angular application builder using @angular/build; output is dist/apps/demo/browser |
| Library build | ng-packagr through Nx, producing Angular package-format distributions              |
| Workspace     | Nx task graph and cache, orchestrated through pnpm                                 |
| Unit tests    | Vitest with Angular TestBed and controlled timers                                  |
| Browser tests | Playwright projects for Chromium, Firefox and WebKit                               |
| UI            | Clarity Angular components and design tokens                                       |
| Quality       | TypeScript strict checks, ESLint, Prettier, locale/bundle/package verification     |

The demo bootstraps with provideZonelessChangeDetection. This does not require consumers to switch rendering mode. The
installed DOM fixture checks both modes, but does not establish SSR/hydration or a real-browser ZoneJS matrix.

Async API responsibilities and concurrency contracts are defined in the [API specifications](design/README.md). Large
example dependencies load at interaction/render boundaries as described in the
[integration guide](guides/demo-and-library-integration.md). Validation commands are in [COMMANDS](COMMANDS.md).
