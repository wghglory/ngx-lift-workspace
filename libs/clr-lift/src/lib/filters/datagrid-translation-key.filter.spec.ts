import {Injector, runInInjectionContext} from '@angular/core';
import {TestBed} from '@angular/core/testing';
import {describe, expect, it} from 'vitest';

import {TranslationService} from '../services/translation.service';
import {DatagridTranslationKeyFilter} from './datagrid-translation-key.filter';

interface UserRow {
  id: number;
  role?: string | null;
  details?: {
    status?: string | null;
  };
}

describe('DatagridTranslationKeyFilter', () => {
  const ROLE_MAP: Record<string, string> = {
    ADMIN: 'role.admin',
    OPERATOR: 'role.operator',
    VIEWER: 'role.viewer',
  };

  it('should accept all items when search string is empty or whitespace', () => {
    const filter = new DatagridTranslationKeyFilter<UserRow>('role', ROLE_MAP);
    const item: UserRow = {id: 1, role: 'ADMIN'};

    expect(filter.accepts(item, '')).toBe(true);
    expect(filter.accepts(item, '   ')).toBe(true);
  });

  it('should use custom translateFn when provided', () => {
    const translateFn = (key: string) => {
      if (key === 'role.admin') return 'System Administrator';
      if (key === 'role.operator') return 'Operations Engineer';
      return key;
    };

    const filter = new DatagridTranslationKeyFilter<UserRow>('role', ROLE_MAP, {
      translateFn,
    });

    expect(filter.accepts({id: 1, role: 'ADMIN'}, 'admin')).toBe(true);
    expect(filter.accepts({id: 1, role: 'ADMIN'}, 'System')).toBe(true);
    expect(filter.accepts({id: 2, role: 'OPERATOR'}, 'Engineer')).toBe(true);
    expect(filter.accepts({id: 2, role: 'OPERATOR'}, 'Admin')).toBe(false);
  });

  it('should use TranslationService if available and no translateFn is provided', () => {
    TestBed.configureTestingModule({
      providers: [TranslationService],
    });

    const service = TestBed.inject(TranslationService);
    service.loadTranslationsForComponent('role', {
      en: {
        admin: 'Administrator',
        viewer: 'Standard Viewer',
      },
    });

    const injector = TestBed.inject(Injector);

    const filter = runInInjectionContext(injector, () => {
      return new DatagridTranslationKeyFilter<UserRow>('role', {
        ADMIN: 'role.admin',
        VIEWER: 'role.viewer',
      });
    });

    expect(filter.accepts({id: 1, role: 'ADMIN'}, 'admin')).toBe(true);
    expect(filter.accepts({id: 2, role: 'VIEWER'}, 'viewer')).toBe(true);
  });

  it('should handle missing and null values using defaultValue', () => {
    const filter = new DatagridTranslationKeyFilter<UserRow>('role', ROLE_MAP, {
      defaultValue: 'Unassigned',
    });

    expect(filter.accepts({id: 1, role: null}, 'unassigned')).toBe(true);
    expect(filter.accepts({id: 2, role: undefined}, 'unassigned')).toBe(true);
    expect(filter.accepts({id: 3, role: 'ADMIN'}, 'unassigned')).toBe(false);
  });

  it('should support nested dot-notation paths', () => {
    const STATUS_MAP: Record<string, string> = {
      ACTIVE: 'Online',
      OFFLINE: 'Disconnected',
    };

    const filter = new DatagridTranslationKeyFilter<UserRow>('details.status', STATUS_MAP);

    expect(filter.accepts({id: 1, details: {status: 'ACTIVE'}}, 'online')).toBe(true);
    expect(filter.accepts({id: 2, details: {status: 'OFFLINE'}}, 'disco')).toBe(true);
    expect(filter.accepts({id: 3, details: {}}, 'online')).toBe(false);
  });
});
