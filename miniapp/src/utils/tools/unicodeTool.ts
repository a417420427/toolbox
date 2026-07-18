/**
 * Unicode 码点查询工具
 * 移植自 flutter_shared/tools/unicode_tool.dart
 */

export interface CharInfo {
  codePoint: string;
  name: string;
  block: string | null;
}

export interface BatchCharInfo {
  char: string;
  codePoint: string;
  name: string;
  block: string | null;
}

function blockName(codePoint: number): string | null {
  if (codePoint <= 0x007F) return 'Basic Latin';
  if (codePoint <= 0x00FF) return 'Latin-1 Supplement';
  if (codePoint <= 0x024F) return 'Latin Extended';
  if (codePoint <= 0x02AF) return 'IPA Extensions';
  if (codePoint <= 0x02FF) return 'Spacing Modifier Letters';
  if (codePoint <= 0x036F) return 'Combining Diacritical Marks';
  if (codePoint <= 0x03FF) return 'Greek and Coptic';
  if (codePoint <= 0x04FF) return 'Cyrillic';
  if (codePoint <= 0x052F) return 'Cyrillic Supplement';
  if (codePoint <= 0x058F) return 'Armenian';
  if (codePoint <= 0x05FF) return 'Hebrew';
  if (codePoint <= 0x06FF) return 'Arabic';
  if (codePoint <= 0x074F) return 'Syriac';
  if (codePoint <= 0x07FF) return 'Thaana';
  if (codePoint <= 0x085F) return 'Mandaic';
  if (codePoint <= 0x08FF) return 'Arabic Extended-A';
  if (codePoint <= 0x0EFF) return 'Thai / Lao';
  if (codePoint <= 0x0FFF) return 'Tibetan';
  if (codePoint <= 0x109F) return 'Myanmar';
  if (codePoint <= 0x1CFF) return 'Georgian / Balinese';
  if (codePoint <= 0x2AFF) return 'Supplemental Punctuation / CJK Strokes';
  if (codePoint <= 0x303F) return 'CJK Symbols and Punctuation';
  if (codePoint <= 0x9FFF) return 'CJK Unified Ideographs';
  if (codePoint <= 0xA4CF) return 'Yi';
  if (codePoint <= 0xABFF) return 'Meetei Mayek';
  if (codePoint <= 0xD7AF) return 'Hangul Syllables';
  if (codePoint <= 0xDFFF) return 'Surrogates';
  if (codePoint <= 0xF8FF) return 'Private Use Area';
  if (codePoint <= 0xFB4F) return 'Alphabetic Presentation Forms';
  if (codePoint <= 0xFDFF) return 'Arabic Presentation Forms-A';
  if (codePoint <= 0xFE0F) return 'Variation Selectors';
  if (codePoint <= 0xFE6F) return 'Small Form Variants';
  if (codePoint <= 0xFEFF) return 'Arabic Presentation Forms-B';
  if (codePoint <= 0xFFEF) return 'Halfwidth and Fullwidth Forms';
  if (codePoint <= 0xFFFF) return 'Specials';
  if (codePoint <= 0x10FFFF) return 'Supplementary Planes';
  return null;
}

function charName(codePoint: number): string {
  if (codePoint >= 0x4E00 && codePoint <= 0x9FFF) return 'CJK Unified Ideograph';
  if (codePoint >= 0x3040 && codePoint <= 0x309F) return 'Hiragana';
  if (codePoint >= 0x30A0 && codePoint <= 0x30FF) return 'Katakana';
  if (codePoint >= 0xAC00 && codePoint <= 0xD7AF) return 'Hangul Syllable';
  if (codePoint >= 0x0600 && codePoint <= 0x06FF) return 'Arabic';
  if (codePoint >= 0x0400 && codePoint <= 0x04FF) return 'Cyrillic';
  if (codePoint >= 0x0370 && codePoint <= 0x03FF) return 'Greek and Coptic';

  if (codePoint === 0x0009) return 'CHARACTER TABULATION';
  if (codePoint === 0x000A) return 'LINE FEED (LF)';
  if (codePoint === 0x000D) return 'CARRIAGE RETURN (CR)';
  if (codePoint === 0x0020) return 'SPACE';
  if (codePoint >= 0x0000 && codePoint <= 0x001F) return 'CONTROL CHARACTER';
  if (codePoint >= 0x0021 && codePoint <= 0x007E) return 'ASCII Printable';

  return '';
}

export const UnicodeTool = {
  /** 字符 → 码点信息 */
  charInfo(char: string): CharInfo {
    if (!char) return { codePoint: '', name: '', block: null };
    const codePoint = char.codePointAt(0)!;
    const hex = codePoint.toString(16).toUpperCase().padStart(4, '0');
    return {
      codePoint: `U+${hex}`,
      name: charName(codePoint),
      block: blockName(codePoint),
    };
  },

  /** 批量查询 */
  batchInfo(input: string): BatchCharInfo[] {
    const results: BatchCharInfo[] = [];
    for (const ch of input) {
      const codePoint = ch.codePointAt(0)!;
      const hex = codePoint.toString(16).toUpperCase().padStart(4, '0');
      results.push({
        char: ch,
        codePoint: `U+${hex}`,
        name: charName(codePoint),
        block: blockName(codePoint),
      });
    }
    return results;
  },

  /** 码点 → 字符 */
  fromCodePoint(input: string): { char: string; error?: string } {
    input = input.trim().toUpperCase().replace(/^U\+/, '');
    try {
      const code = parseInt(input, 16);
      if (isNaN(code)) return { char: '', error: `非法码点格式：${input}` };
      if (code > 0x10FFFF) return { char: '', error: `非法码点：U+${input}（超过 U+10FFFF）` };
      return { char: String.fromCodePoint(code) };
    } catch {
      return { char: '', error: `非法码点格式：${input}` };
    }
  },
};
