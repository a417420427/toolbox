/// XML 格式化工具（简化版）
class XmlFormatter {
  XmlFormatter._();

  static String format(String xml) {
    if (xml.trim().isEmpty) return '';

    var result = xml;
    // 去除多余空白
    result = result.replaceAll(RegExp(r'>\s+<'), '><');

    // 缩进
    final buffer = StringBuffer();
    int indent = 0;
    bool inTag = false;

    for (int i = 0; i < result.length; i++) {
      final c = result[i];
      if (c == '<') {
        inTag = true;
        // 如果不是第一个字符，换行
        if (i > 0) {
          buffer.writeln();
        }
        // 闭合标签缩进减少
        if (i + 1 < result.length && result[i + 1] == '/') {
          indent--;
        }
        buffer.write('  ' * indent.clamp(0, 100));
        buffer.write(c);
      } else if (c == '>') {
        buffer.write(c);
        inTag = false;
        // 自闭合或开始标签后缩进增加
        if (i > 0 && result[i - 1] == '/') {
          // 自闭合，不变
        } else if (!(i + 1 < result.length && result[i + 1] == '<')) {
          // 有文本内容，不缩进
        } else if (i > 1 && result[i - 1] != '/' && !(i > 1 && result[i - 2] == '/')) {
          indent++;
        }
      } else if (c == '/' && i + 1 < result.length && result[i + 1] == '>') {
        buffer.write(c);
      } else {
        // <?xml 声明
        buffer.write(c);
      }
    }

    return buffer.toString().trim();
  }

  /// 压缩
  static String minify(String xml) {
    if (xml.trim().isEmpty) return '';
    return xml
        .replaceAll(RegExp(r'>\s+<'), '><')
        .replaceAll(RegExp(r'\n\s*'), '')
        .trim();
  }

  static ({String result, String? error}) process(String input, {bool isMinify = false}) {
    if (input.trim().isEmpty) {
      return (result: '', error: '请输入 XML');
    }
    try {
      if (isMinify) {
        return (result: minify(input), error: null);
      }
      return (result: format(input), error: null);
    } catch (e) {
      return (result: input, error: '格式化失败: $e');
    }
  }
}
