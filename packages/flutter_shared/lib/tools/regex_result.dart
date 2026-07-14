/// 正则表达式匹配结果项
class RegexMatchItem {
  final int index;
  final String match;
  final int start;
  final int end;

  const RegexMatchItem({
    required this.index,
    required this.match,
    required this.start,
    required this.end,
  });
}

/// 正则表达式测试结果
class RegexResult {
  final List<RegexMatchItem> matches;
  final String? error;

  int get matchCount => matches.length;
  bool get isValid => error == null;

  const RegexResult({required this.matches, this.error});
}
