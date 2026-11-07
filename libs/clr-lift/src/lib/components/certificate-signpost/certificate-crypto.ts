/**
 * Synchronous MD5 and SHA-1 digests over raw bytes.
 *
 * These replace the node-forge dependency for certificate fingerprints. Both produce uppercase
 * hexadecimal strings over the DER byte content, matching the previous node-forge output so the
 * existing fingerprint regression values stay valid.
 */

const MD5_S = [
  7, 12, 17, 22, 7, 12, 17, 22, 7, 12, 17, 22, 7, 12, 17, 22, 5, 9, 14, 20, 5, 9, 14, 20, 5, 9, 14, 20, 5, 9, 14, 20, 4,
  11, 16, 23, 4, 11, 16, 23, 4, 11, 16, 23, 4, 11, 16, 23, 6, 10, 15, 21, 6, 10, 15, 21, 6, 10, 15, 21, 6, 10, 15, 21,
];

const MD5_K = (() => {
  const table = new Uint32Array(64);
  for (let i = 0; i < 64; i++) {
    table[i] = Math.floor(Math.abs(Math.sin(i + 1)) * 4294967296) >>> 0;
  }
  return table;
})();

function rotl32(value: number, count: number): number {
  return ((value << count) | (value >>> (32 - count))) >>> 0;
}

function rotr32(value: number, count: number): number {
  return ((value >>> count) | (value << (32 - count))) >>> 0;
}

/** Pads the input to a multiple of 64 bytes with the 0x80 terminator and zero fill. */
function padToBlock(input: Uint8Array): number[] {
  const message = Array.from(input);
  message.push(0x80);
  while (message.length % 64 !== 56) {
    message.push(0);
  }
  return message;
}

/** Returns the 64-bit message bit length as [low, high] 32-bit words. */
function bitLengthWords(input: Uint8Array): [number, number] {
  const bitLength = input.length * 8;
  return [bitLength >>> 0, Math.floor(bitLength / 4294967296) >>> 0];
}

function toHexLittleEndian(word: number): string {
  let result = '';
  for (let i = 0; i < 4; i++) {
    result += ((word >>> (8 * i)) & 0xff).toString(16).padStart(2, '0');
  }
  return result;
}

/** Computes the MD5 digest of the given bytes and returns it as an uppercase hexadecimal string. */
export function md5(input: Uint8Array): string {
  const message = padToBlock(input);
  const [bitLengthLow, bitLengthHigh] = bitLengthWords(input);
  for (let i = 0; i < 4; i++) {
    message.push((bitLengthLow >>> (8 * i)) & 0xff);
  }
  for (let i = 0; i < 4; i++) {
    message.push((bitLengthHigh >>> (8 * i)) & 0xff);
  }

  let a = 0x67452301;
  let b = 0xefcdab89;
  let c = 0x98badcfe;
  let d = 0x10325476;

  for (let block = 0; block < message.length; block += 64) {
    const m = new Uint32Array(16);
    for (let j = 0; j < 16; j++) {
      const offset = block + j * 4;
      m[j] =
        (message[offset] | (message[offset + 1] << 8) | (message[offset + 2] << 16) | (message[offset + 3] << 24)) >>>
        0;
    }

    let a1 = a;
    let b1 = b;
    let c1 = c;
    let d1 = d;

    for (let k = 0; k < 64; k++) {
      let f: number;
      let g: number;
      if (k < 16) {
        f = ((b1 & c1) | ((~b1 >>> 0) & d1)) >>> 0;
        g = k;
      } else if (k < 32) {
        f = ((d1 & b1) | ((~d1 >>> 0) & c1)) >>> 0;
        g = (5 * k + 1) % 16;
      } else if (k < 48) {
        f = (b1 ^ c1 ^ d1) >>> 0;
        g = (3 * k + 5) % 16;
      } else {
        f = (c1 ^ (b1 | (~d1 >>> 0))) >>> 0;
        g = (7 * k) % 16;
      }
      const temp = (rotl32((a1 + f + MD5_K[k] + m[g]) >>> 0, MD5_S[k]) + b1) >>> 0;
      a1 = d1;
      d1 = c1;
      c1 = b1;
      b1 = temp;
    }

    a = (a + a1) >>> 0;
    b = (b + b1) >>> 0;
    c = (c + c1) >>> 0;
    d = (d + d1) >>> 0;
  }

  return [a, b, c, d].map(toHexLittleEndian).join('').toUpperCase();
}

