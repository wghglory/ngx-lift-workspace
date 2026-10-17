import assert from 'node:assert/strict';
import {readdirSync, readFileSync} from 'node:fs';
import {join, resolve} from 'node:path';
import {test} from 'node:test';
import {parseTemplate} from '@angular/compiler';
import ts from 'typescript';

import {dictionary} from '../i18n/check-translations.mjs';

const root = resolve(import.meta.dirname, '../..');
const pages = join(root, 'apps/demo/src/app');
const projectFiles = files(pages);
function files(dir) {
  return readdirSync(dir, {withFileTypes: true}).flatMap((entry) =>
    entry.isDirectory() ? files(join(dir, entry.name)) : [join(dir, entry.name)],
  );
}
function source(file) {
  return ts.createSourceFile(file, readFileSync(file, 'utf8'), ts.ScriptTarget.Latest, true);
}
function snippets(ast) {
  const result = new Map();
  function visit(node) {
    if (
      ts.isPropertyDeclaration(node) &&
      node.initializer &&
      ts.isCallExpression(node.initializer) &&
      node.initializer.expression.getText(ast) === 'highlight' &&
      ts.isStringLiteralLike(node.initializer.arguments[0])
    )
      result.set(node.name.getText(ast), node.initializer.arguments[0].text);
    ts.forEachChild(node, visit);
  }
  visit(ast);
  return result;
}

const componentTemplates = new Map();
for (const file of projectFiles.filter((file) => file.endsWith('.component.ts'))) {
  const text = readFileSync(file, 'utf8');
  const selector = /selector:\s*'([^']+)'/.exec(text)?.[1];
  const templateUrl = /templateUrl:\s*'([^']+)'/.exec(text)?.[1];
  if (selector && templateUrl) componentTemplates.set(selector, readFileSync(resolve(file, '..', templateUrl), 'utf8'));
  if (selector && !templateUrl) {
    const ast = source(file);
    const constant = /template:\s*(\w+)/.exec(text)?.[1];
    for (const statement of ast.statements) {
      if (!ts.isVariableStatement(statement)) continue;
      for (const declaration of statement.declarationList.declarations) {
        if (declaration.name.getText(ast) === constant && ts.isStringLiteralLike(declaration.initializer)) {
          componentTemplates.set(selector, declaration.initializer.text);
        }
      }
    }
  }
}

function expandPreview(template) {
  return template.replace(
    /<(app-[\w-]+)\b[^>]*\/?\s*>/g,
    (match, selector) => componentTemplates.get(selector) ?? match,
  );
}

function visitTemplate(nodes, visitor) {
  for (const node of nodes) {
    visitor(node);
    const children = [
      node.children,
      node.empty?.children,
      ...(node.branches ?? []).map((branch) => branch.children),
      ...(node.cases ?? []).map((branch) => branch.children),
    ];
    for (const group of children) if (group) visitTemplate(group, visitor);
  }
}

test('every demo playground projects a preview and action buttons have behavior', () => {
  const errors = [];
  for (const file of projectFiles.filter((file) => file.endsWith('.component.html'))) {
    const template = readFileSync(file, 'utf8');
    visitTemplate(parseTemplate(template, file).nodes, (node) => {
      if (
        node.name === 'app-demo-playground' &&
        !node.children?.some((child) => child.attributes?.some((attribute) => attribute.name === 'preview'))
      )
        errors.push(`${file}: playground has no projected preview`);
      if (node.name === 'button') {
        const attrs = node.attributes ?? [];
        const nativeAction = attrs.some((attr) => attr.name === 'type' && ['submit', 'reset'].includes(attr.value));
        const directiveAction = [...attrs, ...(node.inputs ?? [])].some((attr) =>
          /^(clrTabLink|clrDropdownTrigger|clrSignpostTrigger|clrDropdownItem|cllTooltip)$/.test(attr.name),
        );
        if (!nativeAction && !directiveAction && !node.outputs?.some((event) => event.name === 'click')) {
          errors.push(`${file}: button has no action`);
        }
      }
    });
  }
  assert.deepEqual(errors, []);
});

