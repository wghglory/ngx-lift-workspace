import {JsonPipe} from '@angular/common';
import {ChangeDetectionStrategy, Component, computed, inject, input, signal} from '@angular/core';
import {ClarityModule} from '@clr/angular';
import {TranslatePipe, TranslationService} from 'clr-lift';

/** A formatted entry in the live state inspector. */
export interface StateInspectorItem {
  label: string;
  value: unknown;
  status?: 'success' | 'danger' | 'warning' | 'info' | 'neutral';
}

/** Displays reactive demo state with optional raw JSON inspection. */
@Component({
  selector: 'app-state-inspector',
  imports: [ClarityModule, JsonPipe, TranslatePipe],
  templateUrl: './state-inspector.component.html',
  styleUrl: './state-inspector.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StateInspectorComponent {
  private translationService = inject(TranslationService);

  title = input<string>('inspector.liveState');
  description = input<string>('');
  data = input<Record<string, unknown> | null | undefined>(null);

  readonly isRawExpanded = signal<boolean>(false);

  readonly displayTitle = computed(() => {
    const raw = this.title();
    if (!raw) {
      return '';
    }
    const translated = this.translationService.translate(raw);
    return translated.startsWith('!! Key ') ? raw : translated;
  });

  readonly displayDescription = computed(() => {
    const raw = this.description();
    if (!raw) {
      return '';
    }
    const translated = this.translationService.translate(raw);
    return translated.startsWith('!! Key ') ? raw : translated;
  });

  readonly items = computed<StateInspectorItem[]>(() => {
    const raw = this.data();
    if (!raw || typeof raw !== 'object') {
      return [];
    }

    return Object.entries(raw).map(([key, val]) => {
      let status: StateInspectorItem['status'] = 'neutral';

      if (typeof val === 'boolean') {
        status = val ? 'success' : 'neutral';
      } else if (val === 'resolved' || val === 'valid' || val === 'VALID') {
        status = 'success';
      } else if (val === 'error' || val === 'invalid' || val === 'INVALID') {
        status = 'danger';
      } else if (val === 'loading' || val === 'reloading' || val === 'PENDING') {
        status = 'warning';
      } else if (val !== null && val !== undefined) {
        status = 'info';
      }

      return {
        label: key,
        value: val,
        status,
      };
    });
  });

  toggleRaw(): void {
    this.isRawExpanded.update((v) => !v);
  }

  formatValue(value: unknown): string {
    if (value === null) {
      return 'null';
    }
    if (value === undefined) {
      return 'undefined';
    }
    if (typeof value === 'object') {
      return JSON.stringify(value);
    }
    return String(value);
  }
}
