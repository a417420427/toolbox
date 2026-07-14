import 'package:flutter/material.dart';
import 'package:toolbox_flutter_shared/toolbox_flutter_shared.dart';
import 'dart:async';

/// 世界时区查询
class TimeZonePage extends StatefulWidget {
  const TimeZonePage({super.key});

  @override
  State<TimeZonePage> createState() => _TimeZonePageState();
}

class _TimeZonePageState extends State<TimeZonePage> {
  final TextEditingController _searchCtrl = TextEditingController();
  Timer? _timer;
  List<TimeZoneEntry> _results = TimeZoneTool.zones;

  @override
  void initState() {
    super.initState();
    _timer = Timer.periodic(const Duration(seconds: 10), (_) {
      if (mounted) setState(() {});
    });
    _searchCtrl.addListener(_search);
  }

  @override
  void dispose() {
    _timer?.cancel();
    _searchCtrl.dispose();
    super.dispose();
  }

  void _search() {
    setState(() => _results = TimeZoneTool.search(_searchCtrl.text));
  }

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        // 搜索框
        Padding(
          padding: const EdgeInsets.fromLTRB(16, 16, 16, 8),
          child: TextField(
            controller: _searchCtrl,
            decoration: InputDecoration(
              hintText: '搜索城市或时区…',
              prefixIcon: const Icon(Icons.search, size: 20),
              border: OutlineInputBorder(borderRadius: BorderRadius.circular(12)),
              contentPadding: const EdgeInsets.symmetric(vertical: 12),
              suffixIcon: _searchCtrl.text.isNotEmpty
                  ? IconButton(icon: const Icon(Icons.clear, size: 18), onPressed: () { _searchCtrl.clear(); _search(); })
                  : null,
            ),
          ),
        ),
        // 时区列表
        Expanded(
          child: ListView.separated(
            padding: const EdgeInsets.symmetric(horizontal: 16),
            itemCount: _results.length,
            separatorBuilder: (_, __) => const Divider(height: 1, indent: 16),
            itemBuilder: (context, index) {
              final z = _results[index];
              final isLocal = z.offsetMinutes == DateTime.now().timeZoneOffset.inMinutes;
              return Container(
                padding: const EdgeInsets.symmetric(vertical: 12),
                child: Row(
                  children: [
                    // 时间
                    SizedBox(
                      width: 72,
                      child: Text(
                        z.currentTime,
                        style: TextStyle(
                          fontSize: 18,
                          fontWeight: FontWeight.w600,
                          fontFamily: 'monospace',
                          color: isLocal ? AppColors.brand500 : null,
                        ),
                      ),
                    ),
                    const SizedBox(width: 12),
                    // 名称 + 城市
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Row(
                            children: [
                              Text(z.name, style: const TextStyle(fontSize: 14, fontWeight: FontWeight.w500)),
                              if (isLocal)
                                Container(
                                  margin: const EdgeInsets.only(left: 6),
                                  padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 1),
                                  decoration: BoxDecoration(
                                    color: AppColors.brand50,
                                    borderRadius: BorderRadius.circular(8),
                                  ),
                                  child: const Text('本地', style: TextStyle(fontSize: 10, color: AppColors.brand500)),
                                ),
                            ],
                          ),
                          const SizedBox(height: 2),
                          Text(z.city, style: const TextStyle(fontSize: 12, color: AppColors.neutral400)),
                        ],
                      ),
                    ),
                    // 时差
                    Text(
                      z.code,
                      style: const TextStyle(fontSize: 12, color: AppColors.neutral400),
                    ),
                    const SizedBox(width: 8),
                    SizedBox(
                      width: 48,
                      child: Text(
                        z.diffFromCST(),
                        textAlign: TextAlign.right,
                        style: TextStyle(
                          fontSize: 12,
                          color: z.offsetMinutes == 480 ? AppColors.neutral400 : Colors.orange,
                        ),
                      ),
                    ),
                  ],
                ),
              );
            },
          ),
        ),
      ],
    );
  }
}
