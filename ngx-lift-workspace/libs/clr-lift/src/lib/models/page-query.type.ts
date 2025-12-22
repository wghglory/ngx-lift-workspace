/**
 * Represents the parameters for paginating and querying data.
 */
export interface PageQuery {
  /**
   * The page number for pagination. Starts from 1.
   */
  page: number;

  /**
   * The number of items per page in the result set.
   */
  pageSize: number;

  /**
   * Optional: The field to sort in ascending order.
   */
  sortAsc?: string;

  /**
   * Optional: The field to sort in descending order.
   */
  sortDesc?: string;

  /**
   * Optional: The filter criteria in FIQL (Feed Item Query Language) format.
   * Example: name==*term*;enabled==false
   */
  filter?: string;
}
