import {readFileSync} from 'node:fs';
import {resolve} from 'node:path';
import ts from 'typescript';

function sourceFile(file: string) {
  const path = resolve(__dirname, '../../../../', file);
  return ts.createSourceFile(path, readFileSync(path, 'utf8'), ts.ScriptTarget.Latest, true);
}

function staticObject(node: ts.Expression | undefined): ts.ObjectLiteralExpression | undefined {
  if (!node) return undefined;
  if (ts.isAsExpression(node) || ts.isSatisfiesExpression(node)) return staticObject(node.expression);
  return ts.isObjectLiteralExpression(node) ? node : undefined;
}

function staticArray(node: ts.Expression | undefined): ts.ArrayLiteralExpression | undefined {
  if (!node) return undefined;
  if (ts.isAsExpression(node) || ts.isSatisfiesExpression(node)) return staticArray(node.expression);
  return ts.isArrayLiteralExpression(node) ? node : undefined;
}

function variableInitializer(source: ts.SourceFile, name: string): ts.Expression | undefined {
  for (const statement of source.statements) {
    if (!ts.isVariableStatement(statement)) continue;
    for (const declaration of statement.declarationList.declarations) {
      if (declaration.name.getText(source) === name) return declaration.initializer;
    }
  }
  return undefined;
}

export function dictionaryMessages(file: string, locale?: string): Record<string, string> {
  const source = sourceFile(file);
  let dictionary = staticObject(
    source.statements.find(ts.isVariableStatement)?.declarationList.declarations[0]?.initializer,
  );
  if (locale && dictionary)
    dictionary = staticObject(
      dictionary.properties.find(
        (property): property is ts.PropertyAssignment =>
          ts.isPropertyAssignment(property) && property.name.getText(source).replace(/['"]/g, '') === locale,
      )?.initializer,
    );
  if (!dictionary) throw new Error(`Missing dictionary ${file} ${locale}`);
  return Object.fromEntries(
    dictionary.properties.map((property) => {
      if (!ts.isPropertyAssignment(property) || !ts.isStringLiteralLike(property.initializer))
        throw new Error(`Expected static message in ${file}`);
      return [property.name.getText(source).replace(/^['"]|['"]$/g, ''), property.initializer.text];
    }),
  );
}

const registration = sourceFile('libs/clr-lift/src/lib/services/translation-registration.ts');
const supported = staticArray(variableInitializer(registration, 'supportedLocales'));
if (!supported) throw new Error('Expected static supported locales');

const switcher = sourceFile('apps/demo/src/app/core/components/language-switcher/language-switcher.component.ts');
const labels = staticObject(variableInitializer(switcher, 'LANGUAGE_LABELS'));
if (!labels) throw new Error('Expected static demo language labels');

const labelByCode = new Map<string, string>();
for (const property of labels.properties) {
  if (!ts.isPropertyAssignment(property) || !ts.isStringLiteral(property.initializer))
    throw new Error('Expected a static demo language label');
  const code = property.name.getText(switcher).replace(/^['"]|['"]$/g, '');
  labelByCode.set(code, property.initializer.text);
}

export const demoLocales = supported.elements.map((element) => {
  if (!ts.isStringLiteral(element)) throw new Error('Expected a static supported locale');
  const label = labelByCode.get(element.text);
  if (!label) throw new Error(`Missing demo language label for ${element.text}`);
  return {code: element.text, label};
});
