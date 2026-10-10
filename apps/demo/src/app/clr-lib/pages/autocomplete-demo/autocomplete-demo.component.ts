import {ChangeDetectionStrategy, Component, signal} from '@angular/core';
import {FormControl, ReactiveFormsModule} from '@angular/forms';
import {AutocompleteComponent, PageContainerComponent} from 'clr-lift';

import {CodeBlockComponent} from '../../../shared/components/code-block/code-block.component';
import {highlight} from '../../../shared/utils/highlight.util';

@Component({
  selector: 'app-autocomplete-demo',
  imports: [AutocompleteComponent, CodeBlockComponent, PageContainerComponent, ReactiveFormsModule],
  templateUrl: './autocomplete-demo.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AutocompleteDemoComponent {
  languages = [
    'TypeScript',
    'JavaScript',
    'Go',
    'Python',
    'Java',
    'Rust',
    'C++',
    'C#',
    'Kotlin',
    'Swift',
    'Ruby',
    'PHP',
  ];

  k8sNamespaces = ['default', 'kube-system', 'kube-public', 'kube-node-lease', 'cert-manager', 'ingress-nginx'];

  // Form controls for demos
  languageControl = new FormControl('TypeScript');
  namespaceControl = new FormControl('');

  selectedStandaloneValue = signal<string>('');

  onSelectedLanguage(value: string): void {
    this.selectedStandaloneValue.set(value);
  }

  reactiveFormCode = highlight(`
import {Component} from '@angular/core';
import {FormControl, ReactiveFormsModule} from '@angular/forms';
import {AutocompleteComponent} from 'clr-lift';

@Component({
  imports: [AutocompleteComponent, ReactiveFormsModule],
  template: \`
    <cll-autocomplete
      [options]="languages"
      [formControl]="languageControl"
      placeholder="Select or search a language..."
    />

    <p>Selected Value: {{ languageControl.value }}</p>
  \`
})
export class AutocompleteFormExampleComponent {
  languages = ['TypeScript', 'JavaScript', 'Go', 'Rust', 'Python'];
  languageControl = new FormControl('TypeScript');
}
  `);

  eventsCode = highlight(`
<cll-autocomplete
  [options]="k8sNamespaces"
  placeholder="Type namespace name..."
  emptyPlaceholder="No matching namespace found"
  (selected)="onSelectedNamespace($event)"
/>
  `);
}
