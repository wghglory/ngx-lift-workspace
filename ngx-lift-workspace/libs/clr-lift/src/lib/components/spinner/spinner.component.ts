import {CommonModule} from '@angular/common';
import {booleanAttribute, ChangeDetectionStrategy, Component, input} from '@angular/core';
import {ClarityModule} from '@clr/angular';

@Component({
  selector: 'cll-spinner',
  standalone: true,
  imports: [CommonModule, ClarityModule],
  templateUrl: './spinner.component.html',
  styleUrl: './spinner.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SpinnerComponent {
  size = input<'lg' | 'md' | 'sm'>('lg');
  center = input(true);
  inline = input(false, {transform: booleanAttribute});
  customClass = input('', {alias: 'class'});
}
