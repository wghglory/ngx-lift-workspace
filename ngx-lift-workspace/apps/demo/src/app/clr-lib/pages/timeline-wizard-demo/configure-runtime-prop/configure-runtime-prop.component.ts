import {Component, inject} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, ReactiveFormsModule} from '@angular/forms';
import {ClarityModule} from '@clr/angular';
import {KeyValueInputsComponent, TimelineBaseComponent} from 'clr-lift';

type RuntimePropStepData = {appProperties: Array<{key: string; value: string}>};

@Component({
  selector: 'cll-configure-runtime-prop',
  standalone: true,
  imports: [ClarityModule, ReactiveFormsModule, KeyValueInputsComponent],
  templateUrl: './configure-runtime-prop.component.html',
  styleUrls: ['./configure-runtime-prop.component.scss'],
})
export class ConfigureRuntimePropComponent extends TimelineBaseComponent<RuntimePropStepData> {
  private fb = inject(FormBuilder);

  override form = this.fb.group({
    appProperties: this.fb.array<
      FormGroup<{
        key: FormControl<string>;
        value: FormControl<string>;
      }>
    >([]),
  });

  override formValueToData(): {appProperties: Record<string, string>} {
    const keyValuePairArray = this.form.controls.appProperties.value;
    const props: Record<string, string> = {};
    keyValuePairArray.forEach((kv) => {
      if (kv.key && kv.value) {
        props[kv.key] = kv.value;
      }
    });
    return {appProperties: props};
  }

  override dataToFormValue(data: {appProperties: Record<string, string>}): RuntimePropStepData {
    return {
      appProperties: Object.keys(data.appProperties).map((key) => {
        return {key, value: data.appProperties[key]};
      }),
    };
  }
}
