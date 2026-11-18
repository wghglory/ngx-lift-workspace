import {DemoPlaygroundComponent} from '../../../../shared/components/demo-playground/demo-playground.component';
import {ChangeDetectionStrategy, Component, computed, inject} from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {ClarityModule} from '@clr/angular';
import {CalloutComponent, PageContainerComponent, TranslatePipe, TranslationService} from 'clr-lift';
import {dateRangeValidator} from 'ngx-lift';

import {ApiProperty, ApiTableComponent} from '../../../../shared/components/api-table';
import {CodeBlockComponent} from '../../../../shared/components/code-block/code-block.component';
import {highlight} from '../../../../shared/utils/highlight.util';

/** Local `YYYY-MM-DD` for a `date` input; `toISOString()` would report the UTC day. */
function toDateInputValue(date: Date): string {
  return [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, '0'),
    String(date.getDate()).padStart(2, '0'),
  ].join('-');
}

/** Local `YYYY-MM-DDTHH:mm` for a `datetime-local` input. */
function toDateTimeInputValue(date: Date): string {
  const time = [date.getHours(), date.getMinutes()].map((part) => String(part).padStart(2, '0')).join(':');
  return `${toDateInputValue(date)}T${time}`;
}

/** Calendar-day arithmetic in the local timezone; adding 86_400_000 ms skips or repeats a day. */
function addLocalDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

function startOfMinute(date: Date): Date {
  const result = new Date(date);
  result.setSeconds(0, 0);
  return result;
}

