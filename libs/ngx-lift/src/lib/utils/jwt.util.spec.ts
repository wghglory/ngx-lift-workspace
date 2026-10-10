import {describe, expect, it} from 'vitest';
import {decodeJwtPart, decodeJwtPayload, isJwtExpiredByClaims} from './jwt.util';

describe('jwt.util', () => {
  // Payload: {"sub":"1234567890","name":"John Doe","iat":1516239022,"exp":2500000000}
  const samplePayloadBase64 =
    'eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyLCJleHAiOjI1MDAwMDAwMDB9';
  const sampleToken = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.${samplePayloadBase64}.mockSignature`;

  describe('decodeJwtPart', () => {
    it('should decode a valid base64url part', () => {
      const decoded = decodeJwtPart<{sub: string; name: string}>(samplePayloadBase64);
      expect(decoded).toEqual({
        sub: '1234567890',
        name: 'John Doe',
        iat: 1516239022,
        exp: 2500000000,
      });
    });

    it('should return undefined for invalid or empty inputs', () => {
      expect(decodeJwtPart(null)).toBeUndefined();
      expect(decodeJwtPart(undefined)).toBeUndefined();
      expect(decodeJwtPart('')).toBeUndefined();
      expect(decodeJwtPart('not-valid-base64-json!')).toBeUndefined();
    });
  });

  describe('decodeJwtPayload', () => {
    it('should extract and decode payload from a full token', () => {
      const payload = decodeJwtPayload(sampleToken);
      expect(payload?.sub).toBe('1234567890');
      expect(payload?.exp).toBe(2500000000);
    });

    it('should return undefined for malformed tokens', () => {
      expect(decodeJwtPayload('invalidTokenNoDot')).toBeUndefined();
      expect(decodeJwtPayload(null)).toBeUndefined();
    });
  });

  describe('isJwtExpiredByClaims', () => {
    it('should return false for future expiration', () => {
      const futureEpoch = Math.floor(Date.now() / 1000) + 3600;
      expect(isJwtExpiredByClaims({exp: futureEpoch})).toBe(false);
    });

    it('should return true for past expiration', () => {
      const pastEpoch = Math.floor(Date.now() / 1000) - 3600;
      expect(isJwtExpiredByClaims({exp: pastEpoch})).toBe(true);
    });

    it('should respect offset seconds', () => {
      // Expires in 30 seconds, offset is 60 seconds -> considered expired
      const nearFutureEpoch = Math.floor(Date.now() / 1000) + 30;
      expect(isJwtExpiredByClaims({exp: nearFutureEpoch}, 60)).toBe(true);

      // With 10s offset -> not expired
      expect(isJwtExpiredByClaims({exp: nearFutureEpoch}, 10)).toBe(false);
    });

    it('should return true if claims or exp is missing', () => {
      expect(isJwtExpiredByClaims(null)).toBe(true);
      expect(isJwtExpiredByClaims({})).toBe(true);
    });
  });
});
