// Compiled outside the workspace against installed tarballs with strict Angular templates.
import {Component, signal} from '@angular/core';
import {provideRouter, RouterLink} from '@angular/router';
// eslint-disable-next-line @nx/enforce-module-boundaries -- Isolated installed-package consumer.
import {BreadcrumbComponent, BreadcrumbItem, BreadcrumbLinkContext} from 'clr-lift';

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
  readonly deepItems: readonly BreadcrumbItem[] = Array.from({length: 30}, (_, i) => ({
    id: `deep-${i}`,
    label: 'Repeated',
    context: `exact/${i}`,
    href: `/browse?key=${i}%2F%25`,
  }));
  selected?: BreadcrumbItem;
  submissions = 0;
}
