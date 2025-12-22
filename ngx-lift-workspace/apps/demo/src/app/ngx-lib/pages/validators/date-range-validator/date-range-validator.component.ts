import {ChangeDetectionStrategy, Component} from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {ClarityModule} from '@clr/angular';
import {AlertComponent, CalloutComponent, PageContainerComponent} from 'clr-lift';
import {dateRangeValidator} from 'ngx-lift';

import {CodeBlockComponent} from '../../../../shared/components/code-block/code-block.component';
import {highlight} from '../../../../shared/utils/highlight.util';

@Component({
  selector: 'app-date-range-validator',
  standalone: true,
  imports: [
    ClarityModule,
    ReactiveFormsModule,
    PageContainerComponent,
    AlertComponent,
    CalloutComponent,
    CodeBlockComponent,
  ],
  templateUrl: './date-range-validator.component.html',
  styleUrl: './date-range-validator.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DateRangeValidatorComponent {
  today = new Date();
  tomorrow = new Date(new Date().getTime() + 1 * 24 * 60 * 60 * 1000);
  fiveDaysLater = new Date(new Date().getTime() + 5 * 24 * 60 * 60 * 1000); // 5 days from now

  todayInISO = this.today.toISOString().split('T')[0]; // get only the date part in YYYY-MM-DD format
  tomorrowInISO = this.tomorrow.toISOString().split('T')[0];
  fiveDaysLaterInISO = this.fiveDaysLater.toISOString().split('T')[0];

  minTimestamp = this.today.toISOString().slice(0, 16); // slice to ignore seconds part
  maxTimestamp = this.fiveDaysLater.toISOString().slice(0, 16);

  dateForm = new FormGroup({
    expires: new FormControl<string>('', {
      nonNullable: true,
      validators: [
        // If you want to be more accurate, minDate should be new Date() instead of this.today
        dateRangeValidator({minDate: this.today, minInclusive: true}),
      ],
    }),
    futureDays: new FormControl<string>('', {
      nonNullable: true,
      validators: [
        Validators.required,
        dateRangeValidator({
          maxDate: this.fiveDaysLater,
          maxInclusive: true,
          minDate: this.tomorrow,
          minInclusive: true,
        }),
      ],
    }),
  });

  dateTimeForm = new FormGroup({
    expires: new FormControl<string>('', {
      nonNullable: true,
      validators: [
        Validators.required,
        // If you want to be more accurate, minDate should be new Date() instead of this.today
        dateRangeValidator({minDate: this.today, maxDate: this.fiveDaysLater, compareTime: true}),
      ],
    }),
  });

  dateRangeOptionsInterface = highlight(`
interface DateRangeOptions {
  minDate?: Date | string;
  maxDate?: Date | string;
  minInclusive?: boolean;
  maxInclusive?: boolean;
  compareTime?: boolean;
}
  `);

  dateCode = highlight(`
<form clrForm [formGroup]="dateForm" clrLabelSize="3">
  <clr-input-container class="!mt-1">
    <label class="clr-required-mark">Expiration Date (Raw HTML Input)</label>
    <input
      type="date"
      class="w-[10rem]"
      clrInput
      [formControl]="dateForm.controls.expires"
      [min]="todayInISO"
    />
    <clr-control-error *clrIfError="'minDate'; error as minDate">
      The date cannot be earlier than {{ minDate }}
    </clr-control-error>
  </clr-input-container>

  <clr-date-container>
    <label class="clr-required-mark">Future 5 Days (Clarity Date Input)</label>
    <input
      type="date"
      clrDate
      [formControl]="dateForm.controls.futureDays"
      required
      [min]="tomorrowInISO"
      [max]="fiveDaysLaterInISO"
    />
    <clr-control-error *clrIfError="'required'">Required</clr-control-error>
    <clr-control-error *clrIfError="'invalidDate'">The date is invalid</clr-control-error>

    <!-- use the ValidationErrors provided by dateRangeValidator -->
    <clr-control-error *clrIfError="'maxDate'; error as maxDate">
      The date cannot be later than {{ maxDate }}
    </clr-control-error>
    <clr-control-error *clrIfError="'minDate'; error as minDate">
      The date cannot be earlier than {{ minDate }}
    </clr-control-error>

    <!-- use the ValidationErrors provided by Clarity -->
    <clr-control-error *clrIfError="'max'">The date is too late (clarity validation)</clr-control-error>
    <clr-control-error *clrIfError="'min'">The date is too early (clarity validation)</clr-control-error>
  </clr-date-container>
</form>

import {dateRangeValidator} from 'ngx-lift';

export class DateRangeValidatorComponent {
  today = new Date();
  tomorrow = new Date(new Date().getTime() + 1 * 24 * 60 * 60 * 1000);
  fiveDaysLater = new Date(new Date().getTime() + 5 * 24 * 60 * 60 * 1000); // 5 days from now

  todayInISO = this.today.toISOString().split('T')[0]; // get only the date part in YYYY-MM-DD format
  tomorrowInISO = this.tomorrow.toISOString().split('T')[0];
  fiveDaysLaterInISO = this.fiveDaysLater.toISOString().split('T')[0];

  dateForm = new FormGroup({
    expires: new FormControl<string>('', {
      nonNullable: true,
      validators: [
        // If you want to be more accurate, minDate should be new Date() instead of this.today
        dateRangeValidator({minDate: this.today, minInclusive: true}),
      ],
    }),
    futureDays: new FormControl<string>('', {
      nonNullable: true,
      validators: [
        Validators.required,
        dateRangeValidator({
          maxDate: this.fiveDaysLater,
          maxInclusive: true,
          minDate: this.tomorrow,
          minInclusive: true,
        }),
      ],
    }),
  });
}
  `);

  dateTimeCode = highlight(`
<form clrForm [formGroup]="dateTimeForm">
  <clr-input-container>
    <label class="clr-required-mark">Expiration Date</label>
    <input
      type="datetime-local"
      clrInput
      [formControl]="dateTimeForm.controls.expires"
      required
      [min]="minTimestamp"
      [max]="maxTimestamp"
    />
    <clr-control-error *clrIfError="'required'">Required</clr-control-error>
    <clr-control-error *clrIfError="'minDate'; error as minDate">
      The date time cannot be earlier than {{ minDate }}
    </clr-control-error>
    <clr-control-error *clrIfError="'maxDate'; error as maxDate">
      The date time cannot be later than {{ maxDate }}
    </clr-control-error>
  </clr-input-container>
</form>

import {dateRangeValidator} from 'ngx-lift';

export class DateRangeValidatorComponent {
  today = new Date();
  fiveDaysLater = new Date(new Date().getTime() + 5 * 24 * 60 * 60 * 1000); // 5 days from now

  minTimestamp = this.today.toISOString().slice(0, 16); // slice to ignore seconds part
  maxTimestamp = this.fiveDaysLater.toISOString().slice(0, 16);

  dateTimeForm = new FormGroup({
    expires: new FormControl<string>('', {
      nonNullable: true,
      validators: [
        Validators.required,
        // If you want to be more accurate, minDate should be new Date() instead of this.today
        dateRangeValidator({minDate: this.today, maxDate: this.fiveDaysLater, compareTime: true}),
      ],
    }),
  });
}
  `);

  dateExample = highlight(`
const validator = dateRangeValidator({
  minDate: '2024-09-01', // or new Date('2024-09-01')
  maxDate: '2024-09-15',
  minInclusive: true,
  maxInclusive: false,
  compareTime: false,
});
  `);

  dateTimeExample = highlight(`
const validator = dateRangeValidator({
  minDate: '2024-09-01T12:00:00Z',
  maxDate: '2024-09-02T12:00:00Z',
  compareTime: true,
});
  `);
}
