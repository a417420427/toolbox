/**
 * URL 编解码工具
 * 移植自 flutter_shared/tools/url_tool.dart
 */

export interface UrlResult {
  result: string;
  error?: string;
}

export const UrlTool = {
  /** encodeURIComponent */
  encodeComponent(input: string): string {
    return encodeURIComponent(input);
  },

  /** decodeURIComponent */
  decodeComponent(input: string): UrlResult {
    try {
      return { result: decodeURIComponent(input), error: undefined };
    } catch (_) {
      try {
        const partial = this._partialDecode(input);
        return { result: partial, error: '部分字符解码失败，已原样保留' };
      } catch (_2) {
        return { result: input, error: '无法解码该字符串' };
      }
    }
  },

  /** encodeURI */
  encodeFull(input: string): string {
    return encodeURI(input);
  },

  /** decodeURI */
  decodeFull(input: string): UrlResult {
    try {
      return { result: decodeURI(input), error: undefined };
    } catch (_) {
      try {
        return { result: this._partialDecode(input), error: '部分字符解码失败' };
      } catch (_2) {
        return { result: input, error: '无法解码' };
      }
    }
  },

  _partialDecode(input: string): string {
    const buffer: string[] = [];
    for (let i = 0; i < input.length; i++) {
      if (input[i] === '%' && i + 2 < input.length) {
        const hex = input.substring(i + 1, i + 3);
        const code = parseInt(hex, 16);
        if (!isNaN(code)) {
          buffer.push(String.fromCharCode(code));
          i += 2;
          continue;
        }
      }
      buffer.push(input[i]);
    }
    return buffer.join('');
  },
};
