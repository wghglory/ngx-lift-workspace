import {ChangeDetectionStrategy, Component, inject} from '@angular/core';
import {PageContainerComponent, ToastService, TranslatePipe} from 'clr-lift';

import {ApiProperty, ApiTableComponent} from '../../../shared/components/api-table';
import {CodeBlockComponent} from '../../../shared/components/code-block/code-block.component';
import {highlight} from '../../../shared/utils/highlight.util';

@Component({
  selector: 'app-toast-demo',
  imports: [ApiTableComponent, CodeBlockComponent, PageContainerComponent, TranslatePipe],
  templateUrl: './toast-demo.component.html',
  styleUrl: './toast-demo.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ToastDemoComponent {
  readonly methods: ApiProperty[] = [
    {
      name: 'addToast(options: ToastOptions)',
      type: 'void',
      description: 'Creates a toast with the specified options.',
    },
    {
      name: 'success(options: ToastOptions)',
      type: 'void',
      description: 'Creates a success toast with the specified options.',
    },
    {
      name: 'info(options: ToastOptions)',
      type: 'void',
      description: 'Creates an info toast with the specified options.',
    },
    {
      name: 'warning(options: ToastOptions)',
      type: 'void',
      description: 'Creates a warning toast with the specified options.',
    },
    {
      name: 'error(options: ToastOptions)',
      type: 'void',
      description: 'Creates an error toast with the specified options.',
    },
  ];

  readonly toastOptions: ApiProperty[] = [
    {
      name: 'title',
      type: 'string',
      required: true,
      description: 'The title of the toast message.',
    },
    {
      name: 'description',
      type: 'string',
      required: true,
      description: 'The description of the toast message.',
    },
    {
      name: 'toastType',
      type: "'success' | 'info' | 'warning' | 'error'",
      defaultValue: "'info'",
      description: 'The type of toast.',
    },
    {
      name: 'date',
      type: 'string',
      description: 'A relative timestamp (e.g., "1hr ago").',
    },
    {
      name: 'manualClosable',
      type: 'boolean',
      defaultValue: 'true',
      description: 'Whether the toast can be manually closed.',
    },
    {
      name: 'timeoutSeconds',
      type: 'number',
      description:
        "The number of seconds before the toast automatically closes. If not provided, uses the container's default.",
    },
    {
      name: 'primaryButtonText',
      type: 'string',
      description: 'Text for the primary action button.',
    },
    {
      name: 'primaryButtonClick',
      type: '() => void',
      description: 'Callback function for the primary button click.',
    },
    {
      name: 'secondaryButtonText',
      type: 'string',
      description: 'Text for the secondary action button.',
    },
    {
      name: 'secondaryButtonClick',
      type: '() => void',
      description: 'Callback function for the secondary button click.',
    },
    {
      name: 'closed',
      type: '() => void',
      description: 'Callback function called when the toast is closed.',
    },
  ];

  readonly containerInputs: ApiProperty[] = [
    {
      name: 'timeoutSeconds',
      type: 'number',
      defaultValue: '8',
      description: 'Default timeout in seconds for toasts.',
    },
    {
      name: 'manualClosable',
      type: 'boolean',
      defaultValue: 'true',
      description: 'Whether toasts can be manually closed by default.',
    },
    {
      name: 'topOffset',
      type: 'number',
      defaultValue: '0',
      description: 'Distance from the top of the screen in pixels.',
    },
  ];

  private toastService = inject(ToastService);

  containerCode = highlight(`
import {Component} from '@angular/core';
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
  \`
})
export class AppComponent {}
  `);

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
