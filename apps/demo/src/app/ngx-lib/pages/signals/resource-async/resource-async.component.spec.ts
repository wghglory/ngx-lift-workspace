import {ComponentFixture, TestBed} from '@angular/core/testing';

import {ResourceAsyncComponent} from './resource-async.component';
import {provideHttpClient} from '@angular/common/http';
import {provideHttpClientTesting} from '@angular/common/http/testing';
import {provideRouter} from '@angular/router';
import {provideNoopAnimations} from '@angular/platform-browser/animations';

describe('ResourceAsyncComponent', () => {
  let component: ResourceAsyncComponent;
  let fixture: ComponentFixture<ResourceAsyncComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResourceAsyncComponent],
      providers: [provideHttpClient(), provideHttpClientTesting(), provideRouter([]), provideNoopAnimations()],
    }).compileComponents();

    fixture = TestBed.createComponent(ResourceAsyncComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('updates search keyword and handles declarative resource operations', async () => {
    component.searchKeyword.set('Signals');
    expect(component.searchKeyword()).toBe('Signals');
    expect(component.searchDefinitionRef).toBeDefined();

    component.rapidSwitchQuery();
    expect(component.searchKeyword()).toBe('Signals');
  });

  it('runs awaitable execute on declarative search resource', async () => {
    await expect(component.runAwaitableSearch()).resolves.toBeUndefined();
  });
});
