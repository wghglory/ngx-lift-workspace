import {ComponentFixture, TestBed} from '@angular/core/testing';

import {FileExtensionValidatorComponent} from './file-extension-validator.component';

describe('FileExtensionValidatorComponent', () => {
  let component: FileExtensionValidatorComponent;
  let fixture: ComponentFixture<FileExtensionValidatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FileExtensionValidatorComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FileExtensionValidatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
