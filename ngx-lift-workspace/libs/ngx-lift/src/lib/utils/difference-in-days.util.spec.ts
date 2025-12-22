import {differenceInDays} from './difference-in-days.util';

describe('differenceInDays', () => {
  it('should return the correct number of whole days between two dates', () => {
    const result1 = differenceInDays(new Date('2022-09-08'), new Date('2023-09-18'));
    expect(result1).toBe(-375);

    const result2 = differenceInDays('2022-09-08', '2023-09-18');
    expect(result2).toBe(-375);

    const result3 = differenceInDays('2023-09-18', '2022-09-08');
    expect(result3).toBe(375);

    const result4 = differenceInDays(new Date('2020-01-01'), new Date('2020-01-01'));
    expect(result4).toBe(0);

    const result5 = differenceInDays(Date.now(), new Date('2024-01-01'));
    expect(result5).toBeGreaterThan(0);
  });

  it('should return the difference between two dates with time', () => {
    const result1 = differenceInDays(new Date('2022-09-08'), new Date('2022-09-08T12:00:00'));
    expect(result1).toBe(0);
  });
});
