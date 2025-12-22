import {Routes} from '@angular/router';

import {AlertDemoComponent} from './clr-lib/pages/alert-demo/alert-demo.component';
import {CertificateDemoComponent} from './clr-lib/pages/certificate-demo/certificate-demo.component';
import {ClrDatagridUtilComponent} from './clr-lib/pages/clr-datagrid-util/clr-datagrid-util.component';
import {ClrLiftHomeComponent} from './clr-lib/pages/clr-lift-home/clr-lift-home.component';
import {DgStateComponent} from './clr-lib/pages/dg-state/dg-state.component';
import {FileReaderDemoComponent} from './clr-lib/pages/file-reader-demo/file-reader-demo.component';
import {KeyValueInputsDemoComponent} from './clr-lib/pages/key-value-inputs-demo/key-value-inputs-demo.component';
import {MultiAlertsDemoComponent} from './clr-lib/pages/multi-alerts-demo/multi-alerts-demo.component';
import {SpinnerDemoComponent} from './clr-lib/pages/spinner-demo/spinner-demo.component';
import {StatusIndicatorDemoComponent} from './clr-lib/pages/status-indicator-demo/status-indicator-demo.component';
import {TimelineWizardDemoComponent} from './clr-lib/pages/timeline-wizard-demo/timeline-wizard-demo.component';
import {ToastDemoComponent} from './clr-lib/pages/toast-demo/toast-demo.component';
import {TooltipDemoComponent} from './clr-lib/pages/tooltip-demo/tooltip-demo.component';
import {NgxLiftHomeComponent} from './ngx-lib/pages/ngx-lift-home/ngx-lift-home.component';
import {CombineLatestEagerComponent} from './ngx-lib/pages/operators/combine-latest-eager/combine-latest-eager.component';
import {CreateAsyncStateComponent} from './ngx-lib/pages/operators/create-async-state/create-async-state.component';
import {DistinctOnChangeComponent} from './ngx-lib/pages/operators/distinct-on-change/distinct-on-change.component';
import {LoggerComponent} from './ngx-lib/pages/operators/logger/logger.component';
import {PollComponent} from './ngx-lib/pages/operators/poll/poll.component';
import {SwitchMapWithAsyncStateComponent} from './ngx-lib/pages/operators/switch-map-with-async-state/switch-map-with-async-state.component';
import {ArrayJoinPipeComponent} from './ngx-lib/pages/pipes/array-join-pipe/array-join-pipe.component';
import {ByteConverterPipeComponent} from './ngx-lib/pages/pipes/byte-converter-pipe/byte-converter-pipe.component';
import {IsHttpsPipeComponent} from './ngx-lib/pages/pipes/is-https-pipe/is-https-pipe.component';
import {MaskPipeComponent} from './ngx-lib/pages/pipes/mask-pipe/mask-pipe.component';
import {RangePipeComponent} from './ngx-lib/pages/pipes/range-pipe/range-pipe.component';
import {CombineFromComponent} from './ngx-lib/pages/signals/combine-from/combine-from.component';
import {ComputedAsyncComponent} from './ngx-lib/pages/signals/computed-async/computed-async.component';
import {CreateTriggerComponent} from './ngx-lib/pages/signals/create-trigger/create-trigger.component';
import {InjectParamsComponent} from './ngx-lib/pages/signals/inject-params/inject-params.component';
import {InjectQueryParamsComponent} from './ngx-lib/pages/signals/inject-query-params/inject-query-params.component';
import {MergeFromComponent} from './ngx-lib/pages/signals/merge-from/merge-from.component';
import {DifferenceInDaysComponent} from './ngx-lib/pages/utilities/difference-in-days/difference-in-days.component';
import {IdleDetectionDemoComponent} from './ngx-lib/pages/utilities/idle-detection-demo/idle-detection-demo.component';
import {IsEmptyComponent} from './ngx-lib/pages/utilities/is-empty/is-empty.component';
import {IsEqualComponent} from './ngx-lib/pages/utilities/is-equal/is-equal.component';
import {PickByComponent} from './ngx-lib/pages/utilities/pick-by/pick-by.component';
import {UrlComponent} from './ngx-lib/pages/utilities/url/url.component';
import {DateRangeValidatorComponent} from './ngx-lib/pages/validators/date-range-validator/date-range-validator.component';
import {IfValidatorComponent} from './ngx-lib/pages/validators/if-validator/if-validator.component';
import {IntersectionValidatorComponent} from './ngx-lib/pages/validators/intersection-validator/intersection-validator.component';
import {UniqueValidatorComponent} from './ngx-lib/pages/validators/unique-validator/unique-validator.component';
import {UrlValidatorComponent} from './ngx-lib/pages/validators/url-validator/url-validator.component';

