import {ValidatorFn} from '@angular/forms';

/** Supported serialized values; use the default string entry for simple metadata. */
export type KeyValueValue = string | number | boolean | string[] | null;

/** One ordered entry. Duplicate keys remain representable until validation succeeds. */
export interface KeyValueEntry<T extends KeyValueValue = string> {
  key: string;
  value: T;
}

export interface KeyValueOption {
  value: string;
  label: string;
  disabled?: boolean;
}

/** Synchronous field validator with caller-owned, localized error wording. */
export interface KeyValueValidator {
  validator: ValidatorFn;
  errorKey: string;
  message: string;
}

export interface KeyValueFieldConfig {
  type?: 'input' | 'select' | 'combobox' | 'number' | 'boolean' | 'array';
  options?: readonly KeyValueOption[];
  placeholder?: string;
  helper?: string;
  /** Defaults to true. Boolean false is a valid supplied value. */
  required?: boolean;
  disabled?: boolean;
  min?: number;
  max?: number;
  /** Overrides built-in errors by key, such as required, unique or duplicate. */
  messages?: Readonly<Record<string, string>>;
  validators?: readonly KeyValueValidator[];
}

export type KeyValueKeyConfig = Omit<KeyValueFieldConfig, 'type'> & {
  type?: 'input' | 'select' | 'combobox';
};
export type KeyValueValueConfig = KeyValueFieldConfig | ((key: string) => KeyValueFieldConfig);
