/**
 * 文本统计工具
 * 移植自 flutter_shared/tools/text_stats_tool.dart
 */

export interface TextStatsData {
  charCount: number;
  charNoSpace: number;
  wordCount: number;
  lineCount: number;
  chineseCharCount: number;
  byteCountUtf8: number;
  byteCountUtf16: number;
  digitCount: number;
  letterCount: number;
  punctuationCount: number;
  spaceCount: number;
}

export const TextStatsTool = {
  analyze(input: string): TextStatsData {
    let charCount = input.length;
    let spaceCount = 0;
    let chineseCharCount = 0;
    let digitCount = 0;
    let letterCount = 0;
    let punctuationCount = 0;

    for (const ch of input) {
      const code = ch.charCodeAt(0);
      if (ch === ' ' || ch === '\t') {
        spaceCount++;
      } else if ((code >= 0x4E00 && code <= 0x9FFF) ||
                 (code >= 0x3000 && code <= 0x303F) ||
                 (code >= 0xFF00 && code <= 0xFFEF)) {
        chineseCharCount++;
      } else if (code >= 0x0030 && code <= 0x0039) {
        digitCount++;
      } else if ((code >= 0x0041 && code <= 0x005A) || (code >= 0x0061 && code <= 0x007A)) {
        letterCount++;
      } else if ((code >= 0x0021 && code <= 0x002F) ||
                 (code >= 0x003A && code <= 0x0040) ||
                 (code >= 0x005B && code <= 0x0060) ||
                 (code >= 0x007B && code <= 0x007E)) {
        punctuationCount++;
      }
    }

    const charNoSpace = charCount - spaceCount;
    const wordCount = input.trim() ? input.trim().split(/\s+/).length : 0;
    const lineCount = input ? input.split('\n').length : 0;
    const encoder = new TextEncoder();
    const byteCountUtf8 = encoder.encode(input).length;
    const byteCountUtf16 = input.length * 2;

    return {
      charCount,
      charNoSpace,
      wordCount,
      lineCount,
      chineseCharCount,
      byteCountUtf8,
      byteCountUtf16,
      digitCount,
      letterCount,
      punctuationCount,
      spaceCount,
    };
  },
};
