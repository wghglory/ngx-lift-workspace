import {JsonPipe} from '@angular/common';
import {ChangeDetectionStrategy, Component, computed, inject} from '@angular/core';
import {toSignal} from '@angular/core/rxjs-interop';
import {ActivatedRoute, Router, RouterLink} from '@angular/router';
import {
  BreadcrumbComponent,
  buildObjectPathBreadcrumbs,
  EncodedObjectPathLocation,
  TranslatePipe,
  ClrLiftI18nService,
} from 'clr-lift';
// eslint-disable-next-line @nx/enforce-module-boundaries -- Shared object-path consumer harness, not a library import.
import {
  createObjectPathOptions,
  ObjectPathDestination,
} from '../../../../../../../tools/package/fixtures/object-path-consumer-harness.js';

import {PRESERVE_CONTENT_SCROLL} from '../../../core/content-viewport-scroller';
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
  readonly navigationInfo = PRESERVE_CONTENT_SCROLL;
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly translationService = inject(ClrLiftI18nService);

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
    if (kind === 'buckets') {
      if (rootPrefix !== undefined) return {items: [], error: true};
      return {items: [this.collectionItem()], error: false};
    }
    if (kind !== 'prefix' && kind !== 'object') return {items: [], error: true};
    const destination: ObjectPathDestination = (location) => this.hrefFor(location);
    const result = buildObjectPathBreadcrumbs(
      createObjectPathOptions(destination, {
        bucket,
        key,
        kind,
        rootPrefix,
        emptySegmentLabel: this.translationService.translate('breadcrumbPreview.emptySegment'),
        // Angular Router encodes query params itself; keep the raw exact keys until createUrlTree.
        navigation: {destination, encode: (raw) => raw, collection: this.collectionItem()},
      }),
    );
    return result.ok ? {items: result.items, error: false} : {items: [], error: true};
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
import {BreadcrumbComponent, BreadcrumbItem, buildObjectPathBreadcrumbs, EncodedObjectPathLocation} from 'clr-lift';

@Component({
  selector: 'app-bucket-path',
  imports: [BreadcrumbComponent],
  templateUrl: './bucket-path.component.html',
})
export class BucketPathComponent {
  // Read these exact values from your route or selected API entry.
  readonly options = {
    bucket: 'bucket-1', key: 'folder-1/folder-nested-2/object-4', kind: 'object' as const,
    emptySegmentLabel: '(empty segment)', // Supply your translated label.
    navigation: {
      destination: (location: EncodedObjectPathLocation) => {
        switch (location.kind) {
          case 'bucket': return '/browse?bucket=' + location.bucket;
          case 'prefix': return '/browse?bucket=' + location.bucket + '&prefix=' + location.prefix;
          case 'object': return '/object?bucket=' + location.bucket + '&key=' + location.key;
        }
      },
    },
  };
  readonly result = buildObjectPathBreadcrumbs(this.options);
  readonly items: readonly BreadcrumbItem[] = this.result.ok ? this.result.items : [];
}`;
  readonly usageHtml = '<cll-breadcrumb [items]="items" />';

  private collectionItem(): {id: string; label: string; href: string} {
    return {
      id: 'bucket-collection',
      label: this.translationService.translate('breadcrumbPreview.buckets'),
      href: this.collectionHref(),
    };
  }
  collectionHref(): string {
    return this.router.serializeUrl(this.router.createUrlTree([path], {queryParams: {storeKind: 'buckets'}}));
  }
  hrefFor(location: EncodedObjectPathLocation): string {
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
    void this.router.navigateByUrl(path, {info: this.navigationInfo});
  }
}
