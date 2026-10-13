import {QueryDefinition} from './query.models';

/**
 * Inference helper to define a reusable query definition with preserved types.
 *
 * @example
 * ```typescript
 * export const userQuery = (id: string) =>
 *   defineQuery({
 *     key: ['users', id],
 *     loader: () => http.get<User>(`/api/users/${id}`),
 *     staleTime: 60_000,
 *   });
 * ```
 *
 * @param definition The query key, loader, tags, and cache policies.
 * @returns The exact query definition with inferred generic type.
 */
export function defineQuery<T>(definition: QueryDefinition<T>): QueryDefinition<T> {
  return definition;
}
