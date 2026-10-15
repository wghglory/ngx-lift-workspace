import {ValidatorFn} from '@angular/forms';

/** A string option keeps the existing key/value form and backend payload compatible. */
export interface KeyValueOption {
  readonly value: string;
  readonly label: string;
  readonly disabled?: boolean;
}

export interface KeyValueValidation {
  readonly validator: ValidatorFn;
  readonly errorKey: string;
  readonly message: string;
}

interface KeyValueFieldBase {
  readonly label?: string;
  readonly placeholder?: string;
  readonly helper?: string;
  /** Defaults to true. Parent-owned validators are always preserved. */
  readonly required?: boolean;
  readonly validators?: readonly KeyValueValidation[];
}

/** Input is the default. Select only accepts values from its options. */
export type KeyValueFieldConfig = KeyValueFieldBase &
  ({readonly mode?: 'input'} | {readonly mode: 'select'; readonly options: readonly KeyValueOption[]});

/** A resolver supports dependent value choices and different editors for different keys. */
export type KeyValueValueConfig = KeyValueFieldConfig | ((key: string) => KeyValueFieldConfig);
