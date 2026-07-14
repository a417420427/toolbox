/// 文本统计结果
class TextStatsData {
  final int charCount;        // 含空格字符数
  final int charNoSpace;      // 不含空格字符数
  final int wordCount;        // 单词数
  final int lineCount;        // 行数
  final int chineseCharCount; // 中文字数
  final int byteCountUtf8;    // UTF-8 字节数
  final int byteCountUtf16;   // UTF-16 字节数
  final int digitCount;       // 数字数
  final int letterCount;      // 字母数
  final int punctuationCount; // 标点数
  final int spaceCount;       // 空格数

  const TextStatsData({
    required this.charCount,
    required this.charNoSpace,
    required this.wordCount,
    required this.lineCount,
    required this.chineseCharCount,
    required this.byteCountUtf8,
    required this.byteCountUtf16,
    required this.digitCount,
    required this.letterCount,
    required this.punctuationCount,
    required this.spaceCount,
  });
}
