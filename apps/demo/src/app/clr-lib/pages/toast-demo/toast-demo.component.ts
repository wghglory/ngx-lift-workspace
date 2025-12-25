import {ChangeDetectionStrategy, Component, inject} from '@angular/core';
import {PageContainerComponent, ToastService} from 'clr-lift';

import {CodeBlockComponent} from '../../../shared/components/code-block/code-block.component';
import {highlight} from '../../../shared/utils/highlight.util';

@Component({
  selector: 'app-toast-demo',
  imports: [CodeBlockComponent, PageContainerComponent],
  templateUrl: './toast-demo.component.html',
  styleUrl: './toast-demo.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ToastDemoComponent {
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
