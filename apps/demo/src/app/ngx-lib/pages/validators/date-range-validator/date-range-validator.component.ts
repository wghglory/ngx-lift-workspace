import {DemoPlaygroundComponent} from '../../../../shared/components/demo-playground/demo-playground.component';
import {formatDate} from '@angular/common';
import {ChangeDetectionStrategy, Component, computed, inject} from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {ClarityModule} from '@clr/angular';
import {CalloutComponent, PageContainerComponent, TranslatePipe, TranslationService} from 'clr-lift';
import {addCalendarDays, dateRangeValidator} from 'ngx-lift';

import {ApiProperty, ApiTableComponent} from '../../../../shared/components/api-table';
import {CodeBlockComponent} from '../../../../shared/components/code-block/code-block.component';
import {highlight} from '../../../../shared/utils/highlight.util';

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
    `import {formatDate} from '@angular/common';
import {ChangeDetectionStrategy, Component} from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {ClarityModule} from '@clr/angular';
import {addCalendarDays, dateRangeValidator} from 'ngx-lift';

@Component({
  selector: 'app-date-example',
  imports: [ClarityModule, ReactiveFormsModule],
  templateUrl: './date-example.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DateExampleComponent {
  today = new Date();

  readonly starterMin = formatDate(addCalendarDays(this.today, 1), 'yyyy-MM-dd', 'en-US');
  readonly starterMax = formatDate(addCalendarDays(this.today, 5), 'yyyy-MM-dd', 'en-US');
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
  readonly today = new Date(Math.floor(Date.now() / 60_000) * 60_000);
  readonly tomorrow = addCalendarDays(this.today, 1);
  readonly fiveDaysLater = addCalendarDays(this.today, 5);

  // `date` and `datetime-local` inputs take local wall-clock values. Deriving them from
  // toISOString() moves the bound to the previous day (or the wrong hour) when the visitor is
  // not on UTC.
  readonly todayDate = formatDate(this.today, 'yyyy-MM-dd', 'en-US');
  readonly tomorrowDate = formatDate(this.tomorrow, 'yyyy-MM-dd', 'en-US');
  readonly fiveDaysLaterDate = formatDate(this.fiveDaysLater, 'yyyy-MM-dd', 'en-US');

  readonly minTimestamp = formatDate(this.today, "yyyy-MM-dd'T'HH:mm", 'en-US');
  readonly maxTimestamp = formatDate(this.fiveDaysLater, "yyyy-MM-dd'T'HH:mm", 'en-US');

  readonly starterMin = this.tomorrowDate;
  readonly starterMax = this.fiveDaysLaterDate;
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
      validators: [dateRangeValidator({minDate: this.todayDate, minInclusive: true})],
    }),
    futureDays: new FormControl<string>('', {
      nonNullable: true,
      validators: [
        Validators.required,
        dateRangeValidator({
          maxDate: this.fiveDaysLaterDate,
          maxInclusive: true,
          minDate: this.tomorrowDate,
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

  readonly dateCode = highlight(`import {formatDate} from '@angular/common';
import {ChangeDetectionStrategy, Component} from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {ClarityModule} from '@clr/angular';
import {addCalendarDays, dateRangeValidator} from 'ngx-lift';

