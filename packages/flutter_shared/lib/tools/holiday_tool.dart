/// 节假日查询
class HolidayTool {
  HolidayTool._();

  /// 中国法定节假日（固定日期）
  static const _fixedHolidays = {
    '元旦': (1, 1),
    '劳动节': (5, 1),
    '国庆节': (10, 1),
    '儿童节': (6, 1),   // 非全体法定但常见
    '圣诞节': (12, 25),  // 非法定但常用
  };

  /// 获取某年所有法定节假日列表（含农历计算简化版 + 固定日期）
  static List<({String name, DateTime date})> getHolidays(int year) {
    final list = <({String name, DateTime date})>[];

    // 固定公历节日
    for (final entry in _fixedHolidays.entries) {
      list.add((name: entry.key, date: DateTime(year, entry.value.$1, entry.value.$2)));
    }

    // 春节（农历正月初一，简化：20251029→1/29, 20260217→2/17）
    final springFestivals = _springFestivalDates(year);
    if (springFestivals != null) {
      list.add((name: '春节', date: springFestivals));
      // 除夕
      list.add((name: '除夕', date: springFestivals.subtract(const Duration(days: 1))));
    }

    // 清明节（4月4或5日）
    list.add((name: '清明节', date: _qingmingDate(year)));

    // 端午节（农历五月初五，简化估算）
    final dragonBoat = _dragonBoatDate(year);
    if (dragonBoat != null) {
      list.add((name: '端午节', date: dragonBoat));
    }

    // 中秋节（农历八月十五，简化估算）
    final midAutumn = _midAutumnDate(year);
    if (midAutumn != null) {
      list.add((name: '中秋节', date: midAutumn));
    }

    list.sort((a, b) => a.date.compareTo(b.date));
    return list;
  }

  /// 春节日期（2025-2028 已知值 + 近似推算）
  static DateTime? _springFestivalDates(int year) {
    // 已知数据（来源：国务院公布）
    const known = <int, (int, int)>{
      2024: (2, 10), 2025: (1, 29), 2026: (2, 17),
      2027: (2, 6),  2028: (1, 26), 2029: (2, 13),
      2030: (2, 3),
    };
    if (known.containsKey(year)) {
      final v = known[year]!;
      return DateTime(year, v.$1, v.$2);
    }
    return null;
  }

  /// 清明节（4月4日或5日，简单用4日）
  static DateTime _qingmingDate(int year) => DateTime(year, 4, 4);

  /// 端午节（六月初五，近似用6月第一周 + 偏移，简化）
  static DateTime? _dragonBoatDate(int year) {
    const known = <int, (int, int)>{
      2024: (6, 10), 2025: (5, 31), 2026: (6, 19),
      2027: (6, 9),  2028: (5, 28), 2029: (6, 16),
      2030: (6, 5),
    };
    if (known.containsKey(year)) {
      final v = known[year]!;
      return DateTime(year, v.$1, v.$2);
    }
    return null;
  }

  /// 中秋节（八月十五，近似）
  static DateTime? _midAutumnDate(int year) {
    const known = <int, (int, int)>{
      2024: (9, 17), 2025: (10, 6), 2026: (9, 25),
      2027: (9, 15), 2028: (10, 3), 2029: (9, 21),
      2030: (9, 12),
    };
    if (known.containsKey(year)) {
      final v = known[year]!;
      return DateTime(year, v.$1, v.$2);
    }
    return null;
  }

  /// 获取当月的节假日
  static List<({String name, DateTime date})> getHolidaysForMonth(int year, int month) {
    return getHolidays(year).where((h) => h.date.month == month).toList();
  }

  /// 距离最近节假日
  static ({String name, DateTime date, int daysUntil})? nearestHoliday(int year) {
    final now = DateTime.now();
    final holidays = getHolidays(year);
    // 也查次年
    holidays.addAll(getHolidays(year + 1));

    final future = holidays.where((h) => h.date.isAfter(now)).toList();
    if (future.isEmpty) return null;

    future.sort((a, b) => a.date.compareTo(b.date));
    final next = future.first;
    return (name: next.name, date: next.date, daysUntil: next.date.difference(now).inDays);
  }
}
