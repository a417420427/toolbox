import 'package:flutter/material.dart';
import 'package:toolbox_flutter_shared/toolbox_flutter_shared.dart';
import 'dart:async';

/// 节假日查询
class HolidayPage extends StatefulWidget {
  const HolidayPage({super.key});

  @override
  State<HolidayPage> createState() => _HolidayPageState();
}

class _HolidayPageState extends State<HolidayPage> {
  int _year = DateTime.now().year;
  Timer? _timer;

  @override
  void initState() {
    super.initState();
    _timer = Timer.periodic(const Duration(seconds: 60), (_) {
      if (mounted) setState(() {});
    });
  }

  @override
  void dispose() {
    _timer?.cancel();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final holidays = HolidayTool.getHolidays(_year);
    final nearest = HolidayTool.nearestHoliday(_year);
    final now = DateTime.now();

    return SingleChildScrollView(
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // 最近节假日
          if (nearest != null)
            Card(
              color: AppColors.brand50,
              child: Padding(
                padding: const EdgeInsets.all(16),
                child: Row(
                  children: [
                    const Icon(Icons.event, color: AppColors.brand500, size: 28),
                    const SizedBox(width: 12),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text('下一个节假日', style: TextStyle(fontSize: 12, color: AppColors.neutral400)),
                          const SizedBox(height: 4),
                          Text(nearest.name, style: TextStyle(fontSize: 18, fontWeight: FontWeight.w600, color: AppColors.brand500)),
                          Text('${nearest.daysUntil} 天后  (${nearest.date.month}月${nearest.date.day}日)', style: TextStyle(fontSize: 13, color: AppColors.neutral500)),
                        ],
                      ),
                    ),
                  ],
                ),
              ),
            ),
          const SizedBox(height: 8),
          // 年份切换
          Row(
            children: [
              IconButton(
                icon: const Icon(Icons.chevron_left),
                onPressed: () => setState(() => _year--),
              ),
              Text('$_year 年节假日', style: const TextStyle(fontSize: 16, fontWeight: FontWeight.w600)),
              IconButton(
                icon: const Icon(Icons.chevron_right),
                onPressed: () => setState(() => _year++),
              ),
              const Spacer(),
              if (_year != now.year)
                TextButton(
                  onPressed: () => setState(() => _year = now.year),
                  child: const Text('今年'),
                ),
            ],
          ),
          const Divider(),
          // 按月份分组
          ..._groupByMonth(holidays).entries.map((entry) {
            return Padding(
              padding: const EdgeInsets.only(bottom: 12),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text('${entry.key}月', style: const TextStyle(fontSize: 14, fontWeight: FontWeight.w600, color: AppColors.neutral500)),
                  const SizedBox(height: 4),
                  ...entry.value.map((h) => _holidayItem(h)),
                ],
              ),
            );
          }),
        ],
      ),
    );
  }

  Widget _holidayItem(({String name, DateTime date}) h) {
    final now = DateTime.now();
    final diff = h.date.difference(now).inDays;
    final isUpcoming = diff >= 0 && diff <= 30;

    return Container(
      margin: const EdgeInsets.only(top: 4),
      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 10),
      decoration: BoxDecoration(
        color: Theme.of(context).colorScheme.surface,
        borderRadius: BorderRadius.circular(8),
        border: Border.all(
          color: isUpcoming ? AppColors.brand500.withAlpha(80) : AppColors.neutral200,
        ),
      ),
      child: Row(
        children: [
          Text('${h.date.month}/${h.date.day}', style: const TextStyle(fontSize: 14, fontWeight: FontWeight.w600, fontFamily: 'monospace')),
          const SizedBox(width: 12),
          Expanded(child: Text(h.name, style: const TextStyle(fontSize: 14))),
          if (isUpcoming && diff > 0)
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
              decoration: BoxDecoration(
                color: AppColors.brand50,
                borderRadius: BorderRadius.circular(10),
              ),
              child: Text('$diff 天后', style: const TextStyle(fontSize: 11, color: AppColors.brand500)),
            )
          else if (diff == 0)
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
              decoration: BoxDecoration(
                color: Colors.orange.withAlpha(30),
                borderRadius: BorderRadius.circular(10),
              ),
              child: const Text('今天!', style: TextStyle(fontSize: 11, color: Colors.orange)),
            ),
        ],
      ),
    );
  }

  Map<int, List<({String name, DateTime date})>> _groupByMonth(List<({String name, DateTime date})> holidays) {
    final map = <int, List<({String name, DateTime date})>>{};
    for (final h in holidays) {
      map.putIfAbsent(h.date.month, () => []).add(h);
    }
    // 按月份排序 key
    final sorted = <int, List<({String name, DateTime date})>>{};
    final keys = map.keys.toList()..sort();
    for (final k in keys) {
      sorted[k] = map[k]!;
    }
    return sorted;
  }
}
