import {ChangeDetectionStrategy, Component, input} from '@angular/core';

@Component({
  selector: 'app-code-block',
  standalone: true,
  imports: [],
  templateUrl: './code-block.component.html',
  styleUrl: './code-block.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CodeBlockComponent {
  lang = input('typescript');
  code = input.required();
}
