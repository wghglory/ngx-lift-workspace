import {ComponentFixture, TestBed} from '@angular/core/testing';
import {TranslationService} from 'clr-lift';
import {beforeEach, describe, expect, it} from 'vitest';
import {LanguageSwitcherComponent} from './language-switcher.component';

describe('LanguageSwitcherComponent', () => {
  let component: LanguageSwitcherComponent;
  let fixture: ComponentFixture<LanguageSwitcherComponent>;
  let translationService: TranslationService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LanguageSwitcherComponent],
      providers: [TranslationService],
    }).compileComponents();

    fixture = TestBed.createComponent(LanguageSwitcherComponent);
    component = fixture.componentInstance;
    translationService = TestBed.inject(TranslationService);
    translationService.setLanguage('en', false);
    fixture.detectChanges();
  });

  it('should create and display default language label', () => {
    expect(component).toBeTruthy();
    expect(component.currentLabel()).toBe('English');
  });

  it('should change language through translation service', () => {
    component.selectLanguage('zh-CN');
    fixture.detectChanges();

    expect(translationService.currentLanguage()).toBe('zh-CN');
    expect(component.currentLabel()).toBe('简体中文');
  });

  it('should handle regional code fallback gracefully', () => {
    translationService.setLanguage('fr-CA', false);
    fixture.detectChanges();

    expect(component.currentLabel()).toBe('Français');
  });
});
