import {Component} from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {ClarityModule} from '@clr/angular';
import {TimelineBaseComponent} from 'clr-lift';

import {Deployment} from '../deployment.type';

@Component({
  selector: 'app-configure-service',
  standalone: true,
  imports: [ClarityModule, ReactiveFormsModule],
  templateUrl: './configure-service.component.html',
  styleUrl: './configure-service.component.scss',
})
export class ConfigureServiceComponent extends TimelineBaseComponent<Deployment['service']> {
  override form = new FormGroup({
    cpu: new FormControl('', [Validators.required]),
    replicas: new FormControl('', [Validators.required]),
    url: new FormControl('https://default-url.com', [Validators.required]),
  });

  override formValueToData() {
    return {service: this.form.value};
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  override dataToFormValue(data: any): Record<string, any> {
    return data.service;
  }
}
