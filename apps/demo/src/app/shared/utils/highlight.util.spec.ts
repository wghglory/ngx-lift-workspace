import {describe, expect, it} from 'vitest';

import {highlight, highlightAsync} from './highlight.util';

describe('on-demand demo highlighting', () => {
  it('renders source markup safely before loading the engine', () => {
    expect(highlight('<script>alert("x")</script>')).toBe('&lt;script&gt;alert(&quot;x&quot;)&lt;/script&gt;');
  });

  it('highlights escaped source and preserves the copied text', async () => {
    const result = await highlightAsync(highlight('const value = "safe";'), 'typescript');
    expect(result).toContain('hljs-keyword');
    expect(result).toContain('safe');
  });

  it('falls back to escaped text for an unknown grammar', async () => {
    expect(await highlightAsync(highlight('<button>text</button>'), 'unknown')).toBe(
      '&lt;button&gt;text&lt;/button&gt;',
    );
  });
});
