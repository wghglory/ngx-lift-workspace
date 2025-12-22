import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IdleDetectionService } from 'ngx-lift';

import { TranslationService } from '../../services/translation.service';
import { MockTranslationService } from '../../services/translation.service.mock';
import { IdleDetectionComponent } from './idle-detection.component';

describe('IdleDetectionComponent', () => {
  let component: IdleDetectionComponent;
  let fixture: ComponentFixture<IdleDetectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IdleDetectionComponent],
      providers: [
        IdleDetectionService,
        { provide: TranslationService, useClass: MockTranslationService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(IdleDetectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