export const routes: Routes = [
  {
    path: 'ngx-lift',
    children: [
      {
        path: '',
        component: NgxLiftHomeComponent,
      },
      {
        path: 'signals',
        children: [
          {
            path: 'combineFrom',
            component: CombineFromComponent,
          },
          {
            path: 'mergeFrom',
            component: MergeFromComponent,
          },
          {
            path: 'computedAsync',
            component: ComputedAsyncComponent,
          },
          {
            path: 'createTrigger',
            component: CreateTriggerComponent,
          },
          {
            path: 'injectParams/:id',
            component: InjectParamsComponent,
          },
          {
            path: 'injectParams',
            component: InjectParamsComponent,
          },
          {
            path: 'injectQueryParams',
            component: InjectQueryParamsComponent,
          },
        ],
      },
      {
        path: 'operators',
        children: [
          {
            path: 'createAsyncState',
            component: CreateAsyncStateComponent,
          },
          {
            path: 'switchMapWithAsyncState',
            component: SwitchMapWithAsyncStateComponent,
          },
          {
            path: 'combineLatestEager',
            component: CombineLatestEagerComponent,
          },
          {
            path: 'distinctOnChange',
            component: DistinctOnChangeComponent,
          },
          {
            path: 'logger',
            component: LoggerComponent,
          },
          {
            path: 'poll',
            component: PollComponent,
          },
        ],
      },
      {
        path: 'pipes',
        children: [
          {
            path: 'array-join',
            component: ArrayJoinPipeComponent,
          },
          {
            path: 'byte-converter',
            component: ByteConverterPipeComponent,
          },
          {
            path: 'is-https',
            component: IsHttpsPipeComponent,
          },
          {
            path: 'mask',
            component: MaskPipeComponent,
          },
          {
            path: 'range',
            component: RangePipeComponent,
          },
        ],
      },
      {
        path: 'validators',
        children: [
          {
            path: 'date-range',
            component: DateRangeValidatorComponent,
          },
          {
            path: 'if',
            component: IfValidatorComponent,
          },
          {
            path: 'intersection',
            component: IntersectionValidatorComponent,
          },
          {
            path: 'unique',
            component: UniqueValidatorComponent,
          },
          {
            path: 'url',
            component: UrlValidatorComponent,
          },
        ],
      },
      {
        path: 'utilities',
        children: [
          {
            path: 'difference-in-days',
            component: DifferenceInDaysComponent,
          },
          {
            path: 'idle-detection',
            component: IdleDetectionDemoComponent,
          },
          {
            path: 'is-empty',
            component: IsEmptyComponent,
          },
          {
            path: 'is-equal',
            component: IsEqualComponent,
          },
          {
            path: 'pick-by',
            component: PickByComponent,
          },
          {
            path: 'url',
            component: UrlComponent,
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
        component: ClrLiftHomeComponent,
      },
      {
        path: 'operators',
        children: [
          {
            path: 'dgState',
            component: DgStateComponent,
          },
        ],
      },
      {
        path: 'components',
        children: [
          {
            path: 'spinner',
            component: SpinnerDemoComponent,
          },
          {
            path: 'alert',
            component: AlertDemoComponent,
          },
          {
            path: 'multi-alerts',
            component: MultiAlertsDemoComponent,
          },
          {
            path: 'certificate',
            component: CertificateDemoComponent,
          },
          {
            path: 'key-value-inputs',
            component: KeyValueInputsDemoComponent,
          },
          {
            path: 'status-indicator',
            component: StatusIndicatorDemoComponent,
          },
          {
            path: 'timeline-wizard',
            component: TimelineWizardDemoComponent,
          },
          {
            path: 'toast',
            component: ToastDemoComponent,
          },
          {
            path: 'tooltip',
            component: TooltipDemoComponent,
          },
          {
            path: 'file-reader',
            component: FileReaderDemoComponent,
          },
        ],
      },
      {
        path: 'utilities',
        children: [
          {
            path: 'datagrid',
            component: ClrDatagridUtilComponent,
          },
        ],
      },
    ],
  },
  {path: '', redirectTo: '/ngx-lift', pathMatch: 'full'},
  {
    path: '**',
    component: NgxLiftHomeComponent,
  },
];
