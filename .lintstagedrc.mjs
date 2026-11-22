import {lstatSync} from 'node:fs';

// Prettier rejects explicit symlink paths. Agent client links are intentional, so skip them here.
const regularFiles = (files) =>
  files.filter((file) => {
    try {
      return !lstatSync(file).isSymbolicLink();
    } catch {
      return false;
    }
  });

const args = (files) => files.map((file) => JSON.stringify(file)).join(' ');

export default {
  '*.{ts,tsx,js,jsx}': (files) => {
    const targets = regularFiles(files);
    return targets.length ? [`eslint --fix ${args(targets)}`, `prettier --write ${args(targets)}`] : [];
  },
  '*.{mjs,cjs,mts,cts,json,css,scss,md,html,yml,yaml}': (files) => {
    const targets = regularFiles(files);
    return targets.length ? [`prettier --write ${args(targets)}`] : [];
  },
};
