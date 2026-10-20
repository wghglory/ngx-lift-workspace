import {RouterLink} from '@angular/router';
import {ChangeDetectionStrategy, Component, computed, inject} from '@angular/core';
import {PageContainerComponent, TranslatePipe, TranslationService} from 'clr-lift';

import {ApiProperty, ApiTableComponent} from '../../../shared/components/api-table';
import {DemoPlaygroundComponent} from '../../../shared/components/demo-playground/demo-playground.component';
import {highlight} from '../../../shared/utils/highlight.util';

@Component({
  selector: 'app-page-container-demo',
  imports: [RouterLink, PageContainerComponent, DemoPlaygroundComponent, TranslatePipe, ApiTableComponent],
  templateUrl: './page-container-demo.component.html',
  styleUrl: './page-container-demo.component.scss',
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
  basicUsageCode = highlight(
    "import {ChangeDetectionStrategy, Component} from '@angular/core';\n\nimport {PageContainerComponent} from 'clr-lift';\n\n@Component({\n  changeDetection: ChangeDetectionStrategy.OnPush,\n  imports: [PageContainerComponent],\n  templateUrl: './example.html',\n})\nexport class UserManagementPageComponent {}",
  );
  basicUsageCodeHtml = highlight(
    `<cll-page-container title="User Management">
  <p>Page body content rendered inside the default slot.</p>
</cll-page-container>`,
  );

  customClassCode = highlight(
    "import {ChangeDetectionStrategy, Component} from '@angular/core';\n\nimport {PageContainerComponent} from 'clr-lift';\n\n@Component({\n  changeDetection: ChangeDetectionStrategy.OnPush,\n  imports: [PageContainerComponent],\n  templateUrl: './example.html',\n})\nexport class SettingsPageComponent {}",
  );
  customClassCodeHtml = highlight(
    `<cll-page-container title="Cluster Settings" customClass="density-compact">
  <section class="card">
    <div class="card-block">
      <p>Configured with custom styling classes.</p>
    </div>
  </section>
</cll-page-container>`,
  );

  readonly customClassStylesCode = highlight(
    `// Global styles.scss: customClass is applied inside the page container.
cll-page-container > .page-container.density-compact {
  padding: var(--cds-global-space-5);
  gap: var(--cds-global-space-3);
  border-inline-start: 3px solid var(--clr-color-action-600);
}`,
    'scss',
  );

  htmlTitleCode = highlight(
    "import {ChangeDetectionStrategy, Component} from '@angular/core';\n\nimport {PageContainerComponent} from 'clr-lift';\n\n@Component({\n  changeDetection: ChangeDetectionStrategy.OnPush,\n  imports: [PageContainerComponent],\n  templateUrl: './example.html',\n})\nexport class AuditLogPageComponent {}",
  );
  htmlTitleCodeHtml = highlight(
    `<!-- The title input supports HTML markup rendered via innerHTML -->
<cll-page-container [title]="'Audit Log <span class=&quot;badge badge-info&quot;>Live</span>'">
  <p>Log entries stream here in real-time.</p>
</cll-page-container>`,
  );
}
