import assert from 'node:assert/strict';
import {
  mkdtempSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  writeFileSync,
  symlinkSync,
  rmSync,
  copyFileSync,
} from 'node:fs';
import {tmpdir} from 'node:os';
import {join, resolve} from 'node:path';
import {spawnSync} from 'node:child_process';

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
import {isURL, QueryClient, defineQuery, fetchQueryObservable, observeQueryObservable, ByteConverterPipe, controlValue, isEmpty, isNotEmpty, provideK8sRetryBackoffConfig} from 'ngx-lift';
import {of, type Observable} from 'rxjs';
import {SpinnerComponent, TooltipDirective, TranslationService} from 'clr-lift';
import {FormControl} from '@angular/forms';
const valid: boolean = isURL('https://example.technology');
const client = new QueryClient();
const definition = defineQuery({key: ['package-users'], loader: () => of([{id: 1}])});
const users: Promise<{id: number}[]> = client.fetchQuery(definition);
const users$: Observable<{id: number}[]> = fetchQueryObservable(client, definition);
const snapshots$ = observeQueryObservable(client, definition);
void [users, users$, snapshots$];
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
  copyFileSync(join(root, '.npmrc'), join(freshConsumer, '.npmrc'));
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
        },
        devDependencies: {
          '@types/node': '^22.0.0',
          '@types/node-forge': '^1.3.11',
          typescript: '^5.9.0',
        },
      },
      null,
      2,
    ),
  );

  run('pnpm', ['install', '--prefer-offline', '--no-frozen-lockfile'], freshConsumer, 60000);

  writeFileSync(
    join(freshConsumer, 'consumer.ts'),
    `
import {isURL, QueryClient, ByteConverterPipe, controlValue, isNotEmpty, provideK8sRetryBackoffConfig} from 'ngx-lift';
import {SpinnerComponent, TooltipDirective, TranslationService} from 'clr-lift';
import {FormControl} from '@angular/forms';
const valid: boolean = isURL('https://example.technology');
const client = new QueryClient();
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
    `import '@angular/compiler'; import assert from 'node:assert/strict'; import {isURL, range, serializeQueryKey} from 'ngx-lift'; import {JSDOM} from 'jsdom'; const dom = new JSDOM('<html><body></body></html>'); for (const key of ['document', 'window', 'HTMLElement', 'Element', 'Node', 'CustomEvent', 'customElements']) globalThis[key] = dom.window[key]; const {SpinnerComponent} = await import('clr-lift'); assert.equal(isURL('https://example.technology'), true); assert.deepEqual(range(3), [0,1,2]); assert.equal(serializeQueryKey(['a',{b:1}]), serializeQueryKey(['a',{b:1}])); assert.equal(typeof SpinnerComponent, 'function'); dom.window.close();`,
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
