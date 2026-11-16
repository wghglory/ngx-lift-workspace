import {TestBed} from '@angular/core/testing';
import {afterEach, describe, expect, it, vi} from 'vitest';

import {QueryClient} from './query-client';
import {QUERY_CLIENT, provideQueryClient} from './query-client.token';

describe('QUERY_CLIENT', () => {
  afterEach(() => TestBed.resetTestingModule());

  it('provides an application-scoped client by default', () => {
    TestBed.configureTestingModule({});
    expect(TestBed.inject(QUERY_CLIENT)).toBeInstanceOf(QueryClient);
  });

  it('accepts a configured provider', () => {
    const onDiagnostic = vi.fn();
    TestBed.configureTestingModule({providers: [provideQueryClient({onDiagnostic})]});
    expect(TestBed.inject(QUERY_CLIENT)).toBeInstanceOf(QueryClient);
  });
});
