import {QueryDefinition, QueryKey, QueryReadPolicy, QueryRetryState} from './query.models';
import {QueryTimeoutError} from './query-errors';
import {normalizeQueryResult} from './query-normalizer';

const MAX_TIMER_DELAY = 2_147_483_647;

/** Validate before registering pending work, and capture policy against caller mutations. */
export function resolveQueryReadPolicy(policy: QueryReadPolicy, defaults: QueryReadPolicy = {}): QueryReadPolicy {
  const retry = policy.retry ?? defaults.retry ?? false;
  const deadlineMs = policy.deadlineMs ?? defaults.deadlineMs;
  if (deadlineMs !== undefined && (!Number.isFinite(deadlineMs) || deadlineMs <= 0)) {
    throw new RangeError('deadlineMs must be a positive finite duration.');
  }
  if (retry !== false) {
    if (!Number.isSafeInteger(retry.maxAttempts) || retry.maxAttempts < 1) {
      throw new RangeError('retry.maxAttempts must be a positive safe integer.');
    }
    if (typeof retry.shouldRetry !== 'function') throw new TypeError('retry.shouldRetry must be a function.');
    if (typeof retry.delayMs !== 'function' && (!Number.isFinite(retry.delayMs) || retry.delayMs < 0)) {
      throw new RangeError('retry.delayMs must be a nonnegative finite duration or a function.');
    }
  }
  return {retry: retry === false ? false : {...retry}, deadlineMs};
}

interface QueryRequestOptions<T> {
  readonly key: QueryKey;
  readonly loader: QueryDefinition<T>['loader'];
  readonly refresh: boolean;
  readonly policy: QueryReadPolicy;
  readonly controller: AbortController;
  readonly now: () => number;
  readonly elapsedNow: () => number;
  readonly startedAt: number;
  readonly onProgress: (state: QueryRetryState, attempt: number) => void;
  readonly onDiagnostic: (error: unknown) => void;
}

/** One logical read owns attempts, deadline, and timers, even after its cache generation is superseded. */
export function executeQueryRequest<T>(options: QueryRequestOptions<T>): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    const {controller, policy} = options;
    const {signal} = controller;
    const startedAt = options.startedAt;
    let settled = false;
    let attempt = 0;
    let failureCount = 0;
    let failureReason: unknown | null = null;
    let retryTimer: ReturnType<typeof setTimeout> | undefined;
    let deadlineTimer: ReturnType<typeof setTimeout> | undefined;
    const elapsed = () => Math.max(0, options.elapsedNow() - startedAt);
    const remaining = () => (policy.deadlineMs === undefined ? Infinity : policy.deadlineMs - elapsed());
    const finish = (result: {value: T} | {error: unknown}) => {
      if (settled) return;
      if (!signal.aborted && remaining() <= 0) {
        expire();
        return;
      }
      settled = true;
      clearTimeout(retryTimer);
      clearTimeout(deadlineTimer);
      signal.removeEventListener('abort', onAbort);
      if ('error' in result) reject(result.error);
      else resolve(result.value);
    };
    const onAbort = () => finish({error: signal.reason});
    const expire = () => {
      if (policy.deadlineMs === undefined) return;
      const timeout = new QueryTimeoutError(policy.deadlineMs, failureCount ? failureReason : undefined);
      progress(null);
      controller.abort(timeout);
    };
    const scheduleDeadline = () => {
      if (settled || policy.deadlineMs === undefined) return;
      if (remaining() <= 0) expire();
      else deadlineTimer = setTimeout(scheduleDeadline, Math.min(MAX_TIMER_DELAY, remaining()));
    };
    const progress = (nextRetryAt: number | null) => {
      options.onProgress({failureCount, failureReason, nextRetryAt}, attempt);
    };
    const failed = (error: unknown) => {
      if (settled) return;
      if (remaining() <= 0) {
        expire();
        return;
      }
      failureCount++;
      failureReason = error;
      let delay: number | undefined;
      try {
        const retry = policy.retry;
        if (retry && attempt < retry.maxAttempts) {
          const context = {key: options.key, attempt, elapsedMs: elapsed()};
          const eligible = retry.shouldRetry(error, context);
          if (typeof eligible !== 'boolean') throw new TypeError('retry.shouldRetry must return a boolean.');
          if (eligible) {
            delay = typeof retry.delayMs === 'function' ? retry.delayMs(error, context) : retry.delayMs;
            if (!Number.isFinite(delay) || delay < 0)
              throw new RangeError('retry.delayMs must return a nonnegative finite duration.');
          }
        }
      } catch (policyError) {
        delay = undefined;
        options.onDiagnostic(policyError);
      }
      if (settled) return;
      if (remaining() <= 0) {
        expire();
        return;
      }
      // Do not shorten a server's minimum retry wait to fit the remaining budget.
      if (delay === undefined || delay >= remaining()) {
        progress(null);
        finish({error});
        return;
      }
      const retryAt = options.elapsedNow() + delay;
      progress(options.now() + delay);
      if (settled) return;
      if (remaining() <= 0) {
        expire();
        return;
      }
      const resume = () => {
        if (settled) return;
        const wait = retryAt - options.elapsedNow();
        if (wait > 0) retryTimer = setTimeout(resume, Math.min(MAX_TIMER_DELAY, wait));
        else run();
      };
      if (!settled) retryTimer = setTimeout(resume, Math.min(MAX_TIMER_DELAY, delay));
    };
    const run = () => {
      if (settled) return;
      if (remaining() <= 0) {
        expire();
        return;
      }
      attempt++;
      progress(null);
      if (settled) return;
      if (remaining() <= 0) {
        expire();
        return;
      }
      try {
        normalizeQueryResult(options.loader({abortSignal: signal, refresh: options.refresh}), {
          abortSignal: signal,
          refresh: options.refresh,
        }).then((value) => {
          if (settled) return;
          if (remaining() <= 0) expire();
          else finish({value});
        }, failed);
      } catch (error) {
        failed(error);
      }
    };
    signal.addEventListener('abort', onAbort, {once: true});
    if (signal.aborted) onAbort();
    else {
      scheduleDeadline();
      run();
    }
  });
}
