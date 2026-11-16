import {lastValueFrom, of, toArray} from 'rxjs';
import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest';

describe('logger', () => {
  const calls: Record<string, unknown[][]> = {count: [], debug: [], dir: [], log: [], table: []};

  beforeEach(() => {
    vi.resetModules();
    for (const list of Object.values(calls)) list.length = 0;
    vi.stubGlobal('console', {
      count: (...args: unknown[]) => calls.count.push(args),
      debug: (...args: unknown[]) => calls.debug.push(args),
      dir: (...args: unknown[]) => calls.dir.push(args),
      log: (...args: unknown[]) => calls.log.push(args),
      table: (...args: unknown[]) => calls.table.push(args),
    });
  });

  afterEach(() => vi.unstubAllGlobals());

  it('logs through the selected console method and forwards the value', async () => {
    const {logger} = await import('./logger.operator');
    const values = await lastValueFrom(of(42).pipe(logger<number>('debug'), toArray()));
    expect(values).toEqual([42]);
    expect(calls.debug).toEqual([[42]]);
    expect(calls.log).toEqual([]);
  });

  it('defaults to log and falls back for an unknown method', async () => {
    const {logger} = await import('./logger.operator');
    await lastValueFrom(of('a').pipe(logger<string>(), toArray()));
    await lastValueFrom(of('b').pipe(logger<string>('unknown' as 'log'), toArray()));
    expect(calls.log).toEqual([['a'], ['b']]);
  });
});
