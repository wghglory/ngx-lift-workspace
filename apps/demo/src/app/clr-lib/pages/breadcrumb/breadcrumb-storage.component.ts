import {JsonPipe} from '@angular/common';
import {ChangeDetectionStrategy, Component, computed, inject} from '@angular/core';
import {toSignal} from '@angular/core/rxjs-interop';
import {ActivatedRoute, Router, RouterLink} from '@angular/router';
import {
  BreadcrumbComponent,
  BreadcrumbItem,
  buildObjectPathBreadcrumbs,
  ObjectPathLocation,
  TranslatePipe,
  TranslationService,
} from 'clr-lift';

import {DemoPlaygroundComponent} from '../../../shared/components/demo-playground/demo-playground.component';

const path = '/clr-lift/components/breadcrumb';
// Controlled backend fixtures shaped like ListBuckets/ListObjectsV2; no storage SDK or account.
const buckets = {Buckets: [{Name: 'bucket-1'}, {Name: 'empty-bucket'}]};
const objects = [
  {Key: 'folder-1/readme.txt', Size: 120},
  {Key: 'folder-1/folder-nested-2/object-4', Size: 640},
  {Key: 'same/same/object', Size: 5},
  {Key: '/a//%2F/雪/../object', Size: 42},
  {Key: 'marker/', Size: 0},
];

@Component({
  selector: 'app-breadcrumb-storage',
  imports: [BreadcrumbComponent, TranslatePipe, RouterLink, JsonPipe, DemoPlaygroundComponent],
  templateUrl: './breadcrumb-storage.component.html',
  styles: `
    :host {
      display: block;
      min-inline-size: 0;
    }
    pre {
      white-space: pre-wrap;
      overflow-wrap: anywhere;
    }
    .storage-links {
      display: flex;
      flex-wrap: wrap;
      gap: 0.6rem;
    }
    a {
      display: inline-flex;
      align-items: center;
      min-block-size: 24px;
      overflow-wrap: anywhere;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BreadcrumbStorageComponent {
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly translationService = inject(TranslationService);

  private readonly params = toSignal(this.route.queryParamMap, {initialValue: this.route.snapshot.queryParamMap});
  readonly buckets = buckets;
  readonly examples = [
    {kind: 'object', key: 'folder-1/folder-nested-2/object-4'},
    {kind: 'prefix', key: 'same/same/'},
    {kind: 'object', key: '/a//%2F/雪/../object'},
    {kind: 'object', key: 'marker/'},
    {kind: 'object', key: 'folder-1/folder-nested-2/object-4', rootPrefix: 'folder-1/'},
  ] as const;
  readonly state = computed(() => {
    const params = this.params();
    const kind = params.get('storeKind') ?? 'prefix';
    const key = params.get('storeKey') ?? '';
    const bucket = params.get('bucket') ?? 'bucket-1';
    const rootPrefix = params.get('rootPrefix') ?? undefined;
    return {kind, key, bucket, rootPrefix};
  });
  readonly trail = computed(() => {
    const {kind, key, bucket, rootPrefix} = this.state();
    try {
      if (kind === 'buckets') {
        if (rootPrefix !== undefined) throw new Error('Restricted root cannot expose the bucket collection');
        return {items: [this.collectionItem()], error: false};
      }
      if (kind !== 'prefix' && kind !== 'object') throw new Error('Unknown resource kind');
      const items = buildObjectPathBreadcrumbs({
        bucket,
        key,
        kind,
        rootPrefix,
        emptySegmentLabel: this.translationService.translate('breadcrumbPreview.emptySegment'),
        hrefFor: (location) => this.hrefFor(location),
      });
      return {items: rootPrefix === undefined ? [this.collectionItem(), ...items] : items, error: false};
    } catch {
      return {items: [], error: true};
    }
  });
  readonly listing = computed(() => {
    const {bucket, key, kind} = this.state();
    if (this.trail().error || kind !== 'prefix') return null;
    const contents = bucket === 'bucket-1' ? objects.filter((object) => object.Key.startsWith(key)) : [];
    const prefixes = new Set<string>();
    const Contents = contents.filter((object) => {
      const delimiter = object.Key.indexOf('/', key.length);
      if (delimiter === -1) return true;
      prefixes.add(object.Key.slice(0, delimiter + 1));
      return false;
    });
    return {Prefix: key, CommonPrefixes: [...prefixes].map((Prefix) => ({Prefix})), Contents};
  });
  readonly object = computed(() => {
    const {kind, key, bucket} = this.state();
    return kind === 'object' && bucket === 'bucket-1' ? objects.find((object) => object.Key === key) : undefined;
  });
  readonly usageTs = `import {Component} from '@angular/core';
import {BreadcrumbComponent, BreadcrumbItem, buildObjectPathBreadcrumbs, ObjectPathLocation} from 'clr-lift';

@Component({
  selector: 'app-bucket-path',
  imports: [BreadcrumbComponent],
  templateUrl: './bucket-path.component.html',
})
export class BucketPathComponent {
  // Read these exact values from your route or selected API entry.
  readonly items: readonly BreadcrumbItem[] = buildObjectPathBreadcrumbs({
    bucket: 'bucket-1', key: 'folder-1/folder-nested-2/object-4', kind: 'object',
    emptySegmentLabel: '(empty segment)', // Supply your translated label.
    hrefFor: (location: ObjectPathLocation) => {
      const bucket = encodeURIComponent(location.bucket);
      switch (location.kind) {
        case 'bucket': return '/browse?bucket=' + bucket;
        case 'prefix': return '/browse?bucket=' + bucket + '&prefix=' + encodeURIComponent(location.prefix);
        case 'object': return '/object?bucket=' + bucket + '&key=' + encodeURIComponent(location.key);
      }
    },
  });
}`;
  readonly usageHtml = '<cll-breadcrumb [items]="items" />';

  private collectionItem(): BreadcrumbItem {
    return {
      id: 'bucket-collection',
      label: this.translationService.translate('breadcrumbPreview.buckets'),
      href: this.collectionHref(),
    };
  }
  collectionHref(): string {
    return this.router.serializeUrl(this.router.createUrlTree([path], {queryParams: {storeKind: 'buckets'}}));
  }
  hrefFor(location: ObjectPathLocation): string {
    const {rootPrefix} = this.state();
    return this.router.serializeUrl(
      this.router.createUrlTree([path], {
        queryParams: {
          bucket: location.bucket,
          storeKind: location.kind === 'object' ? 'object' : 'prefix',
          storeKey: location.kind === 'prefix' ? location.prefix : location.kind === 'object' ? location.key : '',
          rootPrefix,
        },
      }),
    );
  }
  exampleHref(example: {kind: string; key: string; rootPrefix?: string}): string {
    return this.router.serializeUrl(
      this.router.createUrlTree([path], {
        queryParams: {
          bucket: 'bucket-1',
          storeKind: example.kind,
          storeKey: example.key,
          rootPrefix: example.rootPrefix,
        },
      }),
    );
  }
  urlTree(href: string) {
    return this.router.parseUrl(href);
  }
  reset(): void {
    void this.router.navigateByUrl(path);
  }
}
