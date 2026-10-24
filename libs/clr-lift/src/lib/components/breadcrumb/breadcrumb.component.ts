import {NgTemplateOutlet} from '@angular/common';
import {ChangeDetectionStrategy, Component, computed, inject, input, output, TemplateRef} from '@angular/core';

import {TranslationService} from '../../services/translation.service';
import {breadcrumbTranslations} from './breadcrumb.l10n';
import {BreadcrumbItem, BreadcrumbLinkContext} from './breadcrumb.model';

/**
 * Caller-owned breadcrumb navigation. The final item is noninteractive current text.
 * Supply a real-anchor linkTemplate for SPA routing; addressless ancestors emit navigate.
 * Set --cll-breadcrumb-font-size on this host or an ancestor to customize typography.
 * This increment wraps the complete trail; deep-path overflow is deferred.
 */
@Component({
  selector: 'cll-breadcrumb',
  imports: [NgTemplateOutlet],
  templateUrl: './breadcrumb.component.html',
  styleUrl: './breadcrumb.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BreadcrumbComponent {
  private readonly translation = inject(TranslationService);
  readonly items = input.required<readonly BreadcrumbItem[]>();
  readonly ariaLabel = input<string>();
  readonly linkTemplate = input<TemplateRef<BreadcrumbLinkContext>>();
  readonly navigate = output<BreadcrumbItem>();

  protected readonly navigationName = computed(() => {
    const name = this.ariaLabel() ?? this.translation.translate('breadcrumb.navigation');
    if (!name.trim()) throw new Error('Breadcrumb: ariaLabel must be nonblank');
    return name;
  });
  protected readonly locations = computed(() => {
    const items = this.items();
    const ids = new Set<string>();
    return items.map((item, index) => {
      if (ids.has(item.id)) throw new Error(`Breadcrumb: duplicate id ${JSON.stringify(item.id)}`);
      ids.add(item.id);
      if (!item.label.trim()) throw new Error(`Breadcrumb: blank label at index ${index}`);
      if (item.href !== undefined) {
        // Match browser protocol parsing before Angular sanitization. Never build URLs from display labels.
        // eslint-disable-next-line no-control-regex -- Browsers ignore embedded ASCII controls in URL schemes.
        const href = item.href.replace(/[\u0000-\u0020\u007f]/g, '');
        const scheme = /^([a-z][a-z\d+.-]*):/i.exec(href)?.[1];
        if (!href || (scheme && !/^(https?|mailto|tel|ftp)$/i.test(scheme))) {
          throw new Error(`Breadcrumb: invalid href at index ${index}`);
        }
        try {
          // Validate syntax without resolving or changing the caller's rendered destination.
          void new URL(item.href, 'https://breadcrumb.invalid/');
        } catch {
          throw new Error(`Breadcrumb: invalid href at index ${index}`);
        }
      }
      const trail = items
        .slice(0, index + 1)
        .map((part) => part.label)
        .join(' > ');
      const depth = new Intl.NumberFormat(this.translation.locale()).format(index + 1);
      return {
        item,
        description: `${item.context ?? trail} · ${this.translation.translate('breadcrumb.depth', depth)}`,
      };
    });
  });

  constructor() {
    this.translation.loadTranslationsForComponent('breadcrumb', breadcrumbTranslations);
  }
}
