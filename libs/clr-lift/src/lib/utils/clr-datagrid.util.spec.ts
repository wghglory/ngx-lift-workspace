import {convertToHttpParams} from './clr-datagrid.util';

describe('convertToHttpParams', () => {
  it('keeps the first page when a nonempty state has no pagination', () => {
    expect(convertToHttpParams({sort: {by: 'name', reverse: false}})).toEqual({
      page: 1,
      pageSize: 10,
      sortAsc: 'name',
    });
  });

  it('keeps filters, descending sort, and explicit pagination', () => {
    expect(
      convertToHttpParams({
        page: {current: 3, size: 20},
        sort: {by: 'name', reverse: true},
        filters: [{property: 'name', value: 'alice'}],
      }),
    ).toEqual({page: 3, pageSize: 20, sortDesc: 'name', filter: 'name==*alice*'});
  });
});
