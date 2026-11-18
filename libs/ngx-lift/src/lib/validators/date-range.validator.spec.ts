import {FormControl} from '@angular/forms';

import {dateRangeValidator} from './date-range.validator';

/**
 * Builds midnight of a local calendar day, so expected values do not depend on the runner's
 * timezone the way `new Date('2024-09-01')` does.
 */
const localDay = (year: number, month: number, day: number) => new Date(year, month - 1, day);

describe('dateRangeValidator', () => {
  it('should not throw error when input is empty', () => {
    const control = new FormControl('', dateRangeValidator({}));

    control.updateValueAndValidity();

    expect(control.errors).toBeNull();
  });

  it('should validate date when no range is specified', () => {
    const control = new FormControl(new Date(), dateRangeValidator({}));

    control.updateValueAndValidity();

    expect(control.errors).toBeNull();
  });

  it('should mark date as invalid if it is not a valid date', () => {
    const control = new FormControl('invalid-date', dateRangeValidator({}));

    control.updateValueAndValidity();

    expect(control.errors).toEqual({invalidDate: true});
  });

  it('should validate date within the specified range', () => {
    const control = new FormControl(
      localDay(2024, 9, 7),
      dateRangeValidator({
        minDate: '2024-09-01',
        maxDate: '2024-09-15',
      }),
    );

    control.updateValueAndValidity();

    expect(control.errors).toBeNull();
  });

  it('should fail validation if date is before the minimum date', () => {
    const control = new FormControl(
      localDay(2024, 8, 31),
      dateRangeValidator({
        minDate: '2024-09-01',
        minInclusive: true,
      }),
    );

    control.updateValueAndValidity();

    expect(control.errors).toEqual({
      minDate: localDay(2024, 9, 1).toISOString(),
    });
  });

  it('should pass validation if date is on the minimum date and inclusive is true', () => {
    const control = new FormControl(
      new Date('2024-09-01T12:00:00.000Z'),
      dateRangeValidator({
        minDate: '2024-09-01T13:00:00.000Z',
        minInclusive: true,
      }),
    );

    control.updateValueAndValidity();

    expect(control.errors).toBeNull();
  });

  it('should pass validation if date is on the minimum date and inclusive is false', () => {
    const control = new FormControl(
      new Date('2024-09-01T12:00:00.000Z'),
      dateRangeValidator({
        minDate: '2024-09-01T13:00:00.000Z',
        minInclusive: false,
      }),
    );

    control.updateValueAndValidity();

    expect(control.errors).toEqual({
      minDate: '2024-09-01T13:00:00.000Z',
    });
  });

  it('should fail validation if date is on the minimum date and inclusive is false', () => {
    const control = new FormControl(
      localDay(2024, 9, 1),
      dateRangeValidator({
        minDate: '2024-09-01',
        minInclusive: false,
      }),
    );

    control.updateValueAndValidity();

    expect(control.errors).toEqual({
      minDate: localDay(2024, 9, 1).toISOString(),
    });
  });

  it('should fail validation if date is after the maximum date', () => {
    const control = new FormControl(
      localDay(2024, 9, 2),
      dateRangeValidator({
        maxDate: '2024-09-01',
        maxInclusive: true,
      }),
    );

    control.updateValueAndValidity();

    expect(control.errors).toEqual({
      maxDate: localDay(2024, 9, 1).toISOString(),
    });
  });

  it('should pass validation if date is on the maximum date and inclusive is true', () => {
    const control = new FormControl(
      localDay(2024, 9, 1),
      dateRangeValidator({
        maxDate: '2024-09-01',
        maxInclusive: true,
      }),
    );

    control.updateValueAndValidity();

    expect(control.errors).toBeNull();
  });

  it('should fail validation if date is on the maximum date and inclusive is false', () => {
    const control = new FormControl(
      localDay(2024, 9, 1),
      dateRangeValidator({
        maxDate: '2024-09-01',
        maxInclusive: false,
      }),
    );

    control.updateValueAndValidity();

    expect(control.errors).toEqual({
      maxDate: localDay(2024, 9, 1).toISOString(),
    });
  });

  it('should ignore time parts when compareTime is false', () => {
    const control = new FormControl(
      new Date('2024-09-01T11:59:59Z'),
      dateRangeValidator({
        minDate: '2024-09-01T12:00:00Z',
        maxDate: '2024-09-02T12:00:00Z',
        compareTime: false,
        minInclusive: true,
      }),
    );

    control.updateValueAndValidity();

    expect(control.errors).toBeNull();
  });

  it('should consider time parts when compareTime is true', () => {
    const control = new FormControl(
      new Date('2024-09-01T11:59:59Z'),
      dateRangeValidator({
        minDate: '2024-09-01T12:00:00Z',
        maxDate: '2024-09-02T12:00:00Z',
        compareTime: true,
      }),
    );

    control.updateValueAndValidity();

    expect(control.errors).toEqual({
      minDate: '2024-09-01T12:00:00.000Z',
    });
  });

  it('rejects a previous calendar day even if it is fewer than 24 hours before the inclusive minimum', () => {
    const minimum = new Date(2024, 8, 2, 0, 30);
    const control = new FormControl(
      new Date(2024, 8, 1, 23, 30),
      dateRangeValidator({minDate: minimum, minInclusive: true}),
    );
    expect(control.errors).toEqual({minDate: minimum.toISOString()});
  });

  it('accepts the next calendar day for an exclusive minimum even if fewer than 24 hours elapsed', () => {
    const minimum = new Date(2024, 8, 1, 23, 30);
    const control = new FormControl(new Date(2024, 8, 2, 0, 30), dateRangeValidator({minDate: minimum}));
    expect(control.errors).toBeNull();
  });

  it('rejects the next calendar day after an inclusive maximum', () => {
    const maximum = new Date(2024, 8, 1, 23, 30);
    const control = new FormControl(
      new Date(2024, 8, 2, 0, 30),
      dateRangeValidator({maxDate: maximum, maxInclusive: true}),
    );
    expect(control.errors).toEqual({maxDate: maximum.toISOString()});
  });
});

