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

const switcher = sourceFile('apps/demo/src/app/core/components/language-switcher/language-switcher.component.ts');
const component = switcher.statements.find(ts.isClassDeclaration);
const languages = component?.members.find(
  (member) => ts.isPropertyDeclaration(member) && member.name.getText(switcher) === 'languages',
);
if (
  !languages ||
  !ts.isPropertyDeclaration(languages) ||
  !languages.initializer ||
  !ts.isArrayLiteralExpression(languages.initializer)
)
  throw new Error('Expected static supported demo languages');

export const demoLocales = languages.initializer.elements.map((element) => {
  if (!ts.isObjectLiteralExpression(element)) throw new Error('Expected a static demo language');
  const values = Object.fromEntries(
    element.properties.map((property) => {
      if (!ts.isPropertyAssignment(property) || !ts.isStringLiteral(property.initializer))
        throw new Error('Expected a static language label');
      return [property.name.getText(switcher), property.initializer.text];
    }),
  );
  return {code: values['code'], label: values['label']};
});
