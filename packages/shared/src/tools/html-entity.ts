/**
 * HTML 实体编解码工具
 *
 * 支持 HTML4 命名实体、十进制、十六进制实体的编解码。
 */

/** HTML4 命名实体映射（最常用子集） */
const HTML_ENTITIES: Record<string, string> = {
  "&amp;": "&",
  "&lt;": "<",
  "&gt;": ">",
  "&quot;": '"',
  "&apos;": "'",
  "&nbsp;": "\u00A0",
  "&iexcl;": "¡",
  "&cent;": "¢",
  "&pound;": "£",
  "&curren;": "¤",
  "&yen;": "¥",
  "&brvbar;": "¦",
  "&sect;": "§",
  "&uml;": "¨",
  "&copy;": "©",
  "&ordf;": "ª",
  "&laquo;": "«",
  "&not;": "¬",
  "&shy;": "\u00AD",
  "&reg;": "®",
  "&macr;": "¯",
  "&deg;": "°",
  "&plusmn;": "±",
  "&sup2;": "²",
  "&sup3;": "³",
  "&acute;": "´",
  "&micro;": "µ",
  "&para;": "¶",
  "&middot;": "·",
  "&cedil;": "¸",
  "&sup1;": "¹",
  "&ordm;": "º",
  "&raquo;": "»",
  "&frac14;": "¼",
  "&frac12;": "½",
  "&frac34;": "¾",
  "&iquest;": "¿",
  "&times;": "×",
  "&divide;": "÷",
  "&euro;": "€",
};

/** 反向映射：字符 → 实体名 */
const CHAR_TO_ENTITY: Record<string, string> = {};
for (const [entity, char] of Object.entries(HTML_ENTITIES)) {
  CHAR_TO_ENTITY[char] = entity;
}

/** 需要编码的 5 个预定义实体 */
const PREDEFINED: Record<string, string> = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&apos;",
};

/**
 * HTML 实体编码（预定义实体模式）
 *
 * 只编码 `& < > " '` 五个字符。
 */
export function encodeHtmlEntities(input: string): string {
  if (input.length === 0) return "";
  return input.replace(/[&<>"']/g, (ch) => PREDEFINED[ch] || ch);
}

/**
 * HTML 实体编码（十进制模式）
 *
 * 将所有非 ASCII 和非安全字符编码为 `&#NNN;` 格式。
 * @param safeChars 额外的安全字符（不编码）
 */
export function encodeHtmlEntitiesDecimal(input: string, safeChars?: string): string {
  if (input.length === 0) return "";
  const safe = new Set(safeChars ? [...safeChars] : []);
  let result = "";
  for (const ch of input) {
    if (ch === "&") {
      result += "&amp;";
    } else if (safe.has(ch) || (ch >= " " && ch <= "~")) {
      result += ch;
    } else {
      result += `&#${ch.codePointAt(0)!};`;
    }
  }
  return result;
}

/**
 * HTML 实体解码
 *
 * 支持命名实体、十进制 `&#NNN;`、十六进制 `&#xHH;`。
 * 不识别或非法的实体保持原样。
 */
export function decodeHtmlEntities(input: string): string {
  if (input.length === 0) return "";

  return input.replace(/&(#x?[0-9a-fA-F]+|[a-zA-Z]+);/g, (match, entity: string) => {
    // 命名实体
    if (entity.startsWith("#x") || entity.startsWith("#X")) {
      // 十六进制 &#xHH;
      const code = parseInt(entity.slice(2), 16);
      if (isNaN(code)) return match;
      return String.fromCodePoint(code);
    }
    if (entity.startsWith("#")) {
      // 十进制 &#NNN;
      const code = parseInt(entity.slice(1), 10);
      if (isNaN(code)) return match;
      return String.fromCodePoint(code);
    }
    // 命名实体
    const named = `&${entity};`;
    return HTML_ENTITIES[named] || match;
  });
}

/**
 * 检测字符串中是否包含 HTML 实体
 */
export function hasHtmlEntities(input: string): boolean {
  return /&(#x?[0-9a-fA-F]+|[a-zA-Z]+);/.test(input);
}

/**
 * 获取所有支持的实体列表（用于 UI 展示）
 */
export function getEntityTable(): Array<{ entity: string; char: string; description: string }> {
  return Object.entries(HTML_ENTITIES).map(([entity, char]) => ({
    entity,
    char,
    description: `U+${char.codePointAt(0)!.toString(16).toUpperCase().padStart(4, "0")}`,
  }));
}
