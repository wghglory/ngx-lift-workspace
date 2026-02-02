import {CommonModule} from '@angular/common';
import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {ClarityModule} from '@clr/angular';
import {
  PageContainerComponent,
  TimepickerComponent,
  TimepickerInputDirective,
  TimepickerToggleComponent,
} from 'clr-lift';

import {CodeBlockComponent} from '../../../shared/components/code-block/code-block.component';
import {highlight} from '../../../shared/utils/highlight.util';

@Component({
  selector: 'app-timepicker-demo',
  imports: [
    CommonModule,
    ClarityModule,
    ReactiveFormsModule,
    PageContainerComponent,
    TimepickerComponent,
    TimepickerInputDirective,
    TimepickerToggleComponent,
    CodeBlockComponent,
  ],
  templateUrl: './timepicker-demo.component.html',
  styleUrls: ['./timepicker-demo.component.scss'],
})
export class TimepickerDemoComponent implements OnInit {
  // Example 1: Basic timepicker
  basicForm = new FormGroup({
    time: new FormControl<Date | string | null>('', [Validators.required]),
  });

  // Example 2: Custom intervals
  intervalsForm = new FormGroup({
    time15m: new FormControl<Date | string | null>(''),
    time1h: new FormControl<Date | string | null>(''),
    time3_5h: new FormControl<Date | string | null>(''),
  });

  // Example 3: Min/Max validation
  validationForm = new FormGroup({
    meetingTime: new FormControl<Date | string | null>('', [Validators.required]),
  });

  // Example 4: Custom options
  customOptionsForm = new FormGroup({
    timeOfDay: new FormControl<Date | string | null>(''),
  });

  customTimeOptions = [
    {value: new Date(2024, 0, 1, 9, 0), label: 'Morning (9:00 AM)'},
    {value: new Date(2024, 0, 1, 12, 0), label: 'Noon (12:00 PM)'},
    {value: new Date(2024, 0, 1, 15, 0), label: 'Afternoon (3:00 PM)'},
    {value: new Date(2024, 0, 1, 18, 0), label: 'Evening (6:00 PM)'},
    {value: new Date(2024, 0, 1, 21, 0), label: 'Night (9:00 PM)'},
  ];

  // Example 5: Datepicker integration
  dateTimeForm = new FormGroup({
    meetingDateTime: new FormControl<Date | null>(new Date()),
  });

  // Example 6: Custom toggle icon (uses default setup)
  customIconForm = new FormGroup({
    time: new FormControl<Date | string | null>(''),
  });

  // Example 7: Locale examples
  localeForm = new FormGroup({
    timeUS: new FormControl<Date | string | null>(''),
    timeGB: new FormControl<Date | string | null>(''),
    timeDE: new FormControl<Date | string | null>(''),
  });

  // Example 8: Reactive forms with validation
  complexForm = new FormGroup({
    startTime: new FormControl<Date | string | null>('', [Validators.required]),
    endTime: new FormControl<Date | string | null>('', [Validators.required]),
  });

  ngOnInit() {
    // Set some initial values for demo
    const initialTime = new Date(2024, 0, 1, 14, 30);
    this.basicForm.patchValue({
      time: initialTime,
    });

    const initialDateTime = new Date(2024, 5, 15, 14, 30);
    this.dateTimeForm.patchValue({
      meetingDateTime: initialDateTime,
    });
  }

  submitBasicForm() {
    if (this.basicForm.valid) {
      console.log('Basic form submitted:', this.basicForm.value);
    }
  }

  submitValidationForm() {
    if (this.validationForm.valid) {
      console.log('Validation form submitted:', this.validationForm.value);
    }
  }

  submitComplexForm() {
    if (this.complexForm.valid) {
      console.log('Complex form submitted:', this.complexForm.value);
    }
  }

