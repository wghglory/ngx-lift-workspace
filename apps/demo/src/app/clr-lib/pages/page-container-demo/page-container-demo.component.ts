import {ChangeDetectionStrategy, Component, computed, inject} from '@angular/core';
import {PageContainerComponent, TranslatePipe, TranslationService} from 'clr-lift';

import {ApiProperty, ApiTableComponent} from '../../../shared/components/api-table';
import {DemoPlaygroundComponent} from '../../../shared/components/demo-playground/demo-playground.component';
import {highlight} from '../../../shared/utils/highlight.util';

@Component({
  selector: 'app-page-container-demo',
  imports: [PageContainerComponent, DemoPlaygroundComponent, TranslatePipe, ApiTableComponent],
  templateUrl: './page-container-demo.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PageContainerDemoComponent {
  private translationService = inject(TranslationService);

  pageContainerInputs = computed<ApiProperty[]>(() => {
    this.translationService.currentLanguage();
    return [
      {
        name: 'title',
        type: 'string',
        required: true,
        description: this.translationService.translate('pageContainer.inputTitle'),
      },
      {
        name: 'customClass',
        type: 'string',
        defaultValue: `''`,
        description: this.translationService.translate('pageContainer.inputCustomClass'),
      },
    ];
  });
  basicUsageCode = highlight(`
import {PageContainerComponent} from 'clr-lift';

@Component({
  imports: [PageContainerComponent],
  template: \`
    <cll-page-container title="User Management">
      <p>Page body content rendered inside the default slot.</p>
    </cll-page-container>
  \`
})
export class UserManagementPageComponent {}
  `);

  customClassCode = highlight(`
import {PageContainerComponent} from 'clr-lift';

@Component({
  imports: [PageContainerComponent],
  template: \`
    <cll-page-container
      title="Cluster Settings"
      customClass="density-compact"
    >
      <section class="card">
        <div class="card-block">
          <p>Configured with custom styling classes.</p>
        </div>
      </section>
    </cll-page-container>
  \`
})
export class SettingsPageComponent {}
  `);

  htmlTitleCode = highlight(`
import {PageContainerComponent} from 'clr-lift';

@Component({
  imports: [PageContainerComponent],
  template: \`
    <!-- The title input supports HTML markup rendered via innerHTML -->
    <cll-page-container
      [title]="'Audit Log <span class=\\'badge badge-info\\'>Live</span>'"
    >
      <p>Log entries stream here in real-time.</p>
    </cll-page-container>
  \`
})
export class AuditLogPageComponent {}
  `);
}
