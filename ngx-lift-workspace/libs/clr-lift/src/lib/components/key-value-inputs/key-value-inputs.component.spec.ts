import {ComponentFixture, TestBed} from '@angular/core/testing';
import {FormArray, ReactiveFormsModule} from '@angular/forms';

import {TranslatePipe} from '../../pipes/translate.pipe';
import {TranslationService} from '../../services/translation.service';
import {MockTranslationService} from '../../services/translation.service.mock';
import {KeyValueFormGroup} from './key-value-form-group.type';
import {KeyValueInputsComponent} from './key-value-inputs.component';

describe('KeyValueInputsComponent', () => {
  let component: KeyValueInputsComponent;
  let fixture: ComponentFixture<KeyValueInputsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [KeyValueInputsComponent, ReactiveFormsModule, TranslatePipe],
      providers: [{provide: TranslationService, useClass: MockTranslationService}],
    });
    fixture = TestBed.createComponent(KeyValueInputsComponent);
    component = fixture.componentInstance;

    // Mock the required inputs
    fixture.componentRef.setInput('formArray', new FormArray<KeyValueFormGroup>([]));
    fixture.componentRef.setInput('data', [
      {key: 'key1', value: 'value1'},
      {key: 'key2', value: 'value2'},
    ]);
    fixture.componentRef.setInput('uniqueKey', true);
    fixture.componentRef.setInput('keyHelper', 'Key helper');
    fixture.componentRef.setInput('valueHelper', 'Value helper');
    fixture.componentRef.setInput('addText', 'Add Key-Value Pair');
    fixture.componentRef.setInput('inputSize', 40);
    fixture.componentRef.setInput('smartMode', false);
    fixture.componentRef.setInput('buttonClass', 'btn-sm btn-outline');
    fixture.componentRef.setInput('smartMode', false);

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form data based on input data', () => {
    expect(component.formArray().length).toBe(2);
    expect(component.formArray().at(0).get('key')?.value).toBe('key1');
    expect(component.formArray().at(0).get('value')?.value).toBe('value1');
    expect(component.formArray().at(1).get('key')?.value).toBe('key2');
    expect(component.formArray().at(1).get('value')?.value).toBe('value2');
  });

  it('should add key-value pair on addKeyValuePair', () => {
    const initialLength = component.formArray().length || 0;

    component.addKeyValuePair();

    expect(component.formArray().length).toBe(initialLength + 1);
  });

  it('should remove key-value pair on removeKeyValuePair', () => {
    const initialLength = component.formArray().length || 0;

    component.removeKeyValuePair(0);

    expect(component.formArray().length).toBe(initialLength - 1);
  });
});
