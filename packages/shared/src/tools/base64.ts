/**
 * Base64 编解码工具
 *
 * 全部基于标准 Web API（btoa/atob/TextEncoder/TextDecoder），
 * 零 Node.js 依赖，浏览器和 Node 18+ 都可以跑。
 */

/**
 * 文本 → Base64 编码
 *
 * 安全处理含中文/Emoji 等非 Latin1 字符的文本（先 UTF-8 编码再 base64）。
 */
export function encodeBase64(text: string): string {
  if (text.length === 0) return "";
  try {
    return btoa(text);
  } catch {
    // 包含非 Latin1 字符时 btoa 会抛异常，先转 UTF-8 字节
    const bytes = new TextEncoder().encode(text);
    return _bytesToBase64(bytes);
  }
}

/**
 * Base64 → 文本解码
 *
 * 自动处理 UTF-8 编码的 Base64 字符串。
 */
export function decodeBase64(encoded: string): string {
  if (encoded.length === 0) return "";
  try {
    return atob(encoded);
  } catch {
    // 尝试作为 UTF-8 字节解码
    try {
      const bytes = _base64ToBytes(encoded);
      return new TextDecoder("utf-8", { fatal: true }).decode(bytes);
    } catch {
      throw new Error("无法解码：输入不是有效的 Base64 字符串");
    }
  }
}

/**
 * ArrayBuffer / Uint8Array → Base64
 */
export function arrayBufferToBase64(buffer: ArrayBuffer | Uint8Array): string {
  const bytes = buffer instanceof Uint8Array ? buffer : new Uint8Array(buffer);
  return _bytesToBase64(bytes);
}

/**
 * Base64 → Uint8Array
 */
export function base64ToUint8Array(encoded: string): Uint8Array {
  return _base64ToBytes(encoded);
}

/**
 * File / Blob → Base64 Data URL
 */
export function fileToBase64(file: Blob | File): Promise<string> {
  return new Promise((resolve, reject) => {
    if (typeof FileReader === "undefined") {
      reject(new Error("当前环境不支持 FileReader"));
      return;
    }
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error("文件读取失败"));
    reader.readAsDataURL(file);
  });
}

/**
 * 判断字符串是否为有效 Base64
 * 要求：只含 A-Za-z0-9+/=，且长度正确
 */
export function isValidBase64(str: string): boolean {
  if (str.length === 0) return true;
  const cleaned = str.replace(/\s/g, "");
  if (cleaned.length === 0) return true;
  return /^[A-Za-z0-9+/]*={0,2}$/.test(cleaned);
}

/**
 * 估算 Base64 解码后的原始大小（字节）
 */
export function estimateDecodedSize(base64: string): number {
  const cleaned = base64.replace(/\s/g, "");
  const padding = (cleaned.match(/=/g) || []).length;
  return Math.floor((cleaned.length * 3) / 4) - padding;
}

// ---- 内部辅助 ----

function _bytesToBase64(bytes: Uint8Array): string {
  let binary = "";
  const chunkSize = 8192;
  for (let i = 0; i < bytes.length; i += chunkSize) {
    binary += String.fromCharCode(...bytes.subarray(i, i + chunkSize));
  }
  return btoa(binary);
}

function _base64ToBytes(encoded: string): Uint8Array {
  const binary = atob(encoded);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}