/** Computes the SHA-1 digest of the given bytes and returns it as an uppercase hexadecimal string. */
export function sha1(input: Uint8Array): string {
  const message = padToBlock(input);
  const [bitLengthLow, bitLengthHigh] = bitLengthWords(input);
  for (let i = 0; i < 4; i++) {
    message.push((bitLengthHigh >>> (8 * (3 - i))) & 0xff);
  }
  for (let i = 0; i < 4; i++) {
    message.push((bitLengthLow >>> (8 * (3 - i))) & 0xff);
  }

  const h = [0x67452301, 0xefcdab89, 0x98badcfe, 0x10325476, 0xc3d2e1f0];
  const w = new Uint32Array(80);

  for (let block = 0; block < message.length; block += 64) {
    for (let j = 0; j < 16; j++) {
      const offset = block + j * 4;
      w[j] =
        ((message[offset] << 24) | (message[offset + 1] << 16) | (message[offset + 2] << 8) | message[offset + 3]) >>>
        0;
    }
    for (let j = 16; j < 80; j++) {
      w[j] = rotl32(w[j - 3] ^ w[j - 8] ^ w[j - 14] ^ w[j - 16], 1);
    }

    let a = h[0];
    let b = h[1];
    let c = h[2];
    let d = h[3];
    let e = h[4];

    for (let j = 0; j < 80; j++) {
      let f: number;
      let k: number;
      if (j < 20) {
        f = ((b & c) | ((~b >>> 0) & d)) >>> 0;
        k = 0x5a827999;
      } else if (j < 40) {
        f = (b ^ c ^ d) >>> 0;
        k = 0x6ed9eba1;
      } else if (j < 60) {
        f = ((b & c) | (b & d) | (c & d)) >>> 0;
        k = 0x8f1bbcdc;
      } else {
        f = (b ^ c ^ d) >>> 0;
        k = 0xca62c1d6;
      }
      const temp = (rotl32(a, 5) + f + e + k + w[j]) >>> 0;
      e = d;
      d = c;
      c = rotl32(b, 30);
      b = a;
      a = temp;
    }

    h[0] = (h[0] + a) >>> 0;
    h[1] = (h[1] + b) >>> 0;
    h[2] = (h[2] + c) >>> 0;
    h[3] = (h[3] + d) >>> 0;
    h[4] = (h[4] + e) >>> 0;
  }

  return h
    .map((word) => (word >>> 0).toString(16).padStart(8, '0'))
    .join('')
    .toUpperCase();
}

const SHA256_K = [
  0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5, 0xd807aa98,
  0x12835b01, 0x243185be, 0x550c7dc3, 0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174, 0xe49b69c1, 0xefbe4786,
  0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da, 0x983e5152, 0xa831c66d, 0xb00327c8,
  0xbf597fc7, 0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967, 0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13,
  0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85, 0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3, 0xd192e819,
  0xd6990624, 0xf40e3585, 0x106aa070, 0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a,
  0x5b9cca4f, 0x682e6ff3, 0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208, 0x90befffa, 0xa4506ceb, 0xbef9a3f7,
  0xc67178f2,
];

/** Computes the SHA-256 digest of the given bytes and returns it as an uppercase hexadecimal string. */
export function sha256(input: Uint8Array): string {
  const message = padToBlock(input);
  const [bitLengthLow, bitLengthHigh] = bitLengthWords(input);
  for (let i = 0; i < 4; i++) {
    message.push((bitLengthHigh >>> (8 * (3 - i))) & 0xff);
  }
  for (let i = 0; i < 4; i++) {
    message.push((bitLengthLow >>> (8 * (3 - i))) & 0xff);
  }

  const h = [0x6a09e667, 0xbb67ae85, 0x3c6ef372, 0xa54ff53a, 0x510e527f, 0x9b05688c, 0x1f83d9ab, 0x5be0cd19];
  const w = new Uint32Array(64);

  for (let block = 0; block < message.length; block += 64) {
    for (let j = 0; j < 16; j++) {
      const offset = block + j * 4;
      w[j] =
        ((message[offset] << 24) | (message[offset + 1] << 16) | (message[offset + 2] << 8) | message[offset + 3]) >>>
        0;
    }
    for (let j = 16; j < 64; j++) {
      const s0 = rotr32(w[j - 15], 7) ^ rotr32(w[j - 15], 18) ^ (w[j - 15] >>> 3);
      const s1 = rotr32(w[j - 2], 17) ^ rotr32(w[j - 2], 19) ^ (w[j - 2] >>> 10);
      w[j] = (w[j - 16] + s0 + w[j - 7] + s1) >>> 0;
    }

    let a = h[0];
    let b = h[1];
    let c = h[2];
    let d = h[3];
    let e = h[4];
    let f = h[5];
    let g = h[6];
    let hh = h[7];

    for (let j = 0; j < 64; j++) {
      const bigS1 = rotr32(e, 6) ^ rotr32(e, 11) ^ rotr32(e, 25);
      const ch = ((e & f) ^ (~e & g)) >>> 0;
      const temp1 = (hh + bigS1 + ch + SHA256_K[j] + w[j]) >>> 0;
      const bigS0 = rotr32(a, 2) ^ rotr32(a, 13) ^ rotr32(a, 22);
      const maj = ((a & b) ^ (a & c) ^ (b & c)) >>> 0;
      const temp2 = (bigS0 + maj) >>> 0;

      hh = g;
      g = f;
      f = e;
      e = (d + temp1) >>> 0;
      d = c;
      c = b;
      b = a;
      a = (temp1 + temp2) >>> 0;
    }

    h[0] = (h[0] + a) >>> 0;
    h[1] = (h[1] + b) >>> 0;
    h[2] = (h[2] + c) >>> 0;
    h[3] = (h[3] + d) >>> 0;
    h[4] = (h[4] + e) >>> 0;
    h[5] = (h[5] + f) >>> 0;
    h[6] = (h[6] + g) >>> 0;
    h[7] = (h[7] + hh) >>> 0;
  }

  return h
    .map((word) => (word >>> 0).toString(16).padStart(8, '0'))
    .join('')
    .toUpperCase();
}
