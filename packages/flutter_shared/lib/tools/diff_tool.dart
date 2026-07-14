import 'dart:math' as dartmath;

/// 差异类型
enum DiffType { same, added, removed }

/// 单行差异
class DiffLine {
  final DiffType type;
  final String text;
  final int oldLine;
  final int newLine;

  const DiffLine({required this.type, required this.text, required this.oldLine, required this.newLine});
}

/// 文本差异比较（简化版，行级 diff）
class DiffTool {
  DiffTool._();

  /// 计算行级 diff（简化版 LCS 算法）
  static List<DiffLine> diff(String oldText, String newText) {
    final oldLines = oldText.split('\n');
    final newLines = newText.split('\n');
    final result = <DiffLine>[];

    // 最长公共子序列
    final m = oldLines.length;
    final n = newLines.length;
    final dp = List.generate(m + 1, (_) => List.filled(n + 1, 0));

    for (int i = 1; i <= m; i++) {
      for (int j = 1; j <= n; j++) {
        if (oldLines[i - 1] == newLines[j - 1]) {
          dp[i][j] = dp[i - 1][j - 1] + 1;
        } else {
          dp[i][j] = dartmath.max(dp[i - 1][j], dp[i][j - 1]);
        }
      }
    }

    // 回溯
    int i = m, j = n;
    final reverse = <DiffLine>[];
    while (i > 0 || j > 0) {
      if (i > 0 && j > 0 && oldLines[i - 1] == newLines[j - 1]) {
        reverse.add(DiffLine(type: DiffType.same, text: oldLines[i - 1], oldLine: i, newLine: j));
        i--; j--;
      } else if (j > 0 && (i == 0 || dp[i][j - 1] >= dp[i - 1][j])) {
        reverse.add(DiffLine(type: DiffType.added, text: newLines[j - 1], oldLine: 0, newLine: j));
        j--;
      } else if (i > 0) {
        reverse.add(DiffLine(type: DiffType.removed, text: oldLines[i - 1], oldLine: i, newLine: 0));
        i--;
      }
    }

    result.addAll(reverse.reversed);
    return result;
  }

  /// 统计
  static ({int added, int removed}) stats(String oldText, String newText) {
    final lines = diff(oldText, newText);
    int added = 0, removed = 0;
    for (final line in lines) {
      if (line.type == DiffType.added) added++;
      if (line.type == DiffType.removed) removed++;
    }
    return (added: added, removed: removed);
  }
}
