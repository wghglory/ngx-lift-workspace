import {OperatorFunction, pipe, tap} from 'rxjs';

// Define a type for different logger functions
type LoggerType = 'count' | 'debug' | 'dir' | 'log' | 'table';

// Define a more permissive type for console functions
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ConsoleFunction = (...args: any[]) => void;

// Map each LoggerType to its corresponding console function
const loggerFunctions: Record<LoggerType, ConsoleFunction> = {
  count: console.count.bind(console),
  debug: console.debug.bind(console),
  dir: console.dir.bind(console),
  log: console.log.bind(console),
  table: console.table.bind(console),
};

/**
 * RxJS operator that logs values emitted by an observable using various console methods.
 * Useful for debugging and monitoring observable streams during development.
 *
 * @template T - The type of values emitted by the observable.
 * @param loggerType - The type of logger to be used. Options:
 *   - `'log'`: Standard console.log (default)
 *   - `'debug'`: Console.debug for debug messages
 *   - `'dir'`: Console.dir for object inspection
 *   - `'count'`: Console.count for counting emissions
 *   - `'table'`: Console.table for tabular data display
 * @returns An RxJS operator function that logs values using the specified console function.
 *
 * @example
 * ```typescript
 * // Log all values
 * source$.pipe(logger()).subscribe();
 *
 * // Use debug logger
 * source$.pipe(logger('debug')).subscribe();
 *
 * // Display objects in table format
 * users$.pipe(logger('table')).subscribe();
 * ```
 */
export const logger = <T>(loggerType: LoggerType = 'log'): OperatorFunction<T, T> =>
  pipe(
    tap((value: T) => {
      const logFunction = loggerFunctions[loggerType] || console.log.bind(console);
      logFunction(value);
    }),
  );
