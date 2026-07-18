/**
 * UUID / NanoID 生成工具
 * 移植自 flutter_shared/tools/uuid_tool.dart
 */

function hex(bytes: number[], start: number, length: number): string {
  let result = '';
  for (let i = start; i < start + length; i++) {
    result += bytes[i].toString(16).padStart(2, '0');
  }
  return result;
}

export const UuidTool = {
  /** 生成 UUID v4 */
  uuidV4(): string {
    const bytes = new Uint8Array(16);
    crypto.getRandomValues(bytes);
    // 版本位 (4)
    bytes[6] = (bytes[6] & 0x0F) | 0x40;
    // 变体位
    bytes[8] = (bytes[8] & 0x3F) | 0x80;
    const b = Array.from(bytes);
    return `${hex(b, 0, 4)}-${hex(b, 4, 2)}-${hex(b, 6, 2)}-${hex(b, 8, 2)}-${hex(b, 10, 6)}`;
  },

  /** 生成 UUID v7 (按时间排序) */
  uuidV7(): string {
    const ms = Date.now();
    const bytes = new Uint8Array(16);
    // 前 48 位 = 毫秒时间戳
    bytes[0] = (ms >> 40) & 0xFF;
    bytes[1] = (ms >> 32) & 0xFF;
    bytes[2] = (ms >> 24) & 0xFF;
    bytes[3] = (ms >> 16) & 0xFF;
    bytes[4] = (ms >> 8) & 0xFF;
    bytes[5] = ms & 0xFF;

    crypto.getRandomValues(bytes.subarray(6));
    bytes[6] = (bytes[6] & 0x0F) | 0x70;
    bytes[8] = (bytes[8] & 0x3F) | 0x80;

    const b = Array.from(bytes);
    return `${hex(b, 0, 4)}-${hex(b, 4, 2)}-${hex(b, 6, 2)}-${hex(b, 8, 2)}-${hex(b, 10, 6)}`;
  },

  /** 生成 NanoID */
  nanoId(length = 21, alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789_-'): string {
    const mask = (2 << (Math.ceil(Math.log2(alphabet.length)) - 1).toString()) - 1;
    const step = Math.ceil(1.6 * mask * length / alphabet.length);
    const result: string[] = [];

    while (result.length < length) {
      const bytes = new Uint8Array(step);
      crypto.getRandomValues(bytes);
      for (const b of bytes) {
        const idx = b & (mask as number);
        if (idx < alphabet.length && result.length < length) {
          result.push(alphabet[idx]);
        }
      }
    }

    return result.join('');
  },

  /** 格式化 UUID */
  format(uuid: string, opts: { uppercase?: boolean; noDashes?: boolean; curlyBraces?: boolean } = {}): string {
    let result = uuid;
    if (opts.uppercase) result = result.toUpperCase();
    if (opts.noDashes) result = result.replace(/-/g, '');
    if (opts.curlyBraces) result = `{${result}}`;
    return result;
  },

  /** 批量生成 */
  bulkGenerate(count = 5, v7 = false): string[] {
    count = Math.max(1, Math.min(100, count));
    return Array.from({ length: count }, () => v7 ? this.uuidV7() : this.uuidV4());
  },
};
