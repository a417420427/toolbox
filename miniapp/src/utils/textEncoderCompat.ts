/**
 * TextEncoder / TextDecoder 兼容层
 *
 * 微信/头条等小程序的部分旧基础库没有 TextEncoder/TextDecoder。
 * 这里提供一个纯 JS 实现作为 fallback。
 *
 * 用法：
 *   import { createEncoder, createDecoder } from '@/utils/textEncoderCompat'
 *   const encoder = createEncoder()
 *   const decoder = createDecoder()
 */

// ── UTF-8 编码（string → Uint8Array）──
function utf8Encode(str: string): Uint8Array {
  const points: number[] = []
  for (let i = 0; i < str.length; i++) {
    let code = str.charCodeAt(i)
    if (code < 0x80) {
      points.push(code)
    } else if (code < 0x800) {
      points.push(0xc0 | (code >> 6), 0x80 | (code & 0x3f))
    } else if (code < 0xd800 || code > 0xdfff) {
      points.push(0xe0 | (code >> 12), 0x80 | ((code >> 6) & 0x3f), 0x80 | (code & 0x3f))
    } else {
      // surrogate pair
      i++
      const next = str.charCodeAt(i)
      code = 0x10000 + ((code - 0xd800) << 10) + (next - 0xdc00)
      points.push(
        0xf0 | (code >> 18),
        0x80 | ((code >> 12) & 0x3f),
        0x80 | ((code >> 6) & 0x3f),
        0x80 | (code & 0x3f),
      )
    }
  }
  return new Uint8Array(points)
}

// ── UTF-8 解码（Uint8Array → string）──
function utf8Decode(bytes: Uint8Array): string {
  const out: string[] = []
  let i = 0
  while (i < bytes.length) {
    const b = bytes[i]
    if (b < 0x80) {
      out.push(String.fromCharCode(b))
      i++
    } else if (b < 0xe0) {
      out.push(String.fromCharCode(((b & 0x1f) << 6) | (bytes[i + 1] & 0x3f)))
      i += 2
    } else if (b < 0xf0) {
      const c = ((b & 0x0f) << 12) | ((bytes[i + 1] & 0x3f) << 6) | (bytes[i + 2] & 0x3f)
      out.push(String.fromCharCode(c))
      i += 3
    } else {
      const cp = ((b & 0x07) << 18) | ((bytes[i + 1] & 0x3f) << 12) | ((bytes[i + 2] & 0x3f) << 6) | (bytes[i + 3] & 0x3f)
      out.push(String.fromCharCode((cp >> 10) + 0xd800, ((cp & 0x3ff) + 0xdc00)))
      i += 4
    }
  }
  return out.join('')
}

// ── 兼容 TextEncoder 对象 ──
function makeTextEncoder(): TextEncoder {
  return {
    encoding: 'utf-8',
    encode(input: string): Uint8Array {
      return utf8Encode(input)
    },
    encodeInto(input: string, dest: Uint8Array): TextEncoderEncodeIntoResult {
      const bytes = utf8Encode(input)
      const written = Math.min(bytes.length, dest.length)
      dest.set(bytes.subarray(0, written))
      return { read: input.length, written }
    },
  } as unknown as TextEncoder
}

// ── 兼容 TextDecoder 对象 ──
function makeTextDecoder(): TextDecoder {
  return {
    encoding: 'utf-8',
    fatal: false,
    ignoreBOM: false,
    decode(input?: AllowSharedBufferSource, options?: TextDecodeOptions): string {
      if (!input) return ''
      const bytes = input instanceof ArrayBuffer
        ? new Uint8Array(input)
        : input instanceof Uint8Array
          ? input
          : new Uint8Array((input as any).buffer || input)
      return utf8Decode(bytes)
    },
  } as unknown as TextDecoder
}

type EncoderFactory = () => TextEncoder
type DecoderFactory = () => TextDecoder

// ── 导出工厂函数 ──

/** 获取 TextEncoder（优先用原生，不存在则 polyfill） */
export const createEncoder: EncoderFactory = (): TextEncoder => {
  if (typeof TextEncoder !== 'undefined') {
    return new TextEncoder()
  }
  return makeTextEncoder()
}

/** 获取 TextDecoder（优先用原生，不存在则 polyfill） */
export const createDecoder: DecoderFactory = (): TextDecoder => {
  if (typeof TextDecoder !== 'undefined') {
    return new TextDecoder()
  }
  return makeTextDecoder()
}

// ── 快捷函数（免创建 encoder 实例）──
/** UTF-8 编码（string → Uint8Array） */
export function encodeUtf8(str: string): Uint8Array {
  if (typeof TextEncoder !== 'undefined') {
    return new TextEncoder().encode(str)
  }
  return utf8Encode(str)
}

/** UTF-8 解码（Uint8Array → string） */
export function decodeUtf8(bytes: Uint8Array): string {
  if (typeof TextDecoder !== 'undefined') {
    return new TextDecoder().decode(bytes)
  }
  return utf8Decode(bytes)
}