@Component({
  selector: 'app-date-range-validator',
  imports: [
    DemoPlaygroundComponent,
    ClarityModule,
    ReactiveFormsModule,
    PageContainerComponent,
    CalloutComponent,
    CodeBlockComponent,
    TranslatePipe,
    ApiTableComponent,
  ],
  templateUrl: './date-range-validator.component.html',
  styleUrl: './date-range-validator.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DateRangeValidatorComponent {
  readonly firstTaskCode = highlight(
    `import {ChangeDetectionStrategy, Component} from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {ClarityModule} from '@clr/angular';
import {dateRangeValidator} from 'ngx-lift';

@Component({
  selector: 'app-date-example',
  imports: [ClarityModule, ReactiveFormsModule],
  templateUrl: './date-example.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DateExampleComponent {
  today = new Date();

  readonly starterMin = this.dateInput(1);
  readonly starterMax = this.dateInput(5);
  private dateInput(offset: number): string {
    const date = new Date(this.today);
    date.setDate(date.getDate() + offset);
    return [
      date.getFullYear(),
      String(date.getMonth() + 1).padStart(2, '0'),
      String(date.getDate()).padStart(2, '0'),
    ].join('-');
  }
  readonly starterForm = new FormGroup({
    date: new FormControl('', {
      nonNullable: true,
      validators: [
        Validators.required,
        dateRangeValidator({
          minDate: this.starterMin,
          maxDate: this.starterMax,
          minInclusive: true,
          maxInclusive: true,
        }),
      ],
    }),
  });
}
// Native date inputs emit YYYY-MM-DD strings. Use the same strings for bounds.
// Build the displayed dates in the local calendar; do not derive them via UTC toISOString().`,
  );
  readonly firstTaskHtml = highlight(
    `<form clrForm [formGroup]="starterForm">
  <clr-input-container>
    <label for="date-starter-date">Date</label>
    <input
      id="date-starter-date"
      type="date"
      clrInput
      [formControl]="starterForm.controls.date"
      [min]="starterMin"
      [max]="starterMax"
    />
    <clr-control-error *clrIfError="'required'">Required</clr-control-error>
    <clr-control-error *clrIfError="'minDate'">Choose a date on or after the minimum.</clr-control-error>
    <clr-control-error *clrIfError="'maxDate'">Choose a date on or before the maximum.</clr-control-error>
  </clr-input-container>
  <button type="button" class="btn btn-sm btn-outline" (click)="starterForm.reset()">Clear</button>
  <output aria-live="polite">{{ starterForm.status }}</output>
</form>`,
  );
  private translationService = inject(TranslationService);

  optionsProperties = computed<ApiProperty[]>(() => {
    this.translationService.currentLanguage();
    return [
      {
        name: 'minDate',
        type: 'Date | string | null',
        description: this.translationService.translate('dateRangeValidator.optMinDate'),
      },
      {
        name: 'maxDate',
        type: 'Date | string | null',
        description: this.translationService.translate('dateRangeValidator.optMaxDate'),
      },
      {
        name: 'minInclusive',
        type: 'boolean',
        default: 'false',
        description: this.translationService.translate('dateRangeValidator.optMinInclusive'),
      },
      {
        name: 'maxInclusive',
        type: 'boolean',
        default: 'false',
        description: this.translationService.translate('dateRangeValidator.optMaxInclusive'),
      },
      {
        name: 'compareTime',
        type: 'boolean',
        default: 'false',
        description: this.translationService.translate('demoApi.date-range-validator.optionsProperties.compareTime'),
      },
    ];
  });
  // Seconds are dropped so the `datetime-local` hints name exactly the instants the validator
  // compares; `date` inputs ignore the time part.
  readonly today = startOfMinute(new Date());
  readonly tomorrow = addLocalDays(this.today, 1);
  readonly fiveDaysLater = addLocalDays(this.today, 5);

  // `date` and `datetime-local` inputs take local wall-clock values. Deriving them from
  // toISOString() moves the bound to the previous day (or the wrong hour) when the visitor is
  // not on UTC.
  readonly todayInISO = toDateInputValue(this.today);
  readonly tomorrowInISO = toDateInputValue(this.tomorrow);
  readonly fiveDaysLaterInISO = toDateInputValue(this.fiveDaysLater);

  readonly minTimestamp = toDateTimeInputValue(this.today);
  readonly maxTimestamp = toDateTimeInputValue(this.fiveDaysLater);

  readonly starterMin = this.tomorrowInISO;
  readonly starterMax = this.fiveDaysLaterInISO;
  readonly starterForm = new FormGroup({
    date: new FormControl('', {
      nonNullable: true,
      validators: [
        Validators.required,
        dateRangeValidator({
          minDate: this.starterMin,
          maxDate: this.starterMax,
          minInclusive: true,
          maxInclusive: true,
        }),
      ],
    }),
  });

  dateForm = new FormGroup({
    expires: new FormControl<string>('', {
      nonNullable: true,
      validators: [dateRangeValidator({minDate: this.today, minInclusive: true})],
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
        // The `min`/`max` attributes are inclusive, so the validator must be too.
        dateRangeValidator({
          minDate: this.today,
          maxDate: this.fiveDaysLater,
          compareTime: true,
          minInclusive: true,
          maxInclusive: true,
        }),
      ],
    }),
  });

  dateCode = highlight(`import {dateRangeValidator} from 'ngx-lift';
import {Component} from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';

@Component({
  imports: [ReactiveFormsModule],
  template: \`
    <form [formGroup]="dateForm">
      <clr-input-container>
        <label>Expiration Date</label>
        <input type="date" clrInput [formControl]="dateForm.controls.expires" [min]="todayInISO" />
        <clr-control-error *clrIfError="'minDate'; error as minDate">
          The date cannot be earlier than {{ minDate }}
        </clr-control-error>
      </clr-input-container>

      <clr-date-container>
        <label class="clr-required-mark">Future 5 Days</label>
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
        <clr-control-error *clrIfError="'maxDate'; error as maxDate">
          The date cannot be later than {{ maxDate }}
        </clr-control-error>
        <clr-control-error *clrIfError="'minDate'; error as minDate">
          The date cannot be earlier than {{ minDate }}
        </clr-control-error>
      </clr-date-container>
    </form>
  \`,
})
export class DateRangeValidatorComponent {
  private addLocalDays(date: Date, days: number): Date {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  }
  // Native date inputs take a local wall-clock date; toISOString() would report the UTC day.
  private toDateInputValue(date: Date): string {
    return [
      date.getFullYear(),
      String(date.getMonth() + 1).padStart(2, '0'),
      String(date.getDate()).padStart(2, '0'),
    ].join('-');
  }

  today = new Date();
  tomorrow = this.addLocalDays(this.today, 1);
  fiveDaysLater = this.addLocalDays(this.today, 5);

  todayInISO = this.toDateInputValue(this.today);
  tomorrowInISO = this.toDateInputValue(this.tomorrow);
  fiveDaysLaterInISO = this.toDateInputValue(this.fiveDaysLater);

  dateForm = new FormGroup({
    expires: new FormControl<string>('', {
      nonNullable: true,
      validators: [dateRangeValidator({minDate: this.today, minInclusive: true})],
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
}`);

  dateTimeCode = highlight(`import {dateRangeValidator} from 'ngx-lift';
import {Component} from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';

@Component({
  imports: [ReactiveFormsModule],
  template: \`
    <form [formGroup]="dateTimeForm">
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
  \`,
})
export class DateTimeRangeValidatorComponent {
  private addLocalDays(date: Date, days: number): Date {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  }
  // datetime-local takes local wall-clock values, so format the Date in local time.
  private toDateTimeInputValue(date: Date): string {
    const day = [
      date.getFullYear(),
      String(date.getMonth() + 1).padStart(2, '0'),
      String(date.getDate()).padStart(2, '0'),
    ].join('-');
    const time = [date.getHours(), date.getMinutes()].map((part) => String(part).padStart(2, '0')).join(':');
    return \`\${day}T\${time}\`;
  }

  // Truncate first so both hints name exactly the instants the validator compares.
  today = this.startOfMinute(new Date());
  fiveDaysLater = this.addLocalDays(this.today, 5);

  minTimestamp = this.toDateTimeInputValue(this.today);
  maxTimestamp = this.toDateTimeInputValue(this.fiveDaysLater);

  dateTimeForm = new FormGroup({
    expires: new FormControl<string>('', {
      nonNullable: true,
      validators: [
        Validators.required,
        // The min/max attributes are inclusive, so the validator is too.
        dateRangeValidator({
          minDate: this.today,
          maxDate: this.fiveDaysLater,
          compareTime: true,
          minInclusive: true,
          maxInclusive: true,
        }),
      ],
    }),
  });

  private startOfMinute(date: Date): Date {
    const result = new Date(date);
    result.setSeconds(0, 0);
    return result;
  }
}`);

  dateExampleCode = highlight(`
import {dateRangeValidator} from 'ngx-lift';
import {Component} from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule} from '@angular/forms';

@Component({
  imports: [ReactiveFormsModule],
})
export class DateRangeExampleComponent {
  // Date-only boundaries name a local calendar day; use a full ISO string for an exact instant.
  validator = dateRangeValidator({
    minDate: '2024-09-01',
    maxDate: '2024-09-15',
    minInclusive: true,
    maxInclusive: false,
    compareTime: false,
  });

  form = new FormGroup({
    date: new FormControl('', [this.validator]),
  });
}
  `);

  dateTimeExampleCode = highlight(`
import {dateRangeValidator} from 'ngx-lift';
import {Component} from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule} from '@angular/forms';

@Component({
  imports: [ReactiveFormsModule],
})
export class DateTimeRangeExampleComponent {
  validator = dateRangeValidator({
    minDate: '2024-09-01T12:00:00Z',
    maxDate: '2024-09-02T12:00:00Z',
    compareTime: true,
  });

  form = new FormGroup({
    dateTime: new FormControl('', [this.validator]),
  });
}
  `);

  signatureCode = highlight(`interface DateRangeOptions {
  minDate?: Date | string | null;
  maxDate?: Date | string | null;
  minInclusive?: boolean;
  maxInclusive?: boolean;
  compareTime?: boolean;
}

dateRangeValidator(options: DateRangeOptions): ValidatorFn;`);
}
