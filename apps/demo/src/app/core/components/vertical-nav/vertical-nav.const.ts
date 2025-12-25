import {NavConfig} from './nav-config.model';

export const ngxLiftNavConfig: NavConfig[] = [
  {
    path: '/ngx-lift/signals',
    value: 'Signal Utils',
    icon: 'radar',
    children: [
      {path: '/createTrigger', value: 'createTrigger'},
      {path: '/computedAsync', value: 'computedAsync'},
      {path: '/combineFrom', value: 'combineFrom'},
      {path: '/mergeFrom', value: 'mergeFrom'},
      {path: '/injectParams/hi-param', value: 'injectParams'},
      {path: '/injectQueryParams', queryParams: {search: 7, page: 5}, value: 'injectQueryParams'},
    ],
  },
  {
    path: '/ngx-lift/operators',
    value: 'Operators',
    icon: 'objects',
    children: [
      {path: '/createAsyncState', value: 'createAsyncState'},
      {path: '/switchMapWithAsyncState', value: 'switchMapWithAsyncState'},
      {path: '/combineLatestEager', value: 'combineLatestEager'},
      {path: '/distinctOnChange', value: 'distinctOnChange'},
      {path: '/logger', value: 'logger'},
      {path: '/poll', value: 'poll'},
    ],
  },
  {
    path: '/ngx-lift/pipes',
    value: 'Pipes',
    icon: 'pipes',
    children: [
      {path: '/array-join', value: 'Array Join'},
      {path: '/byte-converter', value: 'Byte Converter'},
      {path: '/is-https', value: 'Is Https'},
      {path: '/mask', value: 'Mask'},
      {path: '/range', value: 'Range'},
    ],
  },
  {
    path: '/ngx-lift/validators',
    value: 'Validators',
    icon: 'certificate',
    children: [
      {path: '/date-range', value: 'dateRangeValidator'},
      {path: '/if', value: 'ifValidator / ifAsyncValidator'},
      {path: '/intersection', value: 'intersectionValidator'},
      {path: '/unique', value: 'UniqueValidator'},
      {path: '/url', value: 'UrlValidator'},
    ],
  },
  {
    path: '/ngx-lift/utilities',
    value: 'Utilities',
    icon: 'wrench',
    children: [
      {path: '/difference-in-days', value: 'differenceInDays'},
      {path: '/idle-detection', value: 'Idle Detection'},
      {path: '/is-empty', value: 'isEmpty'},
      {path: '/is-equal', value: 'isEqual'},
      {path: '/pick-by', value: 'pickBy & omitBy'},
      {path: '/url', value: 'URL'},
    ],
  },
];

export const clrLiftNavConfig: NavConfig[] = [
  {
    path: '/clr-lift/operators',
    value: 'Operators',
    icon: 'objects',
    children: [{path: '/dgState', value: 'dgState'}],
  },
  {
    path: '/clr-lift/components',
    value: 'Components',
    icon: 'heat-map',
    children: [
      {path: '/alert', value: 'Alert'},
      {path: '/multi-alerts', value: 'Alerts (Multiple)'},
      {path: '/certificate', value: 'Certificate View'},
      {path: '/key-value-inputs', value: 'Key Value Inputs'},
      {path: '/spinner', value: 'Spinner'},
      {path: '/status-indicator', value: 'Status Indicator'},
      {path: '/timeline-wizard', value: 'Timeline Wizard'},
      {path: '/toast', value: 'Toast'},
      {path: '/tooltip', value: 'Tooltip'},
      {path: '/file-reader', value: 'File Reader'},
    ],
  },
  {
    path: '/clr-lift/utilities',
    value: 'Utilities',
    icon: 'wrench',
    children: [{path: '/datagrid', value: 'Datagrid'}],
  },
];
