import {describe, expect, it} from 'vitest';

import type {ResourceState} from '../models/resource-state.model';
import {extractResourceStates, isResourceState, sanitizeTombstones} from './resource-state.util';

describe('resource-state.util', () => {
  const secret: ResourceState = {name: 'app-secret', type: 'secret', namespace: 'default'};
  const configMap: ResourceState = {name: 'app-config', type: 'configMap', isNew: true};
  const tombstone: ResourceState = {name: 'old-cert', type: 'secret', isTombstone: true};

  describe('isResourceState', () => {
    it('should return true for valid ResourceState objects', () => {
      expect(isResourceState(secret)).toBe(true);
      expect(isResourceState(configMap)).toBe(true);
    });

    it('should return false for invalid objects or primitives', () => {
      expect(isResourceState(null)).toBe(false);
      expect(isResourceState(undefined)).toBe(false);
      expect(isResourceState('string')).toBe(false);
      expect(isResourceState({name: 'only-name'})).toBe(false);
      expect(isResourceState({type: 'only-type'})).toBe(false);
    });
  });

  describe('extractResourceStates', () => {
    it('should extract from single object, arrays, and nested dictionaries', () => {
      expect(extractResourceStates(secret)).toEqual([secret]);
      expect(extractResourceStates([secret, configMap])).toEqual([secret, configMap]);
      expect(
        extractResourceStates({
          primary: secret,
          nested: {secondary: configMap},
          ignored: 42,
        }),
      ).toEqual([secret, configMap]);
    });

    it('should return empty array for non-objects or empty inputs', () => {
      expect(extractResourceStates(null)).toEqual([]);
      expect(extractResourceStates({})).toEqual([]);
    });
  });

  describe('sanitizeTombstones', () => {
    it('should filter tombstones out of arrays', () => {
      const list = [secret, tombstone, configMap];
      expect(sanitizeTombstones(list)).toEqual([secret, configMap]);
    });

    it('should set dictionary properties with tombstones to undefined', () => {
      const dict = {
        active: secret,
        removed: tombstone,
      };
      expect(sanitizeTombstones(dict)).toEqual({
        active: secret,
        removed: undefined,
      });
    });

    it('should return undefined for a single tombstone object', () => {
      expect(sanitizeTombstones(tombstone)).toBeUndefined();
      expect(sanitizeTombstones(secret)).toBe(secret);
    });
  });
});
