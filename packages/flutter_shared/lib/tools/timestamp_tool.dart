
/// 时间戳工具 — 秒级/毫秒级互转
class TimestampTool {
  TimestampTool._();

  /// 时间戳 → DateTime（自动识别秒/毫秒）
  static ({DateTime dateTime, bool isMs}) toDateTime(num timestamp) {
    if (timestamp > 1e12) {
      // 毫秒级 (13 digits)
      return (
        dateTime: DateTime.fromMillisecondsSinceEpoch(timestamp.toInt()),
        isMs: true,
      );
    } else {
      // 秒级 (10 digits)
      return (
        dateTime: DateTime.fromMillisecondsSinceEpoch(timestamp.toInt() * 1000),
        isMs: false,
      );
    }
  }

  /// DateTime → 秒级时间戳
  static int toSeconds(DateTime dt) => dt.millisecondsSinceEpoch ~/ 1000;

  /// DateTime → 毫秒级时间戳
  static int toMilliseconds(DateTime dt) => dt.millisecondsSinceEpoch;

  /// 格式化为 ISO 8601
  static String toIso(DateTime dt) => dt.toIso8601String();

  /// 格式化为中国常用格式: 2024-01-15 10:30:00
  static String toChinese(DateTime dt) {
    return '${dt.year.toString().padLeft(4, '0')}-'
        '${dt.month.toString().padLeft(2, '0')}-'
        '${dt.day.toString().padLeft(2, '0')} '
        '${dt.hour.toString().padLeft(2, '0')}:'
        '${dt.minute.toString().padLeft(2, '0')}:'
        '${dt.second.toString().padLeft(2, '0')}';
  }

  /// 格式化为美国格式: 01/15/2024 10:30:00 AM
  static String toAmerican(DateTime dt) {
    final hour = dt.hour > 12 ? dt.hour - 12 : (dt.hour == 0 ? 12 : dt.hour);
    final ampm = dt.hour >= 12 ? 'PM' : 'AM';
    return '${dt.month.toString().padLeft(2, '0')}/'
        '${dt.day.toString().padLeft(2, '0')}/'
        '${dt.year} '
        '$hour:'
        '${dt.minute.toString().padLeft(2, '0')}:'
        '${dt.second.toString().padLeft(2, '0')} $ampm';
  }

  /// 相对时间描述
  static String relative(DateTime dt) {
    final now = DateTime.now();
    final diff = dt.difference(now);
    final seconds = diff.inSeconds.abs();

    if (seconds < 60) return '几秒${diff.isNegative ? '前' : '后'}';
    if (seconds < 3600) return '${seconds ~/ 60} 分钟${diff.isNegative ? '前' : '后'}';
    if (seconds < 86400) return '${seconds ~/ 3600} 小时${diff.isNegative ? '前' : '后'}';
    if (seconds < 172800) return diff.isNegative ? '昨天' : '明天';
    if (seconds < 604800) return '${seconds ~/ 86400} 天${diff.isNegative ? '前' : '后'}';
    if (seconds < 2592000) return '${seconds ~/ 604800} 周${diff.isNegative ? '前' : '后'}';
    if (seconds < 31536000) return '${seconds ~/ 2592000} 个月${diff.isNegative ? '前' : '后'}';
    return '${seconds ~/ 31536000} 年${diff.isNegative ? '前' : '后'}';
  }

  /// 获取当前时间戳（秒）
  static int nowSeconds() => DateTime.now().millisecondsSinceEpoch ~/ 1000;

  /// 获取当前时间戳（毫秒）
  static int nowMilliseconds() => DateTime.now().millisecondsSinceEpoch;
}
