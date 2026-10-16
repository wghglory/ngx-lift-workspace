import {HttpErrorResponse} from '@angular/common/http';
import {describe, expect, it, vi} from 'vitest';

import {copyableJson, valueRows} from './query-value-preview';

describe('bounded query value inspection', () => {
  it('pages a large array without rendering or serializing every item', () => {
    const data = Array.from({length: 100_000}, (_, id) => ({id}));
    expect(valueRows(data, new Map())).toHaveLength(1);
    const rows = valueRows(data, new Map([['$', 0]]));
    expect(rows).toHaveLength(102);
    expect(rows.at(-1)?.nextOffset).toBe(100);
    expect(valueRows(data, new Map([['$', 100]]))[1].label).toBe('100');
    expect(copyableJson(data)).toBeUndefined();
  });

  it('does not invoke getters or custom serializers, and handles cycles and bigint', () => {
    const getter = vi.fn();
    const data: Record<string, unknown> = {count: 10n};
    Object.defineProperty(data, 'secret', {get: getter, enumerable: true});
    data['self'] = data;
    data['toJSON'] = vi.fn();
    const rows = valueRows(data, new Map([['$', 0]]));
    expect(rows.map((row) => row.preview)).toEqual(expect.arrayContaining(['10n', '[Accessor]', '[Circular]']));
    expect(copyableJson(data)).toBeUndefined();
    expect(getter).not.toHaveBeenCalled();
    expect(data['toJSON']).not.toHaveBeenCalled();
  });

  it('expands Angular HTTP errors and their response bodies without invoking accessors', () => {
    const error = new HttpErrorResponse({
      status: 503,
      url: '/api/projects',
      error: {reason: 'temporarily unavailable'},
    });
    const rows = valueRows(
      error,
      new Map([
        ['$', 0],
        ['$["error"]', 0],
      ]),
    );
    expect(rows[0]).toMatchObject({expandable: true, expanded: true});
    expect(rows).toEqual(
      expect.arrayContaining([
        expect.objectContaining({label: 'status', preview: '503'}),
        expect.objectContaining({label: 'url', preview: '"/api/projects"'}),
        expect.objectContaining({label: 'reason', preview: '"temporarily unavailable"'}),
      ]),
    );
  });

  it('copies complete JSON faithfully, rejects sparse arrays and enforces a UTF-8 byte limit', () => {
    const data = {name: 'Alice', active: true, items: [1, null, 'x']};
    expect(JSON.parse(copyableJson(data) ?? '')).toEqual(data);
    expect(copyableJson(new Array(10))).toBeUndefined();
    expect(copyableJson('中'.repeat(100_000))).toBeUndefined();
    expect(valueRows('x'.repeat(10_000), new Map())[0].preview.length).toBeLessThan(2010);
  });

  it('recovers from inaccessible proxies and limits deeply expanded trees', () => {
    const proxy = new Proxy(
      {},
      {
        getPrototypeOf: () => {
          throw new Error('blocked');
        },
      },
    );
    expect(valueRows(proxy, new Map())[0].preview).toBe('[Unavailable]');
    let data: unknown = 'end';
    const expanded = new Map<string, number>();
    let path = '$';
    for (let i = 0; i < 100; i++) {
      data = {child: data};
      expanded.set(path, 0);
      path += '["child"]';
    }
    const rows = valueRows(data, expanded);
    expect(rows).toHaveLength(21);
    expect(rows.at(-1)?.expandable).toBe(false);
  });
});
