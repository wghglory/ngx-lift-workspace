import {FormControl, ValidationErrors} from '@angular/forms';

import {KeyValueEntry, KeyValueFieldConfig, KeyValueValue, KeyValueValueConfig} from './key-value-entry.type';

/** Indexed key/value field errors for one invalid entry. */
export interface RowErrors {
  index: number;
  key?: ValidationErrors;
  value?: ValidationErrors;
}

/**
 * Resolve fixed or key-dependent field configuration without changing owner data.
 * @param config Fixed configuration or a pure resolver.
 * @param key Current entry key.
 * @returns The configuration for that key.
 */
export function resolveValueConfig(config: KeyValueValueConfig, key: string): KeyValueFieldConfig {
  return typeof config === 'function' ? config(key) : config;
}

/**
 * Return the configured editor's empty value for a user clear or dependent reset.
 * @param config Editor configuration.
 * @returns A typed empty value; arrays receive a fresh instance.
 */
export function emptyFieldValue(config: KeyValueFieldConfig): KeyValueValue {
  if (config.type === 'boolean') return false;
  if (config.type === 'array') return [];
  return config.type === 'number' ? null : '';
}

/**
 * Copy nested string arrays while retaining primitive values.
 * @param value Serialized field value.
 * @returns A detached array or the original primitive.
 */
export function copyFieldValue(value: KeyValueValue): KeyValueValue {
  return Array.isArray(value) ? [...value] : value;
}

/**
 * Identify incompatible values independently of requiredness, touch and disabled state.
 * @param value Structurally supported field value.
 * @param config Editor configuration.
 * @returns A type or newline-format error key, or null when compatible.
 */
export function fieldValueError(value: KeyValueValue, config: KeyValueFieldConfig): 'type' | 'arrayFormat' | null {
  const type = config.type ?? 'input';
  const validType =
    type === 'array'
      ? Array.isArray(value)
      : type === 'number'
        ? value === null || (typeof value === 'number' && Number.isFinite(value))
        : type === 'boolean'
          ? typeof value === 'boolean'
          : typeof value === 'string';
  if (!validType) return 'type';
  if (
    type === 'array' &&
    Array.isArray(value) &&
    ((value.length === 1 && value[0] === '') || value.some((item) => /[\r\n]/.test(item)))
  )
    return 'arrayFormat';
  return null;
}

function fieldErrors(value: KeyValueValue, config: KeyValueFieldConfig): ValidationErrors {
  if (config.disabled) return {};
  const errors: ValidationErrors = {};
  const empty = value === null || value === '' || (Array.isArray(value) && value.length === 0);
  if (empty && config.required !== false) errors['required'] = true;
  const incompatibility = fieldValueError(value, config);
  if (incompatibility) errors[incompatibility] = true;
  if (!empty) {
    const type = config.type ?? 'input';
    if (
      (type === 'select' || type === 'combobox') &&
      !config.options?.some((option) => option.value === value && !option.disabled)
    )
      errors['selection'] = true;
    if (typeof value === 'number') {
      if (config.min !== undefined && value < config.min) errors['min'] = {min: config.min, actual: value};
      if (config.max !== undefined && value > config.max) errors['max'] = {max: config.max, actual: value};
    }
  }
  if (config.validators?.length) {
    const control = new FormControl(copyFieldValue(value));
    for (const {validator} of config.validators) Object.assign(errors, validator(control));
  }
  return errors;
}

/**
 * Check the serialized boundary before rendering or validating untyped owner data.
 * @param value Untyped owner data.
 * @returns Whether every entry and nested value has a supported serialized shape.
 */
export function isKeyValueEntries(value: unknown): value is readonly KeyValueEntry<KeyValueValue>[] {
  return (
    Array.isArray(value) &&
    Array.from(value).every((entry: unknown) => {
      if (entry === null || typeof entry !== 'object' || !('key' in entry) || !('value' in entry)) return false;
      const field = entry.value;
      return (
        typeof entry.key === 'string' &&
        (field === null ||
          typeof field === 'string' ||
          typeof field === 'number' ||
          typeof field === 'boolean' ||
          (Array.isArray(field) && Array.from(field).every((item: unknown) => typeof item === 'string')))
      );
    })
  );
}

/** Composite error envelope preserving row indexes and Angular validator payloads. */
export interface KeyValueErrors {
  keyValue: {
    rows: RowErrors[];
    structure?: true;
    minRows?: {required: number; actual: number};
    maxRows?: {required: number; actual: number};
  };
}

/** Shared policy for draft feedback and committed owner-value validation. */
export interface KeyValueValidationOptions {
  minRows?: number;
  maxRows?: number;
  uniqueKeys?: boolean;
  keyConfig?: KeyValueFieldConfig;
  valueConfig?: KeyValueValueConfig;
  uniquePairs?: boolean;
}

/**
 * Validate owner values without coercion; list uniqueness includes disabled fields.
 * @param value Committed owner data or the view's detached draft entries.
 * @param options Row-count, uniqueness and field-validation policy.
 * @returns Indexed composite errors, or null for valid values.
 */
export function keyValueErrors(value: unknown, options: KeyValueValidationOptions = {}): KeyValueErrors | null {
  const {
    minRows: min = 0,
    maxRows: max,
    uniqueKeys: unique = true,
    keyConfig = {},
    valueConfig = {},
    uniquePairs = false,
  } = options;
  const entries = value ?? [];
  if (!isKeyValueEntries(entries)) return {keyValue: {rows: [], structure: true}};
  const counts = new Map<string, number>();
  const pairs = new Map<string, number>();
  for (const entry of entries) {
    counts.set(entry.key, (counts.get(entry.key) ?? 0) + 1);
    const pair = JSON.stringify([entry.key, entry.value]);
    pairs.set(pair, (pairs.get(pair) ?? 0) + 1);
  }
  const rows: RowErrors[] = [];
  entries.forEach((entry, index) => {
    const key = fieldErrors(entry.key, keyConfig);
    const value = fieldErrors(entry.value, resolveValueConfig(valueConfig, entry.key));
    if (unique && entry.key !== '' && (counts.get(entry.key) ?? 0) > 1) key['unique'] = true;
    if (uniquePairs && entry.key !== '' && (pairs.get(JSON.stringify([entry.key, entry.value])) ?? 0) > 1) {
      key['duplicate'] = true;
      value['duplicate'] = true;
    }
    if (Object.keys(key).length || Object.keys(value).length)
      rows.push({index, ...(Object.keys(key).length ? {key} : {}), ...(Object.keys(value).length ? {value} : {})});
  });
  const minRows = entries.length < min ? {required: min, actual: entries.length} : undefined;
  const maxRows = max !== undefined && entries.length > max ? {required: max, actual: entries.length} : undefined;
  return rows.length || minRows || maxRows
    ? {keyValue: {rows, ...(minRows ? {minRows} : {}), ...(maxRows ? {maxRows} : {})}}
    : null;
}
