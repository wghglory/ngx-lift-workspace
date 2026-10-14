import {readFileSync} from 'node:fs';
import {resolve} from 'node:path';
import {pathToFileURL} from 'node:url';

/** Verifies that heavyweight demo dependencies stay behind their asynchronous boundaries. */
export function validateLazyDependencies(stats) {
  const outputs = stats.outputs ?? {};
  const errors = [];
  const main = Object.keys(outputs).find((file) => outputs[file].entryPoint?.endsWith('/main.ts'));
  const certificate = Object.keys(outputs).find((file) =>
    outputs[file].entryPoint?.endsWith('/certificate-demo.component.ts'),
  );
  const fileReader = Object.keys(outputs).find((file) =>
    outputs[file].entryPoint?.endsWith('/file-reader-demo.component.ts'),
  );
  if (!main || !certificate || !fileReader) return ['Missing application or certificate route build metadata'];
  function staticClosure(root) {
    const visited = new Set();
    const queue = [root];
    while (queue.length) {
      const file = queue.pop();
      if (visited.has(file)) continue;
      visited.add(file);
      for (const dependency of outputs[file]?.imports ?? []) {
        if (dependency.kind === 'import-statement' && outputs[dependency.path]) queue.push(dependency.path);
      }
    }
    return visited;
  }
  for (const dependency of ['highlight.js', 'node-forge']) {
    const chunks = Object.keys(outputs).filter((file) =>
      Object.keys(outputs[file].inputs ?? {}).some((input) => input.includes(`${dependency}/`)),
    );
    if (!chunks.length) errors.push(`Missing ${dependency} build metadata`);
    if (chunks.some((file) => staticClosure(main).has(file))) errors.push(`${dependency} is in the initial bundle`);
    for (const [route, label] of [
      [certificate, 'certificate'],
      [fileReader, 'file reader'],
    ])
      if (chunks.some((file) => staticClosure(route).has(file)))
        errors.push(`${dependency} loads synchronously with the ${label} route`);
  }
  return errors;
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  const errors = validateLazyDependencies(JSON.parse(readFileSync('dist/apps/demo/stats.json', 'utf8')));
  if (errors.length) {
    errors.forEach((error) => console.error(error));
    process.exitCode = 1;
  } else console.log('Verified lazy highlighting and deferred certificate parsing from production build metadata.');
}
