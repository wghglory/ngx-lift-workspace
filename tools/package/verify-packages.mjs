import assert from 'node:assert/strict';
import {mkdtempSync, mkdirSync, readdirSync, readFileSync, writeFileSync, symlinkSync, rmSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join, resolve} from 'node:path';
import {spawnSync} from 'node:child_process';

const root = process.cwd();
const consumer = mkdtempSync(join(tmpdir(), 'ngx-lift-consumer-'));
function run(command, args, cwd = consumer) {
  const result = spawnSync(command, args, {cwd, encoding: 'utf8', timeout: 60000});
  if (result.error || result.status !== 0)
    throw new Error(`${command} failed: ${result.stderr || result.stdout || result.error}`);
  return result.stdout;
}
try {
  const modules = join(consumer, 'node_modules');
  mkdirSync(modules);
  for (const entry of readdirSync(join(root, 'node_modules'))) {
    if (entry.startsWith('.') || ['ngx-lift', 'clr-lift'].includes(entry)) continue;
    symlinkSync(join(root, 'node_modules', entry), join(modules, entry), 'dir');
  }
  for (const name of ['ngx-lift', 'clr-lift']) {
    const pack = JSON.parse(
      run('npm', ['pack', '--json', '--ignore-scripts', '--pack-destination', consumer], join(root, 'dist/libs', name)),
    )[0];
    const destination = join(consumer, name);
    mkdirSync(destination);
    run('tar', ['-xzf', join(consumer, pack.filename), '-C', destination]);
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
import {isURL, QueryClient, ByteConverterPipe, controlValue} from 'ngx-lift';
import {SpinnerComponent, TooltipDirective, TranslationService} from 'clr-lift';
import {FormControl} from '@angular/forms';
const valid: boolean = isURL('https://example.technology');
const client = new QueryClient();
const spinner: typeof SpinnerComponent = SpinnerComponent;
const tooltip: typeof TooltipDirective = TooltipDirective;
function format(pipe: ByteConverterPipe) {return pipe.transform(1024, 'zh-CN');}
function form() {return controlValue<string>(new FormControl('', {nonNullable: true}));}
function translations(service: TranslationService) {return service.locale();}
void [valid, client, spinner, tooltip, format, form, translations];
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
    'consumer.ts',
  ]);
  writeFileSync(
    join(consumer, 'consumer.mjs'),
    `import '@angular/compiler'; import assert from 'node:assert/strict'; import {isURL, range, serializeQueryKey} from 'ngx-lift'; import {JSDOM} from 'jsdom'; const dom = new JSDOM('<html><body></body></html>'); for (const key of ['document', 'window', 'HTMLElement', 'Element', 'Node', 'CustomEvent', 'customElements']) globalThis[key] = dom.window[key]; const {SpinnerComponent} = await import('clr-lift'); assert.equal(isURL('https://example.technology'), true); assert.deepEqual(range(3), [0,1,2]); assert.equal(serializeQueryKey(['a',{b:1}]), serializeQueryKey(['a',{b:1}])); assert.equal(typeof SpinnerComponent, 'function'); dom.window.close();`,
  );
  run(process.execPath, ['consumer.mjs']);
  console.log('Tarball consumer: package exports, public types and runtime imports passed.');
  console.log(
    'Host dependencies reused; browser DOM supplied for Clarity import; this does not verify fresh peer installation, SSR/hydration, or other Angular majors.',
  );
} finally {
  rmSync(consumer, {recursive: true, force: true});
}
