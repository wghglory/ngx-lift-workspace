import {provideHttpClient} from '@angular/common/http';
import {provideHttpClientTesting} from '@angular/common/http/testing';
import {ComponentFixture, TestBed} from '@angular/core/testing';

import {KubernetesPaginationComponent} from './kubernetes-pagination.component';

describe('KubernetesPaginationComponent', () => {
  let component: KubernetesPaginationComponent;
  let fixture: ComponentFixture<KubernetesPaginationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [KubernetesPaginationComponent],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    fixture = TestBed.createComponent(KubernetesPaginationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should start with empty aggregated list and not loading', () => {
    expect(component.isLoading()).toBe(false);
    expect(component.aggregatedList()).toBeNull();
    expect(component.pagesFetched()).toBe(0);
  });

  it('should transition to loading state when fetch is triggered', () => {
    component.fetchAggregatedPods();
    expect(component.isLoading()).toBe(true);
    expect(component.pagesFetched()).toBe(1);
  });
});
