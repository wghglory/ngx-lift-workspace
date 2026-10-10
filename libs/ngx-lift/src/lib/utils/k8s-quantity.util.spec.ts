import {describe, expect, it} from 'vitest';
import {quantityToScalar} from './k8s-quantity.util';

describe('k8s-quantity.util', () => {
  it('should parse binary SI units accurately', () => {
    expect(quantityToScalar('1Ki')).toBe(1024n);
    expect(quantityToScalar('2Mi')).toBe(2n * 1024n * 1024n);
    expect(quantityToScalar('1Gi')).toBe(1073741824n);
    expect(quantityToScalar('1Ti')).toBe(1099511627776n);
  });

  it('should parse decimal SI units accurately', () => {
    expect(quantityToScalar('1k')).toBe(1000n);
    expect(quantityToScalar('1M')).toBe(1000000n);
    expect(quantityToScalar('1G')).toBe(1000000000n);
  });

  it('should handle fractional quantities', () => {
    expect(quantityToScalar('1.5Gi')).toBe(1610612736n);
  });

  it('should handle raw integer strings without unit', () => {
    expect(quantityToScalar('5000')).toBe(5000n);
  });

  it('should return 0n for invalid or empty inputs', () => {
    expect(quantityToScalar(null)).toBe(0n);
    expect(quantityToScalar(undefined)).toBe(0n);
    expect(quantityToScalar('')).toBe(0n);
    expect(quantityToScalar('invalid')).toBe(0n);
  });
});
