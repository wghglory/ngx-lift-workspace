import {execFileSync} from 'node:child_process';
import {lstatSync} from 'node:fs';
import {fileURLToPath} from 'node:url';

const prettier = fileURLToPath(new URL('../../node_modules/prettier/bin/prettier.cjs', import.meta.url));
const files = process.argv.slice(2).filter((file) => {
  try {
    return !lstatSync(file).isSymbolicLink();
  } catch {
    return false;
  }
});

if (files.length) {
  execFileSync(process.execPath, [prettier, '--write', ...files], {stdio: 'inherit'});
}
