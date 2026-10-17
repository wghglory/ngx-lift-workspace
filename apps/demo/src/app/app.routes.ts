import {Routes} from '@angular/router';

export const routes: Routes = [
  {
    path: 'ngx-lift',
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./ngx-lib/pages/ngx-lift-home/ngx-lift-home.component').then((module) => module.NgxLiftHomeComponent),
      },
      {
        path: 'signals',
        children: [
          {
            path: 'combineFrom',
            loadComponent: () =>
              import('./ngx-lib/pages/signals/combine-from/combine-from.component').then(
                (module) => module.CombineFromComponent,
              ),
          },
          {
            path: 'mergeFrom',
            loadComponent: () =>
              import('./ngx-lib/pages/signals/merge-from/merge-from.component').then(
                (module) => module.MergeFromComponent,
              ),
          },
          {
            path: 'computedAsync',
            loadComponent: () =>
              import('./ngx-lib/pages/signals/computed-async/computed-async.component').then(
                (module) => module.ComputedAsyncComponent,
              ),
          },
          {
            path: 'resourceAsync',
            loadComponent: () =>
              import('./ngx-lib/pages/signals/resource-async/resource-async.component').then(
                (module) => module.ResourceAsyncComponent,
              ),
          },
          {
            path: 'toSignalForm',
            loadComponent: () =>
              import('./ngx-lib/pages/signals/to-signal-form/to-signal-form.component').then(
                (module) => module.ToSignalFormComponent,
              ),
          },
          {
            path: 'createTrigger',
            loadComponent: () =>
              import('./ngx-lib/pages/signals/create-trigger/create-trigger.component').then(
                (module) => module.CreateTriggerComponent,
              ),
          },
          {
            path: 'injectParams/:id',
            loadComponent: () =>
              import('./ngx-lib/pages/signals/inject-params/inject-params.component').then(
                (module) => module.InjectParamsComponent,
              ),
          },
          {
            path: 'injectParams',
            loadComponent: () =>
              import('./ngx-lib/pages/signals/inject-params/inject-params.component').then(
                (module) => module.InjectParamsComponent,
              ),
          },
          {
            path: 'injectQueryParams',
            loadComponent: () =>
              import('./ngx-lib/pages/signals/inject-query-params/inject-query-params.component').then(
                (module) => module.InjectQueryParamsComponent,
              ),
          },
        ],
      },
      {
        path: 'query',
        children: [
          {
            path: 'overview',
            data: {guide: 'overview'},
            loadComponent: () =>
              import('./ngx-lib/pages/query/query-guides/query-guides.component').then(
                (module) => module.QueryGuidesComponent,
              ),
          },
          {
            path: 'cache',
            data: {guide: 'cache'},
            loadComponent: () =>
              import('./ngx-lib/pages/query/query-guides/query-guides.component').then(
                (module) => module.QueryGuidesComponent,
              ),
          },
          {
            path: 'keys',
            data: {guide: 'keys'},
            loadComponent: () =>
              import('./ngx-lib/pages/query/query-guides/query-guides.component').then(
                (module) => module.QueryGuidesComponent,
              ),
          },

          {
            path: 'choosing',
            data: {guide: 'choosing'},
            loadComponent: () =>
              import('./ngx-lib/pages/query/query-guides/query-guides.component').then(
                (module) => module.QueryGuidesComponent,
              ),
          },
          {
            path: 'reference',
            data: {guide: 'reference'},
            loadComponent: () =>
              import('./ngx-lib/pages/query/query-guides/query-guides.component').then(
                (module) => module.QueryGuidesComponent,
              ),
          },

          {
            path: 'queryResource',
            loadComponent: () =>
              import('./ngx-lib/pages/query/query-resource/query-resource.component').then(
                (module) => module.QueryResourceDemoComponent,
              ),
          },
          {
            path: 'queryResources',
            loadComponent: () =>
              import('./ngx-lib/pages/query/query-resources/query-resources.component').then(
                (module) => module.QueryResourcesDemoComponent,
              ),
          },
          {
            path: 'mutateResource',
            loadComponent: () =>
              import('./ngx-lib/pages/query/mutate-resource/mutate-resource.component').then(
                (module) => module.MutateResourceDemoComponent,
              ),
          },
          {
            path: '',
            redirectTo: 'overview',
            pathMatch: 'full',
          },
        ],
      },
      {
        path: 'operators',
        children: [
          {
            path: 'createAsyncState',
            loadComponent: () =>
              import('./ngx-lib/pages/operators/create-async-state/create-async-state.component').then(
                (module) => module.CreateAsyncStateComponent,
              ),
          },
          {
            path: 'switchMapWithAsyncState',
            loadComponent: () =>
              import('./ngx-lib/pages/operators/switch-map-with-async-state/switch-map-with-async-state.component').then(
                (module) => module.SwitchMapWithAsyncStateComponent,
              ),
          },
          {
            path: 'combineLatestEager',
            loadComponent: () =>
              import('./ngx-lib/pages/operators/combine-latest-eager/combine-latest-eager.component').then(
                (module) => module.CombineLatestEagerComponent,
              ),
          },
          {
            path: 'distinctOnChange',
            loadComponent: () =>
              import('./ngx-lib/pages/operators/distinct-on-change/distinct-on-change.component').then(
                (module) => module.DistinctOnChangeComponent,
              ),
          },
          {
            path: 'kubernetesPagination',
            loadComponent: () =>
              import('./ngx-lib/pages/operators/kubernetes-pagination/kubernetes-pagination.component').then(
                (module) => module.KubernetesPaginationComponent,
              ),
          },
          {
            path: 'logger',
            loadComponent: () =>
              import('./ngx-lib/pages/operators/logger/logger.component').then((module) => module.LoggerComponent),
          },
          {
            path: 'poll',
            loadComponent: () =>
              import('./ngx-lib/pages/operators/poll/poll.component').then((module) => module.PollComponent),
          },
          {
            path: 'k8sRetryBackoff',
            loadComponent: () =>
              import('./ngx-lib/pages/operators/k8s-retry-backoff/k8s-retry-backoff.component').then(
                (module) => module.K8sRetryBackoffComponent,
              ),
          },
          {
            path: 'startWithTap',
            loadComponent: () =>
              import('./ngx-lib/pages/operators/start-with-tap/start-with-tap.component').then(
                (module) => module.StartWithTapComponent,
              ),
          },
        ],
      },
      {
        path: 'interceptors',
        children: [
          {
            path: 'k8sRetryBackoff',
            loadComponent: () =>
              import('./ngx-lib/pages/interceptors/k8s-retry-backoff-interceptor/k8s-retry-backoff-interceptor.component').then(
                (module) => module.K8sRetryBackoffInterceptorComponent,
              ),
          },
        ],
      },
      {
        path: 'pipes',
        children: [
          {
            path: 'array-join',
            loadComponent: () =>
              import('./ngx-lib/pages/pipes/array-join-pipe/array-join-pipe.component').then(
                (module) => module.ArrayJoinPipeComponent,
              ),
          },
          {
            path: 'byte-converter',
            loadComponent: () =>
              import('./ngx-lib/pages/pipes/byte-converter-pipe/byte-converter-pipe.component').then(
                (module) => module.ByteConverterPipeComponent,
              ),
          },
          {
            path: 'is-https',
            loadComponent: () =>
              import('./ngx-lib/pages/pipes/is-https-pipe/is-https-pipe.component').then(
                (module) => module.IsHttpsPipeComponent,
              ),
          },
          {
            path: 'mask',
            loadComponent: () =>
              import('./ngx-lib/pages/pipes/mask-pipe/mask-pipe.component').then((module) => module.MaskPipeComponent),
          },
          {
            path: 'range',
            loadComponent: () =>
              import('./ngx-lib/pages/pipes/range-pipe/range-pipe.component').then(
                (module) => module.RangePipeComponent,
              ),
          },
        ],
      },
      {
        path: 'validators',
        children: [
          {
            path: 'date-range',
            loadComponent: () =>
              import('./ngx-lib/pages/validators/date-range-validator/date-range-validator.component').then(
                (module) => module.DateRangeValidatorComponent,
              ),
          },
          {
            path: 'if',
            loadComponent: () =>
              import('./ngx-lib/pages/validators/if-validator/if-validator.component').then(
                (module) => module.IfValidatorComponent,
              ),
          },
          {
            path: 'intersection',
            loadComponent: () =>
              import('./ngx-lib/pages/validators/intersection-validator/intersection-validator.component').then(
                (module) => module.IntersectionValidatorComponent,
              ),
          },
          {
            path: 'unique',
            loadComponent: () =>
              import('./ngx-lib/pages/validators/unique-validator/unique-validator.component').then(
                (module) => module.UniqueValidatorComponent,
              ),
          },
          {
            path: 'url',
            loadComponent: () =>
              import('./ngx-lib/pages/validators/url-validator/url-validator.component').then(
                (module) => module.UrlValidatorComponent,
              ),
          },
        ],
      },
      {
        path: 'utilities',
        children: [
          {
            path: 'difference-in-days',
            loadComponent: () =>
              import('./ngx-lib/pages/utilities/difference-in-days/difference-in-days.component').then(
                (module) => module.DifferenceInDaysComponent,
              ),
          },
          {
            path: 'idle-detection',
            loadComponent: () =>
              import('./ngx-lib/pages/utilities/idle-detection-demo/idle-detection-demo.component').then(
                (module) => module.IdleDetectionDemoComponent,
              ),
          },
          {
            path: 'is-empty',
            loadComponent: () =>
              import('./ngx-lib/pages/utilities/is-empty/is-empty.component').then((module) => module.IsEmptyComponent),
          },
          {
            path: 'is-equal',
            loadComponent: () =>
              import('./ngx-lib/pages/utilities/is-equal/is-equal.component').then((module) => module.IsEqualComponent),
          },
          {
            path: 'is-promise',
            loadComponent: () =>
              import('./ngx-lib/pages/utilities/is-promise/is-promise.component').then(
                (module) => module.IsPromiseComponent,
              ),
          },
          {
            path: 'pick-by',
            loadComponent: () =>
              import('./ngx-lib/pages/utilities/pick-by/pick-by.component').then((module) => module.PickByComponent),
          },
          {
            path: 'url',
            loadComponent: () =>
              import('./ngx-lib/pages/utilities/url/url.component').then((module) => module.UrlComponent),
          },
        ],
      },
    ],
  },
  {
    path: 'clr-lift',
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./clr-lib/pages/clr-lift-home/clr-lift-home.component').then((module) => module.ClrLiftHomeComponent),
      },
      {
        path: 'operators',
        children: [
          {
            path: 'dgState',
            loadComponent: () =>
              import('./clr-lib/pages/dg-state/dg-state.component').then((module) => module.DgStateComponent),
          },
        ],
      },
      {
        path: 'components',
        children: [
          {
            path: 'spinner',
            loadComponent: () =>
              import('./clr-lib/pages/spinner-demo/spinner-demo.component').then(
                (module) => module.SpinnerDemoComponent,
              ),
          },
          {
            path: 'alert',
            loadComponent: () =>
              import('./clr-lib/pages/alert-demo/alert-demo.component').then((module) => module.AlertDemoComponent),
          },
          {
            path: 'multi-alerts',
            loadComponent: () =>
              import('./clr-lib/pages/multi-alerts-demo/multi-alerts-demo.component').then(
                (module) => module.MultiAlertsDemoComponent,
              ),
          },
          {
            path: 'callout',
            loadComponent: () =>
              import('./clr-lib/pages/callout-demo/callout-demo.component').then(
                (module) => module.CalloutDemoComponent,
              ),
          },
          {
            path: 'certificate',
            loadComponent: () =>
              import('./clr-lib/pages/certificate-demo/certificate-demo.component').then(
                (module) => module.CertificateDemoComponent,
              ),
          },
          {
            path: 'file-reader',
            loadComponent: () =>
              import('./clr-lib/pages/file-reader-demo/file-reader-demo.component').then(
                (module) => module.FileReaderDemoComponent,
              ),
          },
          {
            path: 'idle-detection',
            loadComponent: () =>
              import('./clr-lib/pages/idle-detection-demo/idle-detection-demo.component').then(
                (module) => module.ClrIdleDetectionDemoComponent,
              ),
          },
          {
            path: 'key-value-inputs',
            loadComponent: () =>
              import('./clr-lib/pages/key-value-inputs-demo/key-value-inputs-demo.component').then(
                (module) => module.KeyValueInputsDemoComponent,
              ),
          },
          {
            path: 'page-container',
            loadComponent: () =>
              import('./clr-lib/pages/page-container-demo/page-container-demo.component').then(
                (module) => module.PageContainerDemoComponent,
              ),
          },
          {
            path: 'status-indicator',
            loadComponent: () =>
              import('./clr-lib/pages/status-indicator-demo/status-indicator-demo.component').then(
                (module) => module.StatusIndicatorDemoComponent,
              ),
          },
          {
            path: 'theme-toggle',
            loadComponent: () =>
              import('./clr-lib/pages/theme-toggle-demo/theme-toggle-demo.component').then(
                (module) => module.ThemeToggleDemoComponent,
              ),
          },
          {
            path: 'timeline-wizard',
            loadComponent: () =>
              import('./clr-lib/pages/timeline-wizard-demo/timeline-wizard-demo.component').then(
                (module) => module.TimelineWizardDemoComponent,
              ),
          },
          {
            path: 'toast',
            loadComponent: () =>
              import('./clr-lib/pages/toast-demo/toast-demo.component').then((module) => module.ToastDemoComponent),
          },
          {
            path: 'tooltip',
            loadComponent: () =>
              import('./clr-lib/pages/tooltip-demo/tooltip-demo.component').then(
                (module) => module.TooltipDemoComponent,
              ),
          },
        ],
      },
      {
        path: 'utilities',
        children: [
          {
            path: 'datagrid',
            loadComponent: () =>
              import('./clr-lib/pages/clr-datagrid-util/clr-datagrid-util.component').then(
                (module) => module.ClrDatagridUtilComponent,
              ),
          },
        ],
      },
    ],
  },
  {path: '', redirectTo: '/ngx-lift', pathMatch: 'full'},
  {
    path: '**',
    loadComponent: () =>
      import('./ngx-lib/pages/ngx-lift-home/ngx-lift-home.component').then((module) => module.NgxLiftHomeComponent),
  },
];
