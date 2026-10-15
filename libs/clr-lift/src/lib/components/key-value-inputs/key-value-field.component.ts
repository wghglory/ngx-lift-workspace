import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  computed,
  inject,
  input,
  OnChanges,
  OnDestroy,
} from '@angular/core';
import {FormControl, ReactiveFormsModule} from '@angular/forms';
import {ClarityModule} from '@clr/angular';
import {Subscription} from 'rxjs';

import {TranslatePipe} from '../../pipes/translate.pipe';
import {KeyValueFieldConfig} from './key-value-field-config';

/** Internal renderer; the parent editor owns the FormArray and validation lifecycle. */
@Component({
  selector: 'cll-key-value-field',
  imports: [ClarityModule, ReactiveFormsModule, TranslatePipe],
  templateUrl: './key-value-field.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class KeyValueFieldComponent implements OnChanges, OnDestroy {
  readonly control = input.required<FormControl<string>>();
  readonly config = input.required<KeyValueFieldConfig>();
  readonly controlId = input.required<string>();
  readonly label = input.required<string>();
  readonly helper = input('');
  readonly inputSize = input(40);
  readonly patternMessage = input('');
  readonly customValidations = computed(() =>
    (this.config().validators ?? []).filter(
      ({errorKey}) => !['required', 'pattern', 'notUnique', 'duplicatePair', 'selection'].includes(errorKey),
    ),
  );

  private readonly cdr = inject(ChangeDetectorRef);
  private boundControl?: FormControl<string>;
  private events?: Subscription;

  validationMessage(errorKey: string, fallback: string): string {
    return this.config().validators?.find((validation) => validation.errorKey === errorKey)?.message ?? fallback;
  }

  isUnknownSelection(): boolean {
    const field = this.config();
    return (
      field.mode === 'select' &&
      !!this.control().value &&
      !field.options.some((option) => option.value === this.control().value)
    );
  }

  ngOnChanges(): void {
    if (this.boundControl !== this.control()) {
      this.events?.unsubscribe();
      this.boundControl = this.control();
      this.events = this.control().events.subscribe(() => this.cdr.markForCheck());
    }
    this.cdr.markForCheck();
  }

  ngOnDestroy(): void {
    this.events?.unsubscribe();
  }
}