test('component snippets import Component and preview bindings include the documented control inputs', () => {
  const errors = [];
  for (const file of projectFiles.filter((file) => file.endsWith('.component.ts') && !file.endsWith('.spec.ts'))) {
    const code = snippets(source(file));
    for (const [name, snippet] of code) {
      if (
        snippet.includes('@Component(') &&
        !/import\s*\{[^}]*\bComponent\b[^}]*\}\s*from\s*['"]@angular\/core/.test(snippet)
      ) {
        errors.push(`${file}: ${name} omits the Component import`);
      }
    }
    const htmlFile = file.replace(/\.ts$/, '.html');
    if (!projectFiles.includes(htmlFile)) continue;
    const html = readFileSync(htmlFile, 'utf8');
    for (const block of html.matchAll(/<app-demo-playground\b([\s\S]*?)>([\s\S]*?)<\/app-demo-playground>/g)) {
      const name = /\[tsCode\]="(\w+)"/.exec(block[1])?.[1];
      const preview = expandPreview(block[2]);
      for (const tag of (code.get(name) ?? '').matchAll(/<(cll-[\w-]+)\b([^>]*)>/g)) {
        const controls = [...preview.matchAll(new RegExp(`<${tag[1]}\\b([^>]*)>`, 'g'))];
        for (const attr of tag[2].matchAll(/(?:\[([\w-]+)\]|\b([\w-]+))=/g)) {
          const input = attr[1] ?? attr[2];
          if (['class', 'style', 'id', 'title'].includes(input)) continue;
          if (!controls.some((control) => control[1].includes(input))) {
            errors.push(`${file}: ${name} preview omits ${tag[1]}.${input}`);
          }
        }
      }
    }
  }
  assert.deepEqual(errors, []);
});