  // Code examples
  basicExampleCode = highlight(
    `
import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ClarityModule } from '@clr/angular';
import {
  TimepickerComponent,
  TimepickerInputDirective,
  TimepickerToggleComponent
} from 'clr-lift';

@Component({
  imports: [
    ClarityModule,
    ReactiveFormsModule,
    TimepickerComponent,
    TimepickerInputDirective,
    TimepickerToggleComponent
  ],
  template: \`
    <form clrForm [formGroup]="form" (ngSubmit)="submit()">
      <div class="clr-form-control">
        <label class="clr-control-label">Select Time</label>
        <div class="clr-control-container">
          <div class="clr-input-wrapper">
            <div class="clr-input-group">
              <input class="clr-input" [cllTimepicker]="timepicker" formControlName="time" />
              <cll-timepicker-toggle [for]="timepicker" class="clr-input-group-icon-action" />
            </div>
            <cll-timepicker #timepicker />
          </div>
          @if (form.get('time')?.invalid && form.get('time')?.touched) {
            <span class="clr-subtext clr-error">Time is required</span>
          }
        </div>
      </div>

      <button type="submit" class="btn btn-primary" [disabled]="form.invalid">
        Submit
      </button>
    </form>
  \`
})
export class BasicTimepickerExample {
  form = new FormGroup({
    time: new FormControl('', [Validators.required])
  });

  submit() {
    console.log('Form submitted:', this.form.value);
  }
}
  `,
    'typescript',
  );

  intervalsExampleCode = highlight(
    `
<!-- Every 15 minutes -->
<div class="clr-input-wrapper">
  <div class="clr-input-group">
    <input class="clr-input" [cllTimepicker]="timepicker15" formControlName="time15m" />
    <cll-timepicker-toggle [for]="timepicker15" class="clr-input-group-icon-action" />
  </div>
  <cll-timepicker #timepicker15 [interval]="'15m'" />
</div>

<!-- Every hour -->
<div class="clr-input-wrapper">
  <div class="clr-input-group">
    <input class="clr-input" [cllTimepicker]="timepicker1h" formControlName="time1h" />
    <cll-timepicker-toggle [for]="timepicker1h" class="clr-input-group-icon-action" />
  </div>
  <cll-timepicker #timepicker1h [interval]="'1h'" />
</div>

<!-- Every 3.5 hours -->
<div class="clr-input-wrapper">
  <div class="clr-input-group">
    <input class="clr-input" [cllTimepicker]="timepicker3_5h" formControlName="time3_5h" />
    <cll-timepicker-toggle [for]="timepicker3_5h" class="clr-input-group-icon-action" />
  </div>
  <cll-timepicker #timepicker3_5h [interval]="'3.5 hours'" />
</div>
  `,
    'html',
  );

  validationExampleCode = highlight(
    `
<div class="clr-form-control">
  <label class="clr-control-label">Meeting Time (9 AM - 5 PM)</label>
  <div class="clr-control-container">
    <div class="clr-input-wrapper">
      <div class="clr-input-group">
        <input
          class="clr-input"
          [cllTimepicker]="timepicker"
          [cllTimepickerMin]="'9:00 AM'"
          [cllTimepickerMax]="'5:00 PM'"
          formControlName="meetingTime"
        />
        <cll-timepicker-toggle [for]="timepicker" class="clr-input-group-icon-action" />
      </div>
      <cll-timepicker #timepicker [min]="'9:00 AM'" [max]="'5:00 PM'" />
    </div>
    <span class="clr-subtext">Enter a time between 9:00 AM and 5:00 PM</span>
    @if (form.get('meetingTime')?.hasError('cllTimepickerParse') && form.get('meetingTime')?.touched) {
      <span class="clr-subtext clr-error">Invalid time format</span>
    }
    @if (form.get('meetingTime')?.hasError('cllTimepickerMin') && form.get('meetingTime')?.touched) {
      <span class="clr-subtext clr-error">Time must be after 9:00 AM</span>
    }
    @if (form.get('meetingTime')?.hasError('cllTimepickerMax') && form.get('meetingTime')?.touched) {
      <span class="clr-subtext clr-error">Time must be before 5:00 PM</span>
    }
    @if (form.get('meetingTime')?.hasError('required') && form.get('meetingTime')?.touched) {
      <span class="clr-subtext clr-error">Time is required</span>
    }
  </div>
</div>
  `,
    'html',
  );

