import {FormControl, FormGroup} from '@angular/forms';

/**
 * Type definition for a FormGroup representing a key-value pair.
 * Used in the KeyValueInputsComponent for managing dynamic key-value form inputs.
 *
 * The form group contains:
 * - `key`: A required string control for the key
 * - `value`: A required string control for the value
 */
export type KeyValueFormGroup = FormGroup<{
  key: FormControl<string>;
  value: FormControl<string>;
}>;
