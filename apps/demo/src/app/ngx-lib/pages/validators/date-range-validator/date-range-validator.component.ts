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
      validators: [dateRangeValidator({minDate: this.todayInISO, minInclusive: true})],
    }),
    futureDays: new FormControl<string>('', {
      nonNullable: true,
      validators: [
        Validators.required,
        dateRangeValidator({
          maxDate: this.fiveDaysLaterInISO,
          maxInclusive: true,
          minDate: this.tomorrowInISO,
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

  readonly calendarExampleCode = highlight(`import {FormControl} from '@angular/forms';
import {dateRangeValidator} from 'ngx-lift';

const date = new FormControl('2026-01-15', [dateRangeValidator({minDate: '2026-01-15', minInclusive: true})]);
// Valid: both strings name January 15 in the local calendar.
// new Date('2026-01-15') instead constructs an instant at UTC midnight.`);

  readonly dateCode = highlight(`import {FormControl, FormGroup, Validators} from '@angular/forms';
import {dateRangeValidator} from 'ngx-lift';

// The same moving bounds as the live preview.
function day(offset: number): string {
  const date = new Date();
  date.setDate(date.getDate() + offset);
  return [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, '0'),
    String(date.getDate()).padStart(2, '0'),
  ].join('-');
}
const dateForm = new FormGroup({
  expires: new FormControl('', [dateRangeValidator({minDate: day(0), minInclusive: true})]),
  futureDays: new FormControl('', [
    Validators.required,
    dateRangeValidator({
      minDate: day(1),
      maxDate: day(5),
      minInclusive: true,
      maxInclusive: true,
    }),
  ]),
});

// Independent configurations below use fixed dates.
// Optional, lower bound only. Empty input is valid.
const expires = new FormControl('', [dateRangeValidator({minDate: '2026-01-15', minInclusive: true})]);

// Optional, upper bound only. Equality is excluded by default.
const beforeFebruary = new FormControl('', [dateRangeValidator({maxDate: '2026-02-01'})]);

// Required interval: January 15 is included; February 1 is excluded.
const bookingDate = new FormControl('', [
  Validators.required,
  dateRangeValidator({
    minDate: '2026-01-15',
    maxDate: '2026-02-01',
    minInclusive: true,
    maxInclusive: false,
  }),
]);`);

  readonly dateTimeCode = highlight(`import {FormControl, FormGroup, Validators} from '@angular/forms';
import {dateRangeValidator} from 'ngx-lift';

// The same moving bounds as the live preview.
const now = new Date();
now.setSeconds(0, 0);
const fiveDaysLater = new Date(now);
fiveDaysLater.setDate(fiveDaysLater.getDate() + 5);
const dateTimeForm = new FormGroup({
  expires: new FormControl('', [
    Validators.required,
    dateRangeValidator({
      minDate: now,
      maxDate: fiveDaysLater,
      minInclusive: true,
      maxInclusive: true,
      compareTime: true,
    }),
  ]),
});
// Pair expires with a datetime-local input. Format min/max in local time,
// as in the calendar-date example, adding hours and minutes; not via toISOString().

// Independent configurations below use fixed dates.
// Local wall-clock time: pair with an input of type datetime-local.
const appointment = new FormControl('', [
  Validators.required,
  dateRangeValidator({
    minDate: '2026-01-15T09:00',
    maxDate: '2026-01-15T17:00',
    minInclusive: true,
    maxInclusive: true,
    compareTime: true,
  }),
]);

// Exact instants: use an explicit offset (Z means UTC).
const instant = new FormControl('', [
  dateRangeValidator({
    minDate: '2026-01-15T09:00:00Z',
    maxDate: '2026-01-15T17:00:00Z',
    compareTime: true,
  }),
]);
// Date objects and numeric timestamp control values also represent instants.
// compareTime: false (default) compares their local calendar days instead.`);

  signatureCode = highlight(`interface DateRangeOptions {
  minDate?: Date | string | null;
  maxDate?: Date | string | null;
  minInclusive?: boolean; // false by default
  maxInclusive?: boolean; // false by default
  compareTime?: boolean; // false by default
}

dateRangeValidator(options: DateRangeOptions): ValidatorFn;`);
}
