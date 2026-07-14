import 'dart:convert';
import 'text_stats_data.dart';

/// 文本统计工具
class TextStatsTool {
  TextStatsTool._();

  /// 统计结果
  static TextStatsData analyze(String input) {
    int charCount = input.length;
    int spaceCount = input.split('').where((c) => c == ' ' || c == '\t').length;
    int chineseCharCount = 0;
    int digitCount = 0;
    int letterCount = 0;
    int punctuationCount = 0;

    for (final char in input.runes) {
      if (char >= 0x4E00 && char <= 0x9FFF) {
        chineseCharCount++;
      } else if (char >= 0x3000 && char <= 0x303F) {
        chineseCharCount++;
      } else if (char >= 0xFF00 && char <= 0xFFEF) {
        chineseCharCount++;
      } else if (char >= 0x0030 && char <= 0x0039) {
        digitCount++;
      } else if ((char >= 0x0041 && char <= 0x005A) || (char >= 0x0061 && char <= 0x007A)) {
        letterCount++;
      } else if ((char >= 0x0021 && char <= 0x002F) ||
          (char >= 0x003A && char <= 0x0040) ||
          (char >= 0x005B && char <= 0x0060) ||
          (char >= 0x007B && char <= 0x007E)) {
        punctuationCount++;
      }
    }

    int charNoSpace = charCount - spaceCount;
    int wordCount = 0;
    if (input.trim().isNotEmpty) {
      wordCount = input.trim().split(RegExp(r'\s+')).length;
    }
    int lineCount = input.isEmpty ? 0 : '\n'.allMatches(input).length + 1;
    List<int> utf8Bytes = utf8.encode(input);
    int byteCountUtf8 = utf8Bytes.length;
    int byteCountUtf16 = input.length * 2;

    return TextStatsData(
      charCount: charCount,
      charNoSpace: charNoSpace,
      wordCount: wordCount,
      lineCount: lineCount,
      chineseCharCount: chineseCharCount,
      byteCountUtf8: byteCountUtf8,
      byteCountUtf16: byteCountUtf16,
      digitCount: digitCount,
      letterCount: letterCount,
      punctuationCount: punctuationCount,
      spaceCount: spaceCount,
    );
  }
}
