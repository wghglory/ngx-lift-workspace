import {NavConfig} from './nav-config.model';

export const ngxLiftNavConfig: NavConfig[] = [
  {
    path: '/ngx-lift/signals',
    value: 'Signal Utils',
    icon: 'radar',
    children: [
      {path: '/toSignalForm', value: 'toSignalForm', label: 'popular'},
      {path: '/resourceAsync', value: 'resourceAsync', label: 'popular'},
      {path: '/combineFrom', value: 'combineFrom'},
      {path: '/mergeFrom', value: 'mergeFrom'},
      {path: '/computedAsync', value: 'computedAsync'},
      {path: '/injectParams/hi-param', value: 'injectParams'},
      {path: '/injectQueryParams', queryParams: {search: 7, page: 5}, value: 'injectQueryParams'},
      {path: '/createTrigger', value: 'createTrigger'},
    ],
  },
  {
    path: '/ngx-lift/query',
    value: 'Query & Mutation',
    icon: 'data-cluster',
    children: [
      {path: '/queryResource', value: 'queryResource', label: 'new'},
      {path: '/mutateResource', value: 'mutateResource', label: 'new'},
    ],
  },
  {
    path: '/ngx-lift/operators',
    value: 'Operators',
    icon: 'objects',
    children: [
      {path: '/createAsyncState', value: 'createAsyncState'},
      {path: '/switchMapWithAsyncState', value: 'switchMapWithAsyncState'},
      {path: '/poll', value: 'poll'},
      {path: '/combineLatestEager', value: 'combineLatestEager'},
      {path: '/distinctOnChange', value: 'distinctOnChange'},
      {path: '/startWithTap', value: 'startWithTap'},
      {path: '/logger', value: 'logger'},
      {path: '/kubernetesPagination', value: 'kubernetesPagination'},
      {path: '/k8sRetryBackoff', value: 'retryOnK8sBackoff', label: 'new'},
    ],
  },
  {
    path: '/ngx-lift/interceptors',
    value: 'Interceptors',
    icon: 'shield',
    children: [{path: '/k8sRetryBackoff', value: 'k8sRetryBackoffInterceptor', label: 'new'}],
  },
  {
    path: '/ngx-lift/validators',
    value: 'Validators',
    icon: 'certificate',
    children: [
      {path: '/if', value: 'ifValidator / ifAsyncValidator'},
      {path: '/date-range', value: 'dateRangeValidator'},
      {path: '/url', value: 'urlValidator'},
      {path: '/intersection', value: 'intersectionValidator'},
      {path: '/unique', value: 'UniqueValidator'},
    ],
  },
  {
    path: '/ngx-lift/pipes',
    value: 'Pipes',
    icon: 'pipes',
    children: [
      {path: '/byte-converter', value: 'Byte Converter', i18nKey: 'nav.byteConverter'},
      {path: '/mask', value: 'Mask', i18nKey: 'nav.mask'},
      {path: '/array-join', value: 'Array Join', i18nKey: 'nav.arrayJoin'},
      {path: '/range', value: 'Range', i18nKey: 'nav.range'},
      {path: '/is-https', value: 'Is Https', i18nKey: 'nav.isHttps'},
    ],
  },
  {
    path: '/ngx-lift/utilities',
    value: 'Utilities',
    icon: 'wrench',
    children: [
      {path: '/is-empty', value: 'isEmpty'},
      {path: '/is-equal', value: 'isEqual'},
      {path: '/difference-in-days', value: 'differenceInDays', i18nKey: 'nav.differenceInDays'},
      {path: '/pick-by', value: 'pickBy & omitBy'},
      {path: '/idle-detection', value: 'Idle Detection', i18nKey: 'nav.idleDetection'},
      {path: '/url', value: 'URL'},
      {path: '/is-promise', value: 'isPromise'},
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
      {path: '/page-container', value: 'Page Container', i18nKey: 'nav.pageContainer'},
      {path: '/timeline-wizard', value: 'Timeline Wizard', i18nKey: 'nav.timelineWizard'},
      {path: '/alert', value: 'Alert', i18nKey: 'nav.alert'},
      {path: '/multi-alerts', value: 'Alerts (Multiple)', i18nKey: 'nav.multiAlerts'},
      {path: '/callout', value: 'Callout', i18nKey: 'nav.callout'},
      {path: '/spinner', value: 'Spinner', i18nKey: 'nav.spinner'},
      {path: '/toast', value: 'Toast', i18nKey: 'nav.toast'},
      {path: '/tooltip', value: 'Tooltip', i18nKey: 'nav.tooltip'},
      {path: '/theme-toggle', value: 'Theme Toggle', i18nKey: 'nav.themeToggle'},
      {path: '/file-reader', value: 'File Reader', i18nKey: 'nav.fileReader'},
      {path: '/key-value-inputs', value: 'Key Value Inputs', i18nKey: 'nav.keyValueInputs'},
      {path: '/status-indicator', value: 'Status Indicator', i18nKey: 'nav.statusIndicator'},
      {path: '/idle-detection', value: 'Idle Detection', i18nKey: 'nav.idleDetection'},
      {path: '/certificate', value: 'Certificate View', i18nKey: 'nav.certificate'},
    ],
  },
  {
    path: '/clr-lift/directives',
    value: 'Directives',
    icon: 'compass',
    children: [
      {path: '/scroll-to-step-top', value: 'cllScrollToStepTop'},
      {path: '/datagrid-filter-label-reset', value: 'cllDatagridFilterLabelReset'},
    ],
  },
  {
    path: '/clr-lift/utilities',
    value: 'Utilities',
    icon: 'wrench',
    children: [{path: '/datagrid', value: 'Datagrid', i18nKey: 'nav.datagrid'}],
  },
];
