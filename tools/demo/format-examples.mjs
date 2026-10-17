import {readdirSync, readFileSync, writeFileSync} from 'node:fs';
import {join, resolve} from 'node:path';
import prettier from 'prettier';
import ts from 'typescript';

const root = resolve(import.meta.dirname, '../..');
const write = process.argv.includes('--write');
const config = await prettier.resolveConfig(join(root, 'apps/demo/src/app/app.component.ts'));
const options = {...config, tabWidth: 2, useTabs: false};

function files(dir) {
  return readdirSync(dir, {withFileTypes: true}).flatMap((entry) =>
    entry.isDirectory() ? files(join(dir, entry.name)) : [join(dir, entry.name)],
  );
}

async function format(code, language, name) {
  let parser = language === 'html' ? 'angular' : language === 'json' ? 'jsonc' : language;
  if (!parser || parser === 'typescript') {
    parser =
      /html|templateUsage|rowCode/i.test(name) || /^\s*(<|@(if|for|switch)\s*\()/.test(code)
        ? 'angular'
        : /scss|css|styles/i.test(name)
          ? 'scss'
          : /^\s*(?:\/\/[^\n]*\n)*\s*\{/.test(code)
            ? 'jsonc'
            : 'typescript';
  }
  if (/^\s*(import|@Component)\b/.test(code)) parser = 'typescript';
  try {
    return (await prettier.format(code, {...options, parser})).trim();
  } catch (error) {
    if (parser !== 'typescript') throw error;
    if (code.includes('@Component(') && !code.includes('export class ')) {
      return (await prettier.format(`${code}\nexport class FormattingContext {}`, {...options, parser}))
        .replace(/\nexport class FormattingContext \{\}\n$/, '')
        .trim();
    }
    // Member excerpts need a class context; remove that context and its two-space margin afterward.
    const imports = code.match(/^import\b[\s\S]*?;[ \t]*(?:\n|$)/gm) ?? [];
    const types = code.match(/^(?:export )?interface \w+[^\{]*\{[^}]*\}[ \t]*(?:\n|$)/gm) ?? [];
    let members = code;
    for (const declaration of [...imports, ...types]) members = members.replace(declaration, '');
    const header = [...imports, ...types].map((text) => text.trim()).join('\n');
    const body = await prettier.format(`class FormattingContext {\n${members}\n}`, {...options, parser});
    const excerpt = body
      .replace(/^class FormattingContext \{\n/, '')
      .replace(/\n\}\n$/, '')
      .split('\n')
      .map((line) => (line.startsWith('  ') ? line.slice(2) : line))
      .join('\n');
    return `${header ? `${await prettier.format(header, {...options, parser})}\n` : ''}${excerpt}`.trim();
  }
}

const changed = [];
for (const file of files(join(root, 'apps/demo/src/app')).filter(
  (file) => file.endsWith('.ts') && !file.endsWith('.spec.ts'),
)) {
  let text = readFileSync(file, 'utf8');
  const original = text;
  const ast = ts.createSourceFile(file, text, ts.ScriptTarget.Latest, true);
  const examples = [];
  function visit(node) {
    if (
      ts.isCallExpression(node) &&
      node.expression.getText(ast) === 'highlight' &&
      ts.isStringLiteralLike(node.arguments[0])
    ) {
      examples.push(node);
    }
    ts.forEachChild(node, visit);
  }
  visit(ast);
  for (const call of examples.reverse()) {
    const literal = call.arguments[0];
    const name = ts.isPropertyDeclaration(call.parent) ? call.parent.name.getText(ast) : 'example';
    const code = await format(literal.text.trim(), call.arguments[1]?.text, name);
    if (code === literal.text.trim()) continue;
    changed.push(`${file.slice(root.length + 1)}: ${name}`);
    const value = '`' + code.replaceAll('\\', '\\\\').replaceAll('`', '\\`').replaceAll('${', '\\${') + '`';
    text = text.slice(0, literal.getStart(ast)) + value + text.slice(literal.end);
  }
  if (write && text !== original) writeFileSync(file, text);
}
if (!write && changed.length) {
  process.stderr.write(`Examples need two-space formatting:\n${changed.join('\n')}\nRun pnpm run format:examples.\n`);
  process.exitCode = 1;
} else {
  process.stdout.write(
    write
      ? `Formatted ${changed.length} demo examples with two-space indentation.\n`
      : 'Demo examples use two-space indentation.\n',
  );
}