describe('dateRangeValidator calendar-day values', () => {
  it('reads a date-only control value as the local calendar day it names', () => {
    // `<input type="date">` emits 'YYYY-MM-DD'. Reading it as UTC midnight shifts it to the
    // previous local day west of UTC, which used to reject the current day as too early.
    const minimum = new Date(2026, 10, 18, 9, 30);
    const control = new FormControl('2026-11-18', dateRangeValidator({minDate: minimum, minInclusive: true}));

    expect(control.errors).toBeNull();
  });

  it('reads a date-only boundary as the local calendar day it names', () => {
    const control = new FormControl(
      localDay(2026, 11, 18),
      dateRangeValidator({maxDate: '2026-11-18', maxInclusive: true}),
    );

    expect(control.errors).toBeNull();
  });

  it('reports a date-only boundary as local midnight of the day it names', () => {
    const control = new FormControl('2026-11-01', dateRangeValidator({minDate: '2026-11-18', minInclusive: true}));
    const boundary = new Date((control.errors as {minDate: string}).minDate);

    expect([boundary.getFullYear(), boundary.getMonth(), boundary.getDate(), boundary.getHours()]).toEqual([
      2026, 10, 18, 0,
    ]);
  });

  it('still rejects the day before a date-only minimum', () => {
    const control = new FormControl('2026-11-17', dateRangeValidator({minDate: '2026-11-18', minInclusive: true}));

    expect(control.errors).toEqual({minDate: localDay(2026, 11, 18).toISOString()});
  });

  it('rejects an impossible date-only value instead of rolling it over', () => {
    const control = new FormControl('2026-02-31', dateRangeValidator({}));

    expect(control.errors).toEqual({invalidDate: true});
  });

  it('rejects an impossible date-only boundary', () => {
    expect(() => dateRangeValidator({minDate: '2026-02-31'})).toThrow('minDate');
  });

  it('keeps an exclusive date-only maximum exclusive on the same day', () => {
    const control = new FormControl('2026-11-18', dateRangeValidator({maxDate: '2026-11-18'}));

    expect(control.errors).toEqual({maxDate: localDay(2026, 11, 18).toISOString()});
  });

  it('compares instants when compareTime is true and the boundary is a date-only string', () => {
    // A date-only minimum is local midnight, so a later time on the same day passes.
    const control = new FormControl(
      new Date(2026, 10, 18, 9, 0),
      dateRangeValidator({minDate: '2026-11-18', compareTime: true}),
    );

    expect(control.errors).toBeNull();
  });
});

describe('dateRangeValidator configuration', () => {
  it('accepts null and undefined as unconstrained boundaries', () => {
    const validator = dateRangeValidator({minDate: null, maxDate: undefined});
    const control = new FormControl(new Date(1960, 0, 1));
    expect(validator(control)).toBeNull();
  });
  it('rejects invalid boundaries instead of silently accepting all input', () => {
    expect(() => dateRangeValidator({minDate: 'not-a-date'})).toThrow('minDate');
    expect(() => dateRangeValidator({maxDate: new Date(NaN)})).toThrow('maxDate');
  });
  it('rejects an inverted date range', () => {
    expect(() => dateRangeValidator({minDate: '2027-01-01', maxDate: '2026-01-01'})).toThrow('minDate');
  });
});
