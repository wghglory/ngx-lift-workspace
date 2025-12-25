/*
 * ******************************************************************
 * Copyright (c) 2025 Broadcom. All Rights Reserved.
 * Broadcom Confidential. The term "Broadcom" refers to Broadcom Inc.
 * and/or its subsidiaries.
 * ******************************************************************
 */

// https://eslint.org/docs/latest/extend/plugins#share-plugins
// https://eslint.org/docs/latest/extend/custom-rules
// https://dev.to/devsmitra/10-steps-to-create-a-custom-eslint-plugin-1a32

import angularEslintTemplate from '@angular-eslint/eslint-plugin-template';
const { rules } = angularEslintTemplate;

const ESLINT_BASE_RULE = rules['label-has-associated-control'];

const DEFAULT_CONTAINER_COMPONENTS = [
  'clr-checkbox-container',
  'clr-checkbox-wrapper',
  'clr-combobox-container',
  'clr-control-container',
  'clr-date-container',
  'clr-input-container',
  'clr-number-input-container',
  'clr-password-container',
  'clr-radio-container',
  'clr-radio-wrapper',
  'clr-range-container',
  'clr-select-container',
  'clr-textarea-container',
  'clr-toggle-container',
  'clr-toggle-wrapper',
  'clr-file-input-container',
];

const customRules = {
  'label-has-associated-control': {
    name: ESLINT_BASE_RULE.name,
    meta: ESLINT_BASE_RULE.meta,
    defaultOptions: ESLINT_BASE_RULE.defaultOptions,
    // refer to https://github-vcf.devops.broadcom.net/vcf/automation/blob/main/ui/tango-ui-sdk/packages/eslint-plugin/rules/label-has-associated-control.js
    create(context, options) {
      const entryPointName = `Element$1`;
      const createFunction = ESLINT_BASE_RULE.create(context, options);
      return {
        [entryPointName](node) {
          const allContainerComponents = [
            ...DEFAULT_CONTAINER_COMPONENTS,
            ...(context.options[0]?.containerComponents ?? []),
          ];
          let parentNode = node.parent;
          while (parentNode.type === 'Template') {
            // If the label has *ngIf, this gets converted to <ng-template> wrapping the label
            // If this is the situation, we should check the element that's parent of the <ng-template>
            parentNode = parentNode.parent;
          }
          if (allContainerComponents.includes(parentNode.name)) {
            return;
          }
          createFunction[entryPointName](node);
        },
        onCodePathEnd() {
          createFunction.onCodePathEnd();
        },
      };
    },
  },
};

const plugin = {
  meta: {
    name: 'eslint-plugin-label',
    version: '1.0.0',
  },
  rules: customRules,
  configs: {},
};

// assign configs here so we can reference `plugin`
Object.assign(plugin.configs, {
  recommended: [
    {
      plugins: {
        label: plugin,
      },
      rules: customRules,
    },
  ],
});

export default plugin;
