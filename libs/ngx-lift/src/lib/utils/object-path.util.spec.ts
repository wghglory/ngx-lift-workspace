import {describe, expect, expectTypeOf, it} from 'vitest';
import {deleteValueByPath, getValueByPath} from './object-path.util';

describe('object-path.util', () => {
  describe('getValueByPath', () => {
    it('reads top-level and deeply nested own properties', () => {
      const data = {name: 'Test', spec: {dbOwner: {type: 'sqlServer'}}};
      expect(getValueByPath<string>(data, 'name')).toBe('Test');
      expect(getValueByPath<string>(data, 'spec.dbOwner.type')).toBe('sqlServer');
      expect(data.spec.dbOwner.type).toBe('sqlServer');
    });

    it('supports numeric array segments', () => {
      const data = {
        users: [
          {id: 1, name: 'Alice'},
          {id: 2, name: 'Bob'},
        ],
      };
      expect(getValueByPath<string>(data, 'users.1.name')).toBe('Bob');
    });

    it('returns undefined for missing, blank and malformed paths', () => {
      const data = {spec: {name: 'Test'}};
      expect(getValueByPath(data, 'spec.dbOwner.type')).toBeUndefined();
      expect(getValueByPath(data, '')).toBeUndefined();
      expect(getValueByPath(data, '   ')).toBeUndefined();
      expect(getValueByPath(data, 'spec..name')).toBeUndefined();
      expect(getValueByPath(data, 'spec.name.extra')).toBeUndefined();
      expect(getValueByPath(data, 'spec.name.0')).toBeUndefined();
    });

    it('returns undefined for null, undefined and primitive sources', () => {
      expect(getValueByPath(null, 'spec.name')).toBeUndefined();
      expect(getValueByPath(undefined, 'spec.name')).toBeUndefined();
      expect(getValueByPath('string', 'length')).toBeUndefined();
      expect(getValueByPath(123, 'toFixed')).toBeUndefined();
    });

    it('never resolves inherited properties', () => {
      const data = Object.create({inherited: 'from prototype'}) as {own?: string; inherited?: string};
      data.own = 'own value';
      expect(getValueByPath<string>(data, 'own')).toBe('own value');
      expect(getValueByPath(data, 'inherited')).toBeUndefined();
      expect(getValueByPath(data, 'toString')).toBeUndefined();
    });

    it('rejects prototype-related segments without mutating Object.prototype', () => {
      const data = {safe: 'value'};
      for (const path of ['__proto__.polluted', 'constructor.prototype', 'safe.__proto__', 'prototype']) {
        expect(getValueByPath(data, path)).toBeUndefined();
      }
      expect(({} as Record<string, unknown>).polluted).toBeUndefined();
    });

    it('exposes the caller-chosen return type', () => {
      const value = getValueByPath<string>({name: 'Alice'}, 'name');
      expectTypeOf(value).toEqualTypeOf<string | undefined>();
      expectTypeOf(getValueByPath({name: 'Alice'}, 'name')).toEqualTypeOf<unknown>();
      expectTypeOf(deleteValueByPath({}, 'name')).toEqualTypeOf<boolean>();
    });
  });

  describe('deleteValueByPath', () => {
    it('deletes top-level and deeply nested own properties in place', () => {
      const data: Record<string, unknown> = {a: 1, b: 2, spec: {limits: {cpu: '2', memory: '4Gi'}}};
      expect(deleteValueByPath(data, 'b')).toBe(true);
      expect(deleteValueByPath(data, 'spec.limits.cpu')).toBe(true);
      expect(data).toEqual({a: 1, spec: {limits: {memory: '4Gi'}}});
      expect(deleteValueByPath(data, 'spec.limits.cpu')).toBe(false);
    });

    it('supports numeric array segments', () => {
      const data = {items: ['a', 'b']};
      expect(deleteValueByPath(data, 'items.0')).toBe(true);
      expect(Object.hasOwn(data.items, '0')).toBe(false);
      expect(data.items.length).toBe(2);
      expect(deleteValueByPath(data, 'items.0')).toBe(false);
    });

    it('returns false for missing intermediate and final segments', () => {
      const data: Record<string, unknown> = {spec: {name: 'test'}};
      expect(deleteValueByPath(data, 'spec.limits.cpu')).toBe(false);
      expect(deleteValueByPath(data, 'spec.nonExistent')).toBe(false);
      expect(data).toEqual({spec: {name: 'test'}});
    });

    it('returns false for invalid arguments and malformed paths', () => {
      expect(deleteValueByPath(null, 'foo')).toBe(false);
      expect(deleteValueByPath(undefined, 'foo')).toBe(false);
      expect(deleteValueByPath('text', 'length')).toBe(false);
      expect(deleteValueByPath({}, '')).toBe(false);
      expect(deleteValueByPath({a: 1}, '   ')).toBe(false);
      expect(deleteValueByPath({a: 1}, 'a..b')).toBe(false);
    });

    it('never deletes inherited properties', () => {
      const data = Object.create({inherited: 'from prototype'}) as {own?: string; inherited?: string};
      data.own = 'own value';
      expect(deleteValueByPath(data, 'inherited')).toBe(false);
      expect(deleteValueByPath(data, 'toString')).toBe(false);
      expect(Object.prototype.hasOwnProperty.call(Object.getPrototypeOf(data), 'inherited')).toBe(true);
      expect(deleteValueByPath(data, 'own')).toBe(true);
      expect(Object.hasOwn(data, 'own')).toBe(false);
    });

    it('rejects prototype-related segments without polluting Object.prototype', () => {
      const data: Record<string, unknown> = {safe: 'value'};
      for (const path of ['__proto__.polluted', 'constructor.prototype', 'safe.__proto__', 'prototype']) {
        expect(deleteValueByPath(data, path)).toBe(false);
      }
      expect(({} as Record<string, unknown>).polluted).toBeUndefined();
      expect(data).toEqual({safe: 'value'});
    });

    it('returns false for non-configurable properties instead of throwing', () => {
      const data: Record<string, unknown> = {};
      Object.defineProperty(data, 'locked', {value: 1, configurable: false, writable: true});
      expect(deleteValueByPath(data, 'locked')).toBe(false);
      expect(data.locked).toBe(1);
    });
  });
});