  customOptionsExampleCode = highlight(
    `
export class CustomOptionsExample {
  customOptions = [
    { value: new Date(2024, 0, 1, 9, 0), label: 'Morning (9:00 AM)' },
    { value: new Date(2024, 0, 1, 12, 0), label: 'Noon (12:00 PM)' },
    { value: new Date(2024, 0, 1, 15, 0), label: 'Afternoon (3:00 PM)' },
    { value: new Date(2024, 0, 1, 18, 0), label: 'Evening (6:00 PM)' },
    { value: new Date(2024, 0, 1, 21, 0), label: 'Night (9:00 PM)' }
  ];
}

<!-- Template -->
<div class="clr-input-wrapper">
  <div class="clr-input-group">
    <input class="clr-input" [cllTimepicker]="timepicker" formControlName="timeOfDay" />
    <cll-timepicker-toggle [for]="timepicker" class="clr-input-group-icon-action" />
  </div>
  <cll-timepicker #timepicker [options]="customOptions" />
</div>
  `,
    'typescript',
  );

  dateTimeIntegrationCode = highlight(
    `
<clr-date-container>
  <label>Meeting Date & Time</label>
  <input clrDate formControlName="meetingDateTime" placeholder="MM/DD/YYYY" />
  <div class="clr-input-wrapper">
    <div class="clr-input-group">
      <input class="clr-input" [cllTimepicker]="timepicker" formControlName="meetingDateTime" placeholder="HH:MM AM/PM" />
      <cll-timepicker-toggle [for]="timepicker" class="clr-input-group-icon-action" />
    </div>
    <cll-timepicker #timepicker />
  </div>
  <clr-control-helper>Both date and time share the same form control</clr-control-helper>
</clr-date-container>
  `,
    'html',
  );

  customIconExampleCode = highlight(
    `
<!-- Default clock icon -->
<div class="clr-input-group">
  <input class="clr-input" [cllTimepicker]="timepicker" formControlName="time" />
  <cll-timepicker-toggle [for]="timepicker" class="clr-input-group-icon-action" />
</div>

<!-- Custom icon -->
<div class="clr-input-group">
  <input class="clr-input" [cllTimepicker]="timepicker" formControlName="time" />
  <cll-timepicker-toggle [for]="timepicker" class="clr-input-group-icon-action">
    <cds-icon shape="calendar" cllTimepickerToggleIcon />
  </cll-timepicker-toggle>
</div>
  `,
    'html',
  );

  complexFormExampleCode = highlight(
    `
export class ComplexFormExample {
  form = new FormGroup({
    startTime: new FormControl('', [Validators.required]),
    endTime: new FormControl('', [Validators.required])
  });

  submit() {
    if (this.form.valid) {
      console.log('Form submitted:', this.form.value);
    }
  }
}

<!-- Template -->
<form clrForm [formGroup]="form" (ngSubmit)="submit()">
  <div class="clr-form-control">
    <label class="clr-control-label">Start Time</label>
    <div class="clr-control-container">
      <div class="clr-input-wrapper">
        <div class="clr-input-group">
          <input class="clr-input" [cllTimepicker]="startTimepicker" formControlName="startTime" />
          <cll-timepicker-toggle [for]="startTimepicker" class="clr-input-group-icon-action" />
        </div>
        <cll-timepicker #startTimepicker />
      </div>
      @if (form.get('startTime')?.hasError('required') && form.get('startTime')?.touched) {
        <span class="clr-subtext clr-error">Start time is required</span>
      }
    </div>
  </div>

  <div class="clr-form-control">
    <label class="clr-control-label">End Time</label>
    <div class="clr-control-container">
      <div class="clr-input-wrapper">
        <div class="clr-input-group">
          <input class="clr-input" [cllTimepicker]="endTimepicker" formControlName="endTime" />
          <cll-timepicker-toggle [for]="endTimepicker" class="clr-input-group-icon-action" />
        </div>
        <cll-timepicker #endTimepicker />
      </div>
      @if (form.get('endTime')?.hasError('required') && form.get('endTime')?.touched) {
        <span class="clr-subtext clr-error">End time is required</span>
      }
    </div>
  </div>

  <button type="submit" class="btn btn-primary" [disabled]="form.invalid">
    Submit
  </button>
</form>
  `,
    'typescript',
  );
}
