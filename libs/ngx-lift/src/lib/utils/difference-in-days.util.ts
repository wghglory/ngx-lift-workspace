/**
 * Calculates the difference in whole days between two dates.
 *
 * @param {Date | number | string} dateLeft - The date from which the difference is measured (the reference date).
 *   Can be a Date object, a number representing milliseconds since the Unix epoch,
 *   or a string in a format parseable by the Date constructor.
 * @param {Date | number | string} dateRight - The date to be compared against the reference date.
 *   Can be a Date object, a number representing milliseconds since the Unix epoch,
 *   or a string in a format parseable by the Date constructor.
 * @returns {number} The number of whole days between the reference date (dateLeft) and the compared date (dateRight).
 *
 * @example
 * // How many whole days are between '2022-09-08' and '2023-09-18'?
 * const result = differenceInDays('2022-09-08', new Date('2023-09-18'));
 *
 * The result is 0 if the diff is within a full day
 * const result = differenceInDays('2022-09-08T00:00:00', new Date('2023-09-08T14:00:00'));
 */
export function differenceInDays(dateLeft: Date | number | string, dateRight: Date | number | string) {
  const _dateLeft = new Date(dateLeft);
  const _dateRight = new Date(dateRight);

  const difference = (_dateLeft.getTime() - _dateRight.getTime()) / (1000 * 60 * 60 * 24);

  return Math.trunc(difference);
}
