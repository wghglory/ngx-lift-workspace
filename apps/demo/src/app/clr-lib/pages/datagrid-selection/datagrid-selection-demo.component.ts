import {ChangeDetectionStrategy, Component, computed, inject} from '@angular/core';
import {PageContainerComponent, TranslatePipe, TranslationService} from 'clr-lift';

import {ApiTableComponent} from '../../../shared/components/api-table/api-table.component';
import {ApiProperty} from '../../../shared/components/api-table/api-table.model';
import {CodeBlockComponent} from '../../../shared/components/code-block/code-block.component';
import {DemoPlaygroundComponent} from '../../../shared/components/demo-playground/demo-playground.component';
import {
  multipleTs,
  multipleHtml,
  singleTs,
  singleHtml,
  policyTs,
  policyHtml,
  pickerTs,
  pickerHtml,
  modelTs,
  modelHtml,
  asyncSubmitTs,
  asyncSubmitHtml,
  pickerParentTs,
  pickerParentHtml,
} from './example-source';
import {AsyncSubmitComponent} from './async-submit.component';
import {DataServicePolicyFormComponent} from './data-service-policy-form.component';
import {registerExampleMessages} from './organization-example.messages';
import {PolicyFormComponent} from './picker-parent.component';
import {SimpleOrganizationGridComponent} from './simple-multiple.component';
import {SingleOrganizationGridComponent} from './simple-single.component';
import {TemplateOrganizationFormComponent} from './template-driven.component';

@Component({
  imports: [
    PageContainerComponent,
    ApiTableComponent,
    CodeBlockComponent,
    TranslatePipe,
    DemoPlaygroundComponent,
    SimpleOrganizationGridComponent,
    SingleOrganizationGridComponent,
    DataServicePolicyFormComponent,
    PolicyFormComponent,
    AsyncSubmitComponent,
    TemplateOrganizationFormComponent,
  ],
  templateUrl: './datagrid-selection-demo.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DatagridSelectionDemoComponent {
  private readonly translationService = inject(TranslationService);

  readonly multipleTs = multipleTs;
  readonly multipleHtml = multipleHtml;
  readonly singleTs = singleTs;
  readonly singleHtml = singleHtml;
  readonly policyTs = policyTs;
  readonly policyHtml = policyHtml;
  readonly pickerTs = pickerTs;
  readonly pickerHtml = pickerHtml;
  readonly pickerParentTs = pickerParentTs;
  readonly pickerParentHtml = pickerParentHtml;
  readonly modelTs = modelTs;
  readonly modelHtml = modelHtml;
  readonly asyncSubmitTs = asyncSubmitTs;
  readonly asyncSubmitHtml = asyncSubmitHtml;
  readonly inputs = computed<ApiProperty[]>(() => [
    {
      name: 'required',
      type: 'boolean',
      defaultValue: 'false',
      description: this.translationService.translate('selectionDemo.reference.required'),
    },
    {
      name: 'helper',
      type: 'string',
      defaultValue: "''",
      description: this.translationService.translate('selectionDemo.reference.helper'),
    },
    {
      name: 'error',
      type: 'string',
      defaultValue: "''",
      description: this.translationService.translate('selectionDemo.reference.error'),
    },
    {
      name: 'layout',
      type: "'horizontal' | 'vertical'",
      defaultValue: 'undefined',
      description: this.translationService.translate('selectionDemo.reference.layout'),
    },
    {
      name: 'readonly',
      type: 'boolean',
      defaultValue: 'false',
      description: this.translationService.translate('selectionDemo.reference.readonly'),
    },
    {
      name: 'itemAvailability',
      type: '(item: T) => DatagridItemAvailability',
      defaultValue: '() => ({disabled: false})',
      description: this.translationService.translate('selectionDemo.reference.itemAvailability'),
    },
  ]);

  constructor() {
    registerExampleMessages(this.translationService);
  }
}