@Component({
  selector: 'app-calendar-dates',
  imports: [ClarityModule, ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: \`
    <form clrForm [formGroup]="dateForm">
      <clr-input-container>
        <label for="date-expires">Optional expiration date</label>
        <input id="date-expires" clrInput type="date" [formControl]="dateForm.controls.expires" [min]="todayDate" />
        <clr-control-error *clrIfError="'minDate'">Choose today or a later date.</clr-control-error>
      </clr-input-container>
      <clr-date-container>
        <label for="date-future-days">Date within the next five days</label>
        <input
          id="date-future-days"
          clrDate
          type="date"
          required
          [formControl]="dateForm.controls.futureDays"
          [min]="tomorrowDate"
          [max]="fiveDaysLaterDate"
        />
        <clr-control-error *clrIfError="'required'">Required</clr-control-error>
        <clr-control-error *clrIfError="'invalidDate'">Enter a valid date.</clr-control-error>
        <clr-control-error *clrIfError="'minDate'">Choose tomorrow or a later date.</clr-control-error>
        <clr-control-error *clrIfError="'maxDate'">Choose a date within five days from today.</clr-control-error>
      </clr-date-container>
      <button type="button" class="btn btn-sm btn-outline" (click)="dateForm.reset()">Clear</button>
      <output aria-live="polite">{{ dateForm.status }}</output>
    </form>
  \`,
})
export class CalendarDatesComponent {
  private readonly today = new Date();
  readonly todayDate = formatDate(this.today, 'yyyy-MM-dd', 'en-US');
  readonly tomorrowDate = formatDate(addCalendarDays(this.today, 1), 'yyyy-MM-dd', 'en-US');
  readonly fiveDaysLaterDate = formatDate(addCalendarDays(this.today, 5), 'yyyy-MM-dd', 'en-US');

  readonly dateForm = new FormGroup({
    expires: new FormControl('', {
      nonNullable: true,
      validators: [dateRangeValidator({minDate: this.todayDate, minInclusive: true})],
    }),
    futureDays: new FormControl('', {
      nonNullable: true,
      validators: [
        Validators.required,
        dateRangeValidator({
          minDate: this.tomorrowDate,
          maxDate: this.fiveDaysLaterDate,
          minInclusive: true,
          maxInclusive: true,
        }),
      ],
    }),
  });
}`);

  readonly dateTimeCode = highlight(`import {formatDate} from '@angular/common';
import {ChangeDetectionStrategy, Component} from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {ClarityModule} from '@clr/angular';
import {addCalendarDays, dateRangeValidator} from 'ngx-lift';

@Component({
  selector: 'app-date-time-range',
  imports: [ClarityModule, ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: \`
    <form clrForm [formGroup]="dateTimeForm">
      <clr-input-container>
        <label for="datetime-expires">Expiration Date</label>
        <input
          id="datetime-expires"
          clrInput
          type="datetime-local"
          required
          [formControl]="dateTimeForm.controls.expires"
          [min]="minTimestamp"
          [max]="maxTimestamp"
        />
        <clr-control-error *clrIfError="'required'">Required</clr-control-error>
        <clr-control-error *clrIfError="'minDate'">Choose a time on or after {{ minTimestamp }}.</clr-control-error>
        <clr-control-error *clrIfError="'maxDate'">Choose a time on or before {{ maxTimestamp }}.</clr-control-error>
      </clr-input-container>
      <button type="button" class="btn btn-sm btn-outline" (click)="dateTimeForm.reset()">Clear</button>
      <output aria-live="polite">{{ dateTimeForm.status }}</output>
    </form>
  \`,
})
export class DateTimeRangeComponent {
  private readonly now = new Date(Math.floor(Date.now() / 60_000) * 60_000);
  private readonly fiveDaysLater = addCalendarDays(this.now, 5);
  readonly minTimestamp = formatDate(this.now, "yyyy-MM-dd'T'HH:mm", 'en-US');
  readonly maxTimestamp = formatDate(this.fiveDaysLater, "yyyy-MM-dd'T'HH:mm", 'en-US');
  readonly dateTimeForm = new FormGroup({
    expires: new FormControl('', {
      nonNullable: true,
      validators: [
        Validators.required,
        dateRangeValidator({
          minDate: this.now,
          maxDate: this.fiveDaysLater,
          minInclusive: true,
          maxInclusive: true,
          compareTime: true,
        }),
      ],
    }),
  });
}`);

  readonly boundaryOptionsCode = highlight(`import {dateRangeValidator} from 'ngx-lift';

// API configurations, independent of the moving-boundary examples above.
// Optional lower bound; compose with Validators.required to require input.
dateRangeValidator({minDate: '2026-01-15', minInclusive: true});
// Optional upper bound; equality is excluded by default.
dateRangeValidator({maxDate: '2026-02-01'});
// Include January 15; exclude February 1.
dateRangeValidator({
  minDate: '2026-01-15',
  maxDate: '2026-02-01',
  minInclusive: true,
  maxInclusive: false,
});
// Compare local wall-clock times, including both endpoints.
dateRangeValidator({
  minDate: '2026-01-15T09:00',
  maxDate: '2026-01-15T17:00',
  minInclusive: true,
  maxInclusive: true,
  compareTime: true,
});
// Compare exact instants using explicit offsets (Z means UTC).
dateRangeValidator({
  minDate: '2026-01-15T09:00:00Z',
  maxDate: '2026-01-15T17:00:00Z',
  compareTime: true,
});
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
