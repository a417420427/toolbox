/**
 * 文本统计工具
 *
 * 对输入文本进行字符数、单词数、行数等全面统计。
 * 全部纯函数，无外部依赖。
 */

export interface TextStats {
  /** 总字符数（含空格） */
  chars: number;
  /** 字符数（不含空格） */
  charsNoSpace: number;
  /** 中文字数 */
  chineseChars: number;
  /** 单词数（按空格/标点分隔的英文单词） */
  words: number;
  /** 行数 */
  lines: number;
  /** 非空行数 */
  nonEmptyLines: number;
  /** 段落数（连续非空行组成的段落） */
  paragraphs: number;
  /** 字节数（UTF-8） */
  bytes: number;
  /** 字节数（UTF-16） */
  bytesUtf16: number;
  /** 数字数量 */
  digits: number;
  /** 字母数量（A-Z a-z） */
  letters: number;
  /** 标点数量 */
  punctuation: number;
  /** 空格数量 */
  spaces: number;
  /** Emoji 数量 */
  emojis: number;
  /** 最长行的字符数 */
  maxLineLength: number;
  /** 平均行长度 */
  avgLineLength: number;
}

/** 常用标点字符集 */
const PUNCTUATION_REGEX = /[!\"#$%&'()*+,\-./:;<=>?@[\]^_`{|}~。，、；：？！…—·「」『』【】《》（）〔〕“”‘’]/;
const EMOJI_REGEX = /[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F1E0}-\u{1F1FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{FE00}-\u{FE0F}\u{1F900}-\u{1F9FF}\u{1FA00}-\u{1FA6F}\u{1FA70}-\u{1FAFF}\u{200D}]/u;
const CHINESE_REGEX = /[\u4e00-\u9fff\u3400-\u4dbf]/;

/**
 * 对输入文本进行全量统计。
 * 大文本（>100KB）会自动降低准确度以保证性能（跳过 Emoji 检测）。
 */
export function getTextStats(input: string): TextStats {
  if (!input) {
    return {
      chars: 0,
      charsNoSpace: 0,
      chineseChars: 0,
      words: 0,
      lines: 0,
      nonEmptyLines: 0,
      paragraphs: 0,
      bytes: 0,
      bytesUtf16: 0,
      digits: 0,
      letters: 0,
      punctuation: 0,
      spaces: 0,
      emojis: 0,
      maxLineLength: 0,
      avgLineLength: 0,
    };
  }

  const isLarge = input.length > 100_000;

  const chars = input.length;
  const spaces = (input.match(/\s/g) || []).length;
  const charsNoSpace = chars - spaces;

  // 逐字符统计（保证准确度，相对于正则重复扫描更高效）
  let chineseChars = 0;
  let digits = 0;
  let letters = 0;
  let punctuation = 0;
  let emojis = 0;

  if (!isLarge) {
    for (const ch of input) {
      if (CHINESE_REGEX.test(ch)) chineseChars++;
      else if (/\d/.test(ch)) digits++;
      else if (/[a-zA-Z]/.test(ch)) letters++;
      else if (PUNCTUATION_REGEX.test(ch)) punctuation++;
      else if (EMOJI_REGEX.test(ch)) emojis++;
    }
  } else {
    // 大文本：跳过 Emoji 检测以节省性能
    for (const ch of input) {
      if (CHINESE_REGEX.test(ch)) chineseChars++;
      else if (/\d/.test(ch)) digits++;
      else if (/[a-zA-Z]/.test(ch)) letters++;
      else if (PUNCTUATION_REGEX.test(ch)) punctuation++;
    }
  }

  // 单词数（按非字母数字拆分）
  const words = input
    .split(/[^a-zA-Z0-9]+/)
    .filter((w) => w.length > 0).length;

  // 行相关
  const lines = input.split(/\r?\n/);
  const lineCount = lines.length;
  const nonEmptyLineCount = lines.filter((l) => l.trim().length > 0).length;

  // 段落（连续非空行）
  let paragraphCount = 0;
  let inParagraph = false;
  for (const line of lines) {
    if (line.trim().length > 0) {
      if (!inParagraph) {
        paragraphCount++;
        inParagraph = true;
      }
    } else {
      inParagraph = false;
    }
  }

  // 行长度
  let maxLineLen = 0;
  let totalLineLen = 0;
  for (const line of lines) {
    const len = line.length;
    totalLineLen += len;
    if (len > maxLineLen) maxLineLen = len;
  }

  // 字节
  const encoder = new TextEncoder();
  const bytesUtf8 = encoder.encode(input).length;
  const bytesUtf16 = input.length * 2;

  return {
    chars,
    charsNoSpace,
    chineseChars,
    words,
    lines: lineCount,
    nonEmptyLines: nonEmptyLineCount,
    paragraphs: paragraphCount,
    bytes: bytesUtf8,
    bytesUtf16,
    digits,
    letters,
    punctuation,
    spaces,
    emojis,
    maxLineLength: maxLineLen,
    avgLineLength: lineCount > 0 ? Math.round(totalLineLen / lineCount) : 0,
  };
}

/**
 * 获取文本的阅读时间估计（分钟）。
 * @param wpm 阅读速度（词/分钟），默认 200
 */
export function estimateReadingTime(input: string, wpm = 200): number {
  if (!input) return 0;
  const stats = getTextStats(input);
  const totalWords = stats.words + stats.chineseChars; // 中文按字算
  return Math.max(0.1, totalWords / wpm);
}

/**
 * 获取文本的关键词密度统计（V2+）。
 * @param topN 返回前 N 个高频词，默认 10
 */
export function getKeywordDensity(
  input: string,
  topN = 10
): Array<{ word: string; count: number; density: number }> {
  if (!input) return [];

  const words = input
    .toLowerCase()
    .split(/[^a-zA-Z\u4e00-\u9fff]+/)
    .filter((w) => w.length > 0);

  const total = words.length;
  const freq: Record<string, number> = {};

  for (const w of words) {
    freq[w] = (freq[w] || 0) + 1;
  }

  return Object.entries(freq)
    .sort((a, b) => b[1] - a[1])
    .slice(0, topN)
    .map(([word, count]) => ({
      word,
      count,
      density: total > 0 ? Math.round((count / total) * 10000) / 100 : 0,
    }));
}
