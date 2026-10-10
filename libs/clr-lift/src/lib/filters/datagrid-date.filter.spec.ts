import {describe, expect, it} from 'vitest';

import {DatagridDateFilter} from './datagrid-date.filter';

interface DateItem {
  id: number;
  createdAt?: string | Date | number | null;
  meta?: {
    updatedAt?: string | null;
  };
}

describe('DatagridDateFilter', () => {
  it('should accept all items when search string is empty or whitespace', () => {
    const filter = new DatagridDateFilter<DateItem>('createdAt');
    const item: DateItem = {id: 1, createdAt: '2026-03-15T10:30:00Z'};

    expect(filter.accepts(item, '')).toBe(true);
    expect(filter.accepts(item, '   ')).toBe(true);
  });

  it('should match ISO string dates using formatted display text or raw string', () => {
    const filter = new DatagridDateFilter<DateItem>('createdAt', true, {
      locale: 'en-US',
    });

    const item: DateItem = {id: 1, createdAt: '2026-03-15T10:30:00Z'};

    expect(filter.accepts(item, '2026-03')).toBe(true);
    expect(filter.accepts(item, 'Mar 15')).toBe(true);
    expect(filter.accepts(item, 'Dec')).toBe(false);
  });

  it('should match Date object instances', () => {
    const date = new Date(2026, 4, 20, 14, 0, 0); // May 20, 2026
    const filter = new DatagridDateFilter<DateItem>('createdAt', false, {
      locale: 'en-US',
    });

    expect(filter.accepts({id: 1, createdAt: date}, 'May 20')).toBe(true);
    expect(filter.accepts({id: 1, createdAt: date}, '2026')).toBe(true);
    expect(filter.accepts({id: 1, createdAt: date}, 'Jan')).toBe(false);
  });

  it('should match timestamp numbers', () => {
    const timestamp = new Date('2026-08-01T12:00:00Z').getTime();
    const filter = new DatagridDateFilter<DateItem>('createdAt', false, {
      locale: 'en-US',
    });

    expect(filter.accepts({id: 1, createdAt: timestamp}, 'Aug 1')).toBe(true);
    expect(filter.accepts({id: 1, createdAt: timestamp}, 'Feb')).toBe(false);
  });

  it('should support custom formatFn', () => {
    const filter = new DatagridDateFilter<DateItem>('createdAt', false, {
      formatFn: (d) => `${d.getFullYear()}/${d.getMonth() + 1}`,
    });

    const item: DateItem = {id: 1, createdAt: '2026-07-22T00:00:00Z'};
    expect(filter.accepts(item, '2026/7')).toBe(true);
  });

  it('should reject invalid dates or missing values', () => {
    const filter = new DatagridDateFilter<DateItem>('createdAt');

    expect(filter.accepts({id: 1, createdAt: null}, '2026')).toBe(false);
    expect(filter.accepts({id: 2, createdAt: undefined}, '2026')).toBe(false);
    expect(filter.accepts({id: 3, createdAt: 'not-a-valid-date'}, '2026')).toBe(false);
  });

  it('should support nested dot-notation paths', () => {
    const filter = new DatagridDateFilter<DateItem>('meta.updatedAt', false, {
      locale: 'en-US',
    });

    expect(filter.accepts({id: 1, meta: {updatedAt: '2026-11-05T08:00:00Z'}}, 'Nov 5')).toBe(true);
    expect(filter.accepts({id: 2, meta: {}}, 'Nov 5')).toBe(false);
  });
});
