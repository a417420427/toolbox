/**
 * 正则表达式测试器
 *
 * 提供正则匹配测试、结果提取和替换预览功能。
 * 全部纯函数，使用 RegExp 原生 API。
 */

export interface RegexFlags {
  global: boolean;    // g
  ignoreCase: boolean; // i
  multiline: boolean;  // m
  dotAll: boolean;     // s
  unicode: boolean;    // u
  sticky: boolean;     // y
}

export const DEFAULT_FLAGS: RegexFlags = {
  global: true,
  ignoreCase: false,
  multiline: false,
  dotAll: false,
  unicode: false,
  sticky: false,
};

export interface RegexMatch {
  index: number;
  value: string;
  groups?: Record<string, string>;
}

export interface RegexTestResult {
  isValid: boolean;
  error?: string;
  matches: RegexMatch[];
  matchCount: number;
}

export function flagsToString(flags: RegexFlags): string {
  let s = "";
  if (flags.global) s += "g";
  if (flags.ignoreCase) s += "i";
  if (flags.multiline) s += "m";
  if (flags.dotAll) s += "s";
  if (flags.unicode) s += "u";
  if (flags.sticky) s += "y";
  return s;
}

/**
 * 编译正则表达式，返回 RegExp 对象或错误信息。
 */
export function compileRegex(pattern: string, flags: RegexFlags = DEFAULT_FLAGS): RegExp {
  const flagStr = flagsToString(flags);
  try {
    return new RegExp(pattern, flagStr);
  } catch (e) {
    throw new Error(e instanceof Error ? e.message : String(e));
  }
}

/**
 * 测试正则匹配，返回所有匹配结果。
 */
export function testRegex(pattern: string, text: string, flags: RegexFlags = DEFAULT_FLAGS): RegexTestResult {
  if (!pattern) {
    return { isValid: true, matches: [], matchCount: 0 };
  }

  let regex: RegExp;
  try {
    regex = compileRegex(pattern, flags);
  } catch (e) {
    return {
      isValid: false,
      error: e instanceof Error ? e.message : String(e),
      matches: [],
      matchCount: 0,
    };
  }

  const matches: RegexMatch[] = [];
  const global = regex.global || regex.sticky;

  if (global) {
    let m: RegExpExecArray | null;
    let guard = 0;
    while ((m = regex.exec(text)) !== null && guard < 10000) {
      guard++;
      const groups: Record<string, string> = {};
      if (m.groups) {
        for (const [key, val] of Object.entries(m.groups)) {
          if (val !== undefined) groups[key] = val;
        }
      }
      matches.push({
        index: m.index,
        value: m[0],
        ...(Object.keys(groups).length > 0 ? { groups } : {}),
      });
      if (!regex.global) break;
      if (m.index === regex.lastIndex) regex.lastIndex++;
    }
  } else {
    const m = regex.exec(text);
    if (m) {
      const groups: Record<string, string> = {};
      if (m.groups) {
        for (const [key, val] of Object.entries(m.groups)) {
          if (val !== undefined) groups[key] = val;
        }
      }
      matches.push({
        index: m.index,
        value: m[0],
        ...(Object.keys(groups).length > 0 ? { groups } : {}),
      });
    }
  }

  return {
    isValid: true,
    matches,
    matchCount: matches.length,
  };
}

/**
 * 执行正则替换并返回结果。
 */
export function replaceRegex(
  pattern: string,
  text: string,
  replacement: string,
  flags: RegexFlags = DEFAULT_FLAGS
): { result: string; error?: string } {
  if (!pattern) {
    return { result: text };
  }

  let regex: RegExp;
  try {
    regex = compileRegex(pattern, { ...flags, global: true });
  } catch (e) {
    return {
      result: text,
      error: e instanceof Error ? e.message : String(e),
    };
  }

  try {
    return { result: text.replace(regex, replacement) };
  } catch (e) {
    return {
      result: text,
      error: e instanceof Error ? e.message : String(e),
    };
  }
}

/**
 * 常用正则模式速查表（用于 UI 展示）
 */
export interface RegexPreset {
  name: string;
  pattern: string;
  description: string;
}

export const REGEX_PRESETS: RegexPreset[] = [
  { name: "邮箱", pattern: "^[\\w.-]+@[\\w.-]+\\.\\w{2,}$", description: "匹配邮箱地址" },
  { name: "手机号（中国大陆）", pattern: "^1[3-9]\\d{9}$", description: "11 位手机号" },
  { name: "URL", pattern: "https?://[\\w./?=&%-]+", description: "匹配 HTTP/HTTPS 链接" },
  { name: "IP v4", pattern: "\\b(?:\\d{1,3}\\.){3}\\d{1,3}\\b", description: "匹配 IPv4 地址" },
  { name: "日期（YYYY-MM-DD）", pattern: "\\d{4}-\\d{2}-\\d{2}", description: "匹配日期格式" },
  { name: "中文", pattern: "[\\u4e00-\\u9fff]+", description: "匹配中文字符" },
  { name: "空白行", pattern: "^\\s*$", description: "匹配空白行" },
  { name: "HTML 标签", pattern: "<[^>]+>", description: "匹配 HTML 标签" },
  { name: "颜色 HEX", pattern: "#?([0-9a-fA-F]{3}|[0-9a-fA-F]{6})", description: "匹配 HEX 颜色值" },
  { name: "数字", pattern: "-?\\d+(\\.\\d+)?", description: "匹配整数和浮点数" },
];

/**
 * 获取正则语法提示（用于 UI 展示）
 */
export const REGEX_SYNTAX_HELP = [
  { pattern: ".", description: "匹配任意单个字符（除换行）" },
  { pattern: "^", description: "匹配行首" },
  { pattern: "$", description: "匹配行尾" },
  { pattern: "\\d", description: "匹配数字 [0-9]" },
  { pattern: "\\w", description: "匹配单词字符 [a-zA-Z0-9_]" },
  { pattern: "\\s", description: "匹配空白字符" },
  { pattern: "*", description: "前一个字符出现 0 次或多次" },
  { pattern: "+", description: "前一个字符出现 1 次或多次" },
  { pattern: "?", description: "前一个字符出现 0 次或 1 次" },
  { pattern: "{n,m}", description: "前一个字符出现 n 到 m 次" },
  { pattern: "(...)", description: "捕获组" },
  { pattern: "(?:...)", description: "非捕获组" },
  { pattern: "(?=...)", description: "正向先行断言" },
  { pattern: "(?!...)", description: "负向先行断言" },
  { pattern: "|", description: "或" },
  { pattern: "[...]", description: "字符集" },
  { pattern: "[^...]", description: "排除字符集" },
];
