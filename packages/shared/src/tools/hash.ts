/**
 * 哈希工具
 *
 * 基于 Web Crypto API，支持 MD5 / SHA-1 / SHA-256 / SHA-512 等算法。
 *
 * 注意：MD5 和 SHA-1 在 Web Crypto API 中不直接支持，
 * 此处使用 SubtleCrypto 的标准算法，MD5 用纯 JS 实现。
 * 浏览器环境：可用 SubtleCrypto
 * Node.js 18+：全局 crypto 可用
 */

export type HashAlgorithm =
  | "MD5"
  | "SHA-1"
  | "SHA-256"
  | "SHA-224"
  | "SHA-384"
  | "SHA-512";

export const HASH_ALGORITHMS: HashAlgorithm[] = [
  "MD5",
  "SHA-1",
  "SHA-224",
  "SHA-256",
  "SHA-384",
  "SHA-512",
];

/** 算法的摘要长度（十六进制字符数） */
export const HASH_LENGTH: Record<HashAlgorithm, number> = {
  "MD5": 32,
  "SHA-1": 40,
  "SHA-224": 56,
  "SHA-256": 64,
  "SHA-384": 96,
  "SHA-512": 128,
};

export interface HashResult {
  algorithm: HashAlgorithm;
  hash: string; // 十六进制小写
}

/**
 * 计算文本的哈希值。
 * 注意：大文本会先编码为 UTF-8，超大文本建议使用文件哈希。
 */
export async function hashText(text: string, algorithm: HashAlgorithm): Promise<string> {
  if (text.length === 0) {
    return getEmptyHash(algorithm);
  }

  const encoder = new TextEncoder();
  const data = encoder.encode(text);
  return hashData(data, algorithm);
}

/**
 * 计算 ArrayBuffer / Uint8Array 的哈希值。
 */
export async function hashData(
  data: ArrayBuffer | Uint8Array,
  algorithm: HashAlgorithm
): Promise<string> {
  if (algorithm === "MD5") {
    return md5(new Uint8Array(data));
  }

  const subtleName = algorithm as SubtleCryptoAlgorithm;
  // BufferSource 兼容性处理：Uint8Array.buffer 在 TS 中可能是 SharedArrayBuffer
  const source: BufferSource = data instanceof Uint8Array
    ? (data as unknown as BufferSource)
    : (data as unknown as BufferSource);
  const hashBuffer = await crypto.subtle.digest(subtleName, source);
  return bufferToHex(hashBuffer);
}

type SubtleCryptoAlgorithm = "SHA-1" | "SHA-256" | "SHA-384" | "SHA-512";

/**
 * 批量计算同一段文本的多个哈希算法。
 */
export async function hashTextMulti(
  text: string,
  algorithms: HashAlgorithm[]
): Promise<HashResult[]> {
  const results: HashResult[] = [];
  const encoder = new TextEncoder();
  const data = encoder.encode(text);

  for (const algo of algorithms) {
    const hash = await hashData(data, algo);
    results.push({ algorithm: algo, hash });
  }

  return results;
}

/**
 * 计算大文件的哈希。（Web 环境通过 File API 读取）
 */
export async function hashFile(
  file: Blob,
  algorithm: HashAlgorithm
): Promise<string> {
  const buffer = await file.arrayBuffer();
  return hashData(new Uint8Array(buffer), algorithm);
}

/**
 * 比对两段文本的哈希是否一致。
 */
export async function compareHash(
  textA: string,
  textB: string,
  algorithm: HashAlgorithm = "SHA-256"
): Promise<{ hashA: string; hashB: string; match: boolean }> {
  const [hashA, hashB] = await Promise.all([
    hashText(textA, algorithm),
    hashText(textB, algorithm),
  ]);
  return { hashA, hashB, match: hashA === hashB };
}

// ---- MD5 实现（纯 JS，无外部依赖） ----

function md5(data: Uint8Array | ArrayBuffer): string {
  const bytes = data instanceof Uint8Array ? data : new Uint8Array(data);
  const words = bytesToWords(bytes);
  return md5Core(words, bytes.length * 8);
}

function bytesToWords(bytes: Uint8Array): number[] {
  const words: number[] = [];
  for (let i = 0; i < bytes.length; i++) {
    const idx = i >> 2;
    words[idx] = (words[idx] || 0) + (bytes[i] << ((i % 4) * 8));
  }
  return words;
}

