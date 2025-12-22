import {FormControl, FormGroup} from '@angular/forms';

export type KeyValueFormGroup = FormGroup<{
  key: FormControl<string>;
  value: FormControl<string>;
}>;
