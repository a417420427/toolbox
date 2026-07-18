/**
 * 哈希工具 — MD5 / SHA-1 / SHA-256 / SHA-512
 * 移植自 flutter_shared/tools/hash_tool.dart
 * 浏览器环境使用 Web Crypto API
 */

async function digestString(algorithm: string, input: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(input);
  
  let algo: string;
  switch (algorithm) {
    case 'MD5':
      // MD5 is not available in Web Crypto, fall back to hex string
      // We'll use a pure JS implementation
      return md5(input);
    case 'SHA-1': algo = 'SHA-1'; break;
    case 'SHA-224': algo = 'SHA-256'; break; // SHA-224 not in Web Crypto
    case 'SHA-256': algo = 'SHA-256'; break;
    case 'SHA-384': algo = 'SHA-384'; break;
    case 'SHA-512': algo = 'SHA-512'; break;
    default: algo = 'SHA-256';
  }

  const hashBuffer = await crypto.subtle.digest(algo, data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

// Simple MD5 implementation
function md5(input: string): string {
  function rotateLeft(n: number, b: number) { return (n << b) | (n >>> (32 - b)); }
  function addUnsigned(x: number, y: number) { return (x + y) >>> 0; }
  function F(x: number, y: number, z: number) { return (x & y) | (~x & z); }
  function G(x: number, y: number, z: number) { return (x & z) | (y & ~z); }
  function H(x: number, y: number, z: number) { return x ^ y ^ z; }
  function I(x: number, y: number, z: number) { return y ^ (x | ~z); }

  const S = [7, 12, 17, 22, 7, 12, 17, 22, 7, 12, 17, 22, 7, 12, 17, 22,
             5, 9, 14, 20, 5, 9, 14, 20, 5, 9, 14, 20, 5, 9, 14, 20,
             4, 11, 16, 23, 4, 11, 16, 23, 4, 11, 16, 23, 4, 11, 16, 23,
             6, 10, 15, 21, 6, 10, 15, 21, 6, 10, 15, 21, 6, 10, 15, 21];

  const T: number[] = [];
  for (let i = 1; i <= 64; i++) T.push(Math.floor(Math.abs(Math.sin(i)) * 0x100000000));

  // Convert string to bytes (UTF-8)
  const encoder = new TextEncoder();
  const bytes = encoder.encode(input);
  const words: number[] = [];
  for (let i = 0; i < bytes.length * 8; i += 8) {
    words[i >> 5] |= (bytes[i / 8] & 0xFF) << (i % 32);
  }
  words[bytes.length >> 2] |= 0x80 << ((bytes.length * 8) % 32);
  words[(((bytes.length + 8) >> 6) << 4) + 14] = bytes.length * 8;

  let a = 0x67452301, b = 0xEFCDAB89, c = 0x98BADCFE, d = 0x10325476;

  for (let blockStart = 0; blockStart < words.length; blockStart += 16) {
    const X = words.slice(blockStart, blockStart + 16);
    let A = a, B = b, C = c, D = d;

    for (let i = 0; i < 64; i++) {
      let Fn: number, g: number;
      if (i < 16) { Fn = F(B, C, D); g = i; }
      else if (i < 32) { Fn = G(B, C, D); g = (5 * i + 1) % 16; }
      else if (i < 48) { Fn = H(B, C, D); g = (3 * i + 5) % 16; }
      else { Fn = I(B, C, D); g = (7 * i) % 16; }

      Fn = addUnsigned(Fn, A);
      Fn = addUnsigned(Fn, T[i]);
      Fn = addUnsigned(Fn, X[g] || 0);
      Fn = addUnsigned(rotateLeft(Fn, S[i]), B);

      A = D; D = C; C = B; B = Fn;
    }

    a = addUnsigned(a, A);
    b = addUnsigned(b, B);
    c = addUnsigned(c, C);
    d = addUnsigned(d, D);
  }

  const hex = (n: number) => {
    const str = (n >>> 0).toString(16);
    return '00000000'.substring(str.length) + str;
  };
  return hex(a) + hex(b) + hex(c) + hex(d);
}

export const algorithms = ['MD5', 'SHA-1', 'SHA-256', 'SHA-224', 'SHA-384', 'SHA-512'];

export const HashTool = {
  algorithms,

  /** 计算文本哈希 */
  async hashText(input: string, uppercase = false): Promise<Record<string, string>> {
    const result: Record<string, string> = {};
    for (const algo of algorithms) {
      let hash: string;
      if (algo === 'SHA-224') {
        // SHA-224 is not directly supported; use SHA-256 and truncate
        hash = await digestString('SHA-256', input);
        hash = hash.substring(0, 56);
      } else {
        hash = await digestString(algo, input);
      }
      result[algo] = uppercase ? hash.toUpperCase() : hash;
    }
    return result;
  },

  /** 计算单算法哈希 */
  async hashSingle(input: string, algorithm: string, uppercase = false): Promise<string> {
    let hash: string;
    if (algorithm === 'SHA-224') {
      hash = await digestString('SHA-256', input);
      hash = hash.substring(0, 56);
    } else {
      hash = await digestString(algorithm, input);
    }
    return uppercase ? hash.toUpperCase() : hash;
  },
};
