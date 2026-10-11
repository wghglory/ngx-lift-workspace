import {ComponentFixture, TestBed} from '@angular/core/testing';

import {ThemeToggleDemoComponent} from './theme-toggle-demo.component';

describe('ThemeToggleDemoComponent', () => {
  let component: ThemeToggleDemoComponent;
  let fixture: ComponentFixture<ThemeToggleDemoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ThemeToggleDemoComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ThemeToggleDemoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should update lastChangedEvent on theme toggle', () => {
    component.onThemeChange('dark');
    expect(component.lastChangedEvent()).toContain('Emitted "dark"');
  });

  it('should programmatically update theme via service', () => {
    component.setTheme('light');
    expect(component.lastChangedEvent()).toContain('Programmatically set "light"');
  });
});
