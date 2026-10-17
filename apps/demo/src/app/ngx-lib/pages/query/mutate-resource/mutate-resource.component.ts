import {RouterLink} from '@angular/router';
import {MutationStarterComponent} from '../mutation-starter/mutation-starter.component';
import {MUTATION_STARTER_SOURCE, MUTATION_STARTER_TEMPLATE} from '../mutation-starter/mutation-starter.example';
import {CommonModule} from '@angular/common';
import {ChangeDetectionStrategy, Component, signal, computed, inject} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {ClarityModule} from '@clr/angular';
import {PageContainerComponent, SpinnerComponent, TranslatePipe, TranslationService} from 'clr-lift';
import {mutateResource, queryResource} from 'ngx-lift';

import {ApiProperty, ApiTableComponent} from '../../../../shared/components/api-table';
import {DemoPlaygroundComponent} from '../../../../shared/components/demo-playground/demo-playground.component';
import {highlight} from '../../../../shared/utils/highlight.util';
import {CreateTeamMemberArgs, TeamService} from './team.service';
import {teamMembersQuery, teamTags} from './team.queries';
import {TeamSummaryComponent} from './team-summary.component';

@Component({
  selector: 'app-mutate-resource-demo',
  imports: [
    CommonModule,
    RouterLink,
    MutationStarterComponent,
    FormsModule,
    ClarityModule,
    PageContainerComponent,
    SpinnerComponent,
    TranslatePipe,
    DemoPlaygroundComponent,
    ApiTableComponent,
    TeamSummaryComponent,
  ],
  providers: [TeamService],
  templateUrl: './mutate-resource.component.html',
  styleUrls: ['./mutate-resource.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MutateResourceDemoComponent {
  private readonly translationService = inject(TranslationService);
  readonly starterCode = highlight(MUTATION_STARTER_SOURCE);
  readonly starterHtmlCode = highlight(MUTATION_STARTER_TEMPLATE, 'html');

  // ---------------------------------------------------------------------------
  // Demo 1: Tag Invalidation with Active Queries
  // ---------------------------------------------------------------------------
  readonly teamService = inject(TeamService);

  readonly showSummary = signal(true);
  readonly membersQuery = queryResource(() => teamMembersQuery(this.teamService, 'team-a'));
  readonly otherTeamQuery = queryResource(() => teamMembersQuery(this.teamService, 'team-b'));

  newMemberName = signal('');
  newMemberRole = signal('Platform Engineer');

  addMemberMutation = mutateResource((args: CreateTeamMemberArgs) => this.teamService.createMember(args), {
    invalidateTags: (created, args) => [teamTags.members(args.scope), teamTags.member(args.scope, created.id)],
    concurrency: 'exhaust',
  });

  submitNewMember() {
    const name = this.newMemberName().trim();
    if (!name) return;
    this.addMemberMutation.mutate({
      scope: 'team-a',
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

  private readonly exhaustMutation = mutateResource((seq: number) => this.runSimulatedMutation(seq), {
    concurrency: 'exhaust',
  });

  private readonly concatMutation = mutateResource((seq: number) => this.runSimulatedMutation(seq), {
    concurrency: 'concat',
  });

  private readonly parallelMutation = mutateResource((seq: number) => this.runSimulatedMutation(seq), {
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
      void this.exhaustMutation.mutate(currentSeq);
    } else if (mode === 'concat') {
      void this.concatMutation.mutate(currentSeq);
    } else {
      void this.parallelMutation.mutate(currentSeq);
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
  readonly invalidationCode = highlight(`import {inject, signal} from '@angular/core';
import {mutateResource, queryResource} from 'ngx-lift';
import {CreateTeamMemberArgs, TeamService} from './team.service';
import {teamMembersQuery, teamTags} from './team.queries';

// The page provides TeamService so mock state resets on navigation.
readonly teamService = inject(TeamService);

readonly showSummary = signal(true);

readonly membersQuery = queryResource(() => teamMembersQuery(this.teamService, 'team-a'));

readonly otherTeamQuery = queryResource(() => teamMembersQuery(this.teamService, 'team-b'));

newMemberName = signal('');

newMemberRole = signal('Platform Engineer');

addMemberMutation = mutateResource((args: CreateTeamMemberArgs) => this.teamService.createMember(args), {
  invalidateTags: (created, args) => [teamTags.members(args.scope), teamTags.member(args.scope, created.id)],
  concurrency: 'exhaust',
});

submitNewMember() {
  const name = this.newMemberName().trim();
  if (!name) return;
  this.addMemberMutation.mutate({
    scope: 'team-a',
    name,
    role: this.newMemberRole(),
  });
  this.newMemberName.set('');
}`);

  readonly concurrencyCode = highlight(`import {signal} from '@angular/core';
import {mutateResource} from 'ngx-lift';

// Component fields and handlers used by the live preview.
selectedConcurrency = signal<'exhaust' | 'concat' | 'parallel'>('exhaust');

clickCount = signal(0);

executionCount = signal(0);

inFlightCount = signal(0);

concurrencyLogs = signal<string[]>([]);

private readonly exhaustMutation = mutateResource((seq: number) => this.runSimulatedMutation(seq), {
  concurrency: 'exhaust',
});

private readonly concatMutation = mutateResource((seq: number) => this.runSimulatedMutation(seq), {
  concurrency: 'concat',
});

private readonly parallelMutation = mutateResource((seq: number) => this.runSimulatedMutation(seq), {
  concurrency: 'parallel',
});

private async runSimulatedMutation(seq: number): Promise<string> {
  this.executionCount.update((c) => c + 1);
  this.inFlightCount.update((c) => c + 1);
  const startMsg = \`[\${new Date().toLocaleTimeString()}] #\${seq} Started\`;
  this.concurrencyLogs.update((logs) => [startMsg, ...logs].slice(0, 20));

  await new Promise((resolve) => setTimeout(resolve, 800));

  this.inFlightCount.update((c) => Math.max(0, c - 1));
  const endMsg = \`[\${new Date().toLocaleTimeString()}] #\${seq} Completed\`;
  this.concurrencyLogs.update((logs) => [endMsg, ...logs].slice(0, 20));
  return \`Result #\${seq}\`;
}

triggerConcurrencyTest() {
  this.clickCount.update((c) => c + 1);
  const currentSeq = this.clickCount();
  const mode = this.selectedConcurrency();

  if (mode === 'exhaust') {
    void this.exhaustMutation.mutate(currentSeq);
  } else if (mode === 'concat') {
    void this.concatMutation.mutate(currentSeq);
  } else {
    void this.parallelMutation.mutate(currentSeq);
  }
}

clearLogs() {
  this.concurrencyLogs.set([]);
  this.clickCount.set(0);
  this.executionCount.set(0);
  this.inFlightCount.set(0);
}`);

  readonly errorCode = highlight(`import {signal} from '@angular/core';
import {mutateResource} from 'ngx-lift';

// Component fields and handlers used by the live preview.
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
      name: 'options.invalidateTags',
      type: 'QueryTag[] | ((result, args) => QueryTag[])',
      description: this.translationService.translate(
        'demoApi.mutate-resource.mutateResourceApiProps.options.invalidateTags',
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
