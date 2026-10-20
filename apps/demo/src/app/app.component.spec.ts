import {TestBed} from '@angular/core/testing';
import {provideNoopAnimations} from '@angular/platform-browser/animations';
import {provideRouter} from '@angular/router';

import {AppComponent} from './app.component';

describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppComponent],
      providers: [provideRouter([]), provideNoopAnimations()],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('renders the shared favicon as the named home link', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    const home = compiled.querySelector('.branding a');
    expect(home?.getAttribute('aria-label')).toBe('ngx-lift and clr-lift home');
    expect(home?.querySelector('img')?.getAttribute('src')).toMatch(/^favicon\.svg\?v=[a-f0-9]{8}$/);
    expect(home?.querySelector('img')?.getAttribute('alt')).toBe('');
    expect(home?.textContent?.trim()).toBe('');
  });
});
