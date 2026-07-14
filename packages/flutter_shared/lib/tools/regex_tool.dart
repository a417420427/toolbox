import 'regex_result.dart';

/// 正则表达式测试器
class RegexTool {
  RegexTool._();

  /// 测试结果
  static RegexResult test(String pattern, String testText, {bool global = true, bool caseSensitive = true, bool multiLine = false, bool dotAll = false, bool unicode = false}) {
    if (pattern.isEmpty) {
      return RegexResult(matches: [], error: '请输入正则表达式');
    }

    try {
      final regex = RegExp(
        pattern,
        caseSensitive: caseSensitive,
        multiLine: multiLine,
        dotAll: dotAll,
        unicode: unicode,
      );

      final matches = regex.allMatches(testText);
      final items = <RegexMatchItem>[];
      int idx = 0;

      // 限制显示数量，防止过多
      const maxMatches = 1000;
      for (final m in matches) {
        if (idx >= maxMatches) {
          items.add(RegexMatchItem(
            index: idx,
            match: '... (超过 $maxMatches 个匹配，已截断)',
            start: m.start,
            end: m.end,
          ));
          idx++;
          break;
        }
        items.add(RegexMatchItem(
          index: idx,
          match: m.group(0) ?? '',
          start: m.start,
          end: m.end,
        ));
        idx++;
      }

      return RegexResult(matches: items);
    } catch (e) {
      return RegexResult(
        matches: [],
        error: '正则表达式错误: $e',
      );
    }
  }

  /// 常用正则速查
  static const List<({String label, String pattern, String description})> quickPatterns = [
    (label: '邮箱', pattern: r'^[\w.+-]+@[\w-]+\.[\w.-]+$', description: '匹配 Email 地址'),
    (label: 'URL', pattern: r'https?://[\w./?=&%-]+', description: '匹配 HTTP/HTTPS URL'),
    (label: '手机号', pattern: r'1[3-9]\d{9}', description: '中国大陆手机号'),
    (label: 'IP v4', pattern: r'\b\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\b', description: 'IPv4 地址'),
    (label: '日期', pattern: r'\d{4}-\d{2}-\d{2}', description: 'YYYY-MM-DD 格式日期'),
    (label: '中文', pattern: r'[\u4e00-\u9fff]+', description: '匹配中文字符'),
    (label: '空白行', pattern: r'^\s*$', description: '匹配空行或纯空白行'),
    (label: 'Hex颜色', pattern: r'#?[\da-fA-F]{6}\b', description: '匹配 HEX 颜色值'),
  ];

  /// 常用 flags 描述
  static const Map<String, String> flagDescriptions = {
    'g': '全局匹配 (global)',
    'i': '忽略大小写 (ignoreCase)',
    'm': '多行模式 (multiLine)',
    's': '点号匹配换行 (dotAll)',
    'u': 'Unicode 模式',
  };
}
