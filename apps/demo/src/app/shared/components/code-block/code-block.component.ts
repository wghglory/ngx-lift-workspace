import {ChangeDetectionStrategy, Component, computed, input, resource} from '@angular/core';

import {highlight, highlightAsync, sourceText} from '../../utils/highlight.util';

@Component({
  selector: 'app-code-block',
  templateUrl: './code-block.component.html',
  styleUrl: './code-block.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CodeBlockComponent {
  lang = input('typescript');
  code = input.required<string>();
  private readonly highlighted = resource({
    params: () => ({code: this.code(), language: this.lang()}),
    loader: async ({params}) => ({...params, html: await highlightAsync(params.code, params.language)}),
  });
  readonly renderedCode = computed(() => {
    const current = this.highlighted.hasValue() ? this.highlighted.value() : undefined;
    return current?.code === this.code() && current.language === this.lang()
      ? current.html
      : highlight(sourceText(this.code()));
  });
}
