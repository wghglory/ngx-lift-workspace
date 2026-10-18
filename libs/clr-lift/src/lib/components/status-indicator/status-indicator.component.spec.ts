import {ComponentFixture, TestBed} from '@angular/core/testing';

import {TranslationService} from '../../services/translation.service';
import {MockTranslationService} from '../../services/translation.service.mock';
import {StatusIndicatorComponent} from './status-indicator.component';

describe('StatusIndicatorComponent', () => {
  let component: StatusIndicatorComponent;
  let fixture: ComponentFixture<StatusIndicatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StatusIndicatorComponent],
      providers: [{provide: TranslationService, useClass: MockTranslationService}],
    }).compileComponents();

    fixture = TestBed.createComponent(StatusIndicatorComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('iconStatus', 'success');
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it.each(['success', 'error', 'pending', 'warning', 'inactive', 'unknown'])(
    'exposes %s as a named image for assistive technology',
    (status) => {
      fixture.componentRef.setInput('iconStatus', status);
      fixture.detectChanges();
      const image = fixture.nativeElement.querySelector('[role="img"]');
      expect(image).not.toBeNull();
      expect(image.getAttribute('aria-label')).toBeTruthy();
    },
  );

  it('uses a non-submit button for tooltip interaction inside forms', () => {
    fixture.componentRef.setInput('tooltip', 'Status details');
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('button').type).toBe('button');
  });
});
