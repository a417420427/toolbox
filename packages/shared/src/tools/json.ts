/**
 * JSON 工具
 *
 * 格式化、压缩、校验、树形路径提取。
 * 全部纯函数，使用原生 JSON API。
 */

export type JsonIndentStyle = "spaces" | "tab";

export interface JsonFormatOptions {
  indentStyle?: JsonIndentStyle;
  indentSize?: number; // 仅在 indentStyle=spaces 时生效
  sortKeys?: boolean;
}

export interface JsonFormatResult {
  formatted: string;
  compressed: string;
  isValid: boolean;
  error?: JsonError;
}

export interface JsonError {
  message: string;
  line?: number;
  column?: number;
  snippet?: string;
}

/**
 * 格式化 JSON 字符串。
 */
export function formatJson(input: string, options: JsonFormatOptions = {}): JsonFormatResult {
  if (!input.trim()) {
    return { formatted: "", compressed: "", isValid: false, error: { message: "请输入 JSON" } };
  }

  try {
    const parsed = JSON.parse(input);

    // 排序键
    const sorted = options.sortKeys ? sortObjectKeys(parsed) : parsed;

    const indent = options.indentStyle === "tab"
      ? "\t"
      : options.indentSize != null
        ? " ".repeat(Math.max(1, Math.min(8, options.indentSize)))
        : "  ";

    const formatted = JSON.stringify(sorted, null, indent);
    const compressed = JSON.stringify(sorted);

    return { formatted, compressed, isValid: true };
  } catch (e) {
    const error = parseJsonError(input, e);
    return {
      formatted: input,
      compressed: input,
      isValid: false,
      error,
    };
  }
}

/**
 * JSON 合法性校验，仅返回是否合法和错误信息。
 */
export function validateJson(input: string): { isValid: boolean; error?: JsonError } {
  if (!input.trim()) {
    return { isValid: false, error: { message: "请输入 JSON" } };
  }

  try {
    JSON.parse(input);
    return { isValid: true };
  } catch (e) {
    return { isValid: false, error: parseJsonError(input, e) };
  }
}

/**
 * 解析 JSON 错误，尝试提取行号和列号。
 */
function parseJsonError(input: string, error: unknown): JsonError {
  const msg = error instanceof Error ? error.message : String(error);

  // Node.js 的 JSON.parse 错误格式： "Unexpected token ... at position 42"
  // 浏览器格式："Unexpected token ... at position 42"
  const posMatch = msg.match(/position\s+(\d+)/);
  if (posMatch) {
    const pos = parseInt(posMatch[1], 10);
    const lines = input.slice(0, pos).split("\n");
    const line = lines.length;
    const column = (lines[lines.length - 1]?.length ?? 0) + 1;

    // 提取错误附近的 snippet
    const start = Math.max(0, pos - 20);
    const end = Math.min(input.length, pos + 20);
    let snippet = input.slice(start, end);
    if (start > 0) snippet = "..." + snippet;
    if (end < input.length) snippet += "...";

    return { message: msg, line, column, snippet };
  }

  return { message: msg };
}

/**
 * 获取 JSON 路径列表（用于树形展开）。
 * 返回如 ["name", "address.city", "items[0]"] 的路径。
 */
export function getJsonPaths(input: string): string[] {
  try {
    const parsed = JSON.parse(input);
    const paths: string[] = [];
    walkPaths(parsed, "", paths);
    return paths.sort();
  } catch {
    return [];
  }
}

function walkPaths(value: unknown, prefix: string, paths: string[]): void {
  if (value !== null && typeof value === "object") {
    if (Array.isArray(value)) {
      if (prefix) paths.push(prefix);
      for (let i = 0; i < value.length; i++) {
        walkPaths(value[i], `${prefix}[${i}]`, paths);
      }
    } else {
      if (prefix) paths.push(prefix);
      for (const key of Object.keys(value)) {
        walkPaths((value as Record<string, unknown>)[key], prefix ? `${prefix}.${key}` : key, paths);
      }
    }
  } else {
    if (prefix) paths.push(prefix);
  }
}

/**
 * 获取 JSON 值的类型信息。
 */
export function getJsonTypeInfo(input: string): {
  type: string;
  isArray: boolean;
  isObject: boolean;
  depth: number;
  size: number;
  keys?: string[];
} {
  try {
    const parsed = JSON.parse(input);
    const type = Array.isArray(parsed) ? "array" : typeof parsed;
    const keys = typeof parsed === "object" && parsed !== null && !Array.isArray(parsed)
      ? Object.keys(parsed)
      : undefined;
    return {
      type,
      isArray: Array.isArray(parsed),
      isObject: typeof parsed === "object" && parsed !== null,
      depth: getDepth(parsed),
      size: typeof parsed === "object" && parsed !== null
        ? Array.isArray(parsed) ? parsed.length : Object.keys(parsed).length
        : 1,
      keys,
    };
  } catch {
    return { type: "unknown", isArray: false, isObject: false, depth: 0, size: 0 };
  }
}

function getDepth(value: unknown): number {
  if (value !== null && typeof value === "object") {
    const values = Array.isArray(value) ? value : Object.values(value as Record<string, unknown>);
    if (values.length === 0) return 1;
    return 1 + Math.max(0, ...values.map(getDepth));
  }
  return 0;
}

/**
 * JSON Diff（简单逐键对比）
 * 📌 V2+ 可扩展为更详细的 Diff
 */
export interface JsonDiffResult {
  added: string[];
  removed: string[];
  changed: string[];
  unchanged: string[];
}

export function diffJson(a: string, b: string): JsonDiffResult {
  try {
    const objA = JSON.parse(a) as Record<string, unknown>;
    const objB = JSON.parse(b) as Record<string, unknown>;
    const keysA = new Set(Object.keys(objA));
    const keysB = new Set(Object.keys(objB));
    const allKeys = new Set([...keysA, ...keysB]);

    const added: string[] = [];
    const removed: string[] = [];
    const changed: string[] = [];
    const unchanged: string[] = [];

    for (const key of allKeys) {
      if (!keysA.has(key)) {
        added.push(key);
      } else if (!keysB.has(key)) {
        removed.push(key);
      } else if (JSON.stringify(objA[key]) !== JSON.stringify(objB[key])) {
        changed.push(key);
      } else {
        unchanged.push(key);
      }
    }

    return { added, removed, changed, unchanged };
  } catch {
    return { added: [], removed: [], changed: [], unchanged: [] };
  }
}

// ---- 内部辅助 ----

function sortObjectKeys(value: unknown): unknown {
  if (value === null || typeof value !== "object") return value;
  if (Array.isArray(value)) return value.map(sortObjectKeys);

  const sorted: Record<string, unknown> = {};
  for (const key of Object.keys(value as Record<string, unknown>).sort()) {
    sorted[key] = sortObjectKeys((value as Record<string, unknown>)[key]);
  }
  return sorted;
}
