import 'dart:async';
import 'package:flutter/material.dart';
import 'package:toolbox_flutter_shared/toolbox_flutter_shared.dart';

class CountdownPage extends StatefulWidget {
  const CountdownPage({super.key});

  @override
  State<CountdownPage> createState() => _CountdownPageState();
}

class _CountdownPageState extends State<CountdownPage> {
  DateTime? _target;
  String _display = '设定一个目标日期';
  Timer? _timer;
  int _days = 0;
  int _hours = 0;
  int _minutes = 0;
  int _seconds = 0;

  @override
  void dispose() {
    _timer?.cancel();
    super.dispose();
  }

  void _startTimer() {
    _timer?.cancel();
    _timer = Timer.periodic(const Duration(seconds: 1), (_) {
      _update();
    });
    _update();
  }

  void _update() {
    if (_target == null) return;
    final r = CountdownTool.calculate(_target!);
    if (!mounted) return;
    setState(() {
      _days = r.days;
      _hours = r.hours;
      _minutes = r.minutes;
      _seconds = r.seconds;
      _display = r.description;
    });
  }

  Future<void> _pickDate() async {
    final picked = await showDatePicker(
      context: context,
      initialDate: _target ?? DateTime.now().add(const Duration(days: 30)),
      firstDate: DateTime.now().subtract(const Duration(days: 365 * 10)),
      lastDate: DateTime.now().add(const Duration(days: 365 * 10)),
    );
    if (picked != null) {
      setState(() {
        _target = DateTime(picked.year, picked.month, picked.day, 0, 0, 0);
      });
      _startTimer();
    }
  }

  @override
  Widget build(BuildContext context) {
    final isPast = _target != null && DateTime.now().isAfter(_target!);

    return Column(
      children: [
        const Spacer(flex: 2),
        // 大数字显示
        if (_target != null)
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 16),
            child: _TimeDisplay(
              days: _days,
              hours: _hours,
              minutes: _minutes,
              seconds: _seconds,
              isPast: isPast,
            ),
          )
        else
          Padding(
            padding: const EdgeInsets.all(32),
            child: Icon(Icons.timer_off_outlined, size: 80, color: AppColors.neutral300),
          ),
        const SizedBox(height: 16),
        // 描述文字
        Padding(
          padding: const EdgeInsets.symmetric(horizontal: 32),
          child: Text(
            _display,
            textAlign: TextAlign.center,
            style: TextStyle(
              fontSize: 16,
              color: isPast ? AppColors.warning : AppColors.brand500,
              fontWeight: FontWeight.w500,
            ),
          ),
        ),
        // 目标日期显示
        if (_target != null)
          Padding(
            padding: const EdgeInsets.only(top: 8),
            child: Text(
              '目标: ${_target!.year}-${_target!.month.toString().padLeft(2, '0')}-${_target!.day.toString().padLeft(2, '0')}',
              style: const TextStyle(fontSize: 13, color: AppColors.neutral400),
            ),
          ),
        const Spacer(flex: 2),
        // 按钮
        Padding(
          padding: const EdgeInsets.all(16),
          child: SizedBox(
            width: double.infinity,
            child: FilledButton.icon(
              onPressed: _pickDate,
              icon: const Icon(Icons.calendar_today),
              label: Text(_target == null ? '设定目标日期' : '更改目标日期'),
              style: FilledButton.styleFrom(
                padding: const EdgeInsets.symmetric(vertical: 16),
                textStyle: const TextStyle(fontSize: 16),
              ),
            ),
          ),
        ),
        const Spacer(flex: 1),
      ],
    );
  }
}

class _TimeDisplay extends StatelessWidget {
  final int days, hours, minutes, seconds;
  final bool isPast;

  const _TimeDisplay({
    required this.days, required this.hours,
    required this.minutes, required this.seconds,
    required this.isPast,
  });

  @override
  Widget build(BuildContext context) {
    final color = isPast ? AppColors.warning : AppColors.brand500;
    return Column(
      children: [
        // 天
        if (days > 0)
          Padding(
            padding: const EdgeInsets.only(bottom: 12),
            child: Column(
              children: [
                Text(
                  days.toString(),
                  style: TextStyle(fontSize: 72, fontWeight: FontWeight.w200, color: color, fontFamily: 'monospace'),
                ),
                const Text('天', style: TextStyle(fontSize: 14, color: AppColors.neutral400)),
              ],
            ),
          ),
        // 时:分:秒
        Row(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            _timeUnit(hours, '时', color),
            _separator(color),
            _timeUnit(minutes, '分', color),
            _separator(color),
            _timeUnit(seconds, '秒', color),
          ],
        ),
      ],
    );
  }

  Widget _timeUnit(int value, String label, Color color) {
    return Column(
      children: [
        Text(
          value.toString().padLeft(2, '0'),
          style: TextStyle(fontSize: 48, fontWeight: FontWeight.w300, color: color, fontFamily: 'monospace'),
        ),
        Text(label, style: const TextStyle(fontSize: 12, color: AppColors.neutral400)),
      ],
    );
  }

  Widget _separator(Color color) {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 4),
      child: Text(':', style: TextStyle(fontSize: 48, fontWeight: FontWeight.w300, color: color.withValues(alpha: 0.4))),
    );
  }
}