function md5Core(words: number[], len: number): string {
  // padding
  words[len >> 5] = (words[len >> 5] || 0) + 0x80 << ((len % 32) - 8);
  const paddedLen = (((len + 64) >>> 9) << 4) + 14;
  words[paddedLen - 1] = len;

  let a = 0x67452301;
  let b = 0xEFCDAB89;
  let c = 0x98BADCFE;
  let d = 0x10325476;

  const f = (x: number, y: number, z: number) => (x & y) | (~x & z);
  const g = (x: number, y: number, z: number) => (x & z) | (y & ~z);
  const h = (x: number, y: number, z: number) => x ^ y ^ z;
  const i = (x: number, y: number, z: number) => y ^ (x | ~z);

  const rotate = (x: number, n: number) => ((x << n) | (x >>> (32 - n))) >>> 0;

  const ff = (a: number, b: number, c: number, d: number, x: number, s: number, t: number) => {
    a = (a + f(b, c, d) + x + t) >>> 0;
    a = rotate(a, s);
    return (a + b) >>> 0;
  };
  const gg = (a: number, b: number, c: number, d: number, x: number, s: number, t: number) => {
    a = (a + g(b, c, d) + x + t) >>> 0;
    a = rotate(a, s);
    return (a + b) >>> 0;
  };
  const hh = (a: number, b: number, c: number, d: number, x: number, s: number, t: number) => {
    a = (a + h(b, c, d) + x + t) >>> 0;
    a = rotate(a, s);
    return (a + b) >>> 0;
  };
  const ii = (a: number, b: number, c: number, d: number, x: number, s: number, t: number) => {
    a = (a + i(b, c, d) + x + t) >>> 0;
    a = rotate(a, s);
    return (a + b) >>> 0;
  };

  const S: number[] = [7, 12, 17, 22, 5, 9, 14, 20, 4, 11, 16, 23, 6, 10, 15, 21];
  const T: number[] = [];
  for (let i = 0; i < 64; i++) {
    T[i] = Math.floor(Math.abs(Math.sin(i + 1)) * 0x100000000);
  }

  for (let pos = 0; pos < words.length; pos += 16) {
    const X = words.slice(pos, pos + 16);
    let AA = a, BB = b, CC = c, DD = d;

    // Round 1
    let r = 0;
    for (let j = 0; j < 16; j++) {
      const k = j;
      a = ff(a, b, c, d, X[k], S[r % 4], T[r]);
      r++; const t = d; d = c; c = b; b = a; a = t;
    }
    // Round 2
    for (let j = 0; j < 16; j++) {
      const k = (1 + 5 * j) % 16;
      a = gg(a, b, c, d, X[k], S[(r % 4) + 4], T[r]);
      r++; const t = d; d = c; c = b; b = a; a = t;
    }
    // Round 3
    for (let j = 0; j < 16; j++) {
      const k = (5 + 3 * j) % 16;
      a = hh(a, b, c, d, X[k], S[(r % 4) + 8], T[r]);
      r++; const t = d; d = c; c = b; b = a; a = t;
    }
    // Round 4
    for (let j = 0; j < 16; j++) {
      const k = (7 * j) % 16;
      a = ii(a, b, c, d, X[k], S[(r % 4) + 12], T[r]);
      r++; const t = d; d = c; c = b; b = a; a = t;
    }

    a = (a + AA) >>> 0;
    b = (b + BB) >>> 0;
    c = (c + CC) >>> 0;
    d = (d + DD) >>> 0;
  }

  const hToHex = (n: number) => n.toString(16).padStart(8, "0");
  return (
    hToHex(a) +
    hToHex(b) +
    hToHex(c) +
    hToHex(d)
  );
}

// ---- 工具 ----

function bufferToHex(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let hex = "";
  for (const byte of bytes) {
    hex += byte.toString(16).padStart(2, "0");
  }
  return hex;
}

/**
 * 空输入的哈希值缓存（标准值）
 */
const EMPTY_HASHES: Record<string, string> = {};

function getEmptyHash(algorithm: HashAlgorithm): string {
  if (EMPTY_HASHES[algorithm]) return EMPTY_HASHES[algorithm];

  // 已知的空字符串标准哈希值
  // MD5: d41d8cd98f00b204e9800998ecf8427e
  switch (algorithm) {
    case "MD5":
      return "d41d8cd98f00b204e9800998ecf8427e";
    case "SHA-1":
      return "da39a3ee5e6b4b0d3255bfef95601890afd80709";
    default:
      // 其他算法通过 Crypto API 计算
      throw new Error(`空字符串的 ${algorithm} 哈希需要异步计算，请使用 hashText("", "${algorithm}")`);
  }
}
