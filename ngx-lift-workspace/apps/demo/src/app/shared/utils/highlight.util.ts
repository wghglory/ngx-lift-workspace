import hljs from 'highlight.js/lib/core';
import typescript from 'highlight.js/lib/languages/typescript';

// Register typescript language
hljs.registerLanguage('typescript', typescript);

export function highlight(code: string, language = 'typescript') {
  return hljs.highlight(code.trim(), { language }).value;
}
