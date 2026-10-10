import {ChangeDetectionStrategy, Component, computed, signal} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {ClarityModule} from '@clr/angular';
import {PageContainerComponent} from 'clr-lift';
import {quantityToScalar} from 'ngx-lift';

import {CodeBlockComponent} from '../../../../shared/components/code-block/code-block.component';
import {highlight} from '../../../../shared/utils/highlight.util';

@Component({
  selector: 'app-k8s-quantity',
  imports: [PageContainerComponent, CodeBlockComponent, ClarityModule, FormsModule],
  templateUrl: './k8s-quantity.component.html',
  styleUrl: './k8s-quantity.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class K8sQuantityComponent {
  quantityInput1 = signal('20Gi');
  quantityInput2 = signal('21402Mi');

  scalar1 = computed(() => quantityToScalar(this.quantityInput1()));
  scalar2 = computed(() => quantityToScalar(this.quantityInput2()));

  comparison = computed(() => {
    const s1 = this.scalar1();
    const s2 = this.scalar2();

    if (s1 > s2) return `${this.quantityInput1()} is GREATER than ${this.quantityInput2()}`;
    if (s1 < s2) return `${this.quantityInput1()} is LESS than ${this.quantityInput2()}`;
    return `${this.quantityInput1()} is EQUAL to ${this.quantityInput2()}`;
  });

  codeSnippet = highlight(`
import {quantityToScalar} from 'ngx-lift';

const q1 = quantityToScalar('20Gi');    // 21474836480n (bytes)
const q2 = quantityToScalar('21402Mi'); // 22441132032n (bytes)

// Accurate comparisons with different units:
if (q2 > q1) {
  console.log('21402Mi is larger than 20Gi');
}
  `);
}
