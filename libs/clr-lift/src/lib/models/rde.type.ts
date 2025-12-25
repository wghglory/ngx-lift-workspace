/**
 * Represents a list of items returned by Cloud Director RDE API
 * @template T - The type of the entity in the list.
 * @template V - Additional values associated with the items, defaulting to `undefined`.
 */
export interface RDEList<T = unknown, V = undefined> {
  /**
   * Total number of results across all pages.
   */
  resultTotal: number;

  /**
   * Total number of pages in the result set.
   */
  pageCount: number;

  /**
   * Current page number.
   */
  page: number;

  /**
   * Number of items per page.
   */
  pageSize: number;

  /**
   * Associations related to the items (type is left as 'unknown' for further specification).
   */
  associations: unknown;

  /**
   * Values associated with the items. If `V` is `undefined`, defaults to an array of `RDEValue<T>`.
   */
  values: V extends undefined ? RDEValue<T>[] : V[];
}

/**
 * Represents a value associated with an item in the RDEList.
 * @template T - The type of the entity.
 */
export interface RDEValue<T> {
  /**
   * Unique identifier for the value.
   */
  id: string;

  /**
   * Type of the entity.
   */
  entityType: string;

  /**
   * Name of the entity.
   */
  name: string;

  /**
   * External identifier for the entity, or `null` if not applicable.
   */
  externalId: string | null;

  /**
   * The actual entity.
   */
  entity: T;

  /**
   * State of the entity: 'RESOLVED', 'RESOLUTION_ERROR', or 'PRE_CREATED'.
   */
  state: 'RESOLVED' | 'RESOLUTION_ERROR' | 'PRE_CREATED';

  /**
   * Owner information.
   */
  owner: {
    name: string;
    id: string;
  };

  /**
   * Organization information.
   */
  org: {
    name: string;
    id: string;
  };
}
