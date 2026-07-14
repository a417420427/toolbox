/// 时区查询工具
class TimeZoneEntry {
  final String name;
  final String city;
  final String code;      // 如 +08:00
  final int offsetMinutes;

  const TimeZoneEntry({
    required this.name,
    required this.city,
    required this.code,
    required this.offsetMinutes,
  });

  /// 当前时间
  String get currentTime {
    final utc = DateTime.now().toUtc();
    final local = utc.add(Duration(minutes: offsetMinutes));
    final h = local.hour.toString().padLeft(2, '0');
    final m = local.minute.toString().padLeft(2, '0');
    return '$h:$m';
  }

  /// 与 UTC+8 的时差描述
  String diffFromCST() {
    final diff = offsetMinutes - 480; // UTC+8 = 480min
    if (diff == 0) return '相同';
    final h = diff ~/ 60;
    final m = diff.abs() % 60;
    final sign = diff > 0 ? '+' : '';
    if (m == 0) return '$sign${h}h';
    return '$sign${h}h${m}min';
  }
}

/// 时区查询工具
class TimeZoneTool {
  TimeZoneTool._();

  static final List<TimeZoneEntry> zones = [
    TimeZoneEntry(name: 'PST (美西)', city: '洛杉矶/温哥华', code: 'UTC-8', offsetMinutes: -480),
    TimeZoneEntry(name: 'MST (美山)', city: '丹佛', code: 'UTC-7', offsetMinutes: -420),
    TimeZoneEntry(name: 'CST (美中)', city: '芝加哥/墨西哥城', code: 'UTC-6', offsetMinutes: -360),
    TimeZoneEntry(name: 'EST (美东)', city: '纽约/多伦多', code: 'UTC-5', offsetMinutes: -300),
    TimeZoneEntry(name: 'BRT', city: '圣保罗', code: 'UTC-3', offsetMinutes: -180),
    TimeZoneEntry(name: 'GMT/BST', city: '伦敦/都柏林', code: 'UTC+0/+1', offsetMinutes: 60),
    TimeZoneEntry(name: 'CET', city: '巴黎/柏林', code: 'UTC+1/+2', offsetMinutes: 120),
    TimeZoneEntry(name: 'EET', city: '雅典/赫尔辛基', code: 'UTC+2/+3', offsetMinutes: 180),
    TimeZoneEntry(name: 'MSK (莫斯科)', city: '莫斯科', code: 'UTC+3', offsetMinutes: 180),
    TimeZoneEntry(name: 'GST (海湾)', city: '迪拜/阿布扎比', code: 'UTC+4', offsetMinutes: 240),
    TimeZoneEntry(name: 'IST (印度)', city: '新德里', code: 'UTC+5:30', offsetMinutes: 330),
    TimeZoneEntry(name: 'CST (中国)', city: '北京/上海', code: 'UTC+8', offsetMinutes: 480),
    TimeZoneEntry(name: 'JST (日本)', city: '东京', code: 'UTC+9', offsetMinutes: 540),
    TimeZoneEntry(name: 'KST (韩国)', city: '首尔', code: 'UTC+9', offsetMinutes: 540),
    TimeZoneEntry(name: 'AWST (澳洲西)', city: '珀斯', code: 'UTC+8', offsetMinutes: 480),
    TimeZoneEntry(name: 'AEST (澳洲东)', city: '悉尼/墨尔本', code: 'UTC+10', offsetMinutes: 600),
    TimeZoneEntry(name: 'NZST (新西兰)', city: '奥克兰', code: 'UTC+12', offsetMinutes: 720),
  ];

  static List<TimeZoneEntry> search(String query) {
    if (query.isEmpty) return zones;
    final q = query.toLowerCase();
    return zones.where((z) =>
      z.name.toLowerCase().contains(q) ||
      z.city.toLowerCase().contains(q) ||
      z.code.toLowerCase().contains(q)
    ).toList();
  }
}
