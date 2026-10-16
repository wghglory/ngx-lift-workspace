import {HttpErrorResponse} from '@angular/common/http';

export interface ValueRow {
  path: string;
  label: string;
  preview: string;
  depth: number;
  expandable: boolean;
  expanded: boolean;
  nextOffset?: number;
}

const pageSize = 100;
const maxNodes = 500;
const maxDepth = 20;

/** A bounded, read-only view. Descriptors avoid invoking application getters or toJSON hooks. */
export function valueRows(value: unknown, expanded: ReadonlyMap<string, number>): ValueRow[] {
  const rows: ValueRow[] = [];
  function visit(value: unknown, path: string, label: string, depth: number, ancestors: readonly object[]): void {
    if (rows.length >= maxNodes) return;
    let preview: string;
    let keys: string[] | undefined;
    let length = 0;
    const offset = expanded.get(path) ?? 0;
    const open = expanded.has(path);
    try {
      if (value === null) preview = 'null';
      else if (typeof value === 'string')
        preview = JSON.stringify(value.slice(0, 2000)) + (value.length > 2000 ? ' …' : '');
      else if (typeof value === 'bigint') preview = `${value}n`;
      else if (typeof value === 'object') {
        if (ancestors.includes(value)) preview = '[Circular]';
        else if (Array.isArray(value)) {
          length = value.length;
          preview = `Array(${length})`;
        } else {
          const prototype = Object.getPrototypeOf(value);
          const isError = value instanceof Error || value instanceof HttpErrorResponse;
          if (prototype === Object.prototype || prototype === null || isError) {
            keys = Object.getOwnPropertyNames(value);
            length = keys.length;
            preview = `${isError ? 'Error' : 'Object'}(${length})`;
          } else preview = '[Object]';
        }
      } else preview = typeof value === 'function' ? '[Function]' : String(value);
    } catch {
      preview = '[Unavailable]';
    }
    const expandable = length > 0 && depth < maxDepth;
    rows.push({path, label, preview, depth, expandable, expanded: open});
    if (!open || !expandable || typeof value !== 'object' || value === null) return;
    const nextAncestors = [...ancestors, value];
    for (let i = offset; i < Math.min(length, offset + pageSize) && rows.length < maxNodes; i++) {
      const key = keys ? keys[i] : String(i);
      const childPath = `${path}[${JSON.stringify(key)}]`;
      try {
        const descriptor = Object.getOwnPropertyDescriptor(value, key);
        if (!descriptor || !('value' in descriptor)) {
          rows.push({
            path: childPath,
            label: key,
            preview: '[Accessor]',
            depth: depth + 1,
            expandable: false,
            expanded: false,
          });
        } else visit(descriptor.value, childPath, key, depth + 1, nextAncestors);
      } catch {
        rows.push({
          path: childPath,
          label: key,
          preview: '[Unavailable]',
          depth: depth + 1,
          expandable: false,
          expanded: false,
        });
      }
    }
    if (length > pageSize && rows.length < maxNodes) {
      rows.push({
        path,
        label: `${offset + 1}–${Math.min(length, offset + pageSize)} / ${length}`,
        preview: '',
        depth: depth + 1,
        expandable: false,
        expanded: false,
        nextOffset: offset + pageSize < length ? offset + pageSize : 0,
      });
    }
  }
  visit(value, '$', '$', 0, []);
  return rows;
}

/** Copy only complete JSON-compatible trees, rejecting cycles, accessors, and oversized values before serialization. */
export function copyableJson(value: unknown): string | undefined {
  let budget = 262_144;
  const ancestors = new Set<object>();
  function clone(value: unknown, depth: number): unknown {
    if (--budget < 0 || depth > maxDepth) throw new Error('limit');
    if (value === null || typeof value === 'boolean') return value;
    if (typeof value === 'number' && Number.isFinite(value)) return value;
    if (typeof value === 'string') {
      budget -= value.length;
      if (budget < 0) throw new Error('limit');
      return value;
    }
    if (!value || typeof value !== 'object' || ancestors.has(value)) throw new Error('unsupported');
    if (!Array.isArray(value) && ![Object.prototype, null].includes(Object.getPrototypeOf(value)))
      throw new Error('unsupported');
    ancestors.add(value);
    const keys = Object.keys(value);
    if (Array.isArray(value) && (keys.length !== value.length || keys.some((key, index) => key !== String(index))))
      throw new Error('sparse array');
    const result: unknown[] | Record<string, unknown> = Array.isArray(value) ? [] : Object.create(null);
    for (const key of keys) {
      budget -= key.length;
      const descriptor = Object.getOwnPropertyDescriptor(value, key);
      if (!descriptor || !('value' in descriptor)) throw new Error('accessor');
      const child = clone(descriptor.value, depth + 1);
      if (Array.isArray(result)) result.push(child);
      else result[key] = child;
    }
    ancestors.delete(value);
    return result;
  }
  try {
    const text = JSON.stringify(clone(value, 0), null, 2);
    return new TextEncoder().encode(text).length <= 262_144 ? text : undefined;
  } catch {
    return undefined;
  }
}
