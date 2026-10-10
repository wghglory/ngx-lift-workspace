/**
 * Converts a Kubernetes-style resource quantity string (e.g. `'21402Mi'`, `'100Gi'`, `'1Ti'`, `'500m'`)
 * to a base scalar value in bytes as a `bigint`.
 *
 * Supports both binary SI suffixes (`Ki`, `Mi`, `Gi`, `Ti`, `Pi`, `Ei`) and decimal SI suffixes
 * (`m`, `k`, `M`, `G`, `T`, `P`, `E`).
 *
 * @param quantity The Kubernetes quantity string to parse.
 * @returns The quantity represented as a `bigint` scalar in bytes, or `0n` if empty or invalid.
 *
 * @example
 * ```typescript
 * quantityToScalar('20Gi');    // 21474836480n
 * quantityToScalar('1Ti');     // 1099511627776n
 * quantityToScalar('21402Mi'); // 22441132032n
 * ```
 */
export function quantityToScalar(quantity: string | undefined | null): bigint {
  if (!quantity || typeof quantity !== 'string') {
    return BigInt(0);
  }

  const trimmed = quantity.trim();
  const suffixMatch = trimmed.match(/([a-zA-Z]+)$/);
  const suffix = suffixMatch ? suffixMatch[1] : '';
  const numberStr = suffix ? trimmed.slice(0, -suffix.length) : trimmed;
  const numericValue = parseFloat(numberStr);

  if (isNaN(numericValue)) {
    return BigInt(0);
  }

  switch (suffix) {
    case 'n':
      return BigInt(Math.round(numericValue * 1e-9));
    case 'u':
      return BigInt(Math.round(numericValue * 1e-6));
    case 'm':
      return BigInt(Math.round(numericValue * 1e-3));
    case '':
      return BigInt(Math.round(numericValue));
    case 'k':
      return BigInt(Math.round(numericValue * 1e3));
    case 'M':
      return BigInt(Math.round(numericValue * 1e6));
    case 'G':
      return BigInt(Math.round(numericValue * 1e9));
    case 'T':
      return BigInt(Math.round(numericValue * 1e12));
    case 'P':
      return BigInt(Math.round(numericValue * 1e15));
    case 'E':
      return BigInt(Math.round(numericValue * 1e18));
    case 'Ki':
      return BigInt(Math.round(numericValue * 1024));
    case 'Mi':
      return BigInt(Math.round(numericValue * 1024 ** 2));
    case 'Gi':
      return BigInt(Math.round(numericValue * 1024 ** 3));
    case 'Ti':
      return BigInt(Math.round(numericValue * 1024 ** 4));
    case 'Pi':
      return BigInt(Math.round(numericValue * 1024 ** 5));
    case 'Ei':
      return BigInt(Math.round(numericValue * 1024 ** 6));
    default:
      return BigInt(Math.round(numericValue));
  }
}
