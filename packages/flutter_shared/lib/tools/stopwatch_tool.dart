/// 秒表工具
class StopwatchTool {
  StopwatchTool._();

  /// 格式化毫秒为 HH:MM:SS.ms
  static String format(Duration duration) {
    final h = duration.inHours.toString().padLeft(2, '0');
    final m = (duration.inMinutes % 60).toString().padLeft(2, '0');
    final s = (duration.inSeconds % 60).toString().padLeft(2, '0');
    final ms = (duration.inMilliseconds % 1000).toString().padLeft(3, '0');
    if (duration.inHours > 0) return '$h:$m:$s.$ms';
    return '$m:$s.$ms';
  }
}
