import 'package:flutter/material.dart';
import 'package:toolbox_flutter_shared/toolbox_flutter_shared.dart';

class TimestampToolPage extends StatefulWidget {
  const TimestampToolPage({super.key});

  @override
  State<TimestampToolPage> createState() => _TimestampToolPageState();
}

class _TimestampToolPageState extends State<TimestampToolPage> {
  final TextEditingController _tsController = TextEditingController();
  final TextEditingController _dateController = TextEditingController();
  String _iso = '';
  String _chinese = '';
  String _american = '';
  String _relative = '';
  // ignore: unused_field
  DateTime? _currentDt;

  @override
  void initState() {
    super.initState();
    _fillNow();
  }

  @override
  void dispose() {
    _tsController.dispose();
    _dateController.dispose();
    super.dispose();
  }

  void _fillNow() {
    final now = DateTime.now();
    _currentDt = now;
    _tsController.text = TimestampTool.toSeconds(now).toString();
    _updateFromDt(now);
  }

  void _onTsChanged(String value) {
    final ts = int.tryParse(value);
    if (ts == null) return;
    final result = TimestampTool.toDateTime(ts);
    _currentDt = result.dateTime;
    _updateFromDt(result.dateTime);
  }

  void _onDateChanged(String value) {
    // 尝试解析多种格式
    DateTime? parsed;
    // ISO 8601
    parsed = DateTime.tryParse(value);
    if (parsed != null) {
      _currentDt = parsed;
      _tsController.text = TimestampTool.toSeconds(parsed).toString();
      _updateFromDt(parsed);
      return;
    }
    // 中文格式 2024-01-15 10:30:00
    try {
      final parts = value.split(RegExp(r'[\s\-\/:]'));
      if (parts.length >= 3) {
        parsed = DateTime(
          int.parse(parts[0]),
          int.parse(parts[1]),
          int.parse(parts[2]),
          parts.length > 3 ? int.parse(parts[3]) : 0,
          parts.length > 4 ? int.parse(parts[4]) : 0,
          parts.length > 5 ? int.parse(parts[5]) : 0,
        );
        _currentDt = parsed;
        _tsController.text = TimestampTool.toSeconds(parsed).toString();
        _updateFromDt(parsed);
      }
    } catch (_) {}
  }

  void _updateFromDt(DateTime dt) {
    setState(() {
      _iso = TimestampTool.toIso(dt);
      _chinese = TimestampTool.toChinese(dt);
      _american = TimestampTool.toAmerican(dt);
      _relative = TimestampTool.relative(dt);
    });
  }

  @override
  Widget build(BuildContext context) {
    return SingleChildScrollView(
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // 时间戳输入
          ToolCard(
            title: '时间戳',
            child: Row(
              children: [
                Expanded(
                  child: TextField(
                    controller: _tsController,
                    decoration: const InputDecoration(
                      hintText: '输入时间戳（秒）',
                      prefixIcon: Icon(Icons.schedule, size: 20),
                    ),
                    keyboardType: TextInputType.number,
                    style: const TextStyle(fontFamily: 'monospace', fontSize: 14),
                    onChanged: _onTsChanged,
                  ),
                ),
                const SizedBox(width: 8),
                FilledButton.tonal(
                  onPressed: _fillNow,
                  child: const Text('当前'),
                ),
              ],
            ),
          ),
          const SizedBox(height: 12),
          // 日期时间输入
          ToolCard(
            title: '日期时间',
            child: TextField(
              controller: _dateController,
              decoration: const InputDecoration(
                hintText: 'YYYY-MM-DD HH:mm:ss',
                prefixIcon: Icon(Icons.calendar_today, size: 20),
              ),
              style: const TextStyle(fontFamily: 'monospace', fontSize: 14),
              onChanged: _onDateChanged,
            ),
          ),
          const SizedBox(height: 16),
          // 结果面板
          ResultPanel(title: 'ISO 8601', content: _iso),
          const SizedBox(height: 8),
          ResultPanel(title: '中国格式', content: _chinese),
          const SizedBox(height: 8),
          ResultPanel(title: '美国格式', content: _american),
          const SizedBox(height: 8),
          ResultPanel(title: '相对时间', content: _relative, isMono: false),
        ],
      ),
    );
  }
}
