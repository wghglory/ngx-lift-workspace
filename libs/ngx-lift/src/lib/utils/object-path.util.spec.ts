import {describe, expect, it} from 'vitest';
import {deleteValueByPath, getValueByPath} from './object-path.util';

describe('object-path.util', () => {
  describe('getValueByPath', () => {
    it('should retrieve a top-level property value', () => {
      const data = {name: 'Test'};
      expect(getValueByPath<string>(data, 'name')).toBe('Test');
    });

    it('should retrieve a deeply nested property value', () => {
      const data = {spec: {dbOwner: {type: 'sqlServer'}}};
      expect(getValueByPath<string>(data, 'spec.dbOwner.type')).toBe('sqlServer');
    });

    it('should return undefined if path does not exist', () => {
      const data = {spec: {name: 'Test'}};
      expect(getValueByPath(data, 'spec.dbOwner.type')).toBeUndefined();
    });

    it('should return undefined for empty or invalid path', () => {
      const data = {name: 'Test'};
      expect(getValueByPath(data, '')).toBeUndefined();
      expect(getValueByPath(data, '   ')).toBeUndefined();
    });

    it('should return undefined when source is null or primitive', () => {
      expect(getValueByPath(null, 'spec.name')).toBeUndefined();
      expect(getValueByPath(undefined, 'spec.name')).toBeUndefined();
      expect(getValueByPath('string', 'spec.name')).toBeUndefined();
      expect(getValueByPath(123, 'spec.name')).toBeUndefined();
    });

    it('should access array elements via numeric keys', () => {
      const data = {
        users: [
          {id: 1, name: 'Alice'},
          {id: 2, name: 'Bob'},
        ],
      };
      expect(getValueByPath<string>(data, 'users.1.name')).toBe('Bob');
    });
  });

  describe('deleteValueByPath', () => {
    it('should delete a top-level property', () => {
      const data: Record<string, unknown> = {a: 1, b: 2};
      const result = deleteValueByPath(data, 'b');
      expect(result).toBe(true);
      expect(data).toEqual({a: 1});
    });

    it('should delete a deeply nested property', () => {
      const data: Record<string, unknown> = {spec: {limits: {cpu: '2', memory: '4Gi'}}};
      const result = deleteValueByPath(data, 'spec.limits.cpu');
      expect(result).toBe(true);
      expect(data).toEqual({spec: {limits: {memory: '4Gi'}}});
    });

    it('should return false if intermediate path does not exist', () => {
      const data: Record<string, unknown> = {spec: {name: 'test'}};
      const result = deleteValueByPath(data, 'spec.limits.cpu');
      expect(result).toBe(false);
      expect(data).toEqual({spec: {name: 'test'}});
    });

    it('should return false if target property does not exist', () => {
      const data: Record<string, unknown> = {spec: {name: 'test'}};
      const result = deleteValueByPath(data, 'spec.nonExistent');
      expect(result).toBe(false);
    });

    it('should return false for invalid arguments', () => {
      expect(deleteValueByPath(null, 'foo')).toBe(false);
      expect(deleteValueByPath({}, '')).toBe(false);
      expect(deleteValueByPath({a: 1}, '   ')).toBe(false);
    });
  });
});
