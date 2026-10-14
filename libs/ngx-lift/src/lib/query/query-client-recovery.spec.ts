import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest';

import {QueryClient} from './query-client';
import {QueryClientOptions} from './query.models';

describe('query focus and reconnect recovery', () => {
  const clients: QueryClient[] = [];
  const create = (options: QueryClientOptions = {}) => {
    const client = new QueryClient(options);
    clients.push(client);
    return client;
  };
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(0);
  });
  afterEach(() => {
    clients.splice(0).forEach((client) => client.destroy());
    vi.clearAllTimers();
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it.each(['focus', 'reconnect'] as const)(
    'refreshes only opted-in observed stale reads on %s and joins pending work',
    async (trigger) => {
      let event: () => void = () => undefined;
      const unsubscribe = vi.fn();
      const report = vi.fn();
      const client = create({
        queryDefaults: {refetchOnFocus: true, refetchOnReconnect: true},
        onQueryError: report,
        [trigger === 'focus' ? 'subscribeFocus' : 'subscribeReconnect']: (listener: () => void) => {
          event = listener;
          return unsubscribe;
        },
      });
      const loader = vi
        .fn<() => Promise<number>>()
        .mockResolvedValueOnce(1)
        .mockRejectedValue(new Error('recovery failed'));
      const stale = {key: ['active-stale'], loader, staleTime: 0};
      client.observeQuery(stale, () => undefined);
      await client.fetchQuery(stale);
      const freshLoader = vi.fn(async () => 2);
      const fresh = {key: ['active-fresh'], loader: freshLoader, staleTime: Infinity};
      client.observeQuery(fresh, () => undefined);
      await client.fetchQuery(fresh);
      const inactiveLoader = vi.fn(async () => 3);
      await client.fetchQuery({key: ['inactive'], loader: inactiveLoader});
      const optedOutLoader = vi.fn(async () => 4);
      const optedOut = {key: ['opted-out'], loader: optedOutLoader};
      client.observeQuery(optedOut, () => undefined, {refetchOnFocus: false, refetchOnReconnect: false});
      await client.fetchQuery(optedOut);
      event();
      event();
      await expect(client.fetchQuery(stale)).rejects.toThrow('recovery failed');
      expect(loader).toHaveBeenCalledTimes(2);
      expect(freshLoader).toHaveBeenCalledTimes(1);
      expect(inactiveLoader).toHaveBeenCalledTimes(1);
      expect(optedOutLoader).toHaveBeenCalledTimes(1);
      expect(report).toHaveBeenCalledTimes(1);
      expect(report.mock.calls[0][1].trigger).toBe(trigger);
      client.destroy();
      expect(unsubscribe).toHaveBeenCalledTimes(1);
      expect(() => event()).not.toThrow();
      expect(loader).toHaveBeenCalledTimes(2);
    },
  );

  it('keeps recovery opt-in and allows an observer to enable it without client defaults', async () => {
    let focus: () => void = () => undefined;
    const client = create({
      subscribeFocus: (listener) => {
        focus = listener;
        return () => undefined;
      },
    });
    const loader = vi.fn(async () => 42);
    const definition = {key: ['recovery-opt-in'], loader};
    const handle = client.observeQuery(definition, () => undefined);
    await client.fetchQuery(definition);
    focus();
    expect(loader).toHaveBeenCalledTimes(1);
    handle.updateOptions({refetchOnFocus: true});
    focus();
    await client.fetchQuery(definition);
    expect(loader).toHaveBeenCalledTimes(2);
  });

  it('does not duplicate an overdue poll when visibility also triggers focus recovery', async () => {
    let visible = true;
    let visibility: () => void = () => undefined;
    const client = create({
      isVisible: () => visible,
      subscribeVisibility: (listener) => {
        visibility = listener;
        return () => undefined;
      },
    });
    const loader = vi.fn(async () => 42);
    const definition = {key: ['poll-and-focus'], loader};
    client.observeQuery(definition, () => undefined, {pollInterval: 10, refetchOnFocus: true});
    await client.fetchQuery(definition);
    visible = false;
    visibility();
    await vi.advanceTimersByTimeAsync(10);
    expect(loader).toHaveBeenCalledTimes(1);
    visible = true;
    visibility();
    await client.fetchQuery(definition);
    expect(loader).toHaveBeenCalledTimes(2);
  });

  it('permits disabling an inherited logical deadline', async () => {
    const client = create({queryDefaults: {deadlineMs: 10}});
    const result = client.fetchQuery({
      key: ['deadline-opt-out'],
      deadlineMs: false,
      loader: () => new Promise<number>((resolve) => setTimeout(() => resolve(42), 20)),
    });
    await vi.advanceTimersByTimeAsync(20);
    await expect(result).resolves.toBe(42);
  });
});
