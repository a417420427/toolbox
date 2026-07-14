/// 倒计时工具
class CountdownTool {
  CountdownTool._();

  /// 倒计时结果
  static ({
    int days, int hours, int minutes, int seconds,
    bool isPast, String description,
  }) calculate(DateTime target) {
    final now = DateTime.now();
    final diff = target.difference(now);
    final isPast = diff.isNegative;
    final abs = diff.abs();

    final days = abs.inDays;
    final hours = abs.inHours % 24;
    final minutes = abs.inMinutes % 60;
    final seconds = abs.inSeconds % 60;

    String desc;
    if (isPast) {
      if (days > 365) {
        final y = days ~/ 365;
        final m = (days % 365) ~/ 30;
        desc = '已过去 $y 年 $m 个月';
      } else if (days > 30) {
        final m = days ~/ 30;
        final d = days % 30;
        desc = '已过去 $m 个月 $d 天';
      } else if (days > 0) {
        desc = '已过去 $days 天 $hours 小时';
      } else if (hours > 0) {
        desc = '已过去 $hours 小时 $minutes 分钟';
      } else if (minutes > 0) {
        desc = '已过去 $minutes 分钟 $seconds 秒';
      } else {
        desc = '刚刚过去';
      }
    } else {
      if (days > 365) {
        final y = days ~/ 365;
        final m = (days % 365) ~/ 30;
        desc = '还剩 $y 年 $m 个月';
      } else if (days > 30) {
        final m = days ~/ 30;
        final d = days % 30;
        desc = '还剩 $m 个月 $d 天';
      } else if (days > 0) {
        desc = '还剩 $days 天 $hours 小时';
      } else if (hours > 0) {
        desc = '还剩 $hours 小时 $minutes 分钟';
      } else if (minutes > 0) {
        desc = '还剩 $minutes 分钟 $seconds 秒';
      } else {
        desc = '即将到来';
      }
    }

    return (
      days: days,
      hours: hours,
      minutes: minutes,
      seconds: seconds,
      isPast: isPast,
      description: desc,
    );
  }
}
