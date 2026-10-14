/** Prepares safe source markup synchronously; syntax highlighting loads at the rendering component. */
export function highlight(code: string, _language = 'typescript'): string {
  void _language;
  return code
    .trim()
    .replace(
      /[&<>"']/g,
      (character) => ({'&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'})[character] ?? character,
    );
}

let engine: Promise<(typeof import('highlight.js/lib/core'))['default']> | undefined;

/** Loads the highlighting engine and demo grammars once, when a code view requests them. */
async function loadEngine() {
  if (!engine) {
    engine = Promise.all([
      import('highlight.js/lib/core'),
      import('highlight.js/lib/languages/javascript'),
      import('highlight.js/lib/languages/scss'),
      import('highlight.js/lib/languages/typescript'),
      import('highlight.js/lib/languages/xml'),
    ])
      .then(([core, javascript, scss, typescript, xml]) => {
        const highlighter = core.default;
        highlighter.registerLanguage('javascript', javascript.default);
        highlighter.registerLanguage('scss', scss.default);
        highlighter.registerLanguage('typescript', typescript.default);
        highlighter.registerLanguage('xml', xml.default);
        highlighter.registerLanguage('html', xml.default);
        return highlighter;
      })
      .catch((error: unknown) => {
        engine = undefined;
        throw error;
      });
  }
  return engine;
}

/** Decodes prepared markup or legacy highlight spans into source text. */
export function sourceText(markup: string): string {
  const text = /class=["']hljs-/.test(markup) ? markup.replace(/<\/?span\b[^>]*>/g, '') : markup;
  return text.replace(
    /&(amp|lt|gt|quot|#39|#x27);/g,
    (_, entity: string) => ({amp: '&', lt: '<', gt: '>', quot: '"', '#39': "'", '#x27': "'"})[entity] ?? entity,
  );
}

/** Highlights source on demand, retaining compatibility with prepared and legacy span markup. */
export async function highlightAsync(markup: string, language: string): Promise<string> {
  const code = sourceText(markup);
  const highlighter = await loadEngine();
  return highlighter.getLanguage(language) ? highlighter.highlight(code, {language}).value : highlight(code);
}
