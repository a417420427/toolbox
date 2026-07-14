import 'dart:async';
import 'package:flutter/material.dart';
import 'package:toolbox_flutter_shared/toolbox_flutter_shared.dart';

/// 秒表工具
class StopwatchPage extends StatefulWidget {
  const StopwatchPage({super.key});

  @override
  State<StopwatchPage> createState() => _StopwatchPageState();
}

class _StopwatchPageState extends State<StopwatchPage> {
  final Stopwatch _stopwatch = Stopwatch();
  Timer? _timer;
  List<String> _laps = [];

  @override
  void dispose() {
    _timer?.cancel();
    super.dispose();
  }

  void _startStop() {
    if (_stopwatch.isRunning) {
      _stopwatch.stop();
      _timer?.cancel();
    } else {
      _stopwatch.start();
      _timer = Timer.periodic(const Duration(milliseconds: 30), (_) {
        if (mounted) setState(() {});
      });
    }
    setState(() {});
  }

  void _lap() {
    if (!_stopwatch.isRunning) return;
    setState(() {
      _laps.insert(0, '圈 ${_laps.length + 1}  ${StopwatchTool.format(_stopwatch.elapsed)}');
    });
  }

  void _reset() {
    _stopwatch.reset();
    _timer?.cancel();
    setState(() => _laps.clear());
  }

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        const Spacer(flex: 1),
        // 时间显示
        Text(
          StopwatchTool.format(_stopwatch.elapsed),
          style: const TextStyle(fontSize: 56, fontWeight: FontWeight.w300, fontFamily: 'monospace'),
        ),
        const SizedBox(height: 4),
        Text(
          _stopwatch.isRunning ? '计时中…' : (_stopwatch.elapsedMilliseconds > 0 ? '已暂停' : '点击开始计时'),
          style: const TextStyle(fontSize: 14, color: AppColors.neutral400),
        ),
        const Spacer(flex: 1),
        // 按钮行
        Row(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            IconButton(
              icon: const Icon(Icons.flag_outlined),
              onPressed: _lap,
              tooltip: '计圈',
              color: AppColors.brand500,
            ),
            const SizedBox(width: 24),
            SizedBox(
              width: 100,
              child: FilledButton.icon(
                onPressed: _startStop,
                icon: Icon(_stopwatch.isRunning ? Icons.pause : Icons.play_arrow),
                label: Text(_stopwatch.isRunning ? '暂停' : '开始'),
                style: FilledButton.styleFrom(
                  padding: const EdgeInsets.symmetric(vertical: 16),
                  textStyle: const TextStyle(fontSize: 16),
                ),
              ),
            ),
            const SizedBox(width: 24),
            IconButton(
              icon: const Icon(Icons.replay_outlined),
              onPressed: _reset,
              tooltip: '重置',
            ),
          ],
        ),
        const SizedBox(height: 16),
        // 计圈列表
        if (_laps.isNotEmpty)
          Expanded(
            child: ListView.separated(
              padding: const EdgeInsets.symmetric(horizontal: 32),
              itemCount: _laps.length,
              separatorBuilder: (_, __) => const Divider(height: 1),
              itemBuilder: (context, index) {
                return Padding(
                  padding: const EdgeInsets.symmetric(vertical: 6),
                  child: Text(_laps[index], style: const TextStyle(fontSize: 14, fontFamily: 'monospace')),
                );
              },
            ),
          )
        else
          const Spacer(flex: 1),
      ],
    );
  }
}
