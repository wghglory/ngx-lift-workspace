import {HttpErrorResponse} from '@angular/common/http';
import {describe, expect, it, vi} from 'vitest';

import {copyableJson, expandValueRows, valueRows} from './query-value-preview';

describe('bounded query value inspection', () => {
  it('opens one additional level or all previewed levels while preserving existing branches', () => {
    const data = {first: {second: {value: 42}}, other: {name: 'Alex'}};
    const initial = new Map([['$', 0]]);
    const next = expandValueRows(data, initial, 'next');
    expect(valueRows(data, next).some((row) => row.label === 'second')).toBe(true);
    expect(valueRows(data, next).some((row) => row.label === 'value')).toBe(false);
    const deeper = expandValueRows(data, next, 'next');
    expect(valueRows(data, deeper).some((row) => row.preview === '42')).toBe(true);
    expect(valueRows(data, expandValueRows(data, new Map(), 'all'))).toEqual(valueRows(data, deeper));
    expect(initial.size).toBe(1);
  });

  it('expands all within the current page, node and depth limits without invoking getters', () => {
    const getter = vi.fn();
    const data = Array.from({length: 100_000}, (_, id) => ({id, nested: {value: id}}));
    Object.defineProperty(data[100], 'hidden', {get: getter});
    const expanded = expandValueRows(data, new Map([['$', 100]]), 'all');
    const rows = valueRows(data, expanded);
    expect(expanded.get('$')).toBe(100);
    expect(rows[1].label).toBe('100');
    expect(rows.length).toBeLessThanOrEqual(500);
    expect(rows.at(-1)?.nextOffset).toBe(200);
    expect(getter).not.toHaveBeenCalled();
    let deep: unknown = 42;
    for (let index = 0; index < 30; index++) deep = {child: deep};
    const deepRows = valueRows(deep, expandValueRows(deep, new Map(), 'all'));
    expect(deepRows.at(-1)).toMatchObject({depth: 20, truncated: true, expandable: false});
    const cycle: Record<string, unknown> = {};
    cycle['self'] = cycle;
    expect(valueRows(cycle, expandValueRows(cycle, new Map(), 'all'))[1].preview).toBe('[Circular]');
  });

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

  it('renders date previews as ISO strings and serializes dates in json export', () => {
    const date = new Date('2026-10-17T00:00:00.000Z');
    const rows = valueRows(date, new Map());
    expect(rows[0].preview).toBe('2026-10-17T00:00:00.000Z');
    expect(rows[0].expandable).toBe(false);

    const invalidDate = new Date('invalid');
    expect(valueRows(invalidDate, new Map())[0].preview).toBe('Invalid Date');

    const payload = {created: date, invalid: invalidDate};
    expect(JSON.parse(copyableJson(payload) ?? '')).toEqual({
      created: '2026-10-17T00:00:00.000Z',
      invalid: null,
    });
  });

  it('does not invoke Date method getters or custom serializers while inspecting and copying', () => {
    const date = new Date('2026-10-17T00:00:00.000Z');
    const getter = vi.fn(() => {
      throw new Error('Application code must not execute');
    });
    for (const method of ['getTime', 'toISOString', 'toJSON']) Object.defineProperty(date, method, {get: getter});
    expect(valueRows(date, new Map())[0].preview).toBe('2026-10-17T00:00:00.000Z');
    expect(copyableJson({created: date})).toBe('{\n  "created": "2026-10-17T00:00:00.000Z"\n}');
    expect(getter).not.toHaveBeenCalled();
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
