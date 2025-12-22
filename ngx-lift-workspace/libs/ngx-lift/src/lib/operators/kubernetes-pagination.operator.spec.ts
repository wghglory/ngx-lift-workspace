/*
 * ******************************************************************
 * Copyright (c) 2024 Broadcom. All Rights Reserved.
 * Broadcom Confidential. The term "Broadcom" refers to Broadcom Inc.
 * and/or its subsidiaries.
 * ******************************************************************
 */
import {HttpClient, provideHttpClient} from '@angular/common/http';
import {HttpTestingController, provideHttpClientTesting} from '@angular/common/http/testing';
import {TestBed} from '@angular/core/testing';
import {of} from 'rxjs';

import {KubernetesList, KubernetesObject} from '../models';
import {
  aggregatePaginatedKubernetesResources,
  fetchPaginatedKubernetesResources,
} from './kubernetes-pagination.operator';

describe('aggregatePaginatedKubernetesResources', () => {
  let httpClient: HttpClient;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });

    httpClient = TestBed.inject(HttpClient);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should aggregate paginated Kubernetes resources correctly', () => {
    const endpoint = '/test-endpoint';
    const initialParams = {};
    const mockResponse1: KubernetesList<KubernetesObject> = {
      apiVersion: 'v1',
      kind: 'List',
      metadata: {continue: 'token1', resourceVersion: '1'},
      items: [
        {apiVersion: 'v1', kind: 'List', metadata: {name: 'Item 1'}},
        {apiVersion: 'v1', kind: 'List', metadata: {name: 'Item 2'}},
      ],
    };
    const mockResponse2: KubernetesList<KubernetesObject> = {
      apiVersion: 'v1',
      kind: 'List',
      metadata: {continue: '', resourceVersion: '1'},
      items: [
        {apiVersion: 'v1', kind: 'List', metadata: {name: 'Item 3'}},
        {apiVersion: 'v1', kind: 'List', metadata: {name: 'Item 4'}},
      ],
    };

    const source$ = of(mockResponse1);

    const result$ = source$.pipe(aggregatePaginatedKubernetesResources(httpClient, endpoint, initialParams));

    result$.subscribe((aggregatedList) => {
      expect(aggregatedList.items.length).toBe(4);
    });

    const req1 = httpTestingController.expectOne(`${endpoint}?continue=token1`);
    expect(req1.request.method).toBe('GET');
    req1.flush(mockResponse2);
  });

  it('should not call API if no more pages', (done) => {
    const endpoint = '/test-endpoint';
    const initialParams = {};
    const mockResponse: KubernetesList<KubernetesObject> = {
      apiVersion: 'v1',
      kind: 'List',
      metadata: {continue: '', resourceVersion: '1'},
      items: [
        {apiVersion: 'v1', kind: 'List', metadata: {name: 'Item 1'}},
        {apiVersion: 'v1', kind: 'List', metadata: {name: 'Item 2'}},
      ],
    };

    const source$ = of(mockResponse);

    const result$ = source$.pipe(aggregatePaginatedKubernetesResources(httpClient, endpoint, initialParams));

    result$.subscribe((aggregatedList) => {
      expect(aggregatedList.items.length).toBe(2);
      done();
    });

    httpTestingController.expectNone(endpoint);
  });
});

describe('fetchPaginatedKubernetesResources', () => {
  let httpClient: HttpClient;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });

    httpClient = TestBed.inject(HttpClient);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should fetch paginated Kubernetes resources correctly', () => {
    const endpoint = '/test-endpoint';
    const initialParams = {};
    const mockResponse1: KubernetesList<KubernetesObject> = {
      apiVersion: 'v1',
      kind: 'List',
      metadata: {continue: 'token1', resourceVersion: '1'},
      items: [
        {apiVersion: 'v1', kind: 'List', metadata: {name: 'Item 1'}},
        {apiVersion: 'v1', kind: 'List', metadata: {name: 'Item 2'}},
      ],
    };
    const mockResponse2: KubernetesList<KubernetesObject> = {
      apiVersion: 'v1',
      kind: 'List',
      metadata: {continue: '', resourceVersion: '1'},
      items: [
        {apiVersion: 'v1', kind: 'List', metadata: {name: 'Item 3'}},
        {apiVersion: 'v1', kind: 'List', metadata: {name: 'Item 4'}},
      ],
    };

    const result$ = fetchPaginatedKubernetesResources(httpClient, endpoint, initialParams);

    result$.subscribe((aggregatedList) => {
      expect(aggregatedList.items.length).toBe(4);
    });

    const req1 = httpTestingController.expectOne(endpoint);
    expect(req1.request.method).toBe('GET');
    req1.flush(mockResponse1);

    const req2 = httpTestingController.expectOne(`${endpoint}?continue=token1`);
    expect(req2.request.method).toBe('GET');
    req2.flush(mockResponse2);
  });

  it('should make the 1st API call if no more pages', () => {
    const endpoint = '/test-endpoint';
    const initialParams = {};
    const mockResponse: KubernetesList<KubernetesObject> = {
      apiVersion: 'v1',
      kind: 'List',
      metadata: {continue: '', resourceVersion: '1'},
      items: [
        {apiVersion: 'v1', kind: 'List', metadata: {name: 'Item 1'}},
        {apiVersion: 'v1', kind: 'List', metadata: {name: 'Item 2'}},
      ],
    };

    const result$ = fetchPaginatedKubernetesResources(httpClient, endpoint, initialParams);

    result$.subscribe((aggregatedList) => {
      expect(aggregatedList.items.length).toBe(2);
    });

    const req1 = httpTestingController.expectOne(endpoint);
    expect(req1.request.method).toBe('GET');
    req1.flush(mockResponse);
  });
});
