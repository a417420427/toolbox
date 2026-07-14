/// 日期计算工具
class DateCalcTool {
  DateCalcTool._();

  /// 日期差
  static ({int days, int hours, int minutes, int totalDays}) dateDiff(
    DateTime start, DateTime end,
  ) {
    final diff = end.difference(start);
    return (
      totalDays: diff.inDays,
      hours: diff.inHours,
      minutes: diff.inMinutes,
      days: diff.inDays.abs(),
    );
  }

  /// 加减天数
  static DateTime addDays(DateTime date, int days) {
    return date.add(Duration(days: days));
  }

  /// 加减周数
  static DateTime addWeeks(DateTime date, int weeks) {
    return date.add(Duration(days: weeks * 7));
  }

  /// 加减月数（精确月份加减）
  static DateTime addMonths(DateTime date, int months) {
    int newMonth = date.month + months;
    int yearDelta = (newMonth - 1) ~/ 12;
    int m = ((newMonth - 1) % 12) + 1;
    int y = date.year + yearDelta;
    // 处理目标月份天数超出
    int maxDay = _daysInMonth(y, m);
    int d = date.day > maxDay ? maxDay : date.day;
    return DateTime(y, m, d, date.hour, date.minute, date.second);
  }

  /// 加减年数
  static DateTime addYears(DateTime date, int years) {
    int y = date.year + years;
    int maxDay = _daysInMonth(y, date.month);
    int d = date.day > maxDay ? maxDay : date.day;
    return DateTime(y, date.month, d, date.hour, date.minute, date.second);
  }

  /// 计算工作日天数（不含周六日）
  static int weekdaysBetween(DateTime start, DateTime end) {
    int count = 0;
    var day = start.isBefore(end) ? start : end;
    final target = start.isBefore(end) ? end : start;
    while (day.isBefore(target)) {
      if (day.weekday != DateTime.saturday && day.weekday != DateTime.sunday) {
        count++;
      }
      day = day.add(const Duration(days: 1));
    }
    return count;
  }

  /// 判断是否为闰年
  static bool isLeapYear(int year) {
    return (year % 4 == 0 && year % 100 != 0) || (year % 400 == 0);
  }

  /// 获取某月天数
  static int daysInMonth(int year, int month) => _daysInMonth(year, month);

  /// 年龄计算
  static ({int years, int months, int days}) age(DateTime birthDate) {
    final now = DateTime.now();
    int years = now.year - birthDate.year;
    int months = now.month - birthDate.month;
    int days = now.day - birthDate.day;

    if (days < 0) {
      months--;
      days += _daysInMonth(now.year, now.month - 1);
    }
    if (months < 0) {
      years--;
      months += 12;
    }
    return (years: years, months: months, days: days);
  }

  static int _daysInMonth(int year, int month) {
    if (month == 2) return isLeapYear(year) ? 29 : 28;
    if ([4, 6, 9, 11].contains(month)) return 30;
    return 31;
  }
}
