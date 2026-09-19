import {provideHttpClient} from '@angular/common/http';
import {provideHttpClientTesting} from '@angular/common/http/testing';
import {provideNoopAnimations} from '@angular/platform-browser/animations';
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {provideRouter} from '@angular/router';

import {ComputedAsyncComponent} from './computed-async.component';

describe('ComputedAsyncComponent', () => {
  let component: ComputedAsyncComponent;
  let fixture: ComponentFixture<ComputedAsyncComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ComputedAsyncComponent],
      providers: [provideHttpClient(), provideHttpClientTesting(), provideRouter([]), provideNoopAnimations()],
    }).compileComponents();

    fixture = TestBed.createComponent(ComputedAsyncComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should handle tab switching, survive aborted request, and recover on subsequent tab switch', async () => {
    // Initial tab loads active directory
    expect(component.selectedTab()).toBe('activeDirectory');

    await new Promise((resolve) => setTimeout(resolve, 250));
    fixture.detectChanges();
    expect(component.tabState().data?.title).toBe('Active Directory Domains');

    // Switch to simulated aborted request (simulates canceled HTTP request)
    component.selectTab('aborted');
    fixture.detectChanges();
    await new Promise((resolve) => setTimeout(resolve, 150));
    fixture.detectChanges();

    expect(component.tabState().error).toBeTruthy();

    // Verify stream resilience: subsequent tab switch still executes and recovers
    component.selectTab('backupLocations');
    fixture.detectChanges();
    await new Promise((resolve) => setTimeout(resolve, 250));
    fixture.detectChanges();

    expect(component.tabState().error).toBeNull();
    expect(component.tabState().data?.title).toBe('Backup & Storage Locations');
  });
});
