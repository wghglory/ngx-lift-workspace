import assert from 'node:assert/strict';
import test from 'node:test';

import {validateLazyDependencies} from './check-lazy-dependencies.mjs';

function fixture() {
  return {
    outputs: {
      'main.js': {entryPoint: 'src/main.ts', imports: [{path: 'route.js', kind: 'dynamic-import'}]},
      'route.js': {
        entryPoint: 'src/certificate-demo.component.ts',
        imports: [
          {path: 'forge.js', kind: 'dynamic-import'},
          {path: 'highlight.js', kind: 'dynamic-import'},
        ],
      },
      'reader.js': {entryPoint: 'src/file-reader-demo.component.ts', imports: []},
      'forge.js': {inputs: {'node_modules/node-forge/lib/forge.js': {}}},
      'highlight.js': {inputs: {'node_modules/highlight.js/lib/core.js': {}}},
    },
  };
}
test('accepts dynamic boundaries and rejects transitive imports of heavy dependencies', () => {
  const stats = fixture();
  assert.deepEqual(validateLazyDependencies(stats), []);
  stats.outputs['route.js'].imports[0].kind = 'import-statement';
  assert.deepEqual(validateLazyDependencies(stats), ['node-forge loads synchronously with the certificate route']);
  stats.outputs['main.js'].imports[0].kind = 'import-statement';
  assert.deepEqual(validateLazyDependencies(stats), [
    'node-forge is in the initial bundle',
    'node-forge loads synchronously with the certificate route',
  ]);
});
test('fails when required build metadata is missing', () => {
  assert.deepEqual(validateLazyDependencies({}), ['Missing application or certificate route build metadata']);
  const stats = fixture();
  delete stats.outputs['highlight.js'].inputs;
  assert.deepEqual(validateLazyDependencies(stats), ['Missing highlight.js build metadata']);
});
