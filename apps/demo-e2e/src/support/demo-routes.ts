import {readFileSync} from 'node:fs';
import {resolve} from 'node:path';
import ts from 'typescript';

// Read route metadata without importing demo code into the browser test project.
const file = resolve(__dirname, '../../../demo/src/app/app.routes.ts');
const source = ts.createSourceFile(file, readFileSync(file, 'utf8'), ts.ScriptTarget.Latest, true);
const routes: string[] = [];

function collect(array: ts.ArrayLiteralExpression, parent: string) {
  for (const route of array.elements) {
    if (!ts.isObjectLiteralExpression(route)) throw new Error('Expected a static demo route');
    const properties = new Map(
      route.properties.filter(ts.isPropertyAssignment).map((property) => [property.name.getText(source), property]),
    );
    const path = properties.get('path')?.initializer;
    if (!path || !ts.isStringLiteral(path)) throw new Error('Expected a static demo route path');
    if (path.text === '**') continue;
    const fullPath = `${parent}/${path.text}`.replace(/\/$/, '').replace(/:[^/]+/g, 'example');
    if (properties.has('loadComponent')) routes.push(fullPath);
    const children = properties.get('children')?.initializer;
    if (children) {
      if (!ts.isArrayLiteralExpression(children)) throw new Error('Expected static demo route children');
      collect(children, fullPath);
    }
  }
}

for (const statement of source.statements) {
  if (!ts.isVariableStatement(statement)) continue;
  for (const declaration of statement.declarationList.declarations) {
    if (declaration.name.getText(source) !== 'routes') continue;
    if (!declaration.initializer || !ts.isArrayLiteralExpression(declaration.initializer))
      throw new Error('Expected static demo routes');
    collect(declaration.initializer, '');
  }
}
if (!routes.length) throw new Error('No demo routes discovered');

export const demoRoutes = [...new Set(routes)];
