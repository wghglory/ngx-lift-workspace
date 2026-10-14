import {readFileSync, readdirSync} from 'node:fs';
import {resolve, join} from 'node:path';
import {pathToFileURL} from 'node:url';
import ts from 'typescript';
import {parseTemplate} from '@angular/compiler';

export function dictionary(file) {
  const ast = ts.createSourceFile(file, readFileSync(file, 'utf8'), ts.ScriptTarget.Latest, true);
  const declaration = ast.statements.find(ts.isVariableStatement)?.declarationList.declarations[0];
  function value(node) {
    if (ts.isStringLiteralLike(node)) return node.text;
    if (!ts.isObjectLiteralExpression(node)) throw new Error(`Non-static dictionary: ${file}`);
    const result = {};
    for (const item of node.properties) {
      const key = item.name?.text;
      if (!ts.isPropertyAssignment(item) || key === undefined || Object.hasOwn(result, key))
        throw new Error(`Invalid or duplicate key in ${file}: ${key}`);
      Object.defineProperty(result, key, {value: value(item.initializer), enumerable: true});
    }
    return result;
  }
  return value(declaration.initializer);
}
function files(dir) {
  return readdirSync(dir, {withFileTypes: true}).flatMap((entry) =>
    entry.isDirectory() ? files(join(dir, entry.name)) : [join(dir, entry.name)],
  );
}
export function validateDictionary(english, translated, {complete = true} = {}) {
  const errors = [];
  for (const [key, message] of Object.entries(english)) {
    if (!Object.hasOwn(translated, key)) {
      if (complete) errors.push(`Missing key: ${key}`);
      continue;
    }
    if (!translated[key].trim()) errors.push(`Empty translation: ${key}`);
    if (/@-@|XQ\d+XQZ|§\d+§/.test(translated[key]) && !/@-@|XQ\d+XQZ|§\d+§/.test(message))
      errors.push(`Translation artifact: ${key}`);
    const options = [
      ...message.matchAll(
        /"(switch|merge|concat|exhaust|idle|loading|reloading|resolved|error|local|parallel|info|warning|success|danger|neutral|unknown|log|table|warn|debug)"/g,
      ),
    ].map((match) => match[1]);
    if (options.some((option) => !translated[key].includes(option))) errors.push(`Changed API option: ${key}`);
    const identifiers = [...message.matchAll(/<code>([A-Za-z_$][\w.$]*)<\/code>/g)].map((match) => match[1]);
    if (identifiers.some((identifier) => identifier !== 'modern' && !translated[key].includes(identifier)))
      errors.push(`Changed code identifier: ${key}`);
    const placeholders = (text) =>
      JSON.stringify(
        (text.match(/\{\{[^}]+\}\}|\{(?:\d+|[A-Za-z_]\w*)\}/g) ?? []).map((value) => value.replace(/\s/g, '')).sort(),
      );
    if (placeholders(message) !== placeholders(translated[key])) errors.push(`Placeholder mismatch: ${key}`);
  }
  for (const key of Object.keys(translated)) if (!Object.hasOwn(english, key)) errors.push(`Unknown key: ${key}`);
  return errors;
}
export function usedKeys(source, file) {
  const keys = new Set();
  if (file.endsWith('.ts')) {
    const ast = ts.createSourceFile(file, source, ts.ScriptTarget.Latest, true);
    const visit = (node) => {
      if (
        ts.isCallExpression(node) &&
        ts.isPropertyAccessExpression(node.expression) &&
        node.expression.name.text === 'translate' &&
        ts.isStringLiteralLike(node.arguments[0] ?? {})
      )
        keys.add(node.arguments[0].text);
      ts.forEachChild(node, visit);
    };
    visit(ast);
  } else {
    const result = parseTemplate(source, file);
    if (result.errors?.length) throw new Error(`Invalid template: ${file}`);
    const seen = new Set();
    function visit(node, inTranslate = false) {
      if (!node || typeof node !== 'object' || seen.has(node)) return;
      seen.add(node);
      const translated = inTranslate || (node.name === 'translate' && node.constructor.name === 'BindingPipe');
      if (translated && node.constructor.name === 'LiteralPrimitive' && typeof node.value === 'string')
        keys.add(node.value);
      for (const [name, child] of Object.entries(node)) {
        if (['sourceSpan', 'keySpan', 'valueSpan', 'nameSpan', 'parent', 'tokens', 'args'].includes(name)) continue;
        if (Array.isArray(child)) child.forEach((item) => visit(item, translated));
        else visit(child, translated);
      }
    }
    result.nodes.forEach((node) => visit(node));
  }
  return keys;
}
export function checkWorkspace(root = process.cwd()) {
  const dir = join(root, 'apps/demo/src/app/core/l10n');
  const english = dictionary(join(dir, 'demo.l10n.en.ts'));
  const errors = [],
    coverage = {};
  for (const file of files(dir).filter((file) => /demo\.l10n\..+\.ts$/.test(file))) {
    const locale = file.match(/demo\.l10n\.(.+)\.ts$/)[1];
    const messages = dictionary(file);
    errors.push(...validateDictionary(english, messages, {complete: true}).map((error) => `${locale}: ${error}`));
    coverage[locale] = {
      present: Object.keys(messages).length,
      total: Object.keys(english).length,
      complete: true,
    };
  }
  for (const locale of ['en', 'zh-cn', 'zh-tw', 'de', 'es', 'fr', 'ja', 'ko', 'nl', 'pt-br', 'ru'])
    if (!coverage[locale]) errors.push(`Missing promised demo locale: ${locale}`);
  for (const file of files(join(root, 'apps/demo/src/app')).filter(
    (file) => /\.(html|ts)$/.test(file) && !file.endsWith('.spec.ts') && !file.includes('/l10n/'),
  )) {
    for (const key of usedKeys(readFileSync(file, 'utf8'), file))
      if (!Object.hasOwn(english, key)) errors.push(`${file}: missing English key ${key}`);
  }
  for (const file of files(join(root, 'libs/clr-lift/src/lib')).filter((file) => file.endsWith('.l10n.ts'))) {
    const locales = dictionary(file);
    for (const [locale, messages] of Object.entries(locales))
      errors.push(...validateDictionary(locales.en, messages).map((error) => `${file} ${locale}: ${error}`));
    for (const locale of ['en', 'zh-CN', 'zh-TW', 'de', 'es', 'fr', 'ja', 'ko', 'nl', 'pt-BR', 'ru'])
      if (!Object.hasOwn(locales, locale)) errors.push(`${file}: unsupported promised locale ${locale}`);
  }
  return {errors, coverage};
}
if (import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  const {errors, coverage} = checkWorkspace();
  console.log(JSON.stringify({coverage, errors}, null, 2));
  if (errors.length) process.exitCode = 1;
}
