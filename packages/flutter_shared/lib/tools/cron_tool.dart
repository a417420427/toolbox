
/// Cron 表达式解析器
class CronTool {
  CronTool._();

  /// 解析结果
  static ({String description, String? error, List<String>? preview}) parse(
      String expression) {
    expression = expression.trim();
    if (expression.isEmpty) {
      return (description: '', error: '请输入 Cron 表达式', preview: null);
    }

    // 处理缩写
    final shortcuts = {
      '@yearly': '0 0 1 1 *',
      '@annually': '0 0 1 1 *',
      '@monthly': '0 0 1 * *',
      '@weekly': '0 0 * * 0',
      '@daily': '0 0 * * *',
      '@hourly': '0 * * * *',
    };

    if (shortcuts.containsKey(expression)) {
      final resolved = shortcuts[expression]!;
      return parse(resolved);
    }

    final parts = expression.split(RegExp(r'\s+'));
    if (parts.length < 5 || parts.length > 6) {
      return (
        description: '',
        error: 'Cron 表达式必须为 5 字段（标准）或 6 字段（含秒）格式',
        preview: null,
      );
    }

    try {
      final fields = parts.length == 6 ? parts.sublist(1) : parts;
      final seconds = parts.length == 6 ? parts[0] : '0';

      final desc = _describe(fields);

      final preview = _previewTimes(fields, seconds);
      return (description: desc, error: null, preview: preview);
    } catch (e) {
      return (description: '', error: '解析错误: $e', preview: null);
    }
  }

  static String _describe(List<String> fields) {
    final min = fields[0];
    final hour = fields[1];
    final dom = fields[2];
    final month = fields[3];
    final dow = fields[4];

    if (min == '*' && hour == '*' && dom == '*' && month == '*' && dow == '*') {
      return '每分钟执行';
    }

    final parts = <String>[];

    // 分钟描述
    if (min != '*') {
      if (min.startsWith('*/')) {
        parts.add('每 ${min.substring(2)} 分钟');
      } else if (min.contains(',')) {
        parts.add('第 $min 分钟');
      } else if (min.contains('-')) {
        parts.add('第 $min 分钟');
      } else {
        parts.add('第 $min 分钟');
      }
    }

    // 小时描述
    if (hour != '*') {
      if (hour.startsWith('*/')) {
        parts.add('每 ${hour.substring(2)} 小时');
      } else if (hour.contains(',')) {
        parts.add('${hour} 点');
      } else {
        parts.add('$hour 点');
      }
    } else if (min != '*') {
      // 小时为 * 但分钟不为 *，说明是每小时的第几分钟
      parts.add('每小时');
    }

    // 日期描述
    if (dom != '*') {
      if (dom.startsWith('*/')) {
      } else if (dom == 'L') {
        parts.add('每月最后一天');
      } else {
        parts.add('第 $dom 天');
      }
    }

    // 月份描述
    if (month != '*') {
      final months = ['', '1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'];
      if (month.contains(',')) {
        final names = month.split(',').map((m) => months[int.parse(m)]).join('、');
        parts.add(names);
      } else {
        parts.add(months[int.parse(month)]);
      }
    }

    // 星期描述
    if (dow != '*') {
      final days = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
      if (dow.contains(',')) {
        final names = dow.split(',').map((d) => days[int.parse(d)]).join('、');
        parts.add(names);
      } else {
        parts.add(days[int.parse(dow)]);
      }
    }

    if (parts.isEmpty) return '每分钟执行';

    // 构建自然语言
    // 对于 "0 0 * * *" → "每天 0 点"
    if (min == '0' && hour != '*' && dom == '*' && month == '*' && dow == '*') {
      return '每天 $hour 点整';
    }
    // "0 0 * * 0" → "每周日 0 点"
    if (min == '0' && hour != '*' && dom == '*' && month == '*' && dow != '*') {
      final days = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
      return '每${days[int.parse(dow)]} $hour 点整';
    }
    // "0 0 1 * *" → "每月 1 号 0 点"
    if (min == '0' && hour != '*' && dom != '*' && month == '*' && dow == '*') {
      return '每月 $dom 号 $hour 点整';
    }
    // "0 0 1 1 *" → "每年 1 月 1 号 0 点"
    if (min == '0' && hour != '*' && dom != '*' && month != '*' && dow == '*') {
      return '每年 $month 月 $dom 号 $hour 点整';
    }

    // 通用
    if (min == '0') {
      parts[0] = parts[0].replaceAll('第 0 分钟', '整点');
    }

    return parts.join(' ');
  }

  static List<String> _previewTimes(List<String> fields, String secondsField) {
    final times = <String>[];
    final now = DateTime.now();
    // 尝试生成接下来 5 次执行时间
    int maxIterations = 525600; // 1 year in minutes
    int count = 0;
    int iteration = 0;

    while (count < 5 && iteration < maxIterations) {
      iteration++;
      final testTime = now.add(Duration(minutes: iteration));
      if (_matches(testTime, fields)) {
        times.add(_formatTime(testTime));
        count++;
      }
    }

    return times;
  }

  static bool _matches(DateTime dt, List<String> fields) {
    final min = _matchesField(dt.minute, fields[0]);
    final hour = _matchesField(dt.hour, fields[1]);
    final dom = _matchesField(dt.day, fields[2]);
    final month = _matchesField(dt.month, fields[3]);
    final dow = _matchesField(dt.weekday % 7, fields[4]); // 0=Sunday
    return min && hour && dom && month && dow;
  }

  static bool _matchesField(int value, String field) {
    if (field == '*') return true;

    // Step: */5
    if (field.startsWith('*/')) {
      final step = int.parse(field.substring(2));
      return step > 0 && value % step == 0;
    }

    // Range: 1-5
    if (field.contains('-')) {
      final parts = field.split('-');
      final low = int.parse(parts[0]);
      final high = int.parse(parts[1]);
      return value >= low && value <= high;
    }

    // List: 1,3,5
    if (field.contains(',')) {
      return field.split(',').any((f) => _matchesField(value, f.trim()));
    }

    // Exact
    try {
      return value == int.parse(field);
    } catch (_) {
      return false;
    }
  }

  static String _formatTime(DateTime dt) {
    return '${dt.year.toString().padLeft(4, '0')}-'
        '${dt.month.toString().padLeft(2, '0')}-'
        '${dt.day.toString().padLeft(2, '0')} '
        '${dt.hour.toString().padLeft(2, '0')}:'
        '${dt.minute.toString().padLeft(2, '0')}:'
        '${dt.second.toString().padLeft(2, '0')}';
  }

  /// 常用预设
  static const List<({String label, String expression})> presets = [
    (label: '每分钟', expression: '* * * * *'),
    (label: '每5分钟', expression: '*/5 * * * *'),
    (label: '每15分钟', expression: '*/15 * * * *'),
    (label: '每30分钟', expression: '*/30 * * * *'),
    (label: '每小时', expression: '0 * * * *'),
    (label: '每天 0 点', expression: '0 0 * * *'),
    (label: '每天 9 点', expression: '0 9 * * *'),
    (label: '每周一早 9 点', expression: '0 9 * * 1'),
    (label: '每月 1 号 0 点', expression: '0 0 1 * *'),
    (label: '每年 1 月 1 号 0 点', expression: '0 0 1 1 *'),
    (label: '工作日 9 点', expression: '0 9 * * 1-5'),
  ];
}
