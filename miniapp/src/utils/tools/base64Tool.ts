/**
 * Base64 编解码工具
 * 移植自 flutter_shared/tools/base64_tool.dart
 */

export interface Base64Result {
  result: string;
  error?: string;
}

export const Base64Tool = {
  /** 文本 → Base64 */
  encode(input: string): string {
    if (!input) return '';
    return btoa(unescape(encodeURIComponent(input)));
  },

  /** 文本 → Base64 URL Safe */
  encodeUrlSafe(input: string): string {
    if (!input) return '';
    return this.encode(input)
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');
  },

  /** Base64 → 文本 */
  decode(input: string): Base64Result {
    if (!input) return { result: '', error: undefined };
    try {
      // 标准 base64 解码
      const decoded = atob(input);
      const result = decodeURIComponent(decoded.split('').map(c => {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));
      return { result, error: undefined };
    } catch (e: any) {
      // 尝试直接 ascii 解码
      try {
        const decoded = atob(input);
        return { result: decoded, error: undefined };
      } catch (e2: any) {
        return { result: '', error: `非法 Base64 字符串: ${e.message || e2.message}` };
      }
    }
  },
};
