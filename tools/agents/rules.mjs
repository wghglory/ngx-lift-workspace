import {mkdirSync, readFileSync, readdirSync, writeFileSync} from 'node:fs';
import {dirname, join, resolve} from 'node:path';
import {fileURLToPath} from 'node:url';

const root = fileURLToPath(new URL('../../', import.meta.url));
const canonical = join(root, '.agents/rules');
const clients = [
  {directory: '.cursor/rules', extension: (name) => (name === 'README' ? 'md' : 'mdc')},
  {directory: '.claude/rules', extension: () => 'md'},
];

export const ruleTargets = () =>
  readdirSync(canonical)
    .filter((name) => name.endsWith('.md'))
    .flatMap((name) => {
      const base = name.slice(0, -3);
      const contents = readFileSync(join(canonical, name), 'utf8');
      return clients.map(({directory, extension}) => ({
        target: join(root, directory, `${base}.${extension(base)}`),
        contents,
      }));
    });

export const ruleDrift = () =>
  ruleTargets()
    .filter(({target, contents}) => {
      try {
        return readFileSync(target, 'utf8') !== contents;
      } catch {
        return true;
      }
    })
    .map(({target}) => target);

export const syncRules = () => {
  for (const {target, contents} of ruleTargets()) {
    mkdirSync(dirname(target), {recursive: true});
    writeFileSync(target, contents);
  }
};

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  if (process.argv.includes('--check')) {
    const drift = ruleDrift();
    if (drift.length) {
      console.error(`Generated rules are out of date: ${drift.join(', ')}. Run pnpm run rules:generate.`);
      process.exitCode = 1;
    }
  } else {
    syncRules();
  }
}
