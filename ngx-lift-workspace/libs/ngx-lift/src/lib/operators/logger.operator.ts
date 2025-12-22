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
 * Logger operator for RxJS observables.
 *
 * @param loggerType The type of logger to be used: 'count', 'debug', 'dir', 'log', 'table'.
 *                   Defaults to 'log' if not provided or if an unknown type is specified.
 * @returns An RxJS operator function that logs values using the specified console function.
 */
export const logger = <T>(loggerType: LoggerType = 'log'): OperatorFunction<T, T> =>
  pipe(
    tap((value: T) => {
      const logFunction = loggerFunctions[loggerType] || console.log.bind(console);
      logFunction(value);
    }),
  );
