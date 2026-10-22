import {FormControl, ValidationErrors} from '@angular/forms';

import {KeyValueEntry, KeyValueFieldConfig, KeyValueValue, KeyValueValueConfig} from './key-value-entry.type';

export interface RowErrors {
  index: number;
  key?: ValidationErrors;
  value?: ValidationErrors;
}

export function resolveValueConfig(config: KeyValueValueConfig, key: string): KeyValueFieldConfig {
  return typeof config === 'function' ? config(key) : config;
}

export function emptyFieldValue(config: KeyValueFieldConfig): KeyValueValue {
  if (config.type === 'boolean') return false;
  if (config.type === 'array') return [];
  return config.type === 'number' ? null : '';
}

export function copyFieldValue(value: KeyValueValue): KeyValueValue {
  return Array.isArray(value) ? [...value] : value;
}

function fieldErrors(value: KeyValueValue, config: KeyValueFieldConfig): ValidationErrors {
  if (config.disabled) return {};
  const errors: ValidationErrors = {};
  const empty = value === null || value === '' || (Array.isArray(value) && value.length === 0);
  if (empty && config.required !== false) errors['required'] = true;
  if (!empty) {
    const type = config.type ?? 'input';
    const validType =
      type === 'array'
        ? Array.isArray(value) && value.every((item) => typeof item === 'string')
        : type === 'number'
          ? typeof value === 'number' && Number.isFinite(value)
          : type === 'boolean'
            ? typeof value === 'boolean'
            : typeof value === 'string';
    if (!validType) errors['type'] = true;
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

/** Validate committed owner values independently of buffered view edits. */
export function keyValueErrors(
  entries: readonly KeyValueEntry<KeyValueValue>[],
  min: number,
  max: number | undefined,
  unique: boolean,
  keyConfig: KeyValueFieldConfig = {},
  valueConfig: KeyValueValueConfig = {},
  uniquePairs = false,
) {
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
