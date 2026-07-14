/// 文字格式互转 — 大小写 / 命名法
class TextCaseTool {
  TextCaseTool._();

  /// 所有转换结果
  static ({String upper, String lower, String title, String sentence,
      String camel, String pascal, String snake, String kebab, String reverse})
  convert(String input) {
    if (input.isEmpty) {
      return (
        upper: '', lower: '', title: '', sentence: '',
        camel: '', pascal: '', snake: '', kebab: '', reverse: '',
      );
    }

    return (
      upper: input.toUpperCase(),
      lower: input.toLowerCase(),
      title: _toTitleCase(input),
      sentence: _toSentenceCase(input),
      camel: _toCamelCase(input),
      pascal: _toPascalCase(input),
      snake: _toSnakeCase(input),
      kebab: _toKebabCase(input),
      reverse: input.split('').reversed.join(),
    );
  }

  static String _toTitleCase(String input) {
    return input.split(RegExp(r'[\s_\-]+')).map((word) {
      if (word.isEmpty) return word;
      return word[0].toUpperCase() + word.substring(1).toLowerCase();
    }).join(' ');
  }

  static String _toSentenceCase(String input) {
    if (input.isEmpty) return input;
    return input[0].toUpperCase() + input.substring(1).toLowerCase();
  }

  static List<String> _splitWords(String input) {
    // 处理 camelCase / PascalCase
    final withSpaces = input.replaceAllMapped(
      RegExp(r'([a-z])([A-Z])'),
      (m) => '${m[1]} ${m[2]}',
    );
    // 处理数字边界
    final withSpaces2 = withSpaces.replaceAllMapped(
      RegExp(r'([a-zA-Z])(\d)'),
      (m) => '${m[1]} ${m[2]}',
    );
    return withSpaces2
        .split(RegExp(r'[\s_\-]+'))
        .where((w) => w.isNotEmpty)
        .toList();
  }

  static String _toCamelCase(String input) {
    final words = _splitWords(input);
    if (words.isEmpty) return '';
    return words[0].toLowerCase() +
        words.skip(1).map((w) => _capitalize(w.toLowerCase())).join();
  }

  static String _toPascalCase(String input) {
    return _splitWords(input)
        .map((w) => _capitalize(w.toLowerCase()))
        .join();
  }

  static String _toSnakeCase(String input) {
    return _splitWords(input)
        .map((w) => w.toLowerCase())
        .join('_');
  }

  static String _toKebabCase(String input) {
    return _splitWords(input)
        .map((w) => w.toLowerCase())
        .join('-');
  }

  static String _capitalize(String s) {
    if (s.isEmpty) return s;
    return s[0].toUpperCase() + s.substring(1);
  }
}
