/// Unicode 码点查询工具
class UnicodeTool {
  UnicodeTool._();

  /// 字符 → 码点信息
  static ({String codePoint, String name, String? block}) charInfo(String char) {
    if (char.isEmpty) {
      return (codePoint: '', name: '', block: null);
    }

    final rune = char.runes.first;
    final hex = rune.toRadixString(16).toUpperCase().padLeft(4, '0');
    final block = _blockName(rune);

    return (
      codePoint: 'U+$hex',
      name: _charName(rune),
      block: block,
    );
  }

  /// 批量查询 — 输入一段文本，列出每个字符的码点
  static List<({String char, String codePoint, String name, String? block})>
      batchInfo(String input) {
    final results = <({String char, String codePoint, String name, String? block})>[];

    for (final rune in input.runes) {
      final hex = rune.toRadixString(16).toUpperCase().padLeft(4, '0');
      results.add((
        char: String.fromCharCode(rune),
        codePoint: 'U+$hex',
        name: _charName(rune),
        block: _blockName(rune),
      ));
    }

    return results;
  }

  /// 码点 → 字符
  static ({String char, String? error}) fromCodePoint(String input) {
    input = input.trim().toUpperCase().replaceFirst('U+', '');
    try {
      final code = int.parse(input, radix: 16);
      if (code > 0x10FFFF) {
        return (char: '', error: '非法码点：U+$input（超过 U+10FFFF）');
      }
      return (char: String.fromCharCode(code), error: null);
    } on FormatException {
      return (char: '', error: '非法码点格式：$input');
    }
  }

  static String _charName(int codePoint) {
    // 常用区块名称映射（完整 name 需要 unicode_data，这里提供简版）
    if (codePoint >= 0x4E00 && codePoint <= 0x9FFF) return 'CJK Unified Ideograph';
    if (codePoint >= 0x3040 && codePoint <= 0x309F) return 'Hiragana';
    if (codePoint >= 0x30A0 && codePoint <= 0x30FF) return 'Katakana';
    if (codePoint >= 0xAC00 && codePoint <= 0xD7AF) return 'Hangul Syllable';
    if (codePoint >= 0x0600 && codePoint <= 0x06FF) return 'Arabic';
    if (codePoint >= 0x0400 && codePoint <= 0x04FF) return 'Cyrillic';
    if (codePoint >= 0x0370 && codePoint <= 0x03FF) return 'Greek and Coptic';

    // 控制字符
    if (codePoint == 0x0009) return 'CHARACTER TABULATION';
    if (codePoint == 0x000A) return 'LINE FEED (LF)';
    if (codePoint == 0x000D) return 'CARRIAGE RETURN (CR)';
    if (codePoint == 0x0020) return 'SPACE';
    if (codePoint >= 0x0000 && codePoint <= 0x001F) return 'CONTROL CHARACTER';

    // ASCII 可打印
    if (codePoint >= 0x0021 && codePoint <= 0x007E) return 'ASCII Printable';

    return '';
  }

  static String? _blockName(int codePoint) {
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
    if (codePoint <= 0x086F) return 'Syriac Supplement';
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
}
