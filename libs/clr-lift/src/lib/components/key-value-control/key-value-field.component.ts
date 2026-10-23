import {
  afterEveryRender,
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  ElementRef,
  inject,
  input,
  output,
  viewChild,
} from '@angular/core';
import {FormsModule, ValidationErrors} from '@angular/forms';
import {ClarityModule, ClrCombobox} from '@clr/angular';

import {TranslatePipe} from '../../pipes/translate.pipe';
import {KeyValueFieldConfig, KeyValueOption, KeyValueValue} from './key-value-entry.type';

/** Internal renderer shared by the key and value columns. The parent owns form callbacks. */
@Component({
  selector: 'cll-key-value-field',
  imports: [FormsModule, ClarityModule, TranslatePipe],
  templateUrl: './key-value-field.component.html',
  styleUrl: './key-value-field.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {'(focusout)': 'leave($event)'},
})
export class KeyValueFieldComponent {
  readonly controlId = input.required<string>();
  readonly groupHelpId = input('');
  readonly label = input.required<string>();
  readonly defaultPlaceholder = input('');
  readonly value = input<KeyValueValue>('');
  readonly config = input<KeyValueFieldConfig>({});
  readonly disabled = input(false);
  readonly readonly = input(false);
  readonly showErrors = input(false);
  readonly blurred = output<void>();
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
  private readonly destroyRef = inject(DestroyRef);
  readonly errors = input<ValidationErrors>();
  readonly changed = output<KeyValueValue>();
  protected readonly visibleErrors = computed(() => (this.showErrors() ? this.errors() : undefined));
  protected readonly placeholder = computed(() => this.config().placeholder ?? this.defaultPlaceholder());
  protected readonly blocked = computed(() => this.disabled() || !!this.config().disabled);
  protected readonly text = computed(() =>
    Array.isArray(this.value()) ? (this.value() as string[]).join('\n') : String(this.value() ?? ''),
  );
  protected readonly selected = computed(
    () =>
      this.config().options?.find((option) => option.value === this.value()) ??
      (this.value() ? {value: String(this.value()), label: String(this.value())} : undefined),
  );
  protected readonly unknownSelection = computed(
    () =>
      this.value() !== '' &&
      this.value() !== null &&
      !this.config().options?.some((option) => option.value === this.value()),
  );
  protected readonly overrideMessage = computed(() => {
    const first = Object.keys(this.visibleErrors() ?? {})[0];
    return (
      this.config().messages?.[first] ?? this.config().validators?.find((rule) => rule.errorKey === first)?.message
    );
  });
  protected readonly customErrors = computed(
    () => this.config().validators?.filter((rule) => this.visibleErrors()?.[rule.errorKey]) ?? [],
  );
  private readonly combo = viewChild(ClrCombobox);
  protected readonly availableOptions = computed(
    () => this.config().options?.filter((option) => !option.disabled) ?? [],
  );

  constructor() {
    afterEveryRender(() => {
      const combo = this.combo();
      const input = combo?.textbox?.nativeElement;
      if (!input) return;
      const popupId = combo?.ariaControls;
      if (popupId && input.ownerDocument.getElementById(popupId)) input.setAttribute('aria-controls', popupId);
      else input.removeAttribute('aria-controls');
      // Clarity 18 can retain a no-results ID after its popup is removed.
      const active = input.getAttribute('aria-activedescendant');
      if (active && !input.ownerDocument.getElementById(active)) input.removeAttribute('aria-activedescendant');
      input.setAttribute('aria-label', this.label());
      input.setAttribute('aria-invalid', String(!!this.visibleErrors()));
      input.setAttribute('aria-required', String(this.config().required !== false));
      input.setAttribute(
        'aria-describedby',
        `${this.groupHelpId()} ${this.controlId()}-help ${this.controlId()}-error`,
      );
    });
  }

  protected readonly optionIdentity = (option: KeyValueOption) => option.value;

  protected edit(event: Event): void {
    if (this.blocked() || this.readonly() || (event instanceof InputEvent && event.isComposing)) return;
    const target = event.target as HTMLInputElement;
    const type = this.config().type;
    this.changed.emit(
      type === 'number'
        ? target.value === ''
          ? null
          : target.valueAsNumber
        : type === 'boolean'
          ? target.checked
          : type === 'array'
            ? target.value === ''
              ? []
              : target.value.replace(/\r\n?/g, '\n').split('\n')
            : target.value,
    );
  }

  protected leave(event: FocusEvent): void {
    if (this.blocked()) return;
    const inside = (target: Node | null) =>
      this.host.contains(target) ||
      !!this.host.ownerDocument.getElementById(this.combo()?.ariaControls ?? '')?.contains(target);
    if (event.relatedTarget) {
      if (!inside(event.relatedTarget as Node)) this.blurred.emit();
    } else {
      queueMicrotask(() => {
        if (!this.destroyRef.destroyed && !this.blocked() && !inside(this.host.ownerDocument.activeElement))
          this.blurred.emit();
      });
    }
  }

  protected selectValue(value: string): void {
    if (!this.blocked() && !this.readonly()) this.changed.emit(value);
  }

  protected select(option: KeyValueOption | null): void {
    if (!this.blocked() && !this.readonly() && !option?.disabled) this.changed.emit(option?.value ?? '');
  }
}
