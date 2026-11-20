import {execFileSync} from 'node:child_process';
import {runInNewContext} from 'node:vm';
import {resolve} from 'node:path';
import {pathToFileURL} from 'node:url';
import {describe, expect, expectTypeOf, it} from 'vitest';

import {addCalendarDays} from './add-calendar-days.util';

const localDate = (value: string) => new Date(`${value}T12:34:56.789`);

describe('addCalendarDays', () => {
  it('rolls across months, leap days and years without mutating the reference', () => {
    const source = localDate('2024-02-28');
    const timestamp = source.getTime();
    expect(addCalendarDays(source, 1)).toEqual(localDate('2024-02-29'));
    expect(addCalendarDays(source, 2)).toEqual(localDate('2024-03-01'));
    expect(addCalendarDays(localDate('2025-12-31'), 1)).toEqual(localDate('2026-01-01'));
    expect(addCalendarDays(localDate('2026-01-01'), -1)).toEqual(localDate('2025-12-31'));
    expect(source.getTime()).toBe(timestamp);
    expect(addCalendarDays(source, 1).getMilliseconds()).toBe(789);
  });

  it('returns a distinct exact clone for zero and supports cross-realm Dates', () => {
    const source = runInNewContext('new Date(123456789)');
    const clone = addCalendarDays(source, 0);
    expect(clone).not.toBe(source);
    expect(clone.getTime()).toBe(123456789);
    expectTypeOf(clone).toEqualTypeOf<Date>();
  });

  it('rejects invalid dates, offsets and date overflow', () => {
    const source = localDate('2026-01-15');
    for (const days of [NaN, Infinity, -Infinity, 0.5, Number.MAX_SAFE_INTEGER + 1]) {
      expect(() => addCalendarDays(source, days)).toThrow(RangeError);
    }
    expect(() => addCalendarDays(new Date(NaN), 1)).toThrow(RangeError);
    expect(() => addCalendarDays(new Date(8_640_000_000_000_000), 2)).toThrow(RangeError);
    expect(() => addCalendarDays(new Date(-8_640_000_000_000_000), -2)).toThrow(RangeError);
    expect(source.getTime()).toBe(localDate('2026-01-15').getTime());
  });

  it('rejects runtime coercion rather than accepting date strings or timestamp numbers', () => {
    // @ts-expect-error Native Date input is intentional.
    expect(() => addCalendarDays('2026-01-15', 1)).toThrow(TypeError);
  });

  for (const timezone of ['UTC', 'America/New_York', 'Asia/Shanghai', 'Pacific/Honolulu', 'Pacific/Apia']) {
    it(`keeps calendar semantics in a fresh ${timezone} process`, () => {
      const addModule = pathToFileURL(resolve(__dirname, 'add-calendar-days.util.ts')).href;
      const script = `
        import assert from 'node:assert/strict';
        import {addCalendarDays} from ${JSON.stringify(addModule)};
        const reference = new Date('2026-01-15T23:30:00');
        const next = addCalendarDays(reference, 1);
        assert.deepEqual([next.getFullYear(), next.getMonth(), next.getDate(), next.getHours()], [2026, 0, 16, 23]);
        const previous = addCalendarDays(reference, -1);
        assert.deepEqual([previous.getFullYear(), previous.getMonth(), previous.getDate(), previous.getHours()], [2026, 0, 14, 23]);
        assert.equal(reference.getHours(), 23);
        if (process.env.TZ === 'America/New_York') {
          assert.equal(new Date('2026-01-15T12:00:00').getTimezoneOffset(), 300);
          const spring = new Date('2026-03-07T12:30:45.123');
          const fall = new Date('2026-10-31T12:30:45.123');
          assert.equal(addCalendarDays(spring, 1).getTime() - spring.getTime(), 23 * 3600000);
          assert.equal(addCalendarDays(fall, 1).getTime() - fall.getTime(), 25 * 3600000);
          assert.equal(addCalendarDays(spring, 1).getHours(), 12);
          assert.equal(addCalendarDays(fall, 1).getHours(), 12);
          assert.equal(addCalendarDays(new Date('2026-03-07T02:30:00'), 1).getHours(), 3);
          const repeated = new Date('2026-11-01T01:30:00-05:00');
          assert.equal(addCalendarDays(repeated, 0).getTime(), repeated.getTime());
        }
        if (process.env.TZ === 'Pacific/Apia') {
          const skipped = addCalendarDays(new Date('2011-12-29T12:00:00'), 1);
          assert.deepEqual([skipped.getFullYear(), skipped.getMonth(), skipped.getDate()], [2011, 11, 31]);
        }
      `;
      execFileSync(process.execPath, ['--input-type=module', '-e', script], {
        env: {...process.env, TZ: timezone},
        stdio: 'pipe',
        timeout: 15000,
      });
    });
  }
});
