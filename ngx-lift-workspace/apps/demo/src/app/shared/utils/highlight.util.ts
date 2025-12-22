import hljs from 'highlight.js/lib/core';

export function highlight(code: string, language = 'typescript') {
  return hljs.highlight(code.trim(), {language}).value;
}
