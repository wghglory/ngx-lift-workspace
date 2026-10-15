import {FormArray, FormControl as KeyValueControl, FormGroup, Validators} from '@angular/forms';
import {
  KeyValueFieldConfig,
  KeyValueFormGroup,
  KeyValueInputsComponent,
  KeyValueOption,
  KeyValueValidation,
  KeyValueValueConfig,
} from 'clr-lift';
import {toSignalForm as keyValueSignalForm} from 'ngx-lift';

function keyValueContract(editor: KeyValueInputsComponent) {
  const pairs = new FormArray<KeyValueFormGroup>([
    new FormGroup({
      key: new KeyValueControl('environment', {nonNullable: true}),
      value: new KeyValueControl('prod', {nonNullable: true}),
    }),
  ]);
  const options: readonly KeyValueOption[] = [{value: 'prod', label: 'Production', disabled: false}];
  const validation: KeyValueValidation = {validator: Validators.required, errorKey: 'required', message: 'Required'};
  const input: KeyValueFieldConfig = {mode: 'input', required: false, validators: [validation]};
  const select: KeyValueFieldConfig = {mode: 'select', options};
  const dependent: KeyValueValueConfig = (key) => (key === 'environment' ? select : input);
  const array: FormArray<KeyValueFormGroup> = editor.formArray();
  const current: KeyValueValueConfig = editor.valueConfig();
  const sf = keyValueSignalForm(new FormGroup({pairs}));
  const value: string | undefined = sf.value().pairs[0].value;
  const rawValue: string = pairs.getRawValue()[0].value;
  // @ts-expect-error Select configurations require options.
  const incomplete: KeyValueFieldConfig = {mode: 'select'};
  // @ts-expect-error Key/value controls and option values remain strings.
  const numeric: KeyValueOption = {value: 1, label: 'One'};
  void [input, select, dependent, array, current, value, rawValue, incomplete, numeric];
}
void keyValueContract;
