import {HttpClient} from '@angular/common/http';
import {ChangeDetectionStrategy, Component, computed, inject, signal} from '@angular/core';
import {toSignal} from '@angular/core/rxjs-interop';
import {ActivatedRoute, Router, RouterLink} from '@angular/router';
import {ClrRangeModule} from '@clr/angular';
import {BreadcrumbComponent, BreadcrumbItem, PageContainerComponent, TranslatePipe, TranslationService} from 'clr-lift';
import {catchError, of} from 'rxjs';

import {DemoPlaygroundComponent} from '../../../shared/components/demo-playground/demo-playground.component';

const path = '/clr-lift/components/breadcrumb';

@Component({
  selector: 'app-breadcrumb-demo',
  imports: [
    BreadcrumbComponent,
    PageContainerComponent,
    TranslatePipe,
    RouterLink,
    ClrRangeModule,
    DemoPlaygroundComponent,
  ],
  templateUrl: './breadcrumb-demo.component.html',
  styles: `
    .font-scope {
      --cll-breadcrumb-font-size: 0.9rem;
    }
    .controls {
      display: flex;
      flex-wrap: wrap;
      gap: 0.6rem;
      align-items: center;
    }
    clr-range-container {
      margin-top: 0;
    }
    .preview {
      padding: 0.3rem;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BreadcrumbDemoComponent {
  readonly translation = inject(TranslationService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly params = toSignal(this.route.queryParamMap, {initialValue: this.route.snapshot.queryParamMap});
  // A deterministic HTTP fixture stands in for the application's entity API; labels never build routes.
  readonly server = toSignal(
    inject(HttpClient)
      .get<{id: string; name: string}>('/breadcrumb-server.json')
      .pipe(catchError(() => of(null))),
  );
  readonly fontSize = signal<number | null>(null);
  readonly selected = signal<BreadcrumbItem | null>(null);
  readonly submissions = signal(0);
  readonly items = computed<readonly BreadcrumbItem[]>(() => {
    const result: BreadcrumbItem[] = [
      {id: 'database', label: this.translation.translate('breadcrumbPreview.database'), href: `${path}?level=0`},
      {id: 'servers', label: this.translation.translate('breadcrumbPreview.servers'), href: `${path}?level=1`},
    ];
    const server = this.server();
    if (server) result.push({id: server.id, label: server.name});
    const level = this.params().get('level');
    return result.slice(0, level === '0' ? 1 : level === '1' ? 2 : 3);
  });
  readonly actions = computed(() => this.items().map(({id, label}) => ({id, label})));
  readonly usageTs = `import {Component, signal} from '@angular/core';
import {BreadcrumbComponent, BreadcrumbItem} from 'clr-lift';

@Component({
  selector: 'app-server-path',
  imports: [BreadcrumbComponent],
  template: '<cll-breadcrumb [items]="items()" />',
})
export class ServerPathComponent {
  readonly items = signal<readonly BreadcrumbItem[]>([
    {id: 'database', label: 'Database', href: '/database'},
    {id: 'servers', label: 'Sql servers', href: '/database/servers'},
    {id: 'sql-1', label: 'Sql server 1'},
  ]);
}`;
  readonly usageHtml = '<cll-breadcrumb [items]="items()" />';
  readonly spaUsageTs = `import {Component, inject, signal} from '@angular/core';
import {Router, RouterLink} from '@angular/router';
import {BreadcrumbComponent, BreadcrumbItem} from 'clr-lift';

@Component({
  selector: 'app-routed-server-path',
  imports: [BreadcrumbComponent, RouterLink],
  templateUrl: './routed-server-path.component.html',
})
export class RoutedServerPathComponent {
  private readonly router = inject(Router);
  readonly fontSize = signal<number | null>(null);
  readonly items = signal<readonly BreadcrumbItem[]>([
    {id: 'database', label: 'Database', href: '/database'},
    {id: 'servers', label: 'Sql servers', href: '/database/servers'},
    {id: 'sql-1', label: 'Sql server 1'},
  ]);
  urlTree(href: string) { return this.router.parseUrl(href); }
}`;
  readonly spaUsageHtml = `<cll-breadcrumb
  [items]="items()"
  [linkTemplate]="spaLink"
  ariaLabel="Database"
  [style.--cll-breadcrumb-font-size]="fontSize() === null ? null : fontSize() + 'rem'"
/>
<ng-template #spaLink let-item>
  <a style="font-size: inherit; line-height: inherit" [routerLink]="urlTree(item.href)">{{ item.label }}</a>
</ng-template>`;
  readonly usageScss = `/* Inherited from an ancestor or set on one component instance. */
.font-scope {
  --cll-breadcrumb-font-size: 0.9rem;
}`;
  urlTree(href: string) {
    return this.router.parseUrl(href);
  }
  reset(): void {
    this.fontSize.set(null);
    this.selected.set(null);
    void this.router.navigateByUrl(path);
  }
  submit(event: Event): void {
    event.preventDefault();
    this.submissions.update((count) => count + 1);
  }
}
