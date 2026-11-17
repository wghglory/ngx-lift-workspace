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
import {
  createObjectPathOptions,
  encodedObjectPathDestination,
  expectedObjectPathLocations,
} from './object-path-consumer-harness.js';

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
  readonly objectOptions: BuildObjectPathBreadcrumbsOptions = createObjectPathOptions((location) => {
    // The raw location is reconstructed for the render proof; the helper owns encoding.
    const raw: ObjectPathLocation =
      location.kind === 'bucket'
        ? {kind: 'bucket', bucket: 'bucket-1'}
        : location.kind === 'prefix'
          ? {kind: 'prefix', bucket: 'bucket-1', prefix: decodeURIComponent(location.prefix)}
          : {kind: 'object', bucket: 'bucket-1', key: decodeURIComponent(location.key)};
    this.locations.push(raw);
    return encodedObjectPathDestination(location);
  });
  readonly result = buildObjectPathBreadcrumbs(this.objectOptions);
  readonly generated = this.result.ok ? this.result.items : [];
  readonly expectedLocations = expectedObjectPathLocations;
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
