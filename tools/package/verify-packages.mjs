// Packs built libraries and verifies exports, public types, imports and strict isolated installs.
// Run with pnpm run verify:packages; also included in pnpm run validate.
import assert from 'node:assert/strict';
import {mkdtempSync, mkdirSync, readdirSync, readFileSync, writeFileSync, symlinkSync, rmSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join, resolve} from 'node:path';
import {spawnSync} from 'node:child_process';
import {createRequire} from 'node:module';

const root = process.cwd();
const consumer = mkdtempSync(join(tmpdir(), 'ngx-lift-consumer-'));
const freshConsumer = mkdtempSync(join(tmpdir(), 'ngx-lift-fresh-consumer-'));

function run(command, args, cwd = consumer, timeout = 60000) {
  const result = spawnSync(command, args, {cwd, encoding: 'utf8', timeout});
  if (result.error || result.status !== 0)
    throw new Error(`${command} failed: ${result.stderr || result.stdout || result.error}`);
  return result.stdout;
}

try {
  // Phase 1: Linked consumer for fast package structure & types validation
  const modules = join(consumer, 'node_modules');
  mkdirSync(modules);
  for (const entry of readdirSync(join(root, 'node_modules'))) {
    if (entry.startsWith('.') || ['ngx-lift', 'clr-lift'].includes(entry)) continue;
    symlinkSync(join(root, 'node_modules', entry), join(modules, entry), 'dir');
  }

  const packFiles = {};
  for (const name of ['ngx-lift', 'clr-lift']) {
    const pack = JSON.parse(
      run('npm', ['pack', '--json', '--ignore-scripts', '--pack-destination', consumer], join(root, 'dist/libs', name)),
    )[0];
    packFiles[name] = join(consumer, pack.filename);
    const destination = join(consumer, name);
    mkdirSync(destination);
    run('tar', ['-xzf', packFiles[name], '-C', destination]);
    const packageRoot = join(destination, 'package');
    const manifest = JSON.parse(readFileSync(join(packageRoot, 'package.json'), 'utf8'));
    assert.equal(manifest.sideEffects, false);
    assert.ok(manifest.exports['.'].types);
    assert.ok(manifest.exports['.'].default);
    symlinkSync(packageRoot, join(modules, name), 'dir');
  }

  writeFileSync(
    join(consumer, 'consumer.ts'),
    `
import {computedAsync, isURL, QueryClient, IdleDetectionService, IdleDetectionState, provideQueryClient, QueryTimeoutError, queryResources, QueryResourceItem, fetchQueryObservable, observeQueryObservable, ByteConverterPipe, controlValue, isEmpty, isNotEmpty, provideK8sRetryBackoffConfig} from 'ngx-lift';
import {of, type Observable} from 'rxjs';
import {SpinnerComponent, TooltipDirective, TranslationService, QueryDevtoolsComponent} from 'clr-lift';
import {provideQueryDevtools} from 'clr-lift/devtools';
void provideQueryDevtools();
const devtools: typeof QueryDevtoolsComponent = QueryDevtoolsComponent;
void devtools;
import {FormControl} from '@angular/forms';
const valid: boolean = isURL('https://example.technology');
function computedTypes() {
  const value: number = computedAsync(() => of(42), {initialValue: 0, onError: () => 0})();
  const optional: number | undefined = computedAsync<number | undefined>(() => of(42), {initialValue: 0, onError: () => undefined})();
  // @ts-expect-error Legacy error-as-data behavior is no longer supported.
  computedAsync<number>(() => of(42), {throwOnError: false});
  // @ts-expect-error A numeric signal cannot use an undefined fallback.
  computedAsync<number>(() => of(42), {initialValue: 0, onError: () => undefined});
  void [value, optional];
}
void computedTypes;

const client = new QueryClient();
const definition = {key: ['package-users'], loader: () => of([{id: 1}])};
const users: Promise<{id: number}[]> = client.fetchQuery(definition);
const refetched: Promise<{id: number}[]> | undefined = client.refetchQuery<{id: number}[]>(definition.key);
void refetched;
const users$: Observable<{id: number}[]> = fetchQueryObservable(client, definition);
const snapshots$ = observeQueryObservable(client, definition);
const providers = provideQueryClient({queryDefaults: {
  retry: {maxAttempts: 3, shouldRetry: () => false, delayMs: 100}, deadlineMs: 5000, refetchOnReconnect: true,
}});
const timeoutError = new QueryTimeoutError(20);
void [users, users$, snapshots$, queryResources, providers, timeoutError];
function collection() {
  const rows = queryResources(() => [1, 2], id => ({key: ['items', id], loader: () => of({id})}));
  const values: readonly QueryResourceItem<{id: number}>[] = rows();
  const selectedId: number = rows()[0].item();
  const failures: number = rows()[0].failureCount();
  void [selectedId, failures];
  rows.destroy();
  return values;
}
void collection;
const spinner: typeof SpinnerComponent = SpinnerComponent;
const tooltip: typeof TooltipDirective = TooltipDirective;
function format(pipe: ByteConverterPipe) {return pipe.transform(1024, 'zh-CN');}
function form() {return controlValue<string>(new FormControl('', {nonNullable: true}));}
function translations(service: TranslationService) {return service.locale();}
function emptiness(items: string[] | undefined) {
  if (isNotEmpty(items)) {
    // @ts-expect-error An emptiness predicate cannot safely narrow nullability in both branches.
    const defined: string[] = items;
    void defined;
  } else {
    // @ts-expect-error A defined empty collection can enter this branch.
    const absent: undefined = items;
    void absent;
  }
  if (items != null && isNotEmpty(items)) { const defined: string[] = items; void defined; }
}
function emptyArrays(items: number[]) {
  if (!isNotEmpty(items)) { const array: number[] = items; items.length; void array; }
  if (isEmpty(items)) { items.length; }
}
const retryProviders = provideK8sRetryBackoffConfig({maxAttempts: 3, jitter: 'none'});
void [valid, client, spinner, tooltip, format, form, translations, emptiness, emptyArrays, retryProviders];
`,
  );
  run(process.execPath, [
    resolve('node_modules/typescript/bin/tsc'),
    '--noEmit',
    '--strict',
    '--skipLibCheck',
    'false',
    '--moduleResolution',
    'bundler',
    '--module',
    'esnext',
    '--target',
    'es2022',
    '--types',
    'node',
    'consumer.ts',
  ]);
  writeFileSync(
    join(consumer, 'consumer.mjs'),
    `import '@angular/compiler'; import assert from 'node:assert/strict'; import {isURL, range, serializeQueryKey} from 'ngx-lift'; import {JSDOM} from 'jsdom'; const dom = new JSDOM('<html><body></body></html>'); for (const key of ['document', 'window', 'HTMLElement', 'Element', 'Node', 'CustomEvent', 'customElements']) globalThis[key] = dom.window[key]; const {SpinnerComponent} = await import('clr-lift'); assert.equal(isURL('https://example.technology'), true); assert.deepEqual(range(3), [0,1,2]); assert.equal(serializeQueryKey(['a',{b:1}]), serializeQueryKey(['a',{b:1}])); assert.equal(typeof SpinnerComponent, 'function'); dom.window.close();`,
  );
  run(process.execPath, ['consumer.mjs']);

  // Phase 2: Fresh isolated consumer without host node_modules symlinking
  const registryConfig = readFileSync(join(root, '.npmrc'), 'utf8')
    .split('\n')
    .filter((line) => !/^(legacy-peer-deps|strict-peer-dependencies|auto-install-peers)=/.test(line))
    .join('\n');
  writeFileSync(
    join(freshConsumer, '.npmrc'),
    `${registryConfig}\nstrict-peer-dependencies=true\nauto-install-peers=false\n`,
  );
  writeFileSync(
    join(freshConsumer, 'package.json'),
    JSON.stringify(
      {
        name: 'fresh-isolated-consumer',
        private: true,
        type: 'module',
        dependencies: {
          'ngx-lift': `file:${packFiles['ngx-lift']}`,
          'clr-lift': `file:${packFiles['clr-lift']}`,
          '@angular/core': '~21.2.0',
          '@angular/common': '~21.2.0',
          '@angular/platform-browser': '~21.2.0',
          '@angular/forms': '~21.2.0',
          '@angular/compiler': '~21.2.0',
          '@angular/animations': '~21.2.0',
          '@angular/router': '~21.2.0',
          '@angular/cdk': '~21.2.0',
          '@clr/angular': '^18.4.0',
          '@clr/ui': '^18.4.0',
          rxjs: '^7.8.0',
          'node-forge': '^1.4.0',
          jsdom: '^27.0.0',
          'zone.js': '~0.16.0',
        },
        devDependencies: {
          '@angular/compiler-cli': '~21.2.0',
          '@types/node': '^22.0.0',
          '@types/node-forge': '^1.3.11',
          typescript: '^5.9.0',
        },
      },
      null,
      2,
    ),
  );

  writeFileSync(join(freshConsumer, 'pnpm-workspace.yaml'), 'strictPeerDependencies: true\nautoInstallPeers: false\n');
  run('pnpm', ['install', '--prefer-offline', '--no-frozen-lockfile'], freshConsumer, 60000);
  for (const name of ['key-value-hosts.ts', 'key-value-browser.mjs']) {
    writeFileSync(join(freshConsumer, name), readFileSync(join(root, 'tools/package/fixtures', name), 'utf8'));
  }
  writeFileSync(
    join(freshConsumer, 'key-value-tsconfig.json'),
    JSON.stringify({
      compilerOptions: {
        target: 'ES2022',
        module: 'ES2022',
        moduleResolution: 'bundler',
        strict: true,
        skipLibCheck: false,
        experimentalDecorators: true,
        outDir: './key-value-compiled',
        lib: ['ES2022', 'DOM'],
        types: [],
      },
      angularCompilerOptions: {strictTemplates: true},
      files: ['key-value-hosts.ts'],
    }),
  );
  run('pnpm', ['exec', 'ngc', '-p', 'key-value-tsconfig.json'], freshConsumer);
  for (const mode of ['zoneless', 'zone']) {
    process.stdout.write(run(process.execPath, ['key-value-browser.mjs', mode], freshConsumer));
  }

  writeFileSync(
    join(freshConsumer, 'query-browser.mjs'),
    readFileSync(join(root, 'tools/package/fixtures/query-browser.mjs'), 'utf8'),
  );
  for (const mode of ['zoneless', 'zone']) {
    process.stdout.write(run(process.execPath, ['query-browser.mjs', mode], freshConsumer));
  }

  writeFileSync(
    join(freshConsumer, 'query-devtools-browser.mjs'),
    readFileSync(join(root, 'tools/package/fixtures/query-devtools-browser.mjs'), 'utf8'),
  );
  for (const mode of ['zoneless', 'zone']) {
    process.stdout.write(run(process.execPath, ['query-devtools-browser.mjs', mode], freshConsumer));
  }

  writeFileSync(
    join(freshConsumer, 'query-devtools-provider.mjs'),
    readFileSync(join(root, 'tools/package/fixtures/query-devtools-provider.mjs'), 'utf8'),
  );
  for (const mode of ['zoneless', 'zone']) {
    process.stdout.write(run(process.execPath, ['query-devtools-provider.mjs', mode, 'default'], freshConsumer));
    process.stdout.write(
      run(
        process.execPath,
        ['--conditions=development', 'query-devtools-provider.mjs', mode, 'development'],
        freshConsumer,
      ),
    );
  }

  // Resolve the packed export map, without workspace aliases, alongside an ordinary clr-lift consumer.
  const {build} = createRequire(import.meta.resolve('@angular/build/package.json'))('esbuild');
  const {transformAsync} = createRequire(import.meta.resolve('@angular/build/package.json'))('@babel/core');
  const {default: angularLinker} = await import('@angular/compiler-cli/linker/babel');
  for (const condition of ['production', 'development']) {
    const bundle = await build({
      stdin: {
        contents:
          "import {provideQueryDevtools} from 'clr-lift/devtools'; import {SpinnerComponent} from 'clr-lift'; console.log(SpinnerComponent, provideQueryDevtools());",
        resolveDir: freshConsumer,
      },
      absWorkingDir: freshConsumer,
      bundle: true,
      write: false,
      format: 'esm',
      platform: 'browser',
      minify: true,
      metafile: true,
      conditions: [condition],
      external: ['@angular/*', '@clr/*', 'ngx-lift', 'rxjs', 'rxjs/*', 'node-forge'],
      define: {ngDevMode: condition === 'development' ? 'true' : 'false', ngJitMode: 'false'},
      plugins: [
        {
          name: 'angular-package-linker',
          setup(build) {
            build.onLoad({filter: /\.mjs$/}, async ({path}) => {
              const result = await transformAsync(readFileSync(path, 'utf8'), {
                filename: path,
                plugins: [[angularLinker, {linkerJitMode: false}]],
                configFile: false,
                babelrc: false,
              });
              return {contents: result.code, loader: 'js'};
            });
          },
        },
      ],
    });
    const inputs = Object.keys(bundle.metafile.inputs);
    const hasRenderer = bundle.outputFiles.some((file) => file.text.includes('cll-query-devtools'));
    assert.equal(hasRenderer, condition === 'development', `${condition} bundle devtools renderer isolation`);
    assert.equal(
      inputs.some((path) => path.endsWith('clr-lift-devtools-development.mjs')),
      condition === 'development',
    );
    process.stdout.write(
      `Packed ${condition} import graph: devtools renderer ${hasRenderer ? 'included' : 'excluded'}.\n`,
    );
  }

  writeFileSync(
    join(freshConsumer, 'consumer.ts'),
    `
import {computedAsync, isURL, QueryClient, IdleDetectionService, IdleDetectionState, provideQueryClient, QueryTimeoutError, queryResource, queryResources, QueryResourceItem, QueryClientDiagnostics, fetchQueryObservable, observeQueryObservable, ByteConverterPipe, controlValue, isNotEmpty, provideK8sRetryBackoffConfig} from 'ngx-lift';
import {of, type Observable} from 'rxjs';
import {SpinnerComponent, TooltipDirective, TranslationService, QueryDevtoolsComponent} from 'clr-lift';
const devtools: typeof QueryDevtoolsComponent = QueryDevtoolsComponent;
void devtools;
import {FormControl} from '@angular/forms';
const valid: boolean = isURL('https://example.technology');
function computedTypes() {
  const value: number = computedAsync(() => of(42), {initialValue: 0, onError: () => 0})();
  const optional: number | undefined = computedAsync<number | undefined>(() => of(42), {initialValue: 0, onError: () => undefined})();
  // @ts-expect-error Legacy error-as-data behavior is no longer supported.
  computedAsync<number>(() => of(42), {throwOnError: false});
  // @ts-expect-error A numeric signal cannot use an undefined fallback.
  computedAsync<number>(() => of(42), {initialValue: 0, onError: () => undefined});
  void [value, optional];
}
void computedTypes;

const client = new QueryClient();
const definition = {key: ['fresh-users'], loader: () => of([{id: 1}])};
const users: Promise<{id: number}[]> = client.fetchQuery(definition);
const refetched: Promise<{id: number}[]> | undefined = client.refetchQuery<{id: number}[]>(definition.key);
void refetched;
const users$: Observable<{id: number}[]> = fetchQueryObservable(client, definition);
const snapshots$ = observeQueryObservable(client, definition);
const queryProviders = provideQueryClient({queryDefaults: {
  retry: {maxAttempts: 2, shouldRetry: () => false, delayMs: 10}, deadlineMs: 5000, refetchOnFocus: true,
}});
const diagnostics: QueryClientDiagnostics = client.getDiagnostics();
function resources() {
  const query = queryResource(() => definition, {refetchOnReconnect: true});
  const initialError: boolean = query.isInitialError();
  const refreshError: boolean = query.isRefreshError();
  const rows = queryResources(() => [1, 2], id => ({key: ['fresh-items', id], loader: () => of({id})}));
  const row: QueryResourceItem<{id: number}, number> = rows()[0];
  const id: number = row.item();
  const count: number = row.failureCount();
  const retryAt: number | null = row.nextRetryAt();
  for (const entry of diagnostics.entries) {
    const failures: number = entry.failureCount;
    const nextRetry: number | null = entry.nextRetryAt;
    void [failures, nextRetry];
  }
  rows.destroy(); query.destroy();
  return [initialError, refreshError, id, count, retryAt];
}
void [users, users$, snapshots$, queryProviders, diagnostics, resources, new QueryTimeoutError(5)];
function idleState(service: IdleDetectionService) {
  const state$: Observable<IdleDetectionState> = service.observeState();
  return state$;
}
void idleState;
const spinner: typeof SpinnerComponent = SpinnerComponent;
const tooltip: typeof TooltipDirective = TooltipDirective;
function format(pipe: ByteConverterPipe) {return pipe.transform(1024, 'zh-CN');}
function form() {return controlValue<string>(new FormControl('', {nonNullable: true}));}
function translations(service: TranslationService) {return service.locale();}
function emptiness(items: string[] | undefined) {
  if (items != null && isNotEmpty(items)) { const defined: string[] = items; void defined; }
}
const retryProviders = provideK8sRetryBackoffConfig({maxAttempts: 3, jitter: 'none'});
void [valid, client, spinner, tooltip, format, form, translations, emptiness, retryProviders];
`,
  );

  run(
    'pnpm',
    [
      'exec',
      'tsc',
      '--noEmit',
      '--strict',
      '--skipLibCheck',
      'false',
      '--moduleResolution',
      'bundler',
      '--module',
      'esnext',
      '--target',
      'es2022',
      '--types',
      'node',
      'consumer.ts',
    ],
    freshConsumer,
  );

  writeFileSync(
    join(freshConsumer, 'consumer.mjs'),
    `import '@angular/compiler';
import assert from 'node:assert/strict';
import {isURL, range, serializeQueryKey, QueryClient, QueryTimeoutError, provideQueryClient, queryResources, fetchQueryObservable, observeQueryObservable} from 'ngx-lift';
import {of, throwError, firstValueFrom} from 'rxjs';
import {JSDOM} from 'jsdom';
const dom = new JSDOM('<html><body></body></html>');
for (const key of ['document', 'window', 'HTMLElement', 'Element', 'Node', 'CustomEvent', 'customElements']) globalThis[key] = dom.window[key];
const {SpinnerComponent} = await import('clr-lift');
assert.equal(isURL('https://example.technology'), true);
assert.deepEqual(range(3), [0,1,2]);
assert.equal(serializeQueryKey(['a',{b:1}]), serializeQueryKey(['a',{b:1}]));
assert.equal(typeof SpinnerComponent, 'function');
for (const api of [provideQueryClient, queryResources, observeQueryObservable]) assert.equal(typeof api, 'function');
const client = new QueryClient();
try {
  const definition = {key: ['installed-native'], loader: () => of(42), staleTime: Infinity};
  assert.equal(await firstValueFrom(fetchQueryObservable(client, definition)), 42);
  let attempts = 0;
  assert.equal(await client.fetchQuery({key: ['installed-retry'],
    loader: () => ++attempts === 1 ? throwError(() => new Error('temporary')) : of(43),
    retry: {maxAttempts: 2, shouldRetry: () => true, delayMs: 0},
  }), 43);
  assert.equal(attempts, 2);
  const diagnostics = client.getDiagnostics();
  assert.equal(diagnostics.pendingRequestCount, 0);
  assert.equal(diagnostics.entryCount, 2);
  assert.ok(diagnostics.entries.every(entry => entry.failureCount === 0 && entry.nextRetryAt === null));
  await assert.rejects(client.fetchQuery({key: ['installed-deadline'],
    loader: () => new Promise(() => {}), deadlineMs: 5,
  }), QueryTimeoutError);
} finally {client.destroy(); dom.window.close();}
`,
  );
  run(process.execPath, ['consumer.mjs'], freshConsumer);

  console.log('Tarball consumer: package exports, public types, and fresh peer install passed.');
  console.log(
    'Verified fresh peer installation with strict TypeScript checks; browser DOM supplied for Clarity import.',
  );
} finally {
  rmSync(consumer, {recursive: true, force: true});
  rmSync(freshConsumer, {recursive: true, force: true});
}
