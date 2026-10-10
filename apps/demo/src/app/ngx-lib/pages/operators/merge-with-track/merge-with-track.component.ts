import {JsonPipe} from '@angular/common';
import {ChangeDetectionStrategy, Component, DestroyRef, inject, signal} from '@angular/core';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {ClarityModule} from '@clr/angular';
import {PageContainerComponent} from 'clr-lift';
import {mergeWithTrack} from 'ngx-lift';
import {Subject} from 'rxjs';

import {CodeBlockComponent} from '../../../../shared/components/code-block/code-block.component';
import {highlight} from '../../../../shared/utils/highlight.util';

@Component({
  selector: 'app-merge-with-track',
  imports: [PageContainerComponent, ClarityModule, CodeBlockComponent, JsonPipe],
  templateUrl: './merge-with-track.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MergeWithTrackComponent {
  private destroyRef = inject(DestroyRef);

  sourceA$ = new Subject<string>();
  sourceB$ = new Subject<string>();

  trackedValues = signal<Record<number, string>>({});
  lastSourceIndex = signal<number | null>(null);

  constructor() {
    mergeWithTrack([this.sourceA$, this.sourceB$])
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(({values, lastEmittedIndex}) => {
        this.trackedValues.set(values);
        this.lastSourceIndex.set(lastEmittedIndex);
      });
  }

  emitA(): void {
    this.sourceA$.next(`Search Query: #ID-${Math.floor(Math.random() * 900 + 100)}`);
  }

  emitB(): void {
    this.sourceB$.next(`Filter Category: Category-${String.fromCharCode(65 + Math.floor(Math.random() * 6))}`);
  }

  exampleCode = highlight(`
import {mergeWithTrack} from 'ngx-lift';
import {Component, DestroyRef, inject, signal} from '@angular/core';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {Subject} from 'rxjs';

@Component({
  template: \`
    <button (click)="query$.next('search term')">Emit Query</button>
    <button (click)="filter$.next('active')">Emit Filter</button>

    <div>Last emitted by source: {{ lastIndex() }}</div>
    <pre>{{ values() | json }}</pre>
  \`
})
export class MergeWithTrackExampleComponent {
  query$ = new Subject<string>();
  filter$ = new Subject<string>();

  values = signal({});
  lastIndex = signal<number | null>(null);

  constructor() {
    mergeWithTrack([this.query$, this.filter$])
      .pipe(takeUntilDestroyed())
      .subscribe(({values, lastEmittedIndex}) => {
        this.values.set(values);
        this.lastIndex.set(lastEmittedIndex);
      });
  }
}
  `);

  signatureCode = highlight(`
function mergeWithTrack<T>(sources$: Observable<T>[]): Observable<{
  values: Record<number, T>;
  lastEmittedIndex: number | null;
}>
  `);
}
