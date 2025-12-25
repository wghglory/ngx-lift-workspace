import {ClrDatagridStateInterface} from '@clr/angular';
import {isEmpty, pickBy} from 'ngx-lift';

import {PageQuery} from '../models/page-query.type';

const DEFAULT_PAGE_SIZE = 10;

/**
 * Converts Clarity Datagrid state into an object suitable for HttpParams.
 * Clarity Datagrid State Example:
    {
      "page": {
        "from": 0,
        "to": 9,
        "size": 10,
        "current": 1
      },
      "sort": {
        "by": "description",
        "reverse": false
      },
      "filters": [
        {
          "property": "name",
          "value": "mike"
        },
        {
          "property": "job",
          "value": "programming"
        }
      ]
    }
 * Convert to HttpParams: {page: 1, pageSize: 10, filter: 'name==*mike*;job==*programming*', sortAsc: 'description'}
 * @param state - The Clarity Datagrid state.
 * @returns {PageQuery} - The converted HttpParams object.
 */
export function convertToHttpParams(state: ClrDatagridStateInterface | null) {
  // If the state is empty, return default values.
  if (isEmpty(state)) {
    return {
      page: 1,
      pageSize: DEFAULT_PAGE_SIZE,
    };
  }

  // Extract page and pageSize from the state.
  const {page, pageSize} = extractPageInfo(state);

  // Extract sorting information from the state.
  const {sortAsc, sortDesc} = extractSortingInfo(state);

  // Extract filter information from the state.
  const filter = extractFilterInfo(state);

  // Create an object with non-empty properties.
  return pickBy<PageQuery>({page, pageSize, filter, sortAsc, sortDesc}, Boolean);
}

/**
 * Extracts page and pageSize from the Clarity Datagrid state.
 * @param state - The Clarity Datagrid state.
 * @returns {{ page: number, pageSize: number }} - Page and pageSize information.
 */
function extractPageInfo(state: ClrDatagridStateInterface<unknown>) {
  let page = 0;
  let pageSize = DEFAULT_PAGE_SIZE;

  if (state.page) {
    page = state.page.current || 1;
    pageSize = state.page.size || DEFAULT_PAGE_SIZE;
  }

  return {page, pageSize};
}

/**
 * Extracts sorting information from the Clarity Datagrid state.
 * @param state - The Clarity Datagrid state.
 * @returns {{ sortAsc: string, sortDesc: string }} - Sorting information.
 */
function extractSortingInfo(state: ClrDatagridStateInterface) {
  let sortAsc = '';
  let sortDesc = '';

  if (state.sort) {
    if (state.sort.reverse) {
      sortDesc = state.sort.by as string;
    } else {
      sortAsc = state.sort.by as string;
    }
  }

  return {sortAsc, sortDesc};
}

/**
 * Extracts filter information from the Clarity Datagrid state.
 * @param state - The Clarity Datagrid state.
 * @returns {string} - Filter information.
 */
function extractFilterInfo(state: ClrDatagridStateInterface) {
  const {filters} = state;

  if (!state || !filters) {
    return '';
  }

  // Convert each filter into a FIQL (Feed Item Query Language) format and join them with ';'.
  return filters
    .map((filter) => {
      const {property, value} = <{property: string; value: string}>filter;
      return `${property}==*${value}*`;
    })
    .join(';');
}
