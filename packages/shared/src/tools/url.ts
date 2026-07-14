/**
 * URL 编解码工具
 *
 * 封装 encodeURI / encodeURIComponent 及对应解码，提供统一接口。
 */

export type UrlEncodingMode = "component" | "full";

/** URL 编解码选项 */
export interface UrlEncodeOptions {
  /** 编码模式：component（参数值）| full（完整 URL） */
  mode: UrlEncodingMode;
}

/**
 * URL 编码
 */
export function encodeUrl(input: string, options: UrlEncodeOptions = { mode: "component" }): string {
  if (input.length === 0) return "";
  return options.mode === "full" ? encodeURI(input) : encodeURIComponent(input);
}

/**
 * URL 解码
 */
export function decodeUrl(input: string, options: UrlEncodeOptions = { mode: "component" }): string {
  if (input.length === 0) return "";
  try {
    return options.mode === "full" ? decodeURI(input) : decodeURIComponent(input);
  } catch {
    throw new Error("无法解码：输入包含非法编码序列");
  }
}

/**
 * 智能解码 —— 自动检测并尝试解码，直到全部解码完毕
 */
export function decodeUrlSmart(input: string): { result: string; decodedCount: number } {
  if (input.length === 0) return { result: "", decodedCount: 0 };

  let current = input;
  let count = 0;

  for (let i = 0; i < 10; i++) {
    // 最多尝试 10 轮，防止无限循环
    if (!/%[0-9a-fA-F]{2}/.test(current)) break;
    try {
      const decoded = decodeURIComponent(current);
      if (decoded === current) break;
      current = decoded;
      count++;
    } catch {
      // 如果 decodeURIComponent 失败，尝试 decodeURI
      try {
        const decoded = decodeURI(current);
        if (decoded === current) break;
        current = decoded;
        count++;
      } catch {
        break;
      }
    }
  }

  return { result: current, decodedCount: count };
}

/**
 * 检测字符串是否包含 URL 编码
 */
export function hasUrlEncoding(input: string): boolean {
  return /%[0-9a-fA-F]{2}/.test(input);
}
