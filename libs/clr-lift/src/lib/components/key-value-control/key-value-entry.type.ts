import {ValidatorFn} from '@angular/forms';

/**
 * Supported serialized values; use the default string entry for simple metadata.
 * @example
 * const value: KeyValueValue = ['one.example', 'two.example'];
 */
export type KeyValueValue = string | number | boolean | string[] | null;

/**
 * One ordered entry. Duplicate keys remain representable until validation succeeds.
 * @example
 * const entry: KeyValueEntry = {key: 'environment', value: 'production'};
 */
export interface KeyValueEntry<T extends KeyValueValue = string> {
  key: string;
  value: T;
}

/**
 * A selectable stored value with a caller-localized display label.
 * @example
 * const option: KeyValueOption = {value: 'production', label: 'Production'};
 */
export interface KeyValueOption {
  value: string;
  label: string;
  disabled?: boolean;
}

/**
 * Synchronous field validator with caller-owned, localized error wording.
 * @example
 * const rule: KeyValueValidator = {
 *   validator: Validators.maxLength(63), errorKey: 'maxlength', message: 'Use at most 63 characters',
 * };
 */
export interface KeyValueValidator {
  validator: ValidatorFn;
  errorKey: string;
  message: string;
}

/**
 * Configure a field's editor, choices and synchronous validation. Omitted type means required free text.
 * Replace configurations/options instead of mutating them. Labels, helpers and messages are caller-localized.
 * Disabled fields remain in the submitted entry but skip field validation and block editing.
 * @example
 * const config: KeyValueFieldConfig = {type: 'number', min: 1, max: 10, helper: 'Retry count'};
 */
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
  /** Overrides built-in errors by key, such as required, unique, duplicate or arrayFormat. */
  messages?: Readonly<Record<string, string>>;
  validators?: readonly KeyValueValidator[];
}

/**
 * String-valued key editor: free text, select or searchable local choices.
 * @example
 * const keyConfig: KeyValueKeyConfig = {
 *   type: 'select', options: [{value: 'environment', label: 'Environment'}],
 * };
 */
export type KeyValueKeyConfig = Omit<KeyValueFieldConfig, 'type'> & {
  type?: 'input' | 'select' | 'combobox';
};
/**
 * Fixed value editor or a pure configuration resolver for the current key.
 * Keep the resolver stable; replace it when external options change. Resolvers may run during validation as well
 * as rendering. Use resetValueOnKeyChange on the component to clear values after user key changes.
 * @example
 * const valueConfig: KeyValueValueConfig = (key) =>
 *   key === 'enabled' ? {type: 'boolean'} : {type: 'input'};
 */
export type KeyValueValueConfig = KeyValueFieldConfig | ((key: string) => KeyValueFieldConfig);
