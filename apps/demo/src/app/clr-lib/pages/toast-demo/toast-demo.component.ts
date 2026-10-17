import {DemoPlaygroundComponent} from '../../../shared/components/demo-playground/demo-playground.component';
import {ChangeDetectionStrategy, Component, inject, computed} from '@angular/core';
import {PageContainerComponent, ToastService, TranslatePipe, TranslationService} from 'clr-lift';

import {ApiProperty, ApiTableComponent} from '../../../shared/components/api-table';
import {CodeBlockComponent} from '../../../shared/components/code-block/code-block.component';
import {highlight} from '../../../shared/utils/highlight.util';

@Component({
  selector: 'app-toast-demo',
  imports: [DemoPlaygroundComponent, ApiTableComponent, CodeBlockComponent, PageContainerComponent, TranslatePipe],
  templateUrl: './toast-demo.component.html',
  styleUrl: './toast-demo.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ToastDemoComponent {
  readonly toastStarterHtml = highlight(
    `<!-- Place the container once in the application shell. -->
<cll-toast-container />

<div cds-layout="horizontal gap:xs align:center wrap">
  <button (click)="showSuccessToast()" class="btn btn-success">Success Toast</button>
  <button (click)="showInfoToast()" class="btn btn-primary">Info Toast</button>
  <button (click)="showErrorToast()" class="btn btn-danger">Error Toast</button>
  <button (click)="showWarningToast()" class="btn btn-warning">Warning Toast</button>
</div>`,
  );
  readonly toastStarterCode = highlight(
    "import {ChangeDetectionStrategy, Component, inject} from '@angular/core';\nimport {ToastService, ToastContainerComponent} from 'clr-lift';\n\n@Component({\n  selector: 'app-feedback',\n  imports: [ToastContainerComponent],\n  templateUrl: './feedback.html',\n  changeDetection: ChangeDetectionStrategy.OnPush,\n})\nexport class FeedbackComponent {\n  private toastService = inject(ToastService);\n\n  showSuccessToast() {\n    this.toastService.success({\n      title: 'Great Toast',\n      description: 'I am a successful message!',\n    });\n  }\n\n  showWarningToast() {\n    this.toastService.warning({\n      title: 'Warning Toast',\n      description: 'I am a warning message!',\n    });\n  }\n\n  showErrorToast() {\n    this.toastService.error({\n      title: 'Error Toast',\n      description: 'I am a Error message! I will be closed in 10s automatically.',\n      date: '1hr ago',\n      timeoutSeconds: 10,\n      primaryButtonText: 'More Info',\n      primaryButtonClick() {\n        alert('Assume opening a new tab');\n      },\n    });\n  }\n\n  showInfoToast() {\n    this.toastService.info({\n      title: 'Info Toast',\n      description: 'I am the default toast type.',\n    });\n  }\n}",
  );
  private readonly translationService = inject(TranslationService);

  readonly methods = computed<ApiProperty[]>(() => [
    {
      name: 'addToast(options: ToastOptions)',
      type: 'void',
      description: this.translationService.translate('demoApi.toast-demo.methods.addToast(options: ToastOptions)'),
    },
    {
      name: 'success(options: ToastOptions)',
      type: 'void',
      description: this.translationService.translate('demoApi.toast-demo.methods.success(options: ToastOptions)'),
    },
    {
      name: 'info(options: ToastOptions)',
      type: 'void',
      description: this.translationService.translate('demoApi.toast-demo.methods.info(options: ToastOptions)'),
    },
    {
      name: 'warning(options: ToastOptions)',
      type: 'void',
      description: this.translationService.translate('demoApi.toast-demo.methods.warning(options: ToastOptions)'),
    },
    {
      name: 'error(options: ToastOptions)',
      type: 'void',
      description: this.translationService.translate('demoApi.toast-demo.methods.error(options: ToastOptions)'),
    },
  ]);

  readonly toastOptions = computed<ApiProperty[]>(() => [
    {
      name: 'title',
      type: 'string',
      required: true,
      description: this.translationService.translate('demoApi.toast-demo.toastOptions.title'),
    },
    {
      name: 'description',
      type: 'string',
      required: true,
      description: this.translationService.translate('demoApi.toast-demo.toastOptions.description'),
    },
    {
      name: 'toastType',
      type: "'success' | 'info' | 'warning' | 'error'",
      defaultValue: "'info'",
      description: this.translationService.translate('demoApi.toast-demo.toastOptions.toastType'),
    },
    {
      name: 'date',
      type: 'string',
      description: this.translationService.translate('demoApi.toast-demo.toastOptions.date'),
    },
    {
      name: 'manualClosable',
      type: 'boolean',
      defaultValue: 'true',
      description: this.translationService.translate('demoApi.toast-demo.toastOptions.manualClosable'),
    },
    {
      name: 'timeoutSeconds',
      type: 'number',
      description: this.translationService.translate('demoApi.toast-demo.toastOptions.timeoutSeconds'),
    },
    {
      name: 'primaryButtonText',
      type: 'string',
      description: this.translationService.translate('demoApi.toast-demo.toastOptions.primaryButtonText'),
    },
    {
      name: 'primaryButtonClick',
      type: '() => void',
      description: this.translationService.translate('demoApi.toast-demo.toastOptions.primaryButtonClick'),
    },
    {
      name: 'secondaryButtonText',
      type: 'string',
      description: this.translationService.translate('demoApi.toast-demo.toastOptions.secondaryButtonText'),
    },
    {
      name: 'secondaryButtonClick',
      type: '() => void',
      description: this.translationService.translate('demoApi.toast-demo.toastOptions.secondaryButtonClick'),
    },
    {
      name: 'closed',
      type: '() => void',
      description: this.translationService.translate('demoApi.toast-demo.toastOptions.closed'),
    },
  ]);

  readonly containerInputs = computed<ApiProperty[]>(() => [
    {
      name: 'timeoutSeconds',
      type: 'number',
      defaultValue: '8',
      description: this.translationService.translate('demoApi.toast-demo.containerInputs.timeoutSeconds'),
    },
    {
      name: 'manualClosable',
      type: 'boolean',
      defaultValue: 'true',
      description: this.translationService.translate('demoApi.toast-demo.containerInputs.manualClosable'),
    },
    {
      name: 'topOffset',
      type: 'number',
      defaultValue: '0',
      description: this.translationService.translate('demoApi.toast-demo.containerInputs.topOffset'),
    },
  ]);

  private toastService = inject(ToastService);

  containerCode = highlight(`import {Component} from '@angular/core';
import {ToastContainerComponent} from 'clr-lift';

@Component({
  selector: 'app-root',
  imports: [ToastContainerComponent],
  template: \`
    <clr-main-container>
      <!-- your app content -->
    </clr-main-container>

    <!-- toast container should appear only once -->
    <cll-toast-container [timeoutSeconds]="8" />
  \`,
})
export class AppComponent {}`);

  addToastCode = highlight(`
import {ToastService} from 'clr-lift';
import {Component, inject} from '@angular/core';

@Component({})
export class ToastExampleComponent {
  private toastService = inject(ToastService);

  showToast() {
    this.toastService.addToast({
      // required properties
      title: 'Great Toast',
      description: 'I am a successful message!',

      // optional properties below
      toastType: 'success', // you can pass 'info', 'warning', 'error' as well
      date: '1hr ago',
      manualClosable: true,
      timeoutSeconds: 6,
      closed() {
        console.log('closed');
      },
      primaryButtonText: 'Primary Button',
      primaryButtonClick() {
        alert('primary button clicked');
      },
      secondaryButtonText: 'Secondary Button',
      secondaryButtonClick() {
        alert('secondary button clicked');
      },
    });
  }
}
  `);

  shortHandCode = highlight(`
import {ToastService} from 'clr-lift';
import {Component, inject} from '@angular/core';

@Component({})
export class ToastShorthandExampleComponent {
  private toastService = inject(ToastService);

  showToasts() {
    this.toastService.success({
      title: 'Great Toast',
      description: 'I am a successful message!',
    });

    this.toastService.warning({
      title: 'Warning Toast',
      description: 'I am a warning message!',
    });

    this.toastService.error({
      title: 'Error Toast',
      description: 'I am a Error message! I will be closed in 10s automatically.',
      date: '1hr ago',
      timeoutSeconds: 10,
      primaryButtonText: 'More Info',
      primaryButtonClick() {
        alert('Assume opening a new tab');
      },
    });

    this.toastService.info({
      title: 'Info Toast',
      description: 'I am the default toast type.',
    });
  }
}
  `);

  showAddToast() {
    this.toastService.addToast({
      title: 'Great Toast',
      description: 'I am a successful message!',
      // below properties are optional
      toastType: 'success',
      date: '1hr ago',
      manualClosable: true,
      // timeoutSeconds: 6,
      closed() {
        console.log('closed');
      },
      primaryButtonText: 'Primary Button',
      primaryButtonClick() {
        alert('primary button clicked');
      },
      secondaryButtonText: 'Secondary Button',
      secondaryButtonClick() {
        alert('secondary button clicked');
      },
    });
  }

  showSuccessToast() {
    this.toastService.success({
      title: 'Great Toast',
      description: 'I am a successful message!',
    });
  }

  showWarningToast() {
    this.toastService.warning({
      title: 'Warning Toast',
      description: 'I am a warning message!',
    });
  }

  showErrorToast() {
    this.toastService.error({
      title: 'Error Toast',
      description: 'I am a Error message! I will be closed in 10s automatically.',
      date: '1hr ago',
      timeoutSeconds: 10,
      primaryButtonText: 'More Info',
      primaryButtonClick() {
        alert('Assume opening a new tab');
      },
    });
  }

  showInfoToast() {
    this.toastService.info({
      title: 'Info Toast',
      description: 'I am the default toast type.',
    });
  }
}
