/// 排序模式
enum SortMode { asc, desc, lengthAsc, lengthDesc, reverse }

/// 去重模式
enum DedupMode { all, caseInsensitive, trimThenDedup }

/// 文本排序 / 去重工具
class SortTool {
  SortTool._();

  /// 排序文本行
  static String sort(String input, SortMode mode) {
    final lines = input.split('\n');
    final trimmed = lines.map((l) => l.trimRight()).toList();

    switch (mode) {
      case SortMode.asc:
        trimmed.sort((a, b) => a.compareTo(b));
      case SortMode.desc:
        trimmed.sort((a, b) => b.compareTo(a));
      case SortMode.lengthAsc:
        trimmed.sort((a, b) => a.length.compareTo(b.length));
      case SortMode.lengthDesc:
        trimmed.sort((a, b) => b.length.compareTo(a.length));
      case SortMode.reverse:
        trimmed.sort((a, b) => 0);
        return trimmed.reversed.join('\n');
    }

    return trimmed.join('\n');
  }

  /// 去重文本行
  static String dedup(String input, DedupMode mode) {
    final lines = input.split('\n');
    final seen = <String>{};
    final result = <String>[];

    for (final line in lines) {
      final key = switch (mode) {
        DedupMode.all => line,
        DedupMode.caseInsensitive => line.toLowerCase(),
        DedupMode.trimThenDedup => line.trim(),
      };
      if (!seen.contains(key)) {
        seen.add(key);
        result.add(line);
      }
    }

    return result.join('\n');
  }

  /// 移除空行
  static String removeEmptyLines(String input) {
    return input.split('\n').where((l) => l.trim().isNotEmpty).join('\n');
  }

  /// 统计
  static ({int totalLines, int nonEmptyLines, int uniqueLines}) stats(String input) {
    final lines = input.split('\n');
    final total = lines.length;
    final nonEmpty = lines.where((l) => l.trim().isNotEmpty).length;
    final unique = lines.toSet().length;
    return (totalLines: total, nonEmptyLines: nonEmpty, uniqueLines: unique);
  }
}
