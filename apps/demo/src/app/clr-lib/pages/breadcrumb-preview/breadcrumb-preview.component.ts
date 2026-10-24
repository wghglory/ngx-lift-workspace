import {JsonPipe} from '@angular/common';
import {ChangeDetectionStrategy, Component, computed, inject, signal} from '@angular/core';
import {toSignal} from '@angular/core/rxjs-interop';
import {FormsModule} from '@angular/forms';
import {ActivatedRoute, Router, RouterLink} from '@angular/router';
import {ClrRangeModule, ClrSelectModule} from '@clr/angular';
import {PageContainerComponent, TranslatePipe, TranslationService} from 'clr-lift';

import {BreadcrumbPreviewTrailComponent} from './breadcrumb-preview-trail.component';
import {buildObjectPathBreadcrumbs, ObjectPathBreadcrumbItem, ObjectPathLocation} from './breadcrumb-preview.contract';

const previewPath = '/clr-lift/components/breadcrumb-preview';

@Component({
  selector: 'app-breadcrumb-preview',
  imports: [
    BreadcrumbPreviewTrailComponent,
    ClrRangeModule,
    ClrSelectModule,
    FormsModule,
    JsonPipe,
    PageContainerComponent,
    RouterLink,
    TranslatePipe,
  ],
  templateUrl: './breadcrumb-preview.component.html',
  styles: `
    .preview-box {
      border: 1px solid var(--clr-card-border-color);
      padding: 0.6rem;
      overflow: hidden;
    }
    .controls {
      display: flex;
      flex-wrap: wrap;
      gap: 0.6rem;
      align-items: center;
    }
    .controls clr-range-container {
      margin-top: 0;
    }
    clr-select-container {
      max-inline-size: 100%;
    }
    pre {
      max-block-size: 16rem;
      overflow: auto;
      white-space: pre-wrap;
      overflow-wrap: anywhere;
    }
    input,
    select {
      max-inline-size: 100%;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BreadcrumbPreviewComponent {
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  readonly translation = inject(TranslationService);
  private readonly params = toSignal(this.route.queryParamMap, {initialValue: this.route.snapshot.queryParamMap});
  readonly fontSize = signal<number | null>(null);
  readonly actionItem = signal<ObjectPathBreadcrumbItem | null>(null);
  readonly submissions = signal(0);
  readonly fixture = computed(() => {
    const value = Number(this.params().get('fixture') ?? 0);
    return Number.isInteger(value) && value >= 0 && value < this.fixtures.length ? value : 0;
  });
  readonly fixtures = [
    {key: 'folder-1/folder-nested-2/object-4', kind: 'object'},
    {key: '', kind: 'prefix'},
    {key: '/a//%2F/雪/../object', kind: 'object'},
    {key: 'allowed/a/nested/object/', kind: 'object', rootPrefix: 'allowed/'},
    {key: 'same/same/', kind: 'prefix'},
  ] as const;
  readonly database = computed<readonly ObjectPathBreadcrumbItem[]>(() => {
    const all = [
      {id: 'database', label: this.translation.translate('breadcrumbPreview.database'), href: `${previewPath}?level=0`},
      {id: 'servers', label: this.translation.translate('breadcrumbPreview.servers'), href: `${previewPath}?level=1`},
      {id: 'sql-1', label: 'Sql server 1'},
    ];
    const level = this.params().get('level');
    return all.slice(0, level === '0' ? 1 : level === '1' ? 2 : 3);
  });
  readonly storage = computed(() => {
    const fixture = this.fixtures[this.fixture()];
    const params = this.params();
    const prefix = params.get('prefix');
    const objectKey = params.get('key');
    const destinationKind = params.get('kind');
    let kind: 'prefix' | 'object' = fixture.kind;
    let key: string = fixture.key;
    switch (destinationKind) {
      case 'bucket':
      case 'buckets':
        kind = 'prefix';
        key = '';
        break;
      case 'prefix':
        if (prefix === null) throw new Error('Prefix destination requires a prefix parameter');
        kind = 'prefix';
        key = prefix;
        break;
      case 'object':
        if (objectKey === null) throw new Error('Object destination requires a key parameter');
        kind = 'object';
        key = objectKey;
        break;
      case null:
        // A fixture supplies defaults only when the URL does not specify a destination.
        if (prefix !== null) {
          kind = 'prefix';
          key = prefix;
        } else if (objectKey !== null) {
          kind = 'object';
          key = objectKey;
        }
        break;
      default:
        throw new Error('Unsupported destination kind');
    }
    return buildObjectPathBreadcrumbs({
      bucket: params.get('bucket') ?? 'bucket-1',
      key,
      kind,
      rootPrefix: 'rootPrefix' in fixture ? fixture.rootPrefix : undefined,
      emptySegmentLabel: this.translation.translate('breadcrumbPreview.emptySegment'),
      hrefFor: (location) => this.hrefFor(location),
    });
  });
  readonly storageWithRoot = computed<readonly ObjectPathBreadcrumbItem[]>(() => {
    // Restricted-root fixtures must not reintroduce a higher application root.
    if ('rootPrefix' in this.fixtures[this.fixture()]) return this.storage();
    const root = {
      id: 'buckets',
      label: this.translation.translate('breadcrumbPreview.buckets'),
      href: `${previewPath}?kind=buckets`,
    };
    return this.params().get('kind') === 'buckets' ? [root] : [root, ...this.storage()];
  });
  readonly actions = computed(() => this.storageWithRoot().map(({id, label, context}) => ({id, label, context})));
  readonly state = computed(() => ({
    route: this.params().keys.reduce<Record<string, string | null>>(
      (value, key) => ({...value, [key]: this.params().get(key)}),
      {},
    ),
    helper: this.storage(),
    action: this.actionItem(),
    formSubmissions: this.submissions(),
  }));

  urlTree(href: string) {
    return this.router.parseUrl(href);
  }

  hrefFor(location: ObjectPathLocation): string {
    const params = new URLSearchParams({bucket: location.bucket, kind: location.kind, fixture: String(this.fixture())});
    if (location.kind === 'prefix') params.set('prefix', location.prefix);
    if (location.kind === 'object') params.set('key', location.key);
    return `${previewPath}?${params}`;
  }

  reset(): void {
    this.actionItem.set(null);
    this.fontSize.set(null);
    void this.router.navigateByUrl(previewPath);
  }

  changeFixture(value: string): void {
    void this.router.navigateByUrl(`${previewPath}?fixture=${value}`);
  }

  submit(event: Event): void {
    event.preventDefault();
    this.submissions.update((count) => count + 1);
  }
}
