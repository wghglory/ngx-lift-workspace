import type {ResourceState} from '../models/resource-state.model';

/**
 * Type guard to check if an unknown object satisfies the `ResourceState` interface.
 *
 * @param item Unknown value to check.
 * @returns True if the item is a valid `ResourceState`.
 */
export function isResourceState(item: unknown): item is ResourceState {
  return (
    typeof item === 'object' &&
    item !== null &&
    typeof (item as ResourceState).type === 'string' &&
    typeof (item as ResourceState).name === 'string'
  );
}

/**
 * Recursively extracts all valid `ResourceState` items from an array, object dictionary, or single object.
 *
 * @param input An array, dictionary, or single resource object.
 * @returns An array of all valid `ResourceState` objects discovered.
 */
export function extractResourceStates(input: unknown): ResourceState[] {
  if (!input || typeof input !== 'object') {
    return [];
  }

  if (isResourceState(input)) {
    return [input];
  }

  const items = Array.isArray(input) ? input : Object.values(input);
  return items.flatMap((item) => extractResourceStates(item));
}

/**
 * Recursively removes or replaces tombstone `ResourceState` objects (`isTombstone: true`)
 * from an input structure (arrays or object dictionaries).
 *
 * - Arrays: items with `isTombstone: true` are filtered out.
 * - Object dictionaries: properties holding a tombstone `ResourceState` are set to `undefined`.
 * - Single ResourceState: returns `undefined` if it is a tombstone, otherwise returns the object.
 * - Primitives / null / undefined: returned as-is.
 *
 * @param input The raw resource value (array, object dictionary, or single resource).
 * @returns The sanitized value with all tombstone resources removed.
 */
export function sanitizeTombstones<T>(input: T): T {
  if (!input || typeof input !== 'object') {
    return input;
  }

  if (isResourceState(input)) {
    return (input.isTombstone ? undefined : input) as unknown as T;
  }

  if (Array.isArray(input)) {
    return input
      .filter((item) => !(isResourceState(item) && item.isTombstone))
      .map((item) => sanitizeTombstones(item)) as unknown as T;
  }

  const result: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(input)) {
    if (isResourceState(value) && value.isTombstone) {
      result[key] = undefined;
    } else {
      result[key] = sanitizeTombstones(value);
    }
  }

  return result as T;
}
