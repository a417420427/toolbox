/**
 * UUID / NanoID 生成器
 *
 * 所有函数均为纯函数，无副作用，无外部依赖。
 */

/** UUID v4 正则（用于校验） */
export const UUID_V4_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

/** UUID v7 正则 */
export const UUID_V7_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-7[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

const HEX = "0123456789abcdef";

function hexChar(): string {
  return HEX[Math.floor(Math.random() * 16)];
}

function hexN(n: number): string {
  let s = "";
  for (let i = 0; i < n; i++) s += hexChar();
  return s;
}

/**
 * 生成一个 UUID v4。
 * 使用 crypto.randomUUID 优先，降级到 Math.random。
 */
export function generateUuidV4(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  // fallback: xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx
  return (
    hexN(8) +
    "-" +
    hexN(4) +
    "-4" +
    hexN(3) +
    "-" +
    ((Math.floor(Math.random() * 4) + 8).toString(16)) +
    hexN(3) +
    "-" +
    hexN(12)
  );
}

/**
 * 生成一个 UUID v7（按时间排序）。
 * 前 48 位是 Unix 时间戳毫秒，后 74 位随机。
 */
export function generateUuidV7(): string {
  const now = Date.now();
  const hexTime = now.toString(16).padStart(12, "0"); // 12 hex chars = 48 bits
  // variant 10xx
  const variant = "8" + hexChar().slice(0, 1); // 8-b
  const randA = hexN(4); // 16 bits
  // version 0111 = 7
  const randB = "7" + hexN(3); // 16 bits, top 4 = 7
  const randC = variant + hexN(3); // 16 bits
  const randD = hexN(12); // 48 bits
  return `${hexTime.slice(0, 8)}-${hexTime.slice(8)}-${randA}-${randB}-${randC}${randD}`;
}

/**
 * 批量生成 UUID。
 * @param count 生成数量（1-100，超限自动钳制）
 * @param version v4 | v7
 */
export function generateUuids(
  count: number,
  version: "v4" | "v7" = "v4"
): string[] {
  const n = Math.max(1, Math.min(100, Math.round(count)));
  const fn = version === "v7" ? generateUuidV7 : generateUuidV4;
  return Array.from({ length: n }, () => fn());
}

/** UUID 格式选项 */
export interface UuidFormatOptions {
  uppercase?: boolean;
  noHyphens?: boolean;
  wrapped?: boolean; // 带花括号 {uuid}
}

/**
 * 格式化 UUID 字符串。
 */
export function formatUuid(uuid: string, options: UuidFormatOptions = {}): string {
  let result = uuid;

  if (options.noHyphens) {
    result = result.replace(/-/g, "");
  }
  if (options.uppercase) {
    result = result.toUpperCase();
  }
  if (options.wrapped) {
    result = `{${result}}`;
  }

  return result;
}

/** NanoID 默认字符集 */
export const NANOID_ALPHABET = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ_abcdefghijklmnopqrstuvwxyz-";

/**
 * 生成 NanoID。
 * @param length 长度（默认 21）
 * @param alphabet 字符集（默认 URL-safe base64）
 */
export function generateNanoId(length = 21, alphabet = NANOID_ALPHABET): string {
  const len = Math.max(1, Math.min(256, Math.round(length)));
  const bytes = new Uint8Array(len);
  if (typeof crypto !== "undefined" && typeof crypto.getRandomValues === "function") {
    crypto.getRandomValues(bytes);
  } else {
    for (let i = 0; i < len; i++) {
      bytes[i] = Math.floor(Math.random() * 256);
    }
  }
  const mask = (2 << (Math.log(alphabet.length - 1) / Math.LN2)) - 1;
  const step = Math.ceil((1.6 * mask * len) / alphabet.length);
  let id = "";
  for (let i = 0; i < step; i++) {
    const byte = bytes[i % bytes.length];
    const idx = byte & mask;
    if (idx < alphabet.length) {
      id += alphabet[idx];
      if (id.length === len) break;
    }
  }
  // fallback if loop didn't fill
  while (id.length < len) {
    id += alphabet[Math.floor(Math.random() * alphabet.length)];
  }
  return id;
}

/**
 * 校验 UUID 字符串是否合法。
 */
export function isValidUuid(value: string): boolean {
  return UUID_V4_REGEX.test(value) || UUID_V7_REGEX.test(value);
}
