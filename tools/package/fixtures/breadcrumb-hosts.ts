// Compiled outside the workspace against installed tarballs with strict Angular templates.
import {Component, signal} from '@angular/core';
import {provideRouter, RouterLink} from '@angular/router';
// eslint-disable-next-line @nx/enforce-module-boundaries -- Isolated installed-package consumer.
import {
  BreadcrumbComponent,
  BreadcrumbItem,
  BreadcrumbLinkContext,
  buildObjectPathBreadcrumbs,
  BuildObjectPathBreadcrumbsOptions,
  ObjectPathLocation,
} from 'clr-lift';

const root = Object.freeze({id: 'root', label: 'Database'});
const initial: readonly BreadcrumbItem[] = Object.freeze([root, Object.freeze({id: 'server', label: 'Server'})]);
const context: BreadcrumbLinkContext = {$implicit: root};
void context;
// @ts-expect-error Stable identity is a string.
const invalid: BreadcrumbItem = {id: 42, label: 'Server'};
void invalid;
export const routerProviders = provideRouter([]);

@Component({
  selector: 'breadcrumb-consumer',
  imports: [BreadcrumbComponent, RouterLink],
  template: `
    <form (submit)="submissions = submissions + 1">
      <cll-breadcrumb [items]="items()" (navigate)="selected = $event" [style.--cll-breadcrumb-font-size]="'1rem'" />
      <cll-breadcrumb [items]="deepItems" [maxVisible]="3" ariaLabel="Deep" />
      <cll-breadcrumb [items]="links" [linkTemplate]="link" ariaLabel="SPA" />
    </form>
    <ng-template #link let-item
      ><a [routerLink]="item.href">{{ item.label }}</a></ng-template
    >
  `,
})
export class BreadcrumbConsumer {
  readonly items = signal(initial);
  readonly links: readonly BreadcrumbItem[] = [
    {id: 'database', label: 'Database', href: '/database'},
    {id: 'server', label: 'Server'},
  ];
  readonly deepItems: readonly BreadcrumbItem[] = Array.from({length: 100}, (_, i) => ({
    id: `deep-${i}`,
    label: 'Repeated',
    context: `exact/${i}`,
    href: `/browse?key=${i}%2F%25`,
  }));
  readonly locations: ObjectPathLocation[] = [];
  readonly objectOptions: BuildObjectPathBreadcrumbsOptions = {
    bucket: 'bucket-1',
    key: '/%2F/雪/../marker/',
    kind: 'object',
    rootPrefix: '/',
    emptySegmentLabel: '(empty)',
    hrefFor: (location) => {
      this.locations.push(location);
      if (location.kind === 'bucket') return '/browse?bucket=' + encodeURIComponent(location.bucket);
      if (location.kind === 'prefix') return '/browse?prefix=' + encodeURIComponent(location.prefix);
      return '/object?key=' + encodeURIComponent(location.key);
    },
  };
  readonly generated = buildObjectPathBreadcrumbs(this.objectOptions);
  selected?: BreadcrumbItem;
  submissions = 0;
}

// Public discriminants must reject mixed resource payloads in strict installed consumers.
const prefixLocation: ObjectPathLocation = {kind: 'prefix', bucket: 'b', prefix: 'a/'};
// @ts-expect-error Object keys are not prefix fields.
const wrongLocation: ObjectPathLocation = {kind: 'object', bucket: 'b', prefix: 'a/'};
// @ts-expect-error Resource kind must be explicit.
const wrongOptions: BuildObjectPathBreadcrumbsOptions = {
  bucket: 'b',
  key: '',
  emptySegmentLabel: '(empty)',
  hrefFor: () => '/',
};
void prefixLocation;
void wrongLocation;
void wrongOptions;