test('translated action labels do not expose method calls in any supported language', () => {
  const keys = new Set();
  for (const file of projectFiles.filter((file) => file.endsWith('.component.html'))) {
    const template = readFileSync(file, 'utf8');
    visitTemplate(parseTemplate(template, file).nodes, (node) => {
      if (node.name !== 'button') return;
      const content = template.slice(node.startSourceSpan.end.offset, node.endSourceSpan.start.offset);
      for (const key of content.matchAll(/'([\w-]+(?:\.[\w-]+)+)'/g)) keys.add(key[1]);
    });
  }
  const errors = [];
  for (const file of projectFiles.filter((file) => /demo\.l10n\.[\w-]+\.ts$/.test(file))) {
    const translations = dictionary(file);
    for (const key of keys)
      if (/\b\w+\.\w+\(/.test(translations[key] ?? '')) errors.push(`${file}: ${key} exposes a method call`);
  }
  assert.deepEqual(errors, []);
});

test('placement and coalescing examples present their actual components, services and HTML', () => {
  const dir = join(pages, 'ngx-lib/pages/query/query-resource');
  const code = snippets(source(join(dir, 'query-resource.component.ts')));
  const normalize = (text) => text.replace(/\s+/g, '');
  assert.equal(
    normalize(code.get('authHtmlCode')),
    normalize(readFileSync(join(dir, 'auth-placement-demo.component.html'), 'utf8')),
  );
  for (const [file, className, snippet] of [
    ['auth-placement-demo.component.ts', 'AuthPlacementDemoComponent', 'authServiceCode'],
    ['query-placement-state.ts', 'AuthStateService', 'authServiceCode'],
    ['query-placement-state.ts', 'DatabaseStateService', 'databaseServiceCode'],
    ['project.service.ts', 'ProjectService', 'componentPlacementCode'],
    ['metrics.service.ts', 'MetricsService', 'coalesceCode'],
  ]) {
    const ast = source(join(dir, file));
    const declaration = ast.statements.find((node) => ts.isClassDeclaration(node) && node.name.text === className);
    assert.ok(normalize(code.get(snippet)).includes(normalize(declaration.getText(ast))), className);
  }
  for (const [file, className, snippet] of [
    ['project-detail-demo.component.ts', 'ProjectDetailDemoComponent', 'componentPlacementCode'],
    ['metrics-widget.component.ts', 'MetricsWidgetComponent', 'coalesceCode'],
  ]) {
    const ast = source(join(dir, file));
    const declaration = ast.statements.find((node) => ts.isClassDeclaration(node) && node.name.text === className);
    for (const member of declaration.members) {
      assert.ok(
        normalize(code.get(snippet)).includes(normalize(member.getText(ast))),
        `${className}: ${member.name.text}`,
      );
    }
  }
  assert.equal(code.get('componentPlacementHtmlCode'), '<app-project-detail-demo projectId="website-redesign" />');
});

test('interactive code excerpts contain the actual handlers driving their previews', () => {
  const contracts = {
    'query/mutate-resource/mutate-resource': {
      invalidationCode: ['addMemberMutation', 'submitNewMember'],
      concurrencyCode: ['runSimulatedMutation', 'triggerConcurrencyTest', 'clearLogs'],
      errorCode: ['saveSettingsMutation', 'onSaveSettings'],
    },
    'query/query-resource/query-resource': {
      coalesceCode: ['metricsService', 'metricsWidget', 'refreshMetrics'],
      pollCode: ['pollingQuery', 'togglePolling'],
      mutationCode: ['addUserMutation', 'submitNewUser'],
    },
    'signals/resource-async/resource-async': {basicCode: ['pageNumber', 'userRef', 'changeUserId']},
    'signals/to-signal-form/to-signal-form': {quickStartTs: ['quickForm', 'saveQuickProfile', 'resetQuickProfile']},
    'operators/k8s-retry-backoff/k8s-retry-backoff': {
      simulationCode: ['executeSimulation', 'clearLogs'],
      delaySimulationCode: ['calculateDelay'],
    },
    'interceptors/k8s-retry-backoff-interceptor/k8s-retry-backoff-interceptor': {
      simulationCode: ['executeRequest', 'clearLogs'],
      overrideSimulationCode: ['testProbeOptOut', 'testWorkloadCustom', 'testOverride'],
    },
  };
  const normalize = (text) => text.replace(/\s+/g, '');
  for (const [component, contract] of Object.entries(contracts)) {
    const ast = source(join(pages, 'ngx-lib/pages', `${component}.component.ts`));
    const members = ast.statements.find(ts.isClassDeclaration).members;
    const code = snippets(ast);
    for (const [snippet, names] of Object.entries(contract))
      for (const name of names) {
        const member = members.find((member) => member.name?.getText(ast) === name);
        assert.ok(
          normalize(code.get(snippet)).includes(normalize(member.getText(ast))),
          `${component}: ${snippet} differs from live ${name}`,
        );
      }
  }
});

test('the datagrid tutorial displays the compiled preview component', () => {
  const example = snippets(source(join(pages, 'clr-lib/pages/dg-state/dg-state.component.ts'))).get('typescriptCode');
  const actual = readFileSync(
    join(pages, 'clr-lib/shared/components/user-datagrid/user-datagrid.component.ts'),
    'utf8',
  );
  assert.equal(example.trim(), actual.trim());
});

test('the first computed example shows the fields and handler used by the preview', () => {
  const ast = source(join(pages, 'ngx-lib/pages/signals/computed-async/computed-async.component.ts'));
  const example = snippets(ast).get('starterCode');
  const shown = ts.createSourceFile('starter.ts', example, ts.ScriptTarget.Latest, true);
  const actualClass = ast.statements.find(ts.isClassDeclaration);
  const shownClass = shown.statements.find(ts.isClassDeclaration);
  const compact = (text) => text.replace(/\s+/g, '');
  for (const name of ['starterInput', 'starterValue', 'increment']) {
    const actual = actualClass.members.find((member) => member.name?.getText(ast) === name);
    const displayed = shownClass.members.find((member) => member.name?.getText(shown) === name);
    assert.ok(actual && displayed, `Missing ${name}`);
    assert.equal(compact(displayed.getText(shown)), compact(actual.getText(ast)));
  }
});
