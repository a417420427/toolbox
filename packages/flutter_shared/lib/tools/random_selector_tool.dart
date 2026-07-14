import 'dart:math';

/// 随机选择器工具
class RandomSelectorTool {
  RandomSelectorTool._();

  /// 抛硬币
  static String flipCoin() {
    final rng = Random();
    return rng.nextBool() ? '正面' : '反面';
  }

  /// 随机数字（含范围）
  static int randomInt(int min, int max) {
    if (min > max) {
      final t = min; min = max; max = t;
    }
    return min + Random().nextInt(max - min + 1);
  }

  /// 从列表中随机选
  static ({String result, String? error}) pickFromList(String itemsCsv) {
    if (itemsCsv.trim().isEmpty) {
      return (result: '', error: '请输入选项，用逗号分隔');
    }
    final items = itemsCsv
        .split(RegExp(r'[,，\n]'))
        .map((s) => s.trim())
        .where((s) => s.isNotEmpty)
        .toList();
    if (items.isEmpty) {
      return (result: '', error: '没有有效选项');
    }
    if (items.length == 1) {
      return (result: items.first, error: null);
    }
    final rng = Random();
    return (result: items[rng.nextInt(items.length)], error: null);
  }

  /// 抽签 — 从列表中返回多个不重复的结果
  static List<String> drawLots(String itemsCsv, int count) {
    final items = itemsCsv
        .split(RegExp(r'[,，\n]'))
        .map((s) => s.trim())
        .where((s) => s.isNotEmpty)
        .toList();
    if (items.isEmpty || count <= 0) return [];
    final shuffled = List<String>.from(items)..shuffle();
    return shuffled.take(count.clamp(1, items.length)).toList();
  }

  /// 随机颜色
  static ({int r, int g, int b, String hex}) randomColor() {
    final rng = Random();
    final r = rng.nextInt(256);
    final g = rng.nextInt(256);
    final b = rng.nextInt(256);
    final hex = '#${r.toRadixString(16).padLeft(2, '0')}'
        '${g.toRadixString(16).padLeft(2, '0')}'
        '${b.toRadixString(16).padLeft(2, '0')}'
        .toUpperCase();
    return (r: r, g: g, b: b, hex: hex);
  }
}
