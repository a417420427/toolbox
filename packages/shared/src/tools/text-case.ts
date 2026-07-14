/**
 * 文字格式互转工具
 *
 * 大小写转换、命名法互转（camelCase / PascalCase / snake_case 等）。
 * 全部纯函数，无外部依赖。
 */

export type CaseType = "upper" | "lower" | "title" | "sentence";

export type NamingConvention =
  | "camelCase"
  | "PascalCase"
  | "snake_case"
  | "SCREAMING_SNAKE_CASE"
  | "kebab-case"
  | "Train-Case"
  | "dot.case"
  | "space separated"
  | "no case";

/** 大小写转换结果 */
export interface CaseConvertResult {
  upper: string;
  lower: string;
  title: string;
  sentence: string;
}

/** 命名法转换结果 */
export interface NamingConvertResult {
  camelCase: string;
  PascalCase: string;
  snake_case: string;
  SCREAMING_SNAKE_CASE: string;
  "kebab-case": string;
  "Train-Case": string;
  "dot.case": string;
  "space separated": string;
}

// ---- 分词器 ----

/**
 * 将输入字符串拆分为单词数组。
 * 智能识别多种分隔符和大小写边界。
 */
export function splitWords(input: string): string[] {
  if (!input) return [];

  // 1. 按分隔符拆分（空格、中划线、下划线、点、斜杠）
  const segments = input.split(/[\s\-_.|/\\]+/).filter(Boolean);

  // 2. 对每个片段按大小写边界拆分（camelCase / PascalCase）
  const words: string[] = [];
  for (const seg of segments) {
    // 全大写缩写（如 HTTP）保持为一个词
    // 否则按大小写边界拆分
    let start = 0;
    for (let i = 1; i < seg.length; i++) {
      const ch = seg[i];
      const prev = seg[i - 1];
      // 小写→大写：边界
      if (
        /[a-z]/.test(prev) &&
        /[A-Z]/.test(ch)
      ) {
        words.push(seg.slice(start, i).toLowerCase());
        start = i;
      }
      // 大写→大写+小写：前一个边界（处理 HTTPRequest → HTTP Request）
      if (
        i + 1 < seg.length &&
        /[A-Z]/.test(prev) &&
        /[A-Z]/.test(ch) &&
        /[a-z]/.test(seg[i + 1])
      ) {
        if (i > start + 1) {
          words.push(seg.slice(start, i - 1).toLowerCase());
          start = i - 1;
        }
      }
    }
    const last = seg.slice(start);
    if (last) words.push(last.toLowerCase());
  }

  return words.filter(Boolean);
}

// ---- 大小写转换 ----

/**
 * 大小写转换
 */
export function convertCase(input: string): CaseConvertResult {
  if (!input) {
    return { upper: "", lower: "", title: "", sentence: "" };
  }

  return {
    upper: input.toUpperCase(),
    lower: input.toLowerCase(),
    title: input.replace(/\b\w/g, (c) => c.toUpperCase()),
    sentence: input.length > 0
      ? input[0].toUpperCase() + input.slice(1).toLowerCase()
      : "",
  };
}

// ---- 命名法互转 ----

/**
 * 命名法互转。
 * 输入任意格式的命名，输出所有命名法。
 */
export function convertNaming(input: string): NamingConvertResult {
  const words = splitWords(input);

  if (words.length === 0) {
    return {
      camelCase: "",
      PascalCase: "",
      snake_case: "",
      SCREAMING_SNAKE_CASE: "",
      "kebab-case": "",
      "Train-Case": "",
      "dot.case": "",
      "space separated": "",
    };
  }

  const cap = (w: string) => w[0].toUpperCase() + w.slice(1);

  return {
    camelCase: words[0] + words.slice(1).map(cap).join(""),
    PascalCase: words.map(cap).join(""),
    snake_case: words.join("_"),
    SCREAMING_SNAKE_CASE: words.map((w) => w.toUpperCase()).join("_"),
    "kebab-case": words.join("-"),
    "Train-Case": words.map(cap).join("-"),
    "dot.case": words.join("."),
    "space separated": words.join(" "),
  };
}

/**
 * 反转字符串
 */
export function reverseString(input: string): string {
  // 正确处理 Unicode 代理对
  return [...input].reverse().join("");
}

/**
 * 获取字符串的 Unicode 字符数组（支持 Emoji 等组合字符）
 */
export function toChars(input: string): string[] {
  return [...input];
}
