import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, FormControlDirective, NgControl, ReactiveFormsModule } from '@angular/forms';

import { TranslationService } from '../../services/translation.service';
import { MockTranslationService } from '../../services/translation.service.mock';
import { FileReaderComponent } from './file-reader.component';

describe('FileReaderComponent', () => {
  let component: FileReaderComponent;
  let fixture: ComponentFixture<FileReaderComponent>;

  beforeEach(() => {
    const mockFormControl = new FormControl('');
    const mockNgControl = {
      control: mockFormControl,
      form: mockFormControl, // Add form property for FormControlDirective case
      valueAccessor: null,
      validator: null,
      asyncValidator: null,
    } as unknown as FormControlDirective;

    TestBed.configureTestingModule({
      imports: [FileReaderComponent, ReactiveFormsModule],
      providers: [
        { provide: TranslationService, useClass: MockTranslationService },
        { provide: NgControl, useValue: mockNgControl },
      ],
    });
    fixture = TestBed.createComponent(FileReaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
