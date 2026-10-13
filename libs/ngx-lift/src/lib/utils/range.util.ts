/**
 * Creates an array of numbers (positive and/or negative) progressing from start up to, but not including, end.
 * A step of -1 is used if a negative start is specified without an end or step.
 * If end is not specified, it's set to start with start then set to 0.
 *
 * @param {number} start The start of the range.
 * @param {number} end The end of the range.
 * @param {number} step The value to increment or decrement by.
 * @param {boolean} [fromRight] Specify iterating from right to left.
 * @throws RangeError for non-finite arguments or more than 1,000,000 output elements.
 * A zero step repeats the start value for compatibility.
 * @returns {Array} Returns the range of numbers.
 */
export function range(start: number, end?: number | undefined, step?: number | undefined, fromRight = false) {
  if (![start, end ?? start, step ?? 1].every(Number.isFinite)) {
    throw new RangeError('range requires finite start, end, and step values.');
  }
  // if range takes only 1 input, that input is end, start with 0
  if (end === undefined) {
    end = start;
    start = 0;
  }

  step = step === undefined ? (start < end ? 1 : -1) : step;

  let index = -1;
  let length = Math.max(Math.ceil((end - start) / (step || 1)), 0);
  if (!Number.isFinite(length) || length > 1_000_000) {
    throw new RangeError('range cannot allocate more than 1,000,000 elements.');
  }
  const result = new Array(length);

  while (length--) {
    result[fromRight ? length : ++index] = start;
    start += step;
  }
  return result;
}
