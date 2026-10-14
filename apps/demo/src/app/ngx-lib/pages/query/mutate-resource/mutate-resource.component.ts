import {CommonModule} from '@angular/common';
import {ChangeDetectionStrategy, Component, signal, computed, inject} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {ClarityModule} from '@clr/angular';
import {PageContainerComponent, SpinnerComponent, TranslatePipe, TranslationService} from 'clr-lift';
import {mutateResource, queryResource} from 'ngx-lift';

import {ApiProperty, ApiTableComponent} from '../../../../shared/components/api-table';
import {DemoPlaygroundComponent} from '../../../../shared/components/demo-playground/demo-playground.component';
import {highlight} from '../../../../shared/utils/highlight.util';

interface TeamMember {
  id: number;
  name: string;
  role: string;
}

@Component({
  selector: 'app-mutate-resource-demo',
  imports: [
    CommonModule,
    FormsModule,
    ClarityModule,
    PageContainerComponent,
    SpinnerComponent,
    TranslatePipe,
    DemoPlaygroundComponent,
    ApiTableComponent,
  ],
  templateUrl: './mutate-resource.component.html',
  styleUrls: ['./mutate-resource.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MutateResourceDemoComponent {
  private readonly translationService = inject(TranslationService);

  // ---------------------------------------------------------------------------
  // Demo 1: Tag Invalidation with Active Queries
  // ---------------------------------------------------------------------------
  teamList = signal<TeamMember[]>([
    {id: 1, name: 'Alice Smith', role: 'Platform Engineer'},
    {id: 2, name: 'Bob Jones', role: 'Site Reliability Engineer'},
  ]);

  membersQuery = queryResource(() => ({
    key: ['team', 'members'],
    tags: [{type: 'team'}],
    staleTime: 60000,
    loader: async () => {
      await new Promise((resolve) => setTimeout(resolve, 350));
      return [...this.teamList()];
    },
  }));

  newMemberName = signal('');
  newMemberRole = signal('Platform Engineer');

  addMemberMutation = mutateResource(
    async (payload: {name: string; role: string}) => {
      await new Promise((resolve) => setTimeout(resolve, 600));
      const created: TeamMember = {
        id: Date.now(),
        name: payload.name,
        role: payload.role,
      };
      this.teamList.update((list) => [...list, created]);
      return created;
    },
    {
      invalidatesTags: [{type: 'team'}],
      concurrency: 'exhaust',
    },
  );

  submitNewMember() {
    const name = this.newMemberName().trim();
    if (!name) return;
    this.addMemberMutation.mutate({
      name,
      role: this.newMemberRole(),
    });
    this.newMemberName.set('');
  }

  // ---------------------------------------------------------------------------
  // Demo 2: Concurrency Modes (exhaust, concat, parallel)
  // ---------------------------------------------------------------------------
  selectedConcurrency = signal<'exhaust' | 'concat' | 'parallel'>('exhaust');
  clickCount = signal(0);
  executionCount = signal(0);
  inFlightCount = signal(0);
  concurrencyLogs = signal<string[]>([]);

  private readonly testMutationExhaust = mutateResource((seq: number) => this.runSimulatedMutation(seq), {
    concurrency: 'exhaust',
  });

  private readonly testMutationConcat = mutateResource((seq: number) => this.runSimulatedMutation(seq), {
    concurrency: 'concat',
  });

  private readonly testMutationParallel = mutateResource((seq: number) => this.runSimulatedMutation(seq), {
    concurrency: 'parallel',
  });

  private async runSimulatedMutation(seq: number): Promise<string> {
    this.executionCount.update((c) => c + 1);
    this.inFlightCount.update((c) => c + 1);
    const startMsg = `[${new Date().toLocaleTimeString()}] #${seq} Started`;
    this.concurrencyLogs.update((logs) => [startMsg, ...logs].slice(0, 20));

    await new Promise((resolve) => setTimeout(resolve, 800));

    this.inFlightCount.update((c) => Math.max(0, c - 1));
    const endMsg = `[${new Date().toLocaleTimeString()}] #${seq} Completed`;
    this.concurrencyLogs.update((logs) => [endMsg, ...logs].slice(0, 20));
    return `Result #${seq}`;
  }

  triggerConcurrencyTest() {
    this.clickCount.update((c) => c + 1);
    const currentSeq = this.clickCount();
    const mode = this.selectedConcurrency();

    if (mode === 'exhaust') {
      void this.testMutationExhaust.mutate(currentSeq);
    } else if (mode === 'concat') {
      void this.testMutationConcat.mutate(currentSeq);
    } else {
      void this.testMutationParallel.mutate(currentSeq);
    }
  }

  clearLogs() {
    this.concurrencyLogs.set([]);
    this.clickCount.set(0);
    this.executionCount.set(0);
    this.inFlightCount.set(0);
  }

  // ---------------------------------------------------------------------------
  // Demo 3: Error Recovery & Status Signals
  // ---------------------------------------------------------------------------
  simulateError = signal(false);
  saveSuccessMessage = signal(false);

  saveSettingsMutation = mutateResource(
    async (payload: {timeoutSeconds: number}) => {
      this.saveSuccessMessage.set(false);
      await new Promise((resolve) => setTimeout(resolve, 500));
      if (this.simulateError()) {
        throw new Error('HTTP 500: Failed to persist cluster settings to database.');
      }
      return {success: true, timeoutSeconds: payload.timeoutSeconds};
    },
    {concurrency: 'exhaust'},
  );

  async onSaveSettings() {
    try {
      await this.saveSettingsMutation.mutate({timeoutSeconds: 30});
      this.saveSuccessMessage.set(true);
    } catch {
      this.saveSuccessMessage.set(false);
    }
  }

  // ---------------------------------------------------------------------------
  // Code Snippets for DemoPlayground
  // ---------------------------------------------------------------------------
  readonly invalidationCode = highlight(`// 1. Define query observing 'team' tags
const teamQuery = queryResource(() => ({
  key: ['team', 'members'],
  tags: [{ type: 'team' }],
  loader: () => this.teamService.getAll(),
}));

// 2. Define mutation invalidating 'team' tags on write success
const addMember = mutateResource(
  (payload: NewMember) => this.teamService.create(payload),
  {
    invalidatesTags: [{ type: 'team' }],
    concurrency: 'exhaust', // prevents double-submit
  }
);

// 3. In click handler or form submit:
await addMember.mutate({ name: 'Alice', role: 'Engineer' });
// -> teamQuery automatically refetches in the background!`);

  readonly concurrencyCode = highlight(`// Concurrency strategies:
// 'exhaust': Ignores or coalesces rapid clicks while in-flight (double-submit guard)
const saveProfile = mutateResource(
  (data: UserDto) => this.userService.update(data),
  { concurrency: 'exhaust' }
);

// 'concat': Queues submissions strictly sequentially in FIFO order without losing arguments
const appendLog = mutateResource(
  (entry: LogEntry) => this.logService.append(entry),
  { concurrency: 'concat' }
);

// 'parallel': Executes every invocation independently concurrently (default)
const uploadFile = mutateResource(
  (file: File) => this.fileService.upload(file),
  { concurrency: 'parallel' }
);`);

  readonly errorCode = highlight(`const saveSettings = mutateResource(
  (settings: Settings) => this.settingsService.save(settings)
);

// In template:
// @if (saveSettings.isLoading()) { <cll-spinner /> }
// @if (saveSettings.error(); as err) { <clr-alert [clrAlertType]="'danger'">{{ err.message }}</clr-alert> }

// In handler:
try {
  const result = await saveSettings.mutate({ timeout: 30 });
  console.log('Saved successfully:', result);
} catch (error) {
  // Handled cleanly via Promise rejection and saveSettings.error() signal!
}`);

  // ---------------------------------------------------------------------------
  // API Reference Tables
  // ---------------------------------------------------------------------------
  readonly mutateResourceApiProps = computed<ApiProperty[]>(() => [
    {
      name: 'mutation',
      type: '(args: TArgs) => Observable<TResult> | Promise<TResult>',
      description: this.translationService.translate('demoApi.mutate-resource.mutateResourceApiProps.mutation'),
    },
    {
      name: 'options.invalidatesTags',
      type: 'QueryTag[] | ((result, args) => QueryTag[])',
      description: this.translationService.translate(
        'demoApi.mutate-resource.mutateResourceApiProps.options.invalidatesTags',
      ),
    },
    {
      name: 'options.concurrency',
      type: "'parallel' | 'exhaust' | 'concat'",
      description: this.translationService.translate(
        'demoApi.mutate-resource.mutateResourceApiProps.options.concurrency',
      ),
    },
    {
      name: 'options.injector',
      type: 'Injector',
      description: this.translationService.translate('demoApi.mutate-resource.mutateResourceApiProps.options.injector'),
    },
    {
      name: 'options.client',
      type: 'QueryClient',
      description: this.translationService.translate('demoApi.mutate-resource.mutateResourceApiProps.options.client'),
    },
  ]);

  readonly mutateResourceRefApiProps = computed<ApiProperty[]>(() => [
    {
      name: 'value',
      type: 'Signal<TResult | undefined>',
      description: this.translationService.translate('demoApi.mutate-resource.mutateResourceRefApiProps.value'),
    },
    {
      name: 'error',
      type: 'Signal<E | null>',
      description: this.translationService.translate('demoApi.mutate-resource.mutateResourceRefApiProps.error'),
    },
    {
      name: 'status',
      type: "Signal<'idle' | 'loading' | 'resolved' | 'error'>",
      description: this.translationService.translate('demoApi.mutate-resource.mutateResourceRefApiProps.status'),
    },
    {
      name: 'isLoading',
      type: 'Signal<boolean>',
      description: this.translationService.translate('demoApi.mutate-resource.mutateResourceRefApiProps.isLoading'),
    },
    {
      name: 'mutate(args)',
      type: '(args: TArgs) => Promise<TResult>',
      description: this.translationService.translate('demoApi.mutate-resource.mutateResourceRefApiProps.mutate(args)'),
    },
  ]);
}
